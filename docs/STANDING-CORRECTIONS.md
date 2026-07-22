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
| SC-3 | `missions/05-ai-dev-workflow/outputs/phase2-workflow.md` §2 track table and §4.1 Gated examples | 2026-07-22 | ADR 0035 |

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

---

## SC-3 — the workshop's own machinery is infra-track and always Gated

**The output says:** §2 defines four tracks — `infra`, `api`, `web`,
`content` — as "four long-lived areas", with `infra` owning Dockerfiles,
compose files, the `Caddyfile`, the GitHub Actions workflows, and AWS
provisioning. §4.1's Gated examples list auth, migrations, container and
proxy config, the workflows, secrets/IAM/DNS, first-of-kind content, and the
theme mechanism.

**What is true instead:** both lists are incomplete in the same place. The
workshop's own machinery — `scripts/**`, `.claude/skills/**`,
`.claude/agents/**`, both settings files, and the workshop process documents
— belongs to the `infra` track, and any change to the *enforcement layer*
(`scripts/hooks/**`, `scripts/*.ts`, the settings files) is Gated. This
compounds SC-2 on the same `infra` row.

**Why:** §2 was written while Mission 5 was still open, when machinery
changes were mission work rather than work items, so no track needed to own
them. PR #5 improvised "OFF-TRACK + Gated" and its reviewer accepted both,
which left the classification resting on a withdrawn branch. Full reasoning,
including why this is `infra` rather than a fifth `workshop` track and why
OFF-TRACK is rejected as a standing category, is in **ADR 0035**.

**Read with it:** ADR 0035 decisions 1 and 2 also fix who may author such a
change. A session writes the specification and the verification; Tal writes
the code for anything under the enforcement layer. §2's ordering sentence
(`infra` scaffolds first) is unaffected — it governs the four build tracks,
and a machinery item sits outside that dependency chain.

**Still true in the same output:** everything else in §2 and §4.1, including
"one track at a time", the class-declared-before-work rule, and the
first-of-each-kind rule.
