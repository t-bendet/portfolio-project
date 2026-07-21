// Validates one ADR file (or all, with no args) against the flat schema.
// Usage: node scripts/validate-adr.ts [path/to/adr.md]
// Exit 0 = valid, exit 1 = invalid (messages on stderr).

import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { parseFrontmatter, ADR_STATUSES } from './lib/frontmatter.ts';

const DECISIONS_DIR = 'docs/decisions';
const REQUIRED_KEYS = ['id', 'title', 'status', 'date'] as const;
const FILENAME_RE = /^(\d{4})-[a-z0-9-]+\.md$/;

export function validateAdr(path: string): string[] {
  const problems: string[] = [];
  const name = basename(path);

  const m = FILENAME_RE.exec(name);
  if (!m) {
    problems.push(`filename "${name}" must match NNNN-kebab-title.md`);
  }

  let raw: string;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    return [`cannot read ${path}`];
  }

  const { frontmatter, errors } = parseFrontmatter(raw);
  problems.push(...errors);

  for (const key of REQUIRED_KEYS) {
    if (!frontmatter[key]) problems.push(`missing required key "${key}"`);
  }

  const status = frontmatter['status'];
  if (status && !ADR_STATUSES.includes(status)) {
    problems.push(
      `status "${status}" invalid — must be one of: ${ADR_STATUSES.join(', ')}`,
    );
  }

  if (m && frontmatter['id'] && frontmatter['id'] !== m[1]) {
    problems.push(`id "${frontmatter['id']}" does not match filename number "${m[1]}"`);
  }

  if (status === 'superseded') {
    const by = frontmatter['superseded-by'];
    if (!by || by === 'null') {
      problems.push('status is "superseded" but "superseded-by" is not set to an ADR id');
    }
  }
  if (status === 'reopened') {
    const by = frontmatter['reopened-by'];
    if (!by || by === 'null') {
      problems.push('status is "reopened" but "reopened-by" is not set (e.g. mission-3)');
    }
  }

  if (frontmatter['date'] && !/^\d{4}-\d{2}-\d{2}$/.test(frontmatter['date'])) {
    problems.push('date must be YYYY-MM-DD');
  }

  return problems;
}

function main(): void {
  const args = process.argv.slice(2);
  const targets =
    args.length > 0
      ? args
      : readdirSync(DECISIONS_DIR)
          .filter((f) => FILENAME_RE.test(f))
          .map((f) => join(DECISIONS_DIR, f));

  let failed = false;
  for (const path of targets) {
    const problems = validateAdr(path);
    if (problems.length > 0) {
      failed = true;
      console.error(`INVALID ${path}`);
      for (const p of problems) console.error(`  - ${p}`);
    }
  }
  if (!failed) console.log(`${targets.length} ADR(s) valid`);
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] && process.argv[1].endsWith('validate-adr.ts')) {
  main();
}
