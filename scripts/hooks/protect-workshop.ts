// PreToolUse hook (Write|Edit): guards the workshop machinery itself.
//
// Static Phase 2 rule (ADR 0028, simplified by ADR 0032 once the phase
// regimes became dead branches at Mission 6's close):
//
// Skills and agents are INSTRUCTIONS: they fail soft, and
// validate-workshop.ts lints their structure, so sessions may edit them.
// Hooks and validators are the ENFORCEMENT LAYER: broken, they fail OPEN
// and silently, so sessions may never edit them.
//
// The rule in one line: you may edit what the enforcement layer checks;
// you may not edit the checker.
//
// Everything else under .claude/ or scripts/ is a block-and-escalate: Tal
// edits freely in his own editor (hooks bind Claude Code sessions, not
// humans).

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
// extra-sensitive: they wire the hooks themselves. No exception, ever.
if (/\.claude\/settings(\.local)?\.json$/.test(filePath)) {
  console.error(
    `BLOCKED: ${filePath} wires the enforcement hooks and may not be ` +
      'modified by an agent session, in any phase. Escalate to Tal — he can ' +
      'edit it directly.',
  );
  process.exit(2);
}

// Instruction surfaces: always session-editable.
if (/(^|\/)\.claude\/(skills|agents)\//.test(filePath)) process.exit(0);

console.error(
  `BLOCKED: ${filePath} is the enforcement layer (scripts/ or .claude/ ` +
    'config), not an instruction surface. Sessions may edit ' +
    '.claude/skills/** and .claude/agents/** — which validate-workshop.ts ' +
    'checks — but never the hooks and validators that do the checking: ' +
    'those fail OPEN and silently when broken (ADRs 0028, 0032). Escalate ' +
    'to Tal, then run: node scripts/test-machinery.ts && node scripts/validate-workshop.ts',
);
process.exit(2);
