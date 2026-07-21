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

function list(value: string | undefined): string[] {
  if (!value || value === 'null') return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function main(): void {
  const rows: Row[] = [];

  for (const file of readdirSync(DECISIONS_DIR).sort()) {
    if (!FILENAME_RE.test(file)) continue;
    const raw = readFileSync(join(DECISIONS_DIR, file), 'utf8');
    const { frontmatter } = parseFrontmatter(raw);

    // Notes compose: a status note AND a narrowing note can both apply.
    // ADR 0027 — an `active` ADR whose clause is corrected by a later `active`
    // ADR previously produced NO note at all, so the relationship was invisible
    // to anyone reading the index (which every session receives verbatim from
    // inject-project-state.ts). That invisibility is the whole defect.
    const notes: string[] = [];
    if (frontmatter['status'] === 'reopened') {
      notes.push(`reopened by ${frontmatter['reopened-by'] ?? '?'}`);
    } else if (frontmatter['status'] === 'superseded') {
      notes.push(`superseded by ${frontmatter['superseded-by'] ?? '?'}`);
    }
    const narrowedBy = list(frontmatter['narrowed-by']);
    const narrows = list(frontmatter['narrows']);
    if (narrowedBy.length > 0) {
      notes.push(`**narrowed by ${narrowedBy.join(', ')}** — read together`);
    }
    if (narrows.length > 0) notes.push(`narrows ${narrows.join(', ')}`);

    const note = notes.join(' · ');
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
    '**"narrowed by NNNN"** means this ADR is still `active` and still binding,',
    'but a later ADR corrects one of its clauses. Acting on this ADR alone will',
    'produce the wrong result. Read both. (ADR 0027)',
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
