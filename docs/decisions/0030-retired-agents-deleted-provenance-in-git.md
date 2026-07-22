---
id: 0030
title: Retired agents are deleted; provenance moves to git history and an evolution log
status: active
date: 2026-07-22
decided-by: tal
mission: phase-2
reopened-by: null
superseded-by: null
narrows: 0025
---

## Context

ADR 0025 decision 5 defined agent retirement as *the file stays on disk with
a retirement description*, and named "delete retired agents" as a rejected
alternative, on the grounds that provenance is what the workshop exhibits.
`docs/PHASE2-CLEANUP-TODO.md` (the 2026-07-22 workshop audit) instructed the
opposite — delete the six retired agent files — without an ADR, which
Mission 6's coherence pass flagged as its only HIGH finding (C1) and the
gate verdict converted into condition G-1: the `infra/workshop-cleanup`
work item may not run until this contradiction is resolved by Tal.

The tension is real on both sides. Provenance is an exhibit, but six
retirement descriptions are injected into every session's agent roster and
cost context on every turn, forever, for files no session may select. The
question is not whether provenance is kept — git history keeps it
losslessly — but which surface carries it.

## Decision

Resolved by Tal, 2026-07-22, at the Phase 2 open checkpoint:

**1. The six retired agent files are deleted** — `brand-strategist.md`,
`design-systems.md`, `design-verifier.md`, `ia-planner.md`,
`tech-architect.md`, `workflow-engineer.md`. Retirement now means deletion.

**2. Provenance moves to two surfaces that do not cost per-session
context:** git history (lossless, line-addressable), and a human-readable
evolution log at `docs/EVOLUTION.md` recording what each agent was, what
question it answered, and which ADRs are its durable output. The handbook's
agent section points there.

**3. This narrows ADR 0025 decision 5 only.** The retirement *roster* (who
retired and why), the "no new agents" rule (decision 6), and everything
else in ADR 0025 stand unchanged. `red-team-reviewer` and `docs-explorer`
remain active agents.

## Consequences

- Every future session's roster lists only agents that can actually be
  selected for work; the "do not select for build work" guard text becomes
  unnecessary.
- A reader who wants to know why `brand-strategist` existed now needs
  `docs/EVOLUTION.md` or git history rather than a directory listing. That
  is one hop further away, accepted in exchange for zero standing context
  cost.
- `scripts/test-machinery.ts` assertions that reference deleted agent file
  paths must be updated by Tal by hand (ADR 0028: sessions never edit the
  checker). The `red-team-reviewer.md` probe is kept.
- ADR 0025's "delete retired agents" rejected alternative is overturned by
  this narrowing; its recorded reasoning stands unedited in 0025, per
  lifecycle rule 1.

## Alternatives rejected

- **Keep the files with retirement descriptions** (ADR 0025's original
  call). Rejected by Tal with Phase 2 open: the context cost recurs every
  session for the life of the project, while the benefit — provenance in
  the directory listing — is served equally well by the evolution log, and
  the workshop's exhibit value lives in its missions, ADRs, and machinery,
  not in six stub files.
- **Delete with no evolution log, git history only.** Rejected: history is
  lossless but not discoverable; a reader must know to look. One short doc
  is the difference between provenance kept and provenance findable.
