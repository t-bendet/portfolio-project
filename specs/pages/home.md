# Page Brief — Home (`/`)

Mission 4 · 2026-07-21

| | |
|---|---|
| Route | `/` |
| Archetype | overview (`sitemap.md` §2 row 1) |
| Collections read | `writing` (recent, ≤3) · `projects` (selected, ≤3) |
| `lang` / `dir` | `en` / `ltr` |
| Dynamic layer | **view-event beacon only**, keyed `page:home` — no reads, nothing rendered from the API (`content-model.md` §6) |
| Chrome | per `navigation.md` §1–4; eyebrow `T://bendet · home` |

Basis (law): `sitemap.md` §2 row 1 · `content-model.md` §1, §6 · ADR 0017
(hero), ADR 0018 (portrait scope), ADR 0002 (theme), ADR 0019 (static core) ·
`hero-and-motion.md` §1 · `hero-and-motion.md` §1, §3.

---

## 1. Goal

This page serves the stranger: someone who followed a link from a dev
community, a Hacker News comment, or a colleague's message, and has a few
seconds to decide whether this person writes things worth reading. Its job is
to say who this is and hand them the writing as fast as honestly possible —
`sitemap.md` calls the fastest honest path from arrival to an article the
design target, because the primary goal is community standing and not lead
generation (`about-tal.md`). It is not a landing page: it sells nothing,
promises nothing, and asks nothing of the visitor. Its second job is quieter
and belongs to the mark: the hero is the one place on the site where the
identity is *enacted* rather than labelled, and that moment happens here or
nowhere.

## 2. Sections (ordered)

| # | Section | What it must do | Conditional? |
|---|---|---|---|
| 1 | Global header | eyebrow + primary nav (`navigation.md` §1) | always |
| 2 | **Hero** | the protocol resolution, ADR 0017: display-scale `--font-mono` mark on bare `--bg`, typing `T → T: → T:/ → T:// → T://bendet` once per load; at completion the cursor vanishes, `://` takes `--accent-3` and its `--glow` (dark only), and the tagline + page content reveal in one step | always |
| 3 | Tagline | one line. Must state what Tal does in his own register — not a role title, not a value proposition. Banned: "passionate about", "crafting", any promotional framing (`symbol-and-language-map.md` banned #8) | always |
| 4 | Recent writing | up to 3 entries from `writing`, `pubDate` desc: title (link), `description`, date. A single link to `/writing/` closes the block | only when ≥1 non-draft entry |
| 5 | Selected projects | up to 3 entries from `projects` by `order`: title, `description`, `stack` chips, destination disclosure (`projects-index.md` §2). A single link to `/projects/` closes the block | only when ≥1 non-draft entry |
| 6 | The person line | one short line pointing at `/about/` (`sitemap.md` §2 row 1). It carries no biography — About owns that | always |
| 7 | Footer | per `navigation.md` §4 | always |

**No portrait on this page** (ADR 0018, explicit: About + favicon only). The
instinct to put a face beside the hero is exactly what 0018 rejected — the
hero is the mark's register, the portrait is the person's, and they share no
surface.

**No translations list on this page.** This is a considered gap, not an
oversight — see §5.

**Section counts are ceilings, not quotas.** Two articles render two rows.
Nothing pads to three.

## 3. States

| State | Trigger | What renders |
|---|---|---|
| **Populated** | ≥1 article and ≥1 project | all seven sections |
| **No writing** | zero non-draft `writing` entries | section 4 is **omitted entirely** — heading, list, and closing link together |
| **No projects** | zero non-draft `projects` entries | section 5 omitted entirely (not expected: two real projects exist) |
| **Floor** | both collections empty | header · hero · tagline · person line · footer. This must read as a complete page |
| **Degraded — no JS** | scripts blocked or failed | hero renders its **final frame**; every section is present and readable; no content is hidden; the view event is simply not recorded |
| **Degraded — API down** | beacon POST fails | **nothing observable.** This page reads nothing from the API, so there is nothing to degrade |
| **Degraded — reduced motion** | `prefers-reduced-motion: reduce` | hero renders its final frame immediately, glow included (it is static decoration, not motion — `hero-and-motion.md` §1) |
| **Error** | n/a | this route cannot 404 |

### 3.1 The rule that makes the no-JS state real

ADR 0017 has the hero's completion "reveal" the tagline and page content in
one opacity step. **Content must not start hidden unless it is guaranteed to
become visible without JavaScript.** If the reveal is script-driven and the
script never runs, this page is blank — the single worst failure available to
the site's most-linked route, and a direct violation of R1 and R4 (M3
`requirements-and-weights.md`).

Binding: the reveal is driven by CSS (which runs whether or not scripts do),
or the content's default state is visible and the animation is applied only
where it can complete. **Tests:** (a) load `/` with JavaScript disabled — the
full page is readable and the mark reads `T://bendet` with `://` accented;
(b) load with CSS animations unsupported — same result.

### 3.2 Composition rule for absent sections

An omitted section leaves **no heading over a void**. Heading, container, and
closing link are one unit and disappear together. This is the same discipline
the dynamic layer is held to (`content-model.md` §6), applied to content
absence rather than API failure — an M4 extension by analogy, marked as such
because the source rule is about failure, not emptiness.

## 4. Empty states

The home page's empty state is **structural, not textual**: it composes fewer
sections. There is no empty-state copy on this page at all, and that is the
decision.

**What must never appear here:**

- "Coming soon", "first article in progress", "check back" — a promise with a
  deadline the site cannot keep, which dates itself the moment it is untrue
  and reads as an apology on the page that should read as an introduction.
- A placeholder card, ghost row, or skeleton in place of the missing list.
- Any sentence that refers to content that does not exist. **Test:** in the
  floor state, no sentence on the page mentions writing, articles, or
  projects.

**Why the floor state is acceptable.** Hero, tagline, a line about the
person, and a nav that leads to five real destinations is an honest small
site. The visitor who wants writing clicks `writing` and lands on a page that
explains itself (`writing-index.md` §4). Nothing here has claimed otherwise.

**Recommendation, not a rule:** the cheapest fix for the floor state is one
published article. The IA works either way; recorded so the choice stays
Tal's and the launch is not blocked on it.

## 5. Decisions and rejected alternatives

**No "recent translations" block — considered and cut.** `sitemap.md` §2 row
1 lists this page's composition and does not include translations; that is
consistent with checkpoint 1's front-door decision (§3), and re-examined here
rather than merely obeyed:

- A block of Hebrew titles inside English chrome flips direction down the
  page for both readers — the exact reasoning that rejected candidate D
  ("one merged list") at checkpoint 1.
- The Hebrew audience is not expected to arrive at `/`. `/he/writing/` is a
  shareable URL with its own feed and its own chrome, and it is what gets
  posted in Israeli dev spaces. That was the point of choosing a front door.
- The page does point at the translations — through the nav item, in Hebrew
  script, which is the most scannable item in the nav for exactly the person
  who wants it (`navigation.md` §2.2).

**Honest cost:** an English-reading visitor who never reads the nav will not
learn that the translation work exists, and that work is half of what makes
this person interesting. Accepted, because the alternatives (a mixed-script
list, or an English-language block *about* the Hebrew work) are worse: one
degrades both readers' experience, the other talks about the work instead of
showing it.

**No view counts, no reactions — nothing is READ from the API anywhere on
this page.** The recent-writing rows show date and description only. This is
the site's most-linked page and it must render identically whether the API
is up, down, or deleted.

**One write, and it renders nothing.** `content-model.md` §6 gives `/` a
view-event beacon keyed `page:home` — the only static page that emits one,
because this is the site's entry point and ADR 0020's per-referrer
aggregation is worth most where arrival actually happens. It is
fire-and-forget: nothing waits for it, nothing is drawn from it, and its
failure is invisible. The paragraph above is therefore unaffected — "renders
identically whether the API is up, down, or deleted" remains exactly true,
because reads are what could break rendering and this page performs none.
(Correction, blueprint gate: an earlier draft justified this as "adds no
new dependency class"; that reasoning was wrong — the beacon decision
stands, and `content-model.md` §6 is what governs it.)

**No search box, no tag cloud, no "latest activity".** No search route exists
(`sitemap.md` §4); tag routes are deferred with a recorded threshold; an
activity feed would be a third-party dependency and a staleness generator.

**No social proof, no logos, no metrics.** Nothing on this page counts
anything.
