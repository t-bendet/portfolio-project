# Open items — `protect-workshop.ts` anchoring (from withdrawn PR #5)

Working queue, not a spec. Delete it when the last item closes.

**Origin.** PR #5 (`infra/anchor-workshop-hook`) tried to fix a false positive:
`protect-workshop.ts` blocks Write/Edit to the user-level `~/.claude/**` because
its regex matches any `/.claude/` path segment against an _absolute_ path. Red-team
review returned REJECTED with seven objections; Tal ruled objection O1 as **(b)** —
a session may not author enforcement-layer content even when Tal applies it by
hand (ADR 0032 decision 4 and its rejection log). The branch was withdrawn, not
revised. Nothing reached `main`.

**The two PR #5 comments are the source material** and outlive the closed PR:

    gh pr view 5 --comments

The first is the full verdict (O1–O7); the second is the fix specification
(properties 1–6 plus the test matrix).

**Standing constraint for every item below.** `scripts/**` and the settings files
are Tal's to author. A session writes specifications, reviews, and verification —
never the patch, never a staged file to `cp`, never a Bash/`sed` workaround. The
hook blocking a write is the signal to switch modes, not an obstacle. `docs/**`,
`docs/decisions/**`, `.claude/skills/**` and `.claude/agents/**` remain
session-editable.

**Run order.** Q1 and Q2 are independent. Q3 needs Q2's ruling. Q4 needs Q3.
Q5 needs Q2 and Q3. Q6 is last.

| #   | Item                                                                        | Who authors                  | Session may write          |
| --- | --------------------------------------------------------------------------- | ---------------------------- | -------------------------- |
| Q1  | Record the O1 ruling + the missing track/class for workshop-machinery items | session drafts, Tal approves | ADR + STANDING-CORRECTIONS |
| Q2  | ✅ RULED (i), ADR 0036 — guards user-level `~/.claude/settings*.json` (O5)   | Tal rules                    | ADR                        |
| Q3  | The hook fix itself (O2, O3, O4, O5)                                        | **Tal**                      | nothing in `scripts/`      |
| Q4  | Absolute-path assertions in `test-machinery.ts` (O6)                        | **Tal**                      | nothing in `scripts/`      |
| Q5  | HANDBOOK propagation sentence (O7)                                          | session                      | `docs/HANDBOOK.md`         |
| Q6  | Close-out: memory, IMPROVEMENTS, story capture                              | session                      | `docs/**`                  |

---

## Q1 — Record the O1 ruling and the workshop-machinery track/class gap

**NOT YET RUN.** Next free ADR id is **0037** (0036 is Q2's ruling). Q1 writes
its own ADR — do not fold Q2 into it. The `reindex`/`decision-guard` hooks assign
the number from the highest on disk, so 0037 is correct as long as no other ADR
lands first.

```
Read CLAUDE.md first, then `gh pr view 5 --comments` in this repo
(t-bendet/portfolio-project) for the full context — PR #5 is closed but its two
comments are the source material.

Background: red-team review of PR #5 raised objection O1 — that a session
authoring an enforcement-layer patch which Tal then applies by hand is the
alternative ADR 0032 decision 4 rejected outright ("have a session make the edits
under supervision"). Tal ruled (b): it IS that rejected alternative. Enforcement
patches are authored by Tal from a session-written spec. The branch was withdrawn.

Two things need recording, and nothing in the repo records either:

1. The interpretation itself. ADR 0032 decision 4 says sessions never edit
   `scripts/**`; what was NOT obvious, and is now settled, is that authorship
   counts as editing regardless of who runs the copy — the harm model is
   content-level, not keystroke-level. Evidence worth keeping: the
   session-authored patch introduced three fail-open paths (unguarded
   `realpathSync`, asymmetric realpath, user-level settings unguarded) and CI
   was green on all three.
2. `missions/05-ai-dev-workflow/outputs/phase2-workflow.md` §2 defines four
   tracks (infra/api/web/content), none of which own workshop machinery, and
   §4.1's Gated examples do not include the enforcement layer. PR #5 improvised
   OFF-TRACK + Gated and the reviewer accepted both, but that improvisation is
   unrecorded and the next workshop item will re-derive it.

Task: write ONE ADR covering both, following the `adr-keeper` skill exactly.
Decide for yourself whether it narrows ADR 0032 (per ADR 0027, both sides of
`narrows`/`narrowed-by` are required) or is a standalone decision — and justify
the choice in the ADR, don't just assert it. Include an honest rejection log; the
alternative "leave it to precedent from PRs #1-#5" deserves a real hearing.

`phase2-workflow.md` is a frozen mission output. If the ADR contradicts it, the
correction goes in `docs/STANDING-CORRECTIONS.md` as a new SC entry and the frozen
output stays as written.

Then: `node scripts/reindex-decisions.ts` is invoked by the post-write hook, but
verify `docs/decisions/INDEX.md` regenerated and `node scripts/validate-adr.ts`
is green. Branch `infra/<slug>` -> PR -> squash-merge per ADR 0026. Review class
is yours to declare before you start — argue it.

Stop and ask Tal before writing if you conclude the ruling should be recorded
somewhere other than an ADR.
```

---

## Q2 — Decide: does this hook guard user-level `~/.claude/settings*.json`? (O5)

**RULED (2026-07-23): option (i) — keep guarding, root-independent, before any
repo-scope check. Recorded as [ADR 0036](decisions/0036-workshop-hook-guards-user-level-settings.md)
(standalone, PR #9). This is property 5 and a required input to Q3.** Q2 no
longer folds into Q1's ADR — 0036 is its own record.

```
Read CLAUDE.md, then `gh pr view 5 --comments` (objection O5 in the first
comment, property 5 in the second).

The question: `scripts/hooks/protect-workshop.ts` currently blocks the user-level
`~/.claude/settings.json` by accident — its regex matches any `/.claude/` path
segment, and the same accident is what blocks the memory directory. Any repo-scoped
fix drops that coverage. CLAUDE.md's invariant reads without qualification —
"`.claude/settings.json` and `settings.local.json`: never, in any phase —
escalate" — and user-level settings do wire hooks and grant permissions, globally
and for every project. But this hook's stated job is guarding THIS repo's
machinery, and a repo hook policing the user's home config is arguably scope
creep that no ADR asked for.

Task: do NOT write code and do NOT edit the hook. Produce a short written analysis
for Tal:
  - What ADR 0028 and ADR 0032 actually claim jurisdiction over. Quote them.
  - What breaks in practice under each option. Be concrete about who writes
    `~/.claude/settings.json` and when.
  - Whether a repo hook can even see a reliable signal that a user-level settings
    write is happening, given it receives only `tool_input.file_path`.
  - A recommendation, with the strongest argument against it stated in full.

Two options to weigh, plus any third you find:
  (i) Keep guarding it — match `(^|\/)\.claude\/settings(\.local)?\.json$`
      against the raw path and exit 2 BEFORE any repo-scope check, so the guard is
      root-independent and survives every failure mode in O2-O4.
  (ii) Deliberately drop it — the hook goes repo-scoped, and the "No exception,
      ever" comment is rewritten to say "repo settings" plus one line stating the
      user-level surface is unguarded and why.

Shipping (ii) silently under the existing comment is not an option; the reviewer
called that the legibility failure ADR 0032's own Context objects to.

Present the analysis and STOP. Tal rules. Record the ruling as an ADR (or fold it
into Q1's ADR if that one has not merged yet) once he has ruled. His answer is a
required input to Q3 — do not start Q3 without it.
```

---

## Q3 — The hook fix (O2, O3, O4, O5)

```
Read CLAUDE.md, then `gh pr view 5 --comments` — the SECOND comment is the
specification (properties 1-6 and the test matrix). Confirm Q2 has been ruled
before starting; property 5 depends on it.

HARD CONSTRAINT: you may not write `scripts/hooks/protect-workshop.ts`. Tal
authors it. This was ruled on 2026-07-22 (objection O1, ruling (b)). Do not stage
a patched file anywhere, do not print a `cp`/`sed`/`patch` command, do not edit it
via Bash. If you catch yourself about to produce the file contents, stop — that
is the failure this rule exists to prevent.

Your job, in order:

1. Re-read the current `scripts/hooks/protect-workshop.ts` on `main` and confirm
   the defect is still present and still described accurately by the PR #5 spec.
   The spec was written against `ceaec22`; if `main` has moved, say so.
2. Restate the spec as a checklist Tal can implement against, folding in Q2's
   ruling. Properties, failure modes, and the reasoning behind each — not code.
   The three fail-open paths the reviewer found in the withdrawn attempt are the
   ones to design against:
     - `realpathSync` (or any I/O) unguarded: a throw exits 1, and exit != 2
       permits the write. The pre-change hook did no I/O after the JSON parse
       and could not throw.
     - Project root taken from `CLAUDE_PROJECT_DIR`/cwd unverified: a wrong root
       plus `^`-anchoring silently disables the hook entirely, with nothing
       thrown. Deriving the root from `import.meta.dirname` is a fact inside the
       repo; env and cwd are not.
     - Realpath applied to the root but not the file path: symlinked components
       make the two disagree, `relPath` gets a `../` prefix, exit 0 on real
       machinery paths. `/tmp` -> `/private/tmp` on darwin makes this live.
3. Hand it to Tal and STOP. He writes the code in his own editor.
4. After he says it is in: verify. Run `node scripts/test-machinery.ts` and
   `node scripts/validate-workshop.ts`, then hand-run the absolute-path matrix
   from the PR #5 spec by piping JSON to the hook, e.g.
   `echo '{"tool_input":{"file_path":"<abs path>"}}' | node scripts/hooks/protect-workshop.ts; echo $?`
   Report exit codes as a table against expected. Do not soften a mismatch.
5. Reviewing your own verification is not review. This is Gated (enforcement
   layer): run the `review-work` skill on the diff before merge, brief it fully
   the first time — track, class, contract, the unified diff, CI output quoted,
   and who authored the code. An underspecified brief gets REFUSED and wastes a
   round trip; the cap is 2 cycles.

Branch `infra/<slug>` -> PR -> squash-merge (ADR 0026). Tal's commit, your PR
body. Note in the PR body that the code is Tal-authored.
```

---

## Q4 — Absolute-path assertions in `test-machinery.ts` (O6)

```
Read CLAUDE.md, then `gh pr view 5 --comments` (objection O6, and the test matrix
in the second comment). Q3 should be merged first.

The problem: `scripts/test-machinery.ts` `runHook` (around line 39) feeds every
hook a caller-supplied path, and all 8 protect-workshop assertions (around lines
225-264) pass RELATIVE paths. They therefore exercise only the branch where path
resolution is a no-op. They passed before the bug existed, while it was live, and
after the attempted fix — they are evidence of nothing on this axis. The suite's
own header says hand-verification is the condition it was created to end.

HARD CONSTRAINT: `scripts/test-machinery.ts` is `scripts/*.ts` — frozen to
sessions, Tal authors it. Same rule as Q3. Write the test SPECIFICATION, not the
test code.

Task: specify the assertions owed, each as (input path, expected exit code,
what regression it catches):
  - user-level `~/.claude/projects/.../memory/x.md` -> allowed
  - user-level `~/.claude/settings.json` -> per Q2's ruling
  - repo `scripts/hooks/*.ts`, absolute AND relative -> blocked
  - repo `.claude/settings*.json`, absolute AND relative -> blocked
  - repo `.claude/skills/**`, `.claude/agents/**` -> allowed
  - a different repo's `scripts/*.ts` -> allowed
  - `CLAUDE_PROJECT_DIR` pointing at an ancestor, and at a nonexistent path ->
    repo machinery paths still blocked (the O2/O3 fail-open cases)
  - the repo reached through a symlinked root -> repo machinery paths still
    blocked (the O4 case; note `fixtureTree` already builds in `tmpdir()`, which
    is symlinked on darwin, so the fixture mechanism itself is the test vector)

For each, state how to construct it without a real second repo or a real home
directory — the suite must stay hermetic and must not touch Tal's actual
`~/.claude/`. Flag any case that cannot be tested hermetically and say so plainly
rather than specifying something that would write outside the fixture tree.

Hand to Tal, STOP, then verify after he implements: the suite must go from 25 to
25+N passing with 0 failed, and you should confirm each new assertion actually
fails against the OLD hook (`git stash` the fix, or check out `ceaec22`'s version
into a scratchpad copy and run against that). A test that passes both before and
after the fix is the exact failure mode O6 is about — prove these do not.

Gated. `review-work` before merge.
```

---

## Q5 — HANDBOOK propagation sentence (O7)

```
Read CLAUDE.md. Q2 and Q3 must be resolved first — this documents their outcome.

`docs/HANDBOOK.md` describes protect-workshop in two places: the mermaid sequence
diagram (around line 271, "path under .claude/ or scripts/?") and the plain-words
bullet list below it (around lines 292-298). Neither mentions a scope boundary,
because until Q3 there was none.

Task: update both so the repo-scoping rule is stated in a readable surface rather
than living only in an inline comment inside the file it governs. It must say:
which paths the hook now claims jurisdiction over, that paths outside the project
root are out of scope, and what that means for the user-level `~/.claude/`
directory (per Q2's ruling). Keep the HANDBOOK's voice — it is written to Tal,
in plain words, and it is not a spec.

Also check whether `docs/EVOLUTION.md` owes an entry, and whether the
"You are exempt: hooks bind Claude Code sessions, not your editor" line at the end
of that bullet is still accurate after the O1 ruling — it is the sentence the
withdrawn PR leaned on, and if it reads as broader than the ruling now allows,
tighten it.

`missions/05-ai-dev-workflow/outputs/hooks-plan.md` is frozen and per the reviewer
owes nothing here. Do not edit it. If you disagree after reading it, that is a
`docs/STANDING-CORRECTIONS.md` entry, not an edit.

Standard class unless you find a reason to argue otherwise. Branch -> PR ->
squash-merge.
```

---

## Q6 — Close-out

```
Read CLAUDE.md. Run only after Q1-Q5 have merged.

1. Verify the whole thing end to end on a fresh checkout of `main`:
   `node scripts/test-machinery.ts && node scripts/validate-workshop.ts &&
    node scripts/validate-adr.ts`, plus the absolute-path matrix by hand, plus a
   real Write to a file under `~/.claude/projects/.../memory/` to confirm the
   original false positive is actually gone from a live session. Report exit
   codes, not impressions.
2. Correct the agent memory at
   `~/.claude/projects/-Users-talbendet-Projects-portfolio-project/memory/` —
   `phase2-open-state.md` currently says the false positive is STILL OPEN and
   that memory writes must go through Bash heredocs. Both stop being true when
   Q3 merges. `enforcement-layer-spec-not-code.md` stays as written; the O1
   ruling outlives this bug.
3. `docs/IMPROVEMENTS.md` — the friction note. The honest one: the freeze cost
   two round trips and a withdrawn PR, and it caught three fail-open paths that
   green CI did not. Both halves.
4. `docs/research/story-capture.md` — worth retelling, if you judge it is. The
   shape: the enforcement layer refused an edit, the session routed around it
   with a copy-paste command that technically complied, and the review caught
   that the compliance was formal rather than real.
5. Delete `docs/HOOK-ANCHOR-QUEUE.md` (this file) in the same PR.

Routine or Standard, your call. Do not close this out while any Q item is
unmerged — say which are outstanding instead.
```
