# Decision Index

**GENERATED FILE — do not hand-edit.** Regenerate with
`node scripts/reindex-decisions.ts`. On merge conflict: regenerate.

Summary: active: 24 · superseded: 8

**"narrowed by NNNN"** means this ADR is still `active` and still binding,
but a later ADR corrects one of its clauses. Acting on this ADR alone will
produce the wrong result. Read both. (ADR 0027)

| ID | Title | Status | Note |
|----|-------|--------|------|
| [0001](./0001-identity-tbendet-protocol.md) | Identity mark is the T://bendet personal protocol | `active` |  |
| [0002](./0002-marauders-map-easter-egg.md) | Jekyll/Hyde duality shipped as the hidden Marauder's Map easter egg | `active` |  |
| [0003](./0003-framework-astro-6.md) | Framework is Astro 6 | `superseded` | superseded by 0019 |
| [0004](./0004-hyde-dark-palette.md) | Hyde default dark palette | `superseded` | superseded by 0015 |
| [0005](./0005-jekyll-warm-palette.md) | Jekyll warm editorial palette | `superseded` | superseded by 0015 |
| [0006](./0006-typography-system.md) | Typography system (DM Mono / Fraunces / IBM Plex Mono) | `superseded` | superseded by 0016 |
| [0007](./0007-hero-terminal-animation.md) | Hero is a terminal window with the T://bendet typing animation | `superseded` | superseded by 0017 |
| [0008](./0008-personal-illustration-brand.md) | Hand-drawn personal illustration as brand element and favicon | `superseded` | superseded by 0018 |
| [0009](./0009-site-structure-five-routes.md) | Site structure — five routes with per-route theme assignment | `superseded` | superseded by 0022 |
| [0010](./0010-writing-section-tabs.md) | Writing section — original and translated posts as tabs | `superseded` | superseded by 0023 |
| [0011](./0011-rtl-hebrew-support.md) | RTL/Hebrew rendering is a hard design and IA constraint | `active` |  |
| [0012](./0012-showcase-tech-constraints.md) | The portfolio must genuinely showcase SQL, Docker, from-scratch CI/CD, and cloud deployment | `active` |  |
| [0013](./0013-repo-topology.md) | Repository topology — workshop and app live in one monorepo | `active` |  |
| [0014](./0014-mythology-subordinate-naming-register.md) | Greek mythology enters only as a bounded naming register over real infrastructure | `active` |  |
| [0015](./0015-prototype-exact-palette.md) | Palette is prototype-exact — two temperatures, six accents, minimal AA nudges | `active` |  |
| [0016](./0016-prototype-typography-hebrew-companions.md) | Typography is prototype-exact (Syne+DM Mono / Fraunces+IBM Plex Mono) with verified Hebrew companions | `active` |  |
| [0017](./0017-hero-bare-protocol-resolution.md) | Hero is the bare protocol resolution — typing animation kept, terminal window dropped | `active` |  |
| [0018](./0018-portrait-about-favicon-confirmed.md) | Portrait confirmed at About + favicon, unframed and never mythologized; ink treatment deferred to digitization | `active` |  |
| [0019](./0019-framework-astro7-static-core-plus-api.md) | Framework is Astro 7.x — static core plus hand-built API and containerized Postgres | `active` | **narrowed by 0023** — read together |
| [0020](./0020-dynamic-layer-scope-analytics-reactions-admin.md) | Dynamic layer scope — first-party analytics, reactions, private admin dashboard; comments deferred but designed for | `active` | **narrowed by 0024** — read together |
| [0021](./0021-cloud-deploy-ec2-compose-ecr-pipeline.md) | Cloud and deploy — EC2 t4g.micro with Docker Compose, ECR via OIDC, Route 53, Caddy TLS, hand-written GitHub Actions pipeline | `active` |  |
| [0022](./0022-site-structure-routes-global-theme.md) | Site structure — twelve public routes, archetype differentiation, one global theme | `active` | **narrowed by 0031** — read together |
| [0023](./0023-translations-hebrew-locale-subtree.md) | Translated articles live in a Hebrew locale subtree with compliance-bound attribution | `active` | narrows 0019 |
| [0024](./0024-content-model-collections-and-analytics-key.md) | Content model — three typed collections and a namespaced analytics key contract | `active` | narrows 0020 |
| [0025](./0025-phase2-development-workflow.md) | Phase 2 development workflow — tracks, risk-tiered review, and a retired agent roster | `active` | **narrowed by 0030** — read together |
| [0026](./0026-worktrees-rejected-phase2-branch-model.md) | Worktrees rejected as the default; Phase 2 branch model is track-prefixed branches through PRs | `active` |  |
| [0027](./0027-adr-partial-narrowing-relation.md) | The ADR lifecycle gains a partial-narrowing relation, threaded through the validator and the index | `active` |  |
| [0028](./0028-phase2-enforcement-layer.md) | Phase 2 enforcement layer — edit what is checked, never the checker; closed missions freeze | `active` | **narrowed by 0031, 0032** — read together |
| [0029](./0029-workshop-packaging-boundary.md) | The workshop's export boundary is specified at version 0.1 but not published; brand-voice is reclassified as a project artifact | `active` |  |
| [0030](./0030-retired-agents-deleted-provenance-in-git.md) | Retired agents are deleted; provenance moves to git history and an evolution log | `active` | narrows 0025 |
| [0031](./0031-docs-sync-retires-colophon-static-at-production.md) | The docs-sync machinery retires; the colophon becomes a static road-to-production page generated at first deploy | `active` | narrows 0022, 0028 |
| [0032](./0032-enforcement-simplification-and-parameter-headers.md) | Enforcement layer simplifies to the static Phase 2 rule; species lint and parameter headers are dropped | `active` | narrows 0028 |
