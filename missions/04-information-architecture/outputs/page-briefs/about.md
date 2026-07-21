# Page Brief — About (`/about/`)

Mission 4 · 2026-07-21

| | |
|---|---|
| Route | `/about/` |
| Archetype | deep-dive editorial (`sitemap.md` §2 row 8) |
| Collection | none — authored static page (`content-model.md` §1) |
| `lang` / `dir` | `en` / `ltr` |
| Dynamic layer | **none** — no reads, no view event; no dynamic-layer script (the only client script on this route is the global theme script — ADR 0002, `tokens-reference.md` §2) (`content-model.md` §6) |
| Binding obligation | reserves the bio-beside-portrait slot; **no other route carries the portrait** (ADR 0018, `hero-and-illustration.md` §3) |
| Chrome | per `navigation-spec.md`; eyebrow `T://bendet · about` |

Basis (law): `sitemap.md` §2 row 8, §4 (`/now`, `/uses`, `/resume` rejected) ·
ADR 0018 · `hero-and-illustration.md` §2 · `design-brief-for-m2.md` (the
accumulation rule) · `identity-thesis.md` · `about-tal.md`.

---

## 1. Goal

This is the human surface — the page someone opens after reading something
good, to find out who wrote it. It serves curiosity, not conversion: a
visitor should leave with a clear picture of a person (four years of
platform-scale design-system work, a translator, a father of twins, someone
who builds his own infrastructure) and no sense that they have been pitched.
It is also the only page carrying the portrait, which makes it the one
surface where illustration, biography, and quiet personal detail meet — and
the M1 brief's accumulation rule applies exactly here: **reference density
stays at zero. The person carries this page, not the symbols.**

## 2. Sections (ordered)

| # | Section | What it must do | Conditional? |
|---|---|---|---|
| 1 | Global header | eyebrow + nav | always |
| 2 | Page header | `h1`; a one-line lede in the person's own register | always |
| 3 | **Bio beside portrait** | the binding slot (ADR 0018). Prose: who Tal is and what he has actually done — the Amdocs design-system years, the translation work, the current availability. Portrait sits beside it, unframed | always (bio); portrait conditional on the asset existing — §3 |
| 4 | The current section | what `/now` would have carried, without the currency promise (`sitemap.md` §4). Must be written so it stays true without maintenance | always |
| 5 | Background | education, the bootcamp, the internship, the stack — structured, scannable, in the reference register Tal's prototypes already use | always |
| 6 | CV link | the PDF, disclosed as a file (format, and the fact that it downloads) | only when the file is published |
| 7 | Pointer to `/contact/` | one line. Not a call to action; not "let's connect" or any cousin | always |
| 8 | Footer | per `navigation-spec.md` §4 | always |

### 2.1 The portrait slot — treatment rules (binding, ADR 0018)

- **Original linework, unframed.** No border, no background plate, no filter,
  no drop shadow (`motion-and-texture.md` T2 bans shadow system-wide anyway).
- **Never mythologized:** no laurels, no Greek framing, no inscription
  treatment on or near it (ADR 0014, `design-brief-for-m2.md`).
- **Not a systematized element.** It is deliberately the one un-systematized
  thing on the site; framing it to match the token system turns the person
  into decoration.
- Ink behavior across themes (bind to `currentColor`/`--text-strong` vs. ship
  untouched) is **deferred by decision** to digitization (ADR 0018) — a Phase
  2 asset call inside these rules, not an open IA question.
- The 32px favicon crop comes from the same asset and is prepared against the
  dark background; favicons do not theme-switch (ADR 0018 — and a warm-theme
  favicon would leak the hidden theme through browser chrome).

### 2.2 The "reserve the slot" / "reserve no space" distinction

`hero-and-illustration.md` §3 obliges M4 to **reserve the bio-beside-portrait
slot**. The site's other governing rule says no layout may reserve space that
only something external can fill. These look like a conflict and are not:

- "Reserve the slot" means **the composition allocates a place for the
  portrait** — the About layout is designed around a two-element
  bio-and-drawing relationship, not retrofitted with an image later.
- It does **not** mean holding an empty box open in the render when the asset
  is absent. If the drawing is not yet digitized at launch, the bio occupies
  the full column and no placeholder, silhouette, or grey rectangle appears.

Named explicitly because the two readings produce opposite pages. (The
no-reserved-space rule is stated in `content-model.md` §6 about the API;
applying it to a static asset is an M4 extension by analogy, marked as such.)

### 2.3 Voice constraints on this page (sharper here than anywhere)

- **Zero reference density** — no mythology (ADR 0014's grep test), no HP, no
  protocol wordplay beyond the eyebrow chrome. The nearest thing to a symbol
  on this page is the mark in the header, and it stays there.
- **No template phrasing.** "Passionate about", "crafting delightful
  experiences", "results-driven" — `symbol-and-language-map.md` banned #8.
- **No "let's connect" or its register**, including in section 7's pointer.
- **Nothing that decays silently.** No "currently", no "recently", no ages
  computed from a fixed year, no "X years of experience" that must be edited
  annually. This is what `sitemap.md` §4 bought by absorbing `/now` here
  instead of shipping it: the same content with no currency promise. If a
  sentence would be wrong in eighteen months without anyone touching it, it
  is written wrong.

## 3. States

| State | Trigger | What renders |
|---|---|---|
| **Populated** | the normal case | all eight sections |
| **No portrait asset** | drawing not yet digitized | the bio runs the full column. No placeholder, no reserved box, no stock silhouette (§2.2) |
| **No CV published** | the PDF is not in the build | section 6 is omitted entirely — not "CV available on request", which is a sentence that exists to fill a hole |
| **Degraded** | API unreachable | nothing changes — this page never touches the API |
| **Degraded — no JS** | scripts blocked | nothing changes; this page has no dynamic-layer script. (The global theme script is also inert without JS — the default temperature simply renders, which is ADR 0002's normal case) |

## 4. Empty states

**This page has no empty state, and that is a hard statement rather than an
omission: if About cannot be written at launch, the site cannot launch.**
Everything else on the site can be honestly empty on day one — there may be
no articles, no translations, no case studies — but a personal site whose
About page is a placeholder has failed at the one thing it exists to do
(`identity-thesis.md`: "a person lives here").

The two absences that *are* possible (portrait, CV) are handled in §3 by
removal, never by placeholder.

## 5. What this page absorbs, and what it refuses

**Absorbed** (from `sitemap.md` §4's rejections):

- **`/now`** — its honest content (what Tal is doing, what he is available
  for) lives in section 4 without the staleness contract. The `/now` idiom's
  entire value is being current, which is also its entire failure mode.
- **`/resume` / `/cv` as a route** — the PDF is linked from section 6. A
  route for a PDF is a redirect with extra steps, and a full HTML resume page
  would compete with this page while making the site read as a job-board
  asset, which the stated primary goal explicitly is not.

**Refused:**

| Cut | Reason |
|---|---|
| A `/uses` block (editor, terminal, keyboard) | `sitemap.md` §4: the same page on hundreds of sites; binary anti-test failure; silent maintenance contract. |
| Skills bars / percentage proficiency | Unfalsifiable numbers about oneself. |
| Company logos | Borrowed authority; also a wall of third-party marks in a system that has no logo treatment. |
| Testimonials | None exist (`sitemap.md` §4). |
| A timeline widget | The background section is a list; a timeline is that list with more furniture. |
| Photos of the workspace | The one image on this site is the drawing. |
| Any hint of the second theme | ADR 0002 — and About is a page where a "fun facts" instinct might reach for it. It must not. |

## 6. Rejected alternatives

- **Portrait on the home page as well.** Rejected by ADR 0018 explicitly:
  person-surface and protocol-surface stay separate, and the hero belongs to
  the mark.
- **Splitting About into `/about/` + `/now/`.** Rejected at `sitemap.md` §4;
  restated because the split is the more "correct-looking" IA and is worse
  here — it doubles the surfaces and puts the decaying content on a page
  whose whole premise is currency.
- **Making About the site's home page** (a common personal-site shape).
  Rejected: it inverts the identity thesis, which puts the writing at the
  center and the person beside it, and it would put the portrait on the
  most-linked route in violation of ADR 0018.
