# Hero Exploration Brief — for Claude Design (the ONLY open exploration)

M2 · 2026-07-21 · The palette/structure exploration (directions 01–03) is
CANCELLED — Tal locked the system to his two prototypes' exact styles. Do
not render or iterate those briefs. This brief is the single remaining
exploration: the hero (and only the hero), rendered against the LOCKED
tokens below. You explore presentation; every color/font below is a fixed
fact, not a suggestion.

## Locked tokens (do not modify — verified in the workshop)

```css
:root { /* dark, default */
  --bg:#0d0d0f; --surface:#141417; --surface-2:#18181d;
  --border:#222228; --text-strong:#ffffff; --text:#e8e8ec;
  --muted:#85858f;
  --accent-1:#ff6b35; --accent-2:#8676f8; --accent-3:#2fc98e;
  --accent-4:#f5c542; --accent-5:#e06fe8; --accent-6:#3fc9d4;
  --font-display:'Syne'; --font-mono:'DM Mono';
}
[data-theme="warm"] {
  --bg:#f5f2eb; --surface:#fffdf8; --surface-2:#f0ede4;
  --border:#ddd8cc; --text-strong:#2c2820; --text:#1a1814;
  --muted:#746a5b;
  --accent-1:#c0392b; --accent-2:#1a5276; --accent-3:#1e6641;
  --accent-4:#7d4e00; --accent-5:#4a235a; --accent-6:#0e4d6b;
  --font-display:'Fraunces'; --font-mono:'IBM Plex Mono';
}
```

System laws that bind the hero (from the workshop's locked specs):
- No box-shadows, no gradients, no window chrome anywhere else in the
  system — the hero must justify any frame it adds (direction A tests
  exactly this).
- Accents never fill backgrounds. At most ONE glow element site-wide,
  derived from `--accent-2`, static, dark theme only.
- Motion: the hero owns the system's single once-only animation license.
  Nothing loops, nothing moves on scroll.
- The mark `T://bendet` is never translated, restyled per theme, or
  decorated. Mono register.

## Render these four directions

Each: full-viewport hero + the first content section peeking below, in
BOTH temperatures, plus one Hebrew RTL variant (`dir="rtl"`, Hebrew
tagline, mark stays LTR) for the front-runner of each direction.

- **A — Terminal window (ADR 0007 verbatim):** macOS-style terminal frame,
  typing animation `T → T: → T:/ → T:// → T://bendet`, completion glow on
  `://`. Render honestly — the workshop's analysis says the frame is
  template-shaped; prove or disprove it visually.
- **B — Bare protocol resolution (workshop recommendation):** no frame; the
  typing sequence as naked display-scale mono type on `--bg`; cursor gone
  at completion; tagline reveals with completion. Variants: B1 with the
  dark-only completion glow on `://`, B2 without.
- **C — Static mark:** completed `T://bendet` as still display type,
  tagline set beside/below. No animation. Show what maximal stillness
  looks like at hero scale.
- **D — Inscription register:** the mark as lapidary capitals (engraved
  feel, letterspaced, no ornament, no Greek imagery, no animation) — this
  is the ONE licensed typographic gesture, spent here INSTEAD of the
  protocol register, never blended with it. If it needs a display face
  beyond Syne/Fraunces to read as inscription, flag the candidate — the
  workshop must verify it (license + Hebrew story) before anything hardens.

## Export

Winners + Tal's reactions to `docs/research/design-exploration/hero/` with
a `notes.md` (what won, what died, why — the ADRs need honest
alternatives). Decisions land in the workshop, not here.
