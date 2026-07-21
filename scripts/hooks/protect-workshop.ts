// PreToolUse hook (Write|Edit): guards the workshop machinery itself.
//
// Two regimes, because the workshop has two phases (ADR 0028):
//
// 1. WORKSHOP (now, through Mission 6): .claude/** and scripts/** may be
//    modified by an agent session ONLY while Mission 5 — the workflow mission,
//    licensed to extend the machinery — is in-progress.
//
// 2. PHASE 2 (once Mission 6 closes): the line splits by what the enforcement
//    layer can check. Skills and agents are INSTRUCTIONS: they fail soft, and
//    validate-workshop.ts lints their structure, so sessions may edit them.
//    Hooks and validators are the ENFORCEMENT LAYER: broken, they fail OPEN
//    and silently, so sessions may never edit them.
//
//    The rule in one line: you may edit what the enforcement layer checks;
//    you may not edit the checker.
//
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

// settings.json (and settings.local.json, which grants permissions) are
// extra-sensitive: they wire the hooks themselves. No phase, no mission, no
// exception — not even M5.
if (/\.claude\/settings(\.local)?\.json$/.test(filePath)) {
  console.error(
    `BLOCKED: ${filePath} wires the enforcement hooks and may not be ` +
      'modified by an agent session, in any phase. Escalate to Tal — he can ' +
      'edit it directly.',
  );
  process.exit(2);
}

function missionStatus(path: string): string | null {
  if (!existsSync(path)) return null;
  const { frontmatter } = parseFrontmatter(readFileSync(path, 'utf8'));
  return frontmatter['status'] ?? null;
}

const m5InProgress =
  missionStatus('missions/05-ai-dev-workflow/STATUS.md') === 'in-progress';
if (m5InProgress) process.exit(0); // M5's license: the whole machinery

// Phase 2 opens mechanically when Mission 6 — the blueprint gate — is closed.
// Mission 6 does NOT get this allowance: it must not edit the machinery it is
// auditing.
const phase2Open = missionStatus('missions/06-blueprint-gate/STATUS.md') === 'closed';
const isInstructionSurface = /(^|\/)\.claude\/(skills|agents)\//.test(filePath);

if (phase2Open && isInstructionSurface) process.exit(0);

if (phase2Open) {
  console.error(
    `BLOCKED: ${filePath} is the enforcement layer (scripts/ or .claude/ ` +
      'config), not an instruction surface. In Phase 2 sessions may edit ' +
      '.claude/skills/** and .claude/agents/** — which validate-workshop.ts ' +
      'checks — but never the hooks and validators that do the checking: ' +
      'those fail OPEN and silently when broken (ADR 0028). Escalate to Tal, ' +
      'then run: node scripts/test-machinery.ts && node scripts/validate-workshop.ts',
  );
  process.exit(2);
}

console.error(
  `BLOCKED: ${filePath} is workshop machinery (.claude/ or scripts/). ` +
    'Only Mission 5, while in-progress, may modify it (CLAUDE.md operating rules); ' +
    'skills and agents unlock for sessions once Mission 6 closes (ADR 0028). ' +
    'If this change is genuinely needed now, escalate to Tal — he can make it ' +
    'directly in his editor, then run: node scripts/validate-workshop.ts',
);
process.exit(2);
