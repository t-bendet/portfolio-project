// PreToolUse hook (Write|Edit): blocks writes into missions/0N-*/outputs/
// unless every dependency mission is genuinely closed.
//
// "Genuinely closed" = STATUS.md says `closed` AND outputs/review-verdict.md
// exists containing verdict APPROVED. Flipping STATUS.md alone unlocks nothing.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter } from '../lib/frontmatter.ts';

interface HookInput {
  tool_input?: { file_path?: string };
}

const MISSIONS_DIR = 'missions';

function missionDirFor(key: string): string | null {
  // key like "m3" -> directory starting "03-"
  const num = key.replace(/^m/, '').padStart(2, '0');
  for (const d of readdirSync(MISSIONS_DIR)) {
    if (d.startsWith(`${num}-`)) return join(MISSIONS_DIR, d);
  }
  return null;
}

function isGenuinelyClosed(key: string): { ok: boolean; reason: string } {
  if (key === 'phase-0') {
    // Phase 0 closure is Tal's sign-off; gate does not enforce it mechanically.
    return { ok: true, reason: '' };
  }
  const dir = missionDirFor(key);
  if (!dir) return { ok: false, reason: `dependency "${key}": mission folder not found` };

  const statusPath = join(dir, 'STATUS.md');
  if (!existsSync(statusPath)) {
    return { ok: false, reason: `dependency "${key}": missing STATUS.md` };
  }
  const { frontmatter } = parseFrontmatter(readFileSync(statusPath, 'utf8'));
  if (frontmatter['status'] !== 'closed') {
    return {
      ok: false,
      reason: `dependency "${key}" has status "${frontmatter['status'] ?? 'unknown'}", needs "closed"`,
    };
  }
  const verdictPath = join(dir, 'outputs', 'review-verdict.md');
  if (!existsSync(verdictPath)) {
    return {
      ok: false,
      reason: `dependency "${key}" is marked closed but has NO outputs/review-verdict.md — closure without red-team evidence does not count`,
    };
  }
  const verdict = readFileSync(verdictPath, 'utf8');
  if (!/verdict:\s*APPROVED/i.test(verdict)) {
    return {
      ok: false,
      reason: `dependency "${key}": review-verdict.md exists but does not contain "verdict: APPROVED"`,
    };
  }
  return { ok: true, reason: '' };
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
const match = /missions\/(\d{2})-[^/]+\/outputs\//.exec(filePath);
if (!match) process.exit(0); // not a mission output write

const missionNum = match[1];
const dir = missionDirFor(`m${Number(missionNum)}`);
if (!dir) process.exit(0);

const { frontmatter } = parseFrontmatter(
  readFileSync(join(dir, 'STATUS.md'), 'utf8'),
);
const deps = (frontmatter['depends-on'] ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

const failures: string[] = [];
for (const dep of deps) {
  const check = isGenuinelyClosed(dep);
  if (!check.ok) failures.push(check.reason);
}

if (failures.length > 0) {
  console.error(
    `MISSION GATE BLOCKED write to ${filePath}\n` +
      failures.map((f) => `  - ${f}`).join('\n') +
      '\nClose the dependency mission properly (contract met + red-team APPROVED verdict) before working on this mission.',
  );
  process.exit(2);
}
process.exit(0);
