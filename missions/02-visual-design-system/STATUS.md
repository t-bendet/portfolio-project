---
mission: m2
status: in-progress
depends-on: m1
opened: 2026-07-21
closed: null
revision-cycles: 0
---

# Status — Visual Design System

## Handoff notes

(filled at closure: what was decided, which ADRs were written/flipped,
what the next mission must know)

## Inputs actually read

(recorded at closure: exact paths + ADR ids/statuses as of mission start)

## ADR statuses observed at mission start (2026-07-21)

- 0001 active · 0002 active · 0003 reopened (mission-3) · 0004 reopened
  (mission-2) · 0005 reopened (mission-2) · 0006 reopened (mission-2) ·
  0007 reopened (mission-2) · 0008 reopened (mission-2) · 0009 reopened
  (mission-4) · 0010 reopened (mission-4) · 0011 active · 0012 active ·
  0013 proposed · 0014 active

## Checkpoint log

- Palette checkpoint (2026-07-21): palette-spec.md produced (62/62 pairs
  AA-verified independently). Tal set the checkpoint mechanics: exploration
  happens in Claude Design against rendered pages; verification and
  decisions stay in the workshop. Handoff package (M1 brief + guardrails +
  3 candidate directions: night-workshop / inscription / bare-protocol)
  pushed to Claude Design project "T://bendet — M2 design exploration"
  (113fe4fa-4a62-4aeb-a217-d550e8f4035e) from
  missions/02-visual-design-system/exploration/. Awaiting Tal's rendered
  winners in docs/research/design-exploration/ before the token spec
  hardens and ADRs land.

- **PIVOT — checkpoint decision (2026-07-21, Tal, supersedes the above):**
  Tal chose to use EXACTLY the styles (color and structure) of his two
  committed prototypes (assets/reference/prototypes/build-tools-overview.html
  dark, tooling-deepdive.html warm). The 3-direction Claude Design
  exploration for palette/structure is CANCELLED. Locked at checkpoint:
  1. **Palette = prototype-exact + minimal AA fixes.** Every passing value
     verbatim (incl. all SIX accents per theme and the warm l1–l6 tint
     boxes; the 6→4 trim is reverted). Only the failing text colors get
     minimal recorded nudges (dark --muted #6b6b78 @3.70, code comments
     #444 @~2, warm --muted #7a7060 @4.35, warm --subtle #b0a898 @~2,
     dark accent-2 #7c6af7 on hover surfaces @4.34). palette-spec.md v1
     in outputs/ must be REWRITTEN to this rule.
  2. **Fonts = prototype-exact:** Syne + DM Mono (dark), Fraunces +
     IBM Plex Mono (warm), plus Hebrew companions to be verified by
     design-verifier (ADR 0011 — none of the four covers Hebrew). Note:
     reopened ADR 0006's text misrecords the dark prototype ("DM Mono for
     everything" — it is actually Syne + DM Mono); superseding ADR corrects
     the record.
  3. **Structure resolution:** the two prototypes are two PAGE ARCHETYPES
     (overview/map card-grid; deep-dive editorial w/ sidebar), each
     rendering in both temperatures — the shared-structure through-line
     applies per-archetype, only temperature changes.
  4. **Claude Design kept for hero exploration ONLY** (0007 terminal fate +
     0008 portrait placement, rendered against locked prototype styles);
     the pushed 3-direction package is stale and should be trimmed.
  5. Hero (0007) + illustration (0008) remain open — the prototypes
     contain neither. Second checkpoint still required there.

- **Post-pivot execution (2026-07-21, same session):** palette-spec.md
  REWRITTEN prototype-exact (all six accents + warm l1–l6 restored; exactly
  six minimal AA nudges, contrast.ts-verified; archetype × temperature
  union roster). tokens-reference.md, motion-and-texture.md,
  typography-spec.md produced. Hebrew coverage web-verified by
  design-verifier (none of the 4 locked families covers Hebrew; companions:
  Heebo / Frank Ruhl Libre / IBM Plex Sans Hebrew; no Hebrew monospace
  exists on Google Fonts — recorded asymmetry). ADR 0015 supersedes
  0004+0005; ADR 0016 supersedes 0006 (also corrects 0006's misrecorded
  "DM Mono for everything"). Lapidary license declined for base system,
  reserved to hero. Stale 3-direction exploration package trimmed to
  hero-only (04-hero-exploration-brief.md).

- **CHECKPOINT 2 RESOLVED (2026-07-21, Tal, in-session):** hero = B (bare
  protocol resolution, no window chrome); completion glow KEPT but moved by
  Tal to `--accent-3` (green, terminal lineage), dark-only, static;
  portrait placement/treatment confirmed (About + favicon, unframed, never
  mythologized), ink-vs-original call deferred to digitization. Lapidary
  license formally unexercised anywhere (declined base system in 0016,
  declined hero at checkpoint). hero-and-illustration.md hardened; ADR 0017
  supersedes 0007, ADR 0018 supersedes 0008; glow cross-references updated
  in palette-spec §7.4, motion-and-texture T5, tokens-reference §3.3.
  Contract items 1–5 complete → red-team review loop.
