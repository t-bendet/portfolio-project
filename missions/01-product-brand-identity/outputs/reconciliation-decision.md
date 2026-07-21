# Reconciliation Decision — Greek Mythology × the Existing Identity

**FINAL** · Mission 1, Stage B · Decided by Tal at checkpoint, 2026-07-21
Working draft: `reconciliation-proposal.md` (Stage A — retained as provenance,
no longer the operative document). Binding record: ADR 0014.

## The candidates considered (summarized from the working draft)

1. **Candidate A — Spine.** Mythology reorganizes the identity; duality
   reframed Apollonian/Dionysian; Marauder's Map superseded. Rejected: fails
   Tal's prominence steer ("between subtle and visible" — explicitly less
   than a spine), fails resonance-without-explanation, and deletes a lived
   personal reference in favor of a critic's frame built from figures Tal
   never chose.
2. **Candidate B — Subordinate layer ("epithet register").** Mythology as
   naming/epithets inside the protocol identity plus at most one
   inscription-lettering gesture. Recommended by the working draft: naming is
   the one slot the identity natively has for mythology, so the layer nests
   inside the spine instead of standing beside it.
3. **Candidate C — Rejected entirely.** Safest against theme soup, but
   over-correction: it ignores genuine resonance (Prometheus ↔ the
   translation work) and contradicts the steer, which was not zero.

## Tal's decision: Candidate B, further narrowed ("narrowed B")

### The checkpoint dialogue that produced the narrowing (2026-07-21)

- **Tal's policing question:** does B stay hard to police if reduced to
  "just typography/inscription-lapidary and naming in scripts or pipelines"?
- **Answer given:** yes, it becomes easy to police — that narrowing converts
  every rule of the register into a binary-checkable one (grep for figure
  names in content; count typographic gestures; names exist only on real
  artifacts).
- **Tal's lock-in:** he chose the narrowed form over full B.

### Exact terms of the locked decision

1. Mythology enters **only** as:
   (a) **naming of real infrastructure/repo artifacts** — scripts, pipelines,
   services — where a thing genuinely needs a name; and
   (b) **at most ONE inscription/lapidary typographic gesture**, licensed to
   Mission 2 to explore or decline.
2. **No mythological references in site copy, chrome, or content.**
   Binary test: grepping site content for figure names must find nothing.
3. The **figure-to-facet reservoir** (Prometheus ↔ translation work,
   Daedalus ↔ built infrastructure, Odysseus/*polytropos* ↔ versatility)
   survives **only as naming rationale** — it guides which names go where in
   the infrastructure (e.g., Prometheus naturally names something in the
   translation pipeline, discoverable in the open repo). It is never surfaced
   in content.
4. **ADR 0002 defended, remains active, untouched.** No Greek mapping onto
   the Jekyll/Hyde duality — Tal accepted the proposal's pushback on his
   "lean to yes".
5. Layer hierarchy: **protocol spine → one hidden HP feature → one bounded
   mythological naming register.** No layer explained.

## Consequence for ADR 0002 — defended, remains active

The Marauder's Map remains the sole expression of the Jekyll/Hyde duality.
The three reasons, from the working draft, accepted by Tal:

1. **One concept, one reference.** The duality already has a
   resonance-perfect expression — an incantation typed in the dark. Stacking
   a Greek reading on the same feature is theme soup at the exact point where
   the identity is most disciplined.
2. **The figures don't support the mapping.** Tal's chosen figures
   (Prometheus, Odysseus, Daedalus) are makers, carriers, wanderers — not
   duality poles. Apollo and Dionysus were never on his list; Hermes was
   offered and declined, showing offered-not-chosen is meaningful signal.
3. **The Map is personally true; the mapping is intellectually neat.** HP
   fandom is lived; Apollonian/Dionysian is a frame from criticism. The
   beloved element wins.

## Binding record

- **ADR 0014** — `docs/decisions/0014-mythology-subordinate-naming-register.md`
  (new, `active`): the narrowed register with its binary-testable bounds.
- ADR 0001 (protocol mark) and ADR 0002 (Marauder's Map) remain `active`,
  unmodified.
