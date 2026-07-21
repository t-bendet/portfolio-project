// Validates one ADR file (or all, with no args) against the flat schema.
// Usage: node scripts/validate-adr.ts [path/to/adr.md]
// Exit 0 = valid, exit 1 = invalid (messages on stderr).

import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { parseFrontmatter, ADR_STATUSES } from './lib/frontmatter.ts';

const DECISIONS_DIR = 'docs/decisions';
const REQUIRED_KEYS = ['id', 'title', 'status', 'date'] as const;
const FILENAME_RE = /^(\d{4})-[a-z0-9-]+\.md$/;

// ADR 0027 — partial narrowing. `narrows` sits on the newer ADR that corrects
// a clause of an older one; `narrowed-by` sits on the older ADR, which stays
// `active`. Values are comma-separated ids: still a flat scalar, so the
// frontmatter parser's no-arrays rule holds.
const NARROW_KEYS = ['narrows', 'narrowed-by'] as const;

function idList(value: string | undefined): string[] {
  if (!value || value === 'null') return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function adrFiles(): string[] {
  return readdirSync(DECISIONS_DIR).filter((f) => FILENAME_RE.test(f));
}

function fileForId(id: string): string | null {
  return adrFiles().find((f) => f.startsWith(`${id}-`)) ?? null;
}

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

  // Narrowing relation, SHAPE ONLY. Reciprocity is deliberately NOT checked
  // here: this function runs per-file from the decision-guard hook, and either
  // write order would fail — `narrows` on the new ADR is invalid until
  // `narrowed-by` exists on the old one, and vice versa. That deadlock would
  // make the relation unwritable. Reciprocity is checked in the full-repo pass
  // (main() with no args), which is what CI runs.
  const selfId = frontmatter['id'];
  for (const key of NARROW_KEYS) {
    const ids = idList(frontmatter[key]);
    const seen = new Set<string>();
    for (const ref of ids) {
      if (!/^\d{4}$/.test(ref)) {
        problems.push(`"${key}" entry "${ref}" is not a 4-digit ADR id`);
        continue;
      }
      if (ref === selfId) problems.push(`"${key}" points at this ADR itself`);
      if (seen.has(ref)) problems.push(`"${key}" lists "${ref}" more than once`);
      seen.add(ref);
      if (!fileForId(ref)) {
        problems.push(`"${key}" points at ADR ${ref}, which does not exist`);
      }
    }
  }

  return problems;
}

// Cross-file integrity for the narrowing relation. Full-repo only.
export function validateNarrowingGraph(): string[] {
  const problems: string[] = [];
  const fm: Record<string, Record<string, string>> = {};

  for (const file of adrFiles()) {
    const { frontmatter } = parseFrontmatter(
      readFileSync(join(DECISIONS_DIR, file), 'utf8'),
    );
    const id = frontmatter['id'];
    if (id) fm[id] = frontmatter;
  }

  for (const [id, front] of Object.entries(fm)) {
    for (const target of idList(front['narrows'])) {
      const other = fm[target];
      if (!other) continue; // per-file check already reported the dangling ref
      if (!idList(other['narrowed-by']).includes(id)) {
        problems.push(
          `ADR ${id} declares "narrows: ${target}" but ADR ${target} does not list ${id} in "narrowed-by" — ` +
            'the relation is one-directional, which is the exact failure ADR 0027 exists to prevent',
        );
      }
    }
    for (const target of idList(front['narrowed-by'])) {
      const other = fm[target];
      if (!other) continue;
      if (!idList(other['narrows']).includes(id)) {
        problems.push(
          `ADR ${id} declares "narrowed-by: ${target}" but ADR ${target} does not list ${id} in "narrows"`,
        );
      }
      if (other['status'] === 'superseded') {
        problems.push(
          `ADR ${id} is narrowed by ADR ${target}, which is now superseded by ${other['superseded-by'] ?? '?'} — ` +
            're-point the narrowing at the superseding ADR or drop it',
        );
      }
    }
  }
  return problems;
}

function main(): void {
  const args = process.argv.slice(2);
  const fullRepo = args.length === 0;
  const targets = fullRepo ? adrFiles().map((f) => join(DECISIONS_DIR, f)) : args;

  let failed = false;
  for (const path of targets) {
    const problems = validateAdr(path);
    if (problems.length > 0) {
      failed = true;
      console.error(`INVALID ${path}`);
      for (const p of problems) console.error(`  - ${p}`);
    }
  }

  if (fullRepo) {
    const graph = validateNarrowingGraph();
    if (graph.length > 0) {
      failed = true;
      console.error('NARROWING GRAPH INVALID (docs/decisions/)');
      for (const p of graph) console.error(`  - ${p}`);
    }
  }

  if (!failed) {
    console.log(
      `${targets.length} ADR(s) valid${fullRepo ? ' · narrowing graph reciprocal' : ''}`,
    );
  }
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] && process.argv[1].endsWith('validate-adr.ts')) {
  main();
}
