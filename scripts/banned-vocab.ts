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

const identifierRe = new RegExp(
  `(?<![A-Za-z0-9_-])(${IDENTIFIERS.join('|')})(?![A-Za-z0-9_-])`,
  'gi',
);

const phraseRes = PHRASES.map(
  (p) => new RegExp(p.replace(/'/g, "['’]").replace(/ /g, '\\s+'), 'gi'),
);

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

  // Asset and directory names are in scope (tokens.md §1: "or asset name").
  for (const path of paths) {
    for (const m of relative(DIST, path).matchAll(identifierRe)) {
      errors.push(`${path} — "${m[0]}" in the path itself`);
    }
  }

  const scanned = paths.filter((p) => EXTENSIONS.some((ext) => p.endsWith(ext)));
  for (const file of scanned) {
    const content = readFileSync(file, 'utf8');

    for (const m of content.matchAll(identifierRe)) {
      if (m[0].toLowerCase() === 'hidden' && isPlatformHidden(content, m.index)) {
        exempt++;
        continue;
      }
      errors.push(`${file}:${lineOf(content, m.index)} — "${m[0]}"`);
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
      `${exempt} platform \`hidden\` occurrences exempt).`,
  );

  if (errors.length > 0) {
    console.error('\nbanned vocabulary in shipped output:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
}

main();
