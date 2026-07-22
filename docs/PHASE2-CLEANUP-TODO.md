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

- [ ] **When `ci.yml` lands (first infra work item): add it as a required
      status check on `main`'s branch protection** — that completes SR-18
      ("require ci.yml green before merge"). Protection created at Phase 2
      open requires PRs only, because a required check that doesn't exist
      yet would block every merge. Owner: Tal. Procedure:

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
           "required_status_checks": { "strict": true, "contexts": ["ci"] },
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

- [ ] Phase 2 work items carry the three-bullet friction note in the PR
      description (IMPROVEMENTS.md #4 — the mechanism that never happened).
      → First instance: this work item's PR.
- [x] Start `docs/research/story-capture.md` on the first Phase 2 work item
      (IMPROVEMENTS.md #5) — started with this cleanup.
- [x] After cleanup: `node scripts/test-machinery.ts &&
      node scripts/validate-workshop.ts && node scripts/validate-adr.ts`
      all green before merging the cleanup PR. *(25 · 0 · 2 skips)*
