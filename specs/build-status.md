# Build status — what exists, what does not

Last checked against the repo: **2026-07-24**, at `caf4419` on `main`.

Every other file in `specs/` records a decision and changes only when the
decision changes. This one records mutable state, which is why it is separate:
**it is updated in the PR that changes what it records.** If it disagrees with
the repo, the repo wins and this file is wrong — a stale status page
misinforms exactly like a stale colophon (`routes/sitemap.md` §2 row 9).

It answers "where did we stop", nothing more. The *why* of every row lives in
the file the row points at.

## 1. Public routes

Rows follow `routes/sitemap.md` §1. "Landed in" is the PR number.

| Route | Brief | Built | Landed in |
|---|---|---|---|
| `/` | `pages/home.md` | yes | #16 |
| `/writing/` | `pages/writing-index.md` | yes | #17 |
| `/writing/[id]/` | `pages/writing-article.md` | yes | #17 |
| `/he/writing/` | `pages/translations-index.md` | yes | #17 |
| `/he/writing/[id]/` | `pages/translations-article.md` | yes | #17 |
| `/projects/` | `pages/projects-index.md` | yes | #18 |
| `/projects/[id]/` | `pages/project-detail.md` | yes — route generated only for entries with a body (sitemap row 7) | #18 |
| `/about/` | `pages/about.md` | **no** | — |
| `/colophon/` | `pages/colophon.md` | **no** | — |
| `/contact/` | `pages/contact.md` | **no** | — |
| `/404` | `pages/not-found.md` | yes | #16 |
| `/he/404` | `pages/not-found.md` | yes — Caddy `handle_errors` serves it for `/he/*` (sitemap row 11b's owed verification, discharged) | #16 |
| `/rss.xml`, `/he/rss.xml` | sitemap row 12 | yes | #17 |
| `/sitemap-index.xml` | sitemap row 13 | yes — `@astrojs/sitemap`, no hreflang alternates, `/he/404/` filtered out | #10 |
| `/he/` → `/he/writing/` | sitemap row 14 | yes — `redirects` in `web/astro.config.mjs` | #17 |

Three page briefs remain unbuilt: about, colophon, contact. Nothing else in
`pages/` is outstanding.

**All three content collections are empty.** `web/src/content/` holds no
entries, so `astro build` currently emits **6 pages**: the three indexes in
their empty states, both 404s, and home. Every `[id]` route above is
implemented and generates zero pages until content lands — the templates are
exercised by nothing but the build. Read "built" in this table as *the route
exists and is spec-complete*, not as *a visitor can see a filled page*.

**Not routes, recorded so their absence is not mistaken for an oversight:**
`/admin`, `/admin/*` (private, API-served — sitemap row 15) and `/api/v1/*`
(row 16) are covered in §2.

## 2. API

`api/src/` is `app.ts` + `server.ts` + `app.test.ts`. The v1 router exists and
every endpoint below it is mounted to a `notImplemented` handler, so the
contract's shape is testable while nothing behind it is real.

| Surface | Built | Note |
|---|---|---|
| `GET /healthz` | yes | the deploy health check depends on it (`architecture.md` §5) |
| `POST /api/v1/view-events` | stub | route mounted, handler `notImplemented` |
| `GET`/`POST /api/v1/reactions` | stub | same |
| `POST /api/v1/auth/login`, `/auth/logout` | stub | same; the checks auth must satisfy are `security-requirements.md` §B |
| `/admin`, `/admin/*` | **no** | server-rendered, session-gated; nothing built |
| Prisma schema + first migration | yes | committed at scaffold (#10) |

No page currently calls the API. The dynamic layer is progressive enhancement
by design (`content-model.md` §6), so the site is complete without it.

## 3. CI

One workflow, `.github/workflows/ci.yml`, job `checks`. Numbering is
`ci-obligations.md`'s.

| # | Obligation | Built |
|---|---|---|
| 1 | Typecheck — `tsc --noEmit` (api) + `astro check` (web) | yes |
| 2 | API tests against a `postgres:18.4-alpine` service container, migrations applied first | yes |
| 3 | Build — `astro build` + both docker images, not pushed on PRs | yes (+ Caddyfile validation) |
| 4 | Playwright RTL stage, five assertions | **no** |
| 5 | Contrast gate at full precision | **no** |
| 6 | Token parity between theme blocks | **no** |
| 7 | Banned-vocabulary grep over shipped CSS/JS/HTML | **no** |
| 8 | No-raw-hex lint | **no** |
| 9 | Workflow-lint for the `paths:` filters | **no** |
| 10 | `perf` (Lighthouse vs. budgets) + `bundle` stages | **no** |
| 11 | `sec` stage (dependency audit + secrets scan) | **no** |

Obligations 4–11 land with the features they check, not as a batch.
`deploy.yml` and `backup.yml` do not exist yet — both are downstream of §4.

**Live repo settings that will bite before any of this runs:** third-party
actions are blocked (`allowed_actions: selected`, `patterns_allowed: []`) and
`sha_pinning_required` is on. Any workflow needing a non-GitHub action must
have it allowlisted and SHA-pinned first, or it fails with an opaque
permissions error. `main` currently requires **zero** status contexts — CI
green is a habit, not an enforcement, until the `checks` context is re-added
as required.

## 4. Cloud

**Nothing is provisioned.** Both gates in `scaffold-plan.md` §6 are still
closed, and they are Tal's calls, not build work:

1. **The domain** — unchosen, unregistered. `web/astro.config.mjs` carries
   `site: 'https://tbendet.example'` as a placeholder, which the RSS feeds and
   the sitemap both bake into absolute URLs.
2. **The region** — chosen against the Israeli audience, then re-verify
   `t4g.micro` + public-IPv4 pricing against the $15/mo ceiling before
   provisioning anything.

Everything after those two — Route 53 zone, EC2 instance, Docker on the
instance, ECR repos, the OIDC role, the S3 backup bucket, first deploy — is
unstarted, in the order `scaffold-plan.md` §6 gives.
