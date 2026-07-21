// PreToolUse hook (Write|Edit): blocks any write under assets/reference/.
// Hook protocol: JSON on stdin; exit 2 blocks the tool call (stderr goes to Claude).

interface HookInput {
  tool_name?: string;
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
  process.exit(0); // malformed input: don't block on parser failure
}

const filePath = input.tool_input?.file_path ?? '';
if (filePath.includes('assets/reference/')) {
  console.error(
    `BLOCKED: ${filePath} is read-only source material (assets/reference/). ` +
      'Prototypes and inspiration are inputs, never outputs. ' +
      'If you need a derivative, write it to docs/research/ or a mission outputs/ folder.',
  );
  process.exit(2);
}
process.exit(0);
