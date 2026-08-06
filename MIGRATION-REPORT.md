# Overnight run: Tailwind utility-first migration — report

**Branch:** `tailwind-utility-migration` · **Run:** 2026-08-06, 01:37–02:20 ·
**End state: A (no-go).** Branch pushed, **no PR opened**, and **no file under
`web/` was changed**.

Delete this file before merging anything; it is a handover, not a spec. The
durable output is `specs/notes-tailwind-verdict.md`.

---

## 1. Verdict

**No-go.** Of the eight thresholds pre-registered *before* any estimating
(`specs/notes-tailwind-verdict.md` §1), six pass and two trip:

| | Threshold | Result |
|---|---|---|
| T1 | >40% of classes survive as custom CSS | **pass** — ~20% |
| T2 | Any gate/`scripts/`/`.github/`/baseline edit needed | **pass** — none |
| T3 | Pilot extrapolates past the window | **pass** — ~4–5h, boundary reachable |
| T4 | Maintainability case rests only on future pages | **TRIPS** |
| T5 | >25% of pilot declarations need arbitrary properties | **pass** — 0% |
| T6 | Pilot cannot reach zero diff in 2 attempts | **pass** — zero on attempt 1 |
| T7 | Oracle observes <90% of touched elements | **pass** — 94.8% |
| T8 | Any adversarial point unanswered | **TRIPS** — 4 of 13 |

The finding, in one sentence: **the migration is very achievable and has
almost nothing to do.** It is not blocked by RTL, by the gates, or by
fidelity — the pilot cleared all three. It is blocked by the absence of a
problem. `git log -- web/src/styles` returns seven commits ever, every page
brief is built, and the single consolidation utilities would enable is the one
`projects.css:41-48` explicitly forbids as house posture.

This is not the answer you suspected, so §3.4 of the memo states plainly what
would flip it — the main one being your call on whether the spacing scale
should become rem-based.

## 2. What is on the branch

Three commits, no code:

| Commit | Contents |
|---|---|
| `12eeb57` | `specs/notes-tailwind-verdict.md` §1–2 (thresholds + exclusion accounting) and the `build-status.md` work-started entry. Committed **before** any estimating — that ordering is the only thing that makes the thresholds mean anything. |
| *(this commit)* | Verdict memo §3, `build-status.md` §3b outcome, this report. |

`git diff main --stat` touches `specs/` only. The bridge and the pilot were
built, measured, and reverted.

## 3. Verification state — everything green

Run on the branch as it stands, after the revert:

- `node scripts/token-parity.ts` — 57/57 tokens, pass
- `node scripts/no-raw-hex.ts` — 32 files, pass
- `node scripts/contrast.ts` — 73 pairs, pass
- `pnpm --filter web exec astro check` — 0 errors, 0 warnings, 4 hints
- `pnpm --filter web build` — 9 pages
- `node scripts/banned-vocab.ts` — pass
- `pnpm --filter api typecheck` — pass
- `web/tests/run-e2e.sh` — **9/9 passed**, checked-in screenshot baseline
  matched **unchanged**

`pnpm-lock.yaml` never moved. No dependency was added.

## 4. The fidelity harness — the reusable result

Untracked in `web/.fidelity/` (never committed; `web/` is otherwise clean).
Rebuild or delete at will; it adds **zero** dependencies, reusing
`@playwright/test` 1.62.1 and the two pinned images `run-e2e.sh` already uses.

```
node web/.fidelity/run.mjs --mode=capture    # baselines, from clean main
node web/.fidelity/run.mjs --mode=compare    # assert nothing moved
```

**Why it had to exist.** All three collections are empty, so `astro build`
emits 9 pages and the card grid, entry rows, article body, contents column,
siblings block and both `[id]` templates render *nowhere*. A screenshot diff
over the shipped site is blind to most of the markup a migration would touch.
So the harness runs the matrix **twice** — once with no fixtures (the 9 pages
that ship today, all indexes empty) and once with 8 extra fixture entries
(17 pages, every route and device forced to render) — across both themes and
three widths straddling the 700px and 900px media queries. 156 screenshots,
`maxDiffPixels: 0`.

The extra fixtures live in `web/.fidelity/content/` and are named
`*-fixture.md`, which `.gitignore` and `.dockerignore` already match by name.
They therefore cannot be committed and cannot reach an image, and
`web/tests/` was never touched — the RTL spec's pinned constants are intact.

**It was validated before it was trusted.** Negative control: changing `main`'s
`padding-block-start` from 72px to 73px failed 54 of 54 comparisons. It also
caught a defect in itself first — `toHaveScreenshot` rewrites `/` in a
snapshot name to `-`, so the original nested names were being silently
*written* rather than compared, which would have turned every later run into a
comparison of the change against itself. Fixed to flat names and re-captured
from clean `main`.

## 5. Findings worth acting on regardless of the verdict

**5.1 A latent cascade bug, live today.** `global.css`'s element rules (`a`,
`html`, `body`, `main`) are unlayered, so they beat everything in
`@layer utilities` regardless of specificity. Any Tailwind utility added to an
anchor — `no-underline`, `text-muted` — is generated, applied, and silently
loses to `a { text-decoration: underline }`. Moving those rules inside
`@layer base` fixes it and changes nothing else, since they already lost to
every class rule on specificity. **Recommend a small supervised change.** It
was not done here because a no-go means no code change.

**5.2 Tailwind's scanner reads prose, and it broke a gate.** Writing the word
*invisible* in an Astro comment made Tailwind emit
`.invisible{visibility:hidden}` into shipped CSS, and `banned-vocab.ts` failed
on `hidden` — a word that appears nowhere in the source. This is the
`.contents` incident's exact mechanism, still live: today's shipped CSS
already carries `.block{display:block}` and `.contents{display:contents}`
generated from words in comments. Obligation 7 does catch the dangerous cases,
which is a point in its favour.

**5.3 Utilities are longhands; the CSS uses shorthands whose resets matter.**
`.links a[aria-current] { text-decoration: underline }` also resets decoration
colour to `currentcolor` and thickness to `auto`. The `underline` utility sets
the line only, so the underline inherited the base rule's 1px
`--border-strong`. That was the pilot's one failure: **61 pixels, on
`/colophon/` alone** — the only page where the footer carries `aria-current`.
Fixed with `decoration-current decoration-auto`. Note what this implies: a
one-page-wide defect that a single-page oracle would have missed.

**5.4 Two Tailwind 4.3.3 traps, verified against the installed package.**
`hover:` is wrapped in `@media (hover: hover)`, so migrating the site's 17
hover rules to `hover:` would delete them on coarse-pointer devices —
`[&:hover]:` is required. And `aria-current:` is not a built-in variant at
all; the footer's `aria-current="page"` needs `aria-[current]:`. Neither is
visible to a screenshot. `unicode-bidi` and `animation-delay` have no
utilities in 4.3.3 (used 3× and 4× here).

## 6. If this is picked up again

Resume point is the **start of Phase C**; Phases 0, 0.5, A and B are done and
their results are recorded. The order that worked:

1. Rebuild the harness (§4) and re-capture baselines from `main`.
2. Take the `@layer base` fix (§5.1) as its own commit — **the migration
   cannot work without it**, and the brief's plan of doing `global.css` last
   would have had every anchor migration silently fail until wave 5.
3. Then the bridge, then waves. The bridge is `@theme inline` mapping
   `--color-*`, `--font-*`, `--text-size-*`, `--leading-*`, `--tracking-*`
   one-to-one, plus `@custom-variant warm`. Radius and motion are referenced
   as `rounded-(--radius-m)` / `duration-(--motion-hover)` rather than
   bridged, because a theme key named `--radius-s` collides with the
   `rounded-s-*` **logical** utility namespace the RTL rules need.
4. Settle the rem question (memo §3.4) **before** wave 1, not after.

Tailwind v4 has full logical utilities — `mbs-`, `pbe-`, `border-bs-`,
`max-inline-*`, `ms-`/`me-`/`ps-`/`pe-` — so the repo's zero-physical-property
invariant survives a migration intact. That was checked and is not a risk.

## 7. Things I did not do, and why

- **No PR.** End state A forbids it, and the branch contains no code to review.
- **No `--update-snapshots`, ever**, and the checked-in baseline was never
  touched. The harness writes its own baselines directly instead.
- **Nothing in `scripts/`, `.github/`, `deploy/`, `tokens.css`, or
  `specs/design/prototypes/` was edited.** No gate needed it.
- **The `@layer base` fix was not shipped** despite being a real bug, because
  it is a code change to a finished site and the verdict was no-go. It is
  §5.1's recommendation instead — your call.
- **`TAILWIND-MIGRATION-BRIEF.md` and `web/.fidelity/` are untracked** and were
  not committed.
