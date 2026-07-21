# Documentation Verification Report — Mission 3, Stage 2 input

Produced by the docs-explorer worker, 2026-07-21. Provenance document: every
version/compatibility/pricing claim used in evaluation.md must trace to an
entry here (or to a follow-up verification noted inline there). Confidence
levels and unverified items are flagged honestly — low-confidence entries must
not be load-bearing without a follow-up check.

---

## A. Runtimes and shared tooling

**Q1:** Node.js 24 ("Krypton") is the current Active LTS line (v24.18.0+), supported until **2028-04-30**. Node 22 ("Jod") is in Maintenance LTS until 2027-04-30. Node 26 shipped as Current in 2026 and will be promoted to LTS in October 2026. Confirms premise: yes, Node 24 is the active LTS today.
Source: https://nodejs.org/en/about/previous-releases · https://endoflife.date/nodejs
Checked: 2026-07-21 · Confidence: medium (exact EOL date parsing was inconsistent across sources)

**Q2:** Current stable @mdx-js major is **v3** (@mdx-js/mdx, /react, /loader, /preact all at 3.1.1). No v4 has shipped as of this check.
Source: https://www.npmjs.com/package/@mdx-js/mdx · https://mdxjs.com/packages/mdx/
Checked: 2026-07-21 · Confidence: medium

**Q3:** Tailwind CSS is at **v4.x**, latest patch ~4.3.2/4.3.3 (@tailwindcss/vite at 4.3.3). @tailwindcss/vite is confirmed as the current first-party, recommended Vite integration path for Tailwind 4.
Source: https://github.com/tailwindlabs/tailwindcss/releases · https://www.npmjs.com/package/@tailwindcss/vite
Checked: 2026-07-21 · Confidence: medium

**Q4:** Current stable React is **19.x** (latest patch reported as 19.2.7). React 18 is legacy/LTS-style "safe" branch but 19 is the current stable major and is what Next.js 15/16 and RR7/8 target.
Source: https://react.dev/versions · https://endoflife.date/react
Checked: 2026-07-21 · Confidence: medium

## B. Astro

**Q5:** **CONTRADICTS PREMISE.** Astro 6 is no longer current — **Astro 7.0** shipped and the latest patch is **7.0.9 (released 2026-07-13)**. Astro 7 brought a Rust-based compiler/markdown parser, Vite 8, and Rolldown. Minimum Node version for Astro 7 is **Node 22**.
Source: https://astro.build/blog/ · https://astrobuild.eu/en/releases
Checked: 2026-07-21 · Confidence: medium

**Q6:** Confirmed still accurate: content collection entries expose `id` (glob-loader entries are auto-slugified into `id`; a custom `slug` field in frontmatter can override it), and `render()` is imported from `astro:content` and returns `Promise<RenderResult>` with a `<Content />` component. `getCollection`/`getEntry`/`getEntries` return `CollectionEntry<'name'>`.
Source: https://docs.astro.build/en/guides/content-collections/ · https://docs.astro.build/en/reference/modules/astro-content/
Checked: 2026-07-21 · Confidence: high

**Q7:** Confirmed: **@astrojs/tailwind is deprecated**; Astro and Tailwind both recommend the official **@tailwindcss/vite** plugin for Tailwind 4+. `astro add tailwind` on Astro 5.2+ installs the Vite plugin path, not the old integration.
Source: https://docs.astro.build/en/guides/integrations-guide/tailwind/ · https://www.npmjs.com/package/@astrojs/tailwind
Checked: 2026-07-21 · Confidence: high

**Q8:** Server islands are documented as a standard (non-experimental) feature in current docs, requiring an on-demand-rendering **adapter** (e.g., @astrojs/node) to perform the deferred render, activated via the `server:defer` directive. First shipped experimental in 4.12, stabilized around the 5.0 line.
Source: https://docs.astro.build/en/guides/server-islands/
Checked: 2026-07-21 · Confidence: medium

**Q9:** @astrojs/node adapter: **v11.0.2** (published ~8 days prior to check). @astrojs/mdx: **v7.0.3**. @astrojs/sitemap: **v3.7.3** (supports i18n hreflang via an `i18n` config option that emits `<xhtml:link>` alternates). Astro-version compatibility ranges for these packages were not independently confirmed (npm pages returned 403 to the fetch tool).
Source: https://www.npmjs.com/package/@astrojs/node · https://docs.astro.build/en/guides/integrations-guide/mdx/ · https://docs.astro.build/en/guides/integrations-guide/sitemap/
Checked: 2026-07-21 · Confidence: medium

**Q10:** Astro's built-in i18n routing supports locale-prefixed routes (with configurable default-locale prefixing), and locale objects can carry a `dir: "rtl"` property that you apply to `<html lang dir>` yourself. @astrojs/sitemap's `i18n` option generates hreflang `<xhtml:link>` alternates. **Documented RTL gotcha:** Astro's i18n routing is explicitly "writing-direction-agnostic" — RTL `dir` handling is NOT automatic and must be wired manually (locale config + `<html dir>` + CSS logical properties).
Source: https://docs.astro.build/en/guides/internationalization/ · https://docs.astro.build/en/recipes/i18n/
Checked: 2026-07-21 · Confidence: medium (RTL gotcha description sourced from a third-party 2026 guide)

## C. Next.js

**Q11:** Current stable Next.js is **16.2.x** (16.2.7/16.2.10 reported). Requires **Node 20+**. React requirement: minimum react@18.2.0, but React 19 is fully supported and is the effective target for Next 16.
Source: https://nextjs.org/docs/messages/react-version · https://github.com/vercel/next.js/releases
Checked: 2026-07-21 · Confidence: medium

**Q12:** Current official guidance (`output: 'standalone'` + `next start`): **Image Optimization** works self-hosted but install `sharp` explicitly — without it, optimization falls back to a slow pure-JS path or fails. **Middleware** works self-hosted (runs on the server, not at the edge); not supported under static export. **ISR** works automatically for a single-instance self-hosted deployment using the local filesystem cache; multi-instance deployments need a custom cache handler backed by shared storage.
Source: https://nextjs.org/docs/app/guides/self-hosting
Checked: 2026-07-21 · Confidence: high

**Q13:** @next/mdx supports App Router MDX pages with build-time compilation and a required `mdx-components.tsx`. **@next/mdx does NOT support frontmatter parsing out of the box** — typed frontmatter requires bolting on `gray-matter`, `next-mdx-remote`, or a third-party package. Materially weaker MDX-with-typed-frontmatter story than content-collection-style systems.
Source: https://nextjs.org/docs/app/guides/mdx
Checked: 2026-07-21 · Confidence: medium

**Q14:** Confirmed: **App Router has no built-in i18n routing** (unlike the old Pages Router `i18n` config). Current documented approach is manual locale-segment routing (`app/[locale]/...`) plus a library like `next-intl`, plus setting `<html lang dir>` per locale yourself in the locale layout. The **Metadata API does generate hreflang** via `alternates.languages` in `generateMetadata` (add `x-default` manually).
Source: https://next-intl.dev/docs/routing · Next.js Metadata API docs (search synthesis)
Checked: 2026-07-21 · Confidence: medium

**Q15:** Two documented gotchas: (1) Next.js 16 changed the caching model so routes are **prerendered by default** at build time unless they opt into dynamic APIs — a meaningfully different caching posture than Next 14/15. (2) Open documented issue: webpack cannot statically analyze the dynamic `import(...)` inside `@next/mdx`'s loader, producing persistent build-cache warnings in production builds.
Source: https://github.com/vercel/next.js/issues/89753 · https://nextjs.org/docs/app/getting-started/cache-components
Checked: 2026-07-21 · Confidence: medium

## D. React Router v7/v8

**Section flag: CONTRADICTS PREMISE — React Router v8 was released 2026-06-17** and is now current. v7 still receives security updates but is no longer the latest major.

**Q16:** v7 is stable and still supported (security updates only). **v8 is current** — requires **Node 22.22.0+**, React 19.2.7+, Vite 7+, ESM-only. v7 minimums were Node 20 / React 18. Framework Mode is fully stable in both; the v7→v8 upgrade is described by the team as non-breaking.
Source: https://remix.run/blog/react-router-v8
Checked: 2026-07-21 · Confidence: high

**Q17:** Framework mode supports build-time `prerender` config (static array, dynamic function, or `prerender: true` for all static routes). Prerendered output is plain static HTML + client navigation payloads and **can be served without the Node server** for fully-prerendered sites; if any route needs live SSR or server loaders, the server is required for those routes.
Source: https://reactrouter.com/how-to/pre-rendering · https://reactrouter.com/api/framework-conventions/react-router.config.ts
Checked: 2026-07-21 · Confidence: high

**Q18:** No first-party MDX plugin — the documented path is **@mdx-js/rollup via Vite** (generic MDX-for-Vite tooling). Maturity is mixed: open unresolved GitHub issue where `@mdx-js/rollup` throws "Unexpected FunctionDeclaration" errors against RR7's custom Vite dev server setup in some configurations.
Source: https://github.com/remix-run/react-router/issues/12168 · https://mdxjs.com/packages/rollup/
Checked: 2026-07-21 · Confidence: medium

**Q19:** Official RR7/RR8 templates ship with a working Dockerfile (npm/pnpm/bun variants) and documented deploy targets including AWS ECS, Cloud Run, Azure Container Apps, DigitalOcean, Fly.io, Railway. Built-in app server described as production-ready.
Source: https://reactrouter.com/start/framework/deploying
Checked: 2026-07-21 · Confidence: medium

## E. TanStack Start

**Q20:** **Not yet 1.0 stable.** `@tanstack/react-start` is published as **1.168.32 (2026-07-19)** in the 1.x line, having passed an RC milestone earlier in 2026 (API described as stable/feature-complete pending final 1.0 cut). Treat as "RC-quality, not formally 1.0."
Source: https://github.com/TanStack/router/releases · https://tanstack.com/blog/announcing-tanstack-start-v1
Checked: 2026-07-21 · Confidence: medium

**Q21:** Supports static prerendering via a `prerender` option in the Vite plugin config (requires ≥1.138.0), with `crawlLinks` auto-discovery. **MDX support is not first-party** — documented path is via third-party integration, primarily **Fumadocs MDX** (~15.x) wired through Vite.
Source: https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering · https://www.fumadocs.dev/docs/mdx/vite/tanstack
Checked: 2026-07-21 · Confidence: medium

**Q22:** Builds on **Vite + Nitro** (server output bundled to `.output/server/index.mjs`). Deployment targets: Node servers, edge runtimes, Bun, static hosting; Docker guidance exists via community posts rather than an official first-party Dockerfile.
Source: https://tanstack.com/start/latest/docs/framework/react/overview
Checked: 2026-07-21 · Confidence: medium (Docker guidance third-party-sourced)

## F. SQL engines and ORMs

**Q23:** Current stable PostgreSQL major is **18** (latest point release ~18.4); PostgreSQL 19 is in beta targeting September 2026 GA. Commonly pinned Docker tag: **`postgres:18`** (or fully pinned `postgres:18.4-bookworm` / `postgres:18-alpine`).
Source: https://www.postgresql.org/about/news/postgresql-184-1710-1614-1518-and-1423-released-3297/ · https://hub.docker.com/_/postgres
Checked: 2026-07-21 · Confidence: high

**Q24:** Prisma is at major **v7** (7.7.0 reported). Node 24 LTS documented as supported/tested. SQLite and PostgreSQL fully supported connectors. Exact current `prisma migrate` CI guidance UNVERIFIED against primary docs this pass; the general pattern (`prisma migrate deploy` in CI/CD, `prisma migrate dev` locally) has not changed structurally per available sources.
Source: https://www.prisma.io/docs/orm/core-concepts/supported-databases · https://github.com/prisma/prisma
Checked: 2026-07-21 · Confidence: medium (CI-guidance detail unverified)

**Q25:** Drizzle ORM is **not yet 1.0 stable**. Latest is **v1.0.0-rc.4 (2026-06-27)**; stable 0.x line ~**0.45.2**. Docs note 0.44.x as the conservative pick; 1.0-beta/rc acceptable only if API churn is tolerable.
Source: https://github.com/drizzle-team/drizzle-orm/releases · https://orm.drizzle.team/docs/latest-releases
Checked: 2026-07-21 · Confidence: high

**Q26:** `node:sqlite` is **Stability 1.2 — Release Candidate**, not formally stable. Community sources advise against production HTTP servers today (synchronous-only API, blocks the event loop under I/O, lacks `db.transaction()` ergonomics); suited to CLI tools/build scripts for now.
Source: https://nodejs.org/api/sqlite.html
Checked: 2026-07-21 · Confidence: high

**Q27:** Litestream is actively maintained in 2026 (recent LTX architectural work, VFS read-replica layer). Supports S3, GCS, Azure Blob, SFTP, local paths. Exact current version number UNVERIFIED this pass; S3 replication cost at personal-site scale estimated well under $1/month but this is an estimate, not a verified figure.
Source: https://litestream.io/ · https://github.com/benbjohnson/litestream
Checked: 2026-07-21 · Confidence: low (version and cost UNVERIFIED — must not be load-bearing without follow-up)

## G. Cloud pricing (against the $15/month G6 ceiling)

**Q28:** AWS Lightsail cheapest bundle: **$3.50/month** (IPv6-only nano: 512MB RAM, 2 vCPU, 20GB SSD, 1TB transfer) or **$5/month** with public IPv4. Lightsail Container Service cheapest tier: **$10/month** (Micro: 0.25 vCPU, 1GB RAM). New accounts: 3 months free on select bundles.
Source: https://aws.amazon.com/lightsail/pricing
Checked: 2026-07-21 · Confidence: medium

**Q29:** EC2 (us-east-1, on-demand): **t4g.micro ≈ $6.13/mo**; **t4g.small ≈ $12.26/mo**. AWS Free Tier post-2025 revamp: accounts created on/after 2025-07-15 get a **credits-based Free Plan** — up to $200 in credits over up to 6 months — plus 30+ "Always Free" services with perpetual caps. Pre-2025-07-15 accounts remain on the legacy 12-month model.
Source: https://aws.amazon.com/free/ · https://www.economize.cloud/resources/aws/pricing/ec2/t4g.micro/
Checked: 2026-07-21 · Confidence: medium

**Q30:** RDS db.t4g.micro Postgres Single-AZ: **~$11.68/month compute** alone; with 20GB gp3 storage (~$2.30) a realistic minimal config lands **~$14/month total** — it consumes nearly the entire $15 ceiling by itself, leaving no room for compute/hosting. db.t4g.micro has only 1GiB RAM.
Source: search synthesis of AWS RDS pricing breakdowns; primary aws.amazon.com/rds/postgresql/pricing/ not independently fetched
Checked: 2026-07-21 · Confidence: medium (third-party-aggregated — re-fetch primary before this number is load-bearing)

**Q31:** S3 + CloudFront static hosting at personal-site scale: **roughly $0.50–$3/month** (CloudFront $0.085/GB first 10TB, requests $0.0075/10k, S3 storage negligible). **Route 53 hosted zone: $0.50/month**; DNS queries free with Alias records to AWS resources.
Source: search synthesis of AWS pricing pages (not primary-fetched this pass)
Checked: 2026-07-21 · Confidence: medium

**Q32:** DigitalOcean smallest x86 Droplet: **$4/month**; no ARM Droplets. Hetzner smallest x86 (CX23): **~€5.49/month** (post mid-2026 price increases of 2.4x–3.1x). Hetzner smallest ARM (CAX11): **~$3.79–4.19/month** (2 vCPU/4GB/20TB) — among the cheapest production-capable cloud servers available.
Source: https://www.digitalocean.com/pricing/droplets · https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/
Checked: 2026-07-21 · Confidence: medium

**Q33:** **Neon** free tier: 100 CU-hours/month/project, 0.5GB storage/project, scales to zero after 5 min idle (suspended = $0), sub-second resume. Cheapest paid ("Launch"): usage-based, no monthly minimum, $0.106/CU-hour. **Supabase** free tier: 500MB DB, 2 active projects, **auto-pause after 7 days of inactivity** (manual/API unpause). Cheapest paid floor: **Pro at $25/month — exceeds the $15 ceiling outright**.
Source: https://neon.com/pricing · https://supabase.com/pricing
Checked: 2026-07-21 · Confidence: high

## H. Registry and CI free tiers

**Q34:** GitHub Actions: **unlimited free minutes for public repos**; 2,000 min/month free for private repos (Free plan). ARM64 hosted runners available: Linux ARM64 2-core at **$0.005/min** (charged even where x86 would be free on public repos — verify at use time). The proposed $0.002/min platform charge was **postponed indefinitely**; self-hosted runner minutes remain free.
Source: https://docs.github.com/en/billing/reference/actions-runner-pricing
Checked: 2026-07-21 · Confidence: high

**Q35:** GHCR (ghcr.io): GitHub currently does **not bill** for container image storage or bandwidth — public pulls effectively unlimited, unlimited private repos at no charge, pulls from Actions free. **Explicitly a current-not-contractual policy** per GitHub's own discussion thread — a soft dependency, not a guarantee. **Docker Hub** free: 100 pulls/6hr unauthenticated, 200 pulls/6hr authenticated; 1 free private repo.
Source: https://docs.docker.com/docker-hub/usage/pulls/ · GitHub community discussion on GHCR billing
Checked: 2026-07-21 · Confidence: medium

**Q36:** AWS ECR: **$0.10/GB-month** private storage; 50GB/month always-free for public repos; same-region transfer to EC2/Lambda/Fargate free; internet egress from ~$0.09/GB. At one-small-image scale: effectively **near $0/month** same-region.
Source: https://aws.amazon.com/ecr/pricing/
Checked: 2026-07-21 · Confidence: medium

## I. Ops pieces

**Q37:** Caddy current stable **v2.11.x** (2.11.2, ~March 2026). Automatic HTTPS remains zero-config for a single-site reverse proxy (Let's Encrypt/ZeroSSL auto-provision/renew, HTTP→HTTPS redirect, HTTP/2 + HTTP/3 native).
Source: https://caddyserver.com/docs/automatic-https · https://github.com/caddyserver/caddy/releases
Checked: 2026-07-21 · Confidence: medium

**Q38:** Playwright **v1.61.x** (1.61.0 released 2026-06-29). RTL testing: assert `dir`/computed direction via normal locator/`getComputedStyle` calls plus `toHaveScreenshot()` visual baselines per `dir="rtl"` page state — guidance-level, no dedicated RTL API. Sufficient for ADR 0011's CI RTL rendering check.
Source: https://playwright.dev/docs/release-notes · https://github.com/microsoft/playwright/releases
Checked: 2026-07-21 · Confidence: medium (one stale-cache date discrepancy noted; 2026 date corroborated by two independent results)

**Q39:** Docker Compose **V2** (`docker compose` plugin) is current and standard; legacy `docker-compose` V1 deprecated. Top-level `version:` key obsolete; files follow the unified **Compose Specification** — still the de facto standard for single-host multi-container deploys.
Source: https://docs.docker.com/compose/compose-file/compose-versioning/ · https://compose-spec.io/
Checked: 2026-07-21 · Confidence: medium

---

## Flags for follow-up (from the worker, verbatim in substance)

1. **Astro 6 → Astro 7** (Q5): the incumbent candidate's premise assumed Astro 6 currency; Astro 7.0 shipped (Rust compiler, Vite 8, Node 22 minimum). Prior ADR/spec assumptions must be re-checked against 7.x behavior.
2. **React Router v7 → v8** (Q16–19): v8 released 2026-06-17 (Node 22.22+, React 19.2.7+, ESM-only). Choosing v7 deliberately is viable (security patches) but it is no longer current.
3. **Litestream version/cost** (Q27), **RDS primary pricing** (Q30), **S3/Route53 primary pricing** (Q31): secondary-sourced — need a direct primary-source pass before these numbers become load-bearing in the budget decision.
4. **GHCR "currently free"** (Q35) is a revisable policy, not a contract — don't treat as permanent in architecture decisions.
5. **RDS alone (~$14/mo) essentially consumes the entire $15/month ceiling** (Q30) — the single most important budget finding: managed-Postgres-on-RDS leaves no room for compute/hosting/CDN under the ceiling, reinforcing Neon-class free tier or self-hosted (containerized Postgres / SQLite+Litestream) approaches.
