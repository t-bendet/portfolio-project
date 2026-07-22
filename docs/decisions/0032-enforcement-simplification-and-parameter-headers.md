---
id: 0032
title: Enforcement layer simplifies to the static Phase 2 rule; species lint and parameter headers are dropped
status: active
date: 2026-07-22
decided-by: tal
mission: phase-2
reopened-by: null
superseded-by: null
narrows: 0028
narrowed-by: 0035
---

## Context

`docs/PHASE2-CLEANUP-TODO.md` §B proposed two enforcement simplifications,
correctly marked [Tal, by hand] but recorded only in a TODO file — which
coherence finding C1 flagged: decisions that reverse reasoning recorded in
ADR 0028 and M5 outputs belong in ADRs, not cleanup notes. With Mission 6
closed, the phase regimes in `protect-workshop.ts` are dead branches: no
mission will ever be in-progress again, so only the Phase 2 rule can fire.
The judgment/worker species contract in `validate-workshop.ts` similarly
lint-checks a distinction that mattered when Phase 1 agents held methods;
the surviving agents (`red-team-reviewer`, `docs-explorer`) don't need a
lint to stay what they are.

Separately, §B strips the "Project parameters (ADR 0029)" header blocks
from the skills that carry them. That is not an ADR 0028 matter — skills
are session-editable and ADR 0029's export boundary spec is unaffected —
but it is recorded here so the whole cleanup is ADR-backed. (The TODO
listed five skills; only four carry the header — `mission-protocol`,
`adr-keeper`, `review-work`, `prompt-craft`. `tech-eval` never did.
Coherence C5's count correction, adopted.)

## Decision

Resolved by Tal, 2026-07-22, at the Phase 2 open checkpoint:

**1. `scripts/hooks/protect-workshop.ts` simplifies to the static Phase 2
rule**: block `scripts/**` and both settings files always; allow
`.claude/skills/**` and `.claude/agents/**` always. The M5/M6 phase
regimes are removed as dead code. The rule itself — edit what is checked,
never the checker — is unchanged.

**2. `scripts/validate-workshop.ts` drops the species contract checks**
(Operating contract / Workflow / Output format / pinned-model). It keeps:
SKILL.md exists, name matches folder, description present, mission skills
carry `disable-model-invocation: true`.

**3. `scripts/test-machinery.ts` is trimmed to match** — the phase-table
cases for the removed regimes and the species-lint assertions go; the
static-rule assertions stay.

**4. All three edits are made by Tal by hand.** This narrows ADR 0028 only
in what the checker *contains*, not in who may touch it: sessions still
never edit `scripts/**` or the settings files.

**5. The parameter header blocks are stripped** from the four skills that
carry them. If the workshop plugin ever ships, re-parameterize then
(`docs/NEXT-ITERATION-HANDOFF.md` §2); parameterizing for a consumer that
does not exist is standing overhead.

## Consequences

- The enforcement layer gets smaller and easier to audit; the branch that
  fires is the only branch that exists. The cost is history legibility in
  the code itself — the phase-regime story now lives in git history and
  ADR 0028, not in live branches.
- `test-machinery.ts` loses assertions (the fixture-driven phase cases),
  so the suite's count drops. That is trimming dead coverage, not
  weakening live coverage: the removed cases exercise states that can no
  longer occur.
- Dropping the species lint means a future agent file with a malformed
  operating contract passes validation. Accepted: the roster is two agents
  and frozen by ADR 0025 decision 6 ("no new agents").
- The skills lose their packaging seam. Re-adding it is mechanical if ADR
  0029's boundary is ever published.

## Alternatives rejected

- **Leave the dead branches in place** (the TODO's own "low urgency"
  concession). Rejected by Tal with the rest of the cleanup: correct-but-
  dead code in the enforcement layer is exactly where a future reader
  loses time establishing what actually fires.
- **Have a session make the edits under supervision.** Rejected without
  discussion: ADR 0028's checker rule exists precisely because enforcement
  fails open and silently; no cleanup is worth an exception to it.
- **Keep the parameter headers against a future plugin release.** Rejected:
  ADR 0029 deliberately did not publish; the headers serve a consumer that
  may never exist and cost reading friction in every skill invocation now.
