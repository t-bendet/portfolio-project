# Phase 2 Cleanup — TODO

From the 2026-07-22 workshop audit. **Resolved and executed 2026-07-22** as
the `infra/workshop-cleanup` work item (review class Standard), after gate
condition G-1: coherence finding C1 flagged that §A/§B contradicted active
ADRs 0025/0028. Tal arbitrated at the Phase 2 open checkpoint; the decisions
now live in **ADRs 0030–0032**, which is what made this list executable:

- **ADR 0030** (narrows 0025) — retirement = deletion; provenance = git
  history + `docs/EVOLUTION.md`.
- **ADR 0031** (narrows 0022, 0028) — docs-sync machinery retires; colophon
  re-scoped to a static road-to-production page generated at first deploy;
  the fingerprint staleness check abandoned (also resolves gate finding C6).
- **ADR 0032** (narrows 0028) — protect-workshop static rule; species lint
  dropped; parameter headers stripped.

## A. Deletions

- [x] **[Tal, by hand]** Delete `scripts/sync-docs.ts` and
      `scripts/hooks/docs-sync-check.ts`; remove the docs-sync-check entry
      from `.claude/settings.json` (PostToolUse). Diagrams live only in
      `docs/HANDBOOK.md` from now on. *(ADR 0031)*
- [x] Delete `docs/diagrams/` and `docs/.docs-fingerprint.json`.
- [x] Delete the six retired agent files (`brand-strategist`,
      `design-systems`, `design-verifier`, `ia-planner`, `tech-architect`,
      `workflow-engineer`). Provenance: git history + `docs/EVOLUTION.md`;
      handbook §5 updated. *(ADR 0030)*
- [x] **[Tal, by hand]** `scripts/test-machinery.ts` updated — docs-sync
      assertions removed; `red-team-reviewer.md` probe kept.

## B. Simplifications

- [x] Strip the "Project parameters (ADR 0029)" header blocks. Four skills
      carried it (`mission-protocol`, `adr-keeper`, `review-work`,
      `prompt-craft`); the TODO's original list also named `tech-eval`,
      which never had one (coherence C5). *(ADR 0032)*
- [x] **[Tal, by hand]** `scripts/hooks/protect-workshop.ts` simplified to
      the static Phase 2 rule; phase-table cases trimmed from
      `test-machinery.ts`. *(ADR 0032)*
- [x] **[Tal, by hand]** `scripts/validate-workshop.ts`: species contract
      and mission template-section checks dropped; keeps SKILL.md exists,
      name matches folder, description present, mission skills carry
      `disable-model-invocation: true`. *(ADR 0032)*
- [x] `docs/HANDBOOK.md` updated to match: docs-sync bullet and sync-docs
      paragraph removed, mermaid-extraction claim removed, agents list §5
      rewritten, hook count now five.

## C. Keep — decided, do not revisit

- All six mission skills (they are the process record).
- `red-team-reviewer` + `review-work` (`context: fork`).
- `docs-explorer` (though context7 MCP overlaps it; retire later if unused
  in practice — that's a friction-log call, not a today call).
- `mission-gate` backward freeze (closed outputs are Phase 2's specs).
- `narrows`/`narrowed-by` frontmatter + INDEX note. (The graph validator in
  `validate-adr.ts` stays too — removing it isn't worth a hand-edit.)
- `contrast.ts`, `test-machinery.ts`, `inject-project-state`,
  `decision-guard`, `protect-reference`.

## D. Model tiering (2026-07-22 call)

Rule: **reviewer model ≥ producer model, always.** The fresh-context reviewer
is the safety net that makes cheaper producers safe; downgrading it turns the
gate system into theater.

- M6: Fable — the mission *is* the adversarial coherence pass; last cheap
  point to catch a cross-ADR contradiction.
- Phase 2, by review class (ADR 0025):
  - Routine → Sonnet (Haiku acceptable for pure copy)
  - Standard → Sonnet + propagation checklist
  - Gated → producer Sonnet/Opus; `review-work` reviewer on Fable/Opus
- Workers (`docs-explorer`) stay pinned to Sonnet.
- Mechanical drafting from decided specs (ADR formatting, STATUS files,
  briefs post-decision) → Sonnet.

## E. Process (from IMPROVEMENTS.md, still open)

- [~] **SR-18 partially closed (2026-07-22, PR #2) — NOT done.** The
      procedure below assumed `ci.yml` had to come first, which read as
      blocked on the whole scaffold. It wasn't:
      `repo-topology-decision.md:72` already splits workshop checks into
      their own workflow, and that one needs no `app/`, no dependencies and
      no install step. `.github/workflows/workshop.yml` landed and
      `contexts: ["checks"]` is now required on `main` with `strict: true`.

      **Residual risk, stated plainly: `enforce_admins: false` and there is
      exactly one account, which is an admin.** That flag exempts admins
      from *every* branch protection — the required `checks` context, the
      PR requirement, and `required_linear_history` alike. So none of this
      mitigates the threat SR-18 actually names
      (`security-requirements.md:163-168`, a compromised session pushing to
      `main`); it gates the cooperative path only. Closing SR-18 means
      flipping `enforce_admins: true` and accepting that a wedged check
      locks Tal out until fixed through a PR. Tal's call, deliberately
      deferred, and the item stays open until it is made.

      Squash-only is now configuration rather than habit for anyone who is
      not an admin: `required_linear_history: true` on the branch, plus
      repo-level `allow_merge_commit: false` / `allow_rebase_merge: false`
      (rebase-merge would satisfy linear-history but still land N commits
      instead of ADR 0026's one). **For the admin, only the repo-level
      pair binds, and only through the UI — a locally-made merge commit
      pushed by an admin is not rejected.** Existing history is untouched
      either way: the check is on incoming commits, so the six mission
      merge commits stand. `delete_branch_on_merge: true` automates ADR
      0026's optional work-item-branch cleanup; mission branches are
      unaffected because it only fires on PR merge.

      Actions supply-chain settings tightened at the same time, before any
      workflow holds credentials: `sha_pinning_required: true` (tag refs
      rejected — `workshop.yml` pins `actions/checkout` and
      `actions/setup-node` to commit SHAs with the version in a trailing
      comment), `allowed_actions: "selected"` with `github_owned_allowed:
      true` / `verified_allowed: false` / `patterns_allowed: []`, and
      Dependabot alerts + automated security fixes on.
      `default_workflow_permissions` was already `read`.

      SHA→tag provenance for the two pins (SR-20), resolved 2026-07-22 via
      `gh api repos/<r>/git/ref/tags/<v>` and dereferenced where the ref is
      an annotated tag object:
      `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1` = v7.0.1,
      `actions/setup-node@820762786026740c76f36085b0efc47a31fe5020` = v7.0.0.
      Re-resolve on every bump; the comment is a label, not evidence.

      **This gates the scaffold: `deploy.yml` cannot use any third-party
      action until it is added to `patterns_allowed`.** The known one is
      `aws-actions/configure-aws-credentials@*` for the OIDC role assumption
      in ADR 0021. Add it — SHA-pinned — as part of §5, or the first deploy
      run fails on a permissions error that reads nothing like its cause.

      **Latent deadlock in the procedure as written — do not repeat.** The
      step below says to require `ci.yml`, but `ci.yml` is scoped
      `paths: [app/**]`, so it never reports on a docs-only PR, and GitHub
      cannot tell "will never report" from "still running". Requiring it as
      written would have hung every ADR PR indefinitely. When the scaffold
      authors `ci.yml`, the skip-shim job that reports success on
      non-`app/**` PRs must land **in the same commit** that adds it as a
      required context.

      **Correction to a closed-mission spec (standing-corrections pattern,
      as in `SCAFFOLD-VERIFICATION.md` §1-§7).** `repo-topology-decision.md`
      lines 20-23 assign workshop checks to `paths: docs/**` / `.claude/**`,
      reasoning that "app pushes never run workshop lint"; ADR 0013
      §Consequences accepts path filters as the exhibited design.
      **`workshop.yml` ships with no `paths:` filter, reversing that
      clause.** The reason is one the closed mission could not have had: it
      chose filters before the workflow was a *required status check*, and
      a required check that never reports is indistinguishable to GitHub
      from one still running, so a filtered workshop check blocks every
      `app/**`-only PR forever. The saving — a few seconds of a runner with
      no install step — does not buy back a deadlock. No ADR is written:
      0013's Decision asserts `paths: [app/**]` for `ci.yml`/`deploy.yml`
      only, so nothing binding is contradicted. If one is ever written it
      needs `narrows: 0013` plus the reciprocal `narrowed-by` (ADR 0027).

      **SR-17 gap, carried into the remaining half.** SR-17 requires a
      secrets scan on *every* PR, but the `sec` stage is specified inside
      `ci.yml`, which is `paths: [app/**]` — so today a docs-only PR gets
      no scan, and `workshop.yml` does not add one (a scanner would be a
      third-party action, and `patterns_allowed` is `[]`). When the shim
      below is written it **must not report the `sec` stage green on
      non-`app/**` PRs**; either the scan moves somewhere unfiltered or the
      shim greens only the app-specific stages. Naming it here so the shim
      does not quietly convert a coverage gap into a passing check.

- [ ] **Remaining half — add `ci.yml` as a second required context when the
      scaffold authors it** (with the skip-shim above). Owner: Tal.
      Procedure, still accurate for the re-PUT mechanics:

      1. After ci.yml's first run on a PR, get the exact check names
         (GitHub matches on the job's reported name, not the workflow
         filename): `gh pr checks <PR#>`
      2. Re-PUT the full protection with those names (PATCHing the
         status-checks sub-endpoint 404s while checks are null). Replace
         `"ci"` below with the real name(s), one per job that must gate:

         ```bash
         gh api -X PUT repos/t-bendet/portfolio-project/branches/main/protection \
           --input - <<'EOF'
         {
           "required_status_checks": { "strict": true, "contexts": ["checks", "ci"] },
           "enforce_admins": false,
           "required_pull_request_reviews": { "required_approving_review_count": 0 },
           "restrictions": null,
           "allow_force_pushes": false,
           "allow_deletions": false
         }
         EOF
         ```

      3. Verify: `gh api repos/t-bendet/portfolio-project/branches/main/protection -q '.required_status_checks'`
         (`strict: true` also forces branches to be up to date with main
         before merging.)

- [x] Phase 2 work items carry the three-bullet friction note in the PR
      description (IMPROVEMENTS.md #4 — the mechanism that never happened).
      → First instance in an actual PR description: #2 (2026-07-22). The
      `infra/workshop-cleanup` squash-merge message carried the first one
      before a remote existed.
- [x] Start `docs/research/story-capture.md` on the first Phase 2 work item
      (IMPROVEMENTS.md #5) — started with this cleanup.
- [x] After cleanup: `node scripts/test-machinery.ts &&
      node scripts/validate-workshop.ts && node scripts/validate-adr.ts`
      all green before merging the cleanup PR. *(25 · 0 · 2 skips)*
