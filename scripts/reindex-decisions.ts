// Regenerates docs/decisions/INDEX.md from ADR frontmatter.
// Deterministic: on INDEX.md merge conflicts, rerun this — never resolve by hand.
// Usage: node scripts/reindex-decisions.ts

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter } from './lib/frontmatter.ts';

const DECISIONS_DIR = 'docs/decisions';
const FILENAME_RE = /^(\d{4})-[a-z0-9-]+\.md$/;

interface Row {
  id: string;
  title: string;
  status: string;
  file: string;
  note: string;
}

function main(): void {
  const rows: Row[] = [];

  for (const file of readdirSync(DECISIONS_DIR).sort()) {
    if (!FILENAME_RE.test(file)) continue;
    const raw = readFileSync(join(DECISIONS_DIR, file), 'utf8');
    const { frontmatter } = parseFrontmatter(raw);
    const note =
      frontmatter['status'] === 'reopened'
        ? `reopened by ${frontmatter['reopened-by'] ?? '?'}`
        : frontmatter['status'] === 'superseded'
          ? `superseded by ${frontmatter['superseded-by'] ?? '?'}`
          : '';
    rows.push({
      id: frontmatter['id'] ?? '????',
      title: frontmatter['title'] ?? '(untitled)',
      status: frontmatter['status'] ?? '(none)',
      file,
      note,
    });
  }

  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.status] = (counts[r.status] ?? 0) + 1;
  const summary = Object.entries(counts)
    .sort()
    .map(([s, n]) => `${s}: ${n}`)
    .join(' · ');

  const lines: string[] = [
    '# Decision Index',
    '',
    '**GENERATED FILE — do not hand-edit.** Regenerate with',
    '`node scripts/reindex-decisions.ts`. On merge conflict: regenerate.',
    '',
    `Summary: ${summary || 'no ADRs yet'}`,
    '',
    '| ID | Title | Status | Note |',
    '|----|-------|--------|------|',
  ];
  for (const r of rows) {
    lines.push(`| [${r.id}](./${r.file}) | ${r.title} | \`${r.status}\` | ${r.note} |`);
  }
  lines.push('');

  writeFileSync(join(DECISIONS_DIR, 'INDEX.md'), lines.join('\n'));
  console.log(`INDEX.md regenerated (${rows.length} ADRs; ${summary})`);
}

main();
