// ci-obligations.md §8 — no raw hex.
//
//   node scripts/no-raw-hex.ts
//
// tokens.md §4.4: "No component may reference a raw hex — tokens only."
// §1 gives the reason: a component must be able to render in either temperature
// without knowing which is active, and a literal cannot re-resolve per theme.
//
// Scope is web/src, not web/dist. The rule is about what components author;
// dist carries Tailwind preflight's own hexes, which are not ours to police,
// and an allowlist for them would quietly grow into a place violations hide.
//
// web/src/styles/tokens.css is the one exemption: the registry is where hexes
// live by definition. It is a file allowlist of exactly one, and it should stay
// that way — a second entry means a component kept its literal.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'web/src';
const ALLOWED = ['web/src/styles/tokens.css'];
const EXTENSIONS = ['.astro', '.css', '.ts'];

// 3-, 4-, 6-, or 8-digit runs only, terminated by a non-word character, so
// href="#main" and other fragments do not read as colors. A fragment that is
// genuinely hex-shaped (#abc) would trip this — add a targeted exemption then,
// rather than loosening the pattern.
const HEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-zA-Z_-])/g;

function walk(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(path));
    else if (EXTENSIONS.some((ext) => entry.name.endsWith(ext))) found.push(path);
  }
  return found;
}

function main(): void {
  const files = walk(SRC).filter((f) => !ALLOWED.includes(f));
  const errors: string[] = [];

  for (const file of files) {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      for (const m of line.matchAll(HEX)) {
        errors.push(`${file}:${i + 1} — ${m[0]} (use a token from ${ALLOWED[0]})`);
      }
    });
  }

  console.log(`${files.length} files scanned under ${SRC}/ (${ALLOWED.length} allowlisted).`);

  if (errors.length > 0) {
    console.error('\nraw hex found:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
}

main();
