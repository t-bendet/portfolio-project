# Tokens Reference — naming, registry, and theme switching

Basis: `palette.md` (prototype-exact — normative for every color value).
Commits only to plain CSS custom properties; any tool-specific format is
generated from this registry.

**Binding principles (survive any palette change):**
1. **Restraint is the skill.** Accent colors on badges, labels, and the one
   glow element. NEVER as backgrounds.
2. **One system, two temperatures.** Identical grid, spacing, radius, and
   interaction patterns across themes. Only temperature (color, type voice)
   changes.
3. **RTL is a hard constraint.** Every font choice verified for Hebrew glyph
   coverage or paired with an explicit Hebrew companion; layouts checked
   under `dir="rtl"`.

## 1. Naming grammar

```
--{category}-{role}[-{step}]
```

- **Semantic, never color-descriptive.** `--accent-1`, not `--orange`;
  `--surface-2`, not `--gray-800`. A component must be able to render in
  either temperature without knowing which is active.
- Categories in use: `bg`, `surface`, `chip`, `border`, `text`, `muted`,
  `subtle`, `accent`, `badge`, `focus`, `code`, `font`, `size`, `leading`,
  `track`, `radius`, `space`.
- Numbered steps are **roles, not shades**: `--accent-1`…`--accent-6` are six
  stable category roles (§3); `--surface-2` is "one interaction step up," not
  "slightly lighter."
- Flat custom properties only. No nested/JSON token trees — the registry
  below is the single source of truth, and Phase 2 generates any
  tool-specific format from it.

### Banned identifier vocabulary (hidden-theme discipline, ADR 0002)

No shipped selector, custom property, attribute value, storage key, comment,
or asset name may contain: `jekyll`, `hyde`, `map`, `marauder`, `mischief`,
`solemnly`, `managed`, `secret`, `hidden`, `easter`. Mundane names only.
(Phase 2 CI lint: match whole identifier tokens, not substrings — standard
platform identifiers like the `[hidden]` attribute or `sourceMappingURL`
are not violations; the rule targets names this project authors.)

## 2. Theme switching model (implements ADR 0002 — unchanged)

| Aspect | Value | Notes |
|---|---|---|
| Mechanism | `data-theme` attribute on `<html>` | Fixed by ADR 0002 |
| Default theme | **bare `:root`** — no attribute present | Nothing to notice in the common case |
| Second theme selector | `[data-theme="warm"]` | **Final naming decision:** `warm` — mundane, describes temperature, points at nothing. The palette.md placeholder is hereby confirmed. |
| Trigger | Global keydown buffer (incantation) | ADR 0002's; not this spec's to alter |
| Persistence | `localStorage` key **`theme`**, value `warm` | Key name falls under the banned-vocabulary rule; `theme` is the most boring possible name |
| Transition | 600ms on `background-color`, `color`, `border-color`, `fill` | ADR 0002 fixes 600ms; `hero-and-motion.md` §3 defines easing and the `prefers-reduced-motion` behavior (instant switch) |
| Console log on toggle | ADR 0002's | untouched |

**Total-coverage rule** (palette.md §7.7, restated as the switching
invariant): every token in §3 has a value in both blocks — by literal value
or alias — so the 600ms transition can never half-apply. A token present in
one block only is a build error, not a style choice.

**No-flash note for Phase 2:** because the persisted theme is applied by
script, the attribute must be set before first paint (inline head script —
the standard pattern). Recorded here so it becomes an implementation
requirement, not a discovery.

## 3. Token registry

Color values are normative in `palette.md` §2/§3 (provenance and AA
tables live there); they are repeated here read-only so this file can serve
as the single lookup surface. Type values are normative in
`typography.md`.

### 3.1 Color — structure

| Token | Dark (`:root`) | Warm (`[data-theme="warm"]`) |
|---|---|---|
| `--bg` | `#0d0d0f` | `#f5f2eb` |
| `--surface` | `#141417` | `#fffdf8` |
| `--surface-2` | `#18181d` | `#f0ede4` |
| `--surface-inset` | `#111114` | `#f0ede4` |
| `--chip-bg` | `#1e1e24` | `#f0ede4` |
| `--border` | `#222228` | `#ddd8cc` |
| `--border-strong` | `#444444` | `#b8b0a0` |

### 3.2 Color — text

| Token | Dark | Warm |
|---|---|---|
| `--text-strong` | `#ffffff` | `#2c2820` |
| `--text` | `#e8e8ec` | `#1a1814` |
| `--muted` | `#85858f` | `#746a5b` |
| `--subtle` | `var(--muted)` | `#706b61` |

### 3.3 Color — accents and derived fills

Six stable roles, inherited from the prototypes' own category coding:

| Role | Category provenance | Dark | Warm | Dark badge fill | Warm badge fill |
|---|---|---|---|---|---|
| `--accent-1` | bundlers / primary signal | `#ff6b35` | `#c0392b` | `--badge-1` `#301e1b` | `#fdecea` |
| `--accent-2` | TS tools / structural-interactive (focus source) | `#8676f8` | `#1a5276` | `--badge-2` `#222032` | `#e8f0f8` |
| `--accent-3` | module systems / affirmative | `#2fc98e` | `#1e6641` | `--badge-3` `#172a25` | `#e8f5ee` |
| `--accent-4` | linting / attention | `#f5c542` | `#7d4e00` | `--badge-4` `#2f291c` | `#fef9e7` |
| `--accent-5` | config / annotation | `#e06fe8` | `#4a235a` | `--badge-5` `#2c1f30` | `#f5eef8` |
| `--accent-6` | runtimes / auxiliary | `#3fc9d4` | `#0e4d6b` | `--badge-6` `#192a2e` | `#e8f4f8` |

`--focus`: `var(--accent-2)` in both themes (≥3:1 UI target verified in
palette.md §5).

`--glow`: `color-mix(in srgb, var(--accent-3) 35%, transparent)` dark ·
`transparent` warm. Exactly one consumer site-wide (the hero mark's `://`
at completion — `hero-and-motion.md`); decided at checkpoint 2.

### 3.4 Color — code panels

| Token | Dark | Warm |
|---|---|---|
| `--code-bg` | `#0d0d0f` | `#2c2820` |
| `--code-text` | `#c8c8d4` | `#e8e4d8` |
| `--code-comment` | `#7a7a7a` | `#938e85` |
| `--code-kw` | `var(--accent-2)` | `#d4a857` |
| `--code-str` | `var(--accent-3)` | `#7ec87e` |
| `--code-ty` | `#87b3d4` | `#87b3d4` |
| `--code-prop` | `#c99fd0` | `#c99fd0` |
| `--code-num` | `#e08060` | `#e08060` |

### 3.5 Typography tokens (names here, values in `typography.md`)

| Token | Role |
|---|---|
| `--font-display` | Headings/display voice (theme-varying) |
| `--font-mono` | Chrome, eyebrows, code (theme-varying) |
| `--font-body` | Body voice (dark: display family; warm: serif — per prototype) |
| `--size-eyebrow` … `--size-h1` | Type scale steps |
| `--leading-tight` / `--leading-body` | Line-height steps |
| `--track-eyebrow` / `--track-tight` | Letter-spacing steps |

Font-family tokens change with `data-theme` exactly like color tokens (the
warm temperature's serif voice is part of the temperature). Hebrew companion
families enter via the font stacks inside these tokens, never as separate
tokens — see `typography.md`.

### 3.6 Structure tokens (theme-invariant — defined once on `:root`, never
re-declared in the theme block)

Radius steps unify the two prototypes' values; both archetypes draw from the
same scale:

| Token | Value | Prototype provenance |
|---|---|---|
| `--radius-s` | `4px` | dark badges/tags (4) · warm tags/inline code (3 — unified to 4) |
| `--radius-m` | `8px` | both prototypes' boxes, code panels, notes |
| `--radius-l` | `16px` | dark section panels |
| `--radius-pill` | `100px` | dark toc pills |

Spacing stays on a plain 4px base grid (both prototypes' paddings are
4px-multiples with a handful of odd values that normalize without visible
change); the full spacing scale is component-spec territory (Phase 2 /
Mission 4 page composition), not a palette-layer token.

**Invariant:** structure tokens are identical across themes — this is the
"one system, two temperatures" through-line made mechanical. A theme block
that touches a `--radius-*` or `--space-*` token is a spec violation.

## 4. Parity and enforcement

1. Every `--*` color/type token appears in both theme blocks (value or
   alias). Mechanical check: parse both blocks, diff the key sets — empty
   diff required. (Phase 2 CI, alongside the contrast gate from
   palette.md §10.)
2. Contrast gate: `scripts/contrast.ts --pairs` over palette.md §5's pair
   list, full precision, exit-1 on failure.
3. Banned-vocabulary grep (§1) over shipped CSS/JS/HTML.
4. No component may reference a raw hex — tokens only. (Lintable.)

## 5. RTL note (ADR 0011)

Tokens are direction-agnostic by construction; nothing in this file may
encode a physical side. Any token whose *consumption* has a side (accent
edges, sidebar borders) binds via logical properties
(`border-inline-start`, `padding-inline`, `margin-inline`) — restating
palette.md §8 as a registry-level rule so it survives into component
specs.
