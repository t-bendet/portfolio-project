# Sitemap — T://bendet

Decided 2026-07-21; Tal decided all three open calls (§5).

Basis: `brand.md` (identity), `design/palette.md` §1 (archetypes),
`design/tokens.md` §2 (theme switching), `architecture.md` §1
(static/dynamic boundary).

---

## 0. The theme inconsistency, resolved (ADR 0009 × ADR 0002)

ADR 0009 assigned a temperature per route: `/` dark, `/about` warm,
`/projects` dark, `/writing` warm, `/contact` dark. **This is deleted, not
adjusted.** It cannot coexist with ADR 0002, which is `active` and was
explicitly defended by Mission 1:

1. **It un-hides the hidden theme.** ADR 0002 ships *one* dark design to all
   visitors; the warm temperature exists only after the incantation. A
   default-warm `/about` shows every visitor the second theme on their first
   click. The easter egg is then not hidden — it is the site's normal
   behavior, and typing the phrase would do nothing observable on half the
   routes.
2. **It breaks the switching mechanism as specified.** `tokens.md`
   §2 fixes the model: default = bare `:root`, second theme =
   `[data-theme="warm"]` on `<html>`, persisted in `localStorage`, 600ms
   transition with a total-coverage parity rule so the transition can never
   half-apply. Per-route temperature requires a *second*, competing source of
   truth for `data-theme` — and a toggled visitor navigating to a
   temperature-pinned route would either lose their state or override the
   route, both of which are visible bugs.
3. **It violates the banned-vocabulary and no-hint rules.** Per-route
   assignment makes the two temperatures a visible taxonomy of the site. The
   symbol map's test — "no UI element, copy, tooltip, or doc page references
   the switch, the phrases, or the existence of a second theme" — fails at
   the level of route behavior itself.

### The resolution (binding on every row of §2)

**Temperature is global and visitor-controlled; no route pins a temperature.**
Every route renders in whichever temperature is active for that visitor —
default dark, warm after the incantation, persisted across navigation. The
theme-behavior column in §2 therefore reads the same for every public row,
and says so rather than being omitted.

### What was actually right in 0009, preserved

0009's per-route assignment was reaching for a real thing: pages should not
all feel identical. **The correct axis is archetype, not temperature.** M2
§1 already fixed two page archetypes — overview/map (card grids, chip badges,
section panels) and deep-dive editorial (sidebar + long-form column, callout
boxes, code panels) — and established that *each archetype renders in both
temperatures*. So the differentiation 0009 wanted survives, on the axis that
does not collide with ADR 0002. Every row in §2 carries an archetype.

---

## 1. Route inventory at a glance

| # | Route | Kind | Archetype | In nav |
|---|---|---|---|---|
| 1 | `/` | static page | overview | mark (home) |
| 2 | `/writing/` | static index | overview | yes |
| 3 | `/writing/[id]/` | static, per entry | deep-dive | no (child) |
| 4 | `/he/writing/` | static index (RTL) | overview | yes — see §3 |
| 5 | `/he/writing/[id]/` | static, per entry (RTL) | deep-dive | no (child) |
| 6 | `/projects/` | static index | overview | yes |
| 7 | `/projects/[id]/` | static, per entry, **optional** | deep-dive | no (child) |
| 8 | `/about/` | static page | deep-dive | yes |
| 9 | `/colophon/` | static page | deep-dive | footer only |
| 10 | `/contact/` | static page | minimal (see §2) | yes |
| 11 | `/404` | static page | minimal | no |
| 11b | `/he/404` | static page (RTL) | minimal | no |
| 12 | `/rss.xml`, `/he/rss.xml` | feed (non-page) | — | footer |
| 13 | `/sitemap-index.xml` | generated | — | no |
| 14 | `/he/` | redirect → `/he/writing/` | — | no |
| 15 | `/admin`, `/admin/*` | **private**, API-served | — | never |
| 16 | `/api/v1/*` | JSON, not IA | — | never |

Trailing slashes are shown as the canonical form; the exact
`trailingSlash` config is a Phase 2 setting, but it must be consistent —
one form, enforced, because the RSS feed uses absolute URLs and two
spellings of one page would produce two link targets for the same content.
The non-canonical spelling must redirect, never reach the 404.

**Analytics keys are never paths** — content pages use `<collection>:<id>`
and the one static page that emits events uses `page:home`
(`content-model.md` §2, §6; ADR 0024). This is exactly why a trailing-slash
change cannot split a page's history: the key is a name the content model
assigns, not a URL.

---

## 2. Every route

Theme behavior is identical for rows 1–11b and stated once here rather than
repeated: **renders in the visitor's active temperature (dark by default);
the route never pins, forces, or restores a temperature.** Deviations would
be violations, and there are none.

**On the "minimal" archetype in §1.** M2 defines exactly two archetypes
(`palette.md` §1). "Minimal" is **an M4 addition, not an M2 one**, and
it is named here rather than smuggled in: it is a short editorial column
without the deep-dive's sidebar, used by `/contact/` and the two 404s —
pages with too little content to carry either archetype at full strength.
It introduces no new tokens, no new patterns, and no new composition rules;
it is a *reduction* of the deep-dive archetype, which is why it does not
reopen M2. If Phase 2 finds it needs anything the two archetypes do not
already provide, that is a design decision and belongs to a new ADR, not to
this label.

### 1. `/` — home

- **Purpose:** state who this is and route to the writing in one screen.
  It is not a landing page selling a service; the primary goal is community
  standing (`about-tal.md`), so the fastest honest path from arrival to an
  article is the design target.
- **Archetype:** overview.
- **Composition:** hero (ADR 0017 — bare protocol resolution, typing
  sequence, `://` takes `--accent-3` at completion, dark-only glow) + one
  tagline line; then recent writing; then selected projects; then a short
  line pointing at `/about`.
- **Carries the portrait?** **No** — ADR 0018 is explicit: About + favicon
  only, and the hero is the mark's register, not the person's.
- **Dynamic layer:** a view-event beacon only, keyed `page:home` — no
  reads, nothing rendered from the API. Included because this is the site's
  entry point, where ADR 0020's per-referrer aggregation is worth most; it
  is the only static page that emits an event (`content-model.md` §6).

### 2. `/writing/` — original articles (English)

- **Purpose:** the index of Tal's own writing. This is the site's center of
  gravity.
- **Archetype:** overview (entry rows/cards, chip badges for tags).
- **States:** populated · **empty state required** (the site will launch with
  few or zero entries — see `pages/`).
- **Dynamic layer:** optional per-entry view counts, progressive
  enhancement, degrade to absence (ADR 0019) — **off at launch**, so the
  route carries no dynamic-layer script until it is turned on. No reactions on the
  index, and **no view event** (`content-model.md` §6).
- **Cross-link:** persistent pointer to the Hebrew translations (§3).

### 3. `/writing/[id]/` — an original article

- **Purpose:** read the article.
- **Archetype:** deep-dive editorial.
- **`lang`/`dir`:** `en` / `ltr`, **from the locale, not from frontmatter**
  — one source of truth for direction (`content-model.md` §5).
- **Dynamic layer:** view event POST on load; view count + reactions
  rendered by progressive enhancement (ADR 0020). Both degrade to absence.
- **Feed:** included in `/rss.xml`.

### 4. `/he/writing/` — translations index (Hebrew, RTL)

- **Purpose:** the Hebrew entry point for the Israeli dev community — the
  audience the primary goal names first.
- **Archetype:** overview, rendered `dir="rtl"`.
- **Chrome language:** Hebrew. This page's own nav, labels, and eyebrow
  section segment are Hebrew (the `T://bendet` mark segment is never
  translated or transliterated — ADR 0001, typography.md §6).
- **Dynamic layer:** same as `/writing/`.
- **Scope honesty:** the `he` locale covers **this section only**. See §3.

### 5. `/he/writing/[id]/` — a translated article (Hebrew, RTL)

- **Purpose:** read the translation.
- **Archetype:** deep-dive editorial, `dir="rtl"`.
- **Required, non-negotiable (ADRs 0010 preserved requirement + 0011):**
  renders `<html lang="he" dir="rtl">`, and credits the original article and
  its author. The credit model is checkpoint 2's subject and is specified in
  `content-model.md`.
- **Code blocks stay LTR** inside the RTL page (typography.md §7.1).
- **Dynamic layer:** identical to row 3 — view event POST on load
  (`translations:<id>`); view count + reactions by progressive enhancement.
  Both degrade to absence (ADR 0020, `content-model.md` §6). The symmetry is
  deliberate: asymmetry here would read as second-class treatment of the
  Hebrew work.
- **Feed:** `/he/rss.xml`.

### 6. `/projects/` — projects index

- **Purpose:** the proof behind the writing. "The writing and translations
  are the point; the projects are the proof" (`identity-thesis.md`).
- **Archetype:** overview (card grid — this is the archetype's native
  pattern).
- **States:** populated · empty state not required in practice (there are
  already two real projects) but specified anyway.
- **Dynamic layer:** none — no reads, and **no view event**; no dynamic-layer script (the only client script on this route is the global theme script — ADR 0002, `tokens.md` §2) (`content-model.md` §6).

### 7. `/projects/[id]/` — a project case study — **OPTIONAL PER PROJECT**

- **Purpose:** depth where depth genuinely exists.
- **Honest constraint:** with two projects, mandatory detail pages would
  manufacture thin pages, which is worse than a rich card that links out.
  The content model therefore makes the body optional: an entry with a body
  gets a page and its card links inward; an entry without one links straight
  to its repo or live URL and **no route is generated**. This is a content
  decision per project, not a template decision.
- **Archetype:** deep-dive editorial.
- **Dynamic layer:** view events only; no reactions (ADR 0020 scopes
  reactions to articles).

### 8. `/about/` — the person

- **Purpose:** the human surface. Absorbs what a `/now` page would carry
  (see §4), without the staleness contract.
- **Archetype:** deep-dive editorial.
- **Binding obligation (ADR 0018 / M2 handoff):** reserves the
  bio-beside-portrait slot. **No other route carries the portrait.**
- **Accumulation rule (M1 brief):** this is the surface where illustration,
  bio, and quiet details meet — reference density stays at zero here. The
  person carries this page, not the symbols.
- **CV:** the PDF is linked from this page. It is not a route (§4).
- **Dynamic layer:** none — no reads, no view event; no dynamic-layer script
  (the only client script here is the global theme script — ADR 0002,
  `tokens.md` §2) (`content-model.md` §6).

### 9. `/colophon/` — how this site is built

**DECIDED at checkpoint 1 (Tal, 2026-07-21): ships, as a page, footer-linked.**

- **Purpose:** make ADR 0012's showcase *visible to a visitor*. The
  infrastructure — SQL, Docker, from-scratch CI/CD, cloud deploy — is
  genuinely built either way, but without this page it exists only in the
  repo and the site never says so. `identity-thesis.md`: "its own
  infrastructure is part of the exhibit."
- **Archetype:** deep-dive editorial.
- **The honest risk, stated:** a colophon is one keystroke from a brag page,
  and "no promotional framing of any technology, including ones we've
  already chosen" (CLAUDE.md) is a hard rule. The mitigation is that this
  page is written in the tradeoff register the ADRs already use — what was
  chosen, what it cost, what was rejected and why — which is the only
  register that makes it worth reading. If it cannot be written that way, it
  should not exist.
- **Naming:** `/colophon` is the print-lineage term and sits in the
  editorial register. Alternatives considered: `/stack` (accurate, generic,
  fails the M1 anti-test), `/how-this-works` (verbose).
- **Nav placement:** footer only, not primary nav — it is a reward for the
  curious, not a headline claim. Consistent with restraint.
- **Dynamic layer:** none — no reads, and **no view event**. Two distinct
  reasons, both load-bearing. It must **not** display live build or deploy
  status: that would make a static page depend on the API and invert the R4
  anchor. And it emits no beacon, so the page carries no dynamic-layer script (the only client script here is the global theme script — ADR 0002, `tokens.md` §2) — a page
  arguing for a restrained stack while carrying a script to measure who read
  the argument would undercut itself (`content-model.md` §6).
- **Page vs article — the alternative Tal rejected at checkpoint 1.** The
  same material could ship as a dated article at
  `/writing/how-this-site-is-built/`: it would enter the feed, sit where
  the writing lives, and supersede naturally (write a follow-up rather than
  edit history — the pattern this project already uses for ADRs). Rejected
  because the two are genuinely different artifacts: **a colophon is a
  living document describing the current stack; an article is a dated
  snapshot.** Tal chose the living document. The consequence he accepted is
  the maintenance contract — **a stale colophon actively misinforms**, so
  it is updated when the stack changes, and that obligation belongs in
  Mission 5's workflow design, not to memory.
- **Standing risk, recorded so it can be checked later:** the failure mode
  is not writing this page badly on day one, it is version 2 drifting
  toward "Built with Astro / Docker / AWS" as things accumulate. The test
  that keeps it honest: **every claim on the page is paired with what it
  cost or what it rejected.** A sentence that only says what was used does
  not belong.

### 10. `/contact/` — where to find me

**DECIDED at checkpoint 1 (Tal, 2026-07-21): stays a route.**

- **Purpose:** reachability, with a real job beyond a link list: what Tal is
  open to (work, translation requests and article suggestions from the
  Israeli dev community) and the direct channels — email, GitHub, LinkedIn.
- **Archetype:** minimal — neither archetype at full strength. It is a short
  editorial column without the deep-dive sidebar. Recorded as a deliberate
  third, reduced composition rather than pretending it is one of the two.
- **No form.** A contact form would need a POST endpoint, spam handling, and
  mail delivery — none of which ADR 0020 authorizes, and all of which are
  real ongoing cost. Static links only.
- **Voice constraint:** the "let's connect" phrase family is banned and this
  is the single page most likely to reach for it (symbol map, banned #6).
- **Dynamic layer:** none — no reads, no view event; no dynamic-layer script (the only client script here is the global theme script — ADR 0002, `tokens.md` §2) (`content-model.md` §6). The absent form is a separate decision, above.
- **Honest note:** this page is thin by nature — roughly fifty words and
  three links is its honest maximum, not a strawman. It survives on Tal's
  own list of required pages, and on one substantive argument: "open to
  translation requests and article suggestions from the Israeli dev
  community" needs a surface of its own when community standing is the
  primary goal. If it ever reads as filler, its content folds into
  `/about/` and the route retires. Recorded so that is a decision, not a
  drift.
- **Alternatives rejected at checkpoint 1:** *fold into `/about/`* (same
  words closing the bio page — costs the nav word "contact", which is the
  one term visitors actively scan for); *footer only, no page* (the three
  links already appear in every footer, so the page would be redundant —
  but it strands the openness sentence, which is the genuinely useful part
  and the only part the footer cannot carry).

### 11. `/404`

- **Purpose:** recover the visitor.
- **Archetype:** minimal.
- **Constraint:** the 404 page is the classic place to put a wink at hidden
  features. It **must not.** No hint, no label, no nudge toward the
  incantation (ADR 0002, symbol map banned #7). It points to `/writing/` and
  `/` and nothing else.
- **Dynamic layer:** none — no reads, no view event; no dynamic-layer script (the only client script here is the global theme script — ADR 0002, `tokens.md` §2). A 404
  beacon was considered and rejected on data-model grounds: it could record
  that *a* 404 occurred but not *which URL broke*, and making it record that
  means storing arbitrary visitor-supplied paths (`content-model.md` §6).
  Broken inbound links are a server-log question.

### 11b. `/he/404` — the Hebrew error page

**Added 2026-07-21, after checkpoint 1**, on a gap the `ia-planner` correctly
declined to invent while writing the page briefs: v1 of this document
enumerated one 404, so a Hebrew reader who mistyped a `/he/writing/` URL got
an English error page.

- **Why it ships:** checkpoint 1 decided the Hebrew subtree is *its own front
  door*, not a section inside the English site. A front door whose error page
  speaks a different language breaks that decision at precisely the moment
  the visitor is already disoriented. The footer's Hebrew link makes the
  English 404 *recoverable*, which is not the same as *coherent*.
- **Scope:** it is the same minimal composition as `/404`, in Hebrew, RTL,
  pointing at `/he/writing/` and `/`. Every exclusion binding on `/404`
  binds here identically — above all, no hint of a second theme, and no
  view event and no dynamic-layer script.
- **Mechanism, flagged not asserted:** a static build emits one conventional
  `404.html`; serving a different error page for the `/he/*` prefix is a
  `handle_errors` matcher in the Caddyfile (`architecture.md` §4
  already has Caddy routing `/api/*` and `/admin/*`). **Owed verification at
  scaffold time**, per M3's discipline of flagging rather than assuming.
- **Honest cost:** this puts one piece of *page* routing in Caddy config,
  which the static core otherwise does not need — page serving is
  file-system-shaped everywhere else. Accepted as small and local, but it is
  a real seam between the two layers and is recorded as one rather than
  presented as free.

### 12. `/rss.xml` and `/he/rss.xml`

- **Purpose:** a feed is genuinely warranted for a writing-centric site
  aimed at a dev community, and it is close to free on a static build.
- **Two feeds, not one:** the audiences and languages are different, and a
  reader subscribing for Hebrew translations should not receive English
  originals (or the reverse). Each feed carries its own `language`.
- Footer-linked, per language context.

### 13. `/sitemap-index.xml`

- Generated by `@astrojs/sitemap`. **`/admin` and `/api` are excluded.**
- **hreflang honesty (correcting an assumption carried from M3):**
  `architecture.md` §1 notes hreflang alternates via the sitemap
  i18n option. That option pairs *translations of the same page*. Here, a
  Hebrew article is a translation of a **third-party English article**, not
  of any page on this site — so there is no valid alternate to declare, and
  declaring one would assert a false equivalence to search engines. **No
  hreflang alternates are emitted between `/writing/*` and
  `/he/writing/*`.** Per-page `lang` is still correct and still emitted.
  This is the one place M4 diverges from an M3 implementation note, and it
  is a factual correction, not a preference.

### 14. `/he/` — redirect to `/he/writing/`

- Astro's i18n creates a locale prefix; `/he/` would otherwise 404. A thin
  Hebrew landing page was rejected — it would exist only to hold a link.
  A static-build redirect costs nothing.

### 15. `/admin`, `/admin/*` — private (NOT public IA)

- Served by the `api` container, session-gated, server-rendered (ADR 0020).
- **Excluded from:** primary nav, footer, sitemap.xml, and RSS. `robots.txt`
  disallows it. It appears in this document only so its existence on the
  domain is recorded — it is a private tool, not a site page (ADR 0020's own
  words), and it is out of scope for `pages/`.

### 16. `/api/v1/*` — JSON

- Not IA. Listed for completeness of what answers on the domain.

---

## 3. Translated articles — route shape

**DECIDED at checkpoint 1 (Tal, 2026-07-21): candidate C, the locale
subtree `/he/writing/`.** The framing Tal decided against, stated as he was
asked it: *is the Hebrew work its own front door, or a section inside the
English site?* He chose front door.

ADR 0010 as originally made: one `/writing` with a tab switcher (Original /
Translated) and post-count badges. Tal's reopening proposal: translated
articles as a **subsection** inside Articles. M3 then decided Astro built-in
i18n with an `he` locale and manual RTL wiring, which changes what the cheap
option is.

### Recommendation: **locale subtree** — `/he/writing/`

Four candidates, honestly:

| | Shape | Verdict |
|---|---|---|
| **A** | Tabs on `/writing/` (ADR 0010 as written) | Rejected |
| **B** | Path subsection: `/writing/translations/[id]/` | Rejected |
| **C** | Locale subtree: `/he/writing/[id]/` | **DECIDED** |
| **D** | One merged list, per-entry `dir` only | Rejected |

**Why A is rejected.** Tabs need JS to switch, or they are two pages wearing
one URL. On a static, near-zero-JS core (R1 was the top-weighted requirement
in M3's evaluation) that is a real cost for a real loss: no shareable URL for
the translations list, nothing for a feed reader or a search engine to index
as a Hebrew surface, and the Israeli dev community — the primary audience —
lands on an English page and must find a control. The count badges are
independently fine and survive into C as list metadata.

**Why B is rejected.** It gets distinct URLs, but nests Hebrew RTL content
inside an English section's path and chrome. The section's own index stays
English; the Hebrew work reads as an annex to the English site. It also
fights Astro's i18n, which prefixes locales rather than sub-pathing them, so
`lang`/`dir` would be per-entry logic rather than a route-level property.

**Why D is rejected.** One chronological list mixing English originals and
Hebrew translations serves neither reader: each sees roughly half the rows as
noise, in a script they may not read, with rows flipping direction down the
page.

**Why C.** It is the shape M3's stack already implies (`architecture-
decision.md` §1: translated articles prebuilt with `<html lang="he"
dir="rtl">` via Astro's i18n locale config). Direction and language become
**route-level properties** rather than per-entry conditionals — which is what
makes ADR 0011 checkable in CI: the Playwright stage asserts
`html[lang="he"][dir="rtl"]` on a route, not on a rendered state. The Hebrew
index gets a real URL to share in Israeli dev spaces, its own feed, and
Hebrew chrome. And it matches how the person actually works: two languages,
each fully itself, not one hosting the other as a mode.

**The honest cost of C, stated plainly:** the `he` locale is a **partial
localization** — it covers the writing section and nothing else. There is no
Hebrew `/about`, `/projects`, or `/`, and there should not be: they do not
exist as Hebrew content and machine-translating them would be exactly the
fakeness this project's rules forbid. Consequences accepted:
1. Navigation inside the Hebrew subtree links to English pages for
   everything except the translations. `navigation.md` must handle this
   honestly rather than hiding the seam.
2. A visitor can reach an English page from a Hebrew one and find no way
   back to Hebrew except the nav's translations link. That link is therefore
   persistent in the footer on every page, in Hebrew script.
3. No hreflang alternates (§2, row 13).

**Section naming:** `/he/writing/` reuses the English section name in the
path. `/he/translations/` was considered — more literally accurate, since
the Hebrew subtree contains only translations — but it makes the same
section carry different path names per locale, adding a route-mapping layer
for a string a Hebrew reader does not read anyway. The *visible* Hebrew
title of the page is Hebrew regardless of the path.

**Slugs in the Hebrew subtree are Latin, titles are Hebrew.** A Hebrew slug
percent-encodes the moment anyone copies the URL
(`/he/writing/תכנות-aha/` → `/he/writing/%D7%AA%D7%9B%D7%A0%D7%95%D7%AA-aha/`),
which is unshareable in exactly the channels this section exists to be
shared in. The entry's `title` is Hebrew and is what every visitor actually
sees; the slug derives from the **original English article**, which also
makes the pairing legible in the repo. Example:
`/he/writing/aha-programming/` renders `‏תכנות AHA`. This is a route-shape
fact, so it is recorded here; the frontmatter field that carries it is in
`content-model.md`.

**Checkpoint 2 (separate) owns:** the credit block's exact content and
placement, canonical-link behavior toward the original article, the
frontmatter schema, and whether a translation may carry translator's notes.

---

## 4. Pages evaluated and rejected

The mission brief asks for honest evaluation of what a strong portfolio
warrants, and explicit permission to reject freely. Rejections are as much
the deliverable as the accepted routes.

### `/uses` — **rejected**

The `uses.tech` idiom. It is a genuine community convention, which is
exactly the problem: it is the same page on hundreds of sites, and M1's
anti-test is binary — *if it could appear on any competent developer's
portfolio unchanged, it fails.* A list of an editor, a terminal, and a
keyboard is that page. It also carries a silent maintenance contract: a
`/uses` page that is two years stale actively misinforms. Zero contribution
to community standing, zero contribution to the ADR 0012 showcase.

### `/now` — **rejected**

The `nownownow.com` idiom. It has the worst staleness profile of any page
type on the list: its entire value is being current, and it decays to
embarrassment faster than anything else here — a `/now` page reading "on
parental leave with newborn twins" a year after the fact is worse than no
page. Its honest content (what Tal is doing and what he is available for)
is genuinely useful, so it is **absorbed into `/about/`**, where the same
words carry no currency promise.

### `/lab` or `/experiments` — **rejected for launch**

A lab page with nothing in it is worse than no lab page, and there is no
queue of experiments in the record. It is also the page most likely to
become a graveyard of half-finished demos, which reads as abandonment rather
than curiosity. Nothing forecloses it: the content model's project
collection can express an "experiment" kind later, and adding the route then
costs one file. Recorded as deferred-by-emptiness, not rejected on principle.

### `/writing/tags/[tag]/` — **deferred, model kept**

Tag index pages multiply thin pages when the article count is small: ten
articles across six tags produces six pages averaging under two entries.
Tags are still worth carrying **as metadata** (they are already an idiom in
Tal's prototypes as chip badges), so `content-model.md` defines a `tags`
field and the indexes render them as non-linking chips at launch. When the
corpus justifies it, the route is added and the chips become links — no
content migration. This is a threshold decision, not a taste one: revisit
when any single tag has five or more entries.

### `/resume` or `/cv` — **rejected as a route**

The CV exists (`docs/research/Tal_Bendet_CV.pdf`) and Tal is available for
work, so hiding it would be dishonest. But a route for a PDF is a redirect
with extra steps, and a full HTML resume page competes with `/about` for the
same job while making the site read as a job-board asset — which the stated
primary goal explicitly is not. **Linked as a file from `/about/`.**

### `/speaking`, `/newsletter`, `/testimonials` — **rejected**

No talks, no newsletter, no testimonials exist. Each would be a page whose
only content is its own absence.

### A search page — **rejected for launch**

Already out of scope per `architecture.md` §7. At launch's corpus
size, browsing is faster than searching. Noted as an honest future addition
that nothing depends on.

---

## 5. Checkpoint 1 — resolved (Tal, 2026-07-21)

| Call | Decision | Where |
|---|---|---|
| **A — translations route shape** | **C, locale subtree `/he/writing/`** | §3 |
| **B — `/colophon/`** | **Ships, as a living page, footer-linked** | §2 row 9 |
| **C — `/contact/`** | **Stays a route** | §2 row 10 |

Notes on how the calls were put and what they cost:

- **A** supersedes ADR 0010's tabs and is a genuine fork — it is neither the
  original ADR nor literally Tal's "subsection" phrasing, but the
  subsection idea implemented as a locale, which is what the M3 stack
  supports natively. Tal was shown all four shapes as concrete URL trees
  before deciding, and answered the framing question — front door, not
  section. **Accepted cost: partial localization**, with the seam shown
  rather than hidden (§3).
- **B** was decided against a fourth option surfaced during the checkpoint
  (ship it as a dated article instead of a living page). Living page won.
  **Accepted cost: a maintenance contract** — see §2 row 9.
- **C** was decided against both folding into `/about/` and footer-only.
  **Accepted cost: a thin page**, kept because the openness sentence needs
  a surface the footer cannot give it.

Everything else in this document follows from active ADRs and did not need a
decision — including §0, which is a conflict resolution forced by ADR 0002's
`active` status, not a preference. It was put to Tal as *forced, not
preferred*, with the note that overriding it would mean reopening ADR 0002
and escalating; he did not.

## 6. What this fixes for ADRs 0009 and 0010

Both reopened ADRs are superseded on the basis of this document (M4's
declared license):

- **0009** — its route set survives in amended form (`/contact` kept, `/`
  `/about` `/projects` kept, `/writing` split by locale, `/colophon` added);
  **its per-route theme assignment is deleted outright** (§0).
- **0010** — its tab switcher is deleted; its **preserved requirement
  survives intact** (translated posts render `dir="rtl"` and credit the
  original article and author) and is specified in `content-model.md`. Its
  post-count badges survive as list metadata, not as tab affordances.
