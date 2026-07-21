---
id: 0018
title: Portrait confirmed at About + favicon, unframed and never mythologized; ink treatment deferred to digitization
status: active
date: 2026-07-21
decided-by: tal
supersedes: 0008
---

## Context

ADR 0008 (reopened by mission-2) placed the hand-drawn caricature (Tal's
wife's wedding-invitation drawing) on the About page beside the bio and as
the favicon. Mission 1's brief added hard cautions: never mythologize the
portrait, and keep reference density near zero where illustration and bio
meet. Mission 2 owed placement and treatment. Resolved at M2's second
checkpoint (Tal, 2026-07-21).

## Decision

- **Placement confirmed:** About page beside the bio, and the favicon
  (tight crop, 32px legibility verified before shipping). **Not on the
  home/hero** — person-surface and protocol-surface stay separate.
- **Treatment (binding):** original linework, unframed — no border, no
  background plate, no filter, no laurels, no Greek framing, no inscription
  treatment on or near it. The one deliberately un-systematized element.
- **Ink behavior across themes deferred by decision:** bind-to-token
  (`currentColor` → `--text-strong`) vs ship-untouched is decided when the
  digitized asset can be judged on both backgrounds; a Phase 2
  asset-preparation call inside these rules, not a reopening.
- **Favicon** prepared against the dark (default) background; favicons
  don't theme-switch and the hidden theme must not leak through browser
  chrome (ADR 0002).

## Consequences

- Mission 4 must reserve the bio-beside-portrait slot on About; no other
  route carries the portrait.
- Phase 2 owes the 32px check and the ink decision at digitization.
- The accumulation rule is now mechanical: portrait, bio, and quiet details
  share a surface only on About, with zero mythology references there.

## Alternatives rejected

- **Portrait on the home/hero:** blends the person into the protocol
  register and violates the accumulation caution; the hero belongs to the
  mark (ADR 0017).
- **Committing the ink treatment now (either direction):** both options
  were judged blind without the digitized asset; deferral inside binding
  treatment rules preserves the decision without guessing.
- **Systematized framing (border/plate to match the token system):**
  authenticity is the element's entire function; framing it turns the
  person into decoration.
