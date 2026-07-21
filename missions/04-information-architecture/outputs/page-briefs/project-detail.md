# Page Brief — Project case study (`/projects/[id]/`)

Mission 4 · 2026-07-21

| | |
|---|---|
| Route | `/projects/[id]/` — **conditional**: generated only when `caseStudy: true` (`content-model.md` §3.3, `sitemap.md` §2 row 7) |
| Archetype | deep-dive editorial |
| Collection | `projects` |
| `lang` / `dir` | `en` / `ltr` |
| Dynamic layer | **view event POST only.** No reactions (ADR 0020 scopes reactions to articles); nothing rendered from the API |
| Analytics key | `projects:<id>` (`content-model.md` §2) |
| Feed | none — projects have no feed (`content-model.md` §7) |
| Chrome | per `navigation-spec.md`; eyebrow `T://bendet · projects` |

Basis (law): `sitemap.md` §2 row 7 · `content-model.md` §2, §3.3, §6, §7 ·
ADR 0020 · `palette-spec.md` §7.3 (callout idiom).

---

## 1. Goal

This page exists only where depth genuinely exists. It serves the reader who
saw a card, wanted to know how the thing was actually built, and is willing
to read — the same reader the articles serve, arriving through a different
door. Its content is a build narrative in the honest-tradeoff register: what
the problem was, what was chosen, what it cost, what was rejected. That
register is not decoration here; it is the reason the page is allowed to
exist at all, because `sitemap.md` §2 row 7 makes the alternative explicit —
with two projects, a mandatory thin detail page is worse than a rich card
that links out.

## 2. Sections (ordered)

| # | Section | What it must do | Conditional? |
|---|---|---|---|
| 1 | Global header | eyebrow + nav | always |
| 2 | Page header | `h1` = `title`; lede = `description`; `stack` chips | always |
| 3 | Destination links | `repoUrl` and/or `liveUrl`, each disclosed as leaving the site | each shown only when set |
| 4 | In-page contents | the case study's `h2`s as anchors, sticky sidebar column, ≥3 `h2`s threshold — identical rules to `writing-article.md` §2.2 | conditional |
| 5 | Body | the MDX case study: code panels (`dir="ltr"` unconditionally), callouts, comparison tables | always |
| 6 | End matter | the destination links again, where acting on them is natural; a link back to `/projects/` | always |
| 7 | Footer | per `navigation-spec.md` §4 | always |

**Body register (binding, and the page's reason to exist).** Every claim about
a technical choice is paired with what it cost or what it replaced. A section
that only lists what was used is the failure mode this page shares with
`/colophon/` (`sitemap.md` §2 row 9's standing risk), and the same test
applies: a sentence that only says what was used does not belong.

**No promotional framing of any technology** — including the ones this
project chose (CLAUDE.md, hard rule). "Blazing fast", "modern", "best-in-class"
are the register this page must not enter.

## 3. States

| State | Trigger | What renders |
|---|---|---|
| **Populated** | `caseStudy: true` with a body | sections 1–7 |
| **Repo only** | `liveUrl` unset | the live link is simply absent — no disabled control, no "coming soon" |
| **Live only** | `repoUrl` unset | same, mirrored. A closed-source project is honest; a greyed-out repo button is not |
| **Short case study** | <3 `h2`s | no contents sidebar; the column takes the full measure |
| **Degraded — API down** | view-event POST fails | **nothing observable.** The page renders no API-fed content, so there is nothing to degrade |
| **Degraded — no JS** | scripts blocked | the entire case study reads; the view event is simply not recorded |
| **Draft** | `draft: true` | no route in production |
| **Error** | `caseStudy: false` or bad `id` | the route was never generated → `/404` |

## 4. Empty states

**This page has no empty state by construction, and that is a decision with a
mechanism behind it.** `content-model.md` §3.3 requires a build-time
assertion that `caseStudy: true` and a non-empty body agree — an entry
claiming a case study without one is a build failure. So the thin-page
outcome that `sitemap.md` §2 row 7 exists to prevent cannot be reached by
accident; it can only be reached by deleting the guard.

(The content model flags one owed verification at scaffold time: whether the
glob loader exposes raw `body` at `getStaticPaths` time or the check must run
over source files instead. That is an implementation question, not an IA one,
but the guard is load-bearing for this brief and must not be quietly
dropped if the first approach fails.)

The absences that do exist are listed in §3, under one rule: **an absent
thing renders nothing.** A missing `liveUrl` produces no element at all — not
a disabled button, not a "demo coming soon", not a link to a screenshot of
what a demo would look like.

## 5. The dynamic layer

`content-model.md` §6 gives this route: writes a view event, reads nothing,
degrades to absence.

**INV-1 — no layout may reserve space that only the API can fill.** It binds
here trivially and is restated anyway, because this is the page where someone
will eventually think a view counter would be a nice touch: nothing on this
page displays anything sourced from the API, so no container, label, or
placeholder for such a thing may exist in the static HTML.

**No reactions here.** ADR 0020 scopes reactions to articles, and
`content-model.md` §6's table gives this route no reaction column. A project
page is not asking the reader for a response; the destination links are the
call to action, and they are the visitor's own.

If a count is ever added, INV-2 applies unchanged: append-only, last child,
its own label and separators, absent on failure.

## 6. Rejected alternatives

- **Generating a detail route for every project** so the card grid behaves
  uniformly. Rejected in `sitemap.md` §2 row 7; the cost lands on
  `projects-index.md` §2.2 as a disclosure requirement.
- **A screenshot gallery.** No image treatment exists in the design system
  (`motion-and-texture.md` §2 bans frames, shadows, and ornament), and a
  gallery would carry the page instead of the writing carrying it. Images
  inside the body, in service of an explanation, are fine.
- **Live status / uptime badges for the deployed project.** A third-party
  runtime dependency on a static page and a public failure surface Tal does
  not control.
- **Reactions on case studies.** Would need an ADR 0020 amendment; also
  dilutes the signal on articles, which is where reception actually matters.
