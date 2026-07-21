# Reconciliation Proposal — Greek Mythology × the Existing Identity

**DRAFT — FOR TAL'S REACTION.** No ADR is written or flipped by this document.
Mission 1, Stage A · 2026-07-21

The brand-voice skill requires one of three resolutions: mythology as
**spine**, as a **subordinate layer**, or **rejected**. "All three layers
coexisting equally" is not an option. This proposal tests the candidates
against the brand invariants and Tal's Checkpoint-0 steer, recommends one, and
states the consequence for ADR 0002 explicitly.

---

## (a) Candidate resolutions

### Candidate A — Spine: mythology reorganizes the identity

The duality is reframed as Apollonian/Dionysian; the site's sections, mark
treatment, and hidden switch adopt a Greek vocabulary; the Marauder's Map is
superseded by a Greek-flavored equivalent; T://bendet is recontextualized
under the mythology.

**For it, honestly:** this is the only option that yields a single coherent
symbolic system with no layering discipline required. It would hand Mission 2
a rich, deep vocabulary (epithets, invocations, lapidary form) with total
freedom.

**Against it:**
- **Fails the prominence steer directly.** Tal, verbatim: "somewhere between
  subtle and visible" — explicitly *less than an organizing spine*.
- **Fails resonance-without-explanation.** The natural duality mapping is
  Apollo/Dionysus — two figures Tal never chose. His chosen figures
  (Prometheus, Odysseus, Daedalus) are makers, carriers, and wanderers, not
  duality poles. An Apollonian/Dionysian frame is a critic's reading, not
  Tal's lived reference; for most visitors it needs a footnote, and a
  reference that needs explaining fails.
- **Deletes the most personal thing on the site.** The Map incantation is
  lived fandom, already decided (ADR 0002, active), and already passes the
  resonance bar perfectly. Superseding it on the strength of an unconfirmed
  instinct ("lean to yes, but not 100%") is trading a real attachment for a
  hypothesis.
- ADR 0001 states the mark must survive Mission 1; a mythology spine puts
  constant pressure on that.

### Candidate B — Subordinate layer: the epithet register

Mythology enters in exactly the textures Tal chose — **naming/epithets** and
(optionally, Mission 2's call) **one inscription-lettering gesture** — and
nowhere else. The key structural insight: **the T://bendet protocol identity
is already a naming system.** Naming infrastructure after Greek figures is
native developer culture (Apollo, Kubernetes, Oracle — Tal's own examples).
Mythology-as-naming does not sit *beside* the protocol spine as a third
theme; it slots *inside* it. That is why this is not soup.

Bounds of the register:

1. **Names, where a developer would naturally name a thing.** The
   infrastructure this site must genuinely showcase (ADR 0012) — the
   from-scratch CI/CD pipeline, deployment machinery, services — is the
   natural habitat. A pipeline with a Daedalus-flavored name, discoverable in
   the open repo, is a woven reference: unlabeled, functional, findable by
   the attentive. (Specific names are chosen when the things exist; this ADR
   round licenses the register, not a name list.)
2. **A figure-to-facet reservoir, drawn from sparingly.** Prometheus ↔ the
   translation/writing work (carrying fire to a community is what the
   translations literally do); Daedalus ↔ the built infrastructure (the
   craftsman whose constructions are the exhibit); Odysseus/*polytropos* ↔
   the full-stack versatility. This is a reservoir, not a program — using all
   three visibly would itself be soup. One surfaced reference at a time.
3. **Optionally, one typographic gesture** in the inscription/lapidary
   direction — licensed to Mission 2 to explore or decline. Not two gestures.
   Not geometry, meander, columns, or ornament (offered to Tal and not
   chosen; also barred by restraint-over-decoration).
4. **Never:** mythology in site chrome, in the mark, in the Map's territory,
   as imagery, or explained. No labeled "mythology" anything.

**Against it, honestly:** this is the hardest option to police. Subordinate
layers drift — one name becomes five, a gesture becomes a motif. The bounds
above must be written into the eventual ADR as testable rules, and Mission 2's
red-team review must check drift. It also gives mythology less presence than
Tal's "lean to yes" on the duality mapping might have wanted — see (c).

### Candidate C — Rejected: no mythology

The identity already carries two layers (protocol + HP). Community standing
is earned by craft and writing, not additional symbolism; discipline itself
is the brand.

**For it, honestly:** it is the safest option against theme soup, and nothing
in the site's goals *requires* mythology.

**Against it:** it ignores genuine, tested resonance. Prometheus-as-carrier
is the single strongest external symbol for what this site is actually for —
the translation work — stronger than anything HP offers on that axis. It also
contradicts the steer: "between subtle and visible" is not zero. And the
mythology Tal is drawn to is not decoration (which restraint would bar); it
is naming, which the protocol identity natively accommodates. Rejection here
would be over-correction — restraint misapplied to substance.

---

## (b) Recommendation — ONE

**Candidate B: mythology as a subordinate layer, bounded to the epithet
register (naming/epithets in the infrastructure and writing, a sparing
figure-to-facet reservoir, at most one Mission-2-licensed inscription
gesture). The T://bendet protocol remains the spine; the Map remains the
duality's only expression.**

Reasoning in brief: it is the only candidate consistent with all three
constraint sets at once — Tal's chosen textures (naming, lettering, ideas;
not geometry), his prominence steer (between subtle and visible), and the
brand invariants (restraint, unlabeled references, protocol namespace
intact). It adds mythology where the identity already has a slot for it —
naming — instead of building it a stage. The resulting hierarchy is clean and
enforceable: **protocol spine → one hidden HP feature → one mythological
naming register.** Each layer has exactly one home; no layer is explained.

## (c) Consequence for ADR 0002 — defended, remains active

**ADR 0002 is defended as-is.** No reopening, no supersession. The Marauder's
Map remains the sole expression of the Jekyll/Hyde duality, and mythology
does **not** map onto that duality.

This is a deliberate, tested **no** to Tal's "I lean to yes, but not 100%
sure" — surfaced plainly rather than blended away, which is what this DRAFT
is for. The reasons:

1. **One concept, one reference.** The duality already has a
   resonance-perfect expression: an incantation typed in the dark. Layering a
   Greek reading (Apollonian/Dionysian) onto the same feature stacks two
   mythologies on one concept — theme soup at the exact point where the
   identity is currently most disciplined.
2. **The figures don't support the mapping.** Tal's own chosen figures are
   Prometheus, Odysseus, Daedalus — none are duality figures. Apollo and
   Dionysus were never on his list; Hermes was offered and declined, which
   shows offered-not-chosen is meaningful signal in this record. The mapping
   would be built from figures that don't pull him.
3. **The Map is personally true; the mapping is intellectually neat.** HP
   fandom is lived. Apollonian/Dionysian is a frame from criticism. When a
   beloved element conflicts with a clever recontextualization, the beloved
   element wins unless Tal himself says otherwise.

**If Tal reacts by confirming his lean-yes** — i.e., he *wants* mythology to
reframe the duality — that is Candidate A territory and requires formally
reopening ADR 0002 (and likely pressure on 0001). This proposal recommends
against it, but the door is his to open; per CLAUDE.md, resolving the
identity reconciliation is escalated to Tal either way.

## (d) Flags for reopened ADRs 0007 / 0008 (flag only — not resolved here)

- **ADR 0007 (terminal hero).** No concept-level conflict: the terminal is
  protocol-native and untouched by a subordinate naming layer. One tension to
  flag: if Mission 2 explores the licensed inscription-lettering gesture, the
  hero space cannot host both the terminal idiom and a lapidary idiom for the
  mark — M2 must choose one register for the mark's presentation, not blend.
- **ADR 0008 (personal illustration).** No conflict: the caricature is the
  human-warmth layer, orthogonal to mythology. One caution to flag: the About
  page is where illustration (totaltypescript pattern), personal bio, and any
  surfaced mythological naming could accumulate. M2 should keep the portrait
  strictly personal — no mythologizing the illustration (no laurels, no
  Greek framing devices around it).

---

*Next step after Tal's reaction: Stage B writes the ADRs — a new active ADR
for the reconciliation outcome (including the testable bounds of the epithet
register), with ADR 0002's defense recorded there. No ADR text exists yet.*
