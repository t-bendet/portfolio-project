// ci-obligations.md §5 — the contrast gate.
//
//   node scripts/contrast.ts              # the gate: every pair in palette.md §5
//   node scripts/contrast.ts '#fg' '#bg'  # ad-hoc, for design work
//
// Contrast is arithmetic; never spend model tokens computing it. The WCAG math
// below is the 2020 workshop's scripts/contrast.ts (git: de4aa84^), unchanged.
// What is new is where the pairs come from and how the result is printed.
//
// PAIRS: parsed out of specs/design/palette.md §5.1/§5.2 rather than a
// checked-in pairs file. That file is normative ("computed from the exact hexes
// in this file"), so reading it directly means there is no third copy of every
// hex to drift. Each named token is then cross-checked against
// web/src/styles/tokens.css, so a nudge applied to one file and not the other
// fails here instead of shipping.
//
// PRECISION: palette.md §4/§10 both insist the comparison run at full
// precision. The thinnest margin in the system is exactly 4.50 (warm
// --code-comment on --code-bg), so a two-decimal round can pass a failing pair.
// Nothing rounds before a comparison, and the report prints four decimals —
// the old script printed two, which is the report the spec forbids.

import { readFileSync } from 'node:fs';

const PALETTE = 'specs/design/palette.md';
const TOKENS = 'web/src/styles/tokens.css';

// 36 dark + 37 warm. A parser that silently matches nothing must not pass green.
const MIN_PAIRS = 70;

// The stated Ratio column is 2dp, so it can sit half a unit in the last place
// away from the computed value and still be the same number.
const RATIO_TOLERANCE = 0.005;

interface Pair {
  theme: string;
  fg: string;
  bg: string;
  fgHex: string;
  bgHex: string;
  threshold: number;
  stated: number;
  ratio: number;
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace(/^#/, '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`invalid hex color: "${hex}"`);
  }
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

// WCAG relative luminance
function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg: string, bg: string): number {
  const l1 = luminance(parseHex(fg));
  const l2 = luminance(parseHex(bg));
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

// --- tokens.css -------------------------------------------------------------

// Declarations of one block, by selector. Values stay raw: var() chains are
// followed at lookup time so the cascade (warm block over :root) is honoured.
function readBlock(css: string, selector: string): Map<string, string> {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`${TOKENS}: no "${selector}" block`);
  const open = css.indexOf('{', start);
  const close = css.indexOf('\n}', open);
  if (open === -1 || close === -1) {
    throw new Error(`${TOKENS}: unterminated "${selector}" block`);
  }
  const decls = new Map<string, string>();
  for (const line of css.slice(open, close).split('\n')) {
    const m = line.match(/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/);
    if (m) decls.set(m[1], m[2].trim());
  }
  return decls;
}

function resolveToken(
  name: string,
  block: Map<string, string>,
  root: Map<string, string>,
  depth = 0,
): string | null {
  if (depth > 8) return null;
  const value = block.get(name) ?? root.get(name);
  if (value === undefined) return null;
  const alias = value.match(/^var\((--[a-z0-9-]+)\)$/);
  if (alias) return resolveToken(alias[1], block, root, depth + 1);
  return /^#[0-9a-fA-F]{3,8}$/.test(value) ? value.toLowerCase() : null;
}

// --- palette.md §5 ----------------------------------------------------------

interface Cell {
  // The token this cell names, if any. Bare-hex cells (the four warm callout
  // box bodies) have none, and are skipped by the tokens.css cross-check
  // because the registry has no name for them.
  token: string | null;
  alias: string | null;
  hex: string | null;
  label: string;
}

function parseCell(cell: string): Cell {
  // `--focus` (= `--accent-2`) — the first backticked token names the cell, a
  // second one is the alias it resolves through.
  const tokens = [...cell.matchAll(/`(--[a-z0-9-]+)`/g)].map((m) => m[1]);
  const hex = cell.match(/#([0-9a-fA-F]{6})\b/);
  return {
    token: tokens[0] ?? null,
    alias: tokens[1] ?? null,
    hex: hex ? `#${hex[1].toLowerCase()}` : null,
    label: cell.replace(/`/g, '').replace(/\s+/g, ' ').trim(),
  };
}

// The table rows of one §5 subsection. The trailing "Informative (non-text…)"
// paragraph sits outside the table, which is how borders and the four callout
// border colors stay excluded — structurally, not by an allowlist here.
function sectionRows(md: string, heading: string): string[][] {
  const start = md.indexOf(heading);
  if (start === -1) throw new Error(`${PALETTE}: no "${heading}" section`);
  const rows: string[][] = [];
  for (const line of md.slice(start).split('\n').slice(1)) {
    const trimmed = line.trim();
    if (trimmed.startsWith('Informative')) break;
    if (!trimmed.startsWith('|')) continue;
    const cells = trimmed.slice(1, -1).split('|').map((c) => c.trim());
    if (cells.length !== 4) continue;
    if (cells[0] === 'Foreground' || cells[0].startsWith('---')) continue;
    rows.push(cells);
  }
  if (rows.length === 0) throw new Error(`${PALETTE}: no rows under "${heading}"`);
  return rows;
}

function collectPairs(
  md: string,
  heading: string,
  theme: string,
  block: Map<string, string>,
  root: Map<string, string>,
  errors: string[],
): Pair[] {
  const rows = sectionRows(md, heading);

  // Two passes: a hex is stated at a token's first mention and elided after,
  // but the mentions are not in dependency order — dark row 23 cites
  // `--code-bg` ten rows before the row that states its value.
  // Aliases carry forward the same way: `--focus` is written "(= `--accent-2`)"
  // at its first row and bare at every row after.
  const hexes = new Map<string, string>();
  const aliases = new Map<string, string>();
  for (const row of rows) {
    for (const raw of [row[0], row[1]]) {
      const cell = parseCell(raw);
      if (!cell.token) continue;
      if (cell.alias) aliases.set(cell.token, cell.alias);
      if (!cell.hex) continue;
      const seen = hexes.get(cell.token);
      if (seen && seen !== cell.hex) {
        errors.push(`${theme}: ${cell.token} stated as both ${seen} and ${cell.hex}`);
      }
      hexes.set(cell.token, cell.hex);
    }
  }

  const resolve = (cell: Cell, where: string): string | null => {
    const alias = cell.alias ?? (cell.token ? aliases.get(cell.token) : null);
    const stated = cell.hex ?? (cell.token ? hexes.get(cell.token) : null) ??
      (alias ? hexes.get(alias) : null) ?? null;
    if (!stated) {
      errors.push(`${theme}: ${where} "${cell.label}" — no hex anywhere in §5`);
      return null;
    }
    if (cell.token) {
      const registry = resolveToken(cell.token, block, root);
      if (registry === null) {
        errors.push(`${theme}: ${cell.token} is in ${PALETTE} but not resolvable in ${TOKENS}`);
      } else if (registry !== stated) {
        errors.push(
          `${theme}: ${cell.token} is ${stated} in ${PALETTE} but ${registry} in ${TOKENS}`,
        );
      }
    }
    return stated;
  };

  const pairs: Pair[] = [];
  for (const row of rows) {
    const fg = parseCell(row[0]);
    const bg = parseCell(row[1]);
    const fgHex = resolve(fg, 'foreground');
    const bgHex = resolve(bg, 'background');
    if (!fgHex || !bgHex) continue;
    pairs.push({
      theme,
      fg: fg.label,
      bg: bg.label,
      fgHex,
      bgHex,
      // §5: 4.5:1 normal text, 3:1 UI indicators. The Result cell is where the
      // spec records which of the two a row claims.
      threshold: row[3].includes('3:1') ? 3 : 4.5,
      stated: Number.parseFloat(row[2]),
      ratio: contrast(fgHex, bgHex),
    });
  }
  return pairs;
}

// --- gate -------------------------------------------------------------------

function gate(): void {
  const md = readFileSync(PALETTE, 'utf8');
  const css = readFileSync(TOKENS, 'utf8');
  const root = readBlock(css, ':root');
  const warm = readBlock(css, "[data-theme='warm']");

  const errors: string[] = [];
  const pairs = [
    ...collectPairs(md, '### 5.1 Dark theme', 'dark', root, root, errors),
    ...collectPairs(md, '### 5.2 Warm theme', 'warm', warm, root, errors),
  ];

  console.log('| Theme | Foreground | Background | Ratio | Min | Result |');
  console.log('|---|---|---|---|---|---|');
  for (const p of pairs) {
    const ok = p.ratio >= p.threshold;
    if (!ok) {
      errors.push(
        `${p.theme}: ${p.fg} on ${p.bg} (${p.fgHex} on ${p.bgHex}) is ` +
          `${p.ratio.toFixed(4)}, below ${p.threshold}`,
      );
    }
    if (Number.isFinite(p.stated) && Math.abs(p.ratio - p.stated) > RATIO_TOLERANCE) {
      errors.push(
        `${p.theme}: ${p.fg} on ${p.bg} computes ${p.ratio.toFixed(4)} but ` +
          `${PALETTE} states ${p.stated.toFixed(2)}`,
      );
    }
    console.log(
      `| ${p.theme} | ${p.fg} | ${p.bg} | ${p.ratio.toFixed(4)} | ` +
        `${p.threshold.toFixed(1)} | ${ok ? 'pass' : 'FAIL'} |`,
    );
  }

  console.log(`\n${pairs.length} pairs measured at full precision.`);
  if (pairs.length < MIN_PAIRS) {
    errors.push(`only ${pairs.length} pairs parsed from ${PALETTE} §5 (expected ${MIN_PAIRS}+)`);
  }

  if (errors.length > 0) {
    console.error('\ncontrast gate failed:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
}

function main(): void {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    gate();
    return;
  }
  if (args.length < 2) {
    console.error("usage: node scripts/contrast.ts ['#fg' '#bg']");
    process.exit(1);
  }
  const ratio = contrast(args[0], args[1]);
  console.log(
    `${args[0]} on ${args[1]}: ${ratio.toFixed(4)} ` +
      `(AA ${ratio >= 4.5 ? 'pass' : 'FAIL'}, UI 3:1 ${ratio >= 3 ? 'pass' : 'FAIL'})`,
  );
}

main();
