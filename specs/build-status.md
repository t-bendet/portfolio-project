# Build status — what exists, what does not

Last checked against the repo: **2026-08-06**, at `8385121` on `main` plus the
branch that adds the sec stage.

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
| 9 | Workflow-lint for the `paths:` filters | **no** |
| 10 | `perf` (Lighthouse vs. budgets) + `bundle` stages | **no** |
| 11 | `sec` stage (dependency audit + secrets scan) | yes — `scripts/sec.sh`, split across both workflows |

Obligations 9 and 10 land with the features they check, not as a batch.
`deploy.yml` and `backup.yml` do not exist yet — both are downstream of §4.

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

The `paths:` filters gained `scripts/**` and `specs/**` in the same PR: the
contrast gate reads `specs/design/palette.md`, so a spec-only edit must re-run
CI. That is obligation 9's territory, and 9 is still unbuilt.

**The sec stage (11) is split across two workflows, and the split is the
requirement rather than a convenience.** SR-17 says the secrets scan runs on
every PR; `ci.yml` is paths-filtered, so a PR touching only `README.md` never
starts it. The scan therefore lives in `sec.yml`, which carries no filter and
must never gain one — it is a checkout and a container, well under a minute.
The dependency audit stays in `ci.yml`, where the lockfile is already covered.
Both halves are `scripts/sec.sh`, runnable locally like the design gates.

- **Secrets scan** — `gitleaks` as a pinned image (`v8.30.1`), not the action:
  only github-owned actions are allowed here. It scans the working tree, not
  the history, because `.env` is instance-local by decision and a PR checkout
  is shallow enough to make a history scan a check that examines almost
  nothing. `--redact` keeps a finding out of a public repo's log.
- **Dependency audit** — SR-21's policy exactly: `--prod --audit-level high`
  fails, a full audit above it warns. Deliberately no
  `--ignore-registry-errors`; a gate that passes because it could not reach
  the registry is worse than a red run.

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
permissions error. `main` currently requires **zero** status contexts — CI
green is a habit, not an enforcement, until the `checks` context is re-added
as required. There are now **two** contexts to require: `checks` and
`secrets`. SR-18 is where that decision lives.

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
