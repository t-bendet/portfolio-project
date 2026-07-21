# Hero & Illustration — Resolution (ADRs 0007, 0008)

Mission 2 · 2026-07-21
**Status: hardened.** Checkpoint 2 happened 2026-07-21: Tal chose direction
B (bare protocol resolution), kept the completion glow but moved it to
`--accent-3`, and confirmed the portrait's placement with the ink treatment
deferred to the real asset. This file records the decision and the rejected
alternatives; ADR 0017 supersedes 0007 and ADR 0018 supersedes 0008 on this
basis.

## 1. The hero — bare protocol resolution (supersedes the terminal window)

### What changed under ADR 0007

The locked system is still and chromeless: the prototypes contain no window
chrome, no shadows, no keyframe animation anywhere (motion-and-texture §0),
and elevation is flat color steps. ADR 0007's macOS-style terminal *window*
would have been the only chrome object in that system and is a
portfolio-template staple (fails the M1 anti-test on the frame). The typing
sequence itself — the mark resolving as a protocol — remains the strongest
identity moment the site has. Keep the enactment, drop the frame.

### The specification

- **Form:** display-scale type directly on `--bg`. No container, no frame,
  no chrome. The mark is set in `--font-mono` (the protocol register:
  DM Mono dark / IBM Plex Mono warm) at the h1 scale step
  (`--size-h1`, typography-spec §4).
- **Sequence (once per page load, never loops — 0007's rule, kept):**
  `T` → `T:` → `T:/` → `T://` → `T://bendet`, block cursor visible during
  resolution, gone at completion.
- **Completion:** in the same single step — cursor disappears, the `://`
  takes `--accent-3`, the tagline and page content reveal (one opacity
  step; part of the hero's single licensed animation, motion-and-texture
  §1).
- **The glow (Tal, checkpoint 2):** at completion the `://` receives
  `--glow: color-mix(in srgb, var(--accent-3) 35%, transparent)` —
  **dark theme only**, appearing once and holding static (no pulse). In the
  warm theme `--glow` is `transparent`: a glow is a dark-room phenomenon;
  the `://` still takes `--accent-3` (forest) so the completion state is
  structurally identical, only temperature changes. AA facts: `--accent-3`
  measures 9.12:1 on dark `--bg`, 6.19:1 on warm `--bg` (palette-spec §5).
  This is the **single glow element site-wide** and the green sits in the
  terminal lineage the hero enacts.
- **Reduced motion:** `prefers-reduced-motion` renders the final frame
  immediately — mark complete, `://` accented (glow included; it is static
  decoration, not motion), content visible. No information exists only in
  the animation.
- **RTL (ADR 0011):** the mark is an LTR run regardless of page `dir`;
  hero alignment binds to logical start; the glow is symmetric
  (palette-spec §8). Identical experience in Hebrew.
- **Register purity (M1 brief):** protocol/mono only. No inscription
  blending. The lapidary license stays unspent (typography-spec §8 declined
  it for the base system; checkpoint 2 declined direction D) — **the
  license is now formally unexercised anywhere; zero gestures is the final
  outcome.**

### Alternatives rejected (checkpoint 2, Tal)

- **A — keep the terminal window:** the frame is template-shaped and the
  only chrome in a chromeless system; the idea's value lives in the typing,
  not the window.
- **C — static mark:** maximally still but deletes the identity's one
  performative moment; the motion budget had already quarantined a hero
  slot, so stillness bought nothing.
- **D — inscription hero (spend the lapidary license):** the hero would
  speak a register no other surface uses; the mark is a protocol. License
  remains unspent by choice, not oversight.
- **Glow from `--accent-2` (the ancestor's violet, this file's original
  recommendation):** Tal moved the glow to `--accent-3` at checkpoint —
  green carries the terminal lineage; recorded as the decided source.
  Glow-less B2 rejected with it.

## 2. The portrait — placement confirmed, ink deferred

Tal confirmed at checkpoint 2:

1. **Placement:** About page, beside the bio, and the favicon (tight crop;
   must be verified legible at 32px before shipping). **Not on the
   home/hero** — the hero is the mark's register; the M1 brief's
   accumulation rule keeps the person-surface and protocol-surface
   separate.
2. **Treatment rules (binding):** the drawing ships as itself — original
   linework, unframed, no border, no background plate, no filter. Never
   mythologized: no laurels, no Greek framing, no inscription treatment on
   or near it (M1 brief). It is the one deliberately un-systematized
   element — the person visibly living in the workshop.
3. **Ink behavior across themes: deferred by decision.** Whether the
   linework binds to `--text-strong` (SVG `currentColor`) or ships
   untouched is decided when the digitized asset exists and can be judged
   on both backgrounds. This is a Phase 2 asset-preparation call inside
   the treatment rules above — it does not reopen the ADR.
4. **Favicon:** from the same crop, prepared against the dark (default)
   theme background; favicons don't theme-switch and the hidden theme must
   not leak through browser chrome (ADR 0002 discipline).

## 3. Downstream obligations

- Mission 4 (IA): the About page composition must reserve the
  bio-beside-portrait slot; no other route carries the portrait.
- Phase 2: hero implemented with the reduced-motion and RTL behavior above;
  32px favicon legibility check; portrait ink decision at digitization.
- The `--glow` token exists in both theme blocks (`transparent` in warm) —
  parity rule holds (tokens-reference §3.3).
