# Direction 01 — Night Workshop (terminal evolved)

The prototype-descended direction: Tal's own two prototypes, measured,
corrected, and disciplined. The terminal hero survives in evolved form.

## Temperament

The workshop at night / the same workshop with shutters open. Precision is
the default register; warmth arrives only through the hidden switch. The
person shows in rationed marks — one glow, sparse accents — not ornament.

## Hero concept

Evolution of the terminal idea (reopened ADR 0007): a terminal window types
`T` → `T:` → `T:/` → `T://` (pause) → `bendet`; glow blooms on `://` at
completion; cursor exits; tagline and links fade up. Runs once, never loops.
Explore: how minimal can the terminal chrome get before it's just a text
frame? (The window dressing is negotiable; the typed protocol is the idea.)

## Palette (workshop-verified base)

```css
:root { /* dark — default */
  --bg: #0d0d0f;  --surface: #141417;  --surface-2: #1a1a1f;
  --border: #24242b;  --border-strong: #3f3f4a;
  --text-strong: #ffffff;  --text: #e8e8ec;  --muted: #8b8b99;
  --accent-1: #ff6b35;  --accent-2: #8878f8;
  --accent-3: #2fc98e;  --accent-4: #f5c542;
  --glow: rgba(136, 120, 248, 0.35);
}
[data-theme="warm"] { /* hidden editorial */
  --bg: #f5f2eb;  --surface: #fffdf8;  --surface-2: #f0ede4;
  --border: #ddd8cc;  --border-strong: #b8b0a0;
  --text-strong: #0f0d0a;  --text: #1a1814;  --muted: #6b6255;
  --accent-1: #b23222;  --accent-2: #4a235a;
  --accent-3: #1e6641;  --accent-4: #7d4e00;
  --glow: transparent; /* glow is a dark-room phenomenon */
}
```

## Signature moves to render

- Glow on the mark's `://`, dark theme only; in warm daylight it simply
  goes out.
- Tinted badge chips (12% accent over surface) — the prototypes' own
  pattern.
- Ink-dark code panels in BOTH themes (the warm prototype inverted its own
  code blocks; one syntax set serves both).
- Type direction: monospace-led (final faces are a workshop decision;
  render with a good mono placeholder).

## What this direction risks

Terminal heroes are a known portfolio trope — the anti-test bites hardest
here. The typed *protocol* (a namespace resolving) is the differentiator;
if the render reads as "developer terminal hero #4000", the direction dies.
