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
- Optional relational keys: `narrows` / `narrowed-by` (see Partial narrowing)
- Body sections are STATUS-SENSITIVE:
  - NEW ADRs (written as `active`): `## Context`, `## Decision`,
    `## Consequences`, `## Alternatives rejected` (honest reasons — this is
    the rejection log). All four required.
  - `proposed`: `## Question` + `## Owner` suffice until decided.
  - `reopened` records of pre-workshop decisions may use
    `## Decision (as originally made)` + `## Why reopened` (+ any preserved
    findings); full sections arrive with the superseding ADR.

## Partial narrowing (ADR 0027)
Sometimes a new ADR does not replace an old one — it **corrects one clause**
of it. The old ADR stays `active` and stays binding; only the narrowed clause
changes. `superseded` would be a lie (the rest of it still governs), and
editing the old ADR's body is forbidden, so the relation lives in frontmatter:

- On the NEWER ADR: `narrows: 0019`
- On the OLDER ADR: `narrowed-by: 0023` (status stays `active`)
- Both accept comma-separated ids (`narrowed-by: 0023, 0027`) — a flat scalar,
  so the no-arrays rule still holds.
- **Always write both sides.** One-directional is the exact defect this
  prevents: a reader who opens the old ADR alone sees nothing and builds the
  wrong thing. `validate-adr.ts` (full-repo mode) fails on a missing reciprocal.
- The relation surfaces in the generated `INDEX.md` `Note` column, which
  `inject-project-state` puts into every session.

**This is not a violation of rule 1.** Rule 1 protects a decision's
*reasoning*; relational frontmatter is *metadata*, and the lifecycle already
requires writing it into an old ADR after the fact — that is exactly what
`superseded-by` is. Adding `narrowed-by` is the same operation.

Live instances: 0023 narrows 0019 (hreflang alternates); 0024 narrows 0020
(analytics path keying).

## Lifecycle rules
1. **Never edit a decision's reasoning after the fact. Never delete an ADR.**
   Frontmatter relational keys (`superseded-by`, `reopened-by`, `narrowed-by`)
   are metadata and ARE written post-hoc. Body text is not.
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
