---
name: design-tokens
description: How palettes and typography ship as tokens, plus the binding restraint rules. Use for any theming, palette, font, or CSS-variable work — especially Mission 2.
---

# Design Tokens

## Binding principles (survive any palette decision)
1. **Restraint is the skill.** Accent colors on badges, labels, and at most one
   glow element. NEVER as backgrounds.
2. **One system, two temperatures.** If dual themes survive Mission 1: identical
   grid, spacing, radius, and interaction patterns across themes. Only
   temperature (color, type voice) changes.
3. **RTL is a hard constraint (ADR 0011).** Every font choice must be verified
   for Hebrew glyph coverage or paired with an explicit Hebrew companion font.
   Layouts must be checked under dir="rtl".

## Delivery format
- Tokens as CSS custom properties on `:root` / `[data-theme=...]`
- Semantic names (`--bg`, `--surface`, `--border`, `--text`, `--muted`,
  `--accent-N`), never color-descriptive names
- Every text/background pair passes WCAG AA contrast; record the ratios
- Type scale documented as tokens too (family, weight, size steps)
- Deliverable: a tokens spec in the mission outputs (the eventual CSS/@theme
  translation happens in Phase 2, per whatever Mission 3 chose)

## Reference material
Tal's committed prototypes in assets/reference/prototypes/ are the ancestors of
the previous themes (read-only). Third-party inspiration is cited by URL or via
notes in docs/research/ — never a hard dependency.
