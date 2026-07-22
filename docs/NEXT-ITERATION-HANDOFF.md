# Next-Iteration Handoff — what to build differently

Written 2026-07-22, after a top-to-bottom audit of the workshop (5 missions
closed, M6 pending, zero app code). Audience: whoever extracts this process
into a plugin/template that anyone can use to blueprint-then-build their own
portfolio. This is the honest retrospective ADR 0029 deferred.

The one-line diagnosis: **the machinery is high quality and the outputs are
good, but effort flowed to what agents are good at (building machinery)
instead of what the project needed (evidence and shipping).** ~3,000 lines of
machinery and meta-docs, 29 ADRs, 0 lines of app. The cheapest improvements
(timeboxes, friction logs — IMPROVEMENTS.md #1/#4) never happened while a
427-line hook test suite did. A template must invert that bias.

---

## 1. What earned its place — ship these in the template

These are the load-bearing ideas. Everything else is optional.

1. **The ADR system, exactly as-is.** Flat `key: value` frontmatter, generated
   INDEX, never-edit-reasoning / never-delete rules, status flips over
   rewrites. The dependency-free validator falls out of the flat constraint.
   This is the template's core.
2. **Fresh-context adversarial review with a written verdict.** The
   red-team-reviewer running isolated (`context: fork`), receiving only the
   contract + artifacts, writing `verdict: APPROVED|REJECTED` with numbered,
   falsifiable objections. It demonstrably caught real defects (M4's
   propagation failures). The single best idea in the project.
3. **The rubber-stamp check.** "Closed" = STATUS flip **plus** the reviewer's
   verdict file. A status flip alone unlocks nothing. This is the one piece of
   gate logic worth mechanizing.
4. **Session state injection.** A SessionStart hook printing the decision
   index + mission statuses. Highest value per line in the repo.
5. **The mission-prompt template** (prompt-craft): memory block → starting
   state → input manifest → output contract → scope boundaries → stop
   conditions → checkpoints. Genuinely good prompt engineering; portable
   as-is.
6. **Risk-tiered review for the build phase** (ADR 0025's content):
   Routine / Standard / Gated, class declared before work starts, cap of 2.
   Proportionate where the mission model is not.
7. **Small deterministic tools over model judgment** where the question is
   arithmetic: `contrast.ts` (WCAG), `reindex-decisions.ts`. Never spend
   tokens computing what a script can.
8. **`protect-reference`** — a 30-line "inputs are read-only" hook. Cheap,
   real.

## 2. What I would not build again

- **The docs-sync apparatus** (`sync-docs.ts`, fingerprinting, mermaid
  extraction to `docs/diagrams/`, the id-binding fix). Machinery to detect
  drift in documentation *of the machinery* — meta-squared. Fix: diagrams
  live only in the handbook; no extraction, no fingerprint, no ack workflow.
- **Phase-regime logic in `protect-workshop`** (three regimes keyed off
  mission statuses, ADR 0028's split). The durable insight is one static
  rule: *sessions may edit instructions (skills/agents); never the checker
  (hooks, validators, settings).* Ship that rule with no phase detection.
- **Plugin parameterization before a consumer exists** (the "PROJECT
  PARAMETERS — escalation target" headers threaded through five skills, for
  a plugin ADR 0029 then decided not to publish). Extract when a second user
  exists, not before. IMPROVEMENTS.md #6 predicted this and was half-ignored.
- **Agent-species linting** (`validate-workshop.ts`'s judgment/worker
  taxonomy, required section headings, pinned-model rules). Linting your own
  prompt files' formatting. Keep only: name + description present, mission
  skills carry `disable-model-invocation: true`.
- **Retired-agent tombstone files.** Git history is provenance. Retired agent
  descriptions are injected into every session's context — you pay tokens
  per session for a memorial. Delete on retirement; note it in one line of
  the handbook.
- **The narrowing-graph validator** (ADR 0027's reciprocal check +
  write-order-deadlock handling, for a relation with 2 live instances). The
  fix that mattered was the INDEX `Note` column making the relation visible.
  Keep `narrows`/`narrowed-by` keys and the note; drop the graph validator.
- **Process deliverables about the process**: `tmux-layout.md`, a full ADR
  rejecting worktrees (0026), a mission (M5) largely about designing the
  workflow for the next phase. Fold the workflow call into the gate mission.

## 3. Structural changes for the template

**Six missions → three.** The full ceremony (branch, STATUS, contract,
fresh-context review, verdict, handoff) has a fixed cost proportionate to
architecture-sized decisions, not to "design the process for the next phase."

| # | Mission | Absorbs |
|---|---------|---------|
| 1 | Identity + Design System | old M1 + M2 |
| 2 | Architecture + Information Architecture | old M3 + M4 (keep the "architecture must not read design outputs" firewall as an intra-mission rule) |
| 3 | Workflow + Blueprint Gate | old M5 + M6 |

**Timebox every mission from day one** (`timebox-sessions: N` in STATUS
frontmatter; hitting it triggers "decide with what we have"). This was
IMPROVEMENTS.md #1, rated highest leverage, never done. Make it part of the
template's STATUS schema so it cannot be skipped.

**Friction logs are part of the output contract, not optional.** Three
bullets per mission: what happened → what it cost → suggested change. This
was #4, the cheapest item, never done — and its absence meant the workflow
mission designed from argument instead of evidence. In the template, the
final mission's input manifest *is* the friction logs.

**Hooks: ship four, not six.** inject-project-state, decision-guard (ADR
validation + reindex), protect-reference, and one simplified protect-machinery
(the static rule above). The gate check (rubber-stamp) can live in the mission
skill's step 1 + the review skill; if mechanized, fold it into
decision-guard's file rather than a fifth hook. Fewer hooks → smaller test
suite → less weight defending weight.

**Keep the machinery-edit asymmetry honest about its cost.** "Sessions never
edit hooks" means every hook bug routes through the human's hand-editing,
forever. For a solo user whose interface is the agent, consider the
alternative: allow the edit if `test-machinery` passes and the diff is
reviewed by the human before merge. Blanket blocks are simpler; pick one
deliberately per project.

## 4. Sequencing advice for the next run

1. Bootstrap: ADR system + the four hooks + red-team agent + review skill.
   One session.
2. Decompose any existing decisions into ADRs; human signs off statuses.
3. Run the three missions, timeboxed, friction-logged.
4. Gate: coherence review + security/performance design mode + GO/NO-GO.
5. Build. First act: scaffold the app. Resist every mid-build urge to add
   machinery — the bar (IMPROVEMENTS.md, "Deliberately rejected") stands:
   *does a real friction-log entry demand it?*

## 5. What this repo should do (not the template)

See `docs/PHASE2-CLEANUP-TODO.md`. Do not restart this project — the mission
outputs (ADRs 0014–0024, tokens, page briefs, content model) survive any
process critique. Close M6 fast and build.
