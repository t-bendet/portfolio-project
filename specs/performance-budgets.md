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

| Metric | All page types | Notes |
|---|---|---|
| LCP | **≤ 2.0 s** (lab, throttled mobile) | LCP element: `h1`/hero text — a font-dependent text node everywhere; no image is ever the LCP candidate (the portrait is mid-page on `/about/` only) |
| CLS | **≤ 0.02** | Effectively zero: INV-2 append-only injection, image dimensions required, hero reveal is opacity-only. Anything above 0.02 means a rule was broken, not a budget missed |
| INP | **≤ 150 ms** | Nothing here should ever approach it; the only listeners are the keydown buffer, hover states, and reaction clicks |
| TTFB (guardrail, not CI-gated) | ≤ 800 ms field, primary audience | See §7 — single-region EC2, no CDN by architecture |

Lighthouse CI performance score gate: **≥ 95** on `/`, one article, one
translation (RTL), one index. Score is the coarse gate; the byte budgets
below are the real contract.

## 3. JavaScript budgets (per route, minified+gzip, first-party only — third-party budget is 0, hard, permanent)

| Script | Routes | Budget |
|---|---|---|
| Theme mechanism (inline head: attribute-set + keydown buffer + persistence) | all 12 public routes | **≤ 2.0 KB** |
| Hero typing sequence | `/` only | **≤ 3.0 KB** |
| View-event beacon | `/`, 3 detail route types | **≤ 1.0 KB** |
| Count/reactions enhancement | article + translation detail | **≤ 5.0 KB** |
| **Route totals** | indexes, about, colophon, contact, 404s | **≤ 2 KB** (theme only) |
| | `/` | **≤ 6 KB** |
| | `/writing/[id]/`, `/he/writing/[id]/` | **≤ 8 KB** |
| | `/projects/[id]/` | **≤ 3 KB** (theme + beacon) |

No framework runtime, no hydration payload, no polyfills (evergreen
browsers; the site works with JS disabled by specification, which is the
real fallback). A dependency that would add client JS to a content route
is a budget breach before it is a code review comment.

**Idle cost (code-mode check, chartered here):** zero timers, zero
polling, zero long tasks at idle on every route; the keydown buffer and
theme transition must be unmeasurable when not in use.

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

Per-file caps: Syne variable latin **≤ 55 KB**; each DM Mono weight
**≤ 20 KB**; Heebo hebrew **≤ 35 KB**. `font-display: swap`;
`<link rel="preload">` only for the families the current locale's default
theme actually uses — preloading a font the page never renders is a budget
breach in disguise.

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

| Route type | Budget |
|---|---|
| Indexes, about, colophon, contact, 404s (en) | **≤ 250 KB** |
| `/` | **≤ 260 KB** |
| Article / translation detail | **≤ 300 KB** (en) / **≤ 340 KB** (he) |

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

This is `ci-obligations.md` §10, and it is **not built yet**. What follows is
the contract it must satisfy, not a description of something running.

1. **`perf` stage**: Lighthouse against the built site — §2 scores and
   metrics, §3/§5 byte budgets. **Build fails on breach** — that is the
   contract.
2. **`bundle` stage**: bundle analysis diff; any new client-JS dependency on
   a content route is called out.
3. **Idle-cost check**: the §3 idle assertions on `/` and one article.
4. Pages measured: `/`, `/writing/[id]/` fixture, `/he/writing/[id]/`
   fixture (RTL — budgets apply identically), `/writing/`.

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
- **Two of the four pages in item 4 render nowhere today** — the writing and
  projects collections are empty, so `/writing/[id]/` emits zero pages. The
  RTL stage's existing fixture mechanism (`build-status.md` §3) is the
  precedent for how to give this stage something real to measure; inventing
  content to test with is not.
