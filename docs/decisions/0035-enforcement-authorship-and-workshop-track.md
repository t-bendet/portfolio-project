---
id: 0035
title: Authoring enforcement-layer content counts as editing it; workshop machinery is infra-track and always Gated
status: active
date: 2026-07-22
decided-by: tal
mission: phase-2
reopened-by: null
superseded-by: null
narrows: 0025, 0032
---

## Context

PR #5 (`infra/anchor-workshop-hook`) set out to fix a real false positive:
`protect-workshop.ts` matches any `/.claude/` path segment against an
absolute path, so it blocks `Write`/`Edit` to the user-level
`~/.claude/projects/.../memory/*.md` — a directory this repo's machinery has
no business policing. The session wrote the patch, Tal applied it by hand,
CI went green, and the red-team review returned REJECTED with seven
objections. The first outranked the other six: this is the alternative ADR
0032's rejection log had already refused, arrived at through a different
door. Tal ruled it (b) on 2026-07-22. The branch was withdrawn rather than
revised; nothing reached `main`. The false positive is still open and is
tracked separately.

Two things follow from that episode, and nothing in the repo records either.

**The interpretation.** ADR 0032 decision 4 reads: *"sessions still never
edit `scripts/**` or the settings files."* Applied literally to what PR #5
did, no session edited anything. The `Write` tool never touched `scripts/`.
The hook never fired. A human ran the copy. The rule as written describes a
keystroke, and the session read it that way — not dishonestly, but as the
plain meaning of the word "edit".

What is now settled is that the harm model is **content-level**. ADR 0028
decision 1 states why the checker is frozen at all: a bad hook edit yields
"silently absent enforcement", and that is a property of who reasoned about
the bytes, not of who typed them. Hand-application makes it worse rather
than better: a `Write` permission prompt shows Tal the diff, and a `cp`
shows him a filename.

The evidence is in the review rather than in the argument. The
session-authored patch introduced three fail-open paths — an unguarded
`realpathSync` whose throw exits 1, and any exit other than 2 permits the
write; a project root taken on faith from `CLAUDE_PROJECT_DIR`, where a
wrong root plus `^`-anchoring disables the entire hook with nothing thrown;
and user-level `~/.claude/settings*.json` becoming session-writable beneath
a comment reading "No exception, ever". `test-machinery.ts` was green on all
three, because its eight `protect-workshop` assertions pass relative paths
and so never exercise the branch that changed. A green suite on an
enforcement change is not evidence of anything. That is what "fails open and
silently" means when it actually happens.

**The gap.** `missions/05-ai-dev-workflow/outputs/phase2-workflow.md` §2
defines four tracks — `infra`, `api`, `web`, `content` — and none of them
owns the workshop's own machinery. §4.1's Gated examples name every
GitHub Actions workflow but not the enforcement layer that governs them.
PR #5 improvised "OFF-TRACK" plus Gated, the reviewer accepted both, and
nothing recorded it. Improvisation that survives a review becomes precedent
without ever having been decided, and the next workshop item re-derives it
— possibly differently, and with no way to tell which answer was the
considered one. ADR 0034's rejection log named this failure once already.

## Decision

**1. Authorship is editing.** A session may not produce the *content* of
`scripts/hooks/**`, `scripts/*.ts`, `.claude/settings.json`, or
`.claude/settings.local.json` in any form, regardless of who applies it.
Not a patch, not a staged file to `cp`, not a `sed`/`patch`/heredoc
invocation, not the file's contents written out in prose for copying. Tal
authors the enforcement layer. (Ruled by Tal, 2026-07-22, on objection O1 of
PR #5.)

This narrows ADR 0032 decision 4 by fixing the scope of "edit", and reaches
ADR 0028 decision 1 through it. What is *checked* — `.claude/skills/**`,
`.claude/agents/**` — is unaffected and stays session-editable.

**2. The session's deliverable for an enforcement change is a specification
and, afterwards, a verification report.** The specification states
properties, failure modes, the reasoning behind each, and the test matrix —
not code. Tal writes the code in his own editor. The session then verifies:
runs `test-machinery.ts` and `validate-workshop.ts`, hand-runs the matrix,
and reports exit codes against expected without softening a mismatch. The
pull request body names Tal as the author of the code.

The hook refusing a write is the signal to switch modes, not an obstacle to
route around. A session that finds itself composing the file contents has
already failed, whatever it does with them next.

**3. Workshop machinery belongs to the `infra` track.** §2's `infra` row
gains, alongside the Dockerfiles and workflows: `scripts/**`,
`.claude/skills/**`, `.claude/agents/**`, both settings files, and the
workshop process documents. Law for such an item is ADRs 0025–0032 plus
`missions/05-ai-dev-workflow/outputs/hooks-plan.md`.

`infra` is where this belongs because ADR 0034 and SC-2 already put
`workshop.yml` there, and `workshop.yml` exists only to run
`validate-workshop.ts`, `validate-adr.ts`, and `test-machinery.ts`. Splitting
the workflow from the scripts it invokes would break §2's "one track at a
time" rule by construction, since one change routinely touches both.

§2's ordering sentence — `infra` scaffolds first, then `api` and `web`,
then `content` — is about the four *build* tracks and the dependency facts
between them. A workshop-machinery item sits outside that chain and may run
at any time; it does not consume the ordering and is not blocked by it.

**4. The enforcement layer is always Gated.** §4.1's Gated list gains
`scripts/hooks/**`, `scripts/*.ts`, and the settings files. This is the
purest instance of §4.1's own stated criterion — a case where a passing
build and a broken system are compatible — and the PR #5 patch is the
worked example: three fail-open paths, green CI, and only a fresh-context
adversarial reader found them.

Because decision 2 makes the session the *verifier* rather than the author,
the Gated review is not optional recursion: reviewing one's own verification
is not review, and the review is what stands between a green suite and an
enforcement layer that no longer enforces.

## Consequences

- Every enforcement change now costs at least one round trip through Tal and
  cannot be finished inside a session. That is real friction, and it lands
  on exactly the small, obvious fixes where it feels least deserved — the
  PR #5 defect is a regex, and it is still open weeks after being found. The
  other half is equally real: the freeze is why three fail-open paths did not
  reach `main` under a green CI.
- `infra` becomes a broad track — AWS provisioning and repo governance under
  one prefix. Accepted over a new namespace because it matches what PRs #1–#5
  actually did, and because §2's tracks are ownership boundaries rather than
  a taxonomy that has to be tidy.
- Gated on every enforcement item means a fresh-context review even for a
  comment change in a hook. Accepted at the cap of 2: the class is declared
  by what a mistake costs, and in this file a mistake costs silence.
- This is a tightening, not a codification of what was already happening.
  `infra/workshop-cleanup` — the item that hand-edited
  `protect-workshop.ts`, `test-machinery.ts` and `validate-workshop.ts` under
  ADRs 0030–0032 — shipped as **Standard**
  (`docs/PHASE2-CLEANUP-TODO.md` line 4). That was defensible on its facts:
  Tal-authored, ADR-backed clause by clause, and mostly deletion. It is also
  the change that left `test-machinery.ts` with eight relative-path
  assertions that PR #5 then passed while shipping three fail-open paths.
  The two items are not retroactively reclassified; the rule applies forward.
- Two sections of a frozen Mission 5 output are now incomplete. They are
  corrected rather than edited, via `docs/STANDING-CORRECTIONS.md` SC-3
  (ADR 0028).
- `CLAUDE.md`'s operating rules still state the rule in its keystroke-level
  short form — "you may edit what the enforcement layer checks; you may not
  edit the checker" — which is the reading PR #5 acted on. It is the first
  document every session reads, so it is the highest-value surface for
  decision 1 and the one this ADR does not reach. Owner: Tal. It is outside
  the scope this work item was given.
- A session denied the ability to write the fix will be tempted to write it
  anyway "as an illustration". Decision 1 names that case because naming it
  is the only enforcement available: no hook can see prose.

## Alternatives rejected

- **Leave it to precedent from PRs #1–#5.** The strongest alternative, and it
  deserves the hearing. Five merged pull requests all used the `infra/`
  prefix for workshop work, one of them declared Gated and was reviewed as
  such, and the O1 ruling is written out in full in a comment on PR #5. A
  reader who follows the trail arrives at every answer in this ADR. Rejected
  on three counts. First, the precedent is not consistent with itself:
  `infra/workshop-cleanup` edited three enforcement-layer files as
  **Standard**, PR #5 declared **Gated**, and a reader inheriting both has no
  way to tell which was the considered one. Second, the trail is unreadable:
  PR #5 is *closed and withdrawn*, so its precedent is the precedent of a
  rejected branch, and its own visible declaration was "OFF-TRACK", which
  decision 3 overturns — precedent here would teach the wrong lesson. Third, `docs/decisions/` is
  this project's declared source of truth and `INDEX.md` is what every
  session is handed; a rule that lives only in GitHub comments reaches nobody
  who does not already know to look. This is the same argument ADR 0027 made
  for surfacing narrowings in the index rather than in a workflow step, and
  it was correct there for the same reason.
- **Ruling (a): permit session-authored enforcement patches under mandatory
  Gated review.** The option Tal was offered and declined, kept here because
  it is defensible. It costs no round trip, and the review that would gate it
  is exactly the review that caught all three fail-open paths — so on the
  evidence of PR #5 the safety net demonstrably works. Rejected because the
  net worked *once, under maximum attention*, on a branch already under
  suspicion for an unrelated reason; and because the property ADR 0028
  protects is not "defects are caught" but "the enforcement layer is
  understood by the person who is accountable for it". A reviewer approving
  a patch nobody on the human side has reasoned about restores the exact
  configuration ADR 0032's rejection log refused.
- **A fifth `workshop` track.** Cleanest by the taxonomy: §2 defines a track
  as an ownership boundary with its own law, and the machinery qualifies on
  both counts. Rejected on the seam it creates. ADR 0034 and SC-2 place
  `workshop.yml` in `infra`, and that workflow's only content is invocations
  of the three validators; a change to `test-machinery.ts` that also changes
  the workflow would span two tracks, which "one track at a time" forbids.
  A new branch prefix also strands the five `infra/`-prefixed pull requests
  that already did this work.
- **Keep "OFF-TRACK" as a standing category** for work that fits no track.
  Rejected: §2's entire function is to say which specs are law for a change,
  and OFF-TRACK answers "none", which is false — ADRs 0028, 0029, 0031 and
  0032 are all law for a machinery change. An escape hatch on a
  classification scheme is where classification goes to stop happening.
- **Record the O1 ruling in `docs/HANDBOOK.md` or `docs/IMPROVEMENTS.md`
  instead of an ADR.** Tempting because the ruling reads like guidance rather
  than architecture. Rejected: it is a decision that changes what sessions
  may do, made by Tal, against a recorded alternative — every property of an
  ADR. HANDBOOK is written to Tal in plain words and explains machinery that
  already exists; it is downstream of this, and Q5 of the queue owes it a
  propagation sentence once the hook fix lands.
- **Write this as a standalone ADR rather than a narrowing of 0032.** The
  honest counter-argument, and it nearly won. ADR 0032 read *whole* already
  contains the answer: its rejection log refuses "have a session make the
  edits under supervision" without discussion, so a reader who reaches the
  bottom of the file does not make PR #5's mistake. On that view nothing is
  corrected here, and claiming `narrows` for a confirmation inflates a
  relation ADR 0027 deliberately kept narrow — the same degradation into an
  optional "see also" that 0027 rejected a generic `related:` key for.
  Rejected because the two readings give *different answers to the same
  question*: decision 4's operative sentence permits what decision 1 forbids,
  and "session drafts, Tal applies" is not literally "edits under
  supervision" — the rejection log records a refused alternative, not an
  operative rule, and it took an adversarial reviewer to connect the two.
  Once a demonstrated misreading exists, the narrowing note in `INDEX.md` is
  the only mechanism that reaches a reader who has not yet made it. ADR 0028
  is deliberately *not* narrowed a third time: it already carries
  `narrowed-by: 0031, 0032`, so its reader is routed through 0032 and arrives
  here anyway, and a third id on that row buys reach that already exists at
  the cost of the row's legibility.
