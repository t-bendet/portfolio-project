// ci-obligations.md §7 — banned-vocabulary grep over what actually ships.
//
//   node scripts/banned-vocab.ts        (needs web/dist — run after the build)
//
// Two lists, from two specs, with two different scopes.
//
// IDENTIFIERS (tokens.md §1): no shipped selector, custom property, attribute
// value, storage key, comment, or asset name may name the mechanism. Matching
// is whole identifier tokens, not substrings — and the hyphen counts as an
// identifier character, which is what makes `aria-hidden` one token rather than
// a `hidden` hit. `sourceMappingURL` and `sitemap.xml` clear the same way.
//
// MYTHOLOGY (brand.md §3): figure names are *licensed* on real infrastructure —
// scripts, pipelines, services — and banned from site content. So this script
// reads web/dist and must never be pointed at scripts/, deploy/, or workflows;
// a pipeline named for Prometheus is sanctioned, the same word in a template is
// not.
//
// PHRASES (brand.md #6 and #8): "let's connect" and its cousins, and template
// filler. These are prose, so they are matched as text, not as identifiers.
//
// EXEMPT_PHRASES (tokens.md §1, decided 2026-08-07 under SR-24): the two
// incantations. They are the trigger's *payload*, not a name for the mechanism
// — they have to ship as literals to be compared against a keystroke — so they
// are masked out of the content before the identifier scan. The carve-out is
// the exact phrases and nothing wider: `solemnly`, `mischief` and `managed`
// still fail everywhere else in dist, which is what keeps this a carve-out
// rather than a hole. The masked count is reported on every run so it cannot
// grow unnoticed.

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'web/dist';
const EXTENSIONS = ['.html', '.css', '.js', '.xml'];

const IDENTIFIERS = [
  // tokens.md §1
  'jekyll', 'hyde', 'map', 'marauder', 'mischief',
  'solemnly', 'managed', 'secret', 'hidden', 'easter',
  // brand.md §3 — figure names, site content only
  'prometheus', 'daedalus', 'odysseus', 'polytropos',
  'apollo', 'dionysus', 'hermes', 'icarus',
];

// Apostrophes are written both ways in the wild; \s+ so a line break inside the
// phrase does not smuggle it past.
const PHRASES = [
  "let's connect", "let's chat", 'reach out', 'grab a coffee', 'get in touch',
  'passionate about', 'crafting delightful experiences',
];

// brand.md §2. Written out here for the same reason they are written out in
// brand.md itself: this file is not shipped, and the carve-out has to name
// exactly what it exempts or it is not a carve-out.
const EXEMPT_PHRASES = [
  'i solemnly swear that i am up to no good',
  'mischief managed',
];

const identifierRe = new RegExp(
  `(?<![A-Za-z0-9_-])(${IDENTIFIERS.join('|')})(?![A-Za-z0-9_-])`,
  'gi',
);

const phraseRes = PHRASES.map(
  (p) => new RegExp(p.replace(/'/g, "['’]").replace(/ /g, '\\s+'), 'gi'),
);

const exemptRes = EXEMPT_PHRASES.map(
  (p) => new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
);

// Equal-length spaces rather than deletion, so every offset after a masked
// phrase is unchanged and lineOf() still reports the right line.
function maskExempt(content: string): { masked: string; count: number } {
  let masked = content;
  let count = 0;
  for (const re of exemptRes) {
    masked = masked.replace(re, (m) => {
      count++;
      return ' '.repeat(m.length);
    });
  }
  return { masked, count };
}

// The one recorded non-violation (tokens.md §1, ci-obligations.md §7): the
// platform `hidden` attribute and the [hidden] selector Tailwind's preflight
// ships. It is a platform identifier, not a name this project authored.
//
// A new exemption belongs in the spec first. Widening this function is how a
// gate stops meaning anything.
function isPlatformHidden(content: string, index: number): boolean {
  if (content.slice(index - 1, index) === '[') return true; // CSS: [hidden]
  if (!/\s/.test(content.slice(index - 1, index))) return false;
  const after = content.slice(index + 'hidden'.length, index + 'hidden'.length + 1);
  if (!/[\s=>/]/.test(after)) return false;
  // HTML: a bare attribute, i.e. inside a tag — the nearest '<' behind it is
  // nearer than the nearest '>'.
  const before = content.slice(0, index);
  return before.lastIndexOf('<') > before.lastIndexOf('>');
}

function lineOf(content: string, index: number): number {
  return content.slice(0, index).split('\n').length;
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

function main(): void {
  let paths: string[];
  try {
    paths = walk(DIST);
  } catch {
    console.error(`${DIST} not found — run \`pnpm --filter web build\` first.`);
    process.exit(1);
  }

  const errors: string[] = [];
  let exempt = 0;
  let carvedOut = 0;

  // Asset and directory names are in scope (tokens.md §1: "or asset name").
  // Deliberately not masked: a *filename* carrying the incantation would be
  // the mechanism naming itself, which is exactly what §1 bans.
  for (const path of paths) {
    for (const m of relative(DIST, path).matchAll(identifierRe)) {
      errors.push(`${path} — "${m[0]}" in the path itself`);
    }
  }

  const scanned = paths.filter((p) => EXTENSIONS.some((ext) => p.endsWith(ext)));
  for (const file of scanned) {
    const content = readFileSync(file, 'utf8');
    const { masked, count } = maskExempt(content);
    carvedOut += count;

    for (const m of masked.matchAll(identifierRe)) {
      if (m[0].toLowerCase() === 'hidden' && isPlatformHidden(masked, m.index)) {
        exempt++;
        continue;
      }
      errors.push(`${file}:${lineOf(masked, m.index)} — "${m[0]}"`);
    }

    if (!file.endsWith('.html') && !file.endsWith('.xml')) continue;
    for (const re of phraseRes) {
      for (const m of content.matchAll(re)) {
        errors.push(`${file}:${lineOf(content, m.index)} — "${m[0]}"`);
      }
    }
  }

  console.log(
    `${scanned.length} shipped files scanned under ${DIST}/ ` +
      `(${IDENTIFIERS.length} identifiers, ${PHRASES.length} phrases; ` +
      `${exempt} platform \`hidden\` occurrences exempt, ` +
      `${carvedOut} incantation occurrences carved out).`,
  );

  if (errors.length > 0) {
    console.error('\nbanned vocabulary in shipped output:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
}

main();
