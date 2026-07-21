// PostToolUse hook (Write|Edit): after any write to the documented machinery
// surface (.claude/**, scripts/**, missions/00-mission-plan.md), run the
// docs-sync check. Exit 2 surfaces staleness to Claude so docs get updated
// in the same working session as the change that made them stale.

import { execFileSync } from 'node:child_process';

interface HookInput {
  tool_input?: { file_path?: string };
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString('utf8');
}

const raw = await readStdin();
let input: HookInput = {};
try {
  input = JSON.parse(raw) as HookInput;
} catch {
  process.exit(0);
}

const filePath = input.tool_input?.file_path ?? '';
const touchesSurface =
  /(^|\/)\.claude\//.test(filePath) ||
  /(^|\/)scripts\//.test(filePath) ||
  filePath.endsWith('missions/00-mission-plan.md');
if (!touchesSurface) process.exit(0);

// Docs edits themselves shouldn't trigger the check mid-edit
if (filePath.includes('docs/')) process.exit(0);

try {
  execFileSync('node', ['scripts/sync-docs.ts', 'check'], { stdio: 'pipe' });
} catch (err) {
  const e = err as { stderr?: Buffer };
  console.error(
    `DOCS-SYNC: this write changed the documented machinery surface.\n` +
      `${e.stderr?.toString() ?? ''}` +
      'Update docs/HANDBOOK.md (and diagrams if structure changed), then run:\n' +
      '  node scripts/sync-docs.ts ack',
  );
  process.exit(2);
}
process.exit(0);
