# Performance Budgets

Written 2026-07-22. `ci-obligations.md` §10's `perf` and `bundle` stages read
this file as their source of truth.

Inputs: `typography.md` (with the correction that the warm theme is **4**
families, not 3); `tokens.md` §2; `content-model.md` §6; the page briefs'
state tables.

**`ADR NNNN` citations below are historical.** The 36 ADRs were deleted on
2026-07-23 with the rest of the workshop machinery; every decision they held
now lives in an ordinary document under `specs/` (map: `README.md`). The
citations are left as written rather than rewritten to guesses — they mark
*that* a decision was made and recorded, and the reasoning survives in git
history before that date. Do not add new ones.

**Standing rule: budgets are contracts, not aspirations.** Moving one is a
deliberate, recorded decision — an edit to this file, in a PR that says why,
with the measurement that motivated it. It is not a CI tweak, and a stage
must never be loosened to make a red run green.

**Units, so that a gate can be written against these tables.** **KB is 1000
bytes** throughout this file — the SI reading, which is also what Lighthouse
and DevTools report, and the stricter of the two. HTML, CSS and extracted
script blocks are measured **gzip level 6**: that is Caddy's `encode gzip`
default, so the figure models the transfer a visitor actually pays rather than
the best case a higher level could reach. **woff2 is counted raw** — it is
already compressed and Caddy ships it as-is (§7). A page's total counts its
HTML once: the inline theme block and the `@font-face` `<style>` blocks live
inside that HTML, so §3 charges the extracted block and §5 charges the HTML
that contains it, and adding both to one total would count the same bytes
twice.

---

## 1. What the architecture already guarantees (budgets lean on it)

Fully static HTML for every public route (ADR 0019), no third-party
scripts ever (ADR 0020), no API read on any route's critical path
(content-model §6: reads are progressive enhancement degrading to
absence), images with required dimensions (writing-article brief §2.1),
motion limited to color transitions (hero-and-motion.md §1). The budgets
below are therefore tight by entitlement, not ambition — this architecture
was *bought* for R1, and the budget's job is to keep it paid for.

## 2. Core Web Vitals targets (p75, mid-tier mobile, lab-measured in CI)

A row that names a Lighthouse audit id in backticks is measured by §8's stage;
the **Enforced** column says whether a breach fails the build. Three states, and
the difference between the second and third matters: a *guardrail* is a target
nothing here can see, while *not yet* is a number this stage measures and prints
on every run without failing on it. §8's stage parses this table, so both the
ids and that column are load-bearing.

| Metric | All page types | Enforced | Notes |
|---|---|---|---|
| LCP (`largest-contentful-paint`) | **≤ 2.0 s** (lab, throttled mobile) | yes | LCP element: `h1`/hero text — a font-dependent text node everywhere; no image is ever the LCP candidate (the portrait is mid-page on `/about/` only) |
| TBT (`total-blocking-time`) | **≤ 150 ms** | yes | The lab proxy for INP, below — the metric Lighthouse actually scores for interaction cost |
| CLS (`cumulative-layout-shift`) | **≤ 0.02** | not yet — see below | Effectively zero: INV-2 append-only injection, image dimensions required, hero reveal is opacity-only. Anything above 0.02 means a rule was broken, not a budget missed |
| INP | ≤ 150 ms field | guardrail | Nothing here should ever approach it; the only listeners are the keydown buffer, hover states, and reaction clicks |
| TTFB | ≤ 800 ms field, primary audience | guardrail | See §7 — single-region EC2, no CDN by architecture |

Lighthouse CI performance score gate: **≥ 95** on `/`, one article, one
translation (RTL), one index. Score is the coarse gate; the byte budgets
below are the real contract.

**Why INP is a guardrail and TBT is the gate.** INP is a *field* metric: it
needs real interactions over a real session, and Lighthouse does not produce
one — there is no lab INP to assert, and asserting something else while calling
it INP would be a gate reporting a number nobody measured. So INP keeps its
≤ 150 ms as the field target and moves to the classification TTFB already
carries, and TBT joins the table as the lab stand-in. 150 ms is deliberately
*tighter* than Lighthouse's own 200 ms "good" threshold for TBT: it mirrors the
INP number rather than inventing a looser one. This adds a gate where there was
none, which is why it is not a loosening.

**Why CLS is measured but not yet enforced.** `/` does not meet it. Measured
2026-08-08 over seven runs: a median of **0.0201** against the 0.02 above, with
a spread of 0.0004 - so the true value straddles the budget rather than clearing
it. On CI the same page measured a median of **0.0197 with a spread of 0.0027**,
which is the more important number: it is seven times the local spread, it is
the only metric on this stage that is not steady across runs, and it lands on
both sides of the budget. Every other route measures 0.000. Lighthouse attributes the shift to
`h1.hero-mark > span.scheme > span.frame` and the header nav items: it is
font-swap reflow, which follows from `astro.config.mjs` giving every family
`fallbacks: []`.

**The budget is not moved, and the invariant is not traded away for it.** 0.02
stays exactly where it was; what is postponed is enforcement, and this row says
so rather than a stage quietly omitting it. The obvious fix — letting Astro
append its default metric-adjusted fallback — is *forbidden*: that face carries
Hebrew glyphs and no `unicode-range`, so composing it ahead of the Hebrew
companion means a Hebrew codepoint never reaches Heebo, which is the silent
failure `typography.md` §3's companion mechanism exists to prevent
(`astro.config.mjs` states this as a correctness invariant).

The fix that remains open is a hand-written metric-adjusted `@font-face` for
Syne and DM Mono with an explicit latin `unicode-range` — the technique
`fonts-hebrew.css` already uses for Heebo and Frank Ruhl Libre, scoped so it
cannot swallow Hebrew. That is a typography decision, not a CI one. **When it
lands, this row's Enforced column flips to `yes` and nothing else about it
changes** — which is the whole reason the number was left alone.

## 3. JavaScript budgets (per route, minified+gzip, first-party only — third-party budget is 0, hard, permanent)

| Script | Routes | Budget |
|---|---|---|
| Theme mechanism (inline head: attribute-set + keydown buffer + persistence) | all 12 public routes | **≤ 2.0 KB** |
| Hero typing sequence | `/` only | **≤ 3.0 KB** |
| View-event beacon | `/`, 3 detail route types | **≤ 1.0 KB** |
| Count/reactions enhancement | article + translation detail | **≤ 5.0 KB** |

No framework runtime, no hydration payload, no polyfills (evergreen
browsers; the site works with JS disabled by specification, which is the
real fallback). A dependency that would add client JS to a content route
is a budget breach before it is a code review comment.

**Idle cost (code-mode check, chartered here):** zero timers, zero
polling, zero long tasks at idle on every route; the keydown buffer and
theme transition must be unmeasurable when not in use.

### 3.1 Route totals

| Route type | Routes | Budget |
|---|---|---|
| Indexes, about, colophon, contact, 404s | `/writing/`, `/projects/`, `/about/`, `/colophon/`, `/contact/`, `/404`, `/he/writing/`, `/he/404/` | **≤ 2 KB** (theme only) |
| Home | `/` | **≤ 6 KB** |
| Article + translation detail | `/writing/[id]/`, `/he/writing/[id]/` | **≤ 8 KB** |
| Project detail | `/projects/[id]/` | **≤ 3 KB** (theme + beacon) |

The rows name their routes rather than describing them so §8's gate can read
this table instead of restating it. Naming the Hebrew index and `/he/404/`
explicitly is what "indexes" and "404s" always meant; no budget moves.

**Its own subsection since 2026-08-08, and no number moved by the split.** These
four rows used to sit under the per-script table above with a blank first cell,
which meant §8's gate told the two shapes apart by matching the words "Route
totals" in a cell — the one sentinel in that parser that a reword would have
broken silently rather than loudly. A table per shape removes it, the same
treatment §5's Routes column and §4.1a's per-file caps already got. The Route
type labels are §5's own, so the two tables read as a matched pair.

## 4. Font budgets (the dominant payload — and the C3 correction applied)

Self-hosted woff2 only; `latin` + `hebrew` subsets only (+`latin-ext`
where a family needs punctuation coverage); per-script `unicode-range` so
a page downloads only the scripts it renders. Pipeline is mixed (4
variable / 3 static families) — the loading strategy must not assume
variable-only (ADR 0016).

**Built 2026-08-06** — 13 committed woff2 files through Astro's local font
provider; measurements and the two silent defects it surfaced are in
`build-status.md` §3c. `latin-ext` was not needed by any family. The numbers
below are caps, and the built pipeline is under all of them.

### 4.1 Critical path (default dark theme)

| Page locale | Families fetched | Budget (woff2 total) |
|---|---|---|
| `en` pages | Syne (var, latin) + DM Mono (2 static weights, latin) | **≤ 110 KB** |
| `he` pages | above + Heebo (var, hebrew subset) | **≤ 145 KB** |

`font-display: swap`; `<link rel="preload">` only for the families the current
locale's default theme actually uses — preloading a font the page never
renders is a budget breach in disguise.

#### 4.1a Per-file caps (critical path)

| Family | Faces | Cap, per file |
|---|---|---|
| `Syne` | variable, latin | **≤ 55 KB** |
| `DM Mono` | 400 and 500, latin | **≤ 20 KB** |
| `Heebo` | variable, hebrew subset | **≤ 35 KB** |

A table rather than the sentence this used to be, for §8's gate: a regex over
prose is a parser that matches *wrongly*, which is worse than one that matches
nothing. The three caps are unchanged.

### 4.2 The hidden warm theme — **4 families** (C3: not 3)

Fraunces (variable, opsz/SOFT/WONK axes + italic file), IBM Plex Mono
(3 static weights), Frank Ruhl Libre (var, hebrew), IBM Plex Sans Hebrew
(3 static weights). Realistic total: **≤ 280 KB** (Fraunces roman
**≤ 120 KB**, italic **≤ 100 KB** — the opsz axis makes these the largest
files in the system; if a subset exceeds this, restrict the instanced axis
ranges to what the weight map uses before asking to move the budget).

**Warm fonts are excluded from every initial-load budget and are never
preloaded** — they belong to a theme most visitors never see, and putting
~280 KB on every first view for it would invert the restraint the system
is built on. Lazy strategy is Phase 2's choice within typography.md §9's
constraint (no visible swap inside the 600 ms transition); acceptable
implementations: fetch-on-first-toggle with the transition gated on
`document.fonts.ready`, or a small always-loaded warm subset covering the
first paint plus lazy full files. What is *not* acceptable: silently
adding warm fonts to the critical path to make the toggle simpler.

### 4.3 Requirements riding on fonts

- `size-adjust`/`ascent-override` tuning for the Hebrew companions is owed
  (typography.md §3) — it is also the CLS insurance for mixed-script
  lines; do it before the first translation ships.
- RTL must not double font payload (skill charter): satisfied by
  unicode-range subsetting — a Hebrew page adds only the hebrew-subset
  companion files (§4.1's 35 KB delta), never a second full set.

## 5. Page weight totals (transfer, gzip, excluding article body images)

| Route type | Routes | Budget |
|---|---|---|
| Indexes, about, colophon, contact, 404s | `/writing/`, `/projects/`, `/about/`, `/colophon/`, `/contact/`, `/404`, `/he/writing/`, `/he/404/` | **≤ 250 KB** |
| Home | `/` | **≤ 260 KB** |
| Article detail (en) | `/writing/[id]/` | **≤ 300 KB** |
| Translation detail (he) | `/he/writing/[id]/` | **≤ 340 KB** |

Three clarifications, no number moved. The Routes column exists so §8's gate
reads this table rather than restating it. The first row's "(en)" qualifier is
gone: the Hebrew *indexes* take the same 250 KB as the English ones — they
measure 85–87 KB today against the 73–75 KB of their English counterparts, so
this is a tightening relative to any font delta the qualifier implied. And the
detail row is split in two so that one cell carries one budget. `/he/` is not
listed: `astro.config.mjs`'s `redirects` emits it as a meta-refresh stub with
no stylesheet, font or script, so no route type describes it and the gate
exempts it by name.

Component assumptions inside those totals: HTML ≤ 60 KB, the single
stylesheet (both theme token blocks — tiny by construction) **≤ 30 KB**,
fonts per §4.1, JS per §3.

## 6. Images

- **The portrait (`/about/`)** — prefer SVG at digitization (it is ink
  linework, and SVG is also what makes the deferred `currentColor` ink
  decision in ADR 0018 available); budget **≤ 80 KB**. If raster: AVIF
  with WebP fallback, ≤ 100 KB at its rendered size ×2.
- **Favicon** — 32 px crop against the dark bg (ADR 0018), ≤ 15 KB combined;
  verify legibility before shipping. What ships is `.ico` + **SVG**, not the
  `.ico` + PNG this line originally specified, at 1.4 KB combined. The SVG
  scales and carries the mark's geometry rather than a raster of it; the
  budget is unaffected either way.
- **Article body images (MDX)** — required `alt`, required intrinsic
  dimensions (already law in the brief), `loading="lazy"` below the fold,
  modern format (AVIF/WebP) preferred; **≤ 200 KB per image**, **≤ 500 KB
  image weight per article** as the review trigger — an article that needs
  more is a conversation, not a silent breach.
- No other imagery exists by design (no og-image decision yet —
  navigation.md §3.4 flags it; when made, the asset is build-time static
  and does not touch these budgets).

## 7. Caching and delivery (per route class, given the ADR 0021 shape)

| Class | Cache policy |
|---|---|
| Hashed static assets (fonts, CSS, JS, images) | `Cache-Control: public, max-age=31536000, immutable` — the bundle is baked into the image, so hashes change only on deploy |
| HTML | `no-cache` (revalidate) — deploys must be visible immediately; ETags from Caddy's file server |
| Feeds, sitemap | short `max-age` (≤ 1 h) |
| `/api/v1/*` reads | `no-store` — counts are live or absent |
| Compression | zstd + gzip via Caddy; woff2 served pre-compressed as-is |

**The no-CDN fact, priced honestly:** one EC2 instance serves the world
(ADR 0021). Lab budgets in CI cannot see field TTFB, and cross-continent
RTT will dominate real-world LCP for far visitors. Two consequences:

1. **Region choice is a performance decision and is currently
   undecided** — pricing was verified for us-east-1 (Q29), but the primary
   audience named first in every mission is the Israeli dev community.
   Flagged to the provisioning checkpoint: choose the region against the
   audience (and re-verify t4g.micro pricing in that region against G6),
   not against the pricing example. Recorded here because it is worth
   ~100–200 ms of TTFB to exactly the readers the site is for.
2. A CDN in front (CloudFront) is the standard fix and is *not* part of
   the decided architecture; adding one later is an ADR (it changes the
   TLS/deploy story). The budgets above do not assume one.

## 8. CI enforcement

This is `ci-obligations.md` §10. The contract is four items; **item 2 and the
byte half of item 1 are built**, and the browser side is not.

1. **`perf` stage**: Lighthouse against the built site — §2 scores and
   metrics, §3/§5 byte budgets. **Build fails on breach** — that is the
   contract. *Byte budgets built* (`scripts/perf-budgets.ts`); Lighthouse not.
2. **`bundle` stage**: bundle analysis diff; any new client-JS dependency on
   a content route is called out. *Built* — `web/tests/perf/client-js.json` is
   the inventory every client-JS carrier in `web/dist` must appear in, keyed by
   the CSP-form SHA-256 of its dist bytes, so a new block is a reviewable diff
   rather than a byte total that moved slightly. A carrier missing from it, an
   entry missing from `dist`, or an entry naming a §3 row that does not exist
   all fail.
3. **Idle-cost check**: the §3 idle assertions on `/` and one article. *Not
   built.*
4. Pages measured: `/`, `/writing/[id]/` fixture, `/he/writing/[id]/`
   fixture (RTL — budgets apply identically), `/writing/`. *Built* — and their
   absence is a failure, not a pass: the gate resolves all four and reports
   "no page emitted" against a build without the fixtures.

**What is measured is a fixture corpus, not content.** `web/tests/fixtures/`
holds one full article, two short siblings and one translation; the harness
installs them, builds, measures and removes them. So the article numbers are
the numbers for prose of *that* shape and length, and they will move when real
articles land. That is the intended behaviour of a gate whose subject does not
exist yet, and it is why the article rows in §5 have the widest headroom in
this file.

**Four gaps this stage does not cover**, recorded so a green run is not read as
more than it is:

- **§6's image budgets are unexercised.** No fixture carries a body image and
  no portrait exists, so nothing measures the ≤ 200 KB / ≤ 500 KB rows or the
  portrait's ≤ 80 KB. They land with the first image.
- **§5 has no row for `/projects/[id]/`** — it never did; the route type is
  absent from the table. The projects collection is empty, so nothing renders
  there today, and the first case study will fail the gate's "no §5 row claims
  this page" guard until a row is written. That is deliberate: a page type with
  no page-weight budget is a gap, and the gate's job is to make it loud rather
  than to guess a number.
- **§7's caching table is not implemented and not gated.** `deploy/Caddyfile`
  sets no `Cache-Control` at all today. Nothing here checks headers.
- **§2's CLS row is measured and printed but not enforced**, because `/` does
  not currently meet it — the row above says why, and what flips it back on.
  LCP, TBT and the Lighthouse score gate are enforced.

Three notes on building it, each learned rather than assumed:

- **No `paths:` filter.** Earlier drafts scoped these stages to PRs touching
  `web/**` or a manifest. Neither workflow is filtered any more, and neither
  may become so while `checks` is a required status context — a required
  context that never reports blocks a PR permanently (`build-status.md` §3).
- **The ADR-reference rule is retired**, not merely unimplemented. It said a
  budget change requires `ADR` in the PR description; ADRs no longer exist,
  so a grep for the word would enforce a ritual with nothing behind it. The
  standing rule at the top of this file is the replacement, and it is
  enforced by review.
- **Two of the four pages in item 4 rendered nowhere** when this was written —
  the writing and projects collections are empty, so `/writing/[id]/` emitted
  zero pages. The RTL stage's existing fixture mechanism (`build-status.md` §3)
  was the precedent for how to give this stage something real to measure;
  inventing content to test with was not. That is what was done: three writing
  fixtures, sized and shaped rather than written to be read. Three and not one
  because `/`'s recent-writing column is built for three entries and the
  article template's siblings block needs two others — measuring those in their
  empty state would be measuring a shape the site will never ship in, which is
  the same objection this note raises.
