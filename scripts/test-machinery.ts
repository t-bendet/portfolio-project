// Smoke suite for the enforcement layer (IMPROVEMENTS.md #2).
//   node scripts/test-machinery.ts
// Exit 0 = all assertions held, exit 1 = at least one failed.
//
// WHY THIS EXISTS: every hook was verified by hand in the Phase 0 session
// (piped JSON, checked exit codes) and none of it was reproducible from the
// repo. Enforcement that breaks does not break loudly — it fails OPEN and
// silently, so nothing notices.
//
// Hooks are driven exactly as a Claude Code session drives them: JSON on
// stdin, assert the exit code. 0 = allowed, 2 = blocked.
//
// ADR 0032 removed the phase table: protect-workshop now enforces one static
// rule, so the suite asserts that rule directly instead of detecting a phase.
// ADR 0031 retired the docs-sync machinery; its assertions went with it.
//
// HONEST LIMITATION: these are smoke tests of exit codes, not proofs. They
// catch a hook that stopped blocking; they do not catch a hook that blocks the
// wrong thing in a case nobody listed here.

import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseFrontmatter } from './lib/frontmatter.ts';

let passed = 0;
let failed = 0;
let skipped = 0;

function runHook(hook: string, filePath: string, cwd?: string): number {
  try {
    // Absolute script path so the hook can run against a fixture tree: the hook
    // resolves `missions/` and `.claude/` relative to cwd, but its own imports
    // relative to the script file.
    execFileSync('node', [resolve(`scripts/hooks/${hook}.ts`)], {
      input: JSON.stringify({ tool_input: { file_path: filePath } }),
      stdio: 'pipe',
      cwd,
    });
    return 0;
  } catch (err) {
    return (err as { status?: number }).status ?? -1;
  }
}

// Build a throwaway repo-shaped tree so cases that cannot exist in the real
// repo can still be asserted — the rubber-stamp case needs a mission that is
// closed WITHOUT an approved verdict, and every real closed mission has one.
function fixtureTree(
  missions: { dir: string; status: string; dependsOn?: string; verdict?: string }[],
): string {
  const root = mkdtempSync(join(tmpdir(), 'machinery-'));
  for (const m of missions) {
    const dir = join(root, 'missions', m.dir);
    mkdirSync(join(dir, 'outputs'), { recursive: true });
    const deps = m.dependsOn ? `depends-on: ${m.dependsOn}\n` : '';
    writeFileSync(
      join(dir, 'STATUS.md'),
      `---\nmission: ${m.dir.slice(0, 2).replace(/^0/, 'm')}\nstatus: ${m.status}\n${deps}---\n`,
    );
    if (m.verdict !== undefined) {
      writeFileSync(join(dir, 'outputs', 'review-verdict.md'), `---\nverdict: ${m.verdict}\n---\n`);
    }
  }
  return root;
}

function runScript(args: string[]): number {
  try {
    execFileSync('node', args, { stdio: 'pipe' });
    return 0;
  } catch (err) {
    return (err as { status?: number }).status ?? -1;
  }
}

function check(name: string, actual: number, expected: number): void {
  if (actual === expected) {
    passed++;
    console.log(`  ok    ${name}`);
  } else {
    failed++;
    console.error(`  FAIL  ${name} — expected exit ${expected}, got ${actual}`);
  }
}

function skip(name: string, why: string): void {
  skipped++;
  console.log(`  skip  ${name} (${why})`);
}

function missionStatus(dirPrefix: string): string | null {
  const dir = readdirSync('missions').find((d) => d.startsWith(dirPrefix));
  if (!dir) return null;
  const path = join('missions', dir, 'STATUS.md');
  if (!existsSync(path)) return null;
  return parseFrontmatter(readFileSync(path, 'utf8')).frontmatter['status'] ?? null;
}

function missionDir(dirPrefix: string): string | null {
  const dir = readdirSync('missions').find((d) => d.startsWith(dirPrefix));
  return dir ? join('missions', dir) : null;
}

console.log('machinery smoke suite\n');

// ---------------------------------------------------------------- reference
console.log('protect-reference');
check(
  'blocks writes under assets/reference/',
  runHook('protect-reference', 'assets/reference/prototypes/tooling-deepdive.html'),
  2,
);
check(
  'allows writes elsewhere',
  runHook('protect-reference', 'docs/research/notes.md'),
  0,
);

// ------------------------------------------------------------- mission-gate
console.log('\nmission-gate');
{
  // FORWARD gate: a mission whose dependency is not genuinely closed.
  const m6 = missionDir('06-');
  const m5Status = missionStatus('05-');
  if (m6 && m5Status !== 'closed') {
    check(
      'blocks a mission whose dependency is not closed',
      runHook('mission-gate', `${m6}/outputs/probe.md`),
      2,
    );
  } else {
    skip('blocks a mission whose dependency is not closed', 'm5 is closed');
  }

  // FORWARD gate, satisfied: an open mission with closed dependencies.
  const m5 = missionDir('05-');
  if (m5 && missionStatus('05-') === 'in-progress') {
    check(
      'allows an in-progress mission with a genuinely closed dependency',
      runHook('mission-gate', `${m5}/outputs/probe.md`),
      0,
    );
  } else {
    skip('allows an in-progress mission with closed deps', 'm5 not in-progress');
  }

  // BACKWARD gate (ADR 0028): closed missions are frozen.
  const closed = ['01-', '02-', '03-', '04-'].find((p) => missionStatus(p) === 'closed');
  if (closed) {
    check(
      "blocks writes to a CLOSED mission's outputs",
      runHook('mission-gate', `${missionDir(closed)}/outputs/probe.md`),
      2,
    );
  } else {
    skip("blocks writes to a closed mission's outputs", 'no closed mission yet');
  }

  check(
    'ignores paths outside missions/*/outputs/',
    runHook('mission-gate', 'docs/research/notes.md'),
    0,
  );

  // THE RUBBER-STAMP CASE — the integrity property mission-protocol rests on:
  // a STATUS flip alone unlocks nothing. It cannot be asserted against the real
  // repo (every closed mission has an approved verdict), so it runs against a
  // fixture tree. IMPROVEMENTS.md #2 named this assertion specifically.
  const stamp = fixtureTree([
    { dir: '01-dep-closed-no-verdict', status: 'closed' },
    { dir: '02-consumer', status: 'in-progress', dependsOn: 'm1' },
  ]);
  try {
    check(
      'blocks when the dependency is closed but has NO verdict (rubber stamp)',
      runHook('mission-gate', 'missions/02-consumer/outputs/probe.md', stamp),
      2,
    );
  } finally {
    rmSync(stamp, { recursive: true, force: true });
  }

  const rejected = fixtureTree([
    { dir: '01-dep-rejected', status: 'closed', verdict: 'REJECTED' },
    { dir: '02-consumer', status: 'in-progress', dependsOn: 'm1' },
  ]);
  try {
    check(
      'blocks when the dependency verdict is REJECTED, not APPROVED',
      runHook('mission-gate', 'missions/02-consumer/outputs/probe.md', rejected),
      2,
    );
  } finally {
    rmSync(rejected, { recursive: true, force: true });
  }

  const approved = fixtureTree([
    { dir: '01-dep-approved', status: 'closed', verdict: 'APPROVED' },
    { dir: '02-consumer', status: 'in-progress', dependsOn: 'm1' },
  ]);
  try {
    check(
      'allows when the dependency is closed WITH an APPROVED verdict',
      runHook('mission-gate', 'missions/02-consumer/outputs/probe.md', approved),
      0,
    );
  } finally {
    rmSync(approved, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------- protect-workshop
console.log('\nprotect-workshop (static Phase 2 rule — ADR 0032)');
{
  check(
    'blocks .claude/settings.json (always)',
    runHook('protect-workshop', '.claude/settings.json'),
    2,
  );
  check(
    'blocks .claude/settings.local.json (always)',
    runHook('protect-workshop', '.claude/settings.local.json'),
    2,
  );
  check(
    'blocks scripts/hooks/** (always)',
    runHook('protect-workshop', 'scripts/hooks/mission-gate.ts'),
    2,
  );
  check(
    'blocks scripts/*.ts (always)',
    runHook('protect-workshop', 'scripts/validate-adr.ts'),
    2,
  );
  check(
    'allows .claude/skills/** (always)',
    runHook('protect-workshop', '.claude/skills/adr-keeper/SKILL.md'),
    0,
  );
  check(
    'allows .claude/agents/** (always)',
    runHook('protect-workshop', '.claude/agents/red-team-reviewer.md'),
    0,
  );
  check(
    'blocks other .claude/ paths (block-and-escalate default)',
    runHook('protect-workshop', '.claude/some-new-surface.json'),
    2,
  );
  check(
    'ignores non-machinery paths',
    runHook('protect-workshop', 'docs/HANDBOOK.md'),
    0,
  );
}

// ------------------------------------------------------ inject-project-state
console.log('\ninject-project-state');
check(
  'inject-project-state runs clean',
  runHook('inject-project-state', ''),
  0,
);

// --------------------------------------------------------- decision-guard
console.log('\ndecision-guard');
{
  check(
    'blocks hand-edits to the generated INDEX.md',
    runHook('decision-guard', 'docs/decisions/INDEX.md'),
    2,
  );
  check(
    'ignores the archive (provenance, not schema-bound)',
    runHook('decision-guard', 'docs/decisions/archive/portfolio-decisions.md'),
    0,
  );

  const malformed = 'docs/decisions/9999-machinery-test-fixture.md';
  try {
    writeFileSync(malformed, '---\nid: 9999\ntitle: fixture\nstatus: banana\n---\n\n## Context\n');
    check('rejects an ADR with an invalid status', runHook('decision-guard', malformed), 2);

    writeFileSync(
      malformed,
      '---\nid: 9999\ntitle: fixture\nstatus: active\ndate: 2026-07-22\n---\n\n' +
        '## Context\n\n## Decision\n\n## Consequences\n\n## Alternatives rejected\n',
    );
    check('accepts a well-formed ADR', runHook('decision-guard', malformed), 0);
  } finally {
    rmSync(malformed, { force: true });
    runScript(['scripts/reindex-decisions.ts']); // undo the fixture's index entry
  }
}

// ------------------------------------------------------------- validate-adr
console.log('\nvalidate-adr (incl. ADR 0027 narrowing graph)');
{
  check('full-repo pass is green', runScript(['scripts/validate-adr.ts']), 0);

  const oneWay = 'docs/decisions/9998-one-directional-narrowing.md';
  try {
    writeFileSync(
      oneWay,
      '---\nid: 9998\ntitle: one-directional narrowing fixture\nstatus: active\n' +
        'date: 2026-07-22\nnarrows: 0001\n---\n\n' +
        '## Context\n\n## Decision\n\n## Consequences\n\n## Alternatives rejected\n',
    );
    // 0001 does not list 9998 in narrowed-by, so the graph check must catch it.
    check(
      'catches a one-directional narrowing',
      runScript(['scripts/validate-adr.ts']),
      1,
    );
    // Per-file mode must NOT catch it — that deadlock is deliberate (see
    // validate-adr.ts): whichever side is written first would be unwritable.
    check(
      'per-file mode tolerates it (write-order deadlock avoided)',
      runScript(['scripts/validate-adr.ts', oneWay]),
      0,
    );
  } finally {
    rmSync(oneWay, { force: true });
    runScript(['scripts/reindex-decisions.ts']);
  }

  const danglingPath = 'docs/decisions/9997-dangling-narrowing.md';
  try {
    writeFileSync(
      danglingPath,
      '---\nid: 9997\ntitle: dangling narrowing fixture\nstatus: active\n' +
        'date: 2026-07-22\nnarrows: 8888\n---\n\n' +
        '## Context\n\n## Decision\n\n## Consequences\n\n## Alternatives rejected\n',
    );
    check(
      'catches a narrowing pointing at a nonexistent ADR',
      runScript(['scripts/validate-adr.ts', danglingPath]),
      1,
    );
  } finally {
    rmSync(danglingPath, { force: true });
    runScript(['scripts/reindex-decisions.ts']);
  }
}

// -------------------------------------------------------------- validators
console.log('\nvalidators on a clean tree');
check('validate-workshop.ts', runScript(['scripts/validate-workshop.ts']), 0);

// ------------------------------------------------------------------ report
console.log(`\n${passed} passed · ${failed} failed · ${skipped} skipped`);
if (failed > 0) {
  console.error('MACHINERY SUITE FAILED — enforcement is not doing what it claims.');
  process.exit(1);
}
process.exit(0);
