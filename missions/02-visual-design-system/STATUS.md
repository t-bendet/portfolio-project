---
mission: m2
status: closed
depends-on: m1
opened: 2026-07-21
closed: 2026-07-21
revision-cycles: 0
---

# Status — Visual Design System

## Handoff notes

**Verdict: APPROVED, cycle 1** (outputs/review-verdict.md). Three
non-blocking editorial corrections from the verdict were applied post-approval
(nudge-direction wording, thinnest-margin label, lint-scoping note, two
range-valued type tokens pinned); no substantive change.

**Decided (all via Tal's two in-mission checkpoints):**
- Palette + structure are PROTOTYPE-EXACT from Tal's two committed
  prototypes, six accents per theme, warm l1–l6 tints kept; exactly six
  minimal AA nudges (ADR **0015**, supersedes 0004+0005). The two
  prototypes are page ARCHETYPES (overview card-grid / deep-dive
  editorial), each rendering in both temperatures.
- Typography prototype-exact: Syne+DM Mono (dark), Fraunces+IBM Plex Mono
  (warm); Hebrew companions web-verified: Heebo (dark), Frank Ruhl Libre +
  IBM Plex Sans Hebrew (warm), via unicode-range stacks. No Hebrew
  monospace exists — recorded asymmetry (ADR **0016**, supersedes 0006;
  also corrects 0006's "DM Mono for everything" misrecord).
- Hero = bare protocol resolution: typing sequence kept, terminal window
  dropped; completion glow from **--accent-3** (Tal's call), dark-only,
  static — the single glow site-wide (ADR **0017**, supersedes 0007).
- Portrait: About + favicon confirmed, unframed, never mythologized; ink
  treatment deferred to digitization (ADR **0018**, supersedes 0008).
- ADR 0014's lapidary license is formally UNEXERCISED anywhere — declined
  for base system (0016) and for the hero (0017). Zero gestures is final.

**What Mission 3 must know:** framework-agnostic by construction — tokens
are plain CSS custom properties; theme switching is data-theme per ADR 0002
with a no-flash inline-script requirement; font pipeline is mixed
variable/static, self-hosted, latin+hebrew subsets; Phase 2 CI owes the
contrast gate (scripts/contrast.ts over palette-spec §5 pairs, full
precision), token-parity check, and banned-vocabulary lint (whole-token
matching) — natural ADR 0012 showcase material.

**What Mission 4 must know:** About page must reserve the
bio-beside-portrait slot (no other route carries the portrait); every page
carries the eyebrow pattern; code blocks always LTR; accent edges bind via
border-inline-start; per-archetype composition rules live in palette-spec
§1 / §7.3.

**Claude Design project** ("T://bendet — M2 design exploration",
113fe4fa-4a62-4aeb-a217-d550e8f4035e): trimmed to hero-only
(04-hero-exploration-brief.md pushed; stale 3-direction briefs deleted
remotely; rendered direction-* folders left untouched — made in Design, not
ours to delete). Hero was then decided at checkpoint without renders; the
brief remains if Tal ever wants visual confirmation.

## Inputs actually read

- missions/01-product-brand-identity/outputs/design-brief-for-m2.md (LAW)
- assets/reference/prototypes/build-tools-overview.html +
  tooling-deepdive.html (complete CSS extraction — normative ancestors)
- docs/decisions/: 0001 active, 0002 active (mechanism law), 0004/0005/0006
  reopened (input), 0007/0008 reopened (resolved here), 0011 active (hard
  check), 0012 active, 0014 active
- .claude/skills/: mission-protocol, design-tokens, adr-keeper,
  m2-design-system
- scripts/contrast.ts (all AA arithmetic), scripts/validate-adr.ts,
  scripts/reindex-decisions.ts
- design-verifier agent report (google/fonts METADATA.pb-sourced Hebrew
  coverage facts, 2026-07-21)

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
