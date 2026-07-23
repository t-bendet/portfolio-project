# Page Brief — Colophon (`/colophon/`)

Mission 4 · 2026-07-21

| | |
|---|---|
| Route | `/colophon/` — **footer only**, never in primary nav (`sitemap.md` §2 row 9) |
| Archetype | deep-dive editorial |
| Collection | none — authored static page |
| `lang` / `dir` | `en` / `ltr` |
| Dynamic layer | **none, and this is load-bearing** — no live build/deploy status (would invert R4), and no view event; no dynamic-layer script (the only client script on this route is the global theme script — ADR 0002, `tokens.md` §2) (`content-model.md` §6) |
| Chrome | per `navigation.md`; eyebrow `T://bendet · colophon` |

Basis (law): `sitemap.md` §2 row 9 (decided at checkpoint 1: ships, as a
living page, footer-linked) · `content-model.md` §9 (the maintenance
obligation handed to M5) · ADR 0012 · `architecture.md` §1–6 ·
`identity-thesis.md` ("its own infrastructure is part of the exhibit") ·
CLAUDE.md ("no promotional framing of any technology, including ones we've
already chosen").

---

## 1. Goal

ADR 0012 requires that the site genuinely incorporate SQL, Docker, a
from-scratch CI/CD pipeline, and cloud deployment. Those things get built
either way — but without this page they exist only in the repo, and the site
never says so. This page makes the exhibit visible to a visitor: a plain
account of what runs this site, why, and what each choice cost. It serves the
developer who noticed the site is fast and wondered what is behind it, and it
serves Tal by making the infrastructure work legible without a sentence of
self-promotion. It is a **living document describing the current stack** —
Tal chose that over a dated article at checkpoint 1, and accepted the
maintenance contract that comes with it.

## 2. Sections (ordered)

| # | Section | What it must do | Conditional? |
|---|---|---|---|
| 1 | Global header | eyebrow + nav (no nav item is current; the footer's colophon link carries `aria-current="page"`) | always |
| 2 | Page header | `h1`; a lede stating the page's own rule: every claim is paired with what it cost or what it replaced | always |
| 3 | **Review date** | when this page was last checked against reality — see §2.2 | always |
| 4 | The static core | Astro 7.x, static output, no adapter; typed content collections; the near-zero-JS reading path. Paired cost: replatform cadence, and what static output rules out | always |
| 5 | Content and language | MDX in the repo; the two collections; the Hebrew locale subtree, `dir="rtl"`, and what partial localization means. Paired cost: no Hebrew `/about/`, and why that is deliberate | always |
| 6 | The dynamic layer | what the database honestly does — view events, reactions, sessions, the private dashboard's aggregation queries. Paired cost: an authenticated endpoint on the public internet, and the ops that come with it | always |
| 7 | Containers and deploy | three containers, the bundle baked into the image, Compose, EC2, Caddy's automatic TLS. Paired cost: a box to patch; what a managed host would have done instead | always |
| 8 | The pipeline | what "from scratch" honestly means — the vendor's workflow syntax and primitive actions, every stage's logic authored (`architecture.md` §5). Paired cost: three workflows to maintain by hand, and the debugging a marketplace action would have absorbed | always |
| 9 | What it costs to run | the real monthly number, stated plainly | always |
| 10 | Pointers | the repo; the decision log inside it — see §2.3 | always |
| 11 | Footer | per `navigation.md` §4 | always |

### 2.1 The register test (this page's reason to exist)

`sitemap.md` §2 row 9 states the standing risk and the test that keeps the
page honest: **every claim is paired with what it cost or what it rejected. A
sentence that only says what was used does not belong.**

The failure mode is not writing this page badly on day one — it is version 2
drifting toward "Built with Astro / Docker / AWS" as things accumulate. The
test is mechanical enough to apply during review: read each sentence and ask
what it concedes. If nothing, cut it or pair it.

Also binding: **no promotional framing of any technology, including the ones
this project chose** (CLAUDE.md). Superlatives about a tool are the exact
register this page must not enter, and they are what turns a colophon into a
brag page.

### 2.2 The review date — decided here

The page carries a visible "last reviewed" date (month precision is enough).

**Why.** The accepted cost of choosing a living page over a dated article is
that a stale colophon actively misinforms (`sitemap.md` §2 row 9,
`content-model.md` §9). A review date does not prevent staleness — it makes
staleness *visible to the reader*, which is the honest version of a document
that claims to describe the present. It is also what makes M5's obligation
checkable: without a date, "keep the colophon current" has nothing to measure.

**The honest counter-argument, recorded:** a date reading eighteen months old
is itself an embarrassment. That is the point — it is an embarrassment the
reader can see and calibrate against, rather than one silently sitting in
false claims about a stack that changed.

**It is a review date, not a build date.** A build timestamp would be
generated, would change on every deploy without anyone checking anything, and
would therefore assert freshness the content does not have.

### 2.3 Pointing at the decision log

The page links the public repository; the decision record (the Phase 1
workshop: ADRs, missions, reviews) lives in the repo's git history before
2026-07-23, and the distilled result in `specs/`. Rather than asserting that
the choices were considered, the page points at where they were argued —
including the ones rejected and reversed. It also keeps this page short —
the colophon summarizes, the record is the depth.

Caveat to respect: the ADRs are workshop documents, not visitor documents.
The link is a pointer for the curious, not a substitute for section 4–9
saying something readable on their own.

### 2.4 Hard exclusions

| Cut | Reason |
|---|---|
| Live build / deploy status | `sitemap.md` §2 row 9, explicit: it would make a static page depend on the API and invert the R4 anchor. |
| CI badges (build passing, coverage) | Same dependency problem, plus the badge is the brag idiom in its purest form. |
| An architecture diagram that must be redrawn on every change | Not banned, but priced: a diagram is another artifact under the same maintenance contract. If one ships, it is simple enough to edit in a minute. |
| Anything about a second theme | ADR 0002. A colophon that describes the site's own implementation is the single most likely place to leak the hidden theme — a token table, a CSS note, an offhand "two temperatures". **Nothing on this page may mention it.** This is the sharpest instance of the no-acknowledgment rule anywhere in the IA. |
| Mythological names of infra artifacts, explained | ADR 0014: names live in the repo, discoverable, **never pointed at**. If a workflow carries a register name, this page does not gloss it. |
| Performance scores / Lighthouse screenshots | A number from a third-party tool measured once, presented as a property. |

## 3. States

| State | Trigger | What renders |
|---|---|---|
| **Populated** | the normal case | all eleven sections |
| **A layer not yet built** | e.g. backups not yet running at launch | that layer is **not on the page**. The page describes what is running, never what is planned — see §4 |
| **Degraded** | API unreachable | nothing changes; this page has no API dependency by design |
| **Degraded — no JS** | scripts blocked | nothing changes |

## 4. Empty states

**There is no empty state, by construction and by decision.** The page
describes infrastructure that is, by the time anyone can read the page,
already running — the site was deployed by it.

The related failure this brief must prevent is not emptiness but
**aspiration**: a colophon describing a pipeline stage that does not exist
yet, or a backup schedule not yet enabled. Binding rule: **the page describes
what is running.** A layer that is not built is not on the page. A sentence
in the future tense on this page is a bug.

And the standing condition from `sitemap.md` §2 row 9, restated because it is
the page's actual empty state: **if it cannot be written in the tradeoff
register, it should not exist.** A colophon that can only be written as a
list of tools is a colophon that should be deleted, and deleting it is a
legitimate outcome, not a failure.

## 5. Rejected alternatives

- **Ship it as a dated article at `/writing/how-this-site-is-built/`.**
  Surfaced and rejected at checkpoint 1: it would enter the feed and
  supersede naturally (write a follow-up rather than edit history — the
  pattern this project already uses for ADRs). Tal chose the living document
  because a colophon describes the current stack and an article is a dated
  snapshot. Accepted cost: the maintenance contract, which §2.2 makes
  visible.
- **Primary nav placement.** Rejected at checkpoint 1: it is a reward for the
  curious, not a headline claim.
- **Naming it `/stack`** (accurate, generic, fails the anti-test) or
  `/how-this-works` (verbose) — `sitemap.md` §2 row 9.
- **Auto-generating the stack list from `package.json`.** Tempting and wrong:
  it would produce a dependency list, which is the "what was used" register
  the page is forbidden to enter, and it would keep itself current in exactly
  the dimension that does not matter.
