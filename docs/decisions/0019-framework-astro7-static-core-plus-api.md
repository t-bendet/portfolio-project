---
id: 0019
title: Framework is Astro 7.x — static core plus hand-built API and containerized Postgres
status: active
date: 2026-07-21
decided-by: tal
mission: mission-3
reopened-by: null
superseded-by: null
narrowed-by: 0023
---

## Context

ADR 0003 (Astro 6) was reopened by Mission 3 after Tal added the showcase
constraints (ADR 0012: SQL, Docker, from-scratch CI/CD, cloud deploy), which
the original static-host design could not satisfy. Mission 3 re-ran the
decision from first principles per the tech-eval skill: requirements were
named and weighted before candidates
(missions/03-technology-architecture/outputs/requirements-and-weights.md;
G6 cost ceiling tightened to $15/mo by Tal at checkpoint 1), all versions
and claims were verified by a batched docs-explorer pass
(outputs/verification-report.md, 2026-07-21), and four candidates were
gated and scored (outputs/evaluation.md). Astro 7.0 had shipped (7.0.9,
2026-07-13 — Rust compiler, Vite 8, Rolldown; report Q5), so the incumbent
was evaluated on the upgraded premise, not the ADR 0003 one. Tal locked the
winner at checkpoint 2 (2026-07-21).

## Decision

Framework: **Astro 7.x**, fully static output — no adapter, no server
rendering in the public site. Architecture (full record:
outputs/architecture-decision.md):

- Static core: all public pages prebuilt; MDX via @astrojs/mdx; typed
  content collections; built-in i18n with manual RTL wiring per ADR 0011;
  hreflang via @astrojs/sitemap; Tailwind 4 via @tailwindcss/vite.
- Dynamic layer: one hand-built Node 24/TS HTTP service (analytics,
  reactions, private admin dashboard — scope in ADR 0020) with Prisma 7
  over containerized Postgres 18.
- Containers: `web` (Caddy with the static bundle baked in, reverse proxy,
  auto-TLS), `api`, `db` — Docker Compose V2, dev and prod compose files.
- Pipeline and cloud target per ADR 0021.

Public pages never depend on the dynamic layer being alive; article count
widgets are progressive enhancement and degrade to absence.

## Consequences

- ADR 0003 is superseded by this ADR (status flip, pointer only).
- The evaluation (416/500 vs 340 and 296) rested most on: zero-JS static
  HTML by default (R1), first-party typed MDX content model (R2), and
  content surviving dynamic-layer failure (R4). The honest cost, stated at
  checkpoint: this design wins by keeping the server small — the
  server-side showcase is real but modest, and Tal accepted that tradeoff.
- Astro's major-version cadence is fast and 7.0 is a replatform (Vite 8 /
  Rolldown / Rust compiler); upgrade work is a real recurring cost.
- Scaffold-time verifications owed (outputs/phase2-scaffold-plan.md §0):
  Astro 7.x integration compatibility ranges (report Q9 unconfirmed),
  current prisma-migrate CI guidance (Q24), AWS public-IPv4 billing.
- Carried-forward gotchas, re-verified 2026-07-21: @astrojs/tailwind
  deprecated — use @tailwindcss/vite in vite.plugins (Q7); content entries
  expose `id` (not `slug`), `render()` from `astro:content` (Q6); Node >=
  22.12 (Astro install docs); never use bash brace expansion for directory
  creation.
- Mission 4 builds its content model on Astro content collections and the
  i18n/RTL wiring described above; the CI RTL check (ADR 0011) is a named
  pipeline stage.

## Alternatives rejected

- **React Router v8 framework mode, self-hosted (340/500).** Highest
  skills alignment in the set (RR is on Tal's CV; R5=5) and the same
  static-survival architecture via prerendered routes (report Q17). Lost on
  the content model: no content layer at all, no first-party MDX, and the
  documented @mdx-js/rollup path has an open unresolved compatibility issue
  with RR's Vite dev server (Q18) — a rot risk aimed at the blog build,
  which is the site's center of gravity. Every article page also ships and
  hydrates React (R1=3).
- **Next.js 16.2 self-hosted in Docker (296/500).** Most native SQL access
  (single runtime) and documented standalone self-hosting (Q12). Lost on:
  materially weak MDX story for an MDX-heavy site (@next/mdx has no
  frontmatter parsing, Q13; open build-cache issue, Q15), no built-in App
  Router i18n (Q14), mandatory hydration on content pages (R1=3), and the
  whole site being down if the one container dies (R4=2).
- **TanStack Start — eliminated at gate G5.** RC-quality without a formal
  1.0 (1.168.32, Q20), MDX only via third-party Fumadocs (Q21),
  community-sourced Docker guidance (Q22). ADR 0003's original rejection
  re-confirmed with current citations, not inherited.
- **Non-JS SSGs (Hugo-class).** Deliberately not fielded: the MDX-heavy
  content model is a JS-ecosystem format; such a candidate would exist only
  to fail, which is filler, not honesty.
- **Astro Node adapter / server islands as the dynamic layer.** Rejected as
  the primary shape: the separate hand-built API maximizes content
  survivability and is itself a from-scratch showcase artifact; the adapter
  path puts a server in the content path for the same capability.
