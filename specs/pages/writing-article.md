# Page Brief — Article (`/writing/[id]/`)

Mission 4 · 2026-07-21

| | |
|---|---|
| Route | `/writing/[id]/` — `id` is the filename, not `slug` (`content-model.md` intro, M3 Q6) |
| Archetype | deep-dive editorial — sidebar + long-form column (`sitemap.md` §2 row 3) |
| Collection | `writing` (`content-model.md` §3.1) |
| `lang` / `dir` | `en` / `ltr` — from the locale, not frontmatter (`content-model.md` §5) |
| Dynamic layer | view event POST on load; view count + reactions by progressive enhancement; both degrade to absence |
| Analytics key | `writing:<id>` (`content-model.md` §2) |
| Feed | included in `/rss.xml` |
| Chrome | per `navigation.md`; eyebrow `T://bendet · writing` |

Basis (law): `sitemap.md` §2 row 3 · `content-model.md` §2, §3.1, §5, §6, §7 ·
ADRs 0011, 0018, 0019, 0020 · `typography.md` §7 (code is LTR) ·
`palette.md` §7.3 (callout idiom per temperature) ·
`hero-and-motion.md` §1 (motion budget).

---

## 1. Goal

This page has one job and it is the reason the site exists: let someone read
the article. Everything else on it — metadata, navigation, counts, reactions —
is subordinate to a person reading a long technical piece without friction,
possibly on a phone, possibly with a bad connection, possibly with JavaScript
blocked. The reader it serves is a working developer who arrived from a link
and does not yet know or care who wrote it; the page earns the byline by
being good, not by decorating it. The article must render completely as
static HTML: this is the R1 anchor (near-zero JS to read an article) and the
R4 anchor (content survives dynamic-layer failure) meeting on one surface.

## 2. Sections (ordered)

| # | Section | What it must do | Conditional? |
|---|---|---|---|
| 1 | Global header | eyebrow + nav | always |
| 2 | Article header | `h1` = `title`; the lede = `description` (the same string the index row and the meta description use — `content-model.md` §3.1) | always |
| 3 | Meta line | `pubDate`; `updatedDate` when set, explicitly labelled as an update; `tags` as non-linking chips. **Injected view count appends here if ever present** (§4) | always |
| 4 | In-page contents | a `<nav>` listing the article's own `h2`s as anchors. Rendered in the sticky sidebar column on wide viewports (prototype-native: `tooling-deepdive.html` `nav.sidebar { position: sticky }`) | only when the article has ≥3 `h2`s |
| 5 | Body | the MDX content: prose, code panels, callouts, tables, images | always |
| 6 | End matter | a link to `/writing/`; sibling articles when ≥2 other non-draft entries exist | always (the index link); siblings conditional |
| 7 | Reactions | injected in full by progressive enhancement, or absent (§4) | never in static HTML |
| 8 | Footer | includes `/rss.xml` | always |

### 2.1 Body composition rules

- **Code panels are always `dir="ltr"`**, unconditionally, on this LTR page
  too — the rule is a property of code, not of the page
  (`content-model.md` §5 rule 2, `typography.md` §7.1). Stating it here
  keeps the two article templates identical on this point.
- **Callouts** use the shared box structure with per-temperature fills
  (`palette.md` §7.3): dark = `--surface-inset` with an accent
  `border-inline-start`; warm = `--badge-N` tint. Same structure, both
  temperatures, no route pins either (ADR 0002).
- **Accents are never backgrounds**, and **links are `--text` with an
  underline treatment — not accent-coloured**; there is deliberately no
  `--link` token (`palette.md` §7.1, §7.4). Long-form prose is where the
  temptation to colour links is strongest.
- **All directional geometry binds logically** (`border-inline-start`,
  `padding-inline`, `text-align: start`). This page is LTR, but the body
  components are shared with `/he/writing/[id]/`, where physical sides break
  (`content-model.md` §5 rule 4).
- **Images** carry required alt text and intrinsic dimensions so the column
  does not reflow as they load.

### 2.2 The contents sidebar

- **Threshold: ≥3 `h2`s.** A table of contents over two headings is noise.
- **No scroll-spy.** An active-section indicator requires a scroll listener —
  JavaScript on the reading path (R1) and a scroll-coupled behavior
  (`hero-and-motion.md` §1: "nothing moves on load, on scroll, or on a
  timer"). Honest cost, stated: the sidebar shows the article's shape but not
  the reader's position in it. Accepted.
- **Source order:** the `<nav>` follows the article header and precedes the
  body, so a linear reader (screen reader, no CSS, narrow viewport) meets it
  where a contents list belongs.
- **The column binds to the inline start**, which puts it on the right under
  `dir="rtl"` in the translated template — one component, both directions.
- Below the sidebar breakpoint the contents render inline above the body, not
  in a collapsible widget (a disclosure needs JS or a hack).

### 2.3 What this page deliberately does not carry

| Cut | Reason |
|---|---|
| Author bio block / avatar at the end | ADR 0018 scopes the portrait to About + favicon. `content-model.md` §3.1 has no `author` field because there is one author — a bio card on every article restates that at length. |
| Social share buttons | Third-party scripts on the reading path; the no-tracker stance is permanent (ADR 0020, alternatives rejected). The URL is the share mechanism. |
| "Related posts" by tag | Tag routes are deferred and the corpus is small (`sitemap.md` §4); a similarity list computed from two shared tags is a taxonomy pretending to be relevance. Siblings in §6 are explicitly "more writing", not "related". |
| Reading time / word count | `content-model.md` §8: derivable, and storing it generates stale data. Derived display was considered and cut — it is a number that invites optimizing for it. |
| Comments | Deferred by ADR 0020. The `<collection>:<id>` key (`content-model.md` §2) is what keeps them cheap to add later. |
| Newsletter capture | Nothing to send. |
| A "back to top" control | `navigation.md` §4.2. |

## 3. States

| State | Trigger | What renders |
|---|---|---|
| **Populated** | the normal case | sections 1–6, 8; 7 if the API answers |
| **No tags** | `tags: []` (schema default) | the chip group is omitted; the meta line carries date only |
| **Never updated** | no `updatedDate` | no update line. Never "Updated: —" |
| **Short article** | <3 `h2`s | no contents sidebar; the column occupies the full measure |
| **Only article** | 0 other non-draft entries | no sibling links; the end matter carries the `/writing/` link alone, which still resolves (to the sparse index) |
| **Degraded — API down** | fetch fails or times out | no count, no reactions, **no trace of either** (§4) |
| **Degraded — no JS** | scripts blocked | the entire article reads; no count, no reactions; the view event is simply not recorded |
| **Draft** | `draft: true` | **no route exists in production** (`content-model.md` §3.1); the page is reachable only in `astro dev` |
| **Error** | bad `id` | the route was never generated → `/404` (`not-found.md`) |

## 4. The dynamic layer on this page

`content-model.md` §6 gives this route: reads view count + reactions, writes
view event + reaction, degrades to **absence**.

**INV-1 — no layout may reserve space that only the API can fill.** A count
or reaction that fails to load leaves **no gap, no spinner, no "—", no
skeleton**. It is absent, and the page reads as though it never offered one.
This is a composition rule, restated here because this is one of the two
pages it governs most.

**INV-2 — append-only injection.** Each API-fed fragment carries its own
label and separators and is inserted as the **last child** of its container:
the view count at the end of the meta line (§2, section 3), the reactions
block at the end of the article, after the end matter's index link. Nothing
is ever inserted above or between existing content, so an arriving fragment
extends the page instead of pushing it. This is how "no reserved space" and
"no layout shift" are satisfied at the same time rather than traded.

**Static HTML contains no placeholder.** No empty container, no `aria-live`
region announcing nothing, no `hidden` element waiting to be revealed, no
heading like "Did you find this useful?" sitting above an empty box.

**Reactions**: a small fixed enum shared with the API, additive-only, never
free text (`content-model.md` §6). The members are a copy decision and are
not fixed here. A reaction is a write with immediate local feedback; a failed
write must not leave the control in a lying state (it reverts, silently — no
error toast, which would be a UI element that exists only for the API).

**View event**: POSTed on load, no visible effect, no consequence on failure.
No third-party tracker is present on this page or any other (ADR 0020).

**Tests.**
1. Block the API host, load the page: the rendered result is a complete
   article with no visible or structural evidence that counts or reactions
   exist.
2. Disable JS: identical result.
3. Diff the DOM of (1) against a build with the enhancement code removed:
   the difference is script tags only.

## 5. Empty states

An article is a file; it always has a body, and its required fields are
enforced by the schema (`content-model.md` §3.1 — `title`, `description`,
`pubDate` are required, so a partially-filled article is a build failure, not
a degraded page). The empty states that exist on this route are the
**absences inside it**, enumerated in §3: no tags, no update date, no
contents sidebar, no siblings, no count, no reactions.

The rule uniting them: **an absent thing renders nothing at all** — not a
label with an em dash, not a greyed control, not a zero. The page composed
from the smallest possible set (header, `h1`, lede, date, body, index link,
footer) must read as a finished article, because at launch that is exactly
what article #1 will be.

**Test:** build a fixture entry with only the required fields, no tags, no
headings, no siblings, and the API blocked. The rendered page contains no
element that hints at a missing one.

## 6. Rejected alternatives

- **Sidebar carrying site navigation instead of in-page contents.** Rejected:
  the primary nav lives in one place on every route
  (`navigation.md` §1); a second navigation surface on one archetype
  would make the site's chrome archetype-dependent.
- **Progress bar / reading indicator.** Scroll-coupled motion, banned by the
  motion budget, and it carries no information the scrollbar lacks.
- **Prev/next chronological pagers.** Chronology is not a reading order for
  independent technical articles; "more writing" links to real siblings
  instead, and only when siblings exist.
- **Rendering the view count server-side at build time.** It would be a
  frozen number pretending to be live, and it would put the API in the build
  path — inverting the R4 anchor.
