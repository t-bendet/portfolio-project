// PreToolUse hook (Write|Edit): guards writes into missions/0N-*/outputs/,
// in both directions.
//
// FORWARD: no mission produces outputs until every dependency is genuinely
// closed. "Genuinely closed" = STATUS.md says `closed` AND
// outputs/review-verdict.md exists containing verdict APPROVED. Flipping
// STATUS.md alone unlocks nothing.
//
// BACKWARD (ADR 0028): a CLOSED mission's outputs are frozen. The project
// already states this in prose — M4's handoff notes say its ADRs "freeze at
// closure; further changes need a new ADR" — but nothing enforced it for the
// deliverables. In Phase 2 those deliverables become the specs the build is
// measured against, and a spec that can be quietly edited to match the
// implementation is not a spec. That is the most natural way for drift to
// resolve itself invisibly, so it is now mechanical.

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

// BACKWARD gate: this mission is closed, so its outputs are frozen.
// A mission still in-progress may rewrite its own outputs freely — that is
// what revision cycles are.
if (frontmatter['status'] === 'closed') {
  console.error(
    `MISSION GATE BLOCKED write to ${filePath}\n` +
      `  - mission "${frontmatter['mission'] ?? dir}" is closed; its outputs are frozen (ADR 0028)\n` +
      'Closed deliverables are the specs Phase 2 is measured against. If one is wrong, that is\n' +
      'a new ADR or a note in the current work item — not an edit to a closed mission\'s output.\n' +
      'Reopening genuinely (status flip + a new review cycle) is Tal\'s call.',
  );
  process.exit(2);
}

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
