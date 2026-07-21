---
id: 0024
title: Content model — three typed collections and a namespaced analytics key contract
status: active
date: 2026-07-21
decided-by: mission-4
mission: mission-4
reopened-by: null
superseded-by: null
---

## Context

ADR 0019 fixed Astro 7.x with typed content collections and MDX; ADR 0020
fixed a dynamic layer that stores view events and reactions keyed to an
article. Nothing yet specified what the collections are, what their schemas
require, or — critically — **what string the static build and the Postgres
row agree on**. That last one is a cross-system contract between a build
artifact and a database, and discovering it in Phase 2 would mean
discovering it after rows exist.

API facts were re-verified against current Astro documentation on
2026-07-21 rather than inherited: collections are declared in
`src/content.config.ts` with `defineCollection`; loaders come from
`astro/loaders`; Zod is re-exported as `astro/zod`; `render()` is imported
from `astro:content`; entries expose **`id`**, not `slug`. This matches M3's
verification-report Q6.

Full record: `missions/04-information-architecture/outputs/content-model.md`.

## Decision

**Three file-based, build-time-typed collections:** `writing` (Tal's English
articles), `translations` (Hebrew translations of third-party articles — see
ADR 0023), and `projects`. Every public route is either a static page with no
collection behind it or a view over one of these three.

**The analytics key is `<collection>:<id>`** — for example
`writing:design-system-nobody-hates`, `translations:aha-programming`. Rules:

1. **Namespaced by collection**, because a bare `id` collides: an original
   and a translation may legitimately share a slug stem, and un-namespaced
   keys would silently merge their counts.
2. **Derived from the filename** (the Astro `id`) — stable across title
   edits, tag edits, and rewrites.
3. **Never the URL path.** Paths carry a locale prefix and a `trailingSlash`
   convention; both are presentation, and a path-keyed row breaks if either
   changes.
4. **Renaming a file is a data migration**, not a rename. If an entry's `id`
   must change, the old key's rows are migrated in the same change or the
   history is knowingly abandoned.
5. Keys are opaque to the API — it stores counts against strings and never
   parses them or needs the content.

**Schema rules that are load-bearing rather than incidental:**

- `description` is **required** on every entry and does double duty (list
  subtitle and meta description). Optional descriptions produce list rows
  that are sometimes bare and sometimes not.
- **No `lang` or `dir` field on any entry** — direction derives from the
  locale (ADR 0023).
- **No `author` field** except `translations.original.author`. A field that
  always holds the same value is a place for it to one day be wrong.
- `projects.caseStudy` decides whether a detail route is generated at all;
  `projects.order` rather than a date, because projects are a curated set,
  not a timeline.
- `draft` entries are visible in dev, absent from production builds, feeds,
  and the sitemap.

**The composition invariant the dynamic layer imposes: no layout may reserve
space that only the API can fill.** A count or reaction that fails to load
leaves no gap, no spinner, no em-dash, no skeleton — it is absent and the
page reads as though it never offered one. This is stated here because it
constrains every page brief that touches the API, and it is the IA-level
expression of ADR 0019's guarantee that public pages survive the dynamic
layer dying.

**Reaction vocabulary** is a small fixed enum shared by page and API,
additive-only, never free text — user-supplied strings would be an
unmoderated content surface, which is exactly the class of thing ADR 0020
defers.

## Consequences

- A future comments table (ADR 0020, deferred) joins on the same
  `<collection>:<id>` key, which is what M3 meant by "articles referenced by
  stable content `id` so comments tables can arrive later without reshaping
  anything."
- **View events fire on the three content detail routes and on `/`, and
  nowhere else.** A write is a fire-and-forget beacon that creates no
  rendering dependency, so the boundary is not about dependency. It is about
  **who consumes the data**: ADR 0020 names exactly two consumers — a
  per-article view and a per-referrer view — and these four routes are
  precisely the pages those consumers describe. `/` is included because
  per-referrer aggregation is worth most at the site's entry point; the
  excluded pages are navigational or terminal and answer no question the
  dashboard poses. **Accepted cost, named:** no traffic data for `/about/`,
  `/colophon/`, `/contact/`, `/projects/`, the two writing indexes, or the
  404s. (Note for accuracy: the excluded routes are **not** zero-JS — every
  public page carries the ADR 0002 theme mechanism's inline head script per
  `tokens-reference.md` §2. What a beacon adds is an outbound request and a
  dependency on a service that can be down, not a page's first script.) The 404s are excluded additionally on data-model
  grounds — an event there could record that *a* 404 occurred but not
  *which URL broke*, and making it record that would mean storing arbitrary
  visitor-supplied paths, pushing against ADR 0020's "nothing stored
  identifies a visitor".
- **Decision rule 3 ("never the URL path") holds without exception.** Static
  pages that emit events use a reserved `page:` namespace with an explicitly
  assigned name — currently `page:home` alone — not their URL. A static
  page's key is therefore a name this model assigns, which no presentation
  decision can respell.
- `trailingSlash` must be configured to one form and enforced, because both
  the feed and the analytics key path-adjacent surfaces would otherwise
  admit two spellings of one page. The non-canonical spelling must redirect,
  never reach the 404.
- **Owed scaffold-time verification:** whether the glob loader exposes raw
  `body` on the entry at `getStaticPaths` time, which determines how the
  `caseStudy`-versus-empty-body build guard is implemented. Flagged rather
  than assumed. If that approach fails, the guard must be re-implemented,
  not quietly dropped — otherwise the thin-page outcome ADR 0022 exists to
  prevent becomes reachable by accident.
- Deliberately not modelled: tag indexes (deferred, `tags` carried now),
  series, comments, reading time and word count (derivable; storing them
  generates stale data), and the upstream back-link state (Mission 5).

## Alternatives rejected

- **A single `content` collection with a `kind` discriminator.** Credit
  fields would be optional at the schema level, so ADR 0010's preserved
  requirement would degrade into a convention. Cost of the split, accepted:
  any surface genuinely spanning both languages needs two calls and a merge
  — and no such surface exists.
- **Keying analytics on the URL path.** Simplest to implement and the
  obvious instinct, since the API already receives a path. Rejected because
  presentation decisions (locale prefix, trailing slash, a future route
  rename) would silently split or orphan a page's history.
- **Un-namespaced `id` as the key.** Rejected on the collision case above,
  which is not hypothetical: a translation's slug is derived from the
  original English article and can coincide with an original's slug.
- **Optional `description`.** Rejected on consistency grounds — this is a
  design-system builder's own site, and inconsistent list rows are the
  visible symptom of an optional field nobody fills.
- **Deriving `caseStudy` from body emptiness alone.** Fragile at
  `getStaticPaths` time; an explicit boolean plus a build-time guard that
  the two agree is the checkable version.
- **Placeholder or skeleton UI for pending API values.** Rejected by the
  invariant above: it converts an invisible degradation into a visible
  broken state on a page that is otherwise complete.
