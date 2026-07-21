---
id: 0016
title: Typography is prototype-exact (Syne+DM Mono / Fraunces+IBM Plex Mono) with verified Hebrew companions
status: active
date: 2026-07-21
decided-by: mission-2
supersedes: 0006
---

## Context

ADR 0006 (reopened) recorded the pre-workshop typography and misrecorded the
dark prototype as "DM Mono for everything" — the committed dark prototype
(`assets/reference/prototypes/build-tools-overview.html`) actually sets body
and display in **Syne** with DM Mono for chrome/eyebrows/code. At the M2
checkpoint (2026-07-21) Tal locked fonts prototype-exact. ADR 0011 makes
Hebrew coverage a hard check; none of the four Latin families covers Hebrew
(verified against google/fonts METADATA.pb by the design-verifier agent —
including explicitly debunking the "Syne gained Hebrew" claim).

## Decision

- **Dark:** Syne (display + body; variable wght 400–800, no italic) +
  DM Mono (chrome/code; static 400/500). Hebrew companion for all slots:
  **Heebo** (variable 100–900, hebrew subset verified).
- **Warm:** Fraunces (display + body; variable opsz/wght/SOFT/WONK, italic)
  + IBM Plex Mono (chrome/code; static 400–600). Hebrew companions:
  **Frank Ruhl Libre** (body/display; variable 300–900) and
  **IBM Plex Sans Hebrew** (mono slots; same superfamily as Plex Mono).
- Companions enter via font stacks + per-script `unicode-range`, never as
  separate tokens. There is **no Hebrew monospace on Google Fonts**;
  Hebrew in mono-styled slots renders in the companion sans — an accepted,
  recorded asymmetry.
- Scale, weight map, eyebrow treatment (Latin-caps tracking never applied
  to Hebrew runs; the `T://bendet` mark segment never translated or
  restyled), emphasis rules (italic is warm-theme, Latin-only; weight
  carries emphasis), and RTL rules (code blocks always LTR) are normative
  in `missions/02-visual-design-system/outputs/typography-spec.md`.
- The ADR 0014 lapidary gesture license is **declined for the base
  system**; it remains available to the hero resolution (ADR 0007) only.
- All seven families OFL; self-hosted `latin`+`hebrew` subsets.

## Consequences

- Every type slot is planned around its Hebrew companion's verified weight
  ceiling (Heebo ⊇ Syne, Frank Ruhl ⊇ Fraunces-in-use, Plex Sans Hebrew ⊇
  Plex Mono-in-use), so no silent faux-bolding in Hebrew.
- No italic exists in the dark temperature at all (Syne has none) —
  emphasis is weight/color there by construction, matching the prototype.
- Phase 2 owes: `size-adjust` metric tuning for mixed-script lines, bidi QA
  of the eyebrow mark segment under `dir="rtl"`, and a manual look at the
  Google Fonts hebrew+monospace filter as a belt-and-braces re-check.
- Mixed variable/static font pipeline (4 variable, 3 static families) — the
  loading strategy cannot assume variable-only.

## Alternatives rejected

- **Curated re-selection of families** (incl. any inscriptional/lapidary
  face for the base system): rejected by the checkpoint decision —
  prototype provenance over exploration; the lapidary license would spend
  identity budget outside the one surface (hero) where a register change
  could be a decision rather than decoration.
- **Rubik / Noto Sans Hebrew as dark companion:** viable (verified), but
  Heebo's grotesque-geometric register sits closer to Syne+DM Mono; Noto's
  breadth adds nothing the subset strategy needs. Kept as verified
  fallbacks in the spec.
- **David Libre / Noto Serif Hebrew as warm body companion:** David Libre
  is static 400/500/700 and misses Fraunces' 300 body weight; Noto Serif
  Hebrew passes technically but Frank Ruhl Libre's Hebrew book-serif
  lineage is the warm theme's exact register. Kept as fallbacks.
- **Forcing a Hebrew monospace** (e.g. Cascadia Code outside Google
  Fonts): rejected — off-pipeline dependency and a worse reading
  experience than the sans companion, for a slot (mono chrome) where
  fixed-width is convention, not information.
