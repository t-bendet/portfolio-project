---
id: 0025
title: Phase 2 development workflow — tracks, risk-tiered review, and a retired agent roster
status: active
date: 2026-07-22
decided-by: mission-5
mission: mission-5
reopened-by: null
superseded-by: null
narrowed-by: 0030, 0035
---

## Context

Phase 1 ran six missions under one model: a large question, one specialist
agent, one fresh-context adversarial review, and a mechanical gate before the
next mission could start. That model was correct for work where each decision
was expensive to get wrong and made once.

Phase 2 has the opposite shape. The blueprint is fixed; the work is many
small changes executing it. Building `/writing/[id].astro` is not a decision,
it is an application of an existing page brief and an existing token set.
Running a fresh-context review and a status gate on each such change would
cost more than the change.

The failure mode also inverts. In Phase 1 the enemy was deciding wrong. In
Phase 2 the decisions are law, and the enemy is **silent divergence from
them** — a hardcoded token, an hreflang tag ADR 0023 forbids, a credit block
placed after the article body when the upstream grant makes placement a
condition of the licence. A passing build catches none of those.

This is not speculative. Mission 4's review log records that all three of its
cycles found the same defect class — a change made correctly in one place and
not followed to its consequences — and that **both** of its rejections were
propagation failures rather than reasoning failures; the approving third cycle
raised six more findings of the same shape. (M4 had two rejections, not three:
`revision-cycles: 2`, cycle 3 APPROVED. Its handoff note's "two of the three
rejections" is a miscount, corrected here rather than inherited.) That happened
on paper, across fifteen surfaces. Phase 2 has more surfaces and they are code.

## Decision

**1. The unit of work is a work item, not a mission**, and it belongs to one
of four tracks — `infra`, `api`, `web`, `content` — which determine the specs
that are law for it. Order is a dependency fact, not a preference: `infra`
scaffolds first, then `api` and `web` against a running local stack, then
`content`. One track at a time, because a change Tal has not looked at has not
been reviewed.

**2. Review is tiered by what a mistake costs**, not by diff size, and the
class is declared before work starts:

- **Routine** (copy, an entry with no new field, a token set to its specified
  value): CI only.
- **Standard** (a route, component, or endpoint built from an existing brief):
  CI plus self-review against the propagation checklist.
- **Gated** (auth; any migration; Dockerfile/compose/Caddyfile; any workflow;
  anything touching secrets, IAM or DNS; the theme mechanism of ADR 0002; the
  **first** item of each content kind): CI plus mandatory `red-team-reviewer`
  in fresh context.

Gated items are exactly the cases where a passing build and a broken system
are compatible.

**3. The revision cap is 2, not Phase 1's 3.** A second rejection means either
a clearly-stated spec is being missed repeatedly, or the spec itself is wrong
— and the second is Tal's call requiring a new ADR, not another revision.

**4. A scope cap of three working sessions per work item** triggers a "decide
with what we have" checkpoint whose outcomes are ship-reduced, split, or drop
(Tal, 2026-07-22). Mission 6 is exempt: it is the last point at which a
cross-mission coherence failure is still cheap to catch.

**5. Five agents retire at Phase 2 open** — `brand-strategist`,
`design-systems`, `tech-architect`, `ia-planner`, `design-verifier` — plus
`workflow-engineer` once this mission closes. Their questions are answered and
the ADRs are the durable output. Retirement means the file stays on disk with
a `description` naming the superseding ADRs, so it is not selected for work
and a reader learns why it existed. `red-team-reviewer` and `docs-explorer`
are kept.

**6. No new agents.** The propagation sweep becomes a mandatory checklist
inside the existing review rather than a second reviewer.

## Consequences

- Most Phase 2 changes get no adversarial review at all. That is the point of
  tiering, and it is a real exposure on anything mis-classified as Routine.
  Mis-classification is now the highest-leverage single mistake in the
  workflow, which is why the class is declared before the work rather than
  after the outcome is known.
- The "first of each kind" rule concentrates review where patterns are set:
  item #1 is reviewed adversarially and items #2-30 copy it. If item #1 is
  approved with a latent defect, the defect is replicated thirty times before
  anything else looks at it.
- Retiring agents by description rather than deletion keeps provenance but
  leaves dead weight in `.claude/agents/`; a future reader must notice the
  retirement note. `validate-workshop.ts` still lints them, so they cannot rot
  structurally.
- Refusing a `blueprint-auditor` agent means blueprint conformance depends on
  a checklist a reviewer must actually work through. If conformance failures
  reach `main`, this is the decision to revisit first.
- The scope cap will occasionally stop work that was genuinely nearly done.
  Accepted: `IMPROVEMENTS.md` #1 rates unbounded scope the higher risk for a
  solo developer with limited hours.

## Alternatives rejected

- **Carry the mission model into Phase 2** (a "mission" per feature, gate and
  all). Rejected: the gate's evidence requirement — a written APPROVED verdict
  file per unit — is proportionate to a three-day decision and absurd for a
  two-hour component. Ceremony that cannot be afforded gets skipped, and a
  gate that is routinely skipped is worse than no gate because it still
  implies protection.
- **No adversarial review in Phase 2; trust CI.** Rejected: CI proves the code
  runs. It cannot prove the OIDC trust policy is scoped to this repo, that
  `/admin` is not reachable through the proxy, or that the easter egg stayed
  hidden. Those are the failures that matter here.
- **A `blueprint-auditor` agent** dedicated to spec conformance. Rejected on
  attention economics: two reviews per gated item halves the care each
  receives, and `IMPROVEMENTS.md` sets the bar for new machinery at
  demonstrated friction, which does not yet exist because Phase 2 has not run.
- **Delete retired agents.** Rejected: it discards the provenance the workshop
  exists to display, for a benefit (a shorter directory listing) that a
  one-line description achieves anyway.
- **Cap of 3, matching Phase 1.** Rejected: it spends a third cycle on the
  implementation layer when the evidence after two says the problem is at the
  spec layer.
