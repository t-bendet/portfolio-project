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
