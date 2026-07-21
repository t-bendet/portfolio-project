---
id: 0023
title: Translated articles live in a Hebrew locale subtree with compliance-bound attribution
status: active
date: 2026-07-21
decided-by: tal
mission: mission-4
reopened-by: null
superseded-by: null
---

## Context

ADR 0010 (pre-workshop) put original and translated posts in one `/writing`
section behind a tab switcher with post-count badges. Tal reopened it,
proposing translated articles as a subsection instead. Mission 3 then
decided Astro 7.x with built-in i18n and manual RTL wiring (ADR 0019),
which changed which option was cheap.

At checkpoint 2 Tal supplied the primary source governing most of this
collection: the `CONTRIBUTING.md` of the blog Tal translates from
(Kent C. Dodds — `about-tal.md`), which publishes a **standing grant** for
translations. Read plainly it requires: publish the translation on your own
blog; open a PR upstream adding the translation link; and — *"the only
requirement"* — state at the **beginning** of the translation that it is a
translation, linking back to the original. That source materially changed
two answers rather than confirming them. Recorded as
`missions/04-information-architecture/outputs/content-model.md` §4.0.

## Decision

**Translations live in a Hebrew locale subtree: `/he/writing/` and
`/he/writing/[id]/`.** The framing Tal was asked and answered at checkpoint
1: the Hebrew work is *its own front door*, not a section inside the English
site. Astro i18n with `defaultLocale: 'en'`, `locales: ['en','he']`,
`prefixDefaultLocale: false`.

1. **`lang` and `dir` derive from the locale, never from frontmatter** —
   one source of truth for direction. This is what makes ADR 0011 checkable
   in CI: the Playwright stage asserts `html[lang="he"][dir="rtl"]` on a
   *route*, not on a rendered state.
2. **Two collections, not one with a discriminator.** `writing` (English
   originals) and `translations` (Hebrew, third-party originals). The
   `translations` schema makes `original.title`, `original.author`, and
   `original.url` **required**, so ADR 0010's preserved requirement becomes
   a build failure rather than a convention.
3. **The credit block sits above the article body**, with a fuller credit at
   the end. For the upstream author this is a **condition of the
   permission**, not an editorial preference — so it is not revisitable on
   taste. The CI assertion is tightened accordingly: it checks the credit
   *precedes the article body*, not merely that it is present.
4. **Self-canonical, no hreflang alternates.** A Hebrew translation is not a
   duplicate of an English original; `rel="canonical"` at the source would
   ask search engines to drop the Hebrew page from Hebrew results, defeating
   the section. There is also no English counterpart *on this site* to pair
   with.
5. **A required `rights` field** — `basis` (`standing-grant` | `licence` |
   `direct-permission`), `url`, `consultedAt` — recorded, not rendered.
6. **Translator's notes are allowed** as a visually distinct, explicitly
   labelled device, shipped as an MDX component scoped to `translations`.
7. **Latin slugs, Hebrew titles.** A Hebrew slug percent-encodes when
   copied, which is unshareable in exactly the channels this section exists
   to be shared in.
8. **Separate feeds.** `/rss.xml` (en) and `/he/rss.xml` (he); translation
   feed items carry the attribution in the item description, because a feed
   reader shows the item outside the page.

Reactions and view counts behave identically to English articles: the counts
measure *this page's* reception among Hebrew readers, which is the signal
the section exists to build.

## Consequences

- ADR 0010 is superseded by this ADR (status flip, pointer only). Its
  preserved requirement survives intact and is now enforced at three
  layers — schema (unpublishable without credit), CI (unrenderable with the
  credit in the wrong place), feed (unfeedable without credit in the item
  description). Its count badges survive as list metadata, not tab
  affordances.
- **The `he` locale is a deliberate partial localization** covering the
  writing section only. There is no Hebrew `/about/`, `/projects/`, or `/`,
  and there should not be — they do not exist as Hebrew content and
  machine-translating them would be exactly the fakeness this project's
  rules forbid. `navigation-spec.md` must show that seam honestly rather
  than hide it, and the footer's Hebrew link is persistent site-wide.
- The upstream grant's back-link PR obligation is **not** a content-model
  field; it is handed to Mission 5 as publish-time workflow.
- Tal publishing his *own* article in both languages is **designed for, not
  built** (M3's comments posture). It is the only case where hreflang
  alternates would be valid. The route shape already accommodates it —
  `/he/writing/` is a locale subtree, not a translations-only subtree.
- The grant is that author's, for his posts. It covers no one else, which is
  why `rights` exists: the first non-KCD translation cannot silently inherit
  terms that do not cover it.
- **This ADR narrows ADR 0019 on hreflang, and the divergence is recorded
  here rather than left for a reader to discover.** ADR 0019's Decision says
  "hreflang via @astrojs/sitemap"; decision 4 above says no hreflang
  alternates are emitted. Both are `active` and they instruct opposite
  markup, so the relationship is stated explicitly: **0019 chose the
  mechanism, 0023 finds it has nothing valid to declare.** That option pairs
  *translations of the same page*, and this site has no such pairs — a
  Hebrew article here translates a **third-party** English article that
  lives on someone else's domain, not a page on this site. Emitting an
  alternate would assert a false equivalence to search engines. This is a
  factual correction to an implementation note, not a reversal of 0019's
  framework or i18n decisions, so 0019 is **not** superseded and its status
  is untouched. If the case in the previous consequence ever lands — Tal's
  own article published in both languages — that pair *would* be a valid
  hreflang pair, and 0019's mechanism becomes usable for exactly those
  entries.

## Alternatives rejected

- **Tabs on `/writing/` (ADR 0010 as written).** Needs JS on a near-zero-JS
  static core (R1 was M3's top-weighted requirement), or it is two pages
  wearing one URL. No shareable URL for the translations list, nothing for a
  feed reader or search engine to index as a Hebrew surface, and the primary
  audience lands on an English page and must find a control.
- **Path subsection `/writing/translations/` — Tal's own reopening
  proposal.** Distinct URLs, but it nests Hebrew RTL content inside an
  English section's path and chrome: the index a Hebrew reader lands on
  speaks English to them, and the Hebrew work reads as an annex. It also
  fights Astro i18n, making `lang`/`dir` per-entry conditionals rather than
  route properties.
- **One merged chronological list with per-entry `dir`.** Each reader skims
  past roughly half the rows in a script they may not read, with rows
  flipping direction down the page.
- **`/he/translations/` as the path.** More literally accurate, but it makes
  one section carry different path names per locale for a string a Hebrew
  reader does not read anyway.
- **One collection with a `kind` discriminator.** Credit fields would have
  to be optional at the schema level, degrading "translations must have
  attribution" into a convention enforced by nobody.
- **`rel="canonical"` to the original.** See decision 4 — a well-known way
  to delete yourself from search results.
- **Suppressing reactions on translations** on the theory that the reaction
  belongs to the original author. Rejected: asymmetry would read as
  second-class treatment of the Hebrew work.
- **Credit at the end only, or top only.** End-only breaches the grant's
  condition outright and lets a reader consume the whole piece believing it
  is Tal's own thinking. Top-only puts the "read the original" link where
  the reader has not yet decided they want it.
- **`rights` as free text, or dropped.** Free text drifts across many
  entries citing the *same* standing grant; dropping it lets the first
  non-KCD translation inherit terms that do not apply.
- **A required `upstream` back-link field admitting `pending`.** It would
  make "which translations still owe a PR?" a grep. Rejected to keep the
  content schema about content, and because Mission 5 owns publish-time
  workflow.
