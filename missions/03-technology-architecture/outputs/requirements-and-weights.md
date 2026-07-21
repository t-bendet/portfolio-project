# Requirements & Weights — Mission 3, Stage 1 (tech-eval §1)

Date: 2026-07-21
Status: yardstick only. This document names and weights requirements BEFORE any
candidate technology is named. It deliberately names no framework, host,
database product, or CI vendor. One acknowledgment is permitted: a
"keep the current choice" candidate exists (the reopened pre-workshop decision)
and will be evaluated in Stage 2 by exactly this yardstick, with no incumbent
privilege.

Grounding: ADR 0012 (showcase constraints, active), ADR 0011 (RTL, active),
ADR 0003 (reopened — prior conclusion is input, not law), ADR 0013 (repo
topology, proposed — this mission decides it), ADR 0014 (naming register,
active, mild relevance), docs/research/about-tal.md, Mission 1 identity thesis.

---

## 1. Hard gates (pass/fail, unweighted)

A candidate architecture failing ANY gate is eliminated regardless of its
weighted score. Gates are binary; each has an explicit test.

### G1 — RTL/Hebrew is first-class (ADR 0011)
The candidate must render Hebrew translated articles with `dir="rtl"` at the
document/page level, support per-route language and direction metadata, and
allow original-author credit in the content model. Test: can a translated post
page be produced whose entire reading surface is RTL, whose `<html lang dir>`
is correct, and whose layout does not depend on LTR assumptions? Partial
support via hacks (element-level dir sprinkled over an LTR-assuming layout
system) fails.

### G2 — The four showcase constraints are genuinely satisfiable (ADR 0012)
Within the candidate architecture there must exist an honest design in which:
(a) a SQL database exists with a real reason, (b) Docker is used for dev
and/or deploy of something real, (c) the CI/CD pipeline is built from scratch
— not activated from a host's built-in magic pipeline that leaves nothing to
build, (d) deployment lands on AWS or an equivalent cloud provider under
Tal's control. Test: for each of (a)–(d), write one sentence describing what
Tal built and why it exists; if any sentence is false, circular ("the database
exists to satisfy the requirement"), or describes vendor magic rather than
Tal's work, the gate fails. Note the sharp edge: a fully-managed
push-to-deploy host can fail (c) and (d) by leaving no pipeline to build —
"the platform does it" is a gate failure, not a convenience.

### G3 — No faked dynamism
The dynamic boundary must be honest. Test: delete the database and its
dynamic layer from the design; if nothing a visitor or Tal-as-operator can
observe changes, the dynamism was fake and the design fails. The SQL store
must serve at least one capability that genuinely wants persistence and
cannot be a build-time file without loss (candidates in Stage 2 must name
theirs concretely). This gate exists to block checkbox-satisfying
architectures that would also poison G2's "genuinely."

### G4 — Content is portable plain text in the repo
Articles and translations are authored as MDX/Markdown files under version
control, buildable without a proprietary authoring service. Test: `git clone`
plus the documented toolchain reproduces all written content; no content is
held hostage by a third-party CMS. (This does not forbid a database — it
forbids the *writing* living only inside one. Where the DB/content boundary
sits is exactly the Stage 2 design question.)

### G5 — Production-stable, maintained core
Every load-bearing piece (framework, runtime, database engine, deploy target)
must be a stable, currently maintained release — no RC/beta/experimental core
dependencies, no technologies in maintenance-only sunset. Test: verified by
web search at evaluation time (never memory), per the tech-eval hard rule.

### G6 — Cost ceiling
Steady-state running cost must not exceed **$15/month** excluding domain
registration, at realistic personal-site traffic. Test: sum the candidate's
minimum honest monthly bill (compute + database + bandwidth + registry/CI
minutes beyond free tiers). Exceeding the ceiling fails; staying well under it
is rewarded by R6.
*(Checkpoint revision, 2026-07-21: drafted at $30; Tal tightened to $15 at the
Stage 1 checkpoint — a personal site should justify every dollar.)*

---

## 2. Weighted criteria (sum = 100)

Scoring precision rule: each criterion's definition includes anchors so two
independent evaluators would land on the same score.

### R1 — SEO and performance for a content-first site — weight 16
The site's primary goal is community standing through writing and
translations (identity thesis): articles must be findable, indexable, and
fast. Definition: quality of the candidate's *default* path to fully
server-rendered or pre-rendered HTML for all content pages, correct
per-language metadata (canonical URLs, `hreflang`/locale tags, sitemap, RSS),
and minimal JavaScript shipped to read an article. Anchors: 5 = content pages
are static/server-rendered HTML by default with near-zero JS and first-class
metadata control; 3 = achievable but requires configuration against the
grain or ongoing discipline to avoid shipping runtime JS to readers; 1 =
client-rendered content or metadata control that fights the tool.
Justification for weight: if articles rank and load instantly, the site does
its primary job even if everything else is merely adequate; this is the
highest-weighted *visitor-facing* criterion, but it ties with nothing above
R3/R4 because a fast site nobody can maintain, or one with faked
infrastructure, still fails the project.

### R2 — Content model fit: MDX-heavy bilingual blog — weight 14
Definition: how naturally the candidate models the actual corpus — MDX
articles with typed frontmatter; Hebrew translations paired to English
originals with original-author credit (per ADR 0011 and the translation work
described in about-tal.md); per-entry language/direction; stable URLs per
language; room for structured non-article content later (projects, notes).
Anchors: 5 = typed content schema, MDX components, and translation pairing
are native concepts; 3 = MDX works but pairing/locale routing is hand-rolled
convention with no type safety; 1 = MDX or per-page locale direction requires
plugins fighting the tool's model. Justification: the writing is the point —
this ranks just under R1 because a clumsy content model taxes every single
article forever, but a merely-adequate model is survivable in a way that bad
SEO/perf (R1) or a blown maintenance budget (R4) is not.

### R3 — Honest dynamic boundary and showcase integration quality — weight 18
G2 asks *can* the constraints be satisfied; R3 scores *how well*. Definition:
does the architecture give SQL, Docker, from-scratch CI/CD, and cloud deploy
natural, load-bearing roles — or are they satisfiable only as an awkward
sidecar? Rewards designs where the database serves a capability with a
genuine reason to exist, where containerization is the actual unit of dev
and/or deploy rather than ceremony, and where the pipeline has real stages
worth building (build, test, RTL rendering check per ADR 0011's consequence,
migrate, deploy). Also scores the candidate's implications for ADR 0013 (repo
topology): a candidate whose Docker/CI story only works under one topology
should say so and be scored on the honesty and cost of that coupling.
Anchors: 5 = the dynamic boundary falls out of the design naturally and each
of the four constraints does visible work; 3 = constraints are satisfied but
one or two feel appended rather than integral; 1 = passes G2/G3 on
technicality while the dynamic layer is obviously vestigial. Justification:
tied for highest weight with R4 because ADR 0012 is the reason this
evaluation was reopened at all — the showcase is a product requirement, not
decoration — yet it must never be allowed to outrank maintainability, or we
build a monument Tal cannot afford to keep lit.

### R4 — Maintenance budget: solo operator, real life — weight 18
Definition: total ongoing burden on one person — Tal, ending a career break
taken for newborn twins — measured as: routine ops (patching, dependency
upgrades, certificate/infra renewals, database care), blast radius when
something breaks at 2am (does the site stay up if the dynamic layer dies?),
upgrade cadence and breaking-change culture of the core pieces, and how much
of the system can sit untouched for three months without rotting. Anchors:
5 = content pages survive dynamic-layer failure, upgrades are boring, and
the honest answer to "what breaks if Tal ignores this for a quarter?" is
"nothing a visitor sees"; 3 = periodic hands-on attention required, failures
degrade gracefully; 1 = a pager-shaped architecture — always-on custody of
servers/databases where neglect means a down or defaced site. Justification:
tied for highest weight because operational burden is real money and real
time for a solo dev with infants; an architecture that is impressive but
demands ongoing custody violates the person it is for. R3 and R4 are set
equal deliberately: their tension (showcase real infra vs. keep ops near
zero) IS the central design problem of this mission, and the weights refuse
to pre-resolve it.

### R5 — Alignment with Tal's existing skills — weight 10
Definition: proximity to Tal's demonstrated stack — React 19 + TypeScript
component work, Node.js services, SQL + ORM experience, Docker/AWS exposure
(about-tal.md) — measured as: how much of the candidate is leverage of
existing skill vs. net-new learning, and whether the net-new parts are the
*intended* growth areas of ADR 0012 (SQL/Docker/CI/cloud, where learning is
the point) or incidental yak-shaving. This criterion is about the ecosystem
and language surface, and must not be read as prejudging any framework: a
candidate outside the familiar ecosystem can still score well here if its
learning cost lands in the ADR 0012 growth areas rather than beside them.
Anchors: 5 = TS end-to-end, familiar mental models, new learning concentrated
where ADR 0012 wants it; 3 = familiar language, unfamiliar paradigm; 1 = new
language or paradigm whose learning curve buys nothing the requirements ask
for. Justification: mid-weight — familiarity compounds R4 (less burden) and
delivery speed, but it must stay below R3/R4 or it becomes a thumb on the
scale for whatever Tal already knows, which is its own form of incumbent
bias.

### R6 — Cost envelope — weight 8
Definition: expected steady-state monthly cost at personal-site traffic,
scored under the G6 ceiling. Anchors: 5 = ≤ $5/month; 3 = $5–10/month;
1 = $10–15/month (passes the gate, but the money buys nothing a cheaper
candidate lacks). *(Anchors rescaled to the $15 ceiling set at the Stage 1
checkpoint.)* Free-tier dependence is scored at the price it becomes
when the free tier changes terms — free tiers are a discount, not an
architecture. Justification: low weight because within the gate the absolute
dollars are small; it exists to break ties toward frugality and to price
free-tier fragility honestly, not to dominate design.

### R7 — Explainable as exhibit — weight 8
Definition: the site's infrastructure is part of the work being shown
(identity thesis: "its own infrastructure is part of the exhibit"). Scores
whether the architecture can be honestly explained *on the site itself* — a
diagram and a plain-language writeup a strong senior colleague would nod at —
without embarrassment or hand-waving. An architecture whose honest
explanation includes "this part exists only to check a box" fails the voice
("honest, tradeoffs over pitches") and scores 1. Anchors: 5 = the writeup is
itself a compelling article, every component earns its sentence; 3 =
explainable but with one component requiring an apologetic aside; 1 =
explanation must omit or spin components to sound sane. Mild ADR 0014
relevance lands here and in R3: infra artifacts (pipelines, services,
scripts) will carry names from the naming register, which requires only that
the artifacts be real things that would need names regardless — vestigial
components would also poison the register. Justification: low-mid weight —
it rarely discriminates alone but is a sensitive detector of dishonest
designs that squeaked past G3; it converts "genuinely" from a gate into a
gradient.

### R8 — Evolvability and exit cost — weight 8
Definition: cost of changing course later — adding a capability on the
dynamic side, swapping the deploy target, or (worst case) migrating
frameworks — given that this project has already reversed one framework
decision and re-examines decisions on principle (about-tal.md). Measured as:
content portability beyond G4's floor (how much frontmatter/component syntax
is tool-proprietary), coupling between the static and dynamic layers, and
whether the deploy story is portable across cloud vendors or welded to one.
Anchors: 5 = content and dynamic layer would move with days of work; vendor
coupling is at the edges; 3 = migration is weeks, some proprietary syntax to
unwind; 1 = the design only makes sense inside one vendor's or tool's world.
Justification: lowest tier — the project should optimize for the site it is
building, not for hypothetical departures — but a nonzero weight is honest
insurance for a decision-reversing owner, and it penalizes lock-in that the
other criteria would miss.

**Sum: 16 + 14 + 18 + 18 + 10 + 8 + 8 + 8 = 100.**

---

## 3. Scoring method for Stage 2 (mechanical)

1. **Gates first.** Each candidate is checked against G1–G6 with a cited,
   web-verified justification per gate (never memory; versions and platform
   claims sourced). Any FAIL eliminates the candidate; its weighted scores
   are still recorded for the record but marked ELIMINATED.
2. **Scores.** Each surviving candidate receives an integer **1–5** per
   criterion R1–R8, argued against the anchors above. Every score citing a
   capability, version, or compatibility claim must carry a source verified
   by web search at evaluation time.
3. **Weighted total** = Σ (score × weight), maximum 500. Report both the raw
   total and total/5 (a 0–100 scale) for readability.
4. **Candidate set** must include at least 3 honest options, one of which is
   "keep the current choice" (the reopened prior decision), evaluated with no
   privilege and no penalty for being the incumbent.
5. **Tie handling.** Totals within 5% of each other (≤ 25 points of 500) are
   a tie on numbers; the tie is broken by the higher R4 score, then the
   higher R3 score, and the tie-break reasoning is written down. Weights are
   frozen as of this document; if Stage 2 reveals the weights themselves were
   wrong, that is a checkpoint conversation with Tal and a revision to THIS
   file with rationale — never a silent renumbering inside evaluation.md.
6. **Per-candidate required sections** (per tech-eval §3): strengths,
   weaknesses, GOTCHAS from docs verified via web search, and what the
   candidate forces on Docker/CI/deploy shape and on ADR 0013 topology.

---

## 4. What could poison this evaluation

Named up front so Stage 2 can be audited against them:

- **Incumbent bias.** The reopened prior choice will reappear as a mandatory
  candidate, arriving with sunk learning, preserved gotchas, and emotional
  familiarity from earlier sessions. Its preserved findings are input; its
  conclusion is not. Symptom to watch: scoring it 5 on R5 "because we already
  know it" while discounting other candidates' learning as cost even when
  that learning lands in ADR 0012's intended growth areas.
- **Novelty bias.** The mirror image: reopening a decision creates pressure
  to justify the reopening by changing the answer. A re-evaluation that
  confirms the prior choice is a legitimate outcome and must be treated as
  one.
- **Resume-driven over-engineering.** ADR 0012 makes real infrastructure a
  requirement, which is exactly the cover story over-engineering loves.
  The gate is "genuinely incorporated," not "maximally impressive." Any
  component whose honest justification is "it demonstrates a skill" and
  nothing else violates G3 in spirit and R4 in practice. R4's weight exists
  to make this bias expensive.
- **Checkbox fake dynamism.** The inverse failure: satisfying ADR 0012 with
  a vestigial database and a ceremonial pipeline. G3's deletion test and
  R7's explainability test are both aimed at this; if the site's own
  architecture writeup would embarrass its author, the design is wrong.
- **Aesthetic leakage.** Mission 2 outputs are excluded from this mission by
  design (mission plan: architecture must not be biased by aesthetics). No
  criterion above references visual design; if design-system material
  appears in Stage 2 reasoning, that is a protocol violation to flag.
- **Memory-based facts.** Every version, compatibility, pricing, and
  platform-capability claim in Stage 2 must be verified by web search or
  current docs at evaluation time. Training-data memory of ecosystems is
  stale by construction and tends to flatter whatever was popular then.
