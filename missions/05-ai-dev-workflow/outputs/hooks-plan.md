# Hooks Plan — the Phase 2 enforcement layer

Mission 5 · 2026-07-22
Recorded as ADR 0028.

The workshop runs six hooks. This document decides what each becomes when
Phase 2 opens, what new enforcement is added, and — the harder half — what
is deliberately *not* added.

**Governing constraint, stated first because it shapes everything below:**
`.claude/settings.json` is the only file that can wire a hook, and
`protect-workshop.ts` blocks it unconditionally, for every session including
this one. **Any new hook requires Tal to paste it in by hand.** So a new
hook is not just new surface — it is a standing request for his attention,
and it needs to be worth that.

---

## 1. Verdict table

| Hook | Phase 2 | Change requires |
|---|---|---|
| `protect-reference` | **keep, unchanged** | — |
| `inject-project-state` | **keep, unchanged** | — |
| `decision-guard` | **keep**, validator underneath extended (ADR 0027) | `scripts/` only |
| `docs-sync-check` | **keep**, surface extended | `scripts/` only |
| `mission-gate` | **keep**, scope widened to freeze closed missions | `scripts/` only |
| `protect-workshop` | **keep**, rule rewritten for Phase 2 | `scripts/` only |
| *(new hooks)* | **none** | — |

**Nothing retires.** That is a finding, not an oversight — §3 argues it.
**Nothing new is wired.** §4 argues that, and it is the part of this plan
most likely to be wrong later.

Every change below lands in `scripts/`, which Mission 5 owns. **This plan
requires zero edits to `settings.json` and therefore zero escalations.**
That was a design goal, not a happy accident: a plan whose first step is
"Tal edits the hook wiring" is a plan that half-lands.

---

## 2. The two rewrites

### 2.1 `protect-workshop` — the freeze problem

**The bug.** The current rule permits `.claude/` and `scripts/` writes only
while Mission 5 is in-progress. The moment this mission closes, no mission
is ever in-progress again, and **the machinery becomes permanently frozen to
every agent session.** That rule was written when M5 was the only
foreseeable editor; it silently also means "and never again after that."

The cost of leaving it: `IMPROVEMENTS.md` exists to be "folded in by Tal
while working," and his working interface is Claude Code. A frozen `.claude/`
routes every future skill tweak through hand-editing, which is exactly where
improvements go to die.

**The fix (decided by Tal, 2026-07-22): split the line by what the
enforcement layer can check.**

| Path | Agent sessions in Phase 2 | Why |
|---|---|---|
| `.claude/skills/**` | **allowed** | Instructions. Fail soft, and `validate-workshop.ts` lints their structure |
| `.claude/agents/**` | **allowed** | Same |
| `scripts/hooks/**` | **blocked** | The enforcement layer itself |
| `scripts/*.ts` | **blocked** | The validators the allowance above depends on |
| `.claude/settings.json` | **blocked, always** | Wires the hooks |
| `.claude/settings.local.json` | **blocked** | Grants permissions; same class as settings |

**The principle, in one line: you may edit what the enforcement layer
checks; you may not edit the checker.**

The asymmetry is not fastidiousness. A bad skill edit produces worse
instructions, which a human notices by reading output. A bad hook edit
produces *silently absent enforcement* — `IMPROVEMENTS.md` #2's exact
warning: "enforcement fails **open**, silently." The two failure modes are
not comparable, so the two permissions should not be either.

**Phase boundary.** The skills/agents allowance opens when Phase 2 opens,
defined mechanically as `missions/06-*/STATUS.md` reading `closed`. Until
then the current M5-only rule stands, unchanged. Mission 6 does not get to
edit the machinery it is auditing.

**Rejected: "unfreeze on green"** — allow anything but `settings.json`
provided `validate-workshop.ts` passes. It lets a session edit the hooks
that police it, and today the check is lint-only, so "green" would mean
"frontmatter is well-formed", which says nothing about whether the hook
still blocks anything. §5's test suite is what would make that option
arguable; it is not on the table before then.

### 2.2 `mission-gate` — closed missions should be frozen

**The gap.** M4's handoff notes state that its ADRs "freeze at closure —
further changes need a new ADR." Nothing enforces that for the *outputs*.
`mission-gate.ts` checks that a mission's *dependencies* are closed before
permitting writes to its outputs; it says nothing about writes to a mission
that is itself closed. Every closed mission's outputs are currently
editable by any session.

That matters more in Phase 2 than it did in Phase 1. The mission outputs
become the specs the build is measured against (`phase2-workflow.md` §2).
A spec that can be quietly edited to match the implementation is not a spec
— and "edit the spec to match the code" is the single most natural way for
`phase2-workflow.md` §1's drift failure to resolve itself invisibly.

**The fix:** `mission-gate` additionally blocks writes to
`missions/0N-*/outputs/` when *that* mission's own STATUS reads `closed`.
The block message names the remedy: the finding belongs in a new ADR, or in
the current work item's record, not in a closed mission's deliverable.

**This is not new surface.** It is the same hook, on the same matcher, at
the same path pattern, enforcing a rule the project already states in prose.
It clears `IMPROVEMENTS.md`'s bar for the same reason items #2 and #3 do: it
verifies what already exists.

**Deliberate hole:** a mission still in-progress can rewrite its own
outputs freely, which is what revision cycles are. And Tal is exempt, as he
is from every hook — they bind Claude Code sessions, not his editor.

---

## 3. Why nothing retires

The instinct at a phase boundary is to sweep away the previous phase's
machinery. Each candidate was checked and each survived, for a different
reason.

- **`mission-gate` looks dead** once all six missions close — no dependency
  can be unmet, so it can never block. It stays anyway, because §2.2 gives
  it live work, and because removing it means a `settings.json` edit
  (escalation) to delete a hook whose cost is one process spawn on writes
  that are already touching the filesystem.
- **`inject-project-state` looks stale** in Phase 2 — mission statuses stop
  changing. It stays unchanged, and this is the load-bearing one:
  **it injects `INDEX.md` verbatim into every session**, which is the
  mechanism that makes ADR 0027's narrowing notes actually reach a Phase 2
  reader. Without it the narrowing fix would be a field nobody looks at.
  The frozen mission statuses are three lines of noise; the index is the
  whole point.
- **`protect-reference`** — `assets/reference/prototypes/` is Tal's own
  work and is *more* likely to be touched in Phase 2, when someone is
  implementing from it. Unchanged.
- **`decision-guard`** — ADRs continue in Phase 2 (§7's checkpoint 4 mints
  them). Unchanged wiring; the validator it calls gains ADR 0027's checks,
  which it picks up for free.
- **`docs-sync-check`** — extended, §4.2.

---

## 4. What is not being added, and what happens instead

### 4.1 `test-before-commit` — rejected

The mission contract names this as a candidate. It is rejected, and the
reasoning is worth recording because it will look like an omission.

A `PreToolUse` hook on `Bash` matching `git commit`, running typecheck and
tests before permitting the commit. Against it:

1. **CI already does exactly this, at the point that matters.** ADR 0021
   §5's `ci.yml` runs `tsc --noEmit`, `astro check`, and the API suite
   against an ephemeral Postgres, on every PR. Public-repo minutes are free
   (Q34). Blocking the *commit* gates a local checkpoint; blocking the
   *merge* gates the thing that reaches production.
2. **It taxes the wrong action.** Commits during exploratory work are
   supposed to be cheap and frequently broken; that is what a branch is for.
   A hook that makes every commit cost a full typecheck plus a Postgres
   container teaches you to commit less, which loses the granular history
   §5.2 of `worktree-and-branching.md` is trying to keep.
3. **It needs a `settings.json` escalation** for a capability that
   duplicates a gate Tal is already paying for.

**What happens instead:** the gate stays in `ci.yml`, and if Tal wants
local pre-commit feedback, a native git `pre-commit` hook is the right
tool — it is a repo artifact, it binds *him* as well as Claude Code (which
a `PreToolUse` hook explicitly does not), and it needs nobody's permission
to add or remove.

### 4.2 Budget checks — a CI job, not a Claude Code hook

The contract asks for "budget checks wiring `performance-review` code
mode." That skill's code mode specifies Lighthouse CI against a budgets
file with the build **failing** on breach, bundle analysis on dependency
PRs, and a check that the theme/easter-egg listeners cost nothing at idle.

**None of that belongs in a `PreToolUse` hook.** It needs a built site, a
server, and a browser. It is a `ci.yml` stage, and it is specified as one:

| Stage | Runs | Source of truth |
|---|---|---|
| `perf` | after `build`, on PRs touching `app/web/**` | `performance-budgets.md` (Mission 6, design mode) |
| `bundle` | on PRs touching any manifest | same |
| `sec` | dependency audit + secrets scan, every PR | `security-requirements.md` (Mission 6, design mode) |

Both skills are already dual-mode and already say "Phase 2 CI" — the wiring
they were missing is a *pipeline stage*, not a hook. Mission 6 produces the
budget numbers these stages read; **this mission cannot, because the
budgets do not exist yet.** Handed forward explicitly rather than invented
here.

**One honest gap:** `performance-review` says "budgets are contracts, not
aspirations. If a budget must move, that is an ADR." Nothing mechanical
enforces that the ADR gets written rather than the number quietly edited.
That is the same class of problem as §2.2 and has no cheap mechanical fix;
it is named so it is at least visible.

### 4.3 The colophon staleness check — added, reusing existing machinery

`content-model.md` §9 hands over the obligation to keep `/colophon/`
current, and `phase2-workflow.md` §6.2 accepts it. This is the one new
enforcement in the plan, and it costs no new hook and no escalation
because **`sync-docs.ts` already implements this exact pattern** for the
handbook: fingerprint a surface, record it when docs are confirmed current,
fail when the surface moves.

The colophon's surface is the stack it claims to describe:

```
colophon fingerprint =
  sha(pinned image tags in app/deploy/compose.yaml)
  sha(dependency blocks of app/web + app/api manifests)
  sha(docs/decisions/INDEX.md)
```

`docs-sync-check` is already wired on `Write|Edit`; only its internal path
filter widens, in `scripts/`. When the stack moves, the check fails until
the colophon is updated and re-acked.

**Deferred, deliberately.** The paths it fingerprints do not exist until
`app/` is scaffolded, and a fingerprint over missing files is a check that
fails on day one and gets disabled by day two. It is specified here and
lands as the `infra` track's last work item, after the scaffold. Recorded
so it is not rediscovered.

---

## 5. Machinery that verifies machinery

### 5.1 `test-machinery.ts` — added (`IMPROVEMENTS.md` #2)

This mission changes the semantics of two hooks. There is no test for any
hook. Every one was verified by hand in the Phase 0 session — piped JSON,
checked exit codes — and none of that is reproducible from the repo.
Changing enforcement code that has no tests, in a system whose enforcement
fails **open**, is the specific thing `IMPROVEMENTS.md` #2 warns about.

`scripts/test-machinery.ts` encodes the smoke suite as executable checks,
driving each hook exactly as a session does
(`echo '{"tool_input":{"file_path":"…"}}' | node scripts/hooks/X.ts`) and
asserting exit codes. It covers, at minimum:

**36 assertions, all six hooks driven**, plus the three validators:

- `protect-reference`: write under `assets/reference/**` → 2
- `mission-gate`: dependency open → 2; closed **with** an APPROVED verdict →
  0; closed **without** a verdict → 2 (**the rubber-stamp case**); verdict
  present but REJECTED → 2; write to a **closed** mission's outputs → 2
  (§2.2's new rule)
- `protect-workshop`: `settings.json` and `settings.local.json` → 2 always;
  and all three phase regimes — during M5 everything opens; while M6 is
  in-progress everything is blocked; after M6 closes, `skills/`+`agents/` → 0
  while `scripts/hooks/**` and `scripts/*.ts` → 2
- `decision-guard`: valid ADR → 0; malformed → 2; `INDEX.md` edit → 2
- `docs-sync-check`: non-machinery path → 0; machinery path with docs in sync → 0
- `inject-project-state`: runs clean
- `validate-adr`: reciprocal `narrows`/`narrowed-by` → 0; one-directional → 1;
  dangling reference → 1 (ADR 0027)
- validators green on a clean tree

**Two of those cannot be asserted against the real repository** — the
rubber-stamp case needs a mission closed *without* an approved verdict, and
every real closed mission has one; the phase branches need Mission 6 closed,
which it is not. Both run against throwaway fixture mission trees in a temp
directory, with the hook invoked by absolute path so it resolves `missions/`
against the fixture. Without that, the Phase 2 split would first be exercised
when Phase 2 arrives, which is exactly when a mistake in it stops being cheap.

It is a plain script with no dependencies, run by hand and as **CI's first
job** — before typecheck, because a repo whose enforcement is broken should
not spend runner minutes on anything else.

**Honest limitation:** these are smoke tests of exit codes, not proofs. They
would catch a hook that stopped blocking; they would not catch a hook that
blocks the wrong thing in a case nobody thought to list. The phase table also
mirrors the implementation's own logic, so a shared misunderstanding would
pass both. That is the normal limit of a smoke suite and is worth more than
the zero tests that existed before.

### 5.2 `sync-docs.ts` diagram binding (`IMPROVEMENTS.md` #7)

Backlog item #7 is explicitly sequenced "During /m5" and is a plain
correctness fix with no counter-argument. Diagrams currently bind to
handbook blocks **positionally**: `DIAGRAM_NAMES[i]` pairs with the i-th
mermaid block, and the handbook contains no identifier at all. Reorder two
sections and `ack` will faithfully write the wrong diagram into the wrong
filename, the check will pass, and the filenames lie permanently — with the
tool's own remediation message as the trigger.

Fixed by putting identity in the source: `%% id: <name>` as the first line
of each block (mermaid comments render as nothing), matched by parsed id
instead of index. Missing, duplicate, and unknown ids become loud errors;
the count check stays as a backstop.

---

## 6. New skills, not new hooks

Two obligations need a home. Neither is mechanically enforceable, so
neither gets a hook — pretending otherwise would be worse than the gap.

- **`review-work`** — wraps the `red-team-reviewer` invocation for a Phase 2
  work item, carrying `context: fork` so the reviewer's isolation is
  **mechanical** rather than a promise. This closes the last purely
  behavioural rule in the project (`IMPROVEMENTS.md` #3). The field is real
  and current (verified 2026-07-22): a forked skill receives its own body,
  CLAUDE.md and preloaded skills, but not the parent conversation. It sets
  `agent: red-team-reviewer`, so the fork runs under that agent's tool
  restrictions and its refuse-if-context-is-visible standing order rather
  than as a general-purpose subagent.
  The behavioural rule **stays** as a backstop until the one-off behaviour
  test #3 asks for actually runs. **That test must confirm two things, not
  one:** that the forked context genuinely cannot see the parent
  conversation, and that `agent:` resolves a project-defined agent name (the
  documented examples are built-in types — custom agents are the natural
  reading, and it is unverified). If the second fails, the skill still runs,
  just as a general-purpose fork, and the reviewer's own refusal rule is what
  holds the invariant. That is precisely why the backstop was kept.
- **`publish-translation`** — the ordered checklist of the upstream grant's
  conditions, including the back-link PR that
  `content-model.md` §9 calls "the obligation most likely to be skipped at
  article #7." **A skill only fires when invoked, and that is weaker than a
  hook.** It is what is available: verifying the PR exists means querying a
  third party's repo, and a CI check that fails when someone else's server
  is down is a check that gets disabled.

**Neither skill sets `disable-model-invocation`, and that is deliberate.**
That flag means "runs only when Tal types the command" — which is why every
mission skill carries it. Setting it here would have quietly downgraded both
guarantees: `phase2-workflow.md` §4.1's **mandatory** Gated review would
become mandatory-if-remembered, and a **licence condition** would rest on Tal
recalling a slash command at the right moment. Both descriptions are written
as trigger conditions so a session can invoke them on its own initiative.

That is still weaker than a hook, and the difference is worth naming: a hook
fires on a path match whether or not anyone recognised the moment; a skill
fires when its description matches what the session believes it is doing. For
the back-link PR that gap is unavoidable (§6, above). For Gated review it is
not the only line of defence — the review class is declared before work
starts and recorded in the PR.

---

## 7. Correction to an inherited document

`phase2-scaffold-plan.md` §0 states that "`app/` must not exist before
Phase 2; the mission-gate hook enforces this." **It does not.**
`mission-gate.ts` matches only `missions/(\d{2})-[^/]+/outputs/` and has no
knowledge of `app/`. The realistic creation path — `pnpm create astro` —
runs through `Bash`, which no `Write|Edit` hook could intercept regardless.

The CLAUDE.md rule is real; the claim that a hook enforces it is false, and
a false enforcement claim is worse than a known gap because it stops people
looking.

**Decided (Tal, 2026-07-22): leave it unenforced, record it.** Two
paper-only missions remain, closing it properly needs a `Bash` matcher in
`settings.json` that only Tal can add, and the hole closes by expiry the
moment Phase 2 opens and `app/` becomes legitimate. Recorded here and in
`phase2-workflow.md` §9 because the scaffold plan cannot be edited.
