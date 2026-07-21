---
name: tech-eval
description: First-principles technology evaluation framework with the project's hard showcase constraints. Use for any framework, hosting, database, or tooling decision — especially Mission 3.
---

# Tech Eval

## Non-negotiable inputs to every evaluation
From ADR 0012, the product must GENUINELY incorporate:
- SQL (a real database with an honest reason to exist)
- Docker (containerized dev and/or deploy)
- CI/CD pipeline built from scratch (not a copied template)
- Cloud deployment (AWS or equivalent)
"Genuinely" is a test: a bolted-on database with no purpose fails it. Design
where the dynamic boundary sits; do not fake dynamism to satisfy a checkbox.

## Method
1. Requirements first, named and weighted, BEFORE naming any technology.
   Include: SEO/perf goals, content model (MDX-heavy blog + RTL), showcase
   constraints, Tal's maintenance budget as a solo dev.
2. Candidate set: at least 3 honest options. Include "keep the current choice"
   as a candidate evaluated by the same criteria — no incumbent bias, no
   novelty bias.
3. Per candidate: strengths, weaknesses, GOTCHAS (real ones, from docs and
   verified via web search — never from memory), and what it forces on
   Docker/CI/deploy shape.
4. Verify every package version and compatibility claim via web search before
   writing it down. (Hard rule from prior sessions.) Delegate lookups to the
   docs-explorer worker agent — batch all libraries in one delegation; it
   returns sourced versions and gotchas in a fixed format.
5. No promotional framing. If a tradeoff hurts, say so plainly.
6. Output = ADR(s) per adr-keeper, with the losing options in
   "Alternatives rejected" carrying real reasons.

## Preserved gotchas (still true, from ADR 0003)
- @astrojs/tailwind is deprecated for Tailwind 4 → @tailwindcss/vite in vite.plugins
- Astro 6: post.id not post.slug; render() from astro:content; Node >= 22.12
- Never use bash brace expansion for directory creation
