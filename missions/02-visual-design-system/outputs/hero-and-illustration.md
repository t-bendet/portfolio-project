# Hero & Illustration — Resolution Proposal (ADRs 0007, 0008)

Mission 2 · 2026-07-21
**Status: checkpoint material — NOT hardened.** This is the second of M2's
two mandated checkpoints. ADRs 0007 and 0008 flip only after Tal reacts;
until then this file is a recommendation with alternatives, all pre-checked
against the now-locked system (palette-spec v2, typography-spec,
motion-and-texture).

## Context that changed under ADR 0007 since it was written

The locked system is **still and chromeless**: the prototypes contain no
window chrome, no shadows, no keyframe animation anywhere
(motion-and-texture §0), and elevation is flat color steps. ADR 0007's hero
— a macOS-style terminal *window* with typing animation and a completion
glow — predates all of that. Its three possible fates, analyzed against the
locked system:

### A. Keep verbatim (terminal window + typing + glow)

The typing sequence still fits identity perfectly. The **window chrome**
does not: it would be the only chrome object in a chromeless system, a
decorated frame in a system whose law is restraint over decoration, and
traffic-light terminal windows are a portfolio-template staple (fails the
M1 anti-test on the frame, not the idea).

### B. Evolve — bare protocol resolution (RECOMMENDED)

Keep the enactment, drop the frame. The hero is display-scale type, no
container: the mark resolves itself once — `T` → `T:` → `T:/` → `T://` →
`T://bendet` — set in `--font-mono` (the mark's protocol register,
per-theme family), cursor visible during resolution, gone at completion;
tagline and page content are revealed in the same single completion step.
Runs once per page load, never loops (0007's own rule, kept).

Why this survives every locked rule:
- **Motion budget:** motion-and-texture §1 quarantined exactly one
  once-only hero exception; this spends it on six type states and one
  reveal — no transforms, no loops.
- **Reduced motion:** renders the final frame immediately (mark complete,
  content visible). Nothing is information-bearing in the animation.
- **RTL (ADR 0011):** the mark is an LTR run inside whatever `dir` the page
  has; the hero block's alignment binds to logical start. Identical
  experience, verified by construction.
- **Register purity (M1 brief):** one register — protocol/mono. No
  inscription blending. The lapidary license (declined for the base system,
  typography-spec §8) stays unspent unless Tal chooses direction D below.
- **Both temperatures:** same sequence; warm renders it in IBM Plex Mono
  with warm inks. The hero is structure; only temperature changes.

**The glow sub-question** (was: glow on `://` at completion). Two clean
options, both AA-irrelevant (decoration on completion, not text):
- **B1 — dark-only completion glow:** derived from `--accent-2`
  (`color-mix(in srgb, var(--accent-2) 35%, transparent)`), appears once at
  completion and then holds static (no pulse); absent in the warm theme (a
  glow is a dark-room phenomenon). This spends the palette's reserved
  single-glow license (palette-spec §7.4) at the exact spot ADR 0004
  originally put it.
- **B2 — no glow:** completion is marked by the cursor's disappearance
  alone. Maximal stillness.
Recommendation: **B1** — it is the one theatrical mark the system owns, it
has ancestry (0004/0007), and it gives the dark/warm pair one more quiet
temperature difference for attentive visitors.

### C. Supersede with a static mark

Fully still hero: the completed `T://bendet` as display type, no animation
at all. Cleanest reading of the prototypes' stillness — but it deletes the
only moment where the identity *performs* ("protocol resolution" was the
identity thesis's verb), and the motion budget already carved a licensed
slot for it. Valid, joyless, honest to list.

### D. Spend the lapidary license here (inscription hero)

The one licensed gesture (ADR 0014 / M1 brief) could replace the terminal
register entirely: the mark as engraved capitals, no animation. Recorded
because the brief explicitly names the hero as the only surface where this
could live, and it must be *instead of*, never *blended with*, the protocol
register. Not recommended — the mark is a protocol, and the eyebrow pattern
(`T://bendet · section`) keeps the protocol register on every other page;
an inscribed hero would make the hero speak a register the rest of the site
never uses. But it is Tal's license to spend.

## ADR 0008 — the hand-drawn portrait

Proposal: **confirm 0008's original placement, tighten the treatment
rules.**

1. **Placement:** About page, beside the bio — and the favicon (tight crop,
   verified legible at 32px before shipping). **Not on the home/hero**: the
   hero is the mark's register; the M1 brief's accumulation rule keeps the
   person-surface (About) and the protocol-surface (hero) separate.
2. **Treatment:** the drawing ships as itself — original linework,
   unframed, no border, no background plate, no filter. Explicitly banned
   by the brief and restated as spec: no laurels, no Greek framing, no
   inscription treatment on or near it. It is the one element on the site
   that is allowed to be entirely un-systematized — that is its function
   (the person visibly living in the workshop).
3. **Temperature behavior:** same asset in both themes. If the source is
   monochrome line art, the ink may bind to `--text-strong` (SVG
   `currentColor`) so it sits on both backgrounds; if binding it visibly
   sterilizes the drawing's hand quality, ship it as-is on both and accept
   the imperfection — authenticity outranks system-matching here. (Taste
   call flagged below; needs the actual asset in hand.)
4. **Favicon:** from the same crop, dark-theme-background version (favicons
   don't theme-switch; the default theme is the public face, and the hidden
   theme must not leak through browser chrome — ADR 0002 discipline).

## Checkpoint questions for Tal

1. **Hero fate:** A (keep window) / **B (bare protocol resolution —
   recommended)** / C (static) / D (spend the lapidary license).
2. **If B: glow at completion?** **B1 dark-only (recommended)** / B2 none.
3. **Portrait:** confirm About+favicon placement and the
   treatment rules above? And when the asset is digitized: bind linework to
   `--text-strong` or ship untouched?
4. Anything here you want rendered in Claude Design before deciding? The
   trimmed hero-only exploration package
   (`exploration/04-hero-exploration-brief.md`) renders A/B/C/D in both
   temperatures against the locked tokens.

## What happens after the checkpoint

Superseding/confirming ADRs for 0007 and 0008 are written to match the
choice (with the rejected directions recorded from this file), the
review-verdict loop runs, and M2 closes.
