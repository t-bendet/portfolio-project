# Hero, Motion & Texture

Consolidated from the Phase 1 design system work (hero-and-illustration +
motion-and-texture). The system's register is **still and flat**: the locked
prototypes contain no keyframe animation, no shadows, no gradients. The hero
is the single licensed animation.

## 1. The hero — bare protocol resolution

- **Form:** display-scale type directly on `--bg`. No container, no frame,
  no chrome (the earlier terminal-window idea was dropped as
  template-shaped). The mark is set in `--font-mono` (DM Mono dark /
  IBM Plex Mono warm) at `--size-h1`.
- **Sequence (once per page load, never loops):**
  `T` → `T:` → `T:/` → `T://` → `T://bendet`, block cursor visible during
  resolution, gone at completion.
- **Completion (single step):** cursor disappears, the `://` takes
  `--accent-3`, tagline and page content reveal (one opacity step; part of
  the hero's single licensed animation).
- **The glow:** at completion the `://` receives
  `--glow: color-mix(in srgb, var(--accent-3) 35%, transparent)` —
  **dark theme only**, appearing once and holding static (no pulse). In the
  warm theme `--glow` is `transparent` (a glow is a dark-room phenomenon);
  the `://` still takes `--accent-3` (forest) so the completion state is
  structurally identical. AA facts: `--accent-3` measures 9.12:1 on dark
  `--bg`, 6.19:1 on warm `--bg` (palette §5). This is the **single glow
  element site-wide**.
- **Reduced motion:** `prefers-reduced-motion` renders the final frame
  immediately — mark complete, `://` accented (glow included; it is static
  decoration, not motion), content visible. No information exists only in
  the animation.
- **RTL:** the mark is an LTR run regardless of page `dir`; hero alignment
  binds to logical start; the glow is symmetric. Identical experience in
  Hebrew.
- **Register purity:** protocol/mono only. No inscription blending — the
  lapidary license is formally unexercised anywhere; zero gestures is final.

## 2. The portrait

1. **Placement:** About page, beside the bio, and the favicon (tight crop;
   must be verified legible at 32px before shipping). **Not on the
   home/hero** — person-surface and protocol-surface stay separate.
2. **Treatment (binding):** the drawing ships as itself — original linework,
   unframed, no border, no background plate, no filter. Never mythologized:
   no laurels, no Greek framing, no inscription treatment on or near it. It
   is the one deliberately un-systematized element.
3. **Ink behavior across themes: deferred by decision** — whether the
   linework binds to `--text-strong` (SVG `currentColor`) or ships untouched
   is decided when the digitized asset exists and can be judged on both
   backgrounds.
4. **Favicon:** from the same crop, prepared against the dark (default)
   theme background; favicons don't theme-switch and the hidden theme must
   not leak through browser chrome.

## 3. Motion inventory (complete)

| # | Motion | Spec | Justification |
|---|---|---|---|
| M1 | Interactive-row/card hover | `background-color 150ms ease` (surface → `--surface-2`) | State feedback on pointer targets only; color-step elevation, no movement |
| M2 | Pill/link hover | `color, border-color 200ms ease` | Same class; prototype's own value |
| M3 | Theme transition | `background-color, color, border-color, fill 600ms ease` on the root swap | The one theatrical moment; the easter egg's payoff, invisible to anyone who never finds the switch |
| M4 | Smooth in-page scrolling | `scroll-behavior: smooth` | Navigation comfort; disabled under reduced motion |
| M5 | Focus outline appearance | Instant (no transition) | Focus indication must never lag or fade in |

**Budget rule:** motion exists only as *state feedback* (hover, focus,
active nav) or *mode change* (theme swap, in-page navigation). Nothing moves
on load, on scroll, or on a timer — except the hero, which runs once and
licenses no second animated element. No property other than color-family
properties ever transitions — no transforms, no size changes, no content
fades.

Duration tokens: `--motion-fast: 150ms`, `--motion-hover: 200ms`,
`--motion-theme: 600ms`, easing `ease` throughout (no custom cubic-beziers).

## 4. Texture inventory (complete)

| # | Texture | Spec |
|---|---|---|
| T1 | Hairline seams | 1px `--border` between cells/panels — structure shown honestly |
| T2 | Shadowless elevation | Elevation = surface color step + hairline border. `box-shadow` is **banned** in both themes |
| T3 | Accent-derived tints | `--badge-N` chip fills and warm callout fills only (palette §7.2) — no second door for tints |
| T4 | Themed scrollbar | 6px thumb in `--border`, transparent track |
| T5 | The glow | The hero's `://` completion glow, dark theme only — the single glow site-wide (§1) |

**Banned:** gradients, background noise/grain, glassmorphism/blur,
decorative borders or corner ornaments, parallax, skeleton shimmer,
animated underlines, hover lifts/scales, and any Greek-derived pattern.

## 5. `prefers-reduced-motion` (binding)

- M1/M2 hover transitions drop to instant (state feedback remains).
- M3 theme transition becomes instant — the theme *change* is the payoff,
  not the crossfade.
- M4 becomes `scroll-behavior: auto`.
- Hero: final frame immediately (§1).

No motion in this system carries information that is lost when it is
removed — the test any future motion must also pass.

## 6. RTL audit

All transitions are direction-agnostic (color only). Seams and scrollbar
follow logical layout. The glow is symmetric. Nothing needs mirroring under
`dir="rtl"`.
