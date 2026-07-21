---
mission: m2
verdict: APPROVED
date: 2026-07-21
reviewer: red-team-reviewer
---

# Red-Team Review — Mission 2 (Visual Design System)

Reviewed in fresh context against: the M2 output contract; Tal's two
checkpoint decisions as recorded in `missions/02-visual-design-system/STATUS.md`;
M1 outputs (`design-brief-for-m2.md`, `reconciliation-decision.md`); active
ADRs 0001, 0002, 0011, 0012, 0014; the `design-tokens` and `adr-keeper`
skills; and the two normative prototypes in `assets/reference/prototypes/`.

## What was checked

### 1. Contract completeness — MET
All six contract items exist and are substantive: `palette-spec.md` (full
dual-temperature token sets, AA table for every claimed pair),
`typography-spec.md` (families, weights, scale, eyebrow, sourced Hebrew
verification), `tokens-reference.md` (semantic naming, ADR-0002-exact
switching model), `motion-and-texture.md` (complete motion/texture
inventories, each justified), `hero-and-illustration.md` (resolves 0007 and
0008 per checkpoint 2), ADRs 0015–0018 with status flips on 0004–0008 and a
regenerated INDEX.md (status counts independently tallied: 9 active,
3 reopened, 5 superseded, 1 proposed — correct).

### 2. Prototype fidelity — VERIFIED
Diffed every token in palette-spec §2/§3 and tokens-reference §3 against the
prototypes' actual CSS (`:root` blocks plus in-rule literals: hover
`#18181d`, chip `#1e1e24`, inset `#111114`, `#444` hover border, code
colors, warm `pre` on `var(--ink)` `#2c2820`, all six warm l-tints, all
four callout body inks, syntax roster, radii, eyebrow 11px/0.2em). Every
"V" value is verbatim. The six badge-fill resolutions were recomputed by
hand (12% accent over `#141417`): all six hexes exact. The rgba→opaque
resolution is recorded, not silent. No taste edit found anywhere: all six
accents per theme present, warm l1–l6 present, the v1 trim fully reverted.

### 3. AA nudges — VERIFIED AS MINIMAL AND CORRECT
All six nudges recomputed independently (WCAG 2.x relative luminance,
by-hand arithmetic, no scripts):
- dark `--muted` `#85858f` on `--chip-bg`: 4.541 (claimed 4.54) — pass
- dark `--accent-2` `#8676f8` on `--badge-2` `#222032`: 4.513 (claimed 4.51) — pass
- dark `--code-comment` `#7a7a7a` on `#0d0d0f`: 4.523 (claimed 4.52) — pass
- warm `--muted` `#746a5b` on `--surface-2`: 4.535 (claimed 4.54) — pass
- warm `--subtle` `#706b61` on `--surface-2`: 4.524 (claimed 4.52) — pass
- warm `--code-comment` `#938e85` on `#2c2820`: 4.505 (claimed 4.50) — pass

Also spot-checked non-thin rows (dark text/bg 15.89, warm text/bg 15.85,
dark accent-1/surface 6.48, warm accent-1/surface-2 4.65 and /badge-1 4.76,
dark muted/bg 5.32) — all match to rounding. The pre-nudge failure claims
were recomputed too (dark muted 3.70 on bg / 3.16 on chip-bg — exact). Each
nudged hex was verified to lie on the stated straight-line interpolation
path, i.e. the nudges are genuinely hue-preserving and minimal. The sixth
nudge (warm code comments, 2.51:1 before) is not in STATUS.md's five-item
checkpoint parenthetical but falls squarely under the checkpoint rule
("only failing text colors, minimal fix") and is recorded in both STATUS's
post-pivot entry ("exactly six") and ADR 0015 — not a silent edit.

### 4. Hebrew/RTL (ADR 0011) — MET
Coverage is sourced, not asserted: per-family METADATA.pb URLs for all
seven families, an explicit debunk of the "Syne gained Hebrew" claim, and a
recorded no-Hebrew-monospace finding with its residual (manual filter check)
honestly flagged for Phase 2. Weight ceilings of companions verified to
cover every slot (no faux-bold path). RTL rules are concrete: logical
properties at registry level (tokens-reference §5) and type level
(typography-spec §7), LTR-always code blocks, LTR mark run with `<bdi>`
fallback, no Latin tracking on Hebrew runs, symmetric glow. I could not
re-fetch the METADATA URLs from this environment; the claims match known
Google Fonts facts and carry their sources — falsifiable, which is what the
contract requires.

### 5. Hidden-theme discipline (ADR 0002) — MET
Switching model reproduces 0002 exactly (data-theme, keydown buffer,
localStorage, 600ms, console log — none altered). Shipped identifiers
mundane (`warm`, `theme`); banned-vocabulary list is greppable; token
parity rule prevents half-applied transitions; favicon explicitly prevented
from leaking the hidden theme (ADR 0018).

### 6. Mythology bounds (ADR 0014 / M1 hard exclusions) — MET
Grep of all five outputs for figure names and banned motifs: only
rule-statement mentions (motion-and-texture's ban list, hero doc's
"no laurels" rule) — zero register leaks, zero Greek ornament, no
"let's connect", no specimen-text violations. The lapidary license's state
is coherent across typography-spec §8 (declined for base, reserved to
hero), hero doc (declined at checkpoint 2), and ADRs 0016/0017: formally
unexercised, zero gestures final. The portrait is never mythologized
(ADR 0018 makes the M1 cautions binding treatment rules).

### 7. ADR hygiene — MET
0015–0018: required frontmatter keys present, flat values only, all four
required body sections with honest alternatives (each rejection carries a
real reason, including honest credit where due). Supersede pointers hold in
both directions (0015↔0004/0005, 0016↔0006, 0017↔0007, 0018↔0008). Old
ADRs received status flips only — reasoning untouched. 0016's correction of
0006's misrecorded "DM Mono for everything" is done in the superseding ADR,
not by editing 0006 — exactly right. INDEX.md is consistent with a
regeneration.

### 8. Internal consistency — MET
Glow definition identical across palette-spec §7.4, tokens-reference §3.3,
motion-and-texture T5, hero doc, and ADR 0017 (`color-mix(in srgb,
var(--accent-3) 35%, transparent)` dark / `transparent` warm; one element;
static). Token names, scale steps, and font stacks agree across specs.
Scope boundaries respected: no routes/IA beyond ADR 0008's own placement
question, explicitly framework-agnostic, specs not code.

## Minor defects found — non-blocking (fix at leisure, no re-review needed)

1. `palette-spec.md` §4 method sentence says nudges move "toward white
   (dark theme) or black (warm theme)"; nudge 6 (warm `--code-comment`)
   correctly moves toward white because the warm code panel is ink-dark.
   The table and hexes are right (verified on the white-interpolation
   line); the method sentence should say "away from the color's actual
   background."
2. `palette-spec.md` §5.1 labels `--accent-2`/`--badge-2` at 4.51
   "thinnest in system," but §5.2's warm `--code-comment` row is 4.50.
   ADR 0015 has it right ("thinnest: 4.50"). One-word fix.
3. `tokens-reference.md` §1's banned-vocabulary list (`map`, `hidden`) will
   false-positive on legitimate shipped artifacts (e.g. `[hidden]`
   selectors, `sourceMappingURL` comments). The rule's intent is sound;
   the Phase 2 lint will need an allowlist. Also, `--leading-code`
   "1.7–1.8" and `--track-label` "0.08–0.15em" in typography-spec §4 are
   ranges, not token values — should be pinned per-theme like
   `--leading-body` before Phase 2 consumes them.

None of these is a false AA claim, a checkpoint violation, or a contract
gap; all three are documentation precision issues inside decisions that are
themselves correct.

## Not verifiable from this environment

- "M1 outputs unmodified" could not be checked against git history (no
  shell access); the M1 outputs as read are internally consistent with
  Mission 1's closure and nothing in the M2 outputs claims to amend them.
- The METADATA.pb URLs and `scripts/contrast.ts` runs were not re-executed;
  the AA table was instead independently recomputed by hand at every thin
  margin and several spot rows, and matched throughout.

## Verdict

**APPROVED.** The specs implement Tal's two checkpoint decisions with no
silent deviations, every AA claim spot-checked was true, all binding
sources are respected, and the ADR record is clean in both directions.
