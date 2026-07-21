---
id: 0015
title: Palette is prototype-exact — two temperatures, six accents, minimal AA nudges
status: active
date: 2026-07-21
decided-by: mission-2
supersedes: 0004, 0005
---

## Context

Mission 2 reopened ADRs 0004 (dark palette) and 0005 (warm palette). A first
palette draft evolved the prototype colors (trimming six accents to four,
re-deriving values); a three-direction exploration package was prepared for
Claude Design. At the palette checkpoint (2026-07-21) Tal cancelled the
exploration and decided the opposite of curation: the palette is **exactly
the colors of his two committed prototypes**
(`assets/reference/prototypes/build-tools-overview.html` dark,
`tooling-deepdive.html` warm), altered only where a text color measurably
fails WCAG AA.

## Decision

- Both temperatures ship the prototypes' colors verbatim wherever they pass
  AA — including **all six accents per theme** and the warm theme's l1–l6
  tint boxes. The two prototypes are two **page archetypes**
  (overview/card-grid; deep-dive editorial), each rendering in both
  temperatures; the token roster is their union.
- Exactly six values are nudged (minimal, hue-preserving, stopped at first
  AA pass; measured with `scripts/contrast.ts`): dark muted
  `#6b6b78→#85858f`, dark accent-2 `#7c6af7→#8676f8` (badge tint
  regenerated `#222032`), dark code comments `#444→#7a7a7a`, warm muted
  `#7a7060→#746a5b`, warm subtle `#b0a898→#706b61`, warm code comments
  `#6b6458→#938e85`.
- Normative token sets, provenance per value, and the full measured AA pair
  tables live in
  `missions/02-visual-design-system/outputs/palette-spec.md` (v2);
  registry and switching model in `tokens-reference.md`.
- Preserved principles carried forward as law: saturated accents are never
  backgrounds; accent-derived tints only as chip fills and warm callout
  fills; one system, two temperatures (structure tokens theme-invariant);
  total token parity across theme blocks (ADR 0002's transition must never
  half-apply).

## Consequences

- The AA floor collapses the warm `muted`/`subtle` color distinction
  (`#746a5b` vs `#706b61`); that tier differentiates by size/tracking/case
  only. Recorded so it is not "fixed" back to a failing value.
- Several nudged margins sit deliberately just past 4.5:1 (thinnest: 4.50);
  the Phase 2 CI contrast gate must compare at full precision.
- Phase 2 CI encodes the pair tables and token-parity check mechanically
  (fits the from-scratch CI/CD showcase, ADR 0012).
- The glow of ancestor ADR 0004 is not part of the palette — neither
  prototype has one; its fate rides on the hero resolution (ADR 0007,
  second checkpoint).

## Alternatives rejected

- **Curated evolution (the v1 draft):** four accents with nameable roles,
  re-derived neutrals. Rejected by Tal at checkpoint — it traded away the
  provenance that makes the palette his; the prototypes are his own
  committed work and the anti-test is passed by authorship, not by trims.
- **Three-direction re-exploration (night-workshop / inscription /
  bare-protocol):** cancelled at the same checkpoint for the same reason.
- **Verbatim including failures:** rejected — a design-system builder's
  site cannot ship 13px body text at 3.7:1 or code comments at 2:1. AA is
  the one non-negotiable edit.
