# Symbol & Language Map — T://bendet

Mission 1, Stage B · 2026-07-21 · Binding basis: ADRs 0001, 0002, 0014;
`reconciliation-decision.md`; brand-voice invariants.

This is the complete symbolic vocabulary the site MAY use, and the list of
what it MAY NOT. If a symbol is not on the allowed list, it is not in the
identity. Every rule is written to be testable where possible.

## Allowed vocabulary

### 1. The T://bendet protocol idiom (spine — ADR 0001)

- The mark: `T://bendet` — `T` is the scheme, `bendet` the payload.
- Eyebrow labels: `T://bendet · section` on every page. These are identity,
  not decoration.
- Protocol/namespace phrasing in chrome is native to this layer (paths,
  schemes, addresses). This is the only layer allowed everywhere.
- Test: every page carries the eyebrow pattern; the mark appears nowhere in
  altered or themed form.

### 2. The Map incantation (HP layer — ADR 0002, one home only)

- `i solemnly swear that i am up to no good` → warm theme;
  `mischief managed` → revert. Console log on toggle. Nothing else.
- This is the sole expression of the Jekyll/Hyde duality and the sole HP
  surface. Unlabeled, unhinted, unexplained — anywhere, ever.
- Test: no UI element, copy, tooltip, or doc page references the switch, the
  phrases, or the existence of a second theme.

### 3. The mythological naming register (narrowed — ADR 0014)

- Scope (a): **names on real infrastructure/repo artifacts only** — scripts,
  pipelines, services — and only where a thing genuinely needs a name.
  Discoverable in the open repo by the attentive; never pointed at.
- Scope (b): **at most ONE inscription/lapidary typographic gesture**,
  licensed to Mission 2 to explore or decline. Zero is a valid outcome.
- Tests:
  - Every mythological name maps to an artifact that exists and would need a
    name regardless (no artifact invented to carry a name).
  - Count of inscription/lapidary gestures in the shipped design system ≤ 1.
  - Grep site content for figure names → zero matches (see banned list).

### 4. The figure-to-facet reservoir — NAMING RATIONALE ONLY

| Figure | Facet it guides | Example habitat |
|---|---|---|
| Prometheus | The translation/writing work | Something in the translation pipeline |
| Daedalus | The built infrastructure | Build/deploy machinery, the constructed system |
| Odysseus / *polytropos* | Full-stack versatility | Cross-cutting tooling, if anything |

- This table decides **which name goes where in the infra**. It is never
  surfaced in content, never explained in the repo, never used as copy,
  taxonomy, section names, or imagery.
- Test: the words in this table appear in the project only as (a) artifact
  names in infra/repo, (b) workshop decision documents like this one. Never
  in site content.

## Banned (anti-theme-soup) — each with its test

1. **Mythology in site copy, chrome, the mark, imagery, or the Map's
   territory.** Test: `grep -ri` site content/templates for figure names
   (prometheus, daedalus, odysseus, polytropos, apollo, dionysus, hermes,
   icarus, and any figure later added to the reservoir) → zero matches.
2. **Explained references.** Any reference (HP, LOTR, mythology, anything)
   accompanied by a label, hint, tooltip, or explanation. Test: if removing
   the surrounding explanation changes nothing, the reference passes; if the
   reference needs the explanation, it is banned.
3. **Greek geometry/ornament:** meander/key patterns, amphora motifs,
   columns, laurel, decorative borders. Offered to Tal and not chosen; also
   barred by restraint-over-decoration. Test: no ornamental motif of Greek
   origin anywhere in the design system.
4. **A second typographic gesture.** Test: inscription/lapidary gestures ≤ 1,
   site-wide, forever under this ADR.
5. **Apollo/Dionysus framing of the duality** (or any Greek mapping onto
   Jekyll/Hyde). The duality's only expression is the Map (ADR 0002). Test:
   no artifact, name, or design rationale ties Greek figures to the
   dark/warm themes.
6. **"Let's connect" and its cousins** ("let's chat", "reach out",
   "let's grab a coffee", "get in touch!"-register). Test: grep site copy for
   the phrase family → zero matches.
7. **Labeled easter eggs.** Any hidden thing with a signpost. Test: nothing
   in UI or copy acknowledges that hidden things exist.
8. **Template phrasing** ("passionate about", "crafting delightful
   experiences", buzzword filler, promotional framing of any technology).
   Test: honest-tradeoff register survives a read-aloud; no marketing
   superlatives in copy.

## Precedence

Where lists appear to conflict, the banned list wins. Where a new symbol is
proposed, it is out of vocabulary until an ADR admits it — silence is a no.
