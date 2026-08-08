// ci-obligations.md §10 — the byte half of the `perf` stage, and all of `bundle`.
//
//   node scripts/perf-budgets.ts            # the gate
//   node scripts/perf-budgets.ts --update   # rewrite web/tests/perf/client-js.json
//
// Needs a FIXTURE build. performance-budgets.md §8 item 4 names /writing/[id]/
// and /he/writing/[id]/ among the routes to measure, and both collections are
// empty in the shipping tree — so web/tests/run-perf.sh is what installs the
// fixtures, builds, and calls this. Pointed at a clean dist it fails on the
// "no page emitted" guard rather than passing on absence, which is the whole
// difference between a gate and a decoration.
//
// BUDGETS: parsed out of specs/performance-budgets.md §3/§4.1/§4.1a/§5 rather
// than restated here — the same reason scripts/contrast.ts parses palette.md
// §5. The PR that added this file gave those tables a machine-readable Routes
// column and promoted §4.1's per-file caps out of a sentence; no number moved.
// A regex over prose is a parser that matches wrongly, which is worse than one
// that matches nothing.
//
// UNITS (spec's own note, above §5): KB is 1000 bytes. HTML, CSS and extracted
// script blocks are gzip level 6 — Caddy's `encode gzip` default, so the
// figure models the transfer rather than the best case. woff2 is counted raw:
// already compressed, and Caddy ships it as-is (§7).
//
// The page total counts HTML once. The inline theme block and the five
// @font-face <style> blocks live inside that HTML, so §3 charges the extracted
// block and §5 charges the HTML containing it; adding both to one total counts
// the same ~1.8 KB twice.
//
// The bundle half is web/tests/perf/client-js.json: every client-JS carrier in
// dist, keyed by the base64 SHA-256 of its dist bytes. §8 item 2 asks that a
// new client-JS dependency on a content route be *called out* — a byte gate
// alone cannot do that, because a new 400-byte block lands under every budget
// and says nothing. An inventory makes it a reviewable diff. The key is in CSP
// form because that is exactly the token SR-10's hash-based `script-src` will
// need, and deploy/Caddyfile's comment already says to take it from the dist
// bytes. Storing it in the right shape is free; building the Caddyfile
// cross-check now would be building against a header that does not exist yet.

import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const SPEC = 'specs/performance-budgets.md';
const DIST = 'web/dist';
const INVENTORY = 'web/tests/perf/client-js.json';

const KB = 1000;
const GZIP_LEVEL = 6;

// The nine shipping pages that carry a page weight, plus the translation
// fixture and the three writing ones — /he/ is exempt below and never counted.
// A parser or a build that silently produced fewer must not pass green
// (contrast.ts's MIN_PAIRS, same job).
const MIN_PAGES = 13;

// §8 item 4. Two of these render nowhere without the fixtures, which is the
// point of the guard: absence is a failure, not a pass.
const REQUIRED_ROUTES = ['/', '/writing/', '/writing/[id]/', '/he/writing/[id]/'];

// Not a page. astro.config.mjs's `redirects` emits /he/ as a meta-refresh stub
// with no stylesheet, font or script, so no §5 route type describes it and no
// §3 route total applies. Named, with its reason, rather than pattern-matched
// away — an exemption that can grow silently is a hole.
const EXEMPT_ROUTES = new Map([
  ['/he/', 'meta-refresh redirect stub (astro.config.mjs redirects; routes/sitemap.md §1)'],
]);

// §3: third-party budget is 0, hard, permanent. Absolute hrefs on these rels
// are the site describing itself to crawlers, not a subresource it fetches —
// astro.config.mjs's `site` is what makes them absolute. Everything else with
// an external origin fails, including preconnect and dns-prefetch, which are
// third-party by definition.
const SELF_DESCRIBING_RELS = new Set(['canonical', 'alternate']);

// --- measurement primitives -------------------------------------------------

function gz(content: string | Buffer): number {
  return gzipSync(content, { level: GZIP_LEVEL }).length;
}

function cspHash(content: string): string {
  return `sha256-${createHash('sha256').update(content, 'utf8').digest('base64')}`;
}

function kb(bytes: number): string {
  return (bytes / KB).toFixed(1);
}

function walk(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(path));
    else found.push(path);
  }
  return found;
}

// --- the spec ---------------------------------------------------------------

// The rows of the first markdown table under `heading`, stopping at the end of
// that table rather than at the end of the document — several sections here
// have three columns, so contrast.ts's "keep going and filter by cell count"
// would silently splice two tables together.
function specTable(md: string, heading: string, cols: number): string[][] {
  const start = md.indexOf(heading);
  if (start === -1) throw new Error(`${SPEC}: no "${heading}" section`);
  const rows: string[][] = [];
  let started = false;
  for (const line of md.slice(start).split('\n').slice(1)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) {
      if (started) break;
      continue;
    }
    started = true;
    const cells = trimmed.slice(1, -1).split('|').map((c) => c.trim());
    if (cells.length !== cols) {
      throw new Error(`${SPEC}: "${heading}" row has ${cells.length} cells, expected ${cols}`);
    }
    if (cells[0].startsWith('---') || /^-+$/.test(cells[1])) continue;
    rows.push(cells);
  }
  if (rows.length === 0) throw new Error(`${SPEC}: no table under "${heading}"`);
  return rows.slice(1); // the header row
}

const BUDGET_RE = /\*\*≤\s*([\d.]+)\s*KB\*\*/;

function budgetBytes(cell: string, where: string): number {
  const m = cell.match(BUDGET_RE);
  if (!m) throw new Error(`${SPEC}: ${where} — no "**≤ N KB**" in "${cell}"`);
  return Number.parseFloat(m[1]) * KB;
}

function routePatterns(cell: string): string[] {
  return [...cell.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
}

// `/writing/[id]/` matches one path segment, and only one: a nested id would be
// a different route shape and should not quietly borrow this budget.
function routeMatcher(pattern: string): RegExp {
  const source = pattern
    .split('[id]')
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('[^/]+');
  return new RegExp(`^${source}$`);
}

interface RouteBudget {
  label: string;
  patterns: RegExp[];
  raw: string[];
  bytes: number;
}

interface Budgets {
  scriptRows: Map<string, number>;
  routeTotals: RouteBudget[];
  pageWeights: RouteBudget[];
  fontCritical: Map<string, number>;
  fontPerFile: Map<string, number>;
}

function readBudgets(md: string): Budgets {
  const scriptRows = new Map<string, number>();
  const routeTotals: RouteBudget[] = [];
  let inTotals = false;
  for (const [script, where, budget] of specTable(md, '## 3. JavaScript budgets', 3)) {
    if (script.includes('Route totals')) inTotals = true;
    if (!inTotals) {
      scriptRows.set(script, budgetBytes(budget, `§3 "${script}"`));
      continue;
    }
    const raw = routePatterns(where);
    if (raw.length === 0) throw new Error(`${SPEC}: §3 route total "${where}" names no route`);
    routeTotals.push({
      label: where,
      raw,
      patterns: raw.map(routeMatcher),
      bytes: budgetBytes(budget, `§3 route total "${where}"`),
    });
  }
  if (scriptRows.size === 0 || routeTotals.length === 0) {
    throw new Error(`${SPEC}: §3 parsed ${scriptRows.size} script rows, ${routeTotals.length} totals`);
  }

  const pageWeights = specTable(md, '## 5. Page weight totals', 3).map(([type, where, budget]) => {
    const raw = routePatterns(where);
    if (raw.length === 0) throw new Error(`${SPEC}: §5 row "${type}" names no route`);
    return { label: type, raw, patterns: raw.map(routeMatcher), bytes: budgetBytes(budget, `§5 "${type}"`) };
  });

  const fontCritical = new Map<string, number>();
  for (const [locale, , budget] of specTable(md, '### 4.1 Critical path', 3)) {
    const name = routePatterns(locale)[0];
    if (!name) throw new Error(`${SPEC}: §4.1 row "${locale}" names no locale`);
    fontCritical.set(name, budgetBytes(budget, `§4.1 "${locale}"`));
  }

  const fontPerFile = new Map<string, number>();
  for (const [family, , budget] of specTable(md, '#### 4.1a Per-file caps', 3)) {
    const name = routePatterns(family)[0];
    if (!name) throw new Error(`${SPEC}: §4.1a row "${family}" names no family`);
    fontPerFile.set(name, budgetBytes(budget, `§4.1a "${family}"`));
  }

  return { scriptRows, routeTotals, pageWeights, fontCritical, fontPerFile };
}

// --- the built site ---------------------------------------------------------

// Inline only: the lookahead is what keeps a `src=` script out of this list and
// in the asset list, where its bytes are on disk rather than in the page.
const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g;
const SRC_SCRIPT = /<script[^>]*\ssrc=["']([^"']+)["'][^>]*>/g;
const STYLESHEET = /<link\b(?=[^>]*\brel=["']stylesheet["'])[^>]*>/g;
// Lookaheads, not a fixed attribute order: the <Font> component emits
// rel/href/as/type and Base.astro's hand-written Heebo preload emits
// rel/as/type/href. A fixed-order regex matches one and silently misses the
// other, which is a font that stops being counted the day it starts being
// preloaded.
const FONT_PRELOAD = /<link\b(?=[^>]*\brel=["']preload["'])(?=[^>]*\bas=["']font["'])[^>]*>/g;
const ICON = /<link\b(?=[^>]*\brel=["']icon["'])[^>]*>/g;
const HREF = /\bhref=["']([^"']+)["']/;
const FONT_FACE = /@font-face\s*\{([^}]*)\}/g;
const TAG = /<(script|link|img|source|iframe|video|audio|embed|object|track|use)\b([^>]*)>/gi;
const URL_ATTR = /\b(src|href|srcset|data|poster)=["']([^"']+)["']/g;

interface Carrier {
  kind: 'inline' | 'asset';
  csp: string;
  rawBytes: number;
  gzipBytes: number;
  href: string | null;
}

interface Page {
  file: string;
  route: string;
  lang: string;
  htmlGz: number;
  cssGz: number;
  fonts: { family: string; file: string; bytes: number }[];
  iconBytes: number;
  carriers: Carrier[];
  external: string[];
}

function routeOf(file: string): string {
  const rel = relative(DIST, file).split('\\').join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel.slice(0, -'.html'.length)}`; // 404.html — Astro's one flat page
}

function localAsset(href: string): string | null {
  if (!href.startsWith('/')) return null;
  return join(DIST, href.split('?')[0]);
}

// family -> file, from every @font-face this page can see: the inline <style>
// blocks Astro's font provider emits, and the bundled stylesheet where the two
// hand-declared Hebrew faces live. Hashed filenames carry no family name, so
// this is the only way to charge a file to §4.1a's cap without a lookup table
// that would drift.
function fontFamilies(sources: string[]): Map<string, string> {
  const byFile = new Map<string, string>();
  for (const css of sources) {
    for (const [, body] of css.matchAll(FONT_FACE)) {
      const family = body.match(/font-family\s*:\s*([^;]+)/);
      const url = body.match(/url\(\s*["']?([^"')]+)["']?\s*\)/);
      if (!family || !url) continue;
      // Astro's provider appends a 16-hex build id to the family name so two
      // builds cannot collide; §4.1a names the family, not the build.
      const name = family[1].trim().replace(/^["']|["']$/g, '').replace(/-[0-9a-f]{16}$/, '');
      byFile.set(url[1].split('?')[0], name);
    }
  }
  return byFile;
}

function readPage(file: string, errors: string[]): Page {
  const html = readFileSync(file, 'utf8');
  const route = routeOf(file);
  const lang = html.match(/<html[^>]*\blang=["']([^"']+)["']/)?.[1] ?? 'en';

  const carriers: Carrier[] = [];
  for (const [, body] of html.matchAll(INLINE_SCRIPT)) {
    if (body.trim() === '') continue;
    carriers.push({
      kind: 'inline',
      csp: cspHash(body),
      rawBytes: Buffer.byteLength(body, 'utf8'),
      gzipBytes: gz(body),
      href: null,
    });
  }

  let cssGz = 0;
  const styles: string[] = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  for (const tag of html.matchAll(STYLESHEET)) {
    const href = tag[0].match(HREF)?.[1];
    const path = href ? localAsset(href) : null;
    if (!path) continue;
    const css = readFileSync(path, 'utf8');
    cssGz += gz(css);
    styles.push(css);
  }

  for (const tag of html.matchAll(SRC_SCRIPT)) {
    const path = localAsset(tag[1]);
    if (!path) continue; // an external src is caught by the third-party scan
    const js = readFileSync(path);
    carriers.push({
      kind: 'asset',
      csp: cspHash(js.toString('utf8')),
      rawBytes: js.length,
      gzipBytes: gz(js),
      href: tag[1],
    });
  }

  const families = fontFamilies(styles);
  const fonts: Page['fonts'] = [];
  for (const tag of html.matchAll(FONT_PRELOAD)) {
    const href = tag[0].match(HREF)?.[1];
    const path = href ? localAsset(href) : null;
    if (!href || !path) {
      errors.push(`${route} — preloaded font "${href ?? tag[0]}" is not a local asset`);
      continue;
    }
    let bytes: number;
    try {
      bytes = readFileSync(path).length;
    } catch {
      errors.push(`${route} — preloads ${href}, which is not in ${DIST}`);
      continue;
    }
    const family = families.get(href);
    if (!family) {
      errors.push(`${route} — preloads ${href}, which no @font-face on the page declares`);
      continue;
    }
    fonts.push({ family, file: href, bytes });
  }

  let iconBytes = 0;
  for (const tag of html.matchAll(ICON)) {
    const href = tag[0].match(HREF)?.[1];
    const path = href ? localAsset(href) : null;
    if (!path) continue;
    const icon = readFileSync(path);
    iconBytes += path.endsWith('.svg') ? gz(icon) : icon.length;
  }

  const external: string[] = [];
  for (const [tag, name, attrs] of html.matchAll(TAG)) {
    const rel = attrs.match(/\brel=["']([^"']+)["']/)?.[1]?.toLowerCase();
    if (rel && /\b(preconnect|dns-prefetch)\b/.test(rel)) {
      external.push(`<${name} rel="${rel}"> — preconnect and dns-prefetch are third-party by definition`);
      continue;
    }
    if (rel && SELF_DESCRIBING_RELS.has(rel)) continue;
    for (const [, , value] of attrs.matchAll(URL_ATTR)) {
      if (/^(https?:)?\/\//i.test(value.trim())) external.push(`${tag.slice(0, 90)}`);
    }
  }

  return { file, route, lang, htmlGz: gz(html), cssGz, fonts, iconBytes, carriers, external };
}

// --- the inventory ----------------------------------------------------------

interface Block {
  row: string;
  kind: 'inline' | 'asset';
  routes: string;
  source: string;
  csp: string;
  rawBytes: number;
  gzipBytes: number;
}

const INVENTORY_COMMENT =
  'ci-obligations.md §10, the bundle stage. Every client-JS carrier in web/dist — inline ' +
  'blocks and emitted .js assets — with the specs/performance-budgets.md §3 row its bytes are ' +
  'charged to. Regenerate with `node scripts/perf-budgets.ts --update` and READ THE DIFF: a new ' +
  'entry here is §8 item 2\'s "called out". `csp` is the base64 SHA-256 of the block\'s dist ' +
  'bytes, which is exactly the token deploy/Caddyfile\'s SR-10 script-src will need.';

function readInventory(): Block[] {
  const parsed = JSON.parse(readFileSync(INVENTORY, 'utf8'));
  if (!Array.isArray(parsed.blocks)) throw new Error(`${INVENTORY}: no "blocks" array`);
  return parsed.blocks;
}

function writeInventory(blocks: Block[]): void {
  const body = { $comment: INVENTORY_COMMENT, blocks };
  writeFileSync(INVENTORY, `${JSON.stringify(body, null, 2)}\n`);
}

// --- the gate ---------------------------------------------------------------

function main(): void {
  const update = process.argv.includes('--update');
  const md = readFileSync(SPEC, 'utf8');
  const budgets = readBudgets(md);

  let files: string[];
  try {
    files = walk(DIST);
  } catch {
    console.error(`${DIST} not found — run web/tests/run-perf.sh, which builds it with the fixtures.`);
    process.exit(1);
  }

  const errors: string[] = [];
  const pages = files
    .filter((f) => f.endsWith('.html'))
    .sort()
    .map((f) => readPage(f, errors))
    .filter((p) => !EXEMPT_ROUTES.has(p.route));

  // --- §5 page weights, and the "claimed by exactly one row" guard ---
  const rows: string[][] = [];
  for (const page of pages) {
    const matched = budgets.pageWeights.filter((b) => b.patterns.some((re) => re.test(page.route)));
    const total = page.htmlGz + page.cssGz + page.iconBytes +
      page.fonts.reduce((sum, f) => sum + f.bytes, 0);
    const fontBytes = page.fonts.reduce((sum, f) => sum + f.bytes, 0);
    const js = page.carriers.reduce((sum, c) => sum + c.gzipBytes, 0);

    if (matched.length === 0) {
      errors.push(
        `${page.route} — no §5 row claims this page; give it a Routes entry in §5 ` +
          `or add it to EXEMPT_ROUTES with a reason`,
      );
    } else if (matched.length > 1) {
      errors.push(
        `${page.route} — claimed by ${matched.length} §5 rows (${matched.map((m) => m.label).join(', ')}); ` +
          `a page with two budgets has none`,
      );
    } else if (total > matched[0].bytes) {
      errors.push(
        `${page.route} — ${kb(total)} KB exceeds §5's ${kb(matched[0].bytes)} KB ` +
          `(html ${kb(page.htmlGz)} + css ${kb(page.cssGz)} + fonts ${kb(fontBytes)} + ` +
          `icon ${kb(page.iconBytes)}, gzip-${GZIP_LEVEL}, KB=${KB})`,
      );
    }

    const jsBudget = budgets.routeTotals.find((b) => b.patterns.some((re) => re.test(page.route)));
    if (!jsBudget) {
      errors.push(`${page.route} — no §3 route total claims this page`);
    } else if (js > jsBudget.bytes) {
      errors.push(
        `${page.route} — client JS ${kb(js)} KB exceeds §3's ${kb(jsBudget.bytes)} KB route total ` +
          `(${page.carriers.length} block(s))`,
      );
    }

    for (const ref of page.external) {
      errors.push(`${page.route} — external subresource ${ref} (§3: third-party budget is 0, hard, permanent)`);
    }

    rows.push([
      page.route,
      kb(page.htmlGz),
      kb(page.cssGz),
      kb(fontBytes),
      kb(total),
      matched.length === 1 ? kb(matched[0].bytes) : '—',
      (js / KB).toFixed(2),
      jsBudget ? kb(jsBudget.bytes) : '—',
    ]);
  }

  // --- §4.1 critical path, per locale, and §4.1a per file ---
  const criticalByLocale = new Map<string, number>();
  for (const page of pages) {
    const total = page.fonts.reduce((sum, f) => sum + f.bytes, 0);
    const seen = criticalByLocale.get(page.lang);
    if (seen !== undefined && seen !== total) {
      errors.push(
        `${page.lang} pages disagree on the critical path: ${kb(seen)} KB and ${kb(total)} KB ` +
          `(${page.route}) — §4.1 budgets one number per locale`,
      );
    }
    criticalByLocale.set(page.lang, total);
    for (const font of page.fonts) {
      const cap = budgets.fontPerFile.get(font.family);
      if (cap === undefined) {
        errors.push(`${font.family} is preloaded on ${page.route} but has no §4.1a per-file cap`);
      } else if (font.bytes > cap) {
        errors.push(`${font.family} — ${kb(font.bytes)} KB exceeds §4.1a's ${kb(cap)} KB per-file cap (${font.file})`);
      }
    }
  }
  for (const [locale, total] of criticalByLocale) {
    const budget = budgets.fontCritical.get(locale);
    if (budget === undefined) {
      errors.push(`${locale} pages are built but §4.1 has no critical-path budget for that locale`);
    } else if (total > budget) {
      errors.push(`${locale} critical path — ${kb(total)} KB exceeds §4.1's ${kb(budget)} KB`);
    }
  }

  // --- §8 item 4: the routes that must have been measured ---
  for (const required of REQUIRED_ROUTES) {
    const re = routeMatcher(required);
    if (!pages.some((p) => re.test(p.route))) {
      errors.push(
        `${required} — §8 item 4 requires this route measured; no page emitted ` +
          `(are the fixtures installed? run web/tests/run-perf.sh, not node directly)`,
      );
    }
  }
  if (pages.length < MIN_PAGES) {
    errors.push(`only ${pages.length} pages under ${DIST} (expected ${MIN_PAGES}+)`);
  }

  // --- the bundle stage: dist against the inventory ---
  const measured = new Map<string, Carrier & { routes: string[] }>();
  for (const page of pages) {
    for (const carrier of page.carriers) {
      const seen = measured.get(carrier.csp);
      if (seen) seen.routes.push(page.route);
      else measured.set(carrier.csp, { ...carrier, routes: [page.route] });
    }
  }

  if (update) {
    const existing = new Map(readInventory().map((b) => [b.csp, b]));
    const blocks: Block[] = [...measured.values()].map((c) => {
      const was = existing.get(c.csp);
      return {
        row: was?.row ?? 'TODO — name the specs/performance-budgets.md §3 row this is charged to',
        kind: c.kind,
        routes: c.routes.length === pages.length ? 'all' : c.routes.join(', '),
        source: was?.source ?? c.href ?? 'TODO — the file this block is authored in',
        csp: c.csp,
        rawBytes: c.rawBytes,
        gzipBytes: c.gzipBytes,
      };
    });
    writeInventory(blocks);
    console.log(`${INVENTORY} rewritten with ${blocks.length} block(s). Read the diff.`);
    return;
  }

  const inventory = readInventory();
  const byHash = new Map(inventory.map((b) => [b.csp, b]));
  for (const [csp, carrier] of measured) {
    const block = byHash.get(csp);
    if (!block) {
      errors.push(
        `unaccounted client-JS ${carrier.kind} ${csp} on ${carrier.routes[0]} ` +
          `(${(carrier.gzipBytes / KB).toFixed(2)} KB gz, ${carrier.routes.length} route(s)) — ` +
          `not in ${INVENTORY}; run --update and review the diff`,
      );
      continue;
    }
    if (block.routes === 'all' && carrier.routes.length !== pages.length) {
      errors.push(
        `${block.row} — ${INVENTORY} says "all" but the block is on ${carrier.routes.length} ` +
          `of ${pages.length} pages`,
      );
    }
  }
  for (const block of inventory) {
    if (!measured.has(block.csp)) {
      errors.push(
        `${INVENTORY} has ${block.csp} (${block.row}) but nothing in ${DIST} matches it — ` +
          `the block changed or went away; run --update and review the diff`,
      );
    }
    if (!budgets.scriptRows.has(block.row)) {
      errors.push(`${INVENTORY}: "${block.row}" matches no §3 Script row`);
    }
  }

  // --- §3 per-script rows ---
  const unbuilt: string[] = [];
  for (const [row, budget] of budgets.scriptRows) {
    const blocks = inventory.filter((b) => b.row === row);
    if (blocks.length === 0) {
      unbuilt.push(row);
      continue;
    }
    const bytes = blocks.reduce((sum, b) => sum + (measured.get(b.csp)?.gzipBytes ?? 0), 0);
    if (bytes === 0) {
      errors.push(`${row} — has an inventory entry but measures 0 bytes; a vanished feature is not "under budget"`);
    } else if (bytes > budget) {
      const raw = blocks.reduce((sum, b) => sum + (measured.get(b.csp)?.rawBytes ?? 0), 0);
      errors.push(`${row} — ${(bytes / KB).toFixed(2)} KB gz exceeds §3's ${kb(budget)} KB (raw ${raw} B)`);
    }
    for (const b of blocks) {
      const now = measured.get(b.csp);
      if (now && now.gzipBytes !== b.gzipBytes) {
        console.log(`  ${row}: ${b.gzipBytes} → ${now.gzipBytes} B gz (record it with --update)`);
      }
    }
  }

  // --- the run summary, printed green or red ---
  const header = ['Route', 'HTML', 'CSS', 'Fonts', 'Total', '§5', 'JS', '§3'];
  console.log(`| ${header.join(' | ')} |`);
  console.log(`|${header.map(() => '---').join('|')}|`);
  for (const row of rows) console.log(`| ${row.join(' | ')} |`);

  const assets = files.filter((f) => f.endsWith('.js')).length;
  console.log(
    `\n${pages.length} pages measured against §3/§4.1/§4.1a/§5 (gzip-${GZIP_LEVEL}, KB=${KB}); ` +
      `${EXEMPT_ROUTES.size} route exempt.`,
  );
  console.log(
    `${measured.size} client-JS block(s), ` +
      `${([...measured.values()].reduce((s, c) => s + c.gzipBytes, 0) / KB).toFixed(2)} KB gz total; ` +
      `${assets} emitted .js asset(s).`,
  );
  if (unbuilt.length > 0) {
    console.log(`${unbuilt.length} of ${budgets.scriptRows.size} §3 script rows unbuilt (0 KB): ${unbuilt.join('; ')}.`);
  }
  console.log(
    [...criticalByLocale]
      .map(([l, t]) => `${l} critical path ${kb(t)}/${kb(budgets.fontCritical.get(l) ?? 0)} KB`)
      .join(' · ') + `. 0 external subresources permitted; ${pages.reduce((s, p) => s + p.external.length, 0)} found.`,
  );

  if (errors.length > 0) {
    console.error('\nperformance budgets failed:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
}

main();
