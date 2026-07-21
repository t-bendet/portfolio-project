---
id: 0017
title: Hero is the bare protocol resolution — typing animation kept, terminal window dropped
status: active
date: 2026-07-21
decided-by: tal
supersedes: 0007
---

## Context

ADR 0007 (reopened by mission-2) specified a macOS-style terminal window
containing the T://bendet typing animation with a completion glow. Mission
2's locked system (ADRs 0015/0016, motion-and-texture spec) is still, flat,
and chromeless — the prototypes contain no window chrome, shadows, or
keyframe animation anywhere. The window frame became the only chrome object
in a chromeless system and is a portfolio-template staple; the typing
sequence itself remains the identity's strongest moment. Resolved at M2's
second checkpoint (Tal, 2026-07-21).

## Decision

The hero **evolves**: keep the one-shot protocol resolution, drop the
frame. Display-scale `--font-mono` type directly on `--bg` types
`T → T: → T:/ → T:// → T://bendet` once per page load, never loops; at
completion the cursor disappears, the `://` takes `--accent-3`, and tagline
+ content reveal in the same single step. **Completion glow kept, moved by
Tal from the ancestor's accent-2 to `--accent-3`** (terminal-green
lineage): dark theme only, static after appearing, `transparent` in warm —
the single glow element site-wide. `prefers-reduced-motion` renders the
final frame immediately. The mark is an LTR run under any page `dir`.
Full spec: `missions/02-visual-design-system/outputs/hero-and-illustration.md`.

## Consequences

- This spends motion-and-texture's single quarantined hero animation
  license; no second animated element exists anywhere.
- The ADR 0014 lapidary gesture license is now formally unexercised
  anywhere on the site — zero gestures is the final outcome (base system
  declined it in ADR 0016; the hero, its only remaining candidate surface,
  declined it here).
- `--glow` joins the token registry with values in both theme blocks
  (parity rule).
- Phase 2 owes the reduced-motion and RTL behaviors as implemented
  requirements, not options.

## Alternatives rejected

- **Keep the terminal window (0007 verbatim):** the frame fails the M1
  anti-test and would be the system's only chrome; rejected at checkpoint.
- **Static mark (no animation):** deletes the identity's one performative
  moment while buying nothing — the motion budget had already reserved the
  hero slot.
- **Inscription/lapidary hero:** would make the hero speak a register no
  other surface uses; license left unspent by choice.
- **Glow from `--accent-2` (ancestor violet; the workshop's
  recommendation):** Tal chose accent-3's green at checkpoint — terminal
  lineage over ancestry. No-glow variant rejected with it.
