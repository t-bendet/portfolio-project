# Palette Spec — T://bendet Visual Design System (v2, prototype-exact)

Decided 2026-07-21: *palette = prototype-exact + minimal AA fixes*.
Ancestors and normative source of every value: Tal's committed prototypes
`assets/reference/prototypes/build-tools-overview.html` (dark) and
`tooling-deepdive.html` (warm). ADRs 0004/0005 (reopened) are input only.

**Status: hardened.** The palette checkpoint has happened — Tal's decision was
to lock the prototypes' own styles. This file is ADR-ready material for the
superseding ADRs of 0004 and 0005.

## The rule of this spec

1. **Every prototype color that passes WCAG AA ships verbatim.** No taste
   edits, no trims, no consolidation. That includes all **six accents per
   theme** and the warm theme's **l1–l6 tint boxes** (v1's 6→4 trim is
   reverted by checkpoint decision).
2. **Only failing text colors move, and only as far as AA requires.** Each
   nudge is hue-preserving (straight-line interpolation toward white or black
   in sRGB), stopped at the first step where every pair the color actually
   sits on clears 4.5:1. All six nudges are recorded in §4 with before/after
   ratios.
3. **Non-text colors (borders, dots, arrows) are never nudged** — they carry
   no AA text claim and always co-occur with a text or surface affordance
   (§7 rule 5).

## Scope

- **In scope:** full color token sets for both temperatures, the unified
  token roster across the two page archetypes, WCAG AA ratios for every
  text/background pair, the accent/tint system, usage rules, RTL notes,
  provenance for every value (verbatim / nudged / derived).
- **Out of scope:** typefaces and scale (`typography.md`), CSS custom
  property naming and switching (`tokens.md`), motion
  (`hero-and-motion.md`), hero/glow/illustration
  (`hero-and-motion.md`).

---

## 1. System shape — two archetypes × two temperatures

Per the checkpoint decision, the two prototypes are two **page archetypes**,
not two themes:

- **Overview/map archetype** (from `build-tools-overview.html`): card grids,
  section panels, chip badges, pipeline rows.
- **Deep-dive editorial archetype** (from `tooling-deepdive.html`): sidebar +
  long-form column, callout boxes, comparison tables, code panels.

Each archetype renders in **both temperatures**; the shared-structure
through-line (identical grid, spacing, radius, interaction patterns) applies
per-archetype — only temperature changes. The token roster below is therefore
the **union** of what both prototypes use, with each temperature filling every
slot. Provenance is marked per value:

- **V** — verbatim from a prototype
- **N** — nudged for AA (§4; minimal, hue-preserving)
- **D** — derived (no prototype ancestor existed for that temperature; the
  derivation rule is recorded inline). Only 5 of 44 values are derived, none
  of them text colors except by alias.

## 2. Theme 1 — default (dark)

Source: `build-tools-overview.html` `:root` plus its literal in-rule values
(hover `#18181d`, tag chip `#1e1e24`, inset `#111114`, code colors).

```css
/* Attribute model per ADR 0002: default theme is bare :root. */
:root {
  /* structure */
  --bg:            #0d0d0f;   /* V */
  --surface:       #141417;   /* V */
  --surface-2:     #18181d;   /* V — the prototype's card/row hover value */
  --surface-inset: #111114;   /* V — note boxes, pipeline steps */
  --chip-bg:       #1e1e24;   /* V — neutral .tag chip fill */
  --border:        #222228;   /* V */
  --border-strong: #444444;   /* V — the prototype's hover border (.toc a:hover) */

  /* text */
  --text-strong:   #ffffff;   /* V — headings, card names */
  --text:          #e8e8ec;   /* V */
  --muted:         #85858f;   /* N — was #6b6b78, failed AA on every bg (§4) */

  /* six accents — saturated values are never backgrounds (§7) */
  --accent-1:      #ff6b35;   /* V — orange */
  --accent-2:      #8676f8;   /* N — was #7c6af7; failed on hover + own tint (§4) */
  --accent-3:      #2fc98e;   /* V — green */
  --accent-4:      #f5c542;   /* V — amber */
  --accent-5:      #e06fe8;   /* V — magenta */
  --accent-6:      #3fc9d4;   /* V — cyan */

  /* accent-derived chip fills — the prototype's rgba(accent, 0.12) over
     --surface, resolved to opaque hexes (normative values below;
     the 12% mix is the derivation, not the definition) */
  --badge-1:       #301e1b;   /* V (resolved) */
  --badge-2:       #222032;   /* N (regenerated from nudged --accent-2) */
  --badge-3:       #172a25;   /* V (resolved) */
  --badge-4:       #2f291c;   /* V (resolved) */
  --badge-5:       #2c1f30;   /* V (resolved) */
  --badge-6:       #192a2e;   /* V (resolved) */

  /* focus — no prototype ancestor; aliases the accent-2 role */
  --focus:         var(--accent-2);   /* D — ≥3:1 UI target met on all surfaces */

  /* code panel */
  --code-bg:       #0d0d0f;   /* V — .module-code background */
  --code-text:     #c8c8d4;   /* V */
  --code-comment:  #7a7a7a;   /* N — was #444, 1.99:1 (§4) */
}
```

### Design intent (unchanged in spirit, now literally Tal's)

The workshop at night: near-black with a barely-cool cast, cards as labeled
drawers on hairline seams, six category inks rationed to badges, dots, and
labels. The register is Tal's own committed work — the anti-test is passed by
provenance: this is not a template because it is literally the author's hand.

## 3. Theme 2 — warm editorial (hidden behind the Map switch)

Source: `tooling-deepdive.html` `:root` plus its in-rule literals.

```css
/* Placeholder attribute value — deliberately mundane; final naming in
   tokens.md under the hidden-theme discipline (§9). */
[data-theme="warm"] {
  /* structure */
  --bg:            #f5f2eb;   /* V */
  --surface:       #fffdf8;   /* V */
  --surface-2:     #f0ede4;   /* V — the prototype's --surface2 */
  --surface-inset: #f0ede4;   /* V — the prototype's own collapse: flow
                                 diagrams and inline chips share surface2 */
  --chip-bg:       #f0ede4;   /* V — same collapse (inline code bg) */
  --border:        #ddd8cc;   /* V */
  --border-strong: #b8b0a0;   /* D — no warm ancestor; chosen to match the
                                 dark theme's border-strong contrast step
                                 (≈1.9:1 vs bg). Non-text, no AA claim. */

  /* text */
  --text-strong:   #2c2820;   /* V — the prototype's --ink heading color */
  --text:          #1a1814;   /* V */
  --muted:         #746a5b;   /* N — was #7a7060, 4.16 on surface-2 (§4) */
  --subtle:        #706b61;   /* N — was #b0a898, ~2:1 everywhere (§4);
                                 see the tier note below */

  /* six accents — same roles, printer's-ink temperature */
  --accent-1:      #c0392b;   /* V — deep red */
  --accent-2:      #1a5276;   /* V — navy */
  --accent-3:      #1e6641;   /* V — forest */
  --accent-4:      #7d4e00;   /* V — ochre */
  --accent-5:      #4a235a;   /* V — plum */
  --accent-6:      #0e4d6b;   /* V — teal */

  /* accent-derived tint fills — the prototype's static l1–l6, verbatim */
  --badge-1:       #fdecea;   /* V */
  --badge-2:       #e8f0f8;   /* V */
  --badge-3:       #e8f5ee;   /* V */
  --badge-4:       #fef9e7;   /* V */
  --badge-5:       #f5eef8;   /* V */
  --badge-6:       #e8f4f8;   /* V */

  /* focus */
  --focus:         var(--accent-2);   /* D — 7.48:1 on bg, far past the 3:1 UI target */

  /* code panel — ink-dark in the warm theme, the prototype's own move */
  --code-bg:       #2c2820;   /* V — pre background (--ink) */
  --code-text:     #e8e4d8;   /* V */
  --code-comment:  #938e85;   /* N — was #6b6458, 2.51:1 (§4) */
}
```

### The `--subtle` tier — an honest consequence, flagged

The warm prototype has a third text tier (`--subtle #b0a898`, used for
9–10px uppercase labels). The checkpoint decision keeps the token; AA does
not negotiate on 10px text. The minimal passing value (`#706b61`) lands
almost on top of fixed `--muted` (`#746a5b`) — **the AA floor collapses the
color distinction between the two tiers.** The roster keeps both tokens
(prototype-exact structure, and the dark theme may diverge them later without
a roster change), but hierarchy between muted and subtle text is carried by
what already distinguishes them in the prototype — size, tracking, and
uppercase — not by lightness. Recorded so nobody later "fixes" the
near-duplicate back to a failing value.

The dark theme has no third tier (the dark prototype never had one);
`--subtle` in the dark theme aliases `--muted` (D, by parity rule §7.7).

## 4. The six nudges — complete record

Method: straight-line sRGB interpolation from the failing value toward white
(colors sitting on dark backgrounds — nudges 1–3 and 6) or black (colors on
light backgrounds — nudges 4–5), in steps of 0.25%, stopped at the first
candidate where **every pair that color actually renders on** clears 4.5:1.
Computed with `scripts/contrast.ts` (exit-1-on-AA-fail), not estimated.

| # | Token | Prototype value | Worst measured failure | Nudged to | Worst pair after |
|---|---|---|---|---|---|
| 1 | dark `--muted` | `#6b6b78` | 3.16 on `--chip-bg` (3.70 on bg) | `#85858f` | 4.54 on `--chip-bg` |
| 2 | dark `--accent-2` | `#7c6af7` | 4.07 on own badge tint; 4.43 on hover | `#8676f8` | 4.51 on regenerated `--badge-2` |
| 3 | dark `--code-comment` | `#444444` | 1.99 on code-bg | `#7a7a7a` | 4.52 |
| 4 | warm `--muted` | `#7a7060` | 4.16 on `--surface-2` (4.35 on bg) | `#746a5b` | 4.54 on `--surface-2` |
| 5 | warm `--subtle` | `#b0a898` | 2.02 on `--surface-2` | `#706b61` | 4.52 on `--surface-2` |
| 6 | warm `--code-comment` | `#6b6458` | 2.51 on code-bg | `#938e85` | 4.50 |

Notes:
- Nudge 2 cascades: `--badge-2` is regenerated from the nudged accent
  (12% over `--surface` → `#222032`). The dark code keyword color, which the
  prototype set to the same violet, is aliased to `--accent-2` rather than
  keeping two violets one step apart (§6).
- Every other color in both prototypes passes verbatim — including all
  six accents in both temperatures, all warm l-tint pairs, and all four
  callout-box body-text colors. Measured proof in §5.
- Several post-nudge margins are deliberately thin (4.50–4.54): "minimal"
  was the checkpoint rule, so these sit just past the line. The CI check
  (§10) must use full-precision WCAG math, not rounded values.

## 5. WCAG AA — every text/background pair, measured

Method: WCAG 2.x relative luminance, computed by `scripts/contrast.ts` from
the exact hexes in this file. Targets: **4.5:1** normal text, **3:1** UI
indicators. No pair below relies on the large-text concession.

### 5.1 Dark theme

| Foreground | Background | Ratio | Result |
|---|---|---|---|
| `--text` #e8e8ec | `--bg` #0d0d0f | 15.89 | pass |
| `--text` | `--surface` #141417 | 15.05 | pass |
| `--text` | `--surface-2` #18181d | 14.47 | pass |
| `--text` | `--surface-inset` #111114 | 15.42 | pass |
| `--text-strong` #ffffff | `--bg` | 19.42 | pass |
| `--text-strong` | `--surface` | 18.39 | pass |
| `--text-strong` | `--surface-2` | 17.69 | pass |
| `--muted` #85858f | `--bg` | 5.32 | pass |
| `--muted` | `--surface` | 5.03 | pass |
| `--muted` | `--surface-2` | 4.84 | pass |
| `--muted` | `--chip-bg` #1e1e24 | 4.54 | pass (thin — §4) |
| `--muted` | `--surface-inset` | 5.16 | pass |
| `--accent-1` #ff6b35 | `--surface` | 6.48 | pass |
| `--accent-1` | `--surface-2` | 6.24 | pass |
| `--accent-1` | `--badge-1` #301e1b | 5.58 | pass |
| `--accent-2` #8676f8 | `--bg` | 5.51 | pass |
| `--accent-2` | `--surface` | 5.22 | pass |
| `--accent-2` | `--surface-2` | 5.02 | pass |
| `--accent-2` | `--badge-2` #222032 | 4.51 | pass (thin — §4) |
| `--accent-3` #2fc98e | `--surface` | 8.64 | pass |
| `--accent-3` | `--surface-2` | 8.31 | pass |
| `--accent-3` | `--badge-3` #172a25 | 7.08 | pass |
| `--accent-3` | `--code-bg` (code strings) | 9.12 | pass |
| `--accent-4` #f5c542 | `--surface` | 11.34 | pass |
| `--accent-4` | `--surface-2` | 10.91 | pass |
| `--accent-4` | `--badge-4` #2f291c | 8.90 | pass |
| `--accent-5` #e06fe8 | `--surface` | 6.66 | pass |
| `--accent-5` | `--surface-2` | 6.41 | pass |
| `--accent-5` | `--badge-5` #2c1f30 | 5.65 | pass |
| `--accent-6` #3fc9d4 | `--surface` | 9.21 | pass |
| `--accent-6` | `--surface-2` | 8.86 | pass |
| `--accent-6` | `--badge-6` #192a2e | 7.45 | pass |
| `--code-text` #c8c8d4 | `--code-bg` #0d0d0f | 11.71 | pass |
| `--code-comment` #7a7a7a | `--code-bg` | 4.52 | pass |
| `--focus` (= `--accent-2`) | `--bg` | 5.51 | pass (3:1 UI target) |
| `--focus` | `--surface` | 5.22 | pass (3:1 UI target) |

Informative (non-text, no AA claim): `--border` #222228 vs `--bg` ≈1.3;
`--border-strong` #444444 vs `--bg` ≈2.6. See §7 rule 5.

### 5.2 Warm theme

| Foreground | Background | Ratio | Result |
|---|---|---|---|
| `--text` #1a1814 | `--bg` #f5f2eb | 15.85 | pass |
| `--text` | `--surface` #fffdf8 | 17.44 | pass |
| `--text` | `--surface-2` #f0ede4 | 15.14 | pass |
| `--text-strong` #2c2820 | `--bg` | 13.12 | pass |
| `--text-strong` | `--surface` | 14.43 | pass |
| `--text-strong` | `--surface-2` | 12.53 | pass |
| `--muted` #746a5b | `--bg` | 4.75 | pass |
| `--muted` | `--surface` | 5.22 | pass |
| `--muted` | `--surface-2` | 4.54 | pass (thin — §4) |
| `--subtle` #706b61 | `--bg` | 4.74 | pass |
| `--subtle` | `--surface` | 5.21 | pass |
| `--subtle` | `--surface-2` | 4.52 | pass (thin — §4) |
| `--accent-1` #c0392b | `--bg` | 4.86 | pass |
| `--accent-1` | `--surface-2` | 4.65 | pass |
| `--accent-1` | `--badge-1` #fdecea | 4.76 | pass |
| `--accent-2` #1a5276 | `--bg` | 7.48 | pass |
| `--accent-2` | `--surface-2` | 7.14 | pass |
| `--accent-2` | `--badge-2` #e8f0f8 | 7.26 | pass |
| `--accent-3` #1e6641 | `--bg` | 6.19 | pass |
| `--accent-3` | `--surface-2` | 5.92 | pass |
| `--accent-3` | `--badge-3` #e8f5ee | 6.18 | pass |
| `--accent-4` #7d4e00 | `--bg` | 6.34 | pass |
| `--accent-4` | `--surface-2` | 6.06 | pass |
| `--accent-4` | `--badge-4` #fef9e7 | 6.73 | pass |
| `--accent-5` #4a235a | `--bg` | 11.19 | pass |
| `--accent-5` | `--surface-2` | 10.68 | pass |
| `--accent-5` | `--badge-5` #f5eef8 | 11.00 | pass |
| `--accent-6` #0e4d6b | `--bg` | 8.19 | pass |
| `--accent-6` | `--surface-2` | 7.82 | pass |
| `--accent-6` | `--badge-6` #e8f4f8 | 8.17 | pass |
| box body `#2a4060` (info) | `--badge-2` | 9.12 | pass |
| box body `#4a3800` (warn) | `--badge-4` | 10.73 | pass |
| box body `#1a4428` (tip) | `--badge-3` | 9.85 | pass |
| box body `#5a1a14` (danger) | `--badge-1` | 11.53 | pass |
| `--code-text` #e8e4d8 | `--code-bg` #2c2820 | 11.54 | pass |
| `--code-comment` #938e85 | `--code-bg` | 4.50 | pass (thinnest in system — §4) |
| `--focus` (= `--accent-2`) | `--bg` | 7.48 | pass (3:1 UI target) |

Informative (non-text): `--border` #ddd8cc vs `--bg` ≈1.3; `--border-strong`
#b8b0a0 vs `--bg` ≈1.9. The four callout box border colors (`#b8cfe8`,
`#e8d89a`, `#a8d8b8`, `#e8b8b4`) are decorative-structural borders on their
own tint fills — non-text, and each box also carries an AA-passing title and
body (rows above).

## 6. Code panels and syntax colors

Code panels are ink-dark in **both** temperatures — dark `#0d0d0f` panels,
warm `#2c2820` panels (the warm prototype's own inverted-pre move). One
syntax roster serves both archetypes; per-theme values below. The binding
constraint: **every syntax color measures ≥4.5:1 on its theme's
`--code-bg`.**

| Token | Dark value (on #0d0d0f) | Warm value (on #2c2820) | Provenance |
|---|---|---|---|
| `--code-kw` (also bool) | `var(--accent-2)` #8676f8 → 5.51 | #d4a857 → 6.66 | dark: prototype kw was the same violet as accent-2; aliased post-nudge rather than keeping two violets one step apart. warm: V |
| `--code-str` | `var(--accent-3)` #2fc98e → 9.12 | #7ec87e → 7.30 | dark: V (prototype used accent-3 exactly). warm: V |
| `--code-ty` | #87b3d4 → 8.72 | #87b3d4 → 6.59 | dark: D (adopted from warm set — dark prototype had no type token). warm: V |
| `--code-prop` | #c99fd0 → 8.65 | #c99fd0 → 6.53 | dark: D (same adoption). warm: V |
| `--code-num` | #e08060 → 6.87 | #e08060 → 5.19 | dark: D (same adoption). warm: V |
| `--code-comment` | #7a7a7a → 4.52 | #938e85 → 4.50 | both: N (§4 — both prototypes rendered comments at ~2:1; comments are text and get no exemption) |

The three adopted dark values (ty/prop/num) are the warm prototype's own
syntax colors, which measure comfortably on the dark panel — no invented
hues. Final custom-property naming belongs to `tokens.md`.

## 7. Usage rules (binding on all M2 component specs)

1. **Saturated accents are never backgrounds.** Preserved principle from
   0004/0005, restated as law: no `--accent-N` fills a surface, section,
   button, or hero.
2. **Accent-derived tints are sanctioned in exactly the two prototype
   patterns:** chip-scale badge fills (`--badge-N` behind `--accent-N` text)
   and callout-box fills in the warm temperature (the l-tint boxes with
   their AA-passing title/body inks). No third tint pattern without a new
   scoped decision.
3. **Callout idiom is per-temperature, structure shared.** Same box, radius,
   and accent-edge structure in both temperatures; the dark temperature
   fills with `--surface-inset` + accent `border-inline-start` (its
   prototype's `.note` idiom), the warm temperature fills with `--badge-N`
   tints (its prototype's `.box` idiom). This is the recorded resolution of
   the archetype × temperature cross-product for callouts.
4. **Accent placement budget:** badges, category dots, labels, callout
   edges/titles, syntax highlighting. Links are not accent-colored — links
   use `--text` with an underline treatment (interaction spec); there is
   deliberately no `--link` token. The glow was resolved at checkpoint 2
   (Tal, 2026-07-21): neither prototype contains one, and exactly one exists
   site-wide — the hero mark's completion glow, derived from `--accent-3`,
   dark theme only (`--glow` resolves to `transparent` in warm). Definition
   in `hero-and-motion.md`; registry row in `tokens.md`
   §3.3. The glowed `://` characters render in `--accent-3`, whose pairs
   are AA-measured in §5 (9.12 dark bg / 6.19 warm bg).
5. **Borders are never the sole affordance.** Hairline ratios are below 3:1
   by design; any control whose boundary must be perceived on its own pairs
   its border with a surface step and receives a `--focus` outline ≥2px on
   focus (`--focus` meets 3:1 in both themes, §5).
6. **The muted floor.** No text renders below its theme's worst `--muted`
   ratio on the same background. `--subtle` exists at the same floor (§3
   tier note) — it is a size/tracking register, not a lower-contrast one.
7. **Theme parity:** every token has a value in both temperatures (aliases
   count), measured before use. A token in one theme only is a spec
   violation and a hidden-theme leak (§9).

## 8. RTL / Hebrew interaction (ADR 0011)

Color tokens are direction-agnostic; the palette itself has no RTL
interaction — stated explicitly. Two binding flags for downstream specs:

1. **Accent edges must be logical.** Both prototypes hang accent edges on
   `border-left` (dark `.note`/`.blN`, warm `.nav-link`). Every component
   consuming an accent or structural edge must bind it with
   `border-inline-start` so it sits on the reading-start side under
   `dir="rtl"`.
2. **Shadow/glow geometry must be symmetric** (no directional offset), so
   any future glow renders identically in RTL.

Contrast ratios are script-independent; Hebrew text obeys the same tables.
Whether Hebrew companion faces need weight/size compensation is
`typography.md`'s question.

## 9. Hidden-theme discipline (ADR 0002)

- The shipped stylesheet necessarily contains both token blocks; ADR 0002
  accepts this. Forbidden is *acknowledgment*: no toggle UI, no copy, no
  docs, no `aria` announcement of a second theme.
- Shipped identifiers stay mundane: `data-theme="warm"` here is a
  placeholder; no shipped selector, token, comment, or asset may use
  `jekyll`, `hyde`, `map`, `marauder`, `mischief`, or any pointer at the
  mechanism. Final naming is fixed in `tokens.md` under this rule.
- The 600ms transition and incantation mechanism are ADR 0002's and
  untouched; the palette's obligation is total coverage (§7 rule 7) so the
  transition never half-applies.

## 10. Verification methodology

Every ratio in this file was produced by `scripts/contrast.ts` (WCAG 2.x
luminance, full precision, exit 1 on any AA failure), run against the pair
lists derived from the prototypes' actual CSS — every foreground/background
combination the two files really render, not a curated subset. The verbatim
prototype values were measured first (which is what isolated the six
failures in §4 — exactly the families Tal's checkpoint recorded); the nudged
values were then re-verified in the same run shape. Phase 2 CI should encode
§5's pair tables as a mechanical gate (natural fit with the from-scratch
CI/CD showcase, ADR 0012); because §4's margins are thin by design, the gate
must compare at full precision, not two-decimal rounding.

## Checkpoint state

The palette checkpoint is **resolved** — this file implements Tal's recorded
decision and contains no open taste questions. Remaining open items for this
mission live elsewhere: hero/glow (ADR 0007) and illustration (ADR 0008) in
`hero-and-motion.md` (second checkpoint), typography Hebrew companions
in `typography.md`.
