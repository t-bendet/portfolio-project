---
id: 0003
title: Framework is Astro 6
status: reopened
date: 2026-07-20
decided-by: pre-workshop
reopened-by: mission-3
superseded-by: null
---

## Context
Static-leaning portfolio; SEO/performance goals; MDX blog content.

## Decision (as originally made)
Astro 6 + Tailwind 4 (CSS-only config), MDX via @astrojs/mdx, sitemap integration.
Chosen for zero-JS default, Content Collections, SEO/perf out of the box.

## Why reopened
Tal is not confident in the fit and has added showcase constraints (ADR 0012:
SQL, Docker, from-scratch CI/CD, cloud deploy) that change the evaluation.
Mission 3 re-runs the decision from first principles via the `tech-eval` skill.
Prior conclusions and the hard-won gotchas below are INPUT, not law.

## Preserved technical findings (still true regardless of outcome)
- @astrojs/tailwind is deprecated for Tailwind 4; use @tailwindcss/vite in vite.plugins
- Astro 6: post.id not post.slug; render() imported from astro:content; Node >= 22.12
- Verify npm versions via search before writing package.json
- No bash brace expansion for directory creation

## Alternatives rejected in the original round
Next.js (overkill, React runtime overhead); TanStack Start (RC, thin MDX story);
plain React (no SSG); React+shadcn (island overhead).
