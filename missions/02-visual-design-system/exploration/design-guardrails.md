# Design Guardrails — invariants Claude Design must carry

These come from the workshop's active ADRs and Mission 1's closed identity
work. Claude Design cannot see the repo; this file is the bridge. Every rule
here is binding on every rendered candidate, in every direction.

## The one-line identity

**A precise craftsman's workshop with a person visibly living in it.**
Anti-test: if a pattern could ship on any competent developer's portfolio
unchanged, it fails.

## The mark and eyebrow (ADR 0001 — identity, not decoration)

- The mark is `T://bendet` — `T` is the scheme, `bendet` the payload.
- Every page carries the eyebrow pattern `T://bendet · section`
  (small, uppercase, letterspaced).
- The mark never appears altered or themed. How far a hero treatment
  (glow, animation, lapidary setting) can go before it counts as "altering
  the mark" is one of the live taste questions — render candidates, let Tal
  call it.

## Two temperatures, one system (ADR 0002)

- Dark is the default; warm editorial is a second full theme.
- Identical grid, spacing, radius, and interaction patterns across both.
  Only temperature (color, type voice) changes.
- **In the shipped site the second theme is a hidden easter egg.** No
  rendered candidate may include a theme toggle, a hint, a label, or any
  acknowledgment that a second theme exists. (Rendering both temperatures
  side-by-side in Design exploration is fine — that's workshop material.)

## Restraint (binding through-line)

- Accent colors on badges, labels, and at most ONE glow element.
  **Accents are never backgrounds** — no accent-filled buttons, sections,
  or heroes.
- No `--link`-colored links; links are text-colored with an underline
  treatment.
- Muted text is the floor — no fainter third tier of text.

## RTL / Hebrew (ADR 0011 — hard constraint)

- Translated Hebrew articles are core content, not an edge case. Render the
  article layout in `dir="rtl"` for every direction.
- Directional accents (e.g. a callout's accent edge) must sit on the
  reading-start side in both directions (logical properties).
- Any pattern that degrades in RTL is rejected at the pattern level.

## Mythology bounds (ADR 0014 — strict)

- At most ONE inscription/lapidary typographic gesture site-wide; zero is
  valid. Only Direction 02 explores it.
- If the lapidary gesture is used, the hero cannot blend terminal and
  lapidary registers — one register, never a hybrid.
- NO mythological references in copy, imagery, or chrome. No Greek ornament:
  no meander, columns, laurel, amphora, no "Greek" color stories.
- Never mythologize the personal portrait: no laurels, no inscription
  treatment on or around it.

## The portrait (ADR 0008, reopened — treatment is being explored)

- Tal's hand-drawn caricature (by his wife) is the human-warmth layer.
  Strictly personal treatment. Where it appears, keep symbol density near
  zero — the person carries that surface.

## Copy in specimens

- Real-content register, never lorem. Honest technical voice; no
  "passionate about", no "let's connect" or its cousins, no marketing
  superlatives, no emoji decoration.
- Nothing labels or hints at hidden things.
