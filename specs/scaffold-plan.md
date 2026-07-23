# Scaffold Plan — app/

Consolidated from the Phase 1 scaffold plan + the 2026-07-22 scaffold-time
verification batch (all seven owed verifications ran; results are baked in
below). Monorepo topology: `app/` lives in this repo.

**Standing rule:** every version below is a 2026-07-22 fact. Re-pin from
fresh lookups at install time if this document is more than a few days old.

## 0. Verified facts (2026-07-22 batch)

| Package | Pin | Note |
|---|---|---|
| `astro` | 7.1.3 | Node engine `>=22.12.0`; Node 24 LTS fine |
| `@astrojs/mdx` | 7.0.3 | peer `astro:^7.0.0` — compatible |
| `@tailwindcss/vite` | 4.3.3 | peer includes vite ^8; Astro 7 bundles Vite 8 — compatible |
| `@astrojs/sitemap` | 3.7.3 | **UNCONFIRMED against Astro 7** — add it, run `astro build`, confirm `sitemap-index.xml` emits; if broken, look for a newer release before working around |
| `prisma` | 7.9.0 | `prisma migrate deploy` remains the CI/prod command; no shadow DB in deploy; advisory lock has a fixed 10s timeout (escape hatch: `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK`). **Prisma 7 change (hit 2026-07-23):** `datasource.url` no longer lives in `schema.prisma` — it moves to `prisma.config.ts` (`defineConfig({ datasource: { url: env('DATABASE_URL') } })`), and even `prisma generate` requires `DATABASE_URL` to be set (placeholder is fine at image build) |
| `express` | 5.2.1 | satisfies the Express-5-class decision |
| `@playwright/test` | 1.61.1 | |
| `caddy` | 2.11.4 | |
| `postgres` image | `18.4-alpine` | use the explicit tag, not bare `postgres:18`. **Gotcha (hit 2026-07-23):** 18+ images store data under `/var/lib/postgresql`, not `/var/lib/postgresql/data` — mount the named volume there or the container refuses to start |

Other verified facts:
- **arm64 builds run on native GitHub runners** (`runs-on: ubuntu-24.04-arm`,
  GA, free for public repos). Do NOT use QEMU/buildx cross-emulation (4–5×
  slower; the whole paid-runner tradeoff is dissolved).
- **Cloud budget ≈ $10.28/mo** (t4g.micro $6.13 + Route 53 $0.50 + public
  IPv4 $3.65, assume no free-tier exemption) + S3 pennies. Inside the $15
  ceiling with ~$4.70 headroom.
- **Glob-loaded entries expose raw `entry.body` at `getStaticPaths` time**
  (default `retainBody: true`) — the `caseStudy`-vs-empty-body guard is
  directly implementable:
  ```ts
  const entries = await getCollection('projects');
  for (const e of entries) {
    if (e.data.caseStudy === true && !e.body?.trim()) {
      throw new Error(`caseStudy: true with empty body — ${e.id}`);
    }
  }
  ```
- **Caddy path-scoped `handle_errors` works** for the `/he/*` 404 page with
  a real 404 status (snippet in §4 — `caddy validate`d against 2.11.4 on
  2026-07-23; the originally researched snippet had the CEL quoting wrong:
  the whole expression must be backtick-wrapped with inner strings
  double-quoted). Assert the *status* in CI, not just the body.

## 1. Directory layout

```
pnpm-workspace.yaml       # the repo root is the pnpm workspace (flattened 2026-07-23)
web/                      # Astro 7 static site
api/                      # hand-built Node/TS service + prisma/ schema
deploy/
  compose.yaml            # prod: web, api, db
  compose.dev.yaml        # local: db (+ optional api hot-reload)
  Caddyfile
  web.Dockerfile          # multi-stage: astro build -> caddy image
  api.Dockerfile          # multi-stage: node:24-slim
.github/workflows/
  ci.yml                  # stages per specs/ci-obligations.md
  deploy.yml
  backup.yml
```

Create directories individually (mkdir per path — no brace expansion).

## 2. Scaffold the static site

```
pnpm create astro@latest web -- --template minimal --no-git
cd web
pnpm astro add mdx sitemap
pnpm add tailwindcss @tailwindcss/vite
```

- `--no-git`: the repo already exists. Re-check flag names against the
  create-astro README at run time (pnpm pass-through syntax differs from
  npm's `--` form).
- Tailwind 4 wiring: `@tailwindcss/vite` in `vite.plugins` in
  `astro.config` — NOT the deprecated @astrojs/tailwind. (`astro add
  tailwind` installs the vite-plugin path on current Astro; verify.)
- **Do NOT add @astrojs/node.** The core is static-only; no adapter.
- Configure: `i18n` block per `content-model.md` §5 (`prefixDefaultLocale:
  false`, en default, he — RTL applied manually in layouts); content
  collections with the typed schemas from `content-model.md` (translation
  pairing + original-author credit fields included).
- **Sitemap: configure @astrojs/sitemap WITHOUT its `i18n` option.** No
  hreflang alternates — the English counterparts are not on this site.
  (Revisitable only if the own-article-in-both-languages case ever lands.)
- **`trailingSlash`: pick one form and enforce it** — the non-canonical
  spelling must redirect, never 404 (`routes/sitemap.md` §1).

## 3. Scaffold the API service

```
cd api
pnpm init
pnpm add express@5.2.1 argon2 ... (re-pin at run time)
pnpm add -D typescript vitest @types/node
pnpm add prisma @prisma/client && pnpm prisma init
```

- Prisma schema v1 tables: `view_events`, `reactions`, `sessions`,
  `admin_user` (single seeded row). First migration committed. Design
  rule: additive migrations; articles referenced by stable content `id`
  so comments tables can arrive later without reshaping anything.
- Endpoints v1 under `/api/v1/`: POST view-event, GET/POST reactions,
  auth (login/logout, rate-limited), `/admin` server-rendered dashboard,
  `/healthz`.
- Auth per `architecture.md` §3: session cookie (httpOnly, Secure,
  SameSite=Strict), sessions table, argon2-class hash. No JWT.

## 4. Container files (all hand-written)

1. `api.Dockerfile`: multi-stage — deps → build (tsc) → runtime on
   node:24-slim, non-root user, HEALTHCHECK.
2. `web.Dockerfile`: multi-stage — pnpm build of `web/` → copy `dist/`
   into a pinned Caddy 2.11 image with the `Caddyfile`.
3. `Caddyfile`: site block with automatic HTTPS; serve static root;
   `reverse_proxy /api/* api:PORT` and `/admin/*` likewise; security
   headers. Error pages with real statuses, Hebrew 404 path-scoped:
   ```caddyfile
   handle_errors {
       @he_404 expression `{http.request.uri.path}.startsWith("/he/") && {err.status_code} == 404`
       handle @he_404 {
           rewrite * /he/404.html
           file_server
       }
       handle {
           rewrite * /{err.status_code}.html
           file_server
       }
   }
   ```
4. `compose.yaml` (prod): services web/api/db; `postgres:18.4-alpine`;
   named volume for pgdata; internal network; `restart: unless-stopped`;
   healthchecks; env via instance-local `.env` (never committed).
5. `compose.dev.yaml`: db only by default; optional api with bind mounts.
   Astro dev loop stays on host (`pnpm astro dev`).
6. Local sanity check: `docker compose -f deploy/compose.dev.yaml up`, run
   api tests against it, `astro build` + preview.

## 5. Workflows (from scratch)

Order: `ci.yml` first — full obligation list in `ci-obligations.md`.
Core stages: typecheck → test-with-postgres-service-container → build →
Playwright RTL check (fixture translated article; **five assertions**, see
`ci-obligations.md` item 5). Then `deploy.yml`: build arm64 images **on
`runs-on: ubuntu-24.04-arm`** (no QEMU) → ECR via OIDC → `prisma migrate
deploy` → SSH compose pull/up → health check → rollback-by-SHA-tag. Then
`backup.yml` (cron pg_dump → S3). `ci.yml`/`deploy.yml` carry
path filters scoped to `web/**`, `api/**`, `deploy/**`; a protected `production` environment holds
deploy secrets.

## 6. Cloud provisioning — GATED ON TAL (do not start without both)

**Waiting on Tal:**
1. **The domain** — nothing names it; choosing and registering it is his.
2. **The region** — chosen against the primary audience (Israel), not the
   us-east-1 pricing example. Re-verify t4g.micro pricing + public-IPv4
   billing in the chosen region against the $15/mo ceiling before any
   resource is provisioned. (If eu-central-1: check the AWS Pricing
   Calculator by hand — the pricing page can't be fetched statically.)

Then, once, documented as it is done:
1. Route 53 hosted zone; records after instance is up.
2. EC2 `t4g.micro` arm64, minimal Debian/AL2023; security group: 443/80
   open, SSH restricted; key or SSM access.
3. Attach a stable public IP (billing already budgeted, $3.65/mo).
4. Install Docker Engine + Compose plugin on the instance; app dir + `.env`.
5. ECR repositories for `web` and `api`; IAM OIDC identity provider + role
   trusted for this repo/environment only — no long-lived keys.
6. S3 backup bucket, versioned, lifecycle expiry; least-privilege policy.
7. First deploy: `deploy.yml` via workflow_dispatch; confirm TLS issuance,
   site up, `/healthz` green, RTL article correct in production; enable the
   backup cron and **test a restore once** — an untested backup is not a
   backup.

## 7. Standing cautions

- Pin every version from a fresh lookup at execution time.
- Astro 7 = Vite 8/Rolldown: check each Vite-ecosystem plugin against
  Vite 8 before adding it.
- No mythological names in site content; infra artifacts MAY take register
  names where a thing genuinely needs a name (`brand.md` §3).
- Never write secrets into the tree; `.env` on-instance and GitHub
  environment secrets only.
