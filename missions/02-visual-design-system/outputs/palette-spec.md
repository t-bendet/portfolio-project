# Palette Spec — T://bendet Visual Design System

Mission 2 · 2026-07-21
Basis (law): `missions/01-product-brand-identity/outputs/design-brief-for-m2.md`,
`identity-thesis.md`, `symbol-and-language-map.md`, `reconciliation-decision.md`,
ADRs 0001, 0002, 0011, 0014 (active); ADRs 0004, 0005 (reopened — input, not law).
Ancestors: Tal's committed prototypes `assets/reference/prototypes/build-tools-overview.html`
(dark) and `tooling-deepdive.html` (warm).

**Status: checkpoint material.** These conclusions are not ADRs yet. Palette
decisions harden only after Tal's reaction to the open questions at the end of
this document (superseding ADRs for 0004/0005 come after that checkpoint).

## Scope

- **In scope:** full color token sets for both themes, WCAG AA contrast ratios
  for every text/background pair, badge-pair construction, usage rules, RTL
  interaction notes, honest provenance and alternatives.
- **Out of scope:** typefaces, type scale, spacing/radius/grid tokens, motion,
  component CSS — those live in the companion M2 deliverables. Per the
  preserved principle of ADR 0005, both themes share identical grid, spacing,
  radius, and interaction patterns; **only temperature changes**, and this file
  defines exactly that temperature layer.

Per ADR 0002, two full themes are required: a dark default and a warm
editorial theme behind the hidden Map switch. Nothing in this spec, in the
shipped UI, or in shipped identifier naming may acknowledge that the second
theme exists (see "Hidden-theme discipline" below).

---

## 1. System overview — one system, two temperatures

Both themes fill the **identical token roster**. A component references only
semantic tokens and is never aware of which theme is active. Roles, not hues:

| Token | Role |
|---|---|
| `--bg` | Page background |
| `--surface` | Raised panels/cards (raised = one step *away* from `--bg` toward the theme's light source) |
| `--surface-2` | Second elevation step: hover states, nested panels |
| `--border` | Hairline structure (decorative-structural, never the sole affordance) |
| `--border-strong` | Emphasized edges (hover borders, table heads) |
| `--text-strong` | Headings, emphasis |
| `--text` | Body text |
| `--muted` | Secondary text: eyebrows, captions, descriptions — AA-passing at body sizes |
| `--accent-1` … `--accent-4` | The four accent roles (below) |
| `--badge-1` … `--badge-4` | Accent-derived chip fills, badge use only (see §5) |
| `--glow` | The single licensed glow (derived from `--accent-2`) |
| `--focus` | Focus indicator color (aliases `--accent-2`) |
| `--code-bg`, `--code-text`, `--code-muted` | Code panel — in **both** themes an ink-dark panel, so one syntax palette can serve both (§6) |

### Accent roles (temperature-shifted, role-stable)

| Role | Dark theme | Warm theme |
|---|---|---|
| `--accent-1` — primary signal: the key badge/label of a view | Orange `#ff6b35` | Burnt red `#b23222` |
| `--accent-2` — structural/interactive: focus ring, glow source | Violet `#8878f8` | Plum `#4a235a` |
| `--accent-3` — affirmative/status | Green `#2fc98e` | Forest `#1e6641` |
| `--accent-4` — attention/annotation | Amber `#f5c542` | Ochre `#7d4e00` |

Accent count is **trimmed from the ancestor's six to four** (magenta `#e06fe8`
and cyan `#3fc9d4` dropped). The prototypes were category-coded reference
charts that needed six axes; the portfolio's surfaces do not. Restraint is the
skill: every accent above has a nameable role; the two dropped ones did not
survive that test. If a future category-coded page genuinely needs more axes,
that is a new scoped decision, not a silent widening (flagged in Open
Questions).

### Provenance and compliance note

Every color in this spec descends from Tal's own two prototypes and the
reopened ADRs 0004/0005, adjusted only for WCAG AA compliance and restraint.
**No color was chosen for mythological reasons** — there is no "Aegean blue,"
no terracotta-because-Greece, no marble story. ADR 0014 confines mythology to
infra naming plus at most one typographic gesture; the palette is neither, and
this spec's reasoning contains no mythology-derived color logic by
construction.

---

## 2. Theme 1 — default (dark)

```css
/* Attribute model is a placeholder pending tokens-reference.md.
   ADR 0002 fixes the mechanism as data-theme on <html>; the default
   theme is the bare :root (no attribute required, nothing to notice). */
:root {
  /* structure */
  --bg:            #0d0d0f;
  --surface:       #141417;
  --surface-2:     #1a1a1f;
  --border:        #24242b;
  --border-strong: #3f3f4a;

  /* text */
  --text-strong:   #ffffff;
  --text:          #e8e8ec;
  --muted:         #8b8b99;

  /* accents — never backgrounds */
  --accent-1:      #ff6b35;
  --accent-2:      #8878f8;
  --accent-3:      #2fc98e;
  --accent-4:      #f5c542;

  /* accent-derived chip fills — badge use only (see §5) */
  --badge-1:       #301e1b;   /* = color-mix(in srgb, var(--accent-1) 12%, var(--surface)) */
  --badge-2:       #222032;
  --badge-3:       #172a25;
  --badge-4:       #2f291c;

  /* the one glow + focus */
  --glow:          color-mix(in srgb, var(--accent-2) 35%, transparent);
  --focus:         var(--accent-2);

  /* code panel */
  --code-bg:       #0d0d0f;
  --code-text:     #c8c8d4;
  --code-muted:    #8b8b99;
}
```

### Design intent

This is the workshop at night: near-black with a barely-cool cast, tools put
away in labeled drawers (`--surface` cards on hairline `--border` seams),
light only where a hand is working. Precision is the default register —
the structure neutrals stay so quiet that the four accents, rationed to
badges, labels, and the single glow, read as deliberate marks by a person
rather than as a color scheme. That is the brief's sentence made literal: the
precision is the workshop; the sparse warm-orange and violet marks are the
person visibly living in it. The anti-test holds because the discipline
itself is the signature — six-accent dashboards ship everywhere; a
four-accent budget where every placement is justified does not.

### What changed from ancestor ADR 0004, and why (measured, not taste)

| Ancestor value | Measured problem | Evolved to |
|---|---|---|
| `--muted: #6b6b78` | **3.70:1** on bg, **3.50:1** on surface — fails AA (4.5:1), yet the prototype used it for 13px body copy | `#8b8b99` → 5.78 / 5.47 |
| `--accent-2: #7c6af7` | **4.34:1** on surface-2 (hover), 4.61:1 on surface — fails AA on raised surfaces | `#8878f8` → 5.03 / 5.33 |
| Six accents | No AA failure — a restraint failure; two accents had no nameable role on portfolio surfaces | Four accents |
| bg/surface/border/text | Sound; proven in Tal's own work | Kept (border nudged `#222228` → `#24242b`, imperceptible, for parity with the new `--border-strong` step) |

### Alternatives considered (honest record for the superseding ADR)

1. **Keep ADR 0004 verbatim.** Rejected on measurement: two shipped-failing AA
   pairs (table above). A design-system builder's site cannot ship a muted
   text color at 3.70:1.
2. **Warm-tinted dark base ("Warm Noir" revisited).** Rejected — the original
   round already found the amber cast forced, and it additionally narrows the
   Map reveal: the hidden switch's payoff depends on the default being
   cool-neutral so the warm theme lands as a genuine temperature change.
3. **Fully achromatic dark (default-gray `#111113` family, no cast).**
   Rejected — reads as stock dashboard chrome; fails the anti-test ("could
   ship on any competent developer's portfolio unchanged"). The faint cool
   cast is what keeps it a night workshop instead of a template.

---

## 3. Theme 2 — warm editorial (hidden behind the Map switch)

```css
/* Placeholder attribute value — deliberately mundane; final naming in
   tokens-reference.md. See "Hidden-theme discipline". */
[data-theme="warm"] {
  /* structure */
  --bg:            #f5f2eb;
  --surface:       #fffdf8;
  --surface-2:     #f0ede4;
  --border:        #ddd8cc;
  --border-strong: #b8b0a0;

  /* text */
  --text-strong:   #0f0d0a;
  --text:          #1a1814;
  --muted:         #6b6255;

  /* accents — never backgrounds */
  --accent-1:      #b23222;
  --accent-2:      #4a235a;
  --accent-3:      #1e6641;
  --accent-4:      #7d4e00;

  /* accent-derived chip fills — badge use only (see §5) */
  --badge-1:       #f6e5de;   /* = color-mix(in srgb, var(--accent-1) 12%, var(--surface)) */
  --badge-2:       #e9e3e5;
  --badge-3:       #e4ebe2;
  --badge-4:       #efe8da;

  /* glow is a dark-room phenomenon; in daylight it simply is not there */
  --glow:          transparent;
  --focus:         var(--accent-2);

  /* code panel — stays ink-dark in the warm theme (see §6) */
  --code-bg:       #2c2820;
  --code-text:     #e8e4d8;
  --code-muted:    #a89f8f;
}
```

### Design intent

Same workshop, shutters open: cream paper (`--bg`), near-white sheets laid on
it (`--surface` — the "raised = toward the light source" rule mirrored from
the dark theme), ink-dark text, and accents that are the same four roles
re-mixed as printer's inks — burnt red, plum, forest, ochre. This is the
editorial deep-dive register from Tal's own second prototype: the temperature
of long-form reading, which is exactly what the hidden theme exists for. The
person is visible here in the print-shop warmth; the precision survives in
the unchanged grid, roster, and accent budget. One system, two temperatures —
a visitor who finds the switch should recognize every element instantly while
feeling the room change.

### What changed from ancestor ADR 0005 / the warm prototype, and why

| Ancestor value | Measured problem | Evolved to |
|---|---|---|
| `--muted: #9c8e78` (ADR 0005) | **2.90:1** on its own bg — fails AA badly | `#6b6255` → 5.36 on bg |
| Prototype `--muted: #7a7060` | **4.35:1** on bg — still fails | same fix |
| Prototype `--subtle: #b0a898` (used for 9–10px eyebrow labels) | far below AA; a third text tier invites failing text | **tier dropped** — eyebrows/labels use `--muted` |
| Accent `#9c6b3a` (ADR 0005 primary) | **4.15:1** on its own bg — fails AA | role refilled by `#b23222` |
| Prototype deep red `#c0392b` | 4.86:1 on bg (passes) but **4.46:1** on its own 12% badge tint — fails the badge pair | darkened to `#b23222` → 5.57 on bg, 5.10 on badge |
| Three accents (ADR 0005) | Breaks token parity with the dark theme (four roles) | Four accents, roles mirrored |
| Prototype surfaces `#f5f2eb` / `#fffdf8` / `#f0ede4` / borders | Sound; Tal's most refined warm iteration | Kept verbatim |

### Alternatives considered

1. **ADR 0005 verbatim (parchment `#f7f3ec` / `#ede6d8`, bronze accents).**
   Rejected on measurement: primary accent 4.15:1 and muted 2.90:1 on its own
   background — both AA failures — and its three-accent set breaks role parity
   with the dark theme. Its parchment-darker-than-cards surface order was also
   superseded by Tal's own later prototype, which raised cards *above* the
   page (near-white on cream) — the more editorial and the parity-consistent
   choice ("raised = toward the light source" in both themes).
2. **"Blood & Parchment" (high-drama warm).** Rejected pre-workshop as too
   dramatic; still true and now sharper: the warm theme is the long-form
   reading register — drama fights sustained readability, which is this
   theme's entire job.
3. **Pure-white editorial (`#ffffff` base).** Rejected — discards the warmth
   that is the whole point of the temperature flip, and white-plus-serif is
   the most template-shaped reading surface on the web (fails the anti-test).

---

## 4. WCAG AA contrast — every text/background pair, measured

Method: WCAG 2.x relative luminance and contrast ratio, computed from the hex
values above (sRGB linearization, L = 0.2126R + 0.7152G + 0.0722B, ratio =
(L₁+0.05)/(L₂+0.05)), rounded to 2 decimals. Targets: **4.5:1** normal text,
**3:1** large text (≥24px / ≥18.66px bold) and UI indicators. Every pair
intended for normal text below meets 4.5:1 — nothing in this spec relies on
the large-text concession. Phase 2 CI should re-verify these pairs
mechanically (natural fit with the from-scratch CI/CD showcase, ADR 0012).

### 4.1 Dark theme

| Foreground | Background | Ratio | Target | Result |
|---|---|---|---|---|
| `--text` #e8e8ec | `--bg` #0d0d0f | 15.89 | 4.5 | pass |
| `--text` | `--surface` #141417 | 15.05 | 4.5 | pass |
| `--text` | `--surface-2` #1a1a1f | 14.19 | 4.5 | pass |
| `--text-strong` #ffffff | `--bg` | 19.42 | 4.5 | pass |
| `--text-strong` | `--surface` | 18.39 | 4.5 | pass |
| `--text-strong` | `--surface-2` | 17.34 | 4.5 | pass |
| `--muted` #8b8b99 | `--bg` | 5.78 | 4.5 | pass |
| `--muted` | `--surface` | 5.47 | 4.5 | pass |
| `--muted` | `--surface-2` | 5.16 | 4.5 | pass |
| `--accent-1` #ff6b35 | `--bg` | 6.85 | 4.5 | pass |
| `--accent-1` | `--surface` | 6.49 | 4.5 | pass |
| `--accent-1` | `--surface-2` | 6.11 | 4.5 | pass |
| `--accent-1` | `--badge-1` #301e1b | 5.58 | 4.5 | pass |
| `--accent-2` #8878f8 | `--bg` | 5.63 | 4.5 | pass |
| `--accent-2` | `--surface` | 5.33 | 4.5 | pass |
| `--accent-2` | `--surface-2` | 5.03 | 4.5 | pass |
| `--accent-2` | `--badge-2` #222032 | 4.61 | 4.5 | pass (thinnest margin in the system — noted) |
| `--accent-3` #2fc98e | `--bg` | 9.12 | 4.5 | pass |
| `--accent-3` | `--surface` | 8.64 | 4.5 | pass |
| `--accent-3` | `--surface-2` | 8.14 | 4.5 | pass |
| `--accent-3` | `--badge-3` #172a25 | 7.08 | 4.5 | pass |
| `--accent-4` #f5c542 | `--bg` | 11.97 | 4.5 | pass |
| `--accent-4` | `--surface` | 11.34 | 4.5 | pass |
| `--accent-4` | `--surface-2` | 10.69 | 4.5 | pass |
| `--accent-4` | `--badge-4` #2f291c | 8.90 | 4.5 | pass |
| `--code-text` #c8c8d4 | `--code-bg` #0d0d0f | 11.71 | 4.5 | pass |
| `--code-muted` #8b8b99 | `--code-bg` | 5.78 | 4.5 | pass |
| `--focus` (= `--accent-2`) | `--bg` | 5.63 | 3.0 (UI) | pass |
| `--focus` | `--surface` | 5.33 | 3.0 (UI) | pass |

Informative (non-text, no AA text claim): `--border` vs `--bg` 1.26, vs
`--surface` 1.19; `--border-strong` vs `--bg` 1.87, vs `--surface` 1.77.
See §5 border rule.

### 4.2 Warm theme

| Foreground | Background | Ratio | Target | Result |
|---|---|---|---|---|
| `--text` #1a1814 | `--bg` #f5f2eb | 15.86 | 4.5 | pass |
| `--text` | `--surface` #fffdf8 | 17.44 | 4.5 | pass |
| `--text` | `--surface-2` #f0ede4 | 15.14 | 4.5 | pass |
| `--text-strong` #0f0d0a | `--bg` | 17.36 | 4.5 | pass |
| `--text-strong` | `--surface` | 19.09 | 4.5 | pass |
| `--text-strong` | `--surface-2` | 16.58 | 4.5 | pass |
| `--muted` #6b6255 | `--bg` | 5.36 | 4.5 | pass |
| `--muted` | `--surface` | 5.90 | 4.5 | pass |
| `--muted` | `--surface-2` | 5.12 | 4.5 | pass |
| `--accent-1` #b23222 | `--bg` | 5.57 | 4.5 | pass |
| `--accent-1` | `--surface` | 6.13 | 4.5 | pass |
| `--accent-1` | `--surface-2` | 5.32 | 4.5 | pass |
| `--accent-1` | `--badge-1` #f6e5de | 5.10 | 4.5 | pass |
| `--accent-2` #4a235a | `--bg` | 11.19 | 4.5 | pass |
| `--accent-2` | `--surface` | 12.30 | 4.5 | pass |
| `--accent-2` | `--surface-2` | 10.68 | 4.5 | pass |
| `--accent-2` | `--badge-2` #e9e3e5 | 9.88 | 4.5 | pass |
| `--accent-3` #1e6641 | `--bg` | 6.19 | 4.5 | pass |
| `--accent-3` | `--surface` | 6.81 | 4.5 | pass |
| `--accent-3` | `--surface-2` | 5.92 | 4.5 | pass |
| `--accent-3` | `--badge-3` #e4ebe2 | 5.70 | 4.5 | pass |
| `--accent-4` #7d4e00 | `--bg` | 6.34 | 4.5 | pass |
| `--accent-4` | `--surface` | 6.97 | 4.5 | pass |
| `--accent-4` | `--surface-2` | 6.06 | 4.5 | pass |
| `--accent-4` | `--badge-4` #efe8da | 5.81 | 4.5 | pass |
| `--code-text` #e8e4d8 | `--code-bg` #2c2820 | 11.54 | 4.5 | pass |
| `--code-muted` #a89f8f | `--code-bg` | 5.60 | 4.5 | pass |
| `--focus` (= `--accent-2`) | `--bg` | 11.19 | 3.0 (UI) | pass |
| `--focus` | `--surface` | 12.30 | 3.0 (UI) | pass |

Informative (non-text): `--border` vs `--bg` 1.27, vs `--surface` 1.40;
`--border-strong` vs `--bg` 1.93, vs `--surface` 2.12.

---

## 5. Usage rules (binding on all M2 component specs)

1. **Accents are never backgrounds.** Preserved principle from 0004/0005,
   restated as law. No accent fills a surface, section, button, or hero.
2. **Accent placement budget:** badges, labels, and exactly one glow element
   per theme, site-wide. Nothing else. Links are *not* accent-colored — links
   use `--text` with an underline treatment (specified in the interaction
   deliverable); the palette deliberately provides no `--link` token so the
   restraint cannot erode by default.
3. **Badge recipe:** chip fill = `--badge-N` (defined as the 12%
   accent-over-surface mix; resolved hexes above are the normative values,
   `color-mix()` is the derivation), foreground = `--accent-N`. Badge tints
   are the *only* sanctioned accent-derived fills, confined to inline chip
   size — this is the ancestor prototypes' own pattern under ADR 0004's
   "accents only on badges, labels, one glow." If Tal reads even this as
   violating rule 1's spirit, the fallback is outline badges (accent text +
   accent border on `--surface`) — every accent-on-surface pair is verified
   above, so the fallback is pre-cleared. (Open Question 1.)
4. **The glow:** `--glow` derives from `--accent-2` and may appear on exactly
   one element. In the warm theme `--glow` resolves to `transparent` — a glow
   is a dark-room phenomenon (Open Question 2 covers placement and this
   behavior).
5. **Borders are never the sole affordance.** Hairline `--border` /
   `--border-strong` ratios are below 3:1 by design (they always co-occur
   with a surface-color step and/or text). Any control whose boundary must be
   perceived on its own (form inputs, toggles) pairs its border with a
   surface change and receives a `--focus` outline ≥2px on focus — `--focus`
   meets the 3:1 UI-indicator target in both themes (tables above).
6. **Muted is the floor.** No text may be rendered in any color with a lower
   ratio than `--muted` on its actual background. There is no "subtle" third
   tier; the warm prototype's `--subtle` is deliberately not carried forward.
7. **Theme parity:** any new token must be added to both themes in the same
   role, with its pairs measured, before use. A token existing in one theme
   only is a spec violation (and a hint that the second theme exists — see
   below).

---

## 6. Code panels and syntax colors

Code panels are **ink-dark in both themes**: `--code-bg` is `#0d0d0f` (dark
theme) and `#2c2820` (warm theme — the warm prototype's own inverted code
blocks). This is a standard editorial convention (dark code blocks on light
pages hint at nothing) and it means one shared syntax palette can pass AA on
both code backgrounds.

Final syntax token naming (`--code-kw` etc.) belongs to `tokens-reference.md`.
The binding constraint set here: **every syntax color must measure ≥4.5:1 on
`--code-bg` in both themes.** Pre-verified candidate set, from the warm
prototype's own syntax colors:

| Candidate | On #0d0d0f (dark) | On #2c2820 (warm) | Result |
|---|---|---|---|
| #d4a857 (keywords) | 8.82 | 6.66 | pass both |
| #7ec87e (strings) | 9.66 | 7.30 | pass both |
| #87b3d4 (types) | 8.72 | 6.59 | pass both |
| #c99fd0 (properties) | 8.65 | 6.53 | pass both |
| `--code-muted` (comments) | 5.78 | 5.60 | pass both |

Note the honest correction: both prototypes rendered code comments at ~2:1
(`#444` on near-black; `#6b6458` on ink). `--code-muted` fixes this; comments
are text and get no exemption.

---

## 7. RTL / Hebrew interaction (ADR 0011)

Color tokens are direction-agnostic; **the palette itself has no RTL
interaction** — stated explicitly, as required. Two adjacent flags for the
layout and component specs:

1. **Accent edges must be logical.** The prototypes' callout pattern uses a
   3px accent edge on the *left* (`border-left`). Any component consuming an
   accent token on a directional edge must specify it as
   `border-inline-start` (or equivalent logical property) so the accent edge
   sits on the reading-start side under `dir="rtl"`. The token is innocent;
   the property binding is where RTL can silently break.
2. **Glow/shadow geometry:** the single glow must be symmetric (no
   directional offset), so it renders identically in RTL. Specified here so
   the interaction spec inherits it as a constraint.

Contrast ratios are script-independent; Hebrew text obeys the same pair
tables. (Whether Hebrew companion faces need a weight/size adjustment to hold
perceived density is a typography-deliverable question, not a palette one.)

---

## 8. Hidden-theme discipline (ADR 0002)

- The shipped stylesheet necessarily contains both token blocks; ADR 0002
  accepts this. What is forbidden is *acknowledgment*: no toggle UI, no
  tooltip, no copy, no docs page, no `aria` announcement of a second theme.
- **Shipped identifiers stay mundane.** The attribute value here is the
  placeholder `data-theme="warm"` — a deliberately boring name. No shipped
  selector, token, comment, or asset may use `jekyll`, `hyde`, `map`,
  `marauder`, `mischief`, or any other pointer at the mechanism or its
  source. Final attribute naming is fixed in `tokens-reference.md` under this
  rule.
- The 600ms transition and the incantation mechanism are ADR 0002's and
  untouched by this spec; the palette's only obligation is that every token
  has a value in both themes so the transition is total (§5 rule 7).

---

## 9. Verification methodology

Ratios were computed directly from the hex values in this document using the
WCAG 2.x definition (sRGB channel linearization with the 0.03928/12.92
threshold, luminance weights 0.2126/0.7152/0.0722), not copied from prior
docs — which is how the ancestor failures in §2/§3 were caught. Spot-checked
against known reference values (e.g. #c0392b vs white = 5.44). Badge fills
were blended in gamma sRGB (matching `color-mix(in srgb, …)`) before
measurement. Rounding is to 2 decimals; the one pair within 0.15 of its
threshold (dark `--accent-2` on `--badge-2`, 4.61) is called out rather than
hidden. Phase 2 should encode these pairs as a CI check so regressions are
mechanical, not archaeological.

---

## Open questions for Tal's checkpoint

Five genuine taste calls. Everything above ships as specified unless one of
these flips it; every alternative named here is already AA-verified.

1. **Badge construction.** Tinted chips (`--badge-N` fills, your prototypes'
   own pattern) vs outline-only badges (accent text + accent border, no
   fill). The tint is technically an accent-derived background at chip scale —
   sanctioned by 0004's ancestor language, but does it violate the *spirit*
   of "accents never backgrounds" for you?
2. **The glow.** Two sub-calls: (a) placement — the ancestor put it on the
   `://` of the mark, which sits close to ADR 0001's "mark unaltered and
   unthemed"; is the mark's glow identity or theming? (b) warm behavior —
   spec'd as `transparent` (glow as dark-room phenomenon). Does the Map
   reveal gain or lose from the glow going out in daylight?
3. **Warm primary accent.** Burnt red `#b23222` (from your deep-dive
   prototype's red, darkened for AA) vs the bronze/sienna family of ADR 0005
   (`#9c6b3a` fails AA; would need darkening to roughly `#7f5527` to
   qualify). Red is more editorial-print; bronze is warmer and closer to the
   dark theme's orange. This is pure taste — both can be made to pass.
4. **Accent count 6 → 4.** Magenta and cyan are gone. If a future page wants
   the prototype's six-way category coding, the options are: force categories
   into the four roles, or admit a scoped extension by explicit decision.
   Comfortable with the trim as the site-wide budget?
5. **Warm code panels stay dark.** Inverted ink panels (your prototype's
   move) let one syntax palette serve both themes and read as print
   convention. The alternative — light code panels in the warm theme — needs
   its own light-background syntax set and loses the shared-panel elegance.
   Confirm the inverted direction?
