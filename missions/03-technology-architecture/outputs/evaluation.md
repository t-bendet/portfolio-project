# Evaluation — Mission 3, Stage 2 (tech-eval §2–§3)

Date: 2026-07-21
Method: applies `requirements-and-weights.md` (frozen: gates G1–G6; weights
R1=16, R2=14, R3=18, R4=18, R5=10, R6=8, R7=8, R8=8; integer 1–5 scores ×
weight, max 500). No weights were changed. Evidence: every version,
compatibility, and pricing claim cites `verification-report.md` (cited as
"Qn"), checked 2026-07-21. This document ends in a recommendation for Tal's
checkpoint 2; it does NOT decide. `architecture-decision.md` and ADR writes
come only after that checkpoint.

Handling of flagged low-confidence report items (per coordinator rule):

- **Q30 (RDS ~$14/mo, secondary-sourced):** not load-bearing. RDS is rejected
  in the SQL-placement sub-decision (§2) because two alternatives beat it on
  cost AND simplicity at this scale regardless of the exact figure; the ~$14
  number corroborates but does not decide. No gate or ranking depends on it.
- **Q27 (Litestream version/cost, UNVERIFIED):** not load-bearing. The
  SQLite-class placement is set aside precisely because its supporting facts
  are unverified this pass (see §2); rejecting-for-lack-of-verification does
  not require the missing verification.
- **Q31 (S3/Route 53, secondary-sourced):** used only for a $0.50/mo hosted
  zone line inside budgets with ≥$8 headroom. If it were off by 10x, no gate
  outcome changes. Non-decisive; flagged.
- **Q35 (GHCR free is policy, not contract):** treated as revisable; every
  budget below also prices the AWS ECR path (Q36) so no design depends on
  GHCR staying free.

---

## 1. Candidate definitions (full architectures)

All four candidates carry the same honest dynamic capability, because G3
demands the SQL story be named concretely and identically honest across the
set (differences in how *naturally* each hosts it are scored in R3):

> **What the SQL database does (G3 statement, all candidates):** Postgres
> stores first-party visitor interaction data — per-article read/view events
> and reactions — because the site deliberately uses no third-party tracker.
> It powers (a) visible per-article counts/reactions on article pages and
> (b) a private stats view for Tal. **Deletion test:** remove the database
> and visitors lose visible counts/reactions; Tal loses his analytics
> entirely. Observable change on both sides of the test; the data is written
> at runtime by visitors and cannot be a build-time file without loss. Future
> honest extensions (search, webmentions) are noted but NOT load-bearing —
> the design must stand on the named capability alone.

The four constraints of ADR 0012, one sentence each (G2's test, shared
skeleton; per-candidate deltas in §4): (a) SQL — Postgres holds first-party
analytics/reactions because Tal chose to own his data rather than embed a
tracker; (b) Docker — the app/API and database run as containers composed on
a cloud instance Tal operates, and the image build is a pipeline artifact;
(c) CI/CD — a hand-written GitHub Actions workflow (typecheck → test →
build → RTL rendering check → migrate → image push → deploy) with authored
logic, not a platform's magic pipeline (workflow syntax is the vendor's;
every stage's logic is Tal's); (d) cloud — deployment lands on an AWS
instance (Lightsail or EC2) under Tal's control.

**C1 — Keep the incumbent framework: Astro, now 7.x** (Q5: 7.0.9,
2026-07-13; Rust compiler, Vite 8, Rolldown, Node ≥22). Fully static output
for all pages; a **separate hand-built Node/TS HTTP API service** (Tal's own,
Express-5-class — exact library chosen at decision time) provides the
analytics/reactions endpoints; article pages enhance progressively with a
small client fetch for counts. Compose stack: Caddy (static files + reverse
proxy, auto-TLS, Q37) + API container + `postgres:18` container (Q23).
Variant noted but not scored as primary: Astro's Node adapter (Q9: v11.0.2)
with server islands (Q8) instead of a separate API — rejected as primary
because the separate service maximizes content survivability (static files
need no Node process) and is itself a from-scratch showcase artifact,
whereas the island path puts a server in the content path for the same
capability.

**C2 — Next.js 16.2.x, self-hosted in Docker** (Q11). App Router; article
pages prerendered at build (Q15: prerender-by-default caching model);
analytics/reactions via route handlers in the same runtime; `output:
'standalone'` image with `sharp` (Q12) + `postgres:18` under Compose, behind
Caddy, on the same instance class. The Next server is in the visitor path
for all pages.

**C3 — React Router v8, framework mode, self-hosted** (Q16: released
2026-06-17, Node 22.22+, React 19.2.7+, ESM-only; evaluated as v8, not v7,
because v8 is current and the team documents v7→v8 as non-breaking — pinning
the non-current major would need a justification that does not exist).
Article routes prerendered via `prerender` config and served as static files
by Caddy without the Node server (Q17); the RR app server (official
Dockerfile lineage, Q19) handles the analytics/reactions endpoints. MDX via
`@mdx-js/rollup` through Vite (Q18). Compose stack mirrors C1.

**C4 — TanStack Start** (Q20: `@tanstack/react-start` 1.168.32, 2026-07-19;
RC-quality, not formally 1.0). Vite + Nitro (Q22); prerendering via plugin
config (Q21); MDX via third-party Fumadocs (Q21); community-sourced Docker
guidance (Q22). Same Compose/instance shape.

**Deliberate omission (unchanged from candidate-set message):** no non-JS
SSG candidate — the MDX-heavy content model (G4/R2) is a JS-ecosystem
format; a Hugo-class entrant would exist only to fail R2 at 1, which is
filler, not an honest option.

---

## 2. Shared sub-decision: SQL engine placement (priced against G6)

Considered for all candidates:

1. **Containerized Postgres on the instance** — $0 marginal cost; Postgres
   18 current stable with standard pinned Docker tags (Q23). Cost: best.
   Ops: Tal owns backups (a scheduled `pg_dump` to S3 becomes an honest
   pipeline stage) — real, bounded burden, priced into R4. Showcase: the
   database is genuinely operated by Tal — strongest ADR 0012(a)+(b) story.
   **Selected.**
2. **Managed free tier (Neon)** — real Postgres, $0, scale-to-zero with
   sub-second resume (Q33, high confidence). Weaker Docker/ops showcase (the
   DB is someone else's ops) and a free-tier dependency that R6's rule prices
   at its paid form (usage-based, no floor — Q33). **Kept as the named
   fallback** if instance memory pressure ever forces the DB off-box; not
   primary because it outsources exactly the operational skill ADR 0012 wants
   demonstrated.
3. **SQLite-class on the instance** — `node:sqlite` is RC, documented as
   unsuited to production HTTP servers (Q26, high confidence); the
   Litestream replication story's version and cost are UNVERIFIED this pass
   (Q27, low confidence). Set aside: it would rest on an RC runtime module
   or on unverified facts, and G5's spirit (no RC core pieces) plus the
   report's own load-bearing rule both block it today. Revisitable later
   with primary verification; nothing in the ranking depends on it.
4. **RDS** — rejected: at personal-site scale it is dominated by options 1
   and 2 on both cost and fit (1GiB db.t4g.micro adds a second managed bill
   to run the same Postgres a $0 container runs); the reported ~$14/mo
   figure (Q30, medium confidence, secondary-sourced) corroborates that it
   would consume most of the $15 ceiling but is deliberately not the
   deciding reason, so it is not load-bearing and no primary re-fetch was
   required. If Tal ever *wants* RDS specifically as showcase, that is a new
   conversation with a new budget — flagged for checkpoint honesty.

**Shared budget (G6 arithmetic, all candidates):** instance $5.00 (Lightsail
nano with IPv4, Q28) or $6.13 (EC2 t4g.micro, Q29) + Route 53 hosted zone
$0.50 (Q31, non-decisive) + registry ~$0 (GHCR currently unbilled Q35, or
ECR near-$0 same-region Q36) + CI $0 (public repo, unlimited free minutes,
Q34) + Postgres container $0 = **≈ $5.50–6.63/month**, headroom ≥ $8. All
candidates PASS G6; all fall in R6's $5–10 band → R6 = 3 across the board
(R6 does not discriminate this set; recorded honestly rather than forced).
Two budget gotchas that apply to everyone: GH ARM64 hosted runners bill
$0.005/min even on public repos (Q34) — ARM images for t4g/Lightsail-ARM
should be built via QEMU/buildx on free x86 runners or the instance itself;
and the 512MB nano is tight for Node + Postgres + Caddy — the honest budget
quotes t4g.micro/$6.13 as the safe figure, and C2's heavier always-on server
raises the risk of needing t4g.small ($12.26, Q29 — still under G6, but
would drop C2's R6 to the 1-band; flagged as an unverified-footprint
sensitivity that does not change the ranking).

---

## 3. Gates (G1–G6)

| Gate | C1 Astro 7 | C2 Next 16 | C3 RR v8 | C4 TanStack Start |
|---|---|---|---|---|
| G1 RTL first-class | PASS | PASS | PASS | PASS (moot) |
| G2 showcase satisfiable | PASS | PASS | PASS | PASS (moot) |
| G3 no faked dynamism | PASS | PASS | PASS | PASS (moot) |
| G4 content portable | PASS | PASS | PASS | PASS (moot) |
| G5 stable maintained core | PASS | PASS | PASS | **FAIL** |
| G6 ≤ $15/mo | PASS | PASS | PASS | PASS (moot) |
| **Result** | survives | survives | survives | **ELIMINATED** |

Gate arguments:

- **G1.** C1: built-in i18n routing with per-locale `dir` config applied to
  `<html lang dir>` by the author; sitemap emits hreflang alternates (Q9,
  Q10). Documented gotcha, not a failure: Astro's i18n is
  "writing-direction-agnostic" — RTL wiring is manual (Q10). C2: no built-in
  App Router i18n; the documented manual `[locale]` + next-intl pattern sets
  `<html lang dir>` per locale in the locale layout, and the Metadata API
  emits hreflang (Q14) — manual but first-class document control, passes.
  C3: RR has no i18n layer at all, but framework mode renders the full
  document from the app's root route (framework conventions, Q17/Q19
  sources), so per-locale `lang`/`dir` is fully author-controlled with no
  LTR assumption baked in — passes with the most hand-rolling of the three.
  All three avoid the "element-level dir over an LTR-assuming system" fail
  mode because each owns the whole document.
- **G2/G3.** All candidates instantiate the shared skeleton in §1; the
  four one-sentence statements are true, non-circular, and describe Tal's
  work in each case (per-candidate deltas in §4). The deletion test in §1
  passes identically for all.
- **G4.** All: MDX/Markdown files in the repo; no authoring service. C1's
  content collections, C2's `@next/mdx` pages, C3's `@mdx-js/rollup`, C4's
  Fumadocs all compile repo files at build (Q6, Q13, Q18, Q21).
- **G5.** C1: Astro 7.0.9 stable release (Q5); Node 24 LTS runtime (Q1);
  Postgres 18 stable (Q23); Prisma 7 stable with Node 24 support (Q24).
  C2: Next 16.2.x stable (Q11). C3: RR v8 stable (Q16). **C4: FAIL** —
  `@tanstack/react-start` is RC-quality without a formal 1.0 cut (Q20), its
  MDX path is third-party (Q21) and its Docker guidance community-sourced
  (Q22); the gate's test is "no RC/beta core dependencies," and the
  candidate's core framework is exactly that, per current citations rather
  than the stale ones ADR 0003 rejected it with. Eliminated; scores still
  recorded per method §3.1.
- **G6.** Shared budget in §2: ≈$5.50–6.63/month for every candidate.

---

## 4. Per-candidate record (tech-eval §3) and scores

Score arguments reference the anchors in `requirements-and-weights.md`
verbatim where they bite.

### C1 — Keep the incumbent framework: Astro 7.x — 416/500 (83.2)

**Strengths.** Content pages are static HTML with zero framework JS by
default — the islands model means nothing hydrates unless asked. First-party
MDX integration and typed content-collection schemas (Q6, Q9). Built-in
i18n routing with hreflang sitemap output (Q9, Q10). The separated API
design makes the site's static core indestructible by dynamic-layer
failure.

**Weaknesses.** Major-version cadence is fast and the current major is a
big-bang replatform (Rust compiler, Vite 8, Rolldown — Q5): "upgrades are
boring" is NOT this framework's story right now, and plugin-ecosystem
breakage risk is real. The `.astro` component model is not Tal's
professional React stack. The server-side showcase is deliberately small —
see the argument against, §6.

**Gotchas (verified).** @astrojs/tailwind deprecated → `@tailwindcss/vite`
(Q7, re-confirmed). Content entries expose `id`, `render()` from
`astro:content` (Q6, re-confirmed). i18n RTL wiring is manual (Q10). Node
≥22 (Q5). Adapter/integration compatibility ranges with 7.x were NOT
independently confirmed (Q9 — npm 403s); pin and verify at scaffold time.

**Forces on Docker/CI/deploy.** Two build artifacts: a static bundle and an
API image. Compose: Caddy + API + Postgres; Caddy serves the static bundle
directly. Pipeline stages all real: typecheck/test → static build → API
image build → Playwright RTL check against the built site (Q38) →
`prisma migrate deploy` (Q24 — CI-guidance detail unverified; re-check at
implementation) → registry push → SSH deploy → scheduled `pg_dump` to S3.
**ADR 0013:** topology-neutral; the two-artifact build works mono or split.
Split repo gives marginally cleaner pipeline triggers; monorepo showcases
the workshop — no forcing either way.

**Scores.**
- **R1 = 5 (×16 = 80).** Static HTML with near-zero JS by default is the
  anchor-5 sentence almost verbatim; sitemap/hreflang first-party (Q9);
  count widgets are progressive enhancement, not reading-path JS.
- **R2 = 4 (×14 = 56).** Typed frontmatter schemas and first-party MDX are
  native (Q6, Q9); locale routing built-in (Q10). Translation pairing is
  still an authored convention (a typed field in the schema), not a native
  concept — that, and the manual RTL wiring, hold it off 5.
- **R3 = 4 (×18 = 72).** The static/dynamic boundary is the architecture
  itself and every ADR 0012 constraint does visible work (§1, §2). Not 5:
  the dynamic capability was chosen to be minimal — honest, but a 5 should
  describe a design whose database need preceded the requirement; this one
  co-evolved with it. That deduction applies set-wide by the same logic.
- **R4 = 4 (×18 = 72).** Anchor-5 headline holds: content pages survive
  dynamic-layer death outright (static files, no Node in the path), and a
  quarter of neglect costs visitors nothing but stale counts. Held to 4
  because upgrades are demonstrably not boring (6→7 replatform, Q5) and the
  instance/Postgres/backup custody is real, if bounded.
- **R5 = 4 (×10 = 40).** TS end-to-end; the hand-built API is squarely
  inside Tal's Node/Express/Prisma experience (about-tal.md), and the
  net-new learning (Docker, CI, AWS) lands exactly in ADR 0012's growth
  areas. Held off 5 because the `.astro`/islands paradigm is adjacent to,
  not identical with, his professional React stack. (Deliberately not
  credited: prior familiarity from the pre-workshop round — per the poison
  list.)
- **R6 = 3 (×8 = 24).** ≈$5.50–6.63/mo (§2): the $5–10 band.
- **R7 = 5 (×8 = 40).** The writeup writes itself: "static site, a small
  API I wrote, my own analytics in my own Postgres, on a $6 instance, shipped
  by a pipeline I built." Every component earns its sentence; no apologetic
  aside anywhere.
- **R8 = 4 (×8 = 32).** MDX corpus is portable; collection config is thin;
  the API is plain Node and moves anywhere; deploy is any-VM-portable.
  Template rewrite cost on framework exit is the usual weeks-not-days — 4.

### C2 — Next.js 16.2.x self-hosted — 296/500 (59.2)

**Strengths.** One runtime spans the whole boundary — SQL access from server
components/route handlers is native, no second service. Prerender-by-default
in 16 (Q15) is the right posture for a content site. Self-hosting via
standalone output is documented and viable, single-instance ISR included
(Q12, high confidence). Metadata API covers hreflang (Q14). Closest large
ecosystem to Tal's React/TS identity.

**Weaknesses.** The server is in the visitor path for everything: no static
survival story (static export forfeits middleware, Q12). The MDX story is
materially weak for an MDX-heavy site: no frontmatter parsing in @next/mdx —
typed frontmatter needs gray-matter/next-mdx-remote glue (Q13) — plus an
open documented build-cache issue in @next/mdx's loader (Q15). No built-in
i18n in App Router (Q14). Caching-model churn across recent majors (Q15) is
the opposite of boring upgrades. Self-hosting is supported but the
framework's center of gravity is its vendor platform; the honest writeup
must explain what was given up.

**Gotchas (verified).** Install `sharp` explicitly or image optimization
degrades (Q12). ISR cache is local-filesystem single-instance (Q12) — fine
here, but couples the container to its disk. `[locale]` + next-intl +
manual `<html lang dir>` (Q14). Prerender-by-default semantics new in 16
(Q15).

**Forces on Docker/CI/deploy.** Single standalone image + Postgres under
Compose; Caddy proxies everything to Next — Caddy serves nothing static
itself. Pipeline: same skeleton as C1 minus the static-bundle artifact; RTL
check runs against the live container. Heavier always-on memory footprint
raises instance-size risk (§2). **ADR 0013:** topology-neutral; no forcing.

**Scores.**
- **R1 = 3 (×16 = 48).** Prerendered HTML by default (Q15) and hreflang via
  Metadata API (Q14) are solid, but every article ships and hydrates the
  React/Next client runtime — "near-zero JS" is not achievable, which is the
  anchor-3 "ongoing discipline" world at best.
- **R2 = 2 (×14 = 28).** For an MDX-heavy bilingual corpus this is the weak
  suit: no frontmatter support in the first-party MDX path (Q13), typed
  frontmatter and translation pairing are entirely DIY, locale routing is
  manual + third-party (Q14), and there is a documented open build issue in
  the MDX loader (Q15). Above anchor-1 only because the documented paths do
  work; below anchor-3 because type safety isn't merely hand-rolled, it's
  bolted through third-party glue.
- **R3 = 4 (×18 = 72).** SQL/Docker/CI/deploy all do visible work and the
  single-runtime design hosts the dynamic capability naturally — arguably
  the most native SQL access of the set. Same set-wide minimality deduction
  as C1.
- **R4 = 2 (×18 = 36).** If the container dies, the entire site is down —
  failure does not degrade gracefully, which C1/C3 structurally avoid.
  Add non-boring upgrade culture (caching-model change in the current
  major, Q15) and an internet-facing server rendering every request, and a
  quarter of neglect is genuinely risky. Above anchor-1: it is one boring
  container with restart policies, not a pager-shaped estate.
- **R5 = 4 (×10 = 40).** React 19 + TS is Tal's daily material; but App
  Router server components are a real paradigm shift even for experienced
  React developers, and that learning is beside, not inside, the ADR 0012
  growth areas.
- **R6 = 3 (×8 = 24).** Same band as the set (§2), with the flagged
  sensitivity: if the footprint forces t4g.small, this drops to 1.
- **R7 = 3 (×8 = 24).** Explainable, but the writeup carries the apologetic
  aside the anchor describes: "the whole blog runs through a Node server,
  and here's what self-hosting gives up versus the vendor platform"
  (Q12's caveats become paragraphs).
- **R8 = 3 (×8 = 24).** MDX files portable, but the mdx-components / glue
  layer, RSC-coupled components, and framework-specific metadata conventions
  are proprietary surface to unwind; deploy itself is any-VM-portable.

### C3 — React Router v8 framework mode — 340/500 (68.0)

**Strengths.** RR is literally in Tal's production stack (about-tal.md) —
highest skills leverage in the set. Prerendered routes are servable as plain
static files without the Node server (Q17, high confidence) — same
content-survival architecture as C1. v7→v8 documented non-breaking (Q16) —
genuinely good upgrade culture signal. Official Dockerfile lineage and
container-first deploy docs (Q19).

**Weaknesses.** No content layer at all: typed frontmatter, collection
logic, locale routing, RSS/sitemap are all Tal-authored code. No first-party
MDX; the documented `@mdx-js/rollup` path has an open unresolved
compatibility issue with RR's Vite dev server in some configurations (Q18) —
a rot risk aimed at exactly the site's center of gravity, the blog build.
ESM-only and tight version floors (Node 22.22+, React 19.2.7+, Q16).

**Gotchas (verified).** Q16 floors and ESM-only. Q18 MDX/Vite issue. RTL and
i18n wholly hand-rolled (no framework i18n exists) — full document control
via the root route makes it workable but nothing is provided.

**Forces on Docker/CI/deploy.** Compose mirrors C1 (Caddy serves prerendered
files, RR server container for the API routes, Postgres). Pipeline identical
in skeleton to C1's. **ADR 0013:** topology-neutral.

**Scores.**
- **R1 = 3 (×16 = 48).** Prerendered static HTML (Q17) is strong, but every
  page ships client-navigation payloads and hydrates React — not near-zero
  JS — and sitemap/RSS/hreflang are all hand-authored with no framework
  assistance. Anchor-3 discipline territory.
- **R2 = 2 (×14 = 28).** MDX is community-glued with a documented open
  issue (Q18), and the entire typed-content/pairing/locale layer is bespoke
  code. Above 1 — @mdx-js/rollup is the ecosystem-standard path and does
  work — but the tool contributes nothing to the content model.
- **R3 = 4 (×18 = 72).** Same honest boundary as C1 (static content, small
  server for the dynamic capability), all four constraints visible, official
  container story (Q19). Same set-wide minimality deduction.
- **R4 = 3 (×18 = 54).** Graceful degradation holds (content survives the
  server, Q17) and v7→v8 non-breaking is real evidence of boring upgrades
  (Q16) — but the hand-rolled content pipeline with a live MDX/Vite
  incompatibility (Q18) is precisely the "sit untouched and rot" surface R4
  measures, on the site's most important subsystem. Anchor-3.
- **R5 = 5 (×10 = 50).** RR v7 is on Tal's CV; v8 is the same library
  current-major (Q16). TS end-to-end, the most familiar mental model
  available, and the net-new learning is Docker/CI/AWS — exactly ADR 0012's
  growth areas.
- **R6 = 3 (×8 = 24).** Same band (§2).
- **R7 = 4 (×8 = 32).** Good writeup — "prerendered app, static content
  survives the server, my API, my Postgres" — with one aside: the hand-glued
  MDX toolchain and its open issue.
- **R8 = 4 (×8 = 32).** `@mdx-js/rollup` is generic MDX tooling (portable);
  loaders/actions are framework-specific but thin here; deploy any-VM. The
  bespoke content layer is Tal's own code and moves with him.

### C4 — TanStack Start — ELIMINATED at G5 — recorded 278/500 (55.6)

**Strengths.** Modern full-stack TS with prerendering (Q21); TanStack
Query familiarity on Tal's CV. **Weaknesses/gotchas.** Core framework not
formally 1.0 (Q20); MDX only via third-party Fumadocs (Q21); Docker guidance
community-sourced, Nitro server output (Q22). **Forces:** single Nitro
container + Postgres; community Dockerfile; topology-neutral. **Scores (for
the record, not competitive):** R1=3 (48), R2=2 (28), R3=3 (54 — the
container/deploy story is the set's least documented, Q22), R4=2 (36 — RC
churn plus third-party content pipeline), R5=4 (40), R6=3 (24), R7=3 (24 —
the writeup must explain choosing an RC framework), R8=3 (24). The original
ADR 0003 rejection ("RC, thin MDX story") is re-confirmed by 2026 citations
(Q20–Q22), not inherited.

---

## 5. Ranking

| Rank | Candidate | Gates | Total /500 | /100 |
|---|---|---|---|---|
| 1 | C1 — Keep incumbent framework (Astro 7.x), static core + hand-built API + containerized Postgres | PASS | **416** | 83.2 |
| 2 | C3 — React Router v8 framework mode | PASS | 340 | 68.0 |
| 3 | C2 — Next.js 16.2.x self-hosted | PASS | 296 | 59.2 |
| — | C4 — TanStack Start | **G5 FAIL** | (278) | (55.6) |

Tie-break: not triggered — the C1–C3 gap is 76 points (15.2%), far above the
25-point (5%) tie threshold. No tie-break reasoning required.

**Where the outcome actually came from (sensitivity, for audit):** C1 wins
on R1 (+32 over both rivals: islands vs. mandatory hydration), R2 (+28:
first-party typed content/MDX vs. glue), and R4 (+18 over C3, +36 over C2:
static survival plus first-party content pipeline vs. rot surface). C3's
R5=5 is the only criterion the incumbent loses. If a reviewer wants to break
this evaluation, those are the scores to attack — see §7.

---

## 6. Recommendation (for Tal's checkpoint 2 — not a decision)

**Recommend C1: keep the incumbent framework, upgraded premise — Astro 7.x
(not 6)** — in the revised architecture: fully static content core;
hand-built Node/TS API service for first-party analytics and reactions;
containerized Postgres 18; Caddy with automatic HTTPS; Docker Compose on a
small AWS instance (Lightsail $5 / t4g.micro $6.13); hand-written GitHub
Actions pipeline (typecheck/test, static + image builds, Playwright RTL
check per ADR 0011, migrate, registry push, deploy, scheduled `pg_dump`
backup). ≈$6/month steady state.

This is a confirming outcome for the reopened prior choice and is legitimate
per the poison list's novelty-bias entry — but it is not the same decision:
the version premise changed (Astro 7, so **ADR 0003 must be superseded by a
version-current ADR whichever way Tal decides**), and the architecture
around the framework is new (the original decision targeted a static host
that ADR 0012 has since ruled out).

**The honest strongest argument against C1** (Tal should weigh this at
checkpoint): *it wins by making the server small.* The yardstick's heaviest
solo-maintainer weighting (R4) structurally rewards architectures where the
dynamic layer is minimal — so the winning design demonstrates SQL and
server-side work at modest depth: a small API and a small schema. C3 (or
C2) would put a load-bearing server at the center and would be the stronger
*proof of server-side engineering* — at the verified cost of a weaker
content pipeline (Q13/Q15/Q18), no or worse static-survival story, and more
neglect risk. If Tal reads ADR 0012 as "the server showcase should be
substantial," that is a weights disagreement with R4/R3's frozen balance —
which is exactly the kind of objection that must go to a checkpoint
conversation and a documented revision of requirements-and-weights.md, not a
silent rescore. Secondary honest knocks on C1: Astro's major-version cadence
is fast and the current major is a replatform (Q5) — the incumbent's
"stability" is ecosystem-relative; and its 7.x integration compatibility
ranges were not independently confirmed (Q9) and must be verified at
scaffold time.

## 7. Poison-list self-audit (requirements-and-weights.md §4)

- **Incumbent bias:** C1's R5 argument credits Tal's Node/Express/TS
  experience, not prior Astro familiarity; the incumbent was re-versioned
  (6→7) rather than grandfathered; its weakest facts (cadence churn,
  unconfirmed 7.x compat ranges) are printed in its own record. The three
  decisive score gaps are enumerated in §5 for targeted attack.
- **Novelty bias:** the confirming outcome was accepted; C4's old rejection
  was re-verified with current citations instead of inherited.
- **Resume-driven over-engineering:** the SQL placement chose a $0 container
  over RDS-class infrastructure; the API is deliberately small; nothing was
  added to impress.
- **Checkbox fake dynamism:** the G3 statement names one concrete
  capability and passes the deletion test; future extensions were explicitly
  made non-load-bearing.
- **Aesthetic leakage:** no Mission 2 material was read or cited.
- **Memory-based facts:** every version/pricing/compatibility claim cites
  verification-report.md; unverified items (Q27, Q30, Q31, Q35) were
  structured to be non-load-bearing, with the reasoning stated in the
  header; two implementation-time re-verifications are flagged (Astro 7.x
  integration ranges Q9; Prisma migrate CI guidance Q24).
