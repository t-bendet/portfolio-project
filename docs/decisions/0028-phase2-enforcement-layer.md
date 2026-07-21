---
id: 0028
title: Phase 2 enforcement layer — edit what is checked, never the checker; closed missions freeze
status: active
date: 2026-07-22
decided-by: tal
mission: mission-5
reopened-by: null
superseded-by: null
---

## Context

Six hooks enforce the workshop's rules. Two of them are wrong for Phase 2, in
opposite directions, and both errors are invisible until they bite.

**`protect-workshop` freezes the machinery permanently.** It permits `.claude/`
and `scripts/` writes only while Mission 5 is in-progress. The moment this
mission closes, no mission is ever in-progress again — so agent sessions can
never modify the machinery, forever. That rule was written when M5 was the only
foreseeable editor; nobody intended the "and never again" clause. It routes
every future skill tweak through hand-editing, which is where the
`IMPROVEMENTS.md` backlog goes to die, since that backlog exists to be folded
in by Tal *while working*, and his working interface is Claude Code.

**`mission-gate` does not freeze anything.** It checks that a mission's
*dependencies* are closed before permitting writes to its outputs, and says
nothing about writes to a mission that is itself closed. Mission 4's handoff
notes assert that its deliverables "freeze at closure"; nothing enforces it. In
Phase 2 those deliverables become the specs the build is measured against, and
a spec that can be quietly edited to match the implementation is not a spec —
"edit the spec to match the code" is the most natural way for ADR 0025's drift
failure to resolve itself invisibly.

Additionally, `.claude/settings.json` is unmodifiable by any agent session,
which means **any new hook requires Tal to paste it in by hand.** New
enforcement is therefore not just new surface; it is a standing claim on his
attention.

## Decision

**1. `protect-workshop` splits the permission by what the enforcement layer can
check** (Tal, 2026-07-22). Once Phase 2 opens — defined mechanically as
Mission 6's STATUS reading `closed` — agent sessions may edit
`.claude/skills/**` and `.claude/agents/**`, and may never edit
`scripts/hooks/**`, `scripts/*.ts`, `.claude/settings.json`, or
`.claude/settings.local.json`.

*The rule in one line: you may edit what the enforcement layer checks; you may
not edit the checker.*

The asymmetry is not fastidiousness. A bad skill edit yields worse
instructions, which a human notices by reading output, and
`validate-workshop.ts` lints its structure. A bad hook edit yields **silently
absent enforcement** — `IMPROVEMENTS.md` #2's warning that enforcement "fails
*open*, silently". Mission 6 gets no allowance: it must not edit the machinery
it is auditing.

**2. `mission-gate` freezes closed missions' outputs.** Writes to
`missions/0N-*/outputs/` are blocked when that mission's own STATUS reads
`closed`. A mission still in-progress rewrites its own outputs freely — that is
what revision cycles are. Tal remains exempt, as from every hook.

**3. No hooks retire and no hooks are added.** Every change lands in
`scripts/`, so **the Phase 2 enforcement plan requires zero `settings.json`
edits and zero escalations.**

**4. `scripts/test-machinery.ts` is added** (`IMPROVEMENTS.md` #2) and runs as
CI's first job. Changing the semantics of two hooks in a system with no hook
tests is the exact situation that item warns about.

**5. `sync-docs.ts` binds diagrams by declared id rather than array position**
(`IMPROVEMENTS.md` #7), closing a silent-mislabelling path in which `ack`
writes the wrong diagram into the wrong filename and the check then passes
permanently.

**6. `app/` creation stays unenforced, and the false claim that it is enforced
is recorded** (Tal, 2026-07-22). `phase2-scaffold-plan.md` §0 states that the
mission-gate hook prevents `app/` existing before Phase 2. It does not:
`mission-gate.ts` matches only `missions/(\d{2})-[^/]+/outputs/`, and the
realistic creation path — `pnpm create astro` — runs through `Bash`, which no
`Write|Edit` hook could intercept anyway.

## Consequences

- Phase 2 sessions can improve skills and agents in place, which is the only
  way the improvements backlog gets worked. They cannot weaken the checks that
  make that safe.
- A session that genuinely needs a hook change in Phase 2 is blocked and must
  escalate. Correct, and it will be annoying at least once.
- Freezing closed missions' outputs means a genuine error in a closed
  deliverable cannot be corrected in place. That is the intent: the remedy is a
  new ADR or a note in the current work item. Reopening a mission properly is
  Tal's call. **This ADR's own outputs freeze the same way when M5 closes.**
- `test-machinery.ts` gives the enforcement layer its first reproducible
  verification — 36 assertions across all six hooks and three validators,
  including the rubber-stamp case (`IMPROVEMENTS.md` #2's named assertion) and
  both phase branches of decision 1, which are exercised against throwaway
  fixture mission trees because they cannot exist in the real repo. It is a
  smoke suite of exit codes, not a proof: it catches a hook that stopped
  blocking, not a hook that blocks the wrong thing in an unlisted case. Its
  phase table also mirrors the implementation's own logic, so a shared
  misunderstanding would pass both.
- The `app/` hole stays open for two paper-only missions and then closes by
  expiry when Phase 2 makes `app/` legitimate. The recorded correction matters
  more than the hole: a false enforcement claim is worse than a known gap,
  because it stops people looking.

## Alternatives rejected

- **Keep the machinery frozen after M5** (the literal reading). Rejected as
  daily friction landing precisely on the improvements it is meant to protect;
  a rule nobody can work under gets worked around.
- **Unfreeze everything but `settings.json` on a green lint.** Rejected: it
  lets a session edit the hooks that police it, and today "green" means
  `validate-workshop.ts` passed — a check on frontmatter shape that says
  nothing about whether a hook still blocks anything. `test-machinery.ts` is
  what would make this arguable; it did not exist when the choice was made.
- **Retire `mission-gate` once all six missions close.** Rejected: the freeze
  rule gives it live work, and deleting a hook costs a `settings.json`
  escalation to remove a process spawn on writes already touching disk.
- **Retire `inject-project-state` as stale** once mission statuses stop
  changing. Rejected, and it is the load-bearing case: it injects `INDEX.md`
  verbatim into every session, which is the mechanism that makes ADR 0027's
  narrowing notes actually reach a Phase 2 reader.
- **A `test-before-commit` hook.** Rejected: `ci.yml` already runs typecheck
  and tests on every PR with free public-repo minutes, and blocking the *merge*
  gates what reaches production while blocking the *commit* taxes exploratory
  work and needs a `settings.json` escalation to duplicate an existing gate. A
  native git `pre-commit` hook is the right tool if Tal wants local feedback,
  because it binds him too.
- **A `phase-gate` hook for `app/`.** Rejected by Tal: it needs a `Bash`
  matcher he must wire by hand, for a hole that expires in two missions, and
  `IMPROVEMENTS.md`'s bar for new enforcement is demonstrated friction rather
  than a hypothetical.
- **Budget checks as a Claude Code hook.** Rejected on mechanism: Lighthouse
  needs a built site, a server and a browser. `performance-review` code mode
  belongs in a `ci.yml` stage, and its budget numbers are Mission 6's output.
