---
name: m6-blueprint-gate
description: Mission 6 — Blueprint Gate, the final coherence review before Phase 2. Run only when Tal explicitly invokes /m6.
disable-model-invocation: true
---

# Mission 6 — Blueprint Gate

## PROJECT PARAMETERS
Workspace: missions/06-blueprint-gate/ · Agent: red-team-reviewer (lead — this
mission IS the adversarial pass) · Skills: security-review (DESIGN MODE),
performance-review (DESIGN MODE), adr-keeper, mission-protocol · License:
may flag ADRs but flips happen via escalation to Tal, not unilaterally.

## Memory block
This is not a review of a product — no product exists. It is a review of the
BLUEPRINT: every active ADR, every mission output, checked for coherence,
completeness, and contradiction before any code is written.

## Starting state
M5 closed. All of M1–M5's outputs and ADRs exist.

## Input manifest
Everything: all mission outputs, all ADRs, CLAUDE.md, .claude/*, scripts/*.

## Output contract
1. coherence-report.md — cross-ADR contradiction hunt (e.g., theme model vs IA,
   showcase constraints vs chosen hosting, RTL vs typography), each finding
   with severity and the ADRs involved
2. completeness-report.md — every Phase 2 prerequisite present? scaffold plan
   executable as written? workflow ready? anything undecided that will block?
3. security-requirements.md — via security-review DESIGN mode
4. performance-budgets.md — via performance-review DESIGN mode
5. gate-verdict.md — GO / NO-GO for Phase 2. NO-GO lists exactly what must be
   fixed and which mission owns each fix.
6. review-verdict.md — a SECOND red-team instance in fresh context reviews this
   mission's own outputs (the reviewer gets reviewed)

## Scope boundaries
Finds and specifies; does not fix. Fixes route back to owning missions or Tal.

## Checkpoints
Checkpoint after the coherence-report (contradictions are Tal's to weigh in
on early) and before writing the gate-verdict.

## Stop conditions
Contract met + APPROVED, max 3 cycles, then escalate. Phase 2 begins only on GO.
