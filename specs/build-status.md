# Build status — what exists, what does not

Last checked against the repo: **2026-08-08**, at `7c6dab0` on `main`.

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
| `/about/` | `pages/about.md` | yes — no portrait and no CV link yet, both by removal rather than placeholder (brief §3); prose written in #22 | #20 |
| `/colophon/` | `pages/colophon.md` | yes — sections 4, 5, 8, 10 only: the layers that are not running yet have no section, per the brief's §4 ("a sentence in the future tense on this page is a bug") | #21 |
| `/contact/` | `pages/contact.md` | yes — openness statement and published address both written in #22 (brief §6) | #21 |
| `/404` | `pages/not-found.md` | yes | #16 |
| `/he/404` | `pages/not-found.md` | yes — Caddy `handle_errors` serves it for `/he/*` (sitemap row 11b's owed verification, discharged) | #16 |
| `/rss.xml`, `/he/rss.xml` | sitemap row 12 | yes | #17 |
| `/sitemap-index.xml` | sitemap row 13 | yes — `@astrojs/sitemap`, no hreflang alternates, `/he/404/` filtered out | #10 |
| `/he/` → `/he/writing/` | sitemap row 14 | yes — `redirects` in `web/astro.config.mjs` | #17 |

**Every page brief in `pages/` is now built, and every route carries real
copy.** No `TODO(Tal)` slot remains: meta descriptions, both 404 statements,
the standing descriptions and empty-state terms, the about prose, the contact
openness statement, and both feed channel descriptions are written. The
contact address is `talbendet21@gmail.com` (Tal's call, 2026-08-05).

**What is provisional rather than missing:** every Hebrew string is drafted
and marked `REVIEW(Tal)` — `/he/writing/`, `/he/404`, `/he/rss.xml`, and both
credit lines in `/he/writing/[id]/`. Tal is the native speaker and the voice
owner; the structure around those strings is binding, the wording is not.
The credit trio (states it is a translation · names the author · links the
original) is a licence condition and survives any rewrite
(`translations-checklist.md`).

**The one sentence with a maintenance contract** is the availability line in
`/about/`'s "the work". It is maintained by editing, which is the trade
`pages/about.md` §2.3 chose over a status badge that goes stale silently.

`/colophon/` carries a further obligation the others do not: it describes
what is running, so it grows a section — dynamic layer, containers and
deploy, monthly cost — when each of those starts running, and its review date
moves when it is actually re-read. Today it is at `2026-08`.

**All three content collections are empty.** `web/src/content/` now exists —
one directory per collection, each holding only a `.gitkeep` — so `astro build`
currently emits **9 pages**: the three indexes in
their empty states, both 404s, home, about, colophon, and contact. Every
`[id]` route above is implemented and generates zero pages until content
lands. Read "built" in this table as *the route exists and is spec-complete*,
not as *a visitor can see a filled page*. Of the three, only
`/he/writing/[id]/` is exercised by anything beyond the build: CI's RTL stage
renders it from a fixture (§3). The other two templates have never had a page
made out of them.

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

Two workflows. `.github/workflows/ci.yml`, job `checks`, carries everything
below except the secrets scan, which is `.github/workflows/sec.yml`, job
`secrets`. Numbering is `ci-obligations.md`'s.

| # | Obligation | Built |
|---|---|---|
| 1 | Typecheck — `tsc --noEmit` (api) + `astro check` (web) | yes |
| 2 | API tests against a `postgres:18.4-alpine` service container, migrations applied first | yes |
| 3 | Build — `astro build` + both docker images, not pushed on PRs | yes (+ Caddyfile validation) |
| 4 | Playwright RTL stage, five assertions | yes — `web/tests/e2e/rtl.spec.ts`, nine tests, plus both 404 statuses |
| 5 | Contrast gate at full precision | yes — `scripts/contrast.ts`, 73 pairs |
| 6 | Token parity between theme blocks | yes — `scripts/token-parity.ts` |
| 7 | Banned-vocabulary grep over shipped CSS/JS/HTML | yes — `scripts/banned-vocab.ts`, over `web/dist` |
| 8 | No-raw-hex lint | yes — `scripts/no-raw-hex.ts`, over `web/src` |
| 9 | Workflow-lint for the `paths:` filters | **dormant** — no filter is left to lint (below); `ci-obligations.md` holds it under "Dormant" |
| 10 | `perf` (Lighthouse vs. budgets) + `bundle` stages | yes — `scripts/perf-budgets.ts` + `web/tests/perf/` + `web/tests/run-perf.sh`. One caveat that is in the spec, not hidden here: §2's CLS row is measured and printed but not enforced, because `/` does not meet it |
| 11 | `sec` stage (dependency audit + secrets scan) | yes — `scripts/sec.sh`, split across both workflows |

The §3 rows for features that do not exist (hero typing, view beacon,
reactions) get no gate until they do — the gate asserts they measure zero and
prints them as unbuilt on every run. `deploy.yml` and `backup.yml` do not exist
yet — both are downstream of §4, and if either arrives carrying a `paths:`
filter, obligation 9 comes back with it.

**A green `checks` run took about 2m12s** — measured on PR #35 (2026-08-07)
and again at 2m13s on PR #37 the next day, so it was a figure with two runs
under it rather than one. `secrets` reports in 9–11s. **That figure predates
the perf stage.** The byte half measured 1m58s on PR #38, i.e. inside the noise
of the old number. The browser half is the real addition: locally it is about
100 seconds — a Caddy container, twelve Lighthouse passes and three Playwright
tests — so expect something near 4 minutes, and replace this sentence with the
measured figure rather than this estimate once CI has published one. That is a cold number,
because nothing in either workflow caches anything, and a small one mostly
because the content collections are empty, so `astro build` is a fraction of a
second of it. It will grow with content. `timeout-minutes: 15` is a runaway
guard, not an estimate: a run sitting at exactly fifteen minutes is the timeout
firing on a job that never got a runner (below), not work being done.

**The RTL stage (4) runs on a fixture, not on content**, because there is no
translation to run it on and inventing one would be publishing a translation
of nothing. `web/tests/fixtures/translations/rtl-fixture.md` is copied into the
collection by `web/tests/install-fixtures.ts` for that build alone; the copy is
gitignored and dockerignored, and the step runs after the build, the
banned-vocabulary gate and both image builds, so nothing that ships has ever
seen it. A fixture also keeps the screenshot baseline still: real content would
re-baseline the page every time a sentence changed.

It serves the built site through the **real** `deploy/Caddyfile` in
`caddy:2.11.4` and runs the suite from `mcr.microsoft.com/playwright` — both
pinned images, no new action to allowlist — so the same command
(`pnpm --filter web test:e2e`) produces the same pixels on CI and on a laptop.
The Playwright image tag and `@playwright/test` must be bumped together.

Two defects it found on its first run, both invisible to every gate that
preceded it:

- `handle_errors` rewrote `/he/*` 404s to `/he/404.html`, which the build has
  never emitted — under `trailingSlash: 'always'` the file is
  `he/404/index.html`. The status was right and the body was empty, which is
  exactly the failure the "assert the *status*, not just the body" note in
  `scaffold-plan.md` §0 was watching for, inverted.
- The in-page contents column was named `.contents`, and Tailwind generates
  `.contents { display: contents }` for any bare token it finds in a class
  attribute. The nav stopped being a grid item and its heading list was
  auto-placed at the foot of the page. Renamed `.article-contents`; component
  classes do not use bare utility words.

**A cascade-layer defect the RTL stage could not have caught**, fixed
separately from the work that found it. `web/src/styles/global.css` imports
Tailwind, which establishes the layer order `theme, base, components,
utilities`. Its own element rules — `html`, `body`, `main`, `a`, `pre`/`code`,
`:focus-visible`, the theme-transition rule — were **unlayered**, and
unlayered CSS beats every layer regardless of specificity. So any Tailwind
utility placed on an anchor (`no-underline`, `text-muted`, …) was generated,
matched, applied, and then silently lost to `a { text-decoration: underline }`.
Nothing in the markup would have suggested why, and no gate looks at
precedence.

Those rules now sit in `@layer base`, which puts them back underneath the
utilities. Nothing else moves: each one already lost to any class rule on
specificity, and the component stylesheets stay unlayered, so their precedence
over base is unchanged. `.shell` and `.skip-link` stay unlayered deliberately
— they are component classes, and layering them would flip them under every
utility. Verified behaviour-neutral: all four gates, `astro check`, the RTL
stage with its checked-in baseline **unchanged**, and a 156-screenshot
full-site diff (every page × both temperatures × 480/800/1280) at
`maxDiffPixels: 0`.

This matters now because it is a prerequisite: it is not possible to adopt a
single Tailwind utility anywhere on the site until it is true.

**The four design gates (5–8)** are dependency-free scripts in `scripts/`, run
by `node`'s own type stripping — no new action to allowlist, nothing installed.
They pass on the tree as it stands; this was enforcement arriving, not
violations being fixed. Two scope decisions are worth knowing before reading a
future failure:

- **5** parses `design/palette.md` §5 rather than a checked-in pairs file, and
  cross-checks every named token against `web/src/styles/tokens.css` — so a
  nudge applied to one file and not the other fails. It also compares each
  row's stated ratio against the computed one, which makes the spec's own
  tables self-checking.
- **7** greps `web/dist` (what ships, asset names included); **8** lints
  `web/src` with `tokens.css` as its single allowlisted file. Splitting them
  that way keeps Tailwind preflight's hexes — not ours — out of the hex lint
  without an allowlist that would grow into a hiding place.

**The perf and bundle stages (10) run on the fixture corpus, in their own
harness.** `web/tests/run-perf.sh` installs the fixtures, rebuilds `web/dist`
with them, runs `scripts/perf-budgets.ts` against that build, serves it through
the real `deploy/Caddyfile` on its own network and port, runs Lighthouse (§2)
and the idle-cost check (§3) against that, then removes both the fixtures and
the build. `--bytes-only` is the docker-free half, and the half `check.sh`
runs. It is a second harness rather than a flag on
`run-e2e.sh` because the obligation numbers are identifiers cited from step
names, and a budget breach reporting as an RTL failure is the silent gap the
list exists to prevent.

Three writing fixtures were added for it — `/writing/[id]/` is one of the four
routes `performance-budgets.md` §8 names and the collection is empty. Three
because `/`'s recent column is built for three entries and the article
template's siblings block needs two others; one fixture would have measured a
shape the site will never ship in. They cannot move the RTL baseline:
`he/writing/[id].astro` reads `translations` only.

The gate parses its budgets out of `performance-budgets.md` §3/§4.1/§4.1a/§5
rather than restating them, the way `contrast.ts` parses `palette.md` §5 — which
is why that PR gave those tables a machine-readable Routes column and promoted
§4.1's per-file caps out of a sentence into §4.1a. No number moved. The spec
also gained the units it had never stated and the gate could not be written
without: KB is 1000 bytes, and HTML/CSS/script blocks are measured at gzip
level 6, Caddy's `encode gzip` default, so the figure models the transfer
rather than the best case.

Two things it is worth knowing the gate does *not* do. It does not add the
inline script's bytes to a page's total — those bytes are inside the HTML it
already counted, and §3 charges the extracted block separately. And it does not
treat "zero .js assets" as a rule: a future hero-typing script written without
`is:inline` becomes a real asset that §3 legitimately budgets, so the count is
reported as a fact and the *inventory* is what fails.

**Lighthouse runs without an action and without downloading a browser.**
Playwright launches the pinned image's own Chromium with a CDP port and
Lighthouse attaches to it; `lighthouse` is a devDependency of `web/`, pinned
exact at 13.4.1 the way `@playwright/test` is, because the metric values are the
contract. `chrome-launcher` — Lighthouse's own default — is deliberately not
used: it is a transitive dependency and not resolvable from `web/` under pnpm's
strict layout. The config is Lighthouse's default, unrestated, because that
default *is* mobile form factor, Slow-4G and simulated throttling — §2's "lab,
throttled mobile" exactly.

Simulated throttling rather than devtools throttling, and the measurement
justifies it: **across twelve runs the LCP spread was 4 ms.** Lantern runs the
page once and computes metrics from the trace's dependency graph, so the number
barely moves with runner contention, which is the failure mode that kills a gate
on a required context. Median-of-3 is kept as insurance until CI publishes its
own spread; on that evidence a single run may well be enough.

**§2's CLS row is measured, printed, and not enforced, and `/` is why.** Seven
runs give a median of 0.0201 against the 0.02 budget with a spread of 0.0004 —
straddling it rather than clearing it, while every other route measures 0.000.
Lighthouse attributes it to the hero mark's spans and the header nav items: it
is font-swap reflow. The budget was not moved and the `fallbacks: []`
correctness invariant was not traded away for it — Astro's default fallback face
carries Hebrew glyphs with no `unicode-range`, so adopting it would stop Hebrew
reaching Heebo. §2 carries the reasoning, the open fix (a hand-written
metric-adjusted `@font-face` for Syne and DM Mono, latin-scoped) and the
condition for flipping the row back on. The stage prints the breach on every run
so it cannot go quiet.

**The idle-cost check is three tests, and one of them is the reason to trust the
other two.** `/` and the article fixture must show zero pending timers, zero
intervals, zero animation frames and zero long tasks after load plus a
three-second settle. The third test types the incantation and asserts the
instrumentation *counted* the one timer `apply()` starts — because §3's sentence
is "unmeasurable when not in use", not "contains no timers", and an idle
assertion that has stopped observing anything passes loudest. It counts
scheduled timers rather than catching a pending one: the transition's timer is
600 ms long and an assertion round-trip can lose that race, which it did on the
first run.

**`web/dist` is now removed by both harnesses on the way out.** It is a fixture
build by the time either finishes, and `banned-vocab.ts` greps `web/dist` — a
fixture build left behind is output that does not ship being read as output
that does. `run-e2e.sh` had that hazard since it was written and never tripped
it; it was fixed alongside the stage that would have doubled the chances.

**`ci.yml` no longer has `paths:` filters, and that is what made SR-18
possible.** A required status context that never reports does not skip — it
blocks, permanently. So requiring `checks` while `ci.yml` was paths-filtered
would have made any PR touching only `README.md`, `LICENSE`, `CLAUDE.md`,
`.gitignore` or `sec.yml` unmergeable, waiting on a run that GitHub was never
going to start.

The filter was removed rather than worked around. The alternative considered
was a `changes` guard job — no top-level filter, a first job diffing against
the base ref, `checks` gated on its output, relying on a skipped job counting
as success for branch protection. It preserves the runner minutes and costs a
reimplementation of path matching in bash, which is the *exact* silently-failing
failure mode obligation 9 exists to guard. Tal chose the filter's removal
(2026-08-06): a doc-only PR now pays a full run — Postgres, both image builds,
Playwright — and doc-only PRs are rare here. The `concurrency` group already
cancels superseded pushes.

Two consequences worth carrying forward. The filter had been widened to
`scripts/**` and `specs/**` because the contrast gate reads
`specs/design/palette.md` — that widening is now moot along with the rest.
And obligation 9 has nothing left to lint: it is dormant, not discharged, and
now lives in `ci-obligations.md`'s "Dormant" section under its original number
— the obligation numbers are cited from workflow step names, script headers
and test files, so they are identifiers, not an ordering.

**The sec stage (11) is split across two workflows.** The split was made when
`ci.yml` was paths-filtered and `sec.yml` was the only way to satisfy SR-17's
"every PR". That reason is gone, and the split stays anyway, for a different
and better one: SR-17 is a claim about the whole tree on every PR, and keeping
the scan in a workflow that has never had a filter makes it true structurally
rather than as a consequence of what `ci.yml`'s triggers happen to be today.
`sec.yml` must still never gain a filter — it is a checkout and a container,
well under a minute. It is also its own status context, so it reports in
seconds rather than behind a full `checks` run. The dependency audit
stays in `ci.yml`, where the lockfile is already covered. Both halves are
`scripts/sec.sh`, runnable locally like the design gates.

- **Secrets scan** — `gitleaks` as a pinned image (`v8.30.1`), not the action:
  only github-owned actions are allowed here. It scans the working tree, not
  the history, because `.env` is instance-local by decision and a PR checkout
  is shallow enough to make a history scan a check that examines almost
  nothing. `--redact` keeps a finding out of a public repo's log.
- **Dependency audit** — SR-21's policy exactly: `--prod --audit-level high`
  fails, a full audit above it warns. Deliberately no
  `--ignore-registry-errors`; a gate that passes because it could not reach
  the registry is worse than a red run.

**A third override landed 2026-08-07, from a different chain.**
GHSA-5p4m-2wfm-xmqj (js-yaml <4.3.1, quadratic CPU on `!!omap`) is reachable
through `web > @astrojs/mdx > @astrojs/internal-helpers` — production, high,
eleven paths, so the audit half of the gate went red on a tree nobody had
touched. It is unrelated to whatever PR happens to be open when an advisory
publishes, which is the point of the gate.

The instructive part is the first attempt. Written as `js-yaml: '>=4.3.1'` — the
open form the two existing overrides use — it resolved to **5.2.3**, a major
that dropped the default export `@astrojs/internal-helpers` imports, and
`astro build` died at module instantiation. **The audit passed while the build
was broken:** the gate reads versions, not semantics, so an override is exactly
as capable of breaking the tree as of fixing it. Caret-bounded to `^4.3.1` and
verified by the build rather than by the audit. The other two overrides carry
the same latent risk and are left alone because they are working; the note is
in `pnpm-workspace.yaml` for whoever writes the fourth.

**The fourth landed 2026-08-08, and the note did its job.**
GHSA-2v37-7h3g-55p8 (nanoid <3.3.17, a custom generator looping forever when
size is zero) arrives through `vite > postcss` — production, high, five paths,
reached from both `@astrojs/mdx > astro` and `@tailwindcss/vite`, so it is the
first advisory to come down two routes at once. Same shape as the third
otherwise: a green `main` went red under a docs-only PR that touched no
dependency. Caret-bounded to `^3.3.17` on sight, and the numbers say that was
not caution for its own sake — postcss asks for `^3.3.16`, the 3.x line ends at
3.3.18, and nanoid's `latest` is 6.0.1, so the open form would have crossed
four majors in one step. Verified by `astro build` and the api suite.

It failed on the tree as it stood, unlike the design gates. `@prisma/client`
is a **production** dependency of `api` and pulls the entire `prisma` CLI
behind it, so `fast-uri` (GHSA-7p8r-x3mc-p8w7, high) was reachable in the
runtime image through `@prisma/dev > @prisma/streams-local > ajv`. Fixed with
an override in `pnpm-workspace.yaml` alongside the `find-my-way` one that was
already there for the same chain — both go when prisma ships a patched one.
The two moderates that remain (postcss, dev-only) are what the warn half is
for.

**Live repo settings that will bite before any of this runs:** third-party
actions are blocked (`allowed_actions: selected`, `patterns_allowed: []`) and
`sha_pinning_required` is on. Any workflow needing a non-GitHub action must
have it allowlisted and SHA-pinned first, or it fails with an opaque
permissions error.

`main` requires **`checks` and `secrets`**, both since 2026-08-06 — CI green
is an enforcement now, not a habit, which discharges SR-18. Two things it does
not do. `enforce_admins` is off, so Tal can still merge past a red run: the
gate is against an unattended session pushing to production, not against Tal's
own judgement, and turning it on would mean no way to land a fix when CI is
broken by something outside the repo. And `strict` is on — a PR must be up to
date with `main` before it merges, which on a solo repo costs a rebase and
buys the guarantee that the run that went green is the tree that landed.

Adding a job to either workflow adds a context that is **not** automatically
required; a new gate is advisory until it is named here and in the console.

**PR #31 was merged with `--admin`, bypassing both contexts.** GitHub Actions
was in a `major_outage`: two runs were created and cancelled after 15 minutes
without ever being assigned a runner, and every later push created no run at
all. Every `checks` step was run locally first — `astro check`, all four
design gates, `api typecheck`, both `docker build`s, Caddyfile validation
against the pinned image, and the RTL stage at 9/9 — and the evidence is in
the PR body. It is still a bypass rather than a green run, and it is recorded
because a gate whose exceptions go unlogged is a gate nobody can audit.

Three separate times on 2026-08-06 an Actions incident made these contexts
unusable — twice red on jobs that never ran a step, once absent entirely. The
gate is worth having; that failure rate is the argument for `enforce_admins`
staying off, and it is a fact about the gate's design rather than bad luck.

**PR #33 was merged with `--admin` on 2026-08-07, under the same conditions.**
GitHub Actions was in `major_outage` (Actions and Pages both, per
githubstatus.com) and **no run was created at all** for the branch — `gh run
list --branch theme-incantation` returned empty, so neither context so much as
appeared. That is the fourth such incident in two days.

Every step of both workflows was run locally first and is listed in the PR
body: the four design gates, `astro check`, `api typecheck`, `prisma migrate
deploy` and the api tests against `postgres:18.4-alpine`, both `docker build`s,
Caddyfile validation against the pinned image, `scripts/sec.sh` end to end
(both halves), and the e2e stage at 19/19 with the RTL baseline unchanged.

Two things worth carrying forward from doing that by hand. Running the sec
stage locally is what **found** the js-yaml advisory above — an outage-driven
manual pass caught something the automated gate would have caught a day later,
and the tree was red before this PR touched it. And reproducing obligation 2
locally needs a non-default port: a host Postgres bound to `127.0.0.1:5432`
wins the loopback race against Docker's wildcard bind, so `migrate deploy`
authenticates against the laptop's own database and fails `P1010` while the
container sits there healthy. That is a laptop-only trap — CI's service
container has no such conflict — but it costs twenty minutes to diagnose the
second time as well as the first.

## 3b. Styling — Tailwind utility migration: done, in one PR

**Evaluated and executed 2026-08-06** on branch `tailwind-utility-migration`,
in seven commits: a token bridge and six waves, each one a rollback unit that
had to reach zero pixel diff before the next began.

### What shipped

| | `main` @ `625fcc7` | after wave 6 |
|---|---|---|
| `web/src/styles/` | 7 files, 1,283 lines | **4 files, 819 lines** |
| scoped `<style>` blocks | 8 files, 445 lines | **0** |
| components | 7 | **30** |
| `class=` attributes | 168 | **120** |
| shipped CSS | 40,329 B | **27,277 B** (−32%) |

`entry-list.css`, `projects.css` and `reference.css` are gone. `global.css`
grew (125 → 261) because it gained the `@theme inline` bridge and the record of
why several things are the way they are. `tokens.css` is byte-identical to
`main` and was verified so after every wave.

**What stays CSS, by design** — this list is the exclusion accounting from
`notes-tailwind-verdict.md` §2, unchanged by the outcome:

- `article.css`'s `.article-body …` descendant rules. The markdown renderer
  emits `h2`, `blockquote`, `pre`, `td` with no class attribute, so there is
  no element in any template for a utility to sit on. A missing mechanism, not
  a preference.
- `.closing-credit` and `.article-body > * + *` are a matched pair — 20px
  between body children, overridden to 56px for the closing credit, resolved
  by source order in one file. Utilities have no source order to rely on.
- `hero.css` — keyframes and the resting-state-first reduced-motion contract.
- `pre`/`code` forced `direction: ltr`, in `@layer base`. An e2e test asserts
  the computed value and Shiki's output carries no class.
- `.note`/`.translator-note*`, applied from MDX by whoever writes an article.
- `.shell` and `.skip-link`, the two surviving component classes. `.shell` is
  the one shared 960px measure on three different elements in three files;
  `.skip-link` is off-screen until focused, which puts it outside what the
  screenshot oracle can check.

### What it cost

Two objections from the analysis stand, and were accepted rather than refuted.
There was **no maintenance problem being solved** — seven commits ever to
`web/src/styles` — and **per-declaration commentary lost its referent**, which
is why every extracted component carries the prose from the rules it replaced.

That commentary has a measurable price. Tailwind's scanner reads `.astro` and
`.ts` whole, comments included, so the dead-rule count went **up** while the
stylesheet shrank by a third: 16 rules / 1,531 B on `main` against 27 / 2,478 B
now. Five of the new ones are real utilities on `/about/`'s portrait and CV
branches, switched off rather than wasted. The other nine were emitted from
comments explaining which utility *not* to write — including a 202-byte rule
for a property named `…`, compiled from `transition-[…]` in a comment.
Roughly 600 bytes bought the explanations. Method and full table in
`notes-tailwind-verdict.md` §4.5.

### Two things a green run does not prove

- **The spacing scale is now rem-based** (`mbs-18` where the rule said 72px).
  Tal ratified this. The oracle runs at a 16px root, where rem and px agree,
  so it cannot police the change — accepted, not overlooked.
- **`/about/`'s portrait and CV never render**, because `web/src/lib/about.ts`
  returns `null` for both. Their utilities were checked by hand against the
  declarations they replace. The oracle covers 94.8% of authored class names;
  this is the rest.

Likewise `[&:hover]:` is mandatory throughout and `hover:` is banned — v4
wraps `hover:` in `@media (hover: hover)`, which would have deleted the site's
hover states on every touch device, and no screenshot reports that either.

### The fidelity harness, if it is still on disk

`web/.fidelity/` is untracked and gitignored (see `.gitignore` for what it
holds and why). It is a local tool, not part of the build — but while it
exists it is the only thing that can prove a CSS change moved nothing.

```bash
node web/.fidelity/run.mjs --mode=compare    # both passes, 156 screenshots
```

**Never run it with `--mode=capture` on a branch.** Capture writes the
baselines rather than checking against them, so it overwrites the reference
images with screenshots of whatever is currently checked out. Every comparison
after that is the change measured against itself, and passes. Nothing reports
this — a destroyed oracle and a correct one both print the same green.

The baselines on disk were captured from clean `main`. If they are ever
genuinely lost, recapturing means checking out `main` first, and it is worth
saying out loud before doing it. This is not hypothetical: an early version of
the harness named its snapshots with a `/`, which `toHaveScreenshot` rewrites
to `-`, so it silently wrote baselines instead of comparing them for a full
run. The names are flat now.

### The record

`notes-tailwind-verdict.md` is the durable document. §1–2 are the thresholds,
pre-registered before any estimating. §3 is the no-go analysis and is
**deliberately left unedited** — it shows what was believed before the call was
made. §4 is Tal's reversal, the wave plan, the house rules (§4.4) and what
wave 6 swept (§4.5).

---

Everything below this line is the evaluation as it was written, and is kept
because its three findings are what the migration was built on.

**Evaluated 2026-08-06** on branch `tailwind-utility-migration`. The analysis
returned **no-go**; Tal then **reversed it to GO** the same day by ratifying
the two things the analysis had named as the conditions that would flip it.
Both the original verdict and the reversal are in
`notes-tailwind-verdict.md` — §3 is the analysis, §4 is the decision, and §3
is deliberately left unedited so the record shows what was believed before the
call was made.

What Tal ratified: **the spacing scale becomes rem-based**, and **multi-site
devices are extracted into Astro components** with utilities inside them. The
first retires the one objection that had no engineering answer; the second
preserves the single-definition-point property that
`projects.css:2-8` and `entry-list.css:2-7` make a correctness requirement,
rather than spending it. Two objections stand and are accepted as cost, not
refuted: there is no maintenance problem being solved (seven commits ever to
`web/src/styles`), and per-declaration commentary loses its referent — which
is why **every extracted component must carry the prose from the rules it
replaces**. A migration that drops the commentary is a failed migration.

At the time of writing, nothing under `web/` had changed and the migration was
blocked on the `@layer base` fix below landing first. It landed as #27.

Three findings from the evaluation are worth acting on independently:

1. **A latent cascade bug, today — fixed in #27.** `global.css`'s element
   rules (`a`, `html`, `body`, `main`) were unlayered, so they beat everything
   in `@layer utilities` regardless of specificity. Any Tailwind utility
   anyone adds to an anchor is generated, applied, and silently loses to
   `a { text-decoration: underline }`. Moving those rules into `@layer base`
   fixes it and changes nothing else — they already lost to every class rule
   on specificity. **This is a prerequisite for the migration:** until it
   lands, no utility can be adopted anywhere on the site.
2. **Tailwind scans `.astro` and `.ts` files whole — comments included — and
   never scans `.css` files at all.** Measured with `@tailwindcss/oxide`'s
   `Scanner` on a controlled fixture: candidates are extracted from `.astro`
   frontmatter comments, JSX `{/* */}` comments, HTML comments, the `<style>`
   block's own CSS (`max-inline-size:` yields the candidate `inline`), and
   `.ts` comments — but nothing in a `.css` file, neither its comments nor its
   declarations. `position: sticky` appears four times in `article.css` and
   produces no rule; the word `sticky` in `SiteHeader.astro`'s comment does.

   The consequence is a **build failure, not a byte cost**: writing the word
   *invisible* in an Astro comment made Tailwind emit
   `.invisible{visibility:hidden}` into shipped CSS, which failed
   `banned-vocab.ts` on `hidden` — a word appearing nowhere in the source.
   So `hidden` and `invisible` are banned from `.astro`/`.ts` files, comments
   included. This is the sibling of the `.contents` incident below and it
   extends the same rule: **component classes never use bare utility words,
   and `.astro` comments never write them either.** Obligation 7 catches the
   dangerous subset on its own, which is the case for leaving it as the guard
   rather than adding a gate.

   The rest is only bytes, and mostly not prose: of the dead rules in the
   shipped CSS, `filter` comes from `headings.filter(…)` (real code), and
   `inline`/`underline`/`transition` from CSS inside scoped `<style>` blocks —
   which disappear as those blocks are migrated.
3. **The design gates and the RTL stage held up under a real change.** All
   four gates plus the checked-in screenshot baseline passed unmodified
   through a bridge commit and a component migration, and the baseline caught
   the one genuine fidelity defect (61 pixels on `/colophon/`, from a
   longhand/shorthand reset difference).

Everything below this paragraph describes the evaluation as it was run.

Tailwind
v4.3.3 has been wired since the scaffold (`@tailwindcss/vite` in
`web/astro.config.mjs`, `@import 'tailwindcss'` at `web/src/styles/global.css:1`)
and **no utility is used in markup** — all styling is hand-written
custom-class CSS. That was true when this was written and is what the
migration above changed.

The verdict protocol and its pre-registered thresholds are in
`specs/notes-tailwind-verdict.md`. The constraint that governed everything:
rendered output must not change by one pixel, verified by a full-site
screenshot diff at `maxDiffPixels: 0` against a baseline captured from `main`.
`web/src/styles/tokens.css` is byte-frozen — the four design gates textually
parse it, so the Tailwind theme *bridges* to it (`@theme inline`, one line per
token, values never restated) rather than absorbing it.

**The fidelity oracle had to be built before anything could move.** The
checked-in RTL screenshot baseline (§3) covers one page. Worse, all three
content collections are empty, so `astro build` emits 9 pages and the card
grid, the entry rows, the article body, the in-page contents, the siblings
block and the project detail template **render nowhere** — a screenshot diff
over the shipped site cannot see the majority of the markup being migrated.
The harness therefore runs twice, over two fixture sets: once on the empty
state that ships today, and once on a filled set that forces every route and
every device to render. Both live in untracked `web/.fidelity/`; the content
files are named `*-fixture.md`, which `.gitignore` and `.dockerignore` already
match by name, so they cannot be committed and cannot reach an image.

## 3c. Typography — the font pipeline

**Until 2026-08-06 the site loaded no font at all.** `tokens.css` named
Syne, Heebo and DM Mono; there was no `@font-face`, no woff2 on disk and no
preload, so every page rendered in the generic system fallback. Nothing in
this file recorded it, which is the gap worth remembering: a status page can
be complete about routes and silent about the thing the brief leads with.

Seven families are now self-hosted from **13 committed woff2 files** under
`web/src/assets/fonts/`, read through Astro 7's `fontProviders.local()`.
Provenance, per-file rationale and the re-extraction procedure are in that
directory's `README.md`; the Fontsource packages the files came from are
pinned devDependencies that nothing imports.

Vendored rather than fetched at build time on purpose: `docker build` needs
no network, and the shipped bytes are identical on a laptop, in CI and in a
deploy. A build-time provider would have put a third-party fetch on the
deploy path.

Measured against `performance-budgets.md` — every figure below the cap:

| | Measured | Cap |
|---|---|---|
| en critical path (Syne + DM Mono ×2) | 62.9 KB | ≤ 110 (§4.1) |
| he critical path (+ Heebo) | 74.7 KB | ≤ 145 (§4.1) |
| warm total, never on first load | 224.0 KB | ≤ 280 (§4.2) |
| `/` page weight | 70.9 KB | ≤ 260 (§5) |
| `/he/writing/` page weight | 83.0 KB | ≤ 340 (§5) |

**Fraunces is the `standard` axis build, not `full`.** `full` adds SOFT and
WONK, which the warm prototype never requests, and breaches §4.1 twice over
(italic 146 KB against a 100 KB cap; warm total 343 KB against 280 KB). This
is the remedy §4.2 pre-registered — restrict the instanced axes before asking
to move a budget — and it means no budget moved. Dropping `opsz` as well
would be smaller still and is *wrong*: `font-optical-sizing: auto` is the CSS
initial value, so it would change every warm glyph.

**Two things that would have shipped broken, both silent:**

- Astro mints a content hash per family and emits `font-family:
  "Syne-b5502b34dbd04c1a"`. `tokens.css`'s `'Syne'` matches none of it, so
  the fonts would have downloaded, been preloaded, and not applied — a page
  that looks merely plain, with nothing in the markup to suggest why. The
  three font tokens are re-declared in `global.css` against Astro's
  variables, after the `tokens.css` import so source order decides.
  `tokens.css` stays byte-frozen, as gates 5–8 require.
- Astro's default fallbacks would have broken the Hebrew companion
  mechanism. `--font-syne` expands to `Syne-hash, "Syne-hash fallback:
  Arial", sans-serif`, and that generated face carries **no unicode-range**
  — ahead of Heebo it claims Hebrew codepoints, which Arial renders, so the
  companion is never reached (`typography.md` §3). Every family sets
  `fallbacks: []`; the generic tail is written once, in the bridge.

**Metric compensation is wired; the dark pair is verified, the warm pair is
not.** Numbers and standing are in `typography.md` §3; the implementation is
`web/src/styles/fonts-hebrew.css`. Heebo's `size-adjust: 86.9%` is **Tal's
eye, three passes** (94.3% → 90.4% → 86.9%, Hebrew reading large at each of
the first two) — that is §7.4 discharged for the dark temperature. Frank Ruhl
Libre's 82.2% is the same rule applied to measured numbers and carries a
`REVIEW(Tal)`; it has never been looked at, because the warm theme cannot
currently be reached (below). The metric overrides are arithmetic and were
never in question.

The instructive part is what the wrong numbers had in common: both rejected
values were anchored to OS/2 `sxHeight`, which describes a font's **Latin**
lowercase. All three Hebrew companions carry `latin` subsets, so the field
exists, reads plausibly, and answers a question nobody asked — the Hebrew
glyphs are the only ones these faces ever render here. The measurement that
worked reads the glyph outlines directly.

It forced a structural change worth knowing about: **Astro's font API cannot
express these descriptors.** Its `FamilyProperties` surface is display /
stretch / featureSettings / variationSettings / unicodeRange — it computes
`size-adjust` and the overrides internally, but only for the fallback faces
it generates, which are switched off here. So Heebo and Frank Ruhl Libre are
declared by hand in CSS and left `fonts[]` entirely; they keep their real
family names because nothing hashes them any more, which is why the bridge
names them as plain families while the other five stay variables. IBM Plex
Sans Hebrew needs no adjustment, so it stayed in the API.

**The warm temperature had no way in, and that was load-bearing.** Only the
*persistence* half was built: `Base.astro` read `localStorage.theme` before
first paint and set the attribute, and nothing wrote it — so the warm palette,
its four fonts and its whole type system were unreachable except from devtools.

That was a curiosity while the theme was only colour, and a blocker once the
fonts landed: Frank Ruhl Libre's `size-adjust` could not get the QA pass §7.4
requires until the theme could be entered the way a visitor would enter it. It
was recorded here because, like the fonts, it was a hole this file had been
silent about — the easter egg fully specified and half-built, with nothing
saying so. **The other half landed 2026-08-07; see §3d.** The `REVIEW(Tal)` on
82.2% stands until the eye pass actually happens.

Heebo's preload became an explicit `<link>` in `Base.astro` as a
consequence, since `<Font>` no longer knows about it. The URL comes from a
frontmatter import of the same asset the stylesheet resolves, so the two
cannot drift, and it carries `crossorigin` — fonts are fetched in CORS mode
even same-origin, and a preload without it warms nothing.

**The RTL screenshot baseline was re-captured**, and this is the one case
where that is correct rather than alarming: fonts change every glyph, so the
old image recorded a site rendering in the system fallback. The page is 133 px
shorter with real fonts. The eight behavioural assertions passed throughout —
before the re-capture and after — so the screenshot was the only thing that
moved, which is the evidence that it moved for the stated reason. Re-run in
compare mode afterwards: 9/9.

## 3d. The theme mechanism — the trigger is built

**Until 2026-08-07 only half of it existed.** `Base.astro` read
`localStorage.theme` before first paint and set `data-theme`; nothing wrote
that key. The warm palette, its four fonts and its whole type system were
unreachable except from devtools. §3c recorded that as a blocker; it is one no
longer.

The whole mechanism is one `is:inline` block in `web/src/layouts/Base.astro`
— pre-paint attribute-set, keydown buffer, persistence — because
`performance-budgets.md` §3 budgets the three as one row and SR-10's hash-based
CSP costs one hash per inline block. **Measured 1,852 B gzipped against the
2.0 KB cap**, which is the whole row, with roughly 200 bytes of headroom.

That headroom is the thing to know before editing it. `is:inline` ships
byte-for-byte with no minifier — comments and indentation included — so this
repo's ordinary commenting density would consume the budget on its own. The
reasoning lives in `tokens.md` §2 and the script carries pointers. There is no
`bundle` stage yet (obligation 10), so the number above was measured by hand
and will drift silently until there is.

**The decisions, all four Tal's, all recorded in `tokens.md` §2:** the literals
ship plain rather than encoded; the console strings are the half-quote pair;
warm fonts are warmed on a partial match; and there is an e2e spec.

**The literals forced a spec amendment rather than a workaround.** Plain
`i solemnly swear…` and `mischief managed` carry three words from
`tokens.md` §1's banned identifier vocabulary, so obligation 7 failed on them —
15 hits across the 9 pages. The alternatives all cleared the gate untouched
(base64 has no word boundaries inside it; an FNV hash has no text at all), and
were rejected on register: `brand.md` §3's standard here is "discoverable in
the open repo by the attentive; never pointed at", and encoding makes a thing
*hidden* rather than merely unannounced. So §1 gained a carve-out and
`scripts/banned-vocab.ts` masks the two exact phrases before its identifier
scan, reporting the count on every run (**27** — three per page: both literals
and the revert log line). Every other use of those words still fails, verified
against a control string. Filenames are deliberately not masked.

**What the e2e spec is really for.** `web/tests/e2e/theme.spec.ts`, ten tests,
no screenshots — so it has zero surface against `rtl.spec.ts`'s byte-compared
baseline, which is the property that matters most about it. The valuable one is
SR-23's: it injects an `<input>`, focuses it, types the whole phrase into it
and asserts nothing happens. The public IA has no form fields, so that
requirement is about staying harmless if one ever appears, and it is the only
part of SR-23 a machine can check.

**Three things that would have shipped broken, all silent:**

- `document.fonts.load()` defaults its sample text to Latin. Both Hebrew
  companions are scoped to the hebrew `unicode-range`, so the two calls that
  matter would have resolved instantly having fetched nothing — a font warm-up
  that warms nothing and reports success. They take an explicit Hebrew sample.
- Family names could not be hardcoded: Astro mints
  `Fraunces-963041b4c56633f0` and friends, so the script reads them from
  `getComputedStyle`. The same hashing that §3c caught in `tokens.css` reaches
  here too.
- `transitionend` cannot remove the transition class. It fires per property per
  element across every node, and under reduced motion the rule is
  `transition: none`, so it never fires at all and the class would have stayed
  on `<html>` forever. One `clearTimeout`-guarded timer instead, alive for
  600ms per toggle and never at idle.

`web/src/styles/global.css`'s "the theme-transition rule is NOT dead" comment
has been rewritten: the class was a contract waiting for a switcher, and the
switcher now exists and is named there. The buffer is a fixed-length tail
window, so the listener starts no timer at all — `performance-budgets.md` §3's
"zero timers at idle" holds literally rather than approximately.

**What this unblocks, and what it does not.** Frank Ruhl Libre's
`size-adjust: 82.2%` can now get the perceived-density pass `typography.md`
§7.4 requires, because the warm theme can be entered the way a visitor enters
it. That pass is Tal's eye and has not happened — the `REVIEW(Tal)` stands
until it does. SR-23 and SR-24 both name a Gated review as their verification;
the discharge lines in `security-requirements.md` record what the
implementation does, not that the review happened.

**One coupling recorded before it bites:** `deploy/Caddyfile` ships no CSP
today, only the comment saying hash-based `script-src` is finalised at the
Gated Caddyfile review. The hash must be taken from the *dist* bytes of the
inline block, indentation included, and re-minted on every edit to it.

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
