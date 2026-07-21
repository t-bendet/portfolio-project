# Direction 03 — Bare Protocol (gesture declined, terminal superseded)

The maximum-restraint direction: no lapidary gesture (declining is a valid
ADR 0014 outcome), no terminal metaphor, no glow. The identity is carried
entirely by typography, spacing, and the protocol idiom itself. This
direction exists to test whether the discipline alone is distinctive —
if it renders as generic minimalism, that is a finding, not a failure of
the exercise.

## Temperament

A specification that reads like a person wrote it. The hero is closer to an
RFC header or a man page's NAME section than to a splash screen: the mark,
a one-line description in the honest voice, and the page simply begins.
Confidence through understatement — nothing performs.

## Hero concept

Supersedes the terminal (reopened ADR 0007) with static composition. The
mark `T://bendet` set large but in the site's ordinary type voice — no
animation, no glow, no special treatment beyond scale and space. Explore a
"protocol header" arrangement: eyebrow, mark, a single muted line
(e.g. `personal namespace of Tal Bendet — systems, writing, translation`),
generous whitespace, then real content already visible above the fold.
The warmth comes from voice and the article content being immediately
present, not from any hero theater.

## Palette (workshop-verified base)

Same tokens as Direction 01 but `--glow: transparent` in both themes (this
direction spends nothing on light effects). Warm primary: render burnt red
`#b23222` first; bronze `#7f5527` as the fallback variant if red feels
loud against this direction's quiet.

```css
:root { /* dark */
  --bg: #0d0d0f;  --surface: #141417;  --surface-2: #1a1a1f;
  --border: #24242b;  --border-strong: #3f3f4a;
  --text-strong: #ffffff;  --text: #e8e8ec;  --muted: #8b8b99;
  --accent-1: #ff6b35;  --accent-2: #8878f8;
  --accent-3: #2fc98e;  --accent-4: #f5c542;
  --glow: transparent;
}
[data-theme="warm"] {
  --bg: #f5f2eb;  --surface: #fffdf8;  --surface-2: #f0ede4;
  --border: #ddd8cc;  --border-strong: #b8b0a0;
  --text-strong: #0f0d0a;  --text: #1a1814;  --muted: #6b6255;
  --accent-1: #b23222;  --accent-2: #4a235a;
  --accent-3: #1e6641;  --accent-4: #7d4e00;
  --glow: transparent;
}
```

## Signature moves to render

- Content-forward home: the hero occupies minimal height; writing/work is
  visible without scrolling.
- Either badge construction works here — render tinted chips AND outline
  variants; this direction is the cleanest A/B surface for that call.
- The portrait may matter most in this direction: with no hero theater,
  the hand-drawn face is the loudest human element on the site. Render the
  About composition.

## What this direction risks

The anti-test, from the other side: restraint without a signature can land
as template minimalism — the exact "any competent developer's portfolio"
failure. The protocol idiom (eyebrow namespace, the mark-as-address) must
visibly organize the pages, or this direction has no spine. If Design
renders it and it looks like a default blog theme, kill it honestly.
