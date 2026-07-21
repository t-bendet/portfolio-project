---
name: adr-keeper
description: Format, lifecycle, and rules for Architecture Decision Records in docs/decisions/. Use whenever creating, flipping, superseding, or reading ADRs, or when asked what is currently decided.
---

# ADR Keeper

## Format (enforced by decision-guard hook)
- Filename: `NNNN-kebab-title.md`, NNNN = zero-padded, next free number
- Frontmatter: FLAT `key: value` only. No nesting, no arrays.
- Required keys: `id`, `title`, `status`, `date` (YYYY-MM-DD)
- Status is one of: `proposed | active | reopened | superseded | rejected`
- `reopened` requires `reopened-by: mission-N`
- `superseded` requires `superseded-by: <ADR id>`
- Body sections are STATUS-SENSITIVE:
  - NEW ADRs (written as `active`): `## Context`, `## Decision`,
    `## Consequences`, `## Alternatives rejected` (honest reasons — this is
    the rejection log). All four required.
  - `proposed`: `## Question` + `## Owner` suffice until decided.
  - `reopened` records of pre-workshop decisions may use
    `## Decision (as originally made)` + `## Why reopened` (+ any preserved
    findings); full sections arrive with the superseding ADR.

## Lifecycle rules
1. **Never edit a decision's reasoning after the fact. Never delete an ADR.**
2. New conclusion → NEW ADR (`active`) + flip the old one to `superseded`
   with a pointer. History is the point.
3. Reopening = status flip + `reopened-by`, done only by the mission that owns
   the question (or by Tal).
4. A mission may act on `active` ADRs only. `reopened` = open question, prior
   conclusion is input. `proposed` = undecided, do not build on it.
5. `INDEX.md` is generated. Run `node scripts/reindex-decisions.ts` after any
   ADR change (the hook also does this). On INDEX.md merge conflict: regenerate,
   never hand-merge.
6. Status flips outside your mission's declared scope → escalate to Tal.
