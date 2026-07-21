---
name: performance-review
description: Dual-mode performance review — design mode (set budgets against the blueprint, used by Mission 6) and code mode (measure against budgets in Phase 2 CI). State which mode you are in before starting.
---

# Performance Review

## Design mode (Mission 6)
Input: active ADRs + the stated SEO/performance goals. Output:
performance-budgets.md with NUMBERS, not vibes:
- Core Web Vitals targets (LCP, CLS, INP) per page type
- JS payload budget per route (respecting whatever Mission 3 chose; if the
  zero-JS-default rationale survived, the budget should reflect it)
- Image strategy requirements (formats, sizing, the illustration asset)
- Font loading strategy (critical given custom display faces + Hebrew subsets —
  RTL support must not double font payload carelessly)
- SSR/SSG/cache expectations per route given the SQL boundary from ADR 0012

## Code mode (Phase 2 CI)
- Lighthouse CI (or equivalent) against the budgets file; build FAILS on breach
- Bundle analysis on every PR touching dependencies
- Verify the easter-egg listener and theme transition cost nothing measurable
  at idle

## Both modes
Budgets are contracts, not aspirations. If a budget must move, that is an ADR.
