---
id: 0022
title: Site structure — eleven public routes, archetype differentiation, one global theme
status: active
date: 2026-07-21
decided-by: tal
mission: mission-4
reopened-by: null
superseded-by: null
---

## Context

ADR 0009 (pre-workshop) fixed five routes and assigned each a temperature:
`/` dark, `/about` warm, `/projects` dark, `/writing` warm, `/contact` dark.
Mission 4 reopened it because Tal reopened page composition entirely, and
because 0009 carried a recorded inconsistency: **its per-route theme
assignment contradicts ADR 0002**, which is `active` and was explicitly
defended by Mission 1. Mission 4's contract required that inconsistency to
be resolved explicitly rather than papered over.

Full record: `missions/04-information-architecture/outputs/sitemap.md`
(hardened at checkpoint 1, 2026-07-21) and the eleven briefs in
`outputs/page-briefs/`.

## Decision

**Temperature is global and visitor-controlled. No route pins a
temperature.** Every route renders in whichever temperature is active for
that visitor — dark by default, warm after the ADR 0002 incantation,
persisted across navigation. 0009's per-route assignment is deleted, not
adjusted.

What 0009 was reaching for survives on a different axis: **routes are
differentiated by archetype, not temperature.** Mission 2 (`palette-spec.md`
§1) fixed two page archetypes — overview/map (card grids, chip badges,
section panels) and deep-dive editorial (sidebar, long-form column, callout
boxes, code panels) — each of which renders in both temperatures.

The public route set:

| Route | Archetype | Nav |
|---|---|---|
| `/` | overview | mark |
| `/writing/` · `/writing/[id]/` | overview · deep-dive | yes · child |
| `/he/writing/` · `/he/writing/[id]/` | overview · deep-dive (RTL) | yes · child |
| `/projects/` · `/projects/[id]/` | overview · deep-dive | yes · child |
| `/about/` | deep-dive | yes |
| `/colophon/` | deep-dive | footer only |
| `/contact/` | minimal | yes |
| `/404` · `/he/404` | minimal | no |

Plus non-page routes: `/rss.xml`, `/he/rss.xml`, `/sitemap-index.xml`, and
`/he/` as a redirect to `/he/writing/`. `/admin` and `/api/v1/*` answer on
the domain but are not public IA (ADR 0020) and are excluded from nav,
footer, sitemap, and feeds.

Decided at checkpoint 1 (Tal, 2026-07-21): `/colophon/` ships as a **living
page**, footer-linked; `/contact/` **stays a route**. `/projects/[id]/` is
generated **only for entries that carry a case study** — with two projects,
mandatory detail pages would manufacture thin pages.

## Consequences

- ADR 0009 is superseded by this ADR (status flip, pointer only).
- **The hidden theme stays hidden.** A default-warm `/about` would have
  shown every visitor the second theme on their first click, and would have
  required a second, competing source of truth for `data-theme` alongside
  the `localStorage` model fixed in `tokens-reference.md` §2. Both failures
  are structural, not stylistic.
- Page briefs and `navigation-spec.md` may never introduce a theme control,
  label, or hint — including on `/404`, the single most likely place on any
  site for a "try typing something" nudge.
- `/colophon/` carries a **maintenance contract**: Tal chose a living page
  over a dated article, and a stale colophon actively misinforms. Handed to
  Mission 5 as a named publish-time obligation.
- `/he/404` puts one piece of *page* routing in Caddy config
  (`handle_errors` on the `/he/*` prefix), which the static core otherwise
  does not need — a real seam between the static and proxy layers, recorded
  as one. Its mechanism is an owed scaffold-time verification.
- Routes rejected with reasons on the record (`sitemap.md` §4): `/uses`,
  `/now`, `/lab`, `/writing/tags/[tag]/` (deferred with a five-entry
  threshold; `tags` carried now so nothing migrates), `/resume`,
  `/speaking`, `/newsletter`, `/testimonials`, and a search page.

## Alternatives rejected

- **Keeping per-route temperatures.** Rejected as forced, not preferred:
  it cannot coexist with `active` ADR 0002. Put to Tal that way at
  checkpoint 1, with the note that overriding would require reopening 0002
  and escalating; he did not.
- **`/uses` and `/now`.** Both fail M1's binary anti-test — *if it could
  appear on any competent developer's portfolio unchanged, it fails* — and
  both carry silent staleness contracts. `/now` has the worst profile of
  any page considered: its entire value is being current. Its honest
  content is absorbed into `/about/`, where the same words make no currency
  promise.
- **`/lab`.** Deferred by emptiness, not rejected on principle: a lab page
  with nothing in it is worse than none, and it is the page most likely to
  become a graveyard of half-finished demos.
- **`/colophon/` as a dated article** at `/writing/how-this-site-is-built/`
  (surfaced mid-checkpoint). It would enter the feed and supersede
  naturally. Tal chose the living page: a colophon describes the *current*
  stack, an article is a *snapshot*. Also rejected: folding it into
  `/about/` (competes with the bio, and M1's accumulation rule keeps
  reference density near zero there) and shipping no page at all
  (infrastructure stays invisible to anyone who never opens the repo,
  weakening ADR 0012's showcase).
- **Folding `/contact/` into `/about/`, or footer-only.** Rejected because
  "open to translation requests and article suggestions from the Israeli
  dev community" needs a surface the footer cannot carry, and because
  "contact" is the one nav word visitors actively scan for. The page is
  thin by nature and that is recorded, not hidden.
- **Mandatory `/projects/[id]/` for every project.** Rejected: thin
  manufactured pages are worse than a rich card that links out.
