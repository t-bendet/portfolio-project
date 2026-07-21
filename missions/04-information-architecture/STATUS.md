---
mission: m4
status: in-progress
depends-on: m3
opened: 2026-07-21
closed: null
revision-cycles: 0
---

# Status — Information Architecture

## Handoff notes

(filled at closure: what was decided, which ADRs were written/flipped,
what the next mission must know)

## ADR statuses observed at mission start (2026-07-21)

active: 0001, 0002, 0011, 0012, 0013, 0014, 0015, 0016, 0017, 0018, 0019,
0020, 0021 · reopened: 0009 (by mission-4), 0010 (by mission-4) ·
superseded: 0003, 0004, 0005, 0006, 0007, 0008.

Gate check run before any work: M2 `closed` + `verdict: APPROVED`, M3
`closed` + `verdict: APPROVED` (M4 `depends-on: m3`). Both verified by
reading STATUS.md frontmatter and outputs/review-verdict.md frontmatter.

## Inputs actually read

(recorded at closure: exact paths + ADR ids/statuses as of mission start)

## Checkpoint log

- **CHECKPOINT 1 RESOLVED (2026-07-21, Tal, in-session)** — route set.
  `sitemap.md` v1 was written as a recommendation with three calls flagged
  OPEN, then hardened on Tal's answers. Tal asked for the route structure
  to be re-explained with concrete example URLs before answering, and for
  the colophon/contact tradeoffs to be unpacked with real page content;
  both were done and the questions re-put.
  1. **Translated articles: candidate C — locale subtree `/he/writing/`.**
     Decided against tabs (ADR 0010 as written), path subsection
     `/writing/translations/`, and one merged list. Framing question
     answered: the Hebrew work is its own front door, not a section inside
     the English site. Accepted cost: the `he` locale is a partial
     localization covering the writing section only; the seam is shown, not
     hidden. Surfaced and settled in passing: Hebrew-subtree slugs are
     Latin (derived from the original English article), titles are Hebrew.
  2. **`/colophon/` ships** as a living page, footer-linked. Decided
     against a fourth option surfaced mid-checkpoint (ship as a dated
     article at `/writing/how-this-site-is-built/`), against folding into
     `/about/`, and against no page. Accepted cost: a maintenance contract
     — a stale colophon actively misinforms, so keeping it current is an
     M5 workflow obligation.
  3. **`/contact/` stays a route.** Decided against folding into `/about/`
     and against footer-only. Accepted cost: a thin page (~50 words + three
     links), kept because "open to translation requests and article
     suggestions from the Israeli dev community" needs a surface the footer
     cannot carry.
  - **Not a checkpoint question — resolved as forced:** ADR 0009's
    per-route theme assignment is deleted, because it contradicts `active`
    ADR 0002 (it would show every visitor the hidden theme on first click,
    and needs a second competing source of truth for `data-theme`). Put to
    Tal as forced-not-preferred, with the note that overriding it means
    reopening 0002 and escalating. He did not object. What 0009 was
    reaching for survives on the archetype axis (M2 §1).
