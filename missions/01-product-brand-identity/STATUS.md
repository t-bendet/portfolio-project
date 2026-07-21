---
mission: m1
status: closed
depends-on: phase-0
opened: 2026-07-21
closed: 2026-07-21
revision-cycles: 0
---

# Status — Product & Brand Identity

## Handoff notes

**Decided.** The identity is: T://bendet protocol as spine → one hidden HP
feature (Marauder's Map, ADR 0002 defended and active) → Greek mythology as a
narrowed subordinate naming register (NEW ADR 0014, active, decided by Tal
2026-07-21). The register's two entry points: naming of real infra/repo
artifacts only, and at most ONE inscription/lapidary typographic gesture
licensed to M2 (declining is valid). No mythological references in site
copy/chrome/content — binary grep test. The figure-to-facet reservoir
(Prometheus ↔ translation, Daedalus ↔ infrastructure, Odysseus ↔ versatility)
is naming rationale only, never surfaced.

**ADRs written/flipped:** 0014 written (active). Nothing flipped — 0001, 0002
defended as-is. 0007/0008 untouched per license; conflicts flagged only.

**What M2 must know:**
- Start from outputs/design-brief-for-m2.md + outputs/symbol-and-language-map.md.
- If the lapidary gesture is pursued, the hero cannot blend terminal and
  lapidary registers — pick one (flag against reopened 0007; M2 resolves).
- The ADR 0008 portrait stays strictly personal — never mythologized.
- Test any lapidary exploration explicitly on dir="rtl" surfaces (ADR 0011;
  reviewer note).
- Read the symbol map's "silence is a no" clause together with the design
  brief's "freedom is total" section to avoid a false conflict with reopened
  0007/0008 elements (reviewer note).
- Known future collision (needs a NEW ADR when it bites, per 0014's widening
  rule): the figure-name grep vs legitimate tech names (Apollo Client,
  Prometheus monitoring) in technical writing.

**Review:** APPROVED cycle 1 (outputs/review-verdict.md). One non-binary
backstop acknowledged: "no artifact invented to carry a name" is judgment,
not grep.

## Inputs actually read

- CLAUDE.md
- docs/decisions/INDEX.md + ADRs 0001–0013 (statuses as listed below)
- docs/research/about-tal.md (CV pdf present but not a dependency)
- docs/research/greek-mythology-notes.md (created at Checkpoint 0 from Tal's
  interview, 2026-07-21)
- assets/reference/prototypes/build-tools-overview.html,
  tooling-deepdive.html
- .claude/skills/brand-voice/SKILL.md, .claude/skills/adr-keeper/SKILL.md,
  .claude/skills/mission-protocol/SKILL.md, .claude/skills/prompt-craft/SKILL.md

## ADR statuses observed at mission start (2026-07-21)

- 0001 active · 0002 active · 0003 reopened (mission-3) · 0004 reopened
  (mission-2) · 0005 reopened (mission-2) · 0006 reopened (mission-2) ·
  0007 reopened (mission-2) · 0008 reopened (mission-2) · 0009 reopened
  (mission-4) · 0010 reopened (mission-4) · 0011 active · 0012 active ·
  0013 proposed

## Checkpoint log

- Checkpoint 0 (2026-07-21): mythology notes absent → Tal chose interview;
  results written to docs/research/greek-mythology-notes.md. See
  outputs/checkpoint-0-mythology-input.md.
- Reconciliation checkpoint (2026-07-21): Stage A proposal presented; Tal
  probed Candidate B's policing risk, then locked the narrowed form
  (infra naming + ≤1 inscription gesture, no content references). Recorded
  in outputs/reconciliation-decision.md.
- Review (2026-07-21): red-team APPROVED, cycle 1.
