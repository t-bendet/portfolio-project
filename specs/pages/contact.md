# Page Brief — Contact (`/contact/`)

Mission 4 · 2026-07-21

| | |
|---|---|
| Route | `/contact/` — decided at checkpoint 1: stays a route (`sitemap.md` §2 row 10) |
| Archetype | **minimal** — a deliberate third, reduced composition: a short editorial column without the deep-dive sidebar |
| Collection | none — authored static page |
| `lang` / `dir` | `en` / `ltr` |
| Dynamic layer | **none** — no reads, no view event; no dynamic-layer script (the only client script on this route is the global theme script — ADR 0002, `tokens.md` §2) (`content-model.md` §6) |
| Chrome | per `navigation.md`; eyebrow `T://bendet · contact` |

Basis (law): `sitemap.md` §2 row 10 (including its honest note and retirement
condition) · `symbol-and-language-map.md` banned #6 ("let's connect" and its
cousins) · ADR 0020 (no endpoint authorized for a form) · `about-tal.md`
(primary goal: community standing).

---

## 1. Goal

Reachability, plus the one sentence that earns the route: what Tal is open to.
Availability for work is part of it, but the substantive part is openness to
translation requests and article suggestions from the Israeli dev community —
which needs a surface of its own when community standing is the primary goal.
The visitor it serves has already decided to make contact and needs the
fastest correct address, or has an idea for an article and needs permission to
send it. Neither needs persuading, so the page persuades nobody.

**This page is thin by nature: roughly fifty words and three links is its
honest maximum, not a strawman** (`sitemap.md` §2 row 10). Do not pad it.

## 2. Sections (ordered)

| # | Section | What it must do | Conditional? |
|---|---|---|---|
| 1 | Global header | eyebrow + nav | always |
| 2 | Page header | `h1` | always |
| 3 | **The openness statement** | one short paragraph: what Tal is open to — work; translation requests and article suggestions from the Israeli dev community. Plain, specific, no invitation-register | always |
| 4 | Three direct links | email (`mailto:`) · GitHub · LinkedIn. Each shown as what it is; no icon-only rows | always |
| 5 | Footer | per `navigation.md` §4 — which carries the same three links | always |

### 2.1 The budget, as a test

Sections 3 + 4 together: **~50 words and three links.** If the page exceeds
that, something has been padded, and the padding is the failure this route
was warned about at checkpoint 1. Review test: read the page aloud; if any
sentence exists to make the page look less empty, delete it. If deleting it
leaves the page too empty to justify, that is information — see §5.

### 2.2 Voice constraints (this is the page most likely to break them)

- **Banned: "let's connect", "let's chat", "reach out", "let's grab a
  coffee", "get in touch!"-register** — `symbol-and-language-map.md` banned
  #6, with a grep test. This page is where that phrase family lives on other
  sites, which is exactly why the ban is tested here first.
- **No response-time promise.** "I usually reply within a day" is a promise
  that decays and that nobody can hold a solo parent of twins to.
- **No availability status widget** ("open to work" badge). It is a status
  field, and status fields go stale silently (`content-model.md` §8 rejects
  the same class of thing elsewhere). If availability changes, the sentence
  changes.
- **No template phrasing**, no superlatives, nothing that reads as a funnel.

### 2.3 The email decision, with its cost

The address is a plain `mailto:` link. **Accepted cost: it will be scraped and
it will attract spam.**

Rejected: JavaScript obfuscation or a rendered-image address — both make the
site's most basic affordance depend on a script (R1/R4 posture, and
`navigation.md` N-12: chrome and content must work with JS disabled),
and neither meaningfully defeats modern harvesting. A contact form is not
available either: it would need a POST endpoint, spam handling, and mail
delivery, none of which ADR 0020 authorizes and all of which are real ongoing
cost (`sitemap.md` §2 row 10). Static links only.

### 2.4 No Hebrew paragraph on this page — considered and cut

The openness statement's most important audience reads Hebrew, so a Hebrew
sentence here was genuinely arguable. Rejected: a translated duplicate of one
English sentence is a mini-localization inside a page that has no Hebrew
counterpart, which is the pattern `sitemap.md` §3 rejected for `/about/` and
`/`; and it puts an RTL run inside an LTR page for one sentence, which is
bidi QA cost with no reader benefit.

**Where it goes instead:** the invitation to suggest articles lives natively
in Hebrew on `/he/writing/`'s standing description
(`translations-index.md` §2, section 3c), which is where that audience
already is. Both statements are written natively; neither is a translation of
the other. The overlap is recorded in `translations-index.md` §7.

## 3. States

| State | Trigger | What renders |
|---|---|---|
| **Populated** | the only state | sections 1–5 |
| **Degraded** | API unreachable | nothing changes — no dynamic surface exists here |
| **Degraded — no JS** | scripts blocked | nothing changes; every link is a plain anchor |

There are no other states. That is a property of the page, not an omission:
it holds no collection, no conditional content, and no external data.

## 4. Empty states

**None.** Every element on this page is authored and present at launch. If
the openness statement cannot be written without filler, that is not an empty
state — it is the signal described in §5.

## 5. The retirement condition (recorded so it stays a decision, not a drift)

`sitemap.md` §2 row 10 keeps this route on one substantive argument and one
explicit escape hatch: **if it ever reads as filler, its content folds into
`/about/` and the route retires.**

The two alternatives rejected at checkpoint 1, kept here because they are
what a retirement would choose between:

- *Fold into `/about/`* — the same words closing the bio page. Cost: the nav
  word "contact", which is the one term visitors actively scan for.
- *Footer only, no page* — the three links already appear in every footer, so
  the page would be redundant. Cost: it strands the openness sentence, which
  is the genuinely useful part and the only part the footer cannot carry.

If retirement ever happens, `/about/` §2 section 7's pointer becomes the
content, and the nav item is removed — which is the one sanctioned exception
to `navigation.md` INV-3 (chrome is content-independent), because
removing a route is a decision, not a content-volume fluctuation.

## 6. Rejected alternatives

- **A contact form.** No authorized endpoint (ADR 0020), plus spam handling
  and mail delivery as permanent cost. Also: a form asks the visitor to trust
  a black box, while `mailto:` hands them an address they can keep.
- **A calendar booking embed.** Third-party script, tracker-adjacent, and it
  frames the site as a service funnel — which the primary goal explicitly
  rejects.
- **A PGP key / security.txt block.** Nothing here warrants it; it would be
  costume.
- **Social links beyond the ones on file.** `about-tal.md` records exactly
  **two**: `github.com/t-bendet` and `linkedin.com/in/tal-bendet`. The email
  address is **not** in the research file — it must be confirmed by Tal
  before this page ships, and is flagged here rather than assumed. A wall of
  icons for accounts nobody posts to is worse than a short list of live
  links.
