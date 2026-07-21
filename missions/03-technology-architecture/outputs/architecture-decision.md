# Architecture Decision — Mission 3, Stage 3

Date: 2026-07-21
Status: DECIDED by Tal at checkpoint 2 (stack locked: C1, Astro 7.x, with the
dynamic-layer scope amendment below). This document is the full architecture
record behind ADRs 0019–0021. Factual claims cite `verification-report.md`
("Qn", checked 2026-07-21) or the follow-up fetch noted inline. Repo topology
is NOT decided here — see `repo-topology-decision.md` (recommended, pending
Tal per CLAUDE.md's escalation list).

---

## 1. Where the dynamic boundary sits

Two runtimes, one line between them:

- **Static core (public site).** Astro 7.x (Q5: 7.0.9), fully static output —
  no adapter, no server rendering. Every public page (home, writing,
  translations, projects, about — final IA is Mission 4's) is prebuilt HTML.
  Article pages render complete content with near-zero JS; per-article
  view counts and reactions appear via a small progressive-enhancement fetch
  and degrade to absence if the API is down. RTL translated articles are
  prebuilt with `<html lang="he" dir="rtl">` via Astro's i18n locale config —
  wiring is manual by design, Astro's i18n is direction-agnostic (Q10);
  hreflang alternates via @astrojs/sitemap's i18n option (Q9).
- **Dynamic layer (private + interaction).** One hand-built Node/TS HTTP
  service (Express-5-class; exact library pinned at scaffold — Tal's
  production stack, about-tal.md) owning everything that reads or writes at
  runtime: analytics event ingestion, reaction endpoints, and the private
  admin dashboard. Node 24 LTS (Q1). Prisma 7 over Postgres (Q24).

**What renders when:** public pages render at build time in CI. The API
renders only `/admin` pages (server-rendered, session-gated) and JSON.
Nothing public depends on the dynamic layer being alive — the R4 anchor
("content survives dynamic-layer failure") is a structural property, not an
aspiration.

## 2. What the SQL database honestly does

Postgres 18 (Q23), containerized, Prisma-managed schema:

- **View events** — first-party analytics, because the site deliberately
  embeds no third-party tracker. Event = article/path, timestamp, referrer
  host, coarse user-agent class. Privacy stance: no raw IP retention
  (dedupe approach finalized in Phase 2; nothing stored that identifies a
  visitor).
- **Reactions** — per-article counters written by visitors at runtime.
- **Sessions** — the admin auth session store (see §3): a real table doing
  real work.
- **Admin dashboard reads** — aggregation queries (per-article, per-day,
  per-referrer, per-language) rendered in a private UI. This is the
  checkpoint-2 widening: SQL is demonstrated not just as a write target but
  as queries, aggregation, and a UI over Tal's own data.

Deletion test (G3): remove the database → visitors lose visible
counts/reactions, Tal loses analytics and the admin login itself.
Observable on both sides; runtime-written; cannot be a build-time file.

**Comments-ready, not comments-built (Tal's deferral):** the architecture
leaves honest headroom — articles are referenced by stable collection `id`
(Q6), the API is prefixed (`/api/v1/`) so additions don't break clients,
and Prisma migrations make new tables additive. A comments feature would
add tables and endpoints without touching the existing schema or the static
core. Explicitly NOT designed now: comment rendering, threading, and the
moderation/abuse surface — the last of these gets its own honest pricing
(spam, notification, deletion requests, ops burden) when the feature lands
in Phase 2+, because it is the actual cost of comments and pretending
otherwise would fake cheapness the way G3 forbids faking dynamism.

## 3. Admin dashboard auth — decision and reasoning

**Server-side sessions with an httpOnly, Secure, SameSite=Strict cookie,
backed by the Postgres `sessions` table. Not JWT.**

Reasoning, honestly: JWT's benefits — statelessness, horizontal scale,
cross-service token passing — solve problems this system does not have.
There is one admin, one API instance, and no third-party consumer. Sessions
give instant revocation (delete the row), no refresh-token machinery, no
key-rotation ceremony, and a smaller thing to get wrong; the session table
is also legitimate SQL doing legitimate work. Tal's JWT/security experience
(about-tal.md) argues for JWT only in the resume-driven sense the poison
list forbids — and that competence is already publicly demonstrated in the
Audiophile project. Login: single seeded admin identity, argon2-class
password hash, rate-limited login endpoint, no reset flow (re-seed by
migration if lost). The dashboard is served by the API at `/admin` as
server-rendered pages with minimal client JS — private pages have no
SEO/perf stakes, and keeping all auth surface in one service keeps the
static core purely static.

## 4. Container strategy

Three containers in production, named roles:

| Container | Image | Role |
|---|---|---|
| `web` | Caddy 2.11 (Q37) with the built Astro bundle **baked into the image** | Serves the static site from disk; reverse-proxies `/api/*` and `/admin/*` to `api`; automatic HTTPS (Let's Encrypt) with zero-config renewal (Q37) |
| `api` | Hand-built Node 24 image (multi-stage Dockerfile, authored) | Analytics/reactions endpoints, admin dashboard, auth |
| `db` | `postgres:18` pinned (Q23) | The database; named volume for data |

Baking the static bundle into the `web` image makes every deploy an
immutable, registry-versioned artifact — content rollback is "run the
previous image tag," and the static site itself becomes part of the Docker
showcase rather than rsync'd files beside it.

**Dev vs prod compose (Compose Spec V2, `docker compose`, no `version:`
key — Q39):**

- `compose.yaml` (prod, on the instance): web + api + db, named volumes,
  internal network, restart policies, healthchecks.
- `compose.dev.yaml` (local): `db` always; `api` optionally with
  bind-mount hot reload. The Astro dev server runs on the host
  (`pnpm astro dev`) for normal DX — containerizing the static-site dev
  loop buys nothing and slows feedback; this is stated rather than hidden.

## 5. CI/CD pipeline — every stage, from scratch

Three hand-written GitHub Actions workflow files. "From scratch" honestly
means: workflow syntax and primitive actions (checkout, cache) are the
vendor's; every stage's logic, ordering, and gating is authored. Public-repo
minutes are free (Q34). ARM64 gotcha: GitHub's hosted ARM runners bill
$0.005/min even on public repos (Q34), so arm64 images are built with
QEMU/buildx on free x86 runners — build-time cost accepted and re-checked at
scaffold.

**`ci.yml`** — every push/PR touching the app:
1. **typecheck** — `tsc --noEmit` (API) + `astro check` (site).
2. **test** — API unit/integration tests (Vitest-class) against an
   ephemeral `postgres:18` service container; `prisma migrate deploy` runs
   against it first, so migrations themselves are tested on every run.
3. **build** — `astro build` (static bundle) + `docker build` of both
   images (not pushed on PRs).
4. **RTL check (ADR 0011's CI consequence)** — serve the built bundle in
   the runner; Playwright 1.61 (Q38) asserts a translated-article fixture
   renders `html[lang="he"][dir="rtl"]`, checks original-author credit is
   present, and compares an RTL screenshot baseline.

**`deploy.yml`** — on main (app paths) after ci passes, or manual dispatch:
5. **image build/push** — buildx arm64; tags = git SHA + `latest`; push to
   ECR, authenticated via GitHub OIDC federation (no long-lived AWS keys) —
   ECR near-$0 at this scale, same-region pulls free (Q36).
6. **migrate** — `prisma migrate deploy` against the production DB before
   the new containers roll (Q24: exact current CI guidance flagged
   unverified; re-verify at scaffold — see phase2-scaffold-plan.md).
7. **deploy** — SSH to the instance: `docker compose pull`,
   `docker compose up -d`, then an authored health check (curl the site and
   the API health endpoint); on failure, redeploy the previous SHA tag
   (rollback is a tag, because images are immutable).

**`backup.yml`** — scheduled (cron):
8. **backup** — SSH: `pg_dump` from the `db` container, upload to a
   versioned S3 bucket with lifecycle expiry. Living in the repo keeps the
   backup story visible as part of the exhibit; honest limitation: if
   Actions is down at cron time, that backup is skipped (acceptable at this
   stakes level, stated plainly).

## 6. Cloud target and deploy shape

- **Instance: EC2 `t4g.micro` (arm64, 1GiB), ~$6.13/mo on-demand (Q29).**
  Chosen over Lightsail nano ($5, 512MB — Q28) because 512MB is genuinely
  tight for Node + Postgres + Caddy, and because plain EC2 exercises the
  more representative AWS surface (VPC, security groups, IAM, key
  management) that ADR 0012(d) exists to demonstrate — $1.13/month buys
  both. Free-tier credits (Q29) may apply initially; the budget assumes
  they don't.
- **Registry: ECR** (Q36) via OIDC, per §5. GHCR was rejected as primary
  because its free tier is an explicitly revisable policy, not a contract
  (Q35) — documented as fallback only.
- **DNS: Route 53** hosted zone, $0.50/mo (Q31 — secondary-sourced,
  non-decisive at this magnitude). **TLS: Caddy automatic HTTPS** (Q37) —
  no certificate ops, renewal is the proxy's job, which is a deliberate R4
  purchase.
- **Database fallback:** Neon free tier (real Postgres, scale-to-zero,
  sub-second resume — Q33, high confidence) is the named escape hatch if
  instance memory pressure ever forces the DB off-box. Not primary: it
  outsources exactly the DB ops ADR 0012 wants demonstrated.
- **Budget:** ≈ $6.63/mo (instance + hosted zone) + S3 backup pennies.
  **Flagged, not asserted:** AWS public-IPv4 address billing was NOT
  covered by verification-report.md and may add ~$3–4/mo; verify at
  scaffold time (phase2-scaffold-plan.md §6). Even at the pessimistic end
  the total stays ≈ $10–11/mo, inside G6's $15 with headroom.

## 7. Explicitly out of scope

- **Comments** — deferred by Tal; headroom designed (§2), feature and its
  moderation cost deliberately unpriced until it lands.
- **Third-party trackers/analytics** — excluded permanently; first-party
  analytics is the point (§2).
- **RDS** — rejected at this scale (dominated on cost and fit; §2 of
  evaluation.md); revisitable only as a deliberate new decision with a new
  budget.
- **SQLite-class storage** — set aside on verification grounds
  (node:sqlite RC, Q26; Litestream unverified, Q27).
- **Search, webmentions, comment rendering** — possible honest future
  extensions; nothing depends on them.
- **@astrojs/node adapter / server islands** — not in the design; the
  static core has no adapter. Recorded because the earlier exploration
  considered it: the separate-API shape won on content survivability and
  on the API being itself a from-scratch exhibit artifact.

## 8. Carried-forward gotchas and scaffold-time verifications

Still-true, re-verified gotchas (ADR 0003 lineage): @astrojs/tailwind is
deprecated — Tailwind 4 via `@tailwindcss/vite` (Q3, Q7); content entries
expose `id`, `render()` from `astro:content` (Q6); Node ≥ 22.12 (Astro
install docs, fetched 2026-07-21); never use bash brace expansion for
directory creation. New for Astro 7: Vite 8 + Rolldown + Rust compiler (Q5)
— plugin-ecosystem compatibility must be checked, not assumed.

Open verifications (owned by phase2-scaffold-plan.md): Astro 7.x
integration compatibility ranges (Q9 — npm 403s blocked confirmation);
current `prisma migrate` CI guidance (Q24); public-IPv4 billing (§6); QEMU
arm64 build times on free runners (§5).
