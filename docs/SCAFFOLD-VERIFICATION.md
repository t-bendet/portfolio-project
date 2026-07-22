# Scaffold-time verification results — 2026-07-22

The seven owed verifications from `phase2-scaffold-plan.md` §0 (five) plus
`completeness-report.md` §2.2 (two carried from M4). Run as one
`docs-explorer` batch per `phase2-workflow.md` §5, before anything installs.
Work item: `infra/scaffold-verification`, review class Routine (research
only; no code, no dependencies added).

The scaffold plan is a frozen closed-mission output (ADR 0028) and cannot be
edited. **This file is the correction layer the executor reads alongside it**,
in the same role as `completeness-report.md` §2.1.

Every figure below is a 2026-07-22 fetch. Re-pin at install time if this
document is more than a few days old — the plan's own standing rule.

---

## 1. Astro 7.x integration compatibility — CORRECTS, one item unconfirmed

| Package | Current | Verdict |
|---|---|---|
| `astro` | **7.1.3** (2026-07-20) | plan guessed 7.0.9 — stale |
| `@astrojs/mdx` | **7.0.3** | peer `astro:^7.0.0` — compatible |
| `@tailwindcss/vite` | **4.3.3** | peer `vite:^5.2\|\|^6\|\|^7\|\|^8`; Astro 7 bundles Vite 8 — compatible |
| `@astrojs/sitemap` | **3.7.3** | **UNCONFIRMED against Astro 7** |

`@astrojs/sitemap` 3.7.3 published ~2 months ago, pre-dating Astro 7's
2026-06-22 launch. It declares **no** `peerDependencies` field and its own
devDependency pins `astro@6.3.8` — so it is neither declared-incompatible nor
tested against 7.x. **Action at install: add it, run `astro build`, and
confirm `sitemap-index.xml` emits.** If it breaks, check for a newer or beta
release before working around it.

Node engine (registry-authoritative): `node >=22.12.0`, `pnpm >=7.1.0`.
Node 24 LTS satisfies this — plan's precondition CONFIRMED.

`astro add tailwind` on current Astro installs the `@tailwindcss/vite` path,
not the deprecated `@astrojs/tailwind` — CONFIRMED, either route is fine.

Source: `registry.npmjs.org/{astro,@astrojs/mdx,@astrojs/sitemap,@tailwindcss/vite}/latest`.

## 2. `prisma migrate` CI guidance — CONFIRMS

- `prisma migrate deploy` remains the documented CI/CD and production
  command; `migrate dev` is dev-only.
- **No shadow database** is used by `migrate deploy` — the shadow DB is a
  `migrate dev` concern. The plan's CI stage is correct as written.
- **Advisory lock:** `migrate deploy` takes one, with a **10s timeout that is
  not configurable**. Concurrent deploys can fail on it. Escape hatch:
  `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK` (since 5.3.0) — worth knowing before
  debugging a hung pipeline, not worth setting pre-emptively.
- No Prisma-7-specific change to this flow. Current: **prisma 7.9.0**.

Source: prisma.io/docs (shadow-database; deploy-database-changes-with-prisma-migrate),
prisma/prisma#27636, #14454.

## 3. AWS public-IPv4 billing — CONFIRMS the risk; budget moves

- **$0.005/hr per public IPv4**, charged for both in-use and idle addresses,
  uniformly across commercial regions. Applies to an auto-assigned public IP
  **and** to an in-use Elastic IP alike. ≈ **$3.65/mo**.
- **Free-tier exemption exists but is time-boxed:** 750 hrs/mo free public
  IPv4, only for accounts in their **first 12 months**. Not permanent. The
  budget must assume it does not apply.
- `t4g.micro` us-east-1: **$0.0084/hr = $6.132/mo** — matches the plan.

**Budget correction to `architecture-decision.md` §6 / ADR 0021:**

| Line | Was | Now |
|---|---|---|
| Instance `t4g.micro` | $6.13 | $6.13 (confirmed) |
| Route 53 hosted zone | $0.50 | $0.50 |
| Public IPv4 | flagged, ~$3–4 | **$3.65 (confirmed, assume no exemption)** |
| **Total** | ≈$6.63 (+flag) | **≈$10.28/mo** + S3 backup pennies |

Inside G6's $15 ceiling with ~$4.70 headroom. The pessimistic estimate the
plan carried was right; it is now a number rather than a flag. No design
change — this does **not** trigger the §7 "blueprint is wrong" checkpoint.

**Owed, not obtained:** `eu-central-1` `t4g.micro` pricing. The AWS pricing
page renders region data via JS and cannot be fetched statically. If the
region choice (G-4, Tal's) lands on eu-central-1, check the AWS Pricing
Calculator by hand before provisioning.

Source: aws.amazon.com/vpc/pricing/, AWS free-tier IPv4 announcement (2024-02).

## 4. QEMU arm64 build times — CORRECTS THE APPROACH

The premise is obsolete. **Do not cross-build arm64 under QEMU emulation at
all.** GitHub-hosted **native arm64 runners** are now GA:

- Public repositories: GA since **2025-08-07** (`ubuntu-24.04-arm`,
  `ubuntu-22.04-arm`), within standard included minutes.
- Private repositories: GA since **2026-01-29**, billed at the standard
  arm64 rate — **$0.005/min** for the 2-core runner, confirming the plan's
  figure. Larger arm64 runners run $0.008–$0.098/min.

For reference, the emulation penalty the plan feared is real (4–5× reported;
one documented case 15min → 2min after dropping QEMU) — which is precisely
why the native runner is the answer.

**Change to the pipeline:** in `ci.yml` / `deploy.yml`, build the arm64
images on `runs-on: ubuntu-24.04-arm` rather than `docker/setup-qemu-action`
+ buildx cross-emulation. This repo is public, so the build is inside
included minutes. The plan's "if builds exceed 10–15 min, evaluate paid ARM
runners vs building on the instance" decision is **dissolved, not answered** —
neither branch is needed.

Source: github.blog/changelog 2025-08-07 and 2026-01-29;
blacksmith.sh multi-platform-arm64 writeup.

## 5. Fresh patch pins — pin these, from lookups, at install

| Package | Pin | Note |
|---|---|---|
| `astro` | **7.1.3** (2026-07-20) | was 7.0.9 in the plan |
| `@tailwindcss/vite` | **4.3.3** | |
| `prisma` | **7.9.0** (~2026-07-21) | |
| `@playwright/test` | **1.61.1** (2026-06-23) | plan's 1.61 family confirmed |
| `caddy` | **2.11.4** (2026-06-03) | plan's 2.11 family confirmed |
| `postgres` image | **`18.4-alpine`** | `postgres:18` → 18.4 (Debian/Trixie); `18-alpine` → 18.4-alpine |
| `express` | **5.2.1** | dist-tag latest; **release date UNCONFIRMED** |

`express@5.2.1` satisfies the "Express-5-class, pinned from a lookup"
decision rule (`architecture-decision.md` §1). The npm registry API is the
authoritative source here; a GitHub-releases fetch returned contradictory
stale data (v4.22.2). Re-check github.com/expressjs/express/releases by hand
if the exact release date matters — it does not for the pin.

## 6. Caddy `handle_errors` on `/he/*` with a real 404 status — CONFIRMS, untested

Achievable, and the mechanism is broader than assumed: `handle_errors`
supports **named/expression matchers**, so the error page can be selected by
**path prefix + status**, not status alone.

```caddyfile
handle_errors {
	@he_404 expression {http.request.uri.path}.startsWith(`/he/`) && {err.status_code} == 404
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

`{err.status_code}` is the current short-form placeholder (valid only inside
`handle_errors`); `{http.error.status_code}` is the documented long form.
`rewrite` + `file_server` inside `handle_errors` serves the body while
Caddy's error pipeline preserves the real non-200 status — satisfying
`not-found.md`'s hard requirement that **both** error pages return a genuine
404.

**Not compile-tested.** Run `caddy validate` against the real Caddyfile
before trusting it, and assert the status code (not just the body) in the
CI RTL stage.

Source: caddyserver.com/docs/caddyfile/directives/handle_errors, /matchers;
caddyserver/caddy#5928.

## 7. Glob loader raw `body` at `getStaticPaths` time — CONFIRMS

**Yes.** Glob-loaded entries expose raw markdown as `entry.body`, populated
at collection-load time (`retainBody: true` is the default) and available
from `getCollection()` **before** any `render()` call — therefore visible
inside `getStaticPaths()`. Only a custom loader setting `retainBody: false`
would remove it.

The `caseStudy`-vs-empty-body build guard (ADR 0024, `content-model.md` §3)
is therefore directly implementable, with no source-file-reading workaround:

```ts
const entries = await getCollection('projects');
for (const e of entries) {
  if (e.data.caseStudy === true && !e.body?.trim()) {
    throw new Error(`caseStudy: true with empty body — ${e.id}`);
  }
}
```

Source: docs.astro.build/en/reference/content-loader-reference/.

---

## What this changes, in one list

1. **Pin Astro 7.1.3**, not 7.0.9 — and all of §5's pins.
2. **Build arm64 natively** on `ubuntu-24.04-arm`; delete the QEMU/buildx
   cross-emulation step from the pipeline plan. (§4)
3. **Budget is ≈$10.28/mo**, not ≈$6.63 — public IPv4 is a real $3.65. Still
   inside $15. (§3)
4. **`@astrojs/sitemap` compatibility is a smoke test at install**, not a
   given. (§1)
5. Use `postgres:18.4-alpine` rather than the bare `postgres:18` tag. (§5)
6. Caddy path-scoped `handle_errors` works — `caddy validate` it, and assert
   the 404 *status* in CI, not just the page. (§6)
7. The `caseStudy` guard needs no workaround. (§7)

## Owed to a human (not blocking §1–§5)

- `eu-central-1` `t4g.micro` price, if G-4 picks that region — AWS Pricing
  Calculator, by hand. (§3)
- `express@5.2.1` release date, if it ever matters. (§5)
