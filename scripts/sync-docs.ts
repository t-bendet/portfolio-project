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

// Diagrams bind to handbook blocks by a declared id, NOT by document order.
// Positional binding (the original design) had a silent-corruption mode: reorder
// two handbook sections and `ack` faithfully writes the wrong diagram into the
// wrong filename, the check then passes, and the filenames lie permanently —
// with the tool's own remediation message as the trigger. The enforced
// invariant was "the bytes at index i match the file named DIAGRAM_NAMES[i]",
// never "each file's name describes its contents". (IMPROVEMENTS.md #7)
//
// The id lives in the source as a mermaid comment, which renders as nothing:
//   ```mermaid
//   %% id: adr-lifecycle
//   stateDiagram-v2
const ID_RE = /^%%\s*id:\s*([a-z0-9-]+)\s*$/;

interface Block {
  id: string | null;
  body: string;
}

function handbookBlocks(): Block[] {
  const src = readFileSync(HANDBOOK, 'utf8');
  const blocks: Block[] = [];
  const re = /```mermaid\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    const body = m[1];
    const first = body.split('\n', 1)[0] ?? '';
    const idMatch = ID_RE.exec(first.trim());
    blocks.push({ id: idMatch ? idMatch[1] : null, body });
  }
  return blocks;
}

// Resolve blocks to { name -> body }, reporting every integrity failure.
function blockIndex(blocks: Block[]): {
  byId: Map<string, string>;
  problems: string[];
} {
  const problems: string[] = [];
  const byId = new Map<string, string>();
  const registered = new Set(DIAGRAM_NAMES);

  for (const [i, block] of blocks.entries()) {
    if (block.id === null) {
      problems.push(
        `mermaid block #${i + 1} has no id — add "%% id: <name>" as its first line`,
      );
      continue;
    }
    if (byId.has(block.id)) {
      problems.push(`duplicate diagram id "${block.id}" in the handbook`);
      continue;
    }
    if (!registered.has(block.id)) {
      problems.push(
        `unknown diagram id "${block.id}" — add it to DIAGRAM_NAMES in sync-docs.ts`,
      );
      continue;
    }
    byId.set(block.id, block.body);
  }

  for (const name of DIAGRAM_NAMES) {
    if (!byId.has(name)) {
      problems.push(`registered diagram "${name}" has no matching block in the handbook`);
    }
  }

  // Backstop: the count check the original design relied on, kept.
  if (blocks.length !== DIAGRAM_NAMES.length) {
    problems.push(
      `handbook has ${blocks.length} mermaid blocks but ${DIAGRAM_NAMES.length} diagram names are registered`,
    );
  }

  return { byId, problems };
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

  const { byId, problems: idProblems } = blockIndex(handbookBlocks());
  problems.push(...idProblems);

  for (const [name, body] of byId) {
    const path = join(DIAGRAMS_DIR, `${name}.mmd`);
    if (!existsSync(path)) {
      problems.push(`missing ${path} — run: node scripts/sync-docs.ts ack`);
      continue;
    }
    if (readFileSync(path, 'utf8') !== body) {
      problems.push(`${name}.mmd differs from its handbook block — run ack (handbook is the source)`);
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
  // ack refuses on ANY id problem. This is the whole point of #7: the old ack
  // would happily write a correct-looking file with the wrong contents.
  const { byId, problems } = blockIndex(handbookBlocks());
  if (problems.length > 0) {
    console.error('cannot ack — handbook diagram ids are not sound:');
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  for (const [name, body] of byId) {
    writeFileSync(join(DIAGRAMS_DIR, `${name}.mmd`), body);
  }
  writeFileSync(FINGERPRINT, JSON.stringify(fingerprint(), null, 2) + '\n');
  console.log(`acked: ${byId.size} diagrams re-extracted by id, fingerprint recorded`);
}

const mode = process.argv[2] ?? 'check';
if (mode === 'ack') ack();
else check();
