# Navigation Spec — T://bendet

Basis: `routes/sitemap.md` (route set, the mark-as-home-link entry, the
Hebrew seam consequences, the `/404` constraint), `content-model.md` (feeds,
RTL contract, dynamic-layer touchpoints), `brand.md` (allowed/banned
vocabulary with tests), `design/typography.md` §6–7 (eyebrow treatment, RTL
type rules), `design/palette.md` §7–8 (accent placement, logical edges),
`design/hero-and-motion.md` (motion budget).

Scope: site chrome — the global header, the primary nav, the eyebrow, and the
footer — plus the rules that govern crossing the Hebrew seam. Page interiors
are in `pages/`. No pixel values, no finished copy.

**Standing caveat on Hebrew strings.** Every Hebrew label written here
(`תרגומים` and the like) is a placeholder for intent. Tal is the native
speaker and the voice owner; final wording is his. What is binding is the
*structure* — which element carries a Hebrew label, in which script, with
which `lang` attribute — not the specific word.

---

## 1. The chrome model

Four regions (a skip link, then three landmarks), identical in structure on
all twelve public routes, in this
DOM order:

| # | Region | Contents | Landmark |
|---|---|---|---|
| 0 | Skip link | first focusable element; targets `#content` | — |
| 1 | Global header | eyebrow (with the mark) · primary nav | `<header>` + `<nav>` |
| 2 | Main | the page (per `pages/`) | `<main id="content">` |
| 3 | Footer | feed · colophon · direct links · the Hebrew link | `<footer>` |

**Every page also carries one inline head script** — the ADR 0002 theme
mechanism (keydown buffer, `data-theme`, `localStorage`), which
`tokens.md` §2 requires to run before first paint. It is chrome in
the same sense the footer is: present on all twelve routes, identical, and
not a per-page decision. **Consequence worth stating once here so no page
brief has to rediscover it: there are no zero-JS routes on this site.** When
a brief says a route has "no JavaScript", it means no *dynamic-layer* script
— no beacon, no API reads. It never means an empty `<head>`.

**INV-3 — chrome is content-independent.** The header, nav, eyebrow, and
footer render identically whether the site has zero articles or two hundred.
No chrome element appears, disappears, or changes label as a function of how
much content exists. Rationale: the alternative (hiding a nav item for an
empty section) makes the site's navigation shape a moving target between
deploys, contradicts `identity-thesis.md`'s "consistency treated as a
feature", and produces the worst outcome for a returning visitor — a
destination that was there last week and is not there now. The cost is
accepted and paid inside the pages: an empty section is honest about itself
when you arrive (`pages/writing-index.md` §4), rather than being hidden
from the nav.

**The header is not sticky.** The deep-dive archetype's sidebar *is* sticky
(prototype-native: `tooling-deepdive.html` `nav.sidebar { position: sticky }`),
but that sidebar is in-page navigation, not site navigation. A sticky global
header would spend vertical space on every scroll of every long article for a
control the reader uses once. Recorded as a decision, not an omission.

---

## 2. Primary nav

### 2.1 Items

Fixed set and order, from `sitemap.md` §1 (column "In nav") and §2:

| # | Label | Destination | Language of label |
|---|---|---|---|
| — | `T://bendet` (the mark, inside the eyebrow) | `/` | n/a — the mark is never translated |
| 1 | `writing` | `/writing/` | en |
| 2 | `תרגומים` | `/he/writing/` | he |
| 3 | `projects` | `/projects/` | en |
| 4 | `about` | `/about/` | en |
| 5 | `contact` | `/contact/` | en |

Not in the primary nav, deliberately:

- **`/colophon/`** — footer only (`sitemap.md` §2 row 9: a reward for the
  curious, not a headline claim).
- **`/admin`, `/api/v1/*`** — never, anywhere (`sitemap.md` §2 rows 15–16).
- **The feeds** — footer only; a feed is a subscription action, not a
  destination a first-time visitor scans for.
- **Any theme control.** There is none. See §6.

The translations item points at `/he/writing/`, never at `/he/` — the latter
is a redirect (`sitemap.md` §2 row 14) and routing chrome through a redirect
costs a round trip for nothing.

### 2.2 The label-language rule (this is how the seam is shown, not hidden)

**Every nav item is labelled in the language of the page it leads to.** The
same nav renders on English and Hebrew pages: four English words and one
Hebrew word, in both locales. Only the flow direction changes (§5).

Consequences and why each is wanted:

1. **A link discloses its destination's language before the click.** An
   English reader who clicks `תרגומים` has already been told, by the script
   itself, that they are going somewhere Hebrew. Nothing flips direction
   under them by surprise.
2. **The Hebrew reader's own script is the most scannable thing in the nav** —
   which is correct, because the Israeli dev community is the audience the
   primary goal names first (`about-tal.md`).
3. **Inside `/he/`, the nav honestly shows a partial localization.** Four
   English words in the Hebrew chrome is exactly what the site is: a Hebrew
   front door onto the writing, with everything else in English
   (`sitemap.md` §3, accepted cost 1). The seam is legible in one glance
   instead of being discovered by a click that lands in an unexpected
   language.

**Accessibility requirement (testable):** any nav item whose label language
differs from the document's `lang` carries its own `lang` attribute — so
`lang="he"` on `תרגומים` inside an English page, and `lang="en"` on the four
English items inside `/he/` pages. A screen reader must switch voice at the
seam, because the seam is real.

**Stated assumption, not asserted fact:** this rule assumes Israeli
developers read English technical text fluently, and that the translations
serve people who *prefer* Hebrew rather than people who cannot read English
(`about-tal.md` describes the work as useful, not as remedial). If that
assumption is wrong, the rule is wrong, and the fix is Hebrew labels with an
explicit language marker per item — recorded so the assumption can be
challenged rather than inherited.

**Rejected alternatives.**

- *English labels everywhere (`translations`).* Tells an English reader what
  the section is, but hides its language until the page loads RTL under them,
  and gives the Hebrew audience nothing to scan for. Hiding the seam is the
  one thing `sitemap.md` §3 explicitly forbids.
- *Hebrew labels for every item inside `/he/`.* Promises Hebrew and delivers
  English on four of five destinations. This is the seam papered over, and it
  is worse than the seam.
- *A language-switcher widget (`EN | HE`).* Implies parity that does not
  exist: there is no Hebrew `/about/` to switch to. A switcher on a partial
  localization is a broken promise wearing a standard UI pattern
  (`sitemap.md` §3). Also, on a page-level switcher, the honest behavior for
  four of five routes is "this page has no counterpart" — a control that is
  disabled most of the time.
- *`Accept-Language` auto-redirect at the edge.* Rejected on four grounds:
  the static core has no request context (ADR 0019 — the redirect would have
  to live in Caddy, putting locale logic in the proxy); it breaks shareable
  URLs, which is the entire reason candidate C won at checkpoint 1; an
  Israeli visitor who wants the English original would be sent to a locale
  covering one section; and browser language settings describe UI preference,
  not reading preference.

### 2.3 Current-page state

- The nav item for the section containing the current route is marked as
  current. `aria-current="page"` is used **only on an exact URL match** — at
  most one per document. Child routes (`/writing/[id]/`,
  `/he/writing/[id]/`, `/projects/[id]/`) mark their section's item visually
  and with `aria-current="true"`, not `"page"`.
- **`/colophon/`, `/404` and `/he/404` have no owning nav item.** On
  `/colophon/` the footer's colophon link carries `aria-current="page"`
  instead. On either 404 no chrome link is current — correct, because the
  page the visitor asked for does not exist.
- **The duplicated-link case, resolved.** `/he/writing/` is linked twice on
  every page: as nav item 2 *and* as the footer's persistent Hebrew link
  (§4.1, invariant R-3). On `/he/writing/` itself, an exact-URL-match rule
  applied naively marks **both**, breaking test N-4. **The nav item wins:**
  `aria-current="page"` goes on the nav occurrence only, and the footer
  occurrence carries no current-state attribute. The rule generalizes —
  *when one URL appears in more than one chrome region, the primary nav
  occurrence is the one marked; footer duplicates never are* — which also
  keeps `/colophon/` correct, since there the footer link is the **only**
  occurrence and therefore the primary one.
- Visual treatment is M2's `nav-link` idiom (accent edge bound with
  `border-inline-start`, `palette.md` §8.1). The current state must not
  be carried by color alone.

### 2.4 Narrow viewports

The nav wraps to a second line. **There is no disclosure menu.** A JS
hamburger contradicts R1 (near-zero JS, the top-weighted M3 requirement) and
would be the only piece of site chrome that stops working when a script
fails; a CSS checkbox-hack menu is a hack carried forever for five short
words. Accepted cost: at the narrowest widths the header occupies two lines.

---

## 3. The eyebrow

### 3.1 Placement — decided here, because M2 did not place it

`typography.md` §6 fixes the eyebrow's *treatment* (mono family,
`--size-eyebrow` dark / `--size-label` warm, uppercase, `--track-eyebrow`,
`--muted`) and its identity rules, but not its position in a multi-page
document — the prototypes are standalone files with no site chrome, so their
placement of the eyebrow above the `h1` is not evidence about this question.
M4 decides:

**The eyebrow is the start slot of the global header, on every route, and the
mark segment inside it is the home link.**

This resolves three requirements with one element: the eyebrow-on-every-page
test (`symbol-and-language-map.md` §1), `sitemap.md` §1's nav entry for `/`
("mark (home)"), and ADR 0001's "used as logo … and the eyebrow-label prefix
throughout."

**The named cost — the mark renders twice on `/`.** The hero types
`T://bendet` at display scale (ADR 0017) while the header eyebrow carries
`T://bendet · home` in 11px mono. Alternatives considered:

- *Suppress the eyebrow on `/`.* Rejected: it breaks a binary identity test
  on the site's most-linked page, and makes the one page a stranger sees
  first the one page without its namespace label.
- *Bare mark, no section segment, on `/`.* Rejected: a third rendering
  variant of the mark, for one route, to avoid a repetition that is
  register-separated anyway (chrome vs. content).

The doubling is bounded to exactly one route — which is itself an argument
for the hero existing on `/` only, as ADR 0017 already requires. Recorded as
accepted, not hidden.

### 3.2 Segment per page

The segment names the **section**, never the page. Child routes inherit their
parent section's segment; an article's own title is the `h1` directly below
and repeating it in the eyebrow would be redundant.

| Route | Eyebrow | Segment language |
|---|---|---|
| `/` | `T://bendet · home` | en |
| `/writing/` | `T://bendet · writing` | en |
| `/writing/[id]/` | `T://bendet · writing` | en |
| `/he/writing/` | `T://bendet · תרגומים` | he |
| `/he/writing/[id]/` | `T://bendet · תרגומים` | he |
| `/projects/` | `T://bendet · projects` | en |
| `/projects/[id]/` | `T://bendet · projects` | en |
| `/about/` | `T://bendet · about` | en |
| `/colophon/` | `T://bendet · colophon` | en |
| `/contact/` | `T://bendet · contact` | en |
| `/404` | `T://bendet · 404` | en |
| `/he/404` | `T://bendet · 404` | **he** — segment renders under the Hebrew stack (no `text-transform`, `letter-spacing: normal`), inside `dir="rtl"`. The digits are an LTR run; the mark segment is unchanged and untranslated. |

**Test:** the set of distinct segments equals {home, writing, תרגומים,
projects, about, colophon, contact, 404} — eight, forever, until a route is
added. A ninth segment means someone gave a leaf page its own label.
`/404` and `/he/404` deliberately **share** the `404` segment: it is the
same section in two locales, and giving the Hebrew one its own segment
would break the rule above for no gain.

`404` as a segment is the protocol register doing its own job — a status code
in a namespace label. It is not a joke, not a wink, and carries no hint of
anything hidden (§6).

### 3.3 Binding rules

1. **The mark segment `T://bendet` is never translated, transliterated,
   restyled, or themed** (ADR 0001; `typography.md` §6). It renders
   identically in both temperatures, both directions, and both locales.
2. **The mark segment is a link to `/`; the section segment is not
   interactive.** A section-segment link would be a one-level breadcrumb
   duplicating a nav item that is visible three centimetres away, and it
   would be a self-link on section indexes — conditional interactivity for no
   gain. On `/`, the mark link carries `aria-current="page"`.
3. **Linking the mark must not alter its resting appearance.** No persistent
   underline, no color change, no weight change in the resting state. Hover
   and focus are interaction states, not theming — focus uses `--focus`
   (`palette.md` §7.5). Test: screenshot the eyebrow on `/about/` and on
   any page, resting; the mark is pixel-identical to its rendering as
   non-interactive text.
4. **Hebrew segments carry no `text-transform` and `letter-spacing: normal`**
   (`typography.md` §6 — Hebrew is unicameral; 0.2em tracking is a
   Latin-caps idiom). The Latin segments keep `--track-eyebrow`.
5. **RTL ordering.** The eyebrow line follows the page's `dir`. DOM order is
   always mark → separator → segment. Under `dir="rtl"` this renders with
   `T://bendet` at the reading start (visually rightmost), the `·` next, and
   the Hebrew segment to its left — which is the correct reading:
   the namespace root first, then the location inside it. The mark is an LTR
   run inside an RTL line; rely on Unicode bidi, with `<bdi>` as the
   documented fallback if QA finds the `://` misordered
   (`content-model.md` §5 rule 3).

### 3.4 Document titles and descriptions

The `<title>` is not the eyebrow, but it carries the same unaltered mark.

| Route class | `<title>` pattern |
|---|---|
| `/` | `T://bendet` + a short descriptor (copy is Tal's) |
| Section index | `writing · T://bendet` (section name, then mark) |
| Entry page | `<entry title> · T://bendet` — Hebrew title verbatim for translations |
| Static page | `about · T://bendet` |
| `/404` | `404 · T://bendet` |
| `/he/404` | `404 · T://bendet` — Hebrew page copy, but the title string carries no translatable words |

- Meta description comes from the entry's `description` field, which
  `content-model.md` §3.1 already makes required and dual-purpose. Static
  pages carry an authored description. **Never auto-generated from the first
  paragraph** — a derived description drifts from the page's actual point and
  nobody notices.
- **Open, and deliberately not decided by M4:** social-card imagery (OG /
  Twitter). It is a build dependency and a design decision, not an IA one,
  and no composition in `pages/` depends on it. Flagged for Phase 2 so
  it is a decision rather than a default.

---

## 4. Footer

### 4.1 Contents

From `sitemap.md` §2 row 12 ("footer-linked, per language context"), row 9
(colophon is footer-only), row 10 (the three links appear in every footer),
and §3 accepted-cost 2 (the persistent Hebrew link):

| Slot | English pages | Hebrew pages (`/he/*`) |
|---|---|---|
| Feed | `/rss.xml` | `/he/rss.xml` |
| Colophon | `/colophon/` (label: en) | `/colophon/` (label: en — it is an English page) |
| Direct links | email · GitHub · LinkedIn | same |
| Hebrew translations | `/he/writing/`, labelled `תרגומים`, `lang="he"` | same link, but **never marked current** — the nav occurrence carries `aria-current`, this one carries nothing (§2.3's duplicated-link rule) |

**One feed per page, not both.** The footer offers the feed matching the
current locale. Offering both on every page doubles a chrome element for a
rare action, and a Hebrew-feed subscriber is by definition someone who
reached the Hebrew section — where their feed is. Cost, stated: an English
reader who wants the Hebrew feed must visit `/he/writing/` first.

**The Hebrew link is deliberately redundant with nav item 2.** Two links to
one destination in the chrome of every page is normally a smell. It is kept
because the nav is at the top of the document and a reader who has just
finished a long article is at the bottom, and because this is the one
destination whose loss strands an entire audience (`sitemap.md` §3,
consequence 2). Recorded as a considered redundancy.

### 4.2 What the footer does NOT carry, and why

| Cut | Reason |
|---|---|
| Any theme control, label, or hint | ADR 0002 · `symbol-and-language-map.md` banned #7. The footer is where other sites put the toggle; this one has none, and nothing in it acknowledges a second theme exists. |
| Copyright line | An unexamined `©` is template furniture. The genuinely useful version is an explicit content licence for Tal's writing and translations — which is **Tal's decision, not IA's**, and has not been made. Flagged as open; the footer ships without a licence line rather than with a meaningless one. |
| "Back to top" | The deep-dive sidebar is sticky and the browser has its own affordance. One fewer chrome element. |
| `/sitemap-index.xml` link | A machine surface. Discovered via `robots.txt` and a `<link>`, not by readers. |
| Full section list (footer nav mirror) | Duplicates the primary nav on a five-item site. |
| Newsletter capture | Nothing to send. It would also be the first element on the site that asks the visitor for something. |
| Build/deploy status, CI badges | `sitemap.md` §2 row 9 bans live status even on the colophon; a badge in the footer would make every page depend on a third party's uptime and is the brag idiom besides. |

---

## 5. RTL behavior of the chrome (ADR 0011)

1. **`dir` is set once, on `<html>`, derived from the locale**
   (`content-model.md` §5). No chrome component sets `dir`. The header, nav,
   and footer inherit it and flow accordingly.
2. **All chrome geometry binds logically** — `border-inline-start`,
   `padding-inline`, `margin-inline`, `text-align: start`
   (`tokens.md` §5, `palette.md` §8.1). The nav item's current
   edge and the deep-dive sidebar both land on the reading-start side under
   `dir="rtl"`, which means the sidebar sits on the right in Hebrew.
3. **Source order is direction-agnostic.** The nav's DOM order is items 1–5
   in both locales; RTL flow is the browser's job. No locale-specific
   reordering in markup.
4. **No directional glyphs in chrome.** No arrows, chevrons, or carets that
   would need mirroring. If one is ever introduced it must flip with the
   direction — the cheapest compliance is to not introduce one.
5. **Mixed runs:** the mark, URLs, and numerals inside Hebrew chrome are LTR
   runs handled by bidi defaults; `<bdi>` where QA shows misordering
   (`content-model.md` §5 rules 3 and 6).
6. **No horizontal overflow** at standard widths under `dir="rtl"` — asserted
   in CI (`content-model.md` §5, assertion 5). The chrome is the most likely
   place for this to break, because it is the widest single-line content on
   the page.

---

## 6. The no-acknowledgment rule (ADR 0002)

Binding on every element specified in this file:

- No chrome element references the second temperature, the switch, the
  phrases, or the existence of anything hidden. No toggle, no label, no
  tooltip, no `title` attribute, no `aria` announcement, no comment in
  shipped markup.
- Chrome identifiers stay mundane and avoid the banned vocabulary list in
  `tokens.md` §1.
- The 404 page — the classic site for a wink — carries none
  (`sitemap.md` §2 row 11).

**Test (binary, from `symbol-and-language-map.md` §2):** grep the shipped
chrome markup, CSS, and copy for any reference to a second theme or a hidden
feature → zero matches.

---

## 7. Reachability

### 7.1 Link inventory

| From | To | Mechanism |
|---|---|---|
| any page | `/` | eyebrow mark |
| any page | `/writing/`, `/he/writing/`, `/projects/`, `/about/`, `/contact/` | primary nav |
| any page | `/he/writing/` | footer (second path) |
| any page | `/colophon/` | footer |
| any page | locale feed | footer |
| any page | email · GitHub · LinkedIn | footer |
| `/` | up to 3 recent articles, up to 3 projects, `/about/` | page body |
| `/writing/` | each `/writing/[id]/`; `/he/writing/` | entry rows; in-page cross-link |
| `/writing/[id]/` | `/writing/`; sibling articles (when ≥2 exist) | end matter |
| `/he/writing/` | each `/he/writing/[id]/`; `/writing/` | entry rows; scope statement |
| `/he/writing/[id]/` | `/he/writing/`; the original article (2×); siblings | credit blocks, end matter |
| `/projects/` | `/projects/[id]/` **or** an external repo/live URL | cards |
| `/projects/[id]/` | repo/live URLs; `/projects/` | header + end matter |
| `/about/` | the CV PDF; `/contact/` | page body |
| `/404` | `/writing/`, `/` | page body (nothing else — `sitemap.md` §2 row 11) |
| `/he/404` | `/he/writing/`, `/` | page body (same constraint, Hebrew targets first — `sitemap.md` §11b) |
| `/he/` | `/he/writing/` | redirect |

### 7.2 Invariants (testable)

- **R-1.** Every section index and static page is reachable from every public
  page in **one** click.
- **R-2.** Every leaf page (`[id]` routes) is reachable from every public page
  in **two**.
- **R-3.** `/he/writing/` is reachable in one click from every page on the
  site, including `/404` — the Hebrew return path (`sitemap.md` §3,
  consequence 2). Two independent chrome paths satisfy it (§4.1).
- **R-4.** No public page is a dead end: every page, in every one of its
  states including empty ones, offers at least one route to content that
  exists (`pages/*` §4).
- **R-5.** No chrome link resolves to a redirect (`/he/` is never linked).
- **R-6.** No route reachable from chrome requires JavaScript to navigate.

### 7.3 The one conflict this spec had to resolve

`sitemap.md` §2 row 11 says the 404 "points to `/writing/` and `/` and
nothing else." `sitemap.md` §3 consequence 2 says the Hebrew translations
link is "persistent in the footer on every page." Every page includes `/404`.
Read literally, one of the two must give.

**Resolution: row 11 governs the page's own recovery content; it does not
govern site chrome.** Reasons: (a) the alternative reading makes `/404` the
only page with no header, no nav, and no footer, which strands the visitor
further and contradicts the row's own stated purpose ("recover the visitor");
(b) row 11's concern, read in context, is that the 404 must not accumulate
extra pointers *of its own* — the classic 404 failure of turning into a
sitemap or a joke; (c) the Hebrew safeguard exists precisely for visitors who
have lost their way, which is the exact population of the 404 page. So the
404's body carries two links and no more, and its footer is the same footer
as everywhere else. Named here rather than silently picked.

---

## 8. Rules index

| # | Rule | Test |
|---|---|---|
| N-1 | Chrome is content-independent | Build with zero entries in every collection; the header, nav, and footer are byte-identical to a populated build |
| N-2 | Nav item set is exactly the five in §2.1, in that order | Snapshot test on the nav markup |
| N-3 | Each nav item is labelled in its destination's language, with `lang` when it differs from the document | Assert `lang` attributes on nav items in both locales |
| N-4 | At most one `aria-current="page"` per document | Automated a11y pass |
| N-5 | The mark is never translated, transliterated, restyled, or themed | grep for any string containing `bendet` outside the exact mark; visual diff of the resting eyebrow |
| N-6 | Eyebrow segment set has exactly 8 members (§3.2) | Enumerate rendered eyebrows across the built site |
| N-7 | Hebrew runs carry no `text-transform`, `letter-spacing: normal` | CSS lint on the Hebrew eyebrow rule |
| N-8 | No physical-side CSS in chrome | Lint for `border-left/right`, `margin-left/right`, `padding-left/right`, `text-align: left/right` |
| N-9 | No chrome element acknowledges a second theme | grep (§6) |
| N-10 | `/he/writing/` reachable in one click from every page | Crawl the built site; assert on every page |
| N-11 | No chrome link targets a redirect | Crawl; assert every chrome href returns 200 |
| N-12 | Chrome navigation works with JS disabled | Playwright run with JS off; every chrome link navigates |
| N-13 | No horizontal overflow in chrome at standard widths, `dir="rtl"` | The CI RTL stage (`content-model.md` §5, assertion 5) |
