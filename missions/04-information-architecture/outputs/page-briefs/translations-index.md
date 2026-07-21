# Page Brief — Translations index (`/he/writing/`)

Mission 4 · 2026-07-21

| | |
|---|---|
| Route | `/he/writing/` — the Hebrew front door (checkpoint 1, `sitemap.md` §3) |
| Archetype | overview, rendered `dir="rtl"` (`sitemap.md` §2 row 4) |
| Collection | `translations` (`content-model.md` §3.2), non-draft, `pubDate` desc |
| `lang` / `dir` | `he` / `rtl` — set on `<html>`, derived from the locale (`content-model.md` §5) |
| Chrome language | Hebrew, except the mark and the four English nav labels (`navigation-spec.md` §2.2) |
| Dynamic layer | optional per-entry view counts — **off at launch**, same decision as `/writing/` |
| Feed | `/he/rss.xml` (footer, locale-scoped) |
| Chrome | eyebrow `T://bendet · תרגומים` |

Basis (law): `sitemap.md` §2 row 4, §3 (locale subtree + accepted costs) ·
`content-model.md` §3.2, §4.0, §5, §6, §7 · ADRs 0011, 0019, 0020 ·
`typography-spec.md` §6–7 (Hebrew eyebrow, RTL rules).

**Hebrew strings below are placeholders for intent.** Tal is the native
speaker and owns the wording; what is binding is which element carries which
kind of statement.

---

## 1. Goal

This is the front door for the Israeli dev community — the audience the
primary goal names first (`about-tal.md`). It is not an annex of the English
site: it has its own URL, its own feed, its own chrome, and its own reason to
be shared in Hebrew-speaking dev spaces. Its job is to let a Hebrew-preferring
developer find a translated article and start reading, and — because this
section publishes other people's work in Hebrew — to be immediately honest
about what it is: translations of third-party English articles, published
with the original authors' credit. A visitor should never be one click from
discovering that the article they are reading is not Tal's.

## 2. Sections (ordered)

| # | Section | What it must do | Conditional? |
|---|---|---|---|
| 1 | Global header | eyebrow (`T://bendet · תרגומים`) + nav | always |
| 2 | Page header | `h1` in Hebrew naming the section | always |
| 3 | **Standing description** | three things, permanently, in Hebrew: (a) this section holds Hebrew translations of others' English articles; (b) every translation credits and links its original; (c) suggestions for articles worth translating are welcome. Renders identically whether the section is empty or full | always |
| 4 | Scope pointer | one line: Tal's own writing is in English at `/writing/`, labelled in English per the label rule (`navigation-spec.md` §2.2). This is the seam, shown | always |
| 5 | Entry list | one row per entry: Hebrew `title` (link), Hebrew `description`, translation `pubDate`, `original.author` in Latin script, `tags` as non-linking chips | when ≥1 entry |
| 6 | Empty block | replaces section 5 — see §4 | when 0 entries |
| 7 | Footer | `/he/rss.xml`, colophon, direct links, the Hebrew link (marked current) | always |

### 2.1 Why rows carry the original author

Not a compliance requirement — the upstream grant's condition binds the
*translation page*, not an index of links (`content-model.md` §4.0). It is
here for two other reasons: developers follow authors, so the author name is
the strongest scanning signal this list can offer; and a list of Hebrew
titles with Latin author names is instantly legible as *translation work*
rather than original writing, which is what this section is. Stated so nobody
later removes it thinking it is decorative, or keeps it thinking it is legal.

### 2.2 Bidi details on this page

- `dir="rtl"` is set once on `<html>`; no component sets `dir`
  (`content-model.md` §5 rule 1).
- Latin runs inside Hebrew rows — `original.author`, the mark, the English
  nav labels — rely on Unicode bidi; `<bdi>` where QA shows misordering
  (rules 3 and 6).
- Dates and numerals are LTR runs inside RTL rows; same treatment.
- Entry rows, chips, and any accent edge bind `border-inline-start` and
  `padding-inline` (rule 4) — under RTL the accent edge lands on the right,
  which is the reading start.
- The Hebrew eyebrow segment: no `text-transform`, `letter-spacing: normal`
  (`typography-spec.md` §6). The mark segment is unchanged in every respect.
- Hebrew renders through the companion faces in the stacks (Heebo dark /
  Frank Ruhl Libre warm) — `typography-spec.md` §3. No separate tokens.

## 3. States

| State | Trigger | What renders |
|---|---|---|
| **Populated** | ≥2 non-draft translations | sections 1–5, 7 |
| **Sparse** | exactly 1 translation | one-row list, unchanged composition |
| **Empty** | 0 non-draft translations | sections 1–4, 6, 7 — see §4 |
| **Draft-only** | all entries `draft: true` | production renders **Empty** |
| **Degraded** | API unreachable | nothing changes — no API surface at launch |

## 4. Empty state

At launch this section may hold nothing. Its empty state is **not a
translation of the English one** — the two sections are not symmetric, and
mechanically translating `/writing/`'s copy would produce the flattest kind
of Hebrew, which is precisely what this section exists to be better than.

**What renders:**

1. **Sections 2–4 unchanged.** The `h1`, the standing description, and the
   scope pointer are permanent. An arriving visitor still learns what this
   section is, that translations carry credit, and where Tal's own writing
   lives.
2. **A statement of the section's terms**, in Hebrew, in the callout idiom
   (`palette-spec.md` §7.3): what gets translated here (technical writing
   worth reading in Hebrew, with the author's permission or under a published
   grant) and what does not. No schedule, no "soon", no counter. The
   invitation to suggest articles (section 3c) does real work in this state —
   it gives the visitor something to *do* that is true whether or not the
   section is empty.
3. **Routes out, computed at build time:** `/writing/` (labelled in English,
   so its language is disclosed before the click) and `/projects/`. Presented
   as what exists now, not as an apology.
4. **The `/he/rss.xml` link stays in the footer.** Same reasoning as
   `writing-index.md` §4: a Hebrew reader who subscribes to an empty feed
   receives translation #1 on the day it lands, which is the best outcome
   available to both of them. The feed carries `language: he` and a channel
   title even when it has zero items (`content-model.md` §7).

**What must never appear:** ghost rows, "0 תרגומים", a spinner, a promised
date, an English fallback list of articles in place of the missing Hebrew
ones, or any hint of a second theme.

**Test:** with the section empty, the page still answers "what is this
section, whose work is in it, and where do I go now" without containing a
sentence whose subject is the emptiness.

## 5. The dynamic layer

`content-model.md` §6: optional view counts, no reactions on the index.
**Decided: off at launch**, identically to `/writing/` — the reasoning is the
same and the two indexes must not diverge, because divergence would read as
the Hebrew section being treated as second-class, which §4.1 of the content
model already refuses on reactions.

If ever switched on:

- **INV-1 — no layout may reserve space that only the API can fill.** A count
  that fails to load leaves no gap, no spinner, no "—", no skeleton; it is
  absent and the page reads as though it never offered one.
- **INV-2 — append-only injection**, last child of the row's meta line,
  carrying its own separator, so arrival extends rather than displaces. In
  RTL this means the fragment extends toward the *left* — an automatic
  consequence of logical layout, not a special case, and it must be verified
  in the RTL screenshot baseline.

## 6. Rejected alternatives

- **Localizing the whole site so this index sits inside a full Hebrew
  site.** Rejected at checkpoint 1 and re-affirmed here: there is no Hebrew
  `/about/`, `/projects/`, or `/` content, and machine-translating them is
  exactly the fakeness this project's rules forbid (`sitemap.md` §3).
- **Mixing English originals into this list.** The rejection of candidate D:
  each reader sees half the rows as noise, in a script they may not read,
  with direction flipping down the page.
- **Hiding the scope pointer (section 4) to make the section feel
  self-sufficient.** Rejected: it is the seam, and hiding the seam is the one
  thing checkpoint 1's accepted cost forbids.
- **A "translated from" language badge per row instead of the author name.**
  Every row is translated from English; a badge that never varies is noise.
- **Sorting by the original's publication date.** Rejected: `pubDate` is the
  translation's date (`content-model.md` §3.2) and the reader is following
  this section's output, not the originals' history. `original.publishedAt`
  belongs on the article page, where a reader deserves to know they are
  reading a translation of an older piece.

## 7. Noted overlap

Section 3c (the invitation to suggest articles) overlaps with `/contact/`,
whose reason to exist is precisely the openness statement
(`sitemap.md` §2 row 10). The overlap is deliberate and asymmetric: the
Hebrew invitation belongs where the Hebrew audience already is, and
`/contact/` still carries the English statement, which additionally covers
availability for work — something this page has no business saying. Recorded
rather than smoothed over, because if `/contact/` is ever re-evaluated
(row 10 keeps that door open), this overlap is one of the inputs.
