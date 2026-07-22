# Standing Corrections

Closed-mission outputs are frozen (ADR 0028) and are Phase 2's specs. When
one of them turns out to be wrong, the reasoning is never edited — the same
rule that governs ADRs. The correction lives here instead, and this file is
permanent.

**Read this alongside `missions/*/outputs/`.** A frozen output that carries a
correction here is still binding everywhere the correction does not reach;
acting on the output alone will produce the wrong result, exactly as with an
ADR narrowing (ADR 0027).

`docs/SCAFFOLD-VERIFICATION.md` is the same pattern applied to one document
in one batch. This file is the general case, for corrections that arrive one
at a time.

| ID | Corrects | Recorded | Authority |
|----|----------|----------|-----------|
| SC-1 | `missions/03-technology-architecture/outputs/repo-topology-decision.md` lines 20-23 | 2026-07-22 | ADR 0034 |
| SC-2 | `missions/05-ai-dev-workflow/outputs/phase2-workflow.md` §2, infra track "Owns" column | 2026-07-22 | ADR 0034 |

---

## SC-1 — workshop checks are not path-scoped

**The output says:** GitHub Actions `paths:` filters scope the three authored
workflows — `ci.yml`, `deploy.yml` on `app/**`; workshop checks on
`docs/**`/`.claude/**` — "so docs churn never builds images and app pushes
never run workshop lint."

**What is true instead:** `workshop.yml` carries no `paths:` filter and runs
on every pull request and every push to `main`, including `app/**`-only
changes.

**Why:** it is the required status check on `main`. GitHub distinguishes only
*reported* from *not yet reported*, so a required check skipped by a filter
blocks the pull request indefinitely. The clause was written before branch
protection existed, when no workflow was required and the filter cost
nothing. Full reasoning, the two ordering rules it implies, and the rejected
alternatives are in **ADR 0034**.

**Still true in the same output:** the `paths: [app/**]` scoping of `ci.yml`
and `deploy.yml`, and the reasoning that path-filtering is honest pipeline
design worth exhibiting. Neither is a required context today. If either
becomes one, ADR 0034's ordering rules govern.

---

## SC-2 — the infra track owns four workflows, not three

**The output says:** the `infra` track owns "the three GitHub Actions
workflows."

**What is true instead:** four. `ci.yml`, `deploy.yml`, `backup.yml`, and
`workshop.yml`.

**Why:** `workshop.yml` did not exist when Mission 5 wrote §2. ADR 0013
already implied it ("workshop checks keep their own workflow"), so the count
was wrong on the day it was written rather than made wrong by later work.

**Why it matters enough to record:** §2 is the table an infra work item is
told to read to find out what it governs, so an undercount there is an
invitation to treat `workshop.yml` as out of scope.
