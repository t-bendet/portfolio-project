# Page Brief — Writing index (`/writing/`)

Mission 4 · 2026-07-21

| | |
|---|---|
| Route | `/writing/` |
| Archetype | overview — entry rows, chip badges (`sitemap.md` §2 row 2) |
| Collection | `writing` (`content-model.md` §3.1), non-draft, `pubDate` desc |
| `lang` / `dir` | `en` / `ltr` — from the locale, not frontmatter (`content-model.md` §5) |
| Dynamic layer | optional per-entry view counts — **off at launch**, see §5. No view event on the index (`content-model.md` §6) |
| Feed | `/rss.xml` (footer, per `navigation.md` §4.1) |
| Chrome | per `navigation.md`; eyebrow `T://bendet · writing` |

Basis (law): `sitemap.md` §2 row 2, §4 (tag routes deferred) ·
`content-model.md` §1, §3.1, §6, §7 · ADRs 0019, 0020 ·
`palette.md` §1 (overview archetype), §7 (accent placement).

---

## 1. Goal

This is the site's center of gravity (`identity-thesis.md`: "the writing and
translations are the point"). It serves two people at once: the visitor who
arrived for one article and is deciding whether there is a second one worth
their time, and the returning reader looking for something they half
remember. Both are served by the same thing — a list where each row says
enough to choose from, with no interstitial marketing between arriving and
reading. It is also the page most likely to be empty at launch, which makes
its empty state a real design surface rather than a footnote (§4).

## 2. Sections (ordered)

| # | Section | What it must do | Conditional? |
|---|---|---|---|
| 1 | Global header | eyebrow + nav | always |
| 2 | Page header | `h1` naming the section; the standing description below it | always |
| 3 | **Standing description** | one or two lines on what this section publishes, in the honest-tradeoff register. **Permanent content, not empty-state copy** — it renders identically whether there are zero entries or fifty | always |
| 4 | Translations cross-link | one line pointing at `/he/writing/`, label in Hebrew with `lang="he"` (`sitemap.md` §2 row 2: "persistent pointer to the Hebrew translations") | always |
| 5 | Entry list | one row per entry: title (link), `description`, `pubDate`; `updatedDate` shown **only when set** and labelled as an update, never silently replacing the publication date; `tags` as non-linking chips | when ≥1 entry |
| 6 | Empty block | replaces section 5 — see §4 | when 0 entries |
| 7 | Footer | includes the `/rss.xml` link | always |

**Tags are chips, not links** (`sitemap.md` §4: tag index routes deferred,
model kept; revisit when any single tag has ≥5 entries). A chip that looks
interactive and is not would be worse than a chip that does not; the visual
treatment must not imply a destination.

**No pagination.** `sitemap.md` §1 enumerates every route and contains no
`/writing/2/`. The index renders the full list. Recorded threshold for
revisiting: ~25 entries, at which point adding pagination is a **route
change** and belongs in an updated sitemap, not in a template tweak.

**No excerpts beyond `description`.** The schema makes `description` required
and dual-purpose (`content-model.md` §3.1) precisely so rows are never
sometimes-bare; pulling a first paragraph as a fallback would reintroduce the
inconsistency the schema exists to prevent.

## 3. States

| State | Trigger | What renders |
|---|---|---|
| **Populated** | ≥2 non-draft entries | sections 1–5, 7 |
| **Sparse** | exactly 1 entry | the same one-row list. No apology, no "just one so far", no layout special-case |
| **Empty** | 0 non-draft entries | sections 1–4, 6, 7 — see §4 |
| **Draft-only** | entries exist but all are `draft: true` | production renders the **Empty** state. This is the likely launch condition and is named so it is not discovered in production (`content-model.md` §3.1: drafts are filtered from prod builds, feeds, and the sitemap) |
| **Degraded** | API unreachable | **nothing changes** — no API surface is rendered on this page at launch (§5) |

## 4. Empty state — the real deliverable

The site can launch with zero published articles. The template answer ("No
posts yet — check back soon!") fails on three counts at once: it makes a
promise about a future the site cannot enforce, it centres the page on its
own emptiness, and it could appear unchanged on any competent developer's
portfolio — which is the M1 anti-test, and it is binary.

**What renders instead.** The page is *the same page minus the list*, plus
one block:

1. **Sections 2–4 are unchanged.** The `h1`, the standing description, and
   the translations cross-link are permanent. This alone does most of the
   work: a visitor arriving at an empty index still learns what the section
   is for.
2. **The section's terms**, in the callout idiom the archetypes already own
   (dark: `--surface-inset` with an accent `border-inline-start`; warm:
   `--badge-N` tint fill — `palette.md` §7.3). Its content: what belongs
   in this section and what does not — long-form technical writing in the
   tradeoff register; not link roundups, not release notes, not announcements.
   No dates. No schedule. No "soon". This is the same register the ADRs and
   the colophon use, it is true on day 1 and on day 400, and it is not a page
   you find on other portfolios.
3. **What there is to read right now** — computed at build time from what
   actually exists: the translations index (only when `translations` has ≥1
   non-draft entry), `/projects/`, `/about/`. Presented as a short list of
   what exists, not as an apology for what does not.

**The feed link stays in the footer.** Subscribing to an empty feed is the
best available outcome for a visitor who wants this content: they receive
article #1 the day it lands. Hiding the feed when the corpus is empty is the
instinct to hide, and it costs the site its most interested visitor. The feed
must still carry channel title, description, and `language` so a reader
displays a name rather than an empty row (`content-model.md` §7).

**What must never appear:** ghost rows, skeleton cards, "0 articles", a
spinner, a countdown, a newsletter capture, an estimated first-post date, or
any hint of a second theme (`symbol-and-language-map.md` banned #7).

**Test for this empty state:** delete the sentence that says there is nothing
here, and the page still reads as a complete statement of what the section
is. If removing that sentence leaves a hole, the page was built around its
own emptiness and is wrong.

**Honest limit.** If both `writing` and `translations` are empty at launch,
this page's routes-out reduce to projects and about, and it is genuinely
thin. That thinness is truthful — the site really has no writing yet — and
the fix is editorial, not architectural (`home.md` §4).

## 5. The dynamic layer — decided: no counts at launch

`content-model.md` §6 makes per-entry view counts on this index **optional**.
M4 resolves the option: **not rendered at launch.**

Reasons: a list where every row reads a small number advertises the site's
own smallness at exactly the moment it is smallest; the index is the page a
first-time visitor uses to decide whether to read anything, and decorating it
with a live dependency buys nothing for that decision; and the count already
appears where it means something, on the article page itself.

The honest counter-argument, recorded: counts help a returning reader find
the piece other people found useful. That is real — and it needs a corpus and
non-embarrassing numbers to be true. **Revisit threshold:** ≥10 published
entries *and* numbers Tal is willing to show publicly. The capability stays
in the model; nothing migrates when it is switched on.

**If it is ever switched on, these rules bind (restated from
`content-model.md` §6, ADR 0019):**

- **INV-1 — no layout may reserve space that only the API can fill.** A count
  that fails to load leaves **no gap, no spinner, no "—", no skeleton**. It
  is absent, and the page reads as though it never offered one.
- **INV-2 — append-only injection.** The injected fragment carries its own
  separator and label and is the **last child** of the row's meta line, so
  its arrival extends a line rather than displacing anything. Injecting above
  or between existing content would trade the no-reserved-space rule for
  layout shift; append-only satisfies both.
- **Test:** load with the API blocked and with JS disabled. The rendered DOM
  contains no empty container, no `aria-live` region announcing nothing, and
  no element whose only purpose is to be filled.

## 6. Rejected alternatives

- **Hiding the `writing` nav item while the section is empty.** Rejected —
  `navigation.md` INV-3: chrome shape must not track content volume, and
  a destination that vanishes between deploys is worse for a returning
  visitor than an honest empty page.
- **Redirecting `/writing/` to `/` when empty.** Rejected: it makes a real
  section unaddressable, breaks any link already shared, and hides the seam
  rather than showing it.
- **Grouping rows by year.** Rejected at this corpus size — headings would
  outnumber entries. Revisit alongside pagination.
- **"Featured" or "start here" pinning.** Rejected for launch: with fewer
  than ~10 entries, a curated shelf above the list is the same list twice.
- **A tag filter UI.** Requires JS on the site's most important index (R1),
  for a taxonomy that does not yet have enough entries to filter
  (`sitemap.md` §4).
