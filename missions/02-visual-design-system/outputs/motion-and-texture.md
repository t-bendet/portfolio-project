# Motion & Texture — T://bendet Visual Design System

Mission 2 · 2026-07-21
Basis: the two locked prototypes (normative for what exists), ADR 0002
(600ms theme transition — active), the design-tokens skill's restraint
rules, M1 design brief ("warmth from craft, never from ornament"), ADR 0014
(mythology bounded to naming + at most one typographic gesture). ADR 0007's
hero animation is **not** specified here — it is the second checkpoint's
question (`hero-and-illustration.md`); this file defines the system that any
hero resolution must live inside.

## 0. The finding that shapes this file

Both committed prototypes are **still**. Between them they contain exactly
four motion declarations (three hover transitions and smooth scrolling) and
**zero** of everything else: no keyframe animations, no scroll-triggered
effects, no parallax, no box-shadows, no gradients, no background images, no
noise. Stillness and flatness are not an omission to fix — they are the
prototypes' register, and per the checkpoint decision they are the system's
register. Everything below either quotes the prototypes, implements an
active ADR, or is an explicit, justified addition (marked **ADDITION**).

## 1. Motion inventory (complete)

| # | Motion | Spec | Source | Restraint justification |
|---|---|---|---|---|
| M1 | Interactive-row/card hover | `background-color 150ms ease` (surface → `--surface-2`) | Both prototypes (cards, config rows, nav links, table rows) | State feedback on pointer targets only; color-step elevation, no movement |
| M2 | Pill/link hover | `color, border-color 200ms ease` | Dark prototype `.toc a` | Same class of state feedback; 200ms is the prototype's own value |
| M3 | Theme transition | `background-color, color, border-color, fill 600ms ease` on the root swap | ADR 0002 (active) | The one theatrical moment the system owns; it is the easter egg's payoff and is invisible to anyone who never finds the switch |
| M4 | Smooth in-page scrolling | `scroll-behavior: smooth` | Warm prototype | Navigation comfort, not decoration; disabled under reduced motion (§3) |
| M5 | Focus outline appearance | Instant (no transition) | **ADDITION** | Accessibility: focus indication must never lag or fade in |

**Budget rule:** motion exists only as *state feedback* (hover, focus,
active nav) or *mode change* (theme swap, in-page navigation). Nothing moves
on load, on scroll, or on a timer. No property other than color-family
properties ever transitions — no transforms, no size changes, no fades of
content. (The sole candidate exception is the hero, ADR 0007, which runs
once-if-kept; that decision is quarantined in `hero-and-illustration.md`
and, whatever its outcome, licenses no second animated element.)

Durations as tokens: `--motion-fast: 150ms`, `--motion-hover: 200ms`,
`--motion-theme: 600ms`, easing `ease` throughout (the prototypes'
implicit default; no custom cubic-beziers — nothing here is choreographed
enough to need one).

## 2. Texture inventory (complete)

| # | Texture | Spec | Justification |
|---|---|---|---|
| T1 | Hairline seams | 1px `--border` between cells/panels (the dark prototype's 1px-gap grid trick; the warm prototype's rules) | The workshop's joinery — structure shown honestly, not drawn on |
| T2 | Shadowless elevation | Elevation = surface color step + hairline border. `box-shadow` is **banned** in both themes | Neither prototype casts a single shadow; flat color steps are the system's depth model. This is the anti-test working: template sites reach for shadow stacks |
| T3 | Accent-derived tints | `--badge-N` chip fills and warm callout fills only (palette-spec §7.2) | Already law in the palette; listed so texture has no second door for tints |
| T4 | Themed scrollbar | 6px thumb in `--border`, transparent track | Warm prototype's own detail; quiet-craft register, findable not labeled |
| T5 | The glow | **Not in the system.** Neither prototype has one; the ancestor glow belonged to the hero mark (ADRs 0004/0007) | Reserved: if the hero checkpoint keeps it, it derives from `--accent-2`, appears on exactly one element site-wide, is symmetric (RTL-safe, palette-spec §8), static (no pulse/breathe), and its warm-theme behavior is decided there. Until then the token does not exist |

**Banned by this spec** (violations of "restraint over decoration" with no
prototype ancestry): gradients, background noise/grain, glassmorphism/blur,
decorative borders or corner ornaments, parallax, skeleton shimmer,
animated underlines, hover lifts/scales, and any Greek-derived pattern
(meander etc. — already excluded by the M1 brief's hard list; restated so
texture is provably mythology-free).

## 3. `prefers-reduced-motion` (binding)

Under `prefers-reduced-motion: reduce`:

- M1/M2 hover transitions drop to instant (state feedback itself remains).
- M3 theme transition becomes instant — the theme *change* is the payoff,
  not the crossfade; ADR 0002's mechanism is untouched, only its easing
  collapses.
- M4 becomes `scroll-behavior: auto`.
- The hero, if any animation survives the checkpoint, must specify its
  reduced-motion form (expected: render the final frame immediately).

No motion in this system carries information that is lost when it is
removed — that is the test any future motion must also pass.

## 4. Mythology audit (ADR 0014)

Zero mythology-derived gestures in motion or texture. ADR 0014's single
licensed gesture is typographic and its fate belongs to
`typography-spec.md` / the hero resolution; motion claims no share of it.
Grep-test holds: nothing in this file's vocabulary references the register.

## 5. RTL audit (ADR 0011)

- All transitions are direction-agnostic (color only — nothing translates).
- T1 seams and T4 scrollbar follow logical layout automatically.
- T5's symmetry constraint is pre-committed for any future glow.
- M4 smooth scroll is axis-agnostic.

Nothing in this file needs mirroring under `dir="rtl"`.
