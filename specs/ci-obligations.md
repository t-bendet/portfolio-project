# ci.yml — the full obligation set

Compiled at the blueprint gate (originally scattered across five documents;
`ci.yml` is a single authored artifact and a missing stage is a silent gap).
Updated 2026-07-23 for the simplified repo: the workshop-machinery job is
retired with the workshop.

1. Typecheck: `tsc --noEmit` (api) + `astro check` (web).
2. API tests against ephemeral `postgres:18.4-alpine` with
   `prisma migrate deploy` applied first.
3. Build: `astro build` + both docker images, not pushed on PRs.
4. Playwright RTL stage, **five** assertions (`content-model.md` §5):
   - `html[lang="he"][dir="rtl"]` on the fixture translated-article route;
   - credit block complete **and states it is a translation** **and
     precedes the article body**;
   - code panels render LTR;
   - screenshot baseline;
   - no horizontal overflow.
   Also assert the **real 404 status** (not just the page body) for both
   `/404` and `/he/404` once the Caddy image is in the loop.
5. Contrast gate over `design/palette.md` §5's pairs at **full precision**
   (thinnest margin is 4.50 — rounding can pass a failing pair). The old
   workshop had `scripts/contrast.ts` for this; restore it from git history
   or reimplement in workspace tooling.
6. Token parity: both theme blocks' key sets diff empty
   (`design/tokens.md` §4.1).
7. Banned-vocabulary grep over shipped CSS/JS/HTML — **whole identifier
   tokens, not substrings** (`design/tokens.md` §1; `sitemap.xml` and
   `[hidden]` are the recorded non-violations). Include the mythology
   figure-name and "let's connect" greps from `brand.md`.
8. No-raw-hex lint — tokens only (`design/tokens.md` §4.4).
9. Workflow-lint for the monorepo `paths:` filters (silently-failing
   filters are the failure mode being guarded).
10. `perf` stage (Lighthouse against budgets) + `bundle` stage — source of
    truth: `performance-budgets.md`. Budgets are contracts; moving one is a
    deliberate, recorded decision, not a CI tweak.
11. `sec` stage (dependency audit + secrets scan) — source of truth:
    `security-requirements.md` (SR-1…SR-24).
