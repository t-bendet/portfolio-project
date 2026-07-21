# Direction 02 — Inscription (the licensed lapidary gesture, taken)

The one exploration ADR 0014 licenses: a single inscription/lapidary
typographic gesture. This direction spends it on the mark's presentation —
which means the terminal idiom is superseded here (the two registers may
never blend; one hero, one register).

## Temperament

Engraved, not typed. The mark set like a maker's stamp cut into the
surface: widely letterspaced capitals, weight from carving rather than
color. Stillness instead of animation — the hero does not move; it is
*already there*, like an inscription predating the visitor. The rest of the
page stays in the quiet workshop register so the single gesture carries.

## Hero concept

Supersedes the terminal (reopened ADR 0007). `T://BENDET` (or `T://bendet` —
render both) in a lapidary setting: generous tracking, possibly incised/
letterpress-style treatment (shadow-carved, not glowing), on the bare page
surface — no window chrome, no cursor, no animation. Tagline beneath in the
ordinary text voice, so the gesture is bounded to the mark alone.

Hard bounds while exploring:
- This is the ONE gesture. No lapidary headings elsewhere, no second use.
- No Greek labeling, ornament, serifs-because-Greece reasoning, or any
  mythological reference riding along. The gesture must survive with zero
  explanation.
- MUST be rendered against the Hebrew RTL article too: the lapidary mark
  adjacent to Hebrew text is the likeliest degradation point — check it.

## Palette (workshop-verified base, bronze variant)

Same structure/text tokens as Direction 01. Accent variant that sits closer
to stone-and-ink: warm primary is bronze rather than red, and there is NO
glow in either theme (light effects fight the carved register).

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
  --accent-1: #7f5527; /* bronze (AA-verified) */  --accent-2: #4a235a;
  --accent-3: #1e6641;  --accent-4: #7d4e00;
  --glow: transparent;
}
```

## Signature moves to render

- The incised mark treatment (dark: carved out of shadow; warm: pressed
  into paper — letterpress debossing rather than engraving in light).
- Outline badges (accent text + accent hairline border, no fill) — flat
  ink marks suit the carved register better than tinted chips.
- Eyebrow labels stay in the ordinary small-caps/mono voice — they are NOT
  the gesture and must not echo it.

## What this direction risks

Lapidary type flirts with monument-solemnity — the person can vanish from
the workshop. The warmth layer (portrait, voice, human details) has to work
harder here; render the About-page composition to see if the site still
feels lived-in. Also the gesture is spent forever: ≤1 site-wide, and this
direction uses it on the most prominent surface.
