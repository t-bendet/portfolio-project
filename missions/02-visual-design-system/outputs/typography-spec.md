# Typography Spec — T://bendet Visual Design System

Mission 2 · 2026-07-21
Basis: Tal's checkpoint decision (fonts = prototype-exact), the two committed
prototypes (normative for families, weights-in-use, and scale), ADR 0001
(eyebrow pattern is identity), ADR 0011 (Hebrew/RTL hard constraint), ADR
0014 + M1 design brief (at most one lapidary gesture, declinable). Hebrew
coverage facts below were **web-verified by the design-verifier agent
(2026-07-21) against the authoritative `google/fonts` METADATA.pb files**,
not assumed; source URLs inline.

## 1. Families and roles

Latin families are locked by checkpoint; Hebrew companions are this spec's
decision (verified facts, §3).

### Dark temperature (default)

| Role | Family | Weights in use | Facts (verified) |
|---|---|---|---|
| Display + body (`--font-display`, `--font-body`) | **Syne** | 400 / 600 / 700 / 800 | Variable `wght` 400–800; **no italic exists**; no Hebrew subset; OFL. [METADATA](https://raw.githubusercontent.com/google/fonts/main/ofl/syne/METADATA.pb) |
| Chrome + code (`--font-mono`) | **DM Mono** | 400 / 500 | Static 300/400/500 + italics; no Hebrew; OFL. [METADATA](https://raw.githubusercontent.com/google/fonts/main/ofl/dmmono/METADATA.pb) |
| Hebrew companion (both roles) | **Heebo** | matched per slot | Variable `wght` 100–900 (covers Syne's full 400–800 range); grotesque-geometric — the right register beside both Syne and DM Mono; **no italic** (moot: Syne has none either); hebrew+latin subsets; OFL. [METADATA](https://raw.githubusercontent.com/google/fonts/main/ofl/heebo/METADATA.pb) |

Correction of record: reopened ADR 0006 described the dark system as "DM
Mono for everything." The committed dark prototype actually sets body in
**Syne** and uses DM Mono for eyebrows, chrome, and code. The superseding
ADR records the prototype truth.

### Warm temperature (hidden)

| Role | Family | Weights in use | Facts (verified) |
|---|---|---|---|
| Display + body (`--font-display`, `--font-body`) | **Fraunces** | 300 / 600 / 700 + italic 300 | Variable `opsz` 9–144 / `wght` 100–900 / `SOFT` / `WONK`, italic variable file with same axes; no Hebrew; OFL. [METADATA](https://raw.githubusercontent.com/google/fonts/main/ofl/fraunces/METADATA.pb) |
| Chrome + code (`--font-mono`) | **IBM Plex Mono** | 400 / 500 / 600 | Static 100–700 + italics; no Hebrew; OFL. [METADATA](https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexmono/METADATA.pb) |
| Hebrew companion — body/display | **Frank Ruhl Libre** | matched per slot | Variable `wght` 300–900 (floor exactly matches Fraunces' 300 body weight); classic Hebrew book-serif lineage — the editorial register the warm theme exists for; no italic (see §5); OFL. [METADATA](https://raw.githubusercontent.com/google/fonts/main/ofl/frankruhllibre/METADATA.pb) |
| Hebrew companion — mono slots | **IBM Plex Sans Hebrew** | 400 / 500 / 600 | Static 100–700; same superfamily as Plex Mono, designed to harmonize; hebrew subset confirmed; OFL. [METADATA](https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexsanshebrew/METADATA.pb) |

## 2. Hebrew coverage verification (ADR 0011 hard check)

Verified 2026-07-21 from `google/fonts` METADATA.pb (the data driving the
Google Fonts CSS API):

| Family | `hebrew` subset? | Verdict |
|---|---|---|
| Syne | **No** (greek, latin, latin-ext only). The claim that Syne gained Hebrew was searched for explicitly and found unsupported — false/outdated. | Needs companion |
| DM Mono | **No** (latin, latin-ext) | Needs companion |
| Fraunces | **No** (latin, latin-ext, vietnamese) | Needs companion |
| IBM Plex Mono | **No** (cyrillic, latin families, vietnamese) | Needs companion |
| Heebo | **Yes** | Companion, dark |
| Frank Ruhl Libre | **Yes** | Companion, warm body |
| IBM Plex Sans Hebrew | **Yes** | Companion, warm mono slots |

Alternatives verified and available if taste rejects a companion (all
hebrew-subset, OFL, on Google Fonts): Noto Serif Hebrew (var 100–900),
Noto Sans Hebrew (var 100–900 + width axis), Rubik (var 300–900 + italic),
Miriam Libre (var 400–700), David Libre (static 400/500/700), Secular One /
Suez One (display, single-weight — usable for Hebrew display accents only,
not body).

**Hebrew monospace finding:** there is effectively **no Hebrew-native
monospace on Google Fonts** — none of the hebrew-subset families is
monospace, and the one notable Hebrew-glyphed mono in the wild (Cascadia
Code) is not in the Google Fonts pipeline. Consequence: Hebrew text in
mono-styled slots renders in the companion sans, not fixed-width. This is
an **accepted asymmetry, recorded as a decision** — the standard practice,
not an oversight. (One residual: the live Google Fonts category-filter
empty-state couldn't be machine-rendered; the METADATA-level checks above
are authoritative for every named family, but a 10-second manual look at
the hebrew+monospace filter is a cheap belt-and-braces check for Phase 2.)

## 3. Font stacks (the companion mechanism)

Companions enter through stacks + per-script `unicode-range` — never as
separate tokens (tokens-reference §3.5). The browser routes Hebrew
codepoints to the companion file automatically; Latin never silently falls
back to the companion.

```css
/* dark */
--font-display: "Syne", "Heebo", sans-serif;
--font-body:    "Syne", "Heebo", sans-serif;
--font-mono:    "DM Mono", "Heebo", monospace;

/* warm */
--font-display: "Fraunces", "Frank Ruhl Libre", serif;
--font-body:    "Fraunces", "Frank Ruhl Libre", serif;
--font-mono:    "IBM Plex Mono", "IBM Plex Sans Hebrew", monospace;
```

Delivery facts (verified): the Google Fonts CSS API serves per-script
`unicode-range` subsets automatically; self-hosting with only
`latin` + `hebrew` subsets is supported by Fontsource (per-subset packages)
and google-webfonts-helper. Self-hosting is the expectation (performance
budget + CI showcase); the pipeline is **mixed** — Syne/Fraunces/Heebo/Frank
Ruhl Libre are variable, both Plex Mono, Plex Sans Hebrew and DM Mono are
static — so the loading strategy cannot assume variable-only. Phase 2
implementation detail; recorded here as a constraint.

Metric compensation: Hebrew companions will not share x-height/overshoot
with their Latin partners; `size-adjust`/`ascent-override` tuning in
`@font-face` is Phase 2 work, gated by visual QA of mixed-script pages
under both `dir` values. No blind percentage is specified here — that would
be an assumed number, and this spec's rule is verified-or-absent.

## 4. Scale — per archetype, tokenized

The scale is the union of the two prototypes' actual values (prototype-exact
rule). Steps are tokens; each archetype consumes the steps it uses. rem
values assume 16px root.

### Shared steps (both temperatures)

| Token | Value | Used for |
|---|---|---|
| `--size-micro` | 9px | badge text, box titles, sidebar section labels |
| `--size-label` | 10px | tags, vs-labels, warm eyebrow |
| `--size-eyebrow` | 11px | dark eyebrow, toc pills, chapter numbers |
| `--size-code` | 12.5px | code blocks (dark prototype 11–12px, warm 12.5px — unified at 12.5px, the long-form reading value) |
| `--size-meta` | 13px | card descriptions, config rows, table cells |
| `--size-body` | 15.5px | long-form body (warm prototype: 15.5px; dark prototype card bodies stay on `--size-meta`) |
| `--size-lede` | 17px | page descriptions / ledes |
| `--size-h4` | 12px | mono uppercase h4 (deep-dive) |
| `--size-h3` | 1.2rem | deep-dive h3 |
| `--size-h2` | 1.9rem | deep-dive h2 (overview archetype's section headers are `--size-meta` mono-caps — a different device, same token roster) |
| `--size-h1` | `clamp(2.4rem, 5vw, 3.8rem)` warm · `clamp(2rem, 5vw, 3.4rem)` dark | page titles — the one theme-varying step (type voice is temperature) |

### Line-height and tracking tokens

| Token | Value | Notes |
|---|---|---|
| `--leading-display` | 1.05 | h1, both prototypes |
| `--leading-tight` | 1.5 | dense rows/cells |
| `--leading-body` | 1.6 (dark) / 1.75 (warm) | each prototype's own body rhythm — theme-varying |
| `--leading-code` | 1.7–1.8 | per prototype |
| `--track-display` | -0.03em (dark) / -0.02em (warm) | h1 |
| `--track-eyebrow` | 0.2em | eyebrows (Latin only — §6) |
| `--track-label` | 0.08–0.15em | badges/labels/section caps (Latin only) |

### Weight map

| Slot | Dark (Syne/DM Mono) | Warm (Fraunces/Plex Mono) |
|---|---|---|
| h1 | 800 | 700 |
| h2/h3 / card names | 700 | 600 / 700 |
| body | 400 | 300 |
| body emphasis | 600 | 600 |
| mono chrome | 400–500 | 400–600 |

Hebrew slots match these weights one-for-one — every companion's verified
weight range covers its partner's ceiling (Heebo 100–900 ⊇ Syne 400–800;
Frank Ruhl Libre 300–900 ⊇ Fraunces' used 300–700; Plex Sans Hebrew 100–700
⊇ Plex Mono's used 400–600). The scale is planned around the Hebrew
ceiling by construction — no slot uses a weight its companion lacks.

## 5. Emphasis rules (the italic asymmetry, decided)

- **Dark temperature: no italic exists anywhere** — Syne has no italic file
  (verified). Emphasis is weight (600) and `--text-strong` color. This is
  the prototype's own behavior.
- **Warm temperature: italic is a Latin-only inflection.** Fraunces italic
  300 serves ledes and editorial asides (the prototype's `page-desc`).
  Hebrew has no native italic and none of the Hebrew serifs carries one
  (verified) — Hebrew renders upright, emphasis via weight, in both
  directions of the same paragraph if mixed. The design must not hang
  *meaning* on italics alone; italic is voice, weight is emphasis.

## 6. Eyebrow treatment (ADR 0001 — identity, not styling)

The `T://bendet · section` eyebrow appears on every page:

- Mono family (`--font-mono`), `--size-eyebrow` (dark) / `--size-label`
  (warm — the prototypes genuinely differ by 1px; kept), uppercase,
  `--track-eyebrow` 0.2em, `--muted` (the prototypes' failing
  subtle/muted eyebrow values are AA-fixed by palette-spec §4).
- **The mark segment `T://bendet` is never translated, never transliterated,
  never restyled per theme** (ADR 0001: unaltered and unthemed).
- **On Hebrew pages** the section segment may be Hebrew: it renders via the
  mono-slot stack (companion sans), **no `text-transform` effect (Hebrew is
  unicameral) and `letter-spacing: normal` on Hebrew runs** — 0.2em
  tracking is a Latin-caps idiom and damages Hebrew letterforms' rhythm.
  Hierarchy for the Hebrew segment is carried by size + `--muted` color,
  which it shares with the Latin treatment. Direction: the eyebrow line
  follows the page's `dir`; the mark segment stays an LTR run inside it
  (Unicode bidi handles this without markup; verify in QA with a bidi
  isolate `<bdi>` as the fallback if a renderer misorders the `://`).

## 7. RTL rules beyond the eyebrow (ADR 0011)

1. **Code blocks are always LTR** (`dir="ltr"` on `pre`/`code`), whatever
   the page direction — code is notation. Inline Hebrew inside comments or
   strings renders via the stack's companion within the LTR block.
2. Numerals, paths, and the protocol mark inside Hebrew prose are LTR runs;
   rely on bidi defaults, isolate with `<bdi>`/`unicode-bidi: isolate` where
   QA shows misordering.
3. All type-adjacent geometry (heading borders, list markers, blockquote
   edges) binds via logical properties — restating the registry rule
   (tokens-reference §5) at the type layer.
4. Perceived-density check is a **required QA step** when Hebrew companions
   first render in Phase 2: Frank Ruhl Libre at 15.5px/1.75 against
   Fraunces 300 — adjust per-face `size-adjust` there, not by changing
   scale tokens.

## 8. The licensed lapidary gesture — declined for the base system

ADR 0014 / the M1 brief license at most one inscription/lapidary typographic
gesture, declinable. **The base typography system declines it.** The locked
families contain no lapidary register, and prototype-exactness leaves no
slot where an engraved treatment could live without becoming ornament
(exactly what the restraint rules exclude). The single license is neither
spent nor voided: if it is ever exercised, the only candidate surface is
the hero (ADR 0007 resolution, second checkpoint) — and the brief's
no-blending rule means a lapidary hero would replace, not decorate, the
terminal idiom. Recorded so the license's state is unambiguous: **available
to the hero resolution only; zero gestures elsewhere is final.**

## 9. Loading and licensing summary

All seven families OFL (verified per-family above) — self-hosting is
license-clean. Subsets: `latin` + `hebrew` only (+ `latin-ext` where a
family needs it for punctuation coverage). Files: 4 variable + 3 static
families; per-theme payload is 3 families (the hidden theme's fonts load
with it, which is acceptable — ADR 0002 already accepts the stylesheet
containing both themes; lazy-loading the warm fonts on first toggle is a
Phase 2 option that must not add a visible swap during the 600ms
transition).
