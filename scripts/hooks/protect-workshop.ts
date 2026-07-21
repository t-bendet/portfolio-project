// PreToolUse hook (Write|Edit): guards the workshop machinery itself.
// .claude/** and scripts/** may be modified by an agent session ONLY while
// Mission 5 (the workflow mission, licensed to extend .claude/) is in-progress.
// Everything else is a block-and-escalate: Tal edits freely in his own editor
// (hooks bind Claude Code sessions, not humans).

import { existsSync, readFileSync } from 'node:fs';
import { parseFrontmatter } from '../lib/frontmatter.ts';

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
const touchesMachinery =
  /(^|\/)\.claude\//.test(filePath) || /(^|\/)scripts\//.test(filePath);
if (!touchesMachinery) process.exit(0);

// settings.json is extra-sensitive: it wires the hooks themselves.
// Even M5 must escalate for it.
if (filePath.endsWith('.claude/settings.json')) {
  console.error(
    'BLOCKED: .claude/settings.json wires the enforcement hooks and may not be ' +
      'modified by an agent session. Escalate to Tal — he can edit it directly.',
  );
  process.exit(2);
}

const m5Status = 'missions/05-ai-dev-workflow/STATUS.md';
if (existsSync(m5Status)) {
  const { frontmatter } = parseFrontmatter(readFileSync(m5Status, 'utf8'));
  if (frontmatter['status'] === 'in-progress') process.exit(0); // M5's license
}

console.error(
  `BLOCKED: ${filePath} is workshop machinery (.claude/ or scripts/). ` +
    'Only Mission 5, while in-progress, may modify it (CLAUDE.md operating rules). ' +
    'If this change is genuinely needed now, escalate to Tal — he can make it ' +
    'directly in his editor, then run: node scripts/validate-workshop.ts',
);
process.exit(2);
