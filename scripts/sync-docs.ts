// Docs-sync: keeps HANDBOOK.md + diagrams honest against the machinery.
//
//   node scripts/sync-docs.ts check   # exit 1 if docs presumed stale
//   node scripts/sync-docs.ts ack     # after updating docs: re-extract
//                                     # diagrams + record fingerprint
//
// Two checks:
// 1. MECHANICAL TRUTH: every ```mermaid block in HANDBOOK.md must exactly
//    match its standalone .mmd file (single source: the handbook).
// 2. STALENESS SIGNAL: a fingerprint of the documented surface (skills,
//    agents, hooks, scripts inventory + hashes of settings.json and
//    00-mission-plan.md) must match the fingerprint recorded at last ack.
//    A mismatch means machinery changed after docs were last confirmed.
//
// "Change" is defined as: add/remove/rename of any skill, agent, hook, or
// script, or edits to settings.json / missions/00-mission-plan.md.
// ADR flips, mission outputs, and research notes are NOT docs-triggering —
// the handbook points at live sources for state instead of snapshotting it.

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const HANDBOOK = 'docs/HANDBOOK.md';
const DIAGRAMS_DIR = 'docs/diagrams';
const FINGERPRINT = 'docs/.docs-fingerprint.json';
const DIAGRAM_NAMES = [
  'phases-and-missions',
  'file-relations',
  'adr-lifecycle',
  'mission-run',
  'hooks-enforcement',
];

function sha(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 16);
}

function handbookBlocks(): string[] {
  const src = readFileSync(HANDBOOK, 'utf8');
  const blocks: string[] = [];
  const re = /```mermaid\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) blocks.push(m[1]);
  return blocks;
}

function fingerprint(): Record<string, string> {
  const list = (dir: string): string =>
    readdirSync(dir)
      .filter((f) => !f.startsWith('.'))
      .sort()
      .join(',');
  return {
    skills: list('.claude/skills'),
    agents: list('.claude/agents'),
    hooks: list('scripts/hooks'),
    scripts: readdirSync('scripts')
      .filter((f) => f.endsWith('.ts'))
      .sort()
      .join(','),
    settings: sha(readFileSync('.claude/settings.json', 'utf8')),
    missionPlan: sha(readFileSync('missions/00-mission-plan.md', 'utf8')),
  };
}

function check(): void {
  const problems: string[] = [];

  const blocks = handbookBlocks();
  if (blocks.length !== DIAGRAM_NAMES.length) {
    problems.push(
      `handbook has ${blocks.length} mermaid blocks but ${DIAGRAM_NAMES.length} diagram names are registered — update DIAGRAM_NAMES in sync-docs.ts`,
    );
  } else {
    for (const [i, name] of DIAGRAM_NAMES.entries()) {
      const path = join(DIAGRAMS_DIR, `${name}.mmd`);
      if (!existsSync(path)) {
        problems.push(`missing ${path} — run: node scripts/sync-docs.ts ack`);
        continue;
      }
      if (readFileSync(path, 'utf8') !== blocks[i]) {
        problems.push(`${name}.mmd differs from its handbook block — run ack (handbook is the source)`);
      }
    }
  }

  if (!existsSync(FINGERPRINT)) {
    problems.push('no fingerprint recorded — update docs if needed, then run: node scripts/sync-docs.ts ack');
  } else {
    const recorded = JSON.parse(readFileSync(FINGERPRINT, 'utf8')) as Record<string, string>;
    const current = fingerprint();
    for (const key of Object.keys(current)) {
      if (recorded[key] !== current[key]) {
        problems.push(
          `machinery surface changed since docs were last confirmed ("${key}"). ` +
            'Update HANDBOOK.md (+ diagrams if structure changed), then run: node scripts/sync-docs.ts ack',
        );
      }
    }
  }

  if (problems.length > 0) {
    console.error('DOCS OUT OF SYNC:');
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log('docs in sync (diagrams match handbook; fingerprint current)');
}

function ack(): void {
  const blocks = handbookBlocks();
  if (blocks.length !== DIAGRAM_NAMES.length) {
    console.error(
      `cannot ack: handbook has ${blocks.length} mermaid blocks, expected ${DIAGRAM_NAMES.length}. Update DIAGRAM_NAMES first.`,
    );
    process.exit(1);
  }
  for (const [i, name] of DIAGRAM_NAMES.entries()) {
    writeFileSync(join(DIAGRAMS_DIR, `${name}.mmd`), blocks[i]);
  }
  writeFileSync(FINGERPRINT, JSON.stringify(fingerprint(), null, 2) + '\n');
  console.log(`acked: ${DIAGRAM_NAMES.length} diagrams re-extracted, fingerprint recorded`);
}

const mode = process.argv[2] ?? 'check';
if (mode === 'ack') ack();
else check();
