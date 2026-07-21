---
mission: m5
reviewer: red-team-reviewer
date: 2026-07-22
cycle: 2
verdict: APPROVED
---

# Red-team verdict — Mission 5 (AI Dev Workflow), cycle 2

**APPROVED**, with three numbered corrections required before closure and one
observation. None of them is blocking: all four of cycle 1's blocking
objections are genuinely fixed — verified against the artifacts, not against
the revision's claims about them — and the two cheap-fix objections are
substantively fixed, one of them incompletely.

The three corrections are all numeric statements that undercount their own
enumerations. They must land before the STATUS flip, because `mission-gate`
now freezes this mission's outputs at closure (ADR 0028, decision 2) and two
of the three live in outputs.

---

## Cycle-1 objections, re-checked against the current artifacts

| # | Cycle-1 objection | Status | Evidence I checked |
|---|---|---|---|
| 1 | `CLAUDE.md` states the rule ADR 0028 replaced | **fixed** | `CLAUDE.md` lines 63–76 now carry both regimes verbatim against `scripts/hooks/protect-workshop.ts` lines 65–87 (M5-in-progress → allow all; `phase2Open && isInstructionSurface` → allow; else block), plus `settings.json` "never, in any phase" and a pointer to `test-machinery.ts`. Invariant 5 (lines 41–47) now states the narrowing relation, that the older ADR stays `active`, that both sides are required, and that relational frontmatter is metadata written post-hoc — which is the ADR 0027 compatibility argument the constitution previously did not know existed |
| 2 | `test-machinery.ts` does not cover the rubber-stamp case | **fixed, in code** | `scripts/test-machinery.ts` lines 62–82 add a `fixtureTree()` builder; lines 189–233 assert closed-without-verdict → 2, closed-with-REJECTED → 2, closed-with-APPROVED → 0. I traced these against `mission-gate.ts` lines 36–70: the fixture writes `mission: m1` / `depends-on: m1`, `missionDirFor` pads to `01-`, and the verdict regex `/verdict:\s*APPROVED/i` matches the fixture body — the assertions exercise the real branches, not a tautology. Lines 314–332 now also drive `docs-sync-check` and `inject-project-state`, closing the "four of six hooks" half of the objection |
| 2b | "23 assertions across five hooks" | **fixed, and now accurate** | I counted every `check()` call: 2 + 7 + 14 + 3 + 4 + 4 + 2 = **36**, across six hooks and three validators. ADR 0028 line 96, `hooks-plan.md` line 251 and `HANDBOOK.md` line 338 all now say 36 / all six hooks. One artifact was missed — finding 1 below |
| 3 | M4's rejection count inflated | **fixed** | `phase2-workflow.md` lines 47–57 and ADR 0025 lines 31–38 now say "**both** of its rejections", explicitly reconcile against `revision-cycles: 2` / cycle 3 APPROVED, and name the inherited miscount rather than silently dropping it. The stronger fact is now the one on the record, and the ADR was corrected while the mission is still in-progress rather than post-hoc |
| 4 | Both new skills set `disable-model-invocation: true` | **fixed** | Neither `review-work/SKILL.md` (lines 1–6: `name`, `description`, `context: fork`, `agent: red-team-reviewer`) nor `publish-translation/SKILL.md` (lines 1–4) sets the flag. `hooks-plan.md` lines 335–348 now state the removal, why it would have downgraded both guarantees, and — separately and honestly — that a skill firing on description match is still weaker than a hook firing on path match |
| 5 | `phase2-workflow.md` delivered as a draft | **fixed** | Line 3 now reads "opened 2026-07-21, final 2026-07-22"; no draft marker |
| 6 | Skill-count contradictions | **partly fixed** | ADR 0029 line 78 — the immutable half, and the one cycle 1 emphasised — now says "four skills (`adr-keeper`, `mission-protocol`, `prompt-craft`, `review-work`)". I verified that by grep: the escalation-target references are `adr-keeper` ×2, `mission-protocol`, `prompt-craft`, `review-work` = 5 references across 4 skills. This is a *better* count than the "three" cycle 1 suggested; the recount was done rather than the suggestion obeyed. `HANDBOOK.md` line 219 and `IMPROVEMENTS.md` line 20 agree at four. The travelling-set count did not survive the recount — finding 2 below |

---

## Contract audit (cycle 2)

| # | Item | Present | Substantive |
|---|---|---|---|
| 1 | `phase2-workflow.md` | yes | yes — §3 roles, §4.1 three classes with the "why these are gated" argument, §4.2 cap 2 with its reasoning, §4.3 propagation checklist, §5 delegation with a stated refusal, §7 five checkpoints |
| 2 | `worktree-and-branching.md` | yes | yes — §2.1's Compose project-name/volume collision is a mechanism-level reason, not a preference; §3's exception is bounded by a mechanical test; §5 separates the Phase 1 and Phase 2 models; §5.4 flags branch protection as an honest non-guarantee |
| 3 | `hooks-plan.md` | yes | yes — `test-before-commit` rejected on three grounds, budget checks relocated to `ci.yml` stages with the reason (Lighthouse needs a built site, a server, a browser), nothing retires with a per-hook argument including the load-bearing `inject-project-state` case |
| 4 | `plugin-spec.md` | yes | yes — format verified by lookup, `${CLAUDE_PLUGIN_ROOT}` identified as the fact that makes it feasible, "specified, not published" argued rather than deferred, §4 names the dangerous class as unfixed |
| 5 | `tmux-layout.md` | yes | yes — skipped with a reason that names what would have depended on it (nothing) |
| 6 | `.claude/` assets | yes | yes — 2 new skills, 3 skills parameterised, 7 agents updated. I checked all of them against `validate-workshop.ts`: both new skills have `name` matching folder and descriptions well over 20 chars and are not mission skills, so the mission-template sections do not apply; every agent still has `tools`, judgment agents still have `skills` |
| 7 | ADR-narrowing fix | yes | yes — still fully discharged; re-verified below |
| 8 | `review-verdict.md` | this file | — |

Scope: clean. No `app/`, no application code, no `settings.json` edit
(`docs/.docs-fingerprint.json` records the same `settings` hash and git status
shows it unmodified), every mechanical change in `scripts/`.

---

## Findings (corrections required before closure; no further review cycle needed)

### 1. `IMPROVEMENTS.md` still records the pre-revision assertion count

**Artifact:** `/Users/talbendet/Projects/portfolio-project/docs/IMPROVEMENTS.md`
line 16, against `docs/decisions/0028-phase2-enforcement-layer.md` line 96,
`missions/05-ai-dev-workflow/outputs/hooks-plan.md` line 251 and
`docs/HANDBOOK.md` line 338.

The backlog's status table says:

> | 2 | **Done.** `scripts/test-machinery.ts` — 23 assertions, phase-aware,
> CI's first job. ADR 0028 |

The suite has 36. The revision that grew it from 23 to 36 updated the ADR, the
hooks plan and the handbook, and missed the fourth surface — which is the
`phase2-workflow.md` §4.3 item 1 defect class ("a claim true in one place and
false in another") landing inside the mission that wrote the checklist, for the
second cycle running. It undercounts rather than overstating enforcement, which
is why it is not blocking.

**Fixed looks like:** "36 assertions" in that row.

### 2. The travelling-skill count is off by one in three places, and `plugin-spec.md` §4 contradicts its own tables

**Artifacts:** `missions/05-ai-dev-workflow/outputs/plugin-spec.md` lines 93–95
and 180–182; `docs/HANDBOOK.md` lines 215–217.

`plugin-spec.md` §4 opens:

> **Eight references across seven capability skills**, splitting cleanly into
> four that name a role and three that bake in a domain assumption

Three lines later its own subsection headings say "**(5 references, 4 skills)**"
and "**(3 of the eight references, 4 skills)**", and the not-fixed table lists
four rows (`security-review`, `tech-eval`, `design-tokens`,
`performance-review`). 4 + 4 = eight skills, not seven; and "three that bake in
a domain assumption" is contradicted by the "4 skills" heading directly beneath
it. Both readings of "seven" fail: if it means the pre-existing capability
skills, then the split is three role-name and four domain-assumption, i.e. the
sentence has them backwards.

The same off-by-one propagated: `plugin-spec.md` §2's tree lists **eight**
travelling skills (`adr-keeper`, `prompt-craft`, `mission-protocol`,
`tech-eval`, `security-review`, `performance-review`, `design-tokens`,
`review-work`), and `HANDBOOK.md`'s own table marks exactly two of ten as
non-travelling — yet `HANDBOOK.md` line 215 says "Seven of these are the
reusable set" and `plugin-spec.md` line 182 says "it is seven, not eight". The
arithmetic that produced seven (original eight minus `brand-voice`) dropped
`review-work`, which this mission added and which §2 ships.

This is cycle-1 objection 6's second half, still open — though it is open
*because* the revision took my literal suggestion ("seven") while its own
better recount added `review-work` to the set. §4 is designated the handover
for whoever extracts later, and it freezes at closure, so the count should be
right on the record.

**Fixed looks like:** in `plugin-spec.md` §4, "Eight references across eight
capability skills, splitting into four that name a role and four that bake in a
domain assumption"; in §6, "it is eight, not the eight the handbook meant —
`brand-voice` leaves and `review-work` joins — and they do not travel yet" or
any wording that matches §2's tree; in `HANDBOOK.md` §5, "Eight of these".

### 3. The `app/` decision is dated two different days

**Artifacts:** `missions/05-ai-dev-workflow/outputs/phase2-workflow.md` line 406
("**Decided (Tal, 2026-07-21): leave it unenforced and record it**") against
`docs/decisions/0028-phase2-enforcement-layer.md` line 78 and
`hooks-plan.md` line 364, both of which date the same decision 2026-07-22.

Trivial in consequence, and I would not raise it alone — but this mission
records decision provenance by date and attribution deliberately, and the ADR
is the artifact that freezes.

**Fixed looks like:** one date, matching ADR 0028.

### 4. Observation, not a correction: `IMPROVEMENTS.md` #4 is the honest gap and it is named

`IMPROVEMENTS.md` lines 23–30 state plainly that the friction log never
happened, that "Mission 5 designed [the workflow] without that evidence, from
argument", and that ADR 0025's "until real friction demands it" bar now has no
mechanism that would ever produce the demand. That is the most self-critical
paragraph in the mission and it is correct to have written it. Recorded here so
it is not mistaken for an oversight in Mission 6's coherence pass: the proposed
remedy (a three-bullet friction note in each Phase 2 PR description) is a
suggestion in a backlog, not a decision in any ADR, and nothing carries it into
`phase2-workflow.md` §8's work-item sequence. If it is meant to bind, it needs
to be in the workflow document or an ADR; if it is not, the current wording is
fine.

---

## Verified sound (recorded so cycle 3, if it happens, does not re-litigate)

- **Contract item 7 remains fully discharged.** Frontmatter re-read directly:
  `0019 narrowed-by: 0023`, `0023 narrows: 0019`, `0020 narrowed-by: 0024`,
  `0024 narrows: 0020`, all four still `status: active`.
  `validate-adr.ts` splits shape (per-file, lines 86–108) from reciprocity
  (`validateNarrowingGraph`, lines 114–154) with the write-order deadlock
  argued at lines 86–91, and additionally catches a narrowing pointed at a
  now-`superseded` ADR (lines 145–150) — a case nobody asked for.
  `reindex-decisions.ts` lines 41–54 compose status and narrowing notes rather
  than choosing between them; `INDEX.md` carries the legend and both bold rows;
  `inject-project-state` puts that index in every session, which is the reach
  argument. `test-machinery.ts` lines 366–413 assert the one-directional catch,
  the deliberate per-file tolerance, and the dangling reference.
- **The enforcement code matches every claim made about it.** I read
  `protect-workshop.ts` and `mission-gate.ts` line by line against ADR 0028's
  decisions 1 and 2, `hooks-plan.md` §2.1/§2.2, the `hooks-enforcement` diagram
  and `CLAUDE.md`. All six statements agree, including the M6-gets-no-allowance
  case (`phase2Open` requires `06-*/STATUS.md` = `closed`, and the suite
  asserts the in-progress-M6 branch against a fixture at lines 302–311).
- **`sync-docs.ts` id binding** is implemented as specified; `ack` refuses on
  any id problem before writing anything (lines 176–184). I diffed the
  `hooks-enforcement` handbook block against `docs/diagrams/hooks-enforcement.mmd`
  byte-for-byte at the visible level — identical, including the `%% id:` line.
  The fingerprint is an inventory of names plus two file hashes, so this
  cycle's content-only edits to `test-machinery.ts` and `HANDBOOK.md` prose do
  not stale it; the recorded inventory matches the current tree.
- **Retirements do not strand Mission 6.** `m6-blueprint-gate` delegates only
  to `red-team-reviewer` (lead, and a second instance for its own verdict),
  both of which are kept.
- **Rejection logs are real.** ADR 0026 rejects worktree-per-track on Compose
  volume semantics; ADR 0028 rejects "unfreeze on green" against the actual
  capability of `validate-workshop.ts`; ADR 0029 rejects full parameterisation
  on an argued cost (vaguer instructions get ignored under context pressure)
  and nearly chose the option it rejected, saying so.
- **`hooks-plan.md` §5.1's coverage list now matches the code.** I checked each
  bullet against a `check()` call. The two claims that were false in cycle 1
  ("all six hooks", "the rubber-stamp case") are now true.

## Cycle discipline

Cycle 2 of 3 (`mission-protocol` §6). Approved, so the cap is not reached and
no escalation is triggered. Findings 1–3 are text edits with no re-review; they
must land before `status: closed`, after which `mission-gate` blocks writes to
this directory (ADR 0028) and the corrections would themselves require a new
ADR.
