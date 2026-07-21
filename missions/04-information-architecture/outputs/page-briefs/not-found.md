# Page Brief — Not found (`/404` and `/he/404`)

Mission 4 · 2026-07-21

**This brief governs both 404 routes.** They are one composition in two
locales; every rule below binds both unless a row says otherwise (§5).

| | |
|---|---|
| Route | `/404` — any unresolved path outside `/he/*` (`sitemap.md` §2 row 11) · `/he/404` — any unresolved path under `/he/*` (`sitemap.md` §11b) |
| Archetype | minimal |
| Collection | none |
| `lang` / `dir` | `/404`: `en` / `ltr` · `/he/404`: `he` / `rtl` |
| Dynamic layer | **none** — no view event, no counts, nothing; no dynamic-layer script (the only client script on this route is the global theme script — ADR 0002, `tokens-reference.md` §2). The 404 beacon was considered and rejected on data-model grounds (`content-model.md` §6) |
| Chrome | per `navigation-spec.md`; eyebrow `T://bendet · 404`; **no nav item is current** |

Basis (law): `sitemap.md` §1 (canonical trailing-slash form), §2 row 11 ·
`navigation-spec.md` §7.3 (the chrome-vs-body conflict, resolved) · ADR 0002 +
`symbol-and-language-map.md` banned #7 (labelled easter eggs) ·
`architecture-decision.md` §4 (Caddy serves the static bundle).

---

## 1. Goal

Recover the visitor. Someone reached an address that does not resolve — a
mistyped URL, a link that rotted, a path from an old share — and the page's
entire job is to get them to content in one click without wasting their time
or their patience. It serves nobody else and has no second purpose. In
particular it is not a personality showcase: the 404 page is the classic
place to put a joke, an animation, or a wink at a hidden feature, and this one
does none of those.

## 2. Sections (ordered)

| # | Section | What it must do | Conditional? |
|---|---|---|---|
| 1 | Global header | eyebrow + nav — the same chrome as every page (§5) | always |
| 2 | Statement | one short line: the address did not resolve. Plain. The protocol register is native here — this site is a namespace and an address that resolves to nothing is the honest description — but it must stay a statement, not a bit | always |
| 3 | Two links | `/writing/` and `/` — **and nothing else** (`sitemap.md` §2 row 11) | always |
| 4 | Footer | the standard footer, including the persistent Hebrew link (§5) | always |

**The body carries two links. Not three, not a list of sections, not a
sitemap.** The nav above it already offers five destinations; the body's job
is to name the two most likely intents (they wanted something to read, or
they wanted the front page).

## 3. States

| State | Trigger | What renders |
|---|---|---|
| **The only state** | any unresolved path | sections 1–4, identically |
| **`/writing/` is empty** | zero published articles | link 3 still points there. The empty index explains itself and offers its own routes out (`writing-index.md` §4), so the chain terminates in content that exists rather than in another dead end |
| **Degraded** | API unreachable | nothing changes |
| **Degraded — no JS** | scripts blocked | nothing changes |

**HTTP status requirement:** the page must be served with a real **404**
status, not 200. A soft-404 (error content at an OK status) tells search
engines the page exists and poisons the index with as many phantom pages as
there are bad URLs. This is a Caddy configuration fact
(`architecture-decision.md` §4) recorded here because it is an IA property —
the route's meaning is its status code — and it is easy to get wrong when the
static bundle is served from disk.

**Trailing-slash mismatches are not a 404 case.** `sitemap.md` §1 requires one
canonical trailing-slash form, consistently enforced. The non-canonical
spelling of a real page must **redirect** to the canonical one, never render
this page. Three reasons: it is the most common source of false 404s on a
static site; two spellings of one page would produce two link targets in the
feed (`sitemap.md` §1), and while analytics counts are safe from this by
construction — `content-model.md` §2 keys every event by content `id` or an
assigned `page:` name, never by path — a redirect is still the correct
behaviour; and a visitor who typed a real address correctly-but-differently
has not made an error worth an error page. Recorded here because "what must
*not* reach the 404" is part of this route's specification.

## 4. Empty states

**None, and the reason is worth stating:** this page renders nothing derived
from content, so there is nothing that can be absent. It is the one route
whose composition is completely independent of how much the site contains —
which is precisely why it is a reliable recovery surface at launch, when most
other pages are at their thinnest.

## 5. The conflict this page sits on, resolved

`sitemap.md` §2 row 11: the 404 "points to `/writing/` and `/` and nothing
else."
`sitemap.md` §3, accepted cost 2: the Hebrew translations link is "persistent
in the footer on every page, in Hebrew script."

Every page includes this one. Read literally, one of the two statements must
give.

**Resolution (also recorded in `navigation-spec.md` §7.3): row 11 governs the
page's own recovery content; it does not govern site chrome.**

1. The alternative reading makes `/404` the only page with no header, no nav,
   and no footer — which strands the visitor further and contradicts row 11's
   own stated purpose, "recover the visitor."
2. Row 11's concern, read in context (it sits under a warning about winks and
   hints), is that the 404 must not accumulate pointers *of its own* — the
   classic failure of a 404 turning into a second sitemap or a joke page.
3. The Hebrew safeguard exists for visitors who have lost their way, which is
   exactly the population of this page. A Hebrew reader who mistypes a
   `/he/writing/` URL lands here — an English page — and the footer link is
   their one-click way back (`navigation-spec.md` invariant R-3).

Named and resolved rather than silently picked.

**The related rough edge — RESOLVED after this brief was drafted.** This
brief originally recorded "there is no Hebrew 404" as a bounded known cost,
correctly declining to invent a route the sitemap did not authorize. The
mission lead then took the call and **added `/he/404` to `sitemap.md`
§11b**, because checkpoint 1 decided the Hebrew subtree is its own front
door and an English error page breaks that at the worst moment. The footer's
Hebrew link makes the English 404 *recoverable*; it does not make it
*coherent*.

**`/he/404` therefore exists**, and this brief governs it: same minimal
composition, in Hebrew, `dir="rtl"`, pointing at `/he/writing/` and `/`.
Every exclusion in §6 binds identically — above all, no hint of a second
theme. Its serving mechanism (a Caddy `handle_errors` matcher on the `/he/*`
prefix) is an owed scaffold-time verification, and it puts one piece of page
routing in proxy config, which `sitemap.md` §11b records as a real seam
rather than a free addition.

## 6. Hard exclusions

| Cut | Reason |
|---|---|
| **Any hint of a second theme** | ADR 0002, `symbol-and-language-map.md` banned #7. The 404 is the single most likely place on any site for a "try typing something" nudge. There is none: no hint, no label, no nudge, no console message, no comment in the markup. `sitemap.md` §2 row 11 says this outright. |
| The portrait | ADR 0018: About + favicon only. A sad-cartoon 404 is the instinct; it is also a violation. |
| Jokes, ASCII art, animations | `motion-and-texture.md` §1's budget has no slot, and the visitor is mildly annoyed already. |
| A search box | No search exists (`sitemap.md` §4), and a box that finds nothing is worse than no box. |
| "Report this broken link" | An endpoint ADR 0020 does not authorize, for a report nobody would act on faster than the logs would. |
| A recent-articles list | Row 11's "nothing else". It would also make this page's composition depend on content, which §4 identifies as its main structural virtue. |
| Redirect-guessing ("did you mean…?") | Requires fuzzy matching at request time — server logic in a static core. |

## 7. Rejected alternatives

- ~~**A Hebrew-localized 404 at `/he/404`.**~~ **Accepted, not rejected** —
  see §5. It was correctly not invented at brief-writing time (the route
  inventory did not authorize it); the mission lead then added it to
  `sitemap.md` §11b. Recorded here as a superseded rejection rather than
  deleted, so the reasoning chain stays legible.
- **Redirecting unresolved paths to `/`.** Rejected: it destroys the
  information that something is broken (for the visitor and for the logs),
  and it returns a 200 for a URL that does not exist.
- **A 404 that lists every section** (a "site map" 404). Rejected by row 11,
  and rightly: the nav already does this, above the fold, on this very page.
