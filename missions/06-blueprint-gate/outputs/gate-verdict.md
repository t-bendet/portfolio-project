# Gate Verdict — Phase 2

Mission 6 · 2026-07-22 · Basis: `coherence-report.md`,
`completeness-report.md`, `security-requirements.md`,
`performance-budgets.md`. Checkpointed with Tal twice (after the coherence
report; before this verdict). Verdict confirmed by Tal at checkpoint 2.

---

## VERDICT: **GO** — with four conditions and three standing corrections

The blueprint is coherent and complete enough to build. Twenty-one active
ADRs were read against each other and against every mission output; no
finding invalidates a decision, no contradiction exists between any two
ADRs, and the two known narrowings (0023→0019, 0024→0020) are correctly
recorded, indexed, and validator-enforced. The scaffold plan is executable
today for its local half; the workflow, enforcement layer, and review
machinery for Phase 2 exist and are tested (34/0/2 machinery assertions at
mission open).

Phase 2 opens when this mission's STATUS reads `closed` (the mechanical
definition in ADR 0028), which also unlocks `.claude/skills/**` and
`.claude/agents/**` for sessions and freezes this mission's outputs.

## Conditions (binding on Phase 2; each has an owner and a trigger point)

| # | Condition | Owner / trigger |
|---|---|---|
| G-1 | **The `infra/workshop-cleanup` work item (PHASE2-CLEANUP-TODO.md) may not run** until its conflicts with ADRs 0025/0028 (coherence C1, C5) are resolved — by new ADRs or by Tal amending the TODO. All other Phase 2 work is unaffected. (Tal's checkpoint-1 disposition.) | Tal, before that work item |
| G-2 | **The scaffold skips `phase2-scaffold-plan.md` §2's "sitemap i18n hreflang" instruction** — @astrojs/sitemap is configured *without* its `i18n` option (ADR 0023; coherence C2). Revisitable only if the own-article-in-both-languages case (content-model §4.5) lands. | scaffold session, plan §2 |
| G-3 | **Cloud provisioning (plan §6) is gated on Tal choosing the domain.** Local scaffold §1–§5 proceeds without it. | Tal, before §6 |
| G-4 | **Instance region is chosen against the primary audience (Israel), not the pricing example (us-east-1)**, and t4g.micro pricing + public-IPv4 billing are re-verified in the chosen region against G6's $15 ceiling before any resource is provisioned (performance-budgets §7; ADR 0021's own §0.3 obligation widened by one variable). | provisioning checkpoint (phase2-workflow §7.2) |

## Standing corrections (frozen documents; the corrections live in M6's outputs)

1. **hreflang** — as G-2; the frozen plan's instruction is wrong under ADR
   0023.
2. **Warm theme font payload is 4 families, not 3** (`typography-spec.md`
   §9 miscount; coherence C3). `performance-budgets.md` §4.2 carries the
   corrected accounting.
3. **`home.md` §5's "no new dependency class" justification for the
   beacon is wrong**; `content-model.md` §6 governs (coherence C4). The
   decision stands; only the recorded reason is corrected.

(The three inherited corrections M5 already recorded — the false `app/`
hook claim, the CI RTL stage's M4 additions, "no zero-JS routes" — remain
in force via `phase2-workflow.md` §9.)

## Handoffs into Phase 2 (produced by this mission, read by the tracks)

- **`security-requirements.md`** — SR-1…SR-24; the CI `sec` stage's source
  of truth, and the checklist the Gated reviews of auth, Caddyfile,
  compose, workflows, IAM, and the theme mechanism verify against.
- **`performance-budgets.md`** — the CI `perf`/`bundle` stages' source of
  truth; budgets are contracts, moving one requires an ADR.
- **`completeness-report.md` §5** — the compiled twelve-item CI obligation
  list (`ci.yml` is one artifact; the obligations were scattered across
  five documents).
- **`completeness-report.md` §2.2** — the scaffold verification batch is
  **seven** items, not the plan's five: add the Caddy `handle_errors`
  /he/404 mechanism (with real 404 status) and the glob-loader
  body-at-`getStaticPaths` question.
- **Routed low-severity findings:** C6 (colophon fingerprint over-breadth
  → the `infra` item that implements it), C7 (incantation's shipped form →
  the theme-mechanism Gated review, with SR-23/24).

## What a NO-GO would have required, for the record

Only C1 approached blocking severity, and it blocks one work item, not the
phase: the contradiction is between the decision record and a cleanup
document, not inside the blueprint that Phase 2 builds from. Deferring it
with a hard condition (G-1) preserves the invariant that matters — no
session executes instructions the ADRs contradict — at zero cost to the
build path. Everything else found was a correction, a calibration, or an
open decision already owned by the right person.

## First acts of Phase 2, in order (restating the decided sequence)

1. Close this mission (below) → Phase 2 open.
2. Tal, at his option: branch protection ("require ci.yml green"), the
   `context: fork` behaviour test, G-1's resolution.
3. `infra` track: execute `phase2-scaffold-plan.md` §0 (seven-item
   verification batch, one `docs-explorer` call) → **mandatory checkpoint
   on results** (phase2-workflow §7.1) → §1–§5 under G-2.
4. G-3/G-4 at the provisioning checkpoint, then §6.
