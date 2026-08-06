# Is the Tailwind utility-first migration worth it?

A working note, not a decision record. It exists because the migration was
proposed with a suspicion attached ("it probably is worth it"), and a
suspicion that goes unchallenged becomes a rationalization. `CLAUDE.md`'s
standing rule — *honest tradeoff analysis always, no promotional framing of
any technology, including ones already chosen* — applies to Tailwind exactly
as it applies to Astro and to the hand-written pipeline.

**Sections 1 and 2 were written and committed BEFORE any estimating, before
the pilot, and before the adversarial review reported.** That ordering is the
only thing that makes the thresholds mean anything. If a threshold below looks
badly calibrated in hindsight, the honest move is to record that it was
mis-set and say so — not to move it.

---

## 1. Pre-registered go/no-go thresholds

The migration is a **NO-GO** if any one of these is true. They are not
weighted and they do not trade off against each other; one trip is enough.

| # | Threshold | How it is measured |
|---|---|---|
| T1 | **>40%** of the distinct custom class names must survive as custom CSS anyway | Count of class names still carrying a CSS rule after migration ÷ count before. Measured on the real tree, not estimated. |
| T2 | **Any** change to `scripts/`, `.github/`, `deploy/`, `web/src/styles/tokens.css`, or the checked-in e2e screenshot baseline is needed to make a check pass | Binary. A single required edit trips it. |
| T3 | The pilot extrapolates to more work than remains in the unattended window to reach a **wave boundary** | Pilot wall-clock × remaining waves, against time left. Trips if the projection cannot land on a committed, green wave boundary. |
| T4 | The maintainability case rests **only** on hypothetical future pages | The argument must cite a benefit that is real on the tree as it stands today. "It will help when the site grows" is not sufficient on its own. |
| T5 | **>25%** of the pilot's CSS declarations cannot be expressed as a bridged or standard utility | Declarations needing an arbitrary *property* (`[prop:value]`), or needing to stay in a stylesheet, ÷ total declarations in the pilot's scope. Arbitrary *values* (`mt-[18px]`) do NOT count against this — they are the pixel-identical constraint working as designed. |
| T6 | The pilot cannot reach a **zero-pixel** fidelity diff within 2 focused fix attempts | Binary, from the harness. |
| T7 | The fidelity oracle can observe **<90%** of the elements the migration touches | Elements rendered on at least one page in the fidelity matrix ÷ elements whose class attribute or rule changes. An unobservable migration is an unverifiable one. |
| T8 | **Any** point raised by the adversarial review goes unanswered | Each numbered point must get a specific response. "That is a matter of taste" is not a response. |

### What evidence would flip this to no-go

Stated up front so the answer cannot be reverse-engineered from the outcome:

- A pilot that needs arbitrary-property utilities (`[transition:…]`,
  `[unicode-bidi:isolate]`) for a **majority** of its non-trivial
  declarations. That is not utility-first; that is CSS with extra syntax and
  worse ergonomics, and it trips T5.
- Any fidelity diff that survives two attempts and is not explained by a
  mistake I can name. An unexplained pixel is a silent redesign.
- Discovering that a gate's parser, or the e2e suite, depends on something the
  migration must move. That is T2, and T2 is an abort, not a negotiation.
- The class census showing that most declarations are reachable only through
  descendant selectors over markdown-generated HTML. Those elements have no
  class attribute to put a utility on, so no amount of effort converts them.
- The adversarial review producing a point about **this repository's stated
  values** — not about utility CSS in general — that has no answer.

### What is explicitly NOT evidence either way

- Bundle size. The site ships one small stylesheet; nothing here turns on a
  few kilobytes, and citing it would be exactly the promotional framing
  `CLAUDE.md` forbids.
- "Tailwind is the industry standard." An appeal to popularity is not a
  tradeoff analysis.
- The fact that Tailwind is already installed. Sunk cost. It is wired and
  unused today, and *removing* the dependency is as available as using it.

---

## 2. Exclusion accounting, stated before the estimate

The migration surface is **not** the styling total, and any verdict that
claims "1,690 lines of CSS eliminated" is dishonest by construction. What is
structurally out of reach, decided before measuring:

| Excluded | Lines | Why it cannot move |
|---|---|---|
| `article.css` — the `.article-body …` descendant block | ~250 of 454 | Styles markdown-generated HTML. Those elements carry no class attribute, so there is no place to put a utility. Not a preference; there is no mechanism. |
| `hero.css` | 130 | 4 `@keyframes` and a resting-state-first reduced-motion contract. Tailwind has no keyframe authoring surface, and the contract is the point. |
| `tokens.css` | 175 | Byte-frozen. Three of the four gates textually parse it. The theme *bridges* to it. |
| `pre`/`code`/`.hero-mark` forced `direction: ltr` | ~6 | An e2e test asserts the **computed** style; the rule must apply to markdown-generated `pre`/`code` too. |

Total styling: **1,686 lines** (1,257 in `src/styles/` + ~429 in scoped
`<style>` blocks). Structurally excluded: **~561**. The honest migration
surface is therefore roughly **1,125 lines** — and "surface" means *eligible
to be looked at*, not *guaranteed to disappear*.

Two further honesties that belong here rather than in a footnote:

1. **A migrated declaration is not a deleted declaration.** It moves from a
   stylesheet into a class attribute. The only real deletions are rules that
   were dead, and duplicated declarations that collapse into one utility.
2. **The pixel-identical constraint caps the readability upside.** A value
   that does not sit on Tailwind's 4px grid must be written as an arbitrary
   value carrying the original number (`mt-[18px]`), because snapping it is a
   design change and belongs to Tal in a supervised pass. Utilities that read
   `mt-[18px]` are not more readable than `margin-block-start: 18px`. They are
   the same information in a terser, less greppable place.

---

## 3. Measurement, pilot, adversarial review, and verdict

*Written after sections 1–2 were committed. See git history for the ordering.*

### 3.1 The verdict

**NO-GO.** Two pre-registered thresholds trip: **T4** (the maintainability
case rests only on future pages) and **T8** (adversarial points left
unanswered). Six others — T1, T2, T3, T5, T6, T7 — pass, several of them
comfortably. Under section 1's own rule, one trip is enough, and the honest
response to "but six passed" is that the thresholds were written to be
independent precisely so that a good score on mechanics could not outvote a
missing reason to start.

The short version: **the migration is very achievable and has almost nothing
to do.** It is not blocked by RTL, not blocked by the gates, and not blocked
by fidelity. It is blocked by the absence of a problem.

### 3.2 What was measured

Every number below is from this repo, not from an estimate.

**Reachability** (`web/src/` at `a1d7983`): 668 declarations across 191 rules.

| Class of rule | Rules | Declarations | Share |
|---|---|---|---|
| Reachable from a class attribute | 131 | 481 | 72.0% |
| Descendant of a class, element carries none | 43 | 155 | 23.2% |
| Bare element / global / keyframe | 17 | 32 | 4.8% |

Of the 155 "descendant" declarations, ~67 are the `.article-body …` rules over
markdown-generated HTML and are permanently out of reach. The rest descend to
elements that live in `.astro` templates and could, in principle, take a
utility.

**Oracle coverage (T7): 94.8%.** The adversarial review computed 65% and was
right about the repo as it stands — but it assumed the only fixture is the
checked-in `rtl-fixture.md`. The harness built for this run installs a second,
untracked fixture set (`web/.fidelity/content/`, 8 entries) and runs the whole
matrix **twice**: once with no fixtures (the 9 pages that ship today, all three
indexes in their empty states) and once filled (17 pages: both `[id]`
templates, the card grid, the contents column, siblings, all six accent chips,
a translator's note, tables, blockquotes, `h3`/`h4`). 89 of 102 authored class
names render. Of the 13 that do not, 5 are parser artifacts, 2 (`terms`,
`routes-out`) render in the *empty* pass, 1 is the dynamic `accent-${n}`, and
the remaining 5 — `portrait`, `with-portrait`, `cv-line`, `cv-link`,
`cv-detail` — are gated behind `null` values in `web/src/lib/about.ts` and
would need a source edit to render at all. So the oracle sees essentially
everything the migration would touch. **T7 passes.**

**The oracle works.** Negative control: changing `main`'s
`padding-block-start` from 72px to 73px failed 54 of 54 comparisons. An oracle
that cannot fail is decoration, and this one was made to fail on purpose
before it was trusted. (It also caught a real defect in itself first —
`toHaveScreenshot` rewrites `/` in a snapshot name to `-`, so the first
baseline set was being silently written rather than compared, which would have
made every later run a comparison of the change against itself.)

**The pilot (`SiteFooter.astro`, T3/T5/T6).** Migrated end to end: 7 rules, 22
declarations, 45 lines of scoped CSS, deleted entirely and replaced by
utilities in markup.

- **Zero pixel diff across all 156 comparisons**, on the first fix attempt.
  **T6 passes.**
- Arbitrary *properties* needed: **zero**. **T5 passes** (0%, floor 25%).
  Arbitrary *values* and *variants* were needed and, per section 1, do not
  count against T5 — but see 3.3.
- Wall clock ≈ 12 minutes including one fix iteration and two full fidelity
  runs. Extrapolating 22 declarations → 481 gives roughly 4–5 hours of
  execution plus per-wave verification; a wave boundary was clearly reachable
  inside the window. **T3 passes.**
- **T1 passes**: roughly 15–20 of 86 class names would have to survive
  (`article-body` and `credit` are frozen by the e2e spec, the hero set,
  `note`/`translator-note`, `stack-chip` + `accent-1…6`), ~20% against a 40%
  ceiling.
- **T2 passes**: nothing in `scripts/`, `.github/`, `deploy/`, `tokens.css` or
  the e2e baseline needed to change. The `@theme inline` bridge left
  `tokens.css` byte-identical and all four gates green.

Two mechanical findings from the pilot worth keeping regardless of the verdict:

1. **The cascade-layer ground is asymmetric, and it is a latent bug today.**
   `global.css`'s element rules (`a`, `html`, `body`, `main`) are *unlayered*,
   so they beat everything in `@layer utilities` regardless of specificity. Any
   utility anyone adds to an anchor — `no-underline`, `text-muted` — is
   generated, applied, and silently loses to `a { text-decoration: underline }`.
   The pilot only worked because the bridge commit moved those rules into
   `@layer base`. **This is worth doing on its own, in a small supervised
   change, whether or not the migration ever happens.**
2. **Utilities are longhands; the source CSS uses shorthands whose reset
   behaviour is load-bearing.** `.links a[aria-current] { text-decoration:
   underline }` also resets decoration colour to `currentcolor` and thickness
   to `auto`. The utility `underline` sets the line only, so the underline
   inherited the base rule's 1px `--border-strong`. That was the pilot's one
   failure: 61 pixels, on `/colophon/` alone — the single page where the footer
   carries `aria-current`. Without a fidelity pass covering that page it ships
   silently.

### 3.3 Answering the adversarial review

Thirteen points were raised. The ones that were answerable are answered here;
the ones that are not are why T8 trips.

**Answered:**

- **(1) Only ~65% of the surface is observable.** Answered: 94.8%, via the
  two-pass untracked fixture set described above. Crucially this did *not*
  require editing `web/tests/` — the fixtures live in `web/.fidelity/content/`
  and are named `*-fixture.md`, which `.gitignore` and `.dockerignore` already
  match, so the RTL spec's pinned constants were never touched.
- **(5) The `.contents` incident will recur, multiplied.** Answered as to
  detectability, and then **demonstrated live**. Writing the word *invisible*
  in an Astro comment caused Tailwind to emit `.invisible{visibility:hidden}`
  into shipped CSS, which failed `banned-vocab.ts` — on the word `hidden`,
  which appears nowhere in the source. So the collision class is real and the
  existing gate does catch the dangerous instances. It cost one build to find.
- **(11) The dead-selector sweep would delete `.note`.** Correct, and the
  answer is that the sweep must be defined to exempt content-authored classes
  (`note`, `translator-note`, `translator-note-label`) enumerated in advance.
  Cheap to do; not a reason to stop.
- **(12) The dynamic `accent-${n}` chip.** Answered by keeping `.stack-chip`
  and `.accent-1…6` as custom classes, which is what the brief already
  permits. It counts against T1 and T1 still passes.
- **(2, in part) `hover:` is gated behind `@media (hover: hover)`.** Verified
  in the installed 4.3.3. Answerable by writing `[&:hover]:` instead, which
  the pilot did — all 17 hover rules would need it.
- **(2, in part) `aria-current:` matches only the literal `"true"`.** Verified:
  the built-in variant does not exist in 4.3.3 at all. `aria-[current]:` works
  and the pilot used it.

**Not answered — these are T8:**

- **(3) 125 grid-aligned px values become root-relative.** Confirmed in this
  repo's own emitted CSS: `.mbs-24{margin-block-start:calc(var(--spacing) *
  24)}` with `--spacing: .25rem`. That is 6rem, not 96px. At a 16px root they
  are identical, which is exactly why **all 156 fidelity comparisons passed**.
  The site's type scale is deliberately absolute px (`--size-body: 15.5px`),
  so the result is absolute type with user-scaled spacing. That may well be an
  improvement — but it is a *design decision*, and the brief itself reserves
  design decisions for Tal in a supervised pass. The only exact alternative is
  writing all 125 as `mbs-[96px]`, at which point the readability argument is
  gone. There is no third option, and I could not construct one.
- **(6) The reasoning has nowhere to live.** 249 comment lines, ~2,191 words,
  31 `specs/` citations, inside style blocks — attached to the declaration
  each explains. `projects.css:17-22` explains why `auto-fill` and not
  `auto-fit` *at the declaration that says `auto-fill`*. As a utility that
  becomes `grid-cols-[repeat(auto-fill,minmax(280px,1fr))]` in a `<ul>` tag,
  and the paragraph has no referent. The pilot demonstrated the failure mode
  exactly: its 45 deleted lines took their comments with them, the replacement
  prose had to sit detached above the markup, and that comment then broke a CI
  gate. HTML has no per-attribute comment. This is unanswerable, not merely
  inconvenient, and `CLAUDE.md` asks for a *genuine showcase*.
- **(7) Single-definition-point is a spec'd correctness property.**
  `projects.css:2-8` — "there has to be exactly one card"; `entry-list.css:2-7`
  — "one stylesheet so the indexes cannot drift"; and `projects.css:41-48`
  explicitly *forbids* consolidating the repeated title/description/meta
  declarations, because each archetype device owning its own is the house
  posture. The pilot measured the cost directly: 22 declarations became **100
  utility tokens**, a 4.5× expansion, with the same 14-utility string repeated
  verbatim on all five anchors. Five places where the footer's links can now
  drift from each other, replacing one rule that made drift impossible. The
  only mechanism that restores the property is extracting Astro components —
  which is a different refactor with a different risk profile, and is
  available today without Tailwind.
- **(8) Nothing is being maintained.** `git log -- web/src/styles` returns
  **7 commits, ever**. Every page brief is built, every route carries real
  copy, no `TODO(Tal)` slot remains. I went looking for a benefit that is real
  on the tree *today* and the best candidate — collapsing the duplicated
  `.card-title`/`.row-title`/`.entry-title` declarations — is the one the
  specs explicitly forbid. That is T4, and it is the substantive finding of
  this whole exercise.

### 3.4 What would flip this to go

Stated so the decision is reversible on evidence rather than on mood:

1. **Tal ratifies the spacing scale becoming rem-based** (point 3). That single
   decision removes the largest unanswerable objection and makes the standard
   utilities usable as intended.
2. **The site starts growing again** — new page archetypes, a second author,
   or the dynamic layer landing with real components. T4 is a statement about
   today, not about Tailwind.
3. **The migration is reframed as component extraction**, with utilities as the
   styling mechanism *inside* the extracted components. That answers point 7
   directly, and it is the version of this change worth wanting, because it
   restores the one-definition-point property instead of spending it.

None of these are close calls that were resolved against the migration. They
are simply not true today.

### 3.5 What was kept at the time of the no-go

Nothing. The branch carries this memo, the `build-status.md` entry, and
`MIGRATION-REPORT.md`; no file under `web/` was changed. The bridge and the
pilot were both reverted after measurement, which is what section 1 said would
happen on a no-go. The fidelity harness stays untracked in `web/.fidelity/`
and is described in the report so it can be rebuilt — it is the reusable
result of the night, and it would be the right first step of any future
attempt.

---

## 4. Reversal — GO, on Tal's decision (2026-08-06)

Section 3 is left exactly as written. It is the record of what the evidence
said before a decision was taken, and editing it to agree with the outcome
would destroy the only thing the pre-registration bought. What follows is the
reversal and its grounds.

**Verdict: GO.** Tal ratified two things after reading §3:

1. **The spacing scale becomes rem-based.** This is the ratification §3.4
   named as flip-condition 1.
2. **Multi-site devices are extracted into Astro components**, with utilities
   living inside them. This is flip-condition 3.

### 4.1 What each decision actually does to the analysis

Being precise about which objections were *answered* and which were
*accepted*, because they are not the same act and the difference is the whole
value of §3.

**Answered — these objections are now gone, not absorbed:**

- **Point 3 (px → rem).** This was the one objection I could not engineer
  around: the only exact translation was bracketing all 125 grid-aligned
  values, which would have destroyed the readability case. With the scale
  ratified, `mbs-24` is simply *correct* — `calc(var(--spacing) * 24)` at
  `--spacing: .25rem` is the intended value, not a drift to be tolerated.
  Spacing now scales with the user's root font size while the type scale stays
  absolute px; that asymmetry is a known consequence and Tal's to own.
  Consequence for the harness: the fidelity oracle runs at a 16px root, where
  rem and px agree, so it **cannot** police this. It is ratified, not verified.
- **Point 7 (single-definition-point).** Component extraction restores the
  property the specs require rather than spending it. `projects.css:2-8`'s
  "there has to be exactly one card" and `entry-list.css:2-7`'s "one
  stylesheet so the indexes cannot drift" become *one component* instead of
  one stylesheet. The pilot measured the alternative: 22 declarations → 100
  utility tokens with the same 14-utility string on all five footer anchors.
  Extraction is strictly better than the status quo here, because a component
  enforces the shared device at the markup level, not merely by convention.

**Accepted as cost — real, unrefuted, and overridden deliberately:**

- **T4 / point 8 (nothing is being maintained).** Still true on the evidence:
  seven commits ever to `web/src/styles`, every page brief built. No new fact
  retired this; Tal has judged the value differently, which is an owner's call
  about a portfolio's direction rather than a question the repo can answer.
  Recorded as an override, not as a refutation.
- **Point 6 (the reasoning loses its referent).** ~2,191 words of commentary
  with 31 `specs/` citations currently sit against the declarations they
  explain. Component extraction **mitigates this more than a straight
  migration would** — a component file has a header comment, and a device's
  rationale can live there attached to the device. It does not fully solve it:
  per-declaration notes like `projects.css:17-22`'s "auto-fill, not auto-fit,
  and the difference is load-bearing" still end up beside a
  `grid-cols-[repeat(auto-fill,minmax(280px,1fr))]` token rather than beside a
  property. **Mitigation is mandatory, not optional:** every extracted
  component carries the prose from the rules it replaces, in its frontmatter
  comment. A migration that drops the commentary is a failed migration, and
  reviewers should reject it on that ground alone.

Two thresholds therefore still read as tripped on evidence (T4, and T8 in
part). The verdict flips because the decision-maker has weighed the accepted
costs against a benefit the analysis cannot measure — not because the analysis
changed. That distinction is the honest framing and it stays in the record.

### 4.2 Revised plan

The brief's §9 waves were built around stylesheet clusters. Extraction changes
the unit to **devices**, so the waves are re-cut. Everything else from the
brief stands: pixel-identity at `maxDiffPixels: 0`, `tokens.css` byte-frozen,
logical utilities only on the inline axis, no new dependencies, no edits to
`scripts/`/`.github/`/`deploy/`/the e2e baseline, one commit per wave as the
rollback unit, revert a wave that cannot reach zero diff in two attempts.

**Prerequisite: PR #27 (`@layer base`) must be merged first.** Until it is, an
unlayered `a { text-decoration: underline }` beats every utility placed on an
anchor. The brief's plan of doing `global.css` last would have had every
anchor migration silently fail until wave 5.

| Wave | Unit | Contents |
|---|---|---|
| 0 | orchestrator | Token bridge: `@theme inline` mapping `--color-*`, `--font-*`, `--text-size-*`, `--leading-*`, `--tracking-*` 1:1, plus `@custom-variant warm`. Radius/motion referenced as `rounded-(--radius-m)` / `duration-(--motion-hover)` — a theme key `--radius-s` would collide with the `rounded-s-*` **logical** namespace. Exit: zero diff, bridge alone invisible. |
| 1 | leaf devices ×3 ∥ | `Chip`/`ChipList` (dedupes the `.chip` defined in both `article.css` and `entry-list.css`); `StackChip` (six enumerated literal accent variants — never interpolated); `RefRow`/`RefRows`. |
| 2 | chrome ×2 ∥ | `SiteFooter` (piloted already — `FooterLink`); `SiteHeader` (`NavLink`, eyebrow, `segment-he`, mark). Renders everywhere: diff all pages. |
| 3 | index devices ×2 ∥ | `Card` + `CardGrid` shared by `/` and `/projects/`; `EntryRow` + `PageHeader`/`Standing`/`CrossLink`/`Terms` (the `warm:` variant)/`RoutesOut` shared by `/writing/` and `/he/writing/`. |
| 4 | article shell, serial | `article.css`'s class-attached parts only: `.article-grid`/`.with-contents`, `.article-header`, `.lede`, `.meta-line`, `.article-contents*`, `.end-matter*`, `.siblings*`, `.credit*`, `.translator-note*`. **`.article-body` and `.credit` are frozen names** (`rtl.spec.ts`). |
| 5 | page-local ×5 ∥ | Scoped `<style>` blocks: `about`, `contact`, `colophon`, `404`, `he/404`, plus `index.astro`'s `block`/`block-title`/`block-link` trio (dissolved — bare `block` collides with the `.block` utility). |
| 6 | orchestrator | `global.css` sweep, then dead-selector sweep. |

**Stays CSS, by design** — unchanged from §2's exclusion accounting:
`article.css`'s `.article-body …` descendant rules over markdown-generated
HTML; `hero.css` (keyframes + the resting-state-first contract); the
`pre`/`code` `direction: ltr` rule; `.note`/`.translator-note*` as
content-authoring affordances.

**The dead-selector sweep must exempt content-authored classes** — `note`,
`translator-note`, `translator-note-label`. They are applied from MDX, not
from `web/src`, so a class-name grep marks them dead, deletes them, and every
gate stays green because no page renders a callout. This was adversarial
point 11 and it is a real trap.

### 4.3 Verification, unchanged and non-negotiable

Per wave: four gates + `astro check` + build + `banned-vocab` + the full
156-screenshot fidelity diff at `maxDiffPixels: 0` (both passes — the empty
state that ships and the fixture-filled state), then one commit. Final:
`run-e2e.sh` with the checked-in baseline passing **unchanged**.

Two things the oracle provably cannot see, to be held in review rather than
trusted to a green run:

- **the rem change** (§4.1) — ratified, unverifiable at a 16px root;
- **`hover:`'s `@media (hover: hover)` gate** — Tailwind v4 wraps `hover:`,
  which would delete the site's 17 hover states on coarse-pointer devices.
  **`[&:hover]:` is mandatory throughout.** Likewise `aria-[current]:`, since
  the built-in `aria-current:` variant does not exist in 4.3.3.

And one gate hazard worth repeating: Tailwind's scanner generates utilities
from words in *prose*, including comments. Writing *invisible* in a comment
emitted `.invisible{visibility:hidden}` and failed `banned-vocab.ts` on
`hidden`. Component frontmatter comments carrying the migrated rationale
(§4.1) are exactly where this will bite.
