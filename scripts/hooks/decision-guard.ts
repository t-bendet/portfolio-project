// PostToolUse hook (Write|Edit): after any write under docs/decisions/,
// validate the ADR format and regenerate INDEX.md.
// Exit 2 surfaces validation failures to Claude so it fixes the file.

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
if (!filePath.includes('docs/decisions/')) process.exit(0);
if (filePath.includes('/archive/')) process.exit(0); // provenance, not schema-bound
if (filePath.endsWith('INDEX.md')) {
  console.error(
    'BLOCKED intent: INDEX.md is generated. Run `node scripts/reindex-decisions.ts` instead of editing it.',
  );
  process.exit(2);
}

try {
  execFileSync('node', ['scripts/validate-adr.ts', filePath], { stdio: 'pipe' });
} catch (err) {
  const e = err as { stderr?: Buffer };
  console.error(
    `ADR VALIDATION FAILED for ${filePath}:\n${e.stderr?.toString() ?? 'unknown error'}` +
      '\nFix the frontmatter per the adr-keeper skill (flat keys, valid status, required fields).',
  );
  process.exit(2);
}

execFileSync('node', ['scripts/reindex-decisions.ts'], { stdio: 'inherit' });
process.exit(0);
