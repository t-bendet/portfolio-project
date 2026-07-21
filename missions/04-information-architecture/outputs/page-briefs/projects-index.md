# Page Brief — Projects index (`/projects/`)

Mission 4 · 2026-07-21

| | |
|---|---|
| Route | `/projects/` |
| Archetype | overview — card grid, the archetype's native pattern (`sitemap.md` §2 row 6) |
| Collection | `projects` (`content-model.md` §3.3), non-draft, sorted by `order` |
| `lang` / `dir` | `en` / `ltr` |
| Dynamic layer | **none** — no reads, no view event; this route ships zero JavaScript (`content-model.md` §6) |
| Chrome | per `navigation-spec.md`; eyebrow `T://bendet · projects` |

Basis (law): `sitemap.md` §2 rows 6–7 · `content-model.md` §3.3, §6 ·
`palette-spec.md` §1 (overview archetype), §7.2 (chip badges) ·
`identity-thesis.md` ("the writing and translations are the point; the
projects are the proof").

---

## 1. Goal

This page is the evidence. `identity-thesis.md` is blunt about the hierarchy —
the writing is the point, the projects are the proof — and the page's design
target follows from that: a visitor who has read something good and wants to
know whether this person actually builds things should get a fast, honest
answer and go back to reading. It also serves a second reader the site does
not optimize for but should not fail: someone evaluating Tal for work, who
will scan stack chips and follow one link. Both are served by a small set of
real projects with visible destinations, not by a portfolio wall of
screenshots.

## 2. Sections (ordered)

| # | Section | What it must do | Conditional? |
|---|---|---|---|
| 1 | Global header | eyebrow + nav | always |
| 2 | Page header | `h1`; standing description below | always |
| 3 | **Standing description** | one or two lines stating what counts as a project here — real, finished-enough things that someone else can run or read. Permanent content, not empty-state copy | always |
| 4 | Card grid | one card per entry, `order` asc | when ≥1 entry |
| 5 | Empty block | replaces section 4 — see §4 | when 0 entries |
| 6 | Footer | per `navigation-spec.md` §4 | always |

### 2.1 The card

| Element | Source | Notes |
|---|---|---|
| Title | `title` | the card's link target — see §2.2 |
| Description | `description` (required) | one string; no truncation of a longer body |
| Stack chips | `stack[]` | non-linking chips, `--badge-N` fills behind `--accent-N` text (`palette-spec.md` §7.2). Not links — there is no stack-index route |
| Destination disclosure | derived | **required** — see §2.2 |

### 2.2 Destination disclosure (binding)

`content-model.md` §3.3 makes `caseStudy` decide whether a detail route
exists. That produces two card behaviors that look identical and are not:

| `caseStudy` | Card links to | Visitor experience |
|---|---|---|
| `true` | `/projects/[id]/` | stays on the site |
| `false` | `liveUrl ?? repoUrl` | **leaves the site** |

**Rule: a card must disclose where it goes before it is clicked.** Concretely,
the outbound card shows its destination host as row metadata (`github.com`,
the live domain) rather than relying on an icon; the inward card shows
nothing extra, because staying on the site is the default expectation.
Outbound links carry `rel="noopener"`.

**Test:** no two cards with visually identical affordances produce different
navigation outcomes. If a visitor cannot tell from the card whether they are
about to leave the site, the disclosure has failed.

**Why not force every project to have a detail page** (so every card behaves
the same): `sitemap.md` §2 row 7 already decided this — with two projects,
mandatory detail pages would manufacture thin pages, which is worse than a
rich card that links out. The cost of that decision lands here, as the
disclosure requirement, and it is the cheaper cost.

### 2.3 Grid behavior with very few cards

Two cards must not stretch to fill a three-column row. The grid is
start-aligned with fixed-ish card widths; a sparse grid reads as "two
projects", while stretched cards read as a layout with holes in it. This is
the sparse state doing honest work rather than being hidden
(`palette-spec.md` §1's card-grid pattern is a grid, not a stretch).

### 2.4 What this page does not carry

| Cut | Reason |
|---|---|
| Screenshots / device mockups | Neither prototype contains an image treatment, `motion-and-texture.md` §2 bans shadow and frame ornament, and a screenshot of a web app is the most template-shaped element available. If a project needs a visual, it belongs inside its case study. |
| "Featured project" hero | Two entries. A featured slot above a two-card grid is the same content twice. |
| Filtering by stack | Requires JS for a set of two; `stack` chips are metadata, not a taxonomy (same posture as `tags` — `sitemap.md` §4). |
| Status badges ("in progress", "archived") | A status field is a staleness generator; `content-model.md` §8 rejects the same class of thing for reading time. If a project is unfinished, the description says so in words. |
| View counts | `content-model.md` §6: no dynamic surface on this route at all. |
| GitHub stars / live metrics | A third-party runtime dependency on a static page, and a number that flatters or embarrasses without informing. |

## 3. States

| State | Trigger | What renders |
|---|---|---|
| **Populated** | ≥1 non-draft project | sections 1–4, 6 |
| **Sparse** | 1–2 entries (the launch reality) | the same grid, start-aligned, unstretched (§2.3) |
| **Empty** | 0 non-draft entries | sections 1–3, 5, 6 — see §4 |
| **Card with no links** | `caseStudy: false` and neither `repoUrl` nor `liveUrl` | **prevented by schema** — `content-model.md` §3.3 requires at least one URL via `.refine()` when `caseStudy` is false. A card that links nowhere is a build failure, not a rendered state |
| **Degraded** | API unreachable | nothing changes — this page never touches the API |

## 4. Empty state

`sitemap.md` §2 row 6 says an empty state is not required in practice (two
real projects exist) but should be specified anyway. Specified — and the
specification is deliberately thin, because a page that will never be empty
should not accumulate machinery for the case:

- Sections 2–3 render unchanged: the `h1` and the standing description still
  tell a visitor what this section is.
- One line stating that nothing is listed here yet — with no promise, no
  date, and no "check back".
- Routes out: `/writing/` (or `/he/writing/` when it has entries) and
  `/about/`, computed from what exists at build time.

**What must never appear:** placeholder cards, "coming soon" tiles, or a link
to a GitHub profile standing in for a project list. That last one is the
tempting move and it is the wrong one: a profile page is not curation, and
this section's entire value is that someone chose which two things are worth
your attention.

**Note the asymmetry with `/writing/`.** The writing index's empty state does
real work because that section *will* be empty at launch and its emptiness is
the visitor's problem. This one is a formality. Recorded so a future reader
does not mistake the difference in depth for inconsistency.

## 5. Rejected alternatives

- **Merging projects into `/about/`.** Rejected: it makes the proof
  subordinate to the biography, and the nav word "projects" is one visitors
  actively scan for.
- **Ordering by date.** `content-model.md` §3.3 uses `order`, not `pubDate` —
  projects are a curated set, not a timeline, and with two entries the
  ordering is editorial by definition.
- **A combined "work" section holding both projects and writing.** Rejected:
  it flattens the hierarchy the identity thesis states explicitly, and it
  would put a card grid and an article list in one archetype.
