# Content Model — T://bendet

Mission 4 · 2026-07-21
**Status: hardened.** Checkpoint 2 happened 2026-07-21: Tal decided all open
calls in §4. During the checkpoint Tal supplied the upstream translation
terms that govern most of this collection (§4.0), which tightened two
requirements rather than merely confirming them.

Basis (law): `sitemap.md` (this mission, hardened at checkpoint 1); ADRs
0011, 0012, 0019, 0020; `missions/03-*/outputs/architecture-decision.md`
§1–2; `missions/02-*/outputs/typography-spec.md` §6–7 (RTL type rules).
Input only: ADR 0010 (reopened) — its **preserved requirement** is carried
forward intact and is specified in §4.

API facts re-verified against current Astro documentation on 2026-07-21
(Context7, `/withastro/docs`): collections are declared in
`src/content.config.ts` with `defineCollection`; loaders come from
`astro/loaders`; Zod is re-exported as `astro/zod`; `render()` is imported
from `astro:content`; entries expose **`id`**, not `slug`. This matches M3's
verification-report Q6 and is not inherited from memory.

---

## 1. Shape

Three collections, file-based, typed at build time. Every public page in
`sitemap.md` is either a static page with no collection behind it (`/`,
`/about/`, `/colophon/`, `/contact/`, `/404`) or a view over one of these
three.

| Collection | Holds | Locale | Routes it generates |
|---|---|---|---|
| `writing` | Tal's own articles | `en` | `/writing/`, `/writing/[id]/` |
| `translations` | Hebrew translations of third-party articles | `he` | `/he/writing/`, `/he/writing/[id]/` |
| `projects` | Project entries | `en` | `/projects/`, `/projects/[id]/` (conditional — §3.3) |

### Why `writing` and `translations` are two collections, not one with a flag

This is the load-bearing modelling decision and it is made for a mechanical
reason, not a taxonomic one.

ADR 0010's preserved requirement says translated posts **must** credit the
original article and author. With one collection and a `kind: original |
translation` discriminator, the credit fields have to be optional at the
schema level (originals must not carry them), and "translations must have
attribution" degrades into a convention enforced by nobody — the exact
class of rule that silently rots.

With two collections, the `translations` schema makes
`original.title`, `original.author`, and `original.url` **required**. A
translation missing attribution is a **build failure**, not a review
comment. ADR 0010's requirement becomes mechanically enforced by the type
system, which is the strongest form available.

Secondary benefits, none of them decisive on their own: the two feeds (§7)
are a straight `getCollection` call each; the two indexes never filter; and
`getCollection('translations')` cannot accidentally return an English post.

**The honest cost:** any operation genuinely spanning both — "everything
Tal published in 2026", a combined archive — needs two calls and a merge.
No such surface exists in `sitemap.md`, and if one is ever added, the merge
is a few lines. Accepted.

---

## 2. Identity, and the contract with the database

ADR 0020 stores view events and reactions keyed to an article. That key is
a cross-system contract between a static build and a Postgres row, so it is
specified here rather than discovered in Phase 2.

**The key is `<collection>:<id>` — for example `writing:design-system-nobody-hates`,
`translations:aha-programming`.** Rules:

1. **Namespaced by collection**, because bare `id` collides: an original
   and a translation may legitimately share a slug stem, and un-namespaced
   keys would silently merge their counts.
2. **Derived from the filename**, which is the Astro `id`. Stable across
   title edits, tag edits, and rewrites.
3. **Never the URL path.** Paths carry the locale prefix and a
   `trailingSlash` convention; both are presentation. A path-keyed row
   breaks if either changes, and `sitemap.md` §1 already flags that two
   spellings of one page would split its counts.
4. **Renaming a file is a data migration, not a rename.** Recorded as a
   standing rule: if an entry's `id` must change, the old key's rows are
   migrated in the same change or the history is knowingly abandoned. This
   is the price of stable keys and it is cheaper than the alternative.
5. Keys are opaque to the API. The API never parses them and never needs
   the content — it stores counts against strings.

This satisfies M3's "articles referenced by stable content `id` (Q6) so
comments tables can arrive later without reshaping anything" — a future
comments table joins on the same key.

---

## 3. Schemas

Illustrative TypeScript, normative in content. Phase 2 writes the real file;
these field sets, requirednesses, and defaults are binding.

```ts
// app/web/src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
```

### 3.1 `writing` — Tal's own articles (English)

```ts
const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/[^_]*.{md,mdx}' }),
  schema: z.object({
    title:       z.string(),
    description: z.string(),      // list subtitle AND meta description — one string, no duplication
    pubDate:     z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags:        z.array(z.string()).default([]),
    draft:       z.boolean().default(false),
  }),
});
```

- **No `lang` or `dir` field** — see §5. Direction has one source of truth
  and frontmatter is not it.
- **No `author` field.** Every entry in this collection is Tal's. A field
  that always holds the same value is a place for it to one day be wrong.
- **`description` is required** and does double duty. Optional descriptions
  produce list rows that are sometimes bare and sometimes not, which is the
  kind of inconsistency this project's own design-system discipline
  (`identity-thesis.md`: "consistency treated as a feature") should not
  ship.
- **`draft`** is filtered out of production builds
  (`import.meta.env.PROD ? data.draft !== true : true` — the documented
  pattern), so drafts are visible in `pnpm astro dev` and absent from the
  build. They must also be excluded from feeds and the sitemap.

### 3.2 `translations` — Hebrew translations (third-party originals)

```ts
const translations = defineCollection({
  loader: glob({ base: './src/content/translations', pattern: '**/[^_]*.{md,mdx}' }),
  schema: z.object({
    title:       z.string(),      // Hebrew — what the reader sees
    description: z.string(),      // Hebrew
    pubDate:     z.coerce.date(), // when the TRANSLATION was published here
    updatedDate: z.coerce.date().optional(),
    tags:        z.array(z.string()).default([]),
    draft:       z.boolean().default(false),

    // Attribution — required by ADR 0010's preserved requirement.
    original: z.object({
      title:       z.string(),           // the English title, verbatim
      author:      z.string(),
      url:         z.string().url(),
      publishedAt: z.coerce.date().optional(),
    }),

    // On what basis this translation may be published (§4.6).
    rights: z.object({
      basis:       z.enum(['standing-grant', 'licence', 'direct-permission']),
      url:         z.string().url().optional(),   // required for the first two — see refine
      consultedAt: z.coerce.date(),
    }),
  }),
});
```

- **The `original` object is required in full.** No partial credit: an
  entry naming the author but not linking the source, or linking the source
  without naming the author, fails the build.
- **`id` (the filename) is Latin, derived from the original English
  article** — `sitemap.md` §3. `title` is Hebrew. This is why `id` and
  `title` are allowed to look unrelated here and nowhere else.
- **`pubDate` is the translation's date**, not the original's. The
  original's date is `original.publishedAt`, optional, and is genuinely
  useful: a reader deserves to know they are reading a translation of a
  2019 article.

### 3.3 `projects`

```ts
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/[^_]*.{md,mdx}' }),
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    stack:       z.array(z.string()).default([]),  // rendered as chip badges
    repoUrl:     z.string().url().optional(),
    liveUrl:     z.string().url().optional(),
    order:       z.number().default(0),            // manual ordering; projects are not chronological
    caseStudy:   z.boolean().default(false),       // see below
    draft:       z.boolean().default(false),
  }),
});
```

- **`caseStudy` decides whether a detail route exists** (`sitemap.md` §2
  row 7): `true` → `/projects/[id]/` is generated and the card links
  inward; `false` → no route, and the card links to `liveUrl ?? repoUrl`.
- **Guard required:** `caseStudy: true` with an empty body would generate
  the thin page the route decision exists to prevent. Phase 2 adds a
  build-time assertion that the two agree. *Owed verification at scaffold:*
  whether the glob loader exposes raw `body` on the entry object at
  `getStaticPaths` time, or whether the check must run over the source
  files instead. Flagged rather than assumed, per M3's discipline.
- **`order`, not `pubDate`.** Projects are a curated set, not a timeline;
  two entries today means the ordering is editorial.
- **At least one of `repoUrl` / `liveUrl` should be present** when
  `caseStudy` is `false`, or the card links nowhere. Zod `.refine()` on the
  object, not a separate rule.

---

## 4. The translated-article model

**DECIDED at checkpoint 2 (Tal, 2026-07-21).** Each subsection records the
decision and the alternatives rejected.

### 4.0 The upstream terms — primary source, supplied by Tal at checkpoint 2

Most of this collection will be translations of Kent C. Dodds's articles
(`about-tal.md`). At checkpoint 2 Tal supplied that blog's
`CONTRIBUTING.md`, which publishes a **standing grant** for translations.
Read plainly, it says:

1. Translations are welcome; **publish the translation on your own blog** —
   he explicitly does not manage translations in his repository.
2. **Open a PR on his repo** adding your translation to that post's
   `translations:` frontmatter (language, link, translator name, translator
   link).
3. *"The only requirement is that at the beginning of your translation, you
   explain that it is a translation of the original post and link back to
   the original post."*

Three consequences, and none of them is cosmetic:

- **Condition 1 independently corroborates checkpoint 1.** "On your own
  blog" is what `/he/writing/` is. Had this model chosen to contribute
  translations upstream instead, it would have been building something the
  upstream author has said he will not accept.
- **Condition 3 converts §4.3 from an editorial preference into a
  compliance requirement.** The credit block above the body is not merely
  the honest choice — for this author it is *the condition on which the
  permission rests*. The CI assertion is tightened accordingly (§5).
- **Condition 2 creates a per-translation obligation that is not a content
  property**, and is therefore handed to Mission 5 (§9).

**Scope caution, stated because it is easy to over-read:** this grant is
that author's, for his posts. It says nothing about any other author. The
`rights` field (§4.6) exists precisely so the first non-KCD translation
cannot silently inherit terms that do not cover it. This document reads the
grant in plain language and records what it says; it is not legal advice.

### 4.1 What is settled, and not open

These follow from active ADRs and are not checkpoint questions:

- **Renders `<html lang="he" dir="rtl">`** (ADR 0011, ADR 0010 preserved
  requirement). Mechanism in §5.
- **Credits the original article and its author** (same). Placement and
  prominence are OPEN 2.1.
- **Code blocks stay `dir="ltr"`** inside the RTL page
  (typography-spec §7.1) — code is notation, not prose.
- **The `T://bendet` mark is never translated or transliterated** in the
  eyebrow or anywhere else (ADR 0001, typography-spec §6). The section
  segment may be Hebrew.
- **Reactions and view counts behave exactly as on English articles**
  (ADR 0020). Considered and rejected: suppressing reactions on
  translations on the theory that the reaction belongs to the original
  author's work. Rejected because the counts measure *this page's*
  reception among Hebrew readers, which is precisely the signal the section
  exists to build, and asymmetry here would read as second-class treatment
  of the Hebrew work.

### 4.2 Canonical URL — settled here, deliberately

**The translation is self-canonical. It does NOT set `rel="canonical"` to
the original English article.**

This looks like an attribution question and is actually a correctness one.
`rel="canonical"` asserts *this page is a duplicate of that one, index that
one instead*. A Hebrew translation is not a duplicate of an English
original — different language, different audience, different search
queries. Pointing canonical at the original would ask search engines to
drop the Hebrew page from Hebrew results, which defeats the entire purpose
of the section and of checkpoint 1's "own front door" decision.

The original is credited and linked in prose (§4.3), which is the correct
mechanism for "this came from there". Cross-language duplication is not a
thing `canonical` is for, and using it that way is a well-known way to
delete yourself from search results.

Consistent with `sitemap.md` §2 row 13: no hreflang alternates either, for
the related reason that the English counterpart is not on this site.

### 4.3 The credit block — DECIDED: above the body, plus a fuller credit at the end

**A compact block ABOVE the article body, and a fuller credit at the end.**

Contents of the opening block:

- that this is a translation, in Hebrew, in plain words
- the original article's title, as a link to `original.url`
- the original author's name
- the original's publication date, when `original.publishedAt` is set

The closing credit repeats the link with a "read the original" pointer,
where acting on it is natural.

**Two independent reasons, and the second is binding.** The first is
ethical: a reader who reaches the last paragraph and only then learns they
were reading someone else's work was misled by omission, even if nothing
false was printed — attribution belongs before the reader invests
attention. The second, discovered at checkpoint 2 (§4.0), is that the
upstream grant *requires* the notice at the beginning. So the placement is
not a preference the site may revisit on taste; changing it would put the
translations outside the terms they are published under.

**Script note:** the block reads in Hebrew, but `original.title` and
`original.author` stay in Latin script — they are the original's own title
and a proper name. A consequence worth having: compliance with condition 3
is legible to someone who cannot read Hebrew, because the linked English
title and the author's name are visible in a Hebrew sentence.

**Rejected:** *top block only* (the "read the original" link then sits
where the reader has not yet decided they want it, and is gone by the time
they might); *end of article only* (a reader can consume the entire piece
believing it is Tal's own thinking, and it would breach condition 3
outright).

### 4.4 Translator's notes — DECIDED: allowed, visually distinct, labelled

**Yes, as a visually distinct and explicitly labelled device.** The
labelling requirement is what keeps it honest: the reader must never be
unsure whose sentence they are reading. This is genuinely useful for terms
with no settled Hebrew equivalent, which is a real and frequent problem in
Hebrew technical writing, and it is the reason a reader would choose Tal's
translation over machine output.

**Rejected:** *no notes at all* (leaves untranslatable terms handled
awkwardly inline, and gives Tal's actual expertise no outlet on the page);
*a single note block at the end only* (no way to gloss a term at the point
where it confuses the reader, which is where a gloss is useful).

**This does not violate the no-explained-references rule.** The symbol
map's ban is on explaining *easter eggs and symbolic references*. A
translator's note is editorial apparatus in a translation — the opposite
case, and one where labelling is the honest act rather than the
disqualifying one.

If allowed, it ships as a named MDX component (available only inside
`translations`), so the boundary is enforced by import, not by discipline.

### 4.5 Tal's own articles in both languages — DECIDED: designed for, not built

The model currently assumes: `writing` is English-original, `translations`
is Hebrew-from-third-parties. There is a third thing that does not exist
yet and plausibly will — **Tal writes his own article and publishes it in
both English and Hebrew.**

That case is different from both collections: the Hebrew version is neither
a third-party translation (no external author to credit) nor a separate
article (it *is* the same piece). It is also the **only** case in this
entire model where `hreflang` alternates are genuinely valid, because the
two pages really are translations of each other.

**Design for it, do not build it** — the same posture M3 took toward
comments, for the same reason (headroom is nearly free, the feature is
not). Concretely, designing-for costs one optional field on `writing`:

```ts
// on `writing`, added when the case first occurs — not now:
// hebrewVersion: z.string().optional(),   // id of the he-locale twin
```

Nothing is added today. What is decided today is that the *route shape*
already accommodates it (`/he/writing/[id]/` is a locale subtree, not a
translations-only subtree), so the case can land later as a third content
source under the existing `he` locale without reshaping routes, keys, or
feeds. Recording it now also prevents a future self from assuming
`/he/writing/*` implies third-party attribution.

**Rejected:** *build it now* (real machinery, plus `hreflang` emitted for
zero actual pairs, for content that does not exist); *foreclose it* (Tal is
bilingual and writes — a likely enough future that closing the door only
makes the eventual answer a bigger change).

### 4.6 The `rights` field — DECIDED: small structured field, not rendered

```ts
rights: {
  basis:       'standing-grant' | 'licence' | 'direct-permission',
  url?:        string,   // required for standing-grant and licence
  consultedAt: Date,
}
```

Required on every entry, **not rendered on the page**. The record is
findable in the repo, which is public, by anyone who wants to check.

ADR 0010 requires *credit*. Credit and permission are different things, and
a model that mechanically enforces the first while staying silent on the
second implies the second does not matter. Requiring the field makes the
question unskippable at the cost of three lines per entry.

**Why structured rather than free text.** The checkpoint's own finding
(§4.0) is what settles this: the dominant case is not per-article
negotiation, it is **one standing grant covering many entries**. Free text
across a dozen entries citing the same grant will drift — entry 1 reads
"standing grant, CONTRIBUTING.md", entry 7 reads "ok per his repo", and
nothing can check either. The enum names the three real bases; `url` points
at the grant or licence itself.

**Why `consultedAt` is not over-precision.** A grant published in a
repository can be edited or withdrawn — this one lives in a
`CONTRIBUTING.md` that its author revises freely. What protects a
translation published under it is the record of *which version was relied
on and when*. That is the single most useful thing in the field.

**Rejected:** *rendered on the page* (puts legal bookkeeping in the
reader's face, and the phrasing is awkward when the basis is a private
exchange); *drop the field* (the first non-KCD translation would silently
inherit terms that do not cover it, and nothing in the system would ask).

### 4.7 The upstream back-link — NOT modelled here (handed to Mission 5)

The grant's condition 2 (§4.0) asks the translator to open a PR on the
original repo adding the translation's link. **Decided: this is not a
content-model field.** It is publish-time workflow state, not a property of
the content, and it is handed to Mission 5 as a named obligation (§9).

Recorded because the alternative was live and is worth being able to
revisit: a required `upstream` field admitting the literal value `pending`
would make "which translations still owe an upstream PR?" a grep over the
content directory. It was rejected to keep the content schema about
content, and because M5 is the mission that owns publish-time workflow —
pre-empting it here would be M4 legislating outside its brief. The
obligation does not disappear; it moves to where it can actually be
enforced.

---

## 5. RTL rendering contract (ADR 0011)

**One source of truth for direction: the locale.** Not frontmatter, not a
per-entry field, not content sniffing.

| Locale | Prefix | `lang` | `dir` |
|---|---|---|---|
| `en` (default) | none | `en` | `ltr` |
| `he` | `/he/` | `he` | `rtl` |

```js
// astro.config — shape only; Phase 2 writes it
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'he'],
  routing: { prefixDefaultLocale: false },
}
```

`prefixDefaultLocale: false` gives exactly the tree checkpoint 1 decided:
English at the root, Hebrew under `/he/`. **Astro's i18n is
direction-agnostic** (M3 verification-report Q10, re-confirmed against
current docs today: the documented recipe sets `lang` from the URL and says
nothing about `dir`). So `dir` is derived in the layout from the resolved
locale and set on `<html>` alongside `lang` — one place, both attributes,
never separately.

### Binding rules

1. **`dir` is set once, on `<html>`.** No component sets `dir` except the
   two documented exceptions below. A component that needs to know the
   direction reads it; it does not decide it.
2. **Exception — code.** `pre`/`code` carry `dir="ltr"` unconditionally
   (typography-spec §7.1). Inline Hebrew inside a comment or string renders
   via the companion face within the LTR block.
3. **Exception — the mark.** `T://bendet` is an LTR run inside RTL prose;
   rely on Unicode bidi, with `<bdi>` as the fallback if QA finds the
   `://` misordered (typography-spec §6).
4. **No physical-side CSS anywhere in content rendering.** Logical
   properties only — `border-inline-start`, `padding-inline`,
   `margin-inline`, `text-align: start` (tokens-reference §5,
   palette-spec §8). This is already law at the token layer; restated here
   because content components are where it gets violated.
5. **Hebrew eyebrow segments carry no `text-transform` and
   `letter-spacing: normal`** — Hebrew is unicameral and 0.2em tracking is
   a Latin-caps idiom (typography-spec §6).
6. **Numerals and URLs** inside Hebrew prose are LTR runs; bidi defaults
   handle them, isolate where QA shows otherwise.

### What CI asserts (ADR 0011's named pipeline stage)

M3 already scoped this stage; M4 fixes what it checks, so it is not
invented in Phase 2:

1. A translated-article fixture route renders `html[lang="he"][dir="rtl"]`.
2. The **credit is present and precedes the article body** — the original
   author's name and a link to `original.url` both appear, and both appear
   *before* the first element of the article content, not merely somewhere
   on the page.
3. Every `pre`/`code` on that page resolves to `dir="ltr"`.
4. RTL screenshot baseline comparison.
5. **No horizontal overflow** at the standard viewport widths — the single
   most common way an LTR-designed layout fails under `dir="rtl"`, and
   cheap to assert.

Items 2, 3 and 5 are M4 additions to M3's stage description.

**Item 2's ordering clause is a checkpoint-2 tightening, and it is the one
assertion here that is not merely good practice.** M3 described this stage
as checking that the credit "is present". The upstream grant (§4.0,
condition 3) requires the notice *at the beginning* of the translation — so
a page carrying its only credit in the footer would pass a
presence-only check while sitting outside the terms it is published under.
The assertion has to encode position, or it is not testing the actual
obligation.

Attribution is now enforced at three layers: the schema makes it
unpublishable without credit fields (§1), CI makes it unrenderable without
credit *in the right place* (here), and §7 makes it unfeedable without
credit in the item description.

---

## 6. Dynamic-layer touchpoints (ADR 0020)

Where the API meets content, and the invariant that governs it.

| Surface | Reads | Writes | Degrades to |
|---|---|---|---|
| `/writing/[id]/` | view count, reactions | view event, reaction | absence |
| `/he/writing/[id]/` | view count, reactions | view event, reaction | absence |
| `/projects/[id]/` | — | view event | absence |
| `/writing/`, `/he/writing/` | view counts (optional) | — | absence |
| everything else | — | — | — |

**The invariant, restated from ADR 0019 because it constrains composition:
no layout may reserve space that only the API can fill.** A count that
fails to load leaves no gap, no spinner, no "—", no skeleton. It is
absent, and the page reads as though it never offered one. This is a
composition rule, so it is repeated in every affected page brief.

**Reaction vocabulary:** a small fixed enum shared by the page and the API,
additive-only, never free text. The exact members are a copy decision and
are deliberately not fixed here; the *contract* is fixed here — fixed set,
no user-supplied strings (which would be an unmoderated content surface,
and ADR 0020 defers exactly that class of thing), and adding a member is a
migration, not a config edit.

---

## 7. Feeds

Two feeds, per `sitemap.md` §2 row 12.

| Feed | Source | `language` |
|---|---|---|
| `/rss.xml` | `writing`, non-draft, by `pubDate` desc | `en` |
| `/he/rss.xml` | `translations`, non-draft, by `pubDate` desc | `he` |

- Each item: title, description, `pubDate`, absolute link.
- **Translation items carry the attribution in the item description** —
  a feed reader shows the item outside the page, so the credit must
  survive the trip. This is the one place where credit exists outside §4.3's
  block, and it is required for the same reason the block is.
- Drafts never appear. Projects have no feed.

---

## 8. Deliberately not modelled

- **Tag indexes** — deferred with the threshold recorded in `sitemap.md` §4
  (revisit at five entries under one tag). `tags` is carried now so nothing
  migrates later.
- **Series / multi-part articles** — no such content exists. Would be an
  optional field on `writing` when it does.
- **Comments** — ADR 0020 defers them; §2's key contract is what keeps them
  cheap to add.
- **An `author` field anywhere except `translations.original.author`** —
  there is one author. See §3.1.
- **Reading time, word count** — derivable at build time if ever wanted;
  storing them is a stale-data generator.
- **A `lang` field on any entry** — §5.
- **The upstream back-link PR state** — §4.7; handed to Mission 5.

---

## 9. Obligations handed to Mission 5

Two per-translation obligations are real, recurring, and deliberately not
solved here. Both are publish-time workflow, which is M5's brief.

1. **The upstream back-link PR** (§4.0 condition 2, §4.7). Every
   translation of a Kent C. Dodds article owes a PR to that repo adding the
   translation link to the post's `translations:` frontmatter — language,
   link, translator name, translator link. This is the obligation most
   likely to be skipped at article #7, and nothing in the content model
   will catch it.
2. **Keeping `/colophon/` current** (`sitemap.md` §2 row 9). Tal accepted
   the maintenance contract when he chose a living page over a dated
   article; a stale colophon actively misinforms.

Recorded here rather than only in STATUS.md so they survive into M5's input
manifest as content-level facts.
