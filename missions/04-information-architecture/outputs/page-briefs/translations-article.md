# Page Brief — Translated article (`/he/writing/[id]/`)

Mission 4 · 2026-07-21

| | |
|---|---|
| Route | `/he/writing/[id]/` — Latin `id` derived from the original English article; Hebrew `title` (`sitemap.md` §3, `content-model.md` §3.2) |
| Archetype | deep-dive editorial, `dir="rtl"` (`sitemap.md` §2 row 5) |
| Collection | `translations` (`content-model.md` §3.2) |
| `lang` / `dir` | `he` / `rtl` on `<html>`, derived from the locale — one source of truth (`content-model.md` §5) |
| Dynamic layer | identical to English articles: view event POST; count + reactions by progressive enhancement; degrade to absence |
| Analytics key | `translations:<id>` (`content-model.md` §2) |
| Canonical | **self-canonical.** No `rel="canonical"` to the original; no hreflang alternates (`content-model.md` §4.2, `sitemap.md` §2 row 13) |
| Feed | `/he/rss.xml`, item description carries the attribution (`content-model.md` §7) |
| Chrome | eyebrow `T://bendet · תרגומים` |

Basis (law): `sitemap.md` §2 row 5, §3 · `content-model.md` §2, §3.2, §4.0,
§4.1–4.6, §5, §6, §7 · ADRs 0011, 0019, 0020 · ADR 0010's preserved
requirement · `typography-spec.md` §6–7.

**This page is the one place in the site where a composition rule is a
compliance condition, not a preference.** The upstream translation grant
(`content-model.md` §4.0, condition 3) requires that the translation explain
at its beginning that it is a translation and link back to the original.
Placement of the credit block is therefore not revisitable on taste.

---

## 1. Goal

Let a Hebrew-preferring developer read a translated technical article as
first-class content — the same reading experience an English reader gets on
`/writing/[id]/`, in their own script and direction, with no sense that the
Hebrew is a mode the site is operating in. Its second, inseparable job is
honesty about authorship: the reader must know, before they invest attention,
whose work this is and where the original lives. Those two jobs are the same
job — a translation that hides its source is not a translation, it is a
copy — and the composition below is arranged so that a reader cannot reach
the body without passing the credit.

## 2. Sections (ordered)

| # | Section | What it must do | Conditional? |
|---|---|---|---|
| 1 | Global header | eyebrow + nav (four English labels, one Hebrew — the seam shown) | always |
| 2 | Article header | `h1` = Hebrew `title`; lede = Hebrew `description` | always |
| 3 | Meta line | translation `pubDate`; `updatedDate` when set; `tags` chips. Injected view count appends here (§5) | always |
| 4 | **Opening credit block** | **required, above the body.** Contents fixed by `content-model.md` §4.3: that this is a translation, in Hebrew, in plain words; the original's title as a link to `original.url`; the original author's name; the original's publication date when `original.publishedAt` is set | **always — never conditional** |
| 5 | In-page contents | the article's `h2`s as anchors, sticky sidebar column on wide viewports, ≥3 `h2`s threshold | conditional |
| 6 | Body | translated prose; code panels; callouts; translator's notes | always |
| 7 | Closing credit | repeats the link to `original.url` with a "read the original" pointer, where acting on it is natural (`content-model.md` §4.3) | always |
| 8 | End matter | link to `/he/writing/`; sibling **translations** when ≥2 other non-draft entries exist | always (index link) |
| 9 | Reactions | injected in full, or absent (§5) | never in static HTML |
| 10 | Footer | `/he/rss.xml`, colophon, direct links, Hebrew link | always |

### 2.1 The opening credit block — binding details

- **It precedes the first element of the article body.** Not "somewhere on
  the page", not in the footer, not folded into the meta line. CI asserts the
  ordering, not merely the presence (`content-model.md` §5, assertion 2) —
  a page carrying its only credit at the end would pass a presence check
  while sitting outside the terms it is published under.
- **Script split:** the block reads in Hebrew, but `original.title` and
  `original.author` stay in Latin script — they are the original's own title
  and a proper name (`content-model.md` §4.3). A consequence worth keeping:
  compliance is legible to someone who cannot read Hebrew, because the linked
  English title and the author's name are visible inside a Hebrew sentence.
- **It is a distinct block, not a stylistic aside.** It must not be visually
  indistinguishable from the lede, and it must not be styled so quietly that
  it reads as boilerplate to skip.
- **`original.publishedAt` absent → that clause is simply not written.**
  Never "date unknown", never an empty field.
- **The schema guarantees the data exists**: `original.title`, `.author`,
  `.url` are required in full and a partial credit is a build failure
  (`content-model.md` §1, §3.2). Attribution is enforced at three layers —
  schema (unpublishable), CI (unrenderable in the wrong place), feed
  (unfeedable without credit in the item description).

### 2.2 Translator's notes

Allowed, as a **visually distinct and explicitly labelled** device
(`content-model.md` §4.4). The labelling requirement is the whole point: the
reader must never be unsure whose sentence they are reading. Ships as a named
MDX component available only inside `translations`, so the boundary is
enforced by import rather than by discipline.

This does not violate the no-explained-references rule
(`symbol-and-language-map.md` banned #2): that ban is on explaining easter
eggs and symbolic references. A translator's note is editorial apparatus in a
translation — the case where labelling is the honest act.

Notes may appear inline at the point of confusion (their reason to exist) and
must be distinguishable from the author's own callouts, because they are a
different voice on the same page.

### 2.3 RTL composition rules (ADR 0011 — the page this constraint exists for)

1. **`dir="rtl"` on `<html>`, derived from the locale.** No component sets
   `dir` except the two documented exceptions (`content-model.md` §5 rule 1).
2. **Code panels carry `dir="ltr"` unconditionally** — code is notation, not
   prose (rule 2, `typography-spec.md` §7.1). Hebrew inside a comment or
   string renders through the companion face within the LTR block. CI asserts
   every `pre`/`code` on this page resolves to `dir="ltr"`
   (`content-model.md` §5, assertion 3).
3. **The mark is an LTR run** inside RTL chrome; bidi handles it, `<bdi>` is
   the documented fallback if the `://` misorders (rule 3).
4. **No physical-side CSS anywhere in content rendering** — logical
   properties only (rule 4). The sidebar, callout edges, blockquote edges,
   list markers, and table alignment all follow; the contents sidebar lands
   on the right.
5. **Hebrew eyebrow segment:** no `text-transform`, `letter-spacing: normal`
   (rule 5).
6. **Numerals, URLs, and Latin names** inside Hebrew prose are LTR runs;
   isolate where QA shows otherwise (rule 6).
7. **No horizontal overflow** at standard viewport widths — the single most
   common way an LTR-designed layout fails under RTL, asserted in CI
   (assertion 5). Long code panels and wide tables are the usual culprits and
   must scroll within their own container, not the page.
8. **RTL screenshot baseline** comparison in CI (assertion 4).
9. **Italic is unavailable in the dark temperature and unavailable for Hebrew
   in either** (`typography-spec.md` §5). No meaning may hang on italics on
   this page; emphasis is weight.

## 3. States

| State | Trigger | What renders |
|---|---|---|
| **Populated** | the normal case | sections 1–8, 10; 9 if the API answers |
| **No original date** | `original.publishedAt` unset | the credit block omits that clause; nothing else changes |
| **No tags** | `tags: []` | chip group omitted |
| **Short translation** | <3 `h2`s | no contents sidebar |
| **Only translation** | 0 other non-draft entries | no siblings; the `/he/writing/` link stands alone |
| **Degraded — API down** | fetch fails | no count, no reactions, no trace of either (§5) |
| **Degraded — no JS** | scripts blocked | the whole translation reads, credit included; no count, no reactions |
| **Draft** | `draft: true` | no route in production |
| **Error** | bad `id` | never generated → `/he/404`, the Hebrew RTL error page (see §6) |

## 4. Empty states

There is no empty state for the article itself — the schema makes an
incomplete translation a build failure rather than a degraded page
(`content-model.md` §1: attribution is mechanically enforced). What exists
are absences *inside* the page, listed in §3, and one rule covers all of
them: **an absent thing renders nothing** — no label with an em dash, no
placeholder, no "—".

Two absences deserve naming because the instinct is to fill them:

- **No siblings.** Translation #1 has nowhere to send the reader except
  `/he/writing/` — and that is correct. It must not fall back to linking
  English articles: LTR rows appended to an RTL page is the candidate-D
  failure at article scale, and it would tell a Hebrew reader that the Hebrew
  section is a waiting room.
- **No reactions or count.** Absent, silently, exactly as on the English
  article. `content-model.md` §4.1 considered and rejected suppressing
  reactions on translations — the counts measure this page's reception among
  Hebrew readers, which is the signal the section exists to build, and
  asymmetry would read as second-class treatment of the Hebrew work.

## 5. The dynamic layer

`content-model.md` §6 gives this route the same row as `/writing/[id]/`:
reads count + reactions, writes view event + reaction, degrades to
**absence**.

**INV-1 — no layout may reserve space that only the API can fill.** A count
or reaction that fails to load leaves **no gap, no spinner, no "—", no
skeleton**. It is absent and the page reads as though it never offered one.

**INV-2 — append-only injection.** Each fragment carries its own label and
separators and is the last child of its container: the count at the end of
the meta line, the reactions block after the end matter. Under `dir="rtl"`
"last child" extends toward the left; this is a consequence of logical
layout, not an exception, and the RTL screenshot baseline should include a
frame with the fragments present.

**Static HTML contains no placeholder** — no empty container, no `aria-live`
region announcing nothing, no heading above an empty box.

**Analytics key is `translations:<id>`** — namespaced, because an original
and a translation may legitimately share a slug stem and un-namespaced keys
would silently merge their counts (`content-model.md` §2).

**Test:** block the API and disable JS; the page renders a complete,
credited, RTL translation with no evidence that a dynamic layer exists.

## 6. The seam, on this page

A reader on this page is one click from four English destinations (nav) and
one click from returning to Hebrew (nav item 2, plus the footer's persistent
Hebrew link — `navigation-spec.md` §4.1, invariant R-3). Two honest
consequences:

- **A mistyped Hebrew URL lands on `/he/404`, a Hebrew RTL error page**
  (`sitemap.md` §11b, ADR 0022). This brief originally recorded the opposite
  — that only one English 404 existed and M4 would not invent a second —
  which was correct when written; the route was added afterwards, on the
  reasoning that the Hebrew subtree is its own front door and an English
  error page breaks that at the worst moment. Corrected here rather than
  deleted, so the change is legible. Composition and exclusions are governed
  by `not-found.md`; its serving mechanism (a Caddy `handle_errors` matcher
  on the `/he/*` prefix) is an owed scaffold-time verification.
- **No hreflang, no canonical to the original.** The English counterpart is
  not on this site and a Hebrew translation is not a duplicate of an English
  article; declaring either would assert a false equivalence and could remove
  the Hebrew page from Hebrew search results — defeating the section
  (`content-model.md` §4.2, `sitemap.md` §2 row 13).

## 7. Rejected alternatives

- **Credit at the end only.** Rejected twice over: the reader can consume the
  whole piece believing it is Tal's thinking, and it breaches the upstream
  grant's condition 3 outright (`content-model.md` §4.3).
- **Top block only.** Rejected: the "read the original" link then sits where
  the reader has not yet decided they want it, and is gone by the time they
  might.
- **A machine-readable-only credit (meta tags, structured data).** Invisible
  to the reader, which is the opposite of what the grant asks for.
- **A language-switch link to "the English version".** There is no English
  version on this site — the original is a third party's page, and the
  closing credit already links it as what it is.
- **Suppressing reactions here** — considered and rejected in
  `content-model.md` §4.1; restated so it is not re-proposed as politeness.
