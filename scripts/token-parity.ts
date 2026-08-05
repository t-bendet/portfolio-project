// ci-obligations.md §6 — token parity between the theme blocks.
//
//   node scripts/token-parity.ts
//
// tokens.md §4.1: "parse both blocks, diff the key sets — empty diff required."
// The reason is §2's total-coverage rule: the 600ms theme transition must never
// half-apply, so a token present in one block only is a build error, not a
// style choice.
//
// Two families are :root-only by design and are excluded from the diff:
//
//   --radius-*      theme-invariant structure (tokens.md §3.6)
//   --astro-code-*  the Shiki bridge — aliases that resolve through palette
//                   tokens, so both temperatures are already covered
//
// The exclusion runs the other way too. §3.6: "A theme block that touches a
// --radius-* or --space-* token is a spec violation." Declaring one in the warm
// block fails here rather than quietly making structure themeable.

import { readFileSync } from 'node:fs';

const TOKENS = 'web/src/styles/tokens.css';
const ROOT_ONLY = [/^--radius-/, /^--astro-code-/];
const NEVER_IN_THEME = [/^--radius-/, /^--space-/];

function readBlock(css: string, selector: string): Set<string> {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`${TOKENS}: no "${selector}" block`);
  const open = css.indexOf('{', start);
  const close = css.indexOf('\n}', open);
  if (open === -1 || close === -1) {
    throw new Error(`${TOKENS}: unterminated "${selector}" block`);
  }
  const names = new Set<string>();
  for (const line of css.slice(open, close).split('\n')) {
    const m = line.match(/^\s*(--[a-z0-9-]+)\s*:/);
    if (m) names.add(m[1]);
  }
  if (names.size === 0) throw new Error(`${TOKENS}: "${selector}" declares no tokens`);
  return names;
}

function main(): void {
  const css = readFileSync(TOKENS, 'utf8');
  const root = readBlock(css, ':root');
  const warm = readBlock(css, "[data-theme='warm']");

  const themed = [...root].filter((t) => !ROOT_ONLY.some((re) => re.test(t)));
  const errors: string[] = [];

  for (const name of themed) {
    if (!warm.has(name)) errors.push(`${name} is on :root but missing from the warm block`);
  }
  for (const name of warm) {
    if (!root.has(name)) errors.push(`${name} is in the warm block but missing from :root`);
    if (NEVER_IN_THEME.some((re) => re.test(name))) {
      errors.push(`${name} is a structure token and must not be re-declared in a theme block`);
    }
  }

  console.log(
    `${themed.length} themed tokens on :root, ${warm.size} in the warm block ` +
      `(${root.size - themed.length} :root-only by design).`,
  );

  if (errors.length > 0) {
    console.error('\ntoken parity failed:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
}

main();
