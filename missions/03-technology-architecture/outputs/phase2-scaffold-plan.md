# Phase 2 Scaffold Plan — app/ creation (NOT executed in Phase 1)

Date: 2026-07-21
Status: plan on paper. Per CLAUDE.md, `app/` must not exist before Phase 2;
the mission-gate hook enforces this. First act of Phase 2 (after M6 closes)
is executing this plan under the M5-designed workflow. Written for the
monorepo topology (repo-topology-decision.md, pending Tal); §7 notes the
delta if Tal chooses separate-repo.

Command syntax below was verified against docs.astro.build
(install-and-setup, fetched 2026-07-21): scaffold via `pnpm create
astro@latest`, Node ≥ 22.12.0 required (odd majors unsupported), `astro add`
for integrations. Standing rule: never use bash brace expansion for
directory creation.

## 0. Preconditions (all must hold)

- Mission 6 closed with APPROVED verdict; Phase 2 formally open.
- Repo topology confirmed by Tal and the 0013-resolving ADR written.
- Local toolchain: Node 24 LTS (Q1), pnpm, Docker Desktop / Engine with
  Compose V2 (`docker compose`, Q39).
- **Scaffold-time verification pass (do BEFORE installing anything):**
  1. Astro 7.x compatibility ranges for @astrojs/mdx, @astrojs/sitemap and
     @tailwindcss/vite — Q9 could not confirm them (npm 403s). Check each
     package's npm page/peer deps against the installed Astro version.
  2. Current `prisma migrate` CI guidance (Q24 flagged unverified): confirm
     `prisma migrate deploy` remains the CI/CD command and check current
     docs for shadow-DB / advisory-lock behavior in pipelines.
  3. AWS public-IPv4 billing for EC2 (NOT covered by
     verification-report.md): confirm the ~$3–4/mo charge and whether any
     exemption applies; update the budget in architecture-decision.md §6.
  4. QEMU/buildx arm64 build time on free x86 runners (Q34 gotcha): if
     builds exceed ~10–15 min, evaluate paid ARM runner minutes ($0.005/min,
     Q34) vs building on the instance.
  5. Re-check current patch versions of: Astro 7.x (Q5), @tailwindcss/vite
     (Q3), Prisma 7 (Q24), Playwright (Q38), Caddy (Q37), postgres:18 tag
     (Q23) — pin exact versions at install, from lookups, never memory.

## 1. Directory layout to create

```
app/
  pnpm-workspace.yaml     # app/ is its own pnpm workspace
  web/                    # Astro 7 static site
  api/                    # hand-built Node/TS service + prisma/ schema
  deploy/
    compose.yaml          # prod: web, api, db
    compose.dev.yaml      # local: db (+ optional api hot-reload)
    Caddyfile
    web.Dockerfile        # multi-stage: astro build -> caddy image
    api.Dockerfile        # multi-stage: node:24-slim
.github/workflows/
  ci.yml                  # authored, stages per architecture-decision.md §5
  deploy.yml
  backup.yml
```

Create directories individually (mkdir per path — no brace expansion).

## 2. Scaffold the static site

```
cd app
pnpm create astro@latest web -- --template minimal --no-git
cd web
pnpm astro add mdx sitemap
pnpm add tailwindcss @tailwindcss/vite
```

- `--no-git`: the repo already exists (monorepo). Flag names should be
  re-checked against the create-astro README at run time (the docs point
  there for the full flag list; pnpm flag pass-through syntax differs
  slightly from npm's `--` form — verified caveat from the docs fetch).
- Tailwind 4 wiring: `@tailwindcss/vite` in `vite.plugins` in
  `astro.config` — NOT @astrojs/tailwind, which is deprecated (Q7).
  (`astro add tailwind` on current Astro installs the vite-plugin path,
  Q7 — either route is acceptable; verify the result is the vite plugin.)
- **Do NOT add @astrojs/node.** The core is static-only by decision
  (architecture-decision.md §7); no adapter.
- Configure: `i18n` locales (en default, he with RTL applied manually in
  layouts — Q10), content collections with typed schemas including the
  translation-pairing and original-author-credit fields (Q6; exact schema
  is Mission 4's content model), sitemap i18n hreflang (Q9).

## 3. Scaffold the API service

```
cd app/api
pnpm init
pnpm add <http-framework> argon2 ... (pin at run time)
pnpm add -D typescript vitest @types/node
pnpm add prisma @prisma/client && pnpm prisma init
```

- Exact HTTP framework pinned here (Express-5-class per
  architecture-decision.md §1) after a version lookup — not from memory.
- Prisma schema v1 tables: `view_events`, `reactions`, `sessions`,
  `admin_user` (single seeded row). First migration committed. Design
  rule: additive migrations; articles referenced by stable content `id`
  (Q6) so comments tables can arrive later without reshaping anything.
- Endpoints v1 under `/api/v1/`: POST view-event, GET/POST reactions,
  auth (login/logout, rate-limited), `/admin` server-rendered dashboard,
  `/healthz`.
- Auth per architecture-decision.md §3: session cookie (httpOnly, Secure,
  SameSite=Strict), sessions table, argon2-class hash. No JWT.

## 4. Author the container files (all hand-written)

1. `api.Dockerfile`: multi-stage — deps → build (tsc) → runtime on
   node:24-slim, non-root user, HEALTHCHECK.
2. `web.Dockerfile`: multi-stage — pnpm build of `web/` → copy `dist/`
   into a pinned Caddy 2.11 image (Q37) with the `Caddyfile`.
3. `Caddyfile`: site block with automatic HTTPS (Q37); serve static root;
   `reverse_proxy /api/* api:PORT` and `/admin/*` likewise; security
   headers.
4. `compose.yaml` (prod): services web/api/db; `postgres:18` pinned (Q23);
   named volume for pgdata; internal network; `restart: unless-stopped`;
   healthchecks; env via instance-local `.env` (never committed).
5. `compose.dev.yaml`: db only by default; optional api with bind mounts.
   Astro dev loop stays on host (`pnpm astro dev`).
6. Local sanity check: `docker compose -f deploy/compose.dev.yaml up`, run
   api tests against it, `astro build` + preview.

## 5. Author the workflows (from scratch, per architecture-decision.md §5)

Order: `ci.yml` first (typecheck → test-with-postgres-service-container →
build → Playwright RTL check per ADR 0011 — fixture translated article,
assert `html[lang="he"][dir="rtl"]` + author credit + screenshot baseline,
Q38). Then `deploy.yml` (buildx arm64 → ECR via OIDC → `prisma migrate
deploy` → SSH compose pull/up → health check → rollback-by-SHA-tag). Then
`backup.yml` (cron pg_dump → S3). Monorepo: `paths: [app/**]` filters and a
protected `production` environment holding deploy secrets
(repo-topology-decision.md consequences).

## 6. Cloud provisioning (once, documented as it is done)

1. Route 53 hosted zone for the domain (Q31); records after instance is up.
2. EC2 `t4g.micro` arm64 (Q29), minimal Debian/AL2023; security group:
   443/80 open, SSH restricted; key or SSM access.
3. Verify IPv4 billing (§0.3) and attach a stable public IP accordingly.
4. Install Docker Engine + Compose plugin on the instance; create app dir
   + `.env`.
5. ECR repositories for `web` and `api` (Q36); IAM OIDC identity provider +
   role trusted for this repo/environment only — no long-lived keys.
6. S3 backup bucket, versioned, lifecycle expiry; least-privilege policy
   for the backup principal.
7. First deploy: run `deploy.yml` manually (workflow_dispatch); confirm
   TLS issuance (Q37), site up, `/healthz` green, RTL article correct in
   production; then enable the backup cron and test a restore once —
   an untested backup is not a backup.

## 7. If Tal chooses separate-repo instead

Steps are identical except: `app/` content becomes the new repo root;
workflows drop path filters; the M5 workflow machinery must be re-vendored
into the new repo (accepted drift cost — this is the main argument against
the option, per repo-topology-decision.md); deploy secrets/OIDC trust move
to the new repo.

## 8. Standing cautions

- Pin every version from a fresh lookup at execution time; this plan's
  versions are 2026-07-21 facts (Q-references) and WILL be stale.
- Astro 7 = Vite 8/Rolldown (Q5): check each Vite-ecosystem plugin against
  Vite 8 before adding it.
- No mythological names in site content (ADR 0014); infra artifacts
  (workflows, services, scripts) MAY take register names where a thing
  genuinely needs a name — chosen then, not now.
- Never write secrets into the tree; `.env` on-instance and GitHub
  environment secrets only.
