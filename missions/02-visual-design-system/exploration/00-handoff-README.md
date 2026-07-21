# M2 Exploration Handoff — for Claude Design

Mission 2 · 2026-07-21 · Prepared in the workshop (Claude Code), consumed in
Claude Design. This package is exploration input, NOT a mission deliverable.

## The division of labor

- **Claude Design (you are here if reading this in a design project):**
  render the candidate directions as actual pages and iterate on taste.
  You do not decide anything and you do not verify anything.
- **The workshop (Claude Code repo):** verification (WCAG AA contrast,
  Hebrew font coverage), token specs, ADRs, red-team review. All decisions
  land there, after Tal reacts to rendered candidates.

## What to render, per direction

For each direction brief in this folder (01–03), render:

1. **Home/hero** — in BOTH temperatures (dark default, warm editorial).
2. **An article layout** — long-form reading page, in BOTH temperatures.
3. **The same article as Hebrew RTL** (`dir="rtl"`) — this is a hard
   constraint (ADR 0011), not a variant. If a pattern degrades in RTL,
   the pattern is wrong, not the Hebrew.

Read `design-guardrails.md` before rendering anything — it carries the
invariants Claude Design cannot know about (this file is the bridge; the
design tool does not know the repo's ADRs exist).

## Starting palette

Each direction embeds its palette. The shared base (structure neutrals, text
tiers) is already WCAG-AA-verified in the workshop (62/62 pairs). You may
explore within a direction's temperament — shift accents, try variants — but
treat the embedded values as the known-good anchor. Final hexes get
re-verified in the workshop regardless; do not burn time on contrast math.

## Exporting winners

Export the winning direction(s) (PPTX, PDF, or HTML — or hand off to Claude
Code) into the repo at `docs/research/design-exploration/`, one subfolder per
direction explored, plus a short `notes.md` with Tal's reactions (what won,
what was rejected, why — the workshop's ADRs need honest alternatives).
