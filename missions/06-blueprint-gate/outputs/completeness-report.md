# Completeness Report — Mission 6, Blueprint Gate

Mission 6 · 2026-07-22 · Question: is every Phase 2 prerequisite present, is
the scaffold plan executable as written, is the workflow ready, and what is
still undecided that will block?

Companion to `coherence-report.md` (findings C1–C7 referenced by number).

---

## 1. Mission chain — complete

Every mission M1–M5 is `closed` with an APPROVED `review-verdict.md`,
verified by reading STATUS + verdict frontmatter, not the injected summary.
Every declared output-contract deliverable exists on disk and is
substantive (all files read in full this mission; none is a stub). The
decision record stands at 21 active / 8 superseded, INDEX regenerated,
`validate-adr.ts` full-repo pass green, `test-machinery.ts` 34/0/2.

## 2. Scaffold plan (`phase2-scaffold-plan.md`) — executable, with three standing corrections and a decision list

**Verdict: executable as written for §1–§5 (local scaffold, containers,
workflows), provided the executor also reads the corrections below. §6
(cloud provisioning) is blocked on one undecided input: the domain (§4.1).**

### 2.1 Standing corrections the executor must hold alongside the plan

The plan is a frozen closed-mission output (ADR 0028) and cannot be edited;
these corrections live here and in `gate-verdict.md`:

1. **§2 "sitemap i18n hreflang (Q9)" — DO NOT EXECUTE.** ADR 0023 forbids
   hreflang alternates; configure @astrojs/sitemap *without* its `i18n`
   option. (Coherence C2. Becomes revisitable only if content-model §4.5's
   own-article-in-both-languages case ever lands.)
2. **§0's claim that the mission-gate hook prevents `app/` existing is
   false** — already corrected in `phase2-workflow.md` §9.1 and
   `hooks-plan.md` §7; the CLAUDE.md rule itself is real and expires when
   Phase 2 opens.
3. **CI RTL stage: assertions 2, 3 and 5 are M4 impositions** the plan's §5
   inherits by pointer — the credit assertion must check *states it is a
   translation* + *author and link present* + ***precedes* the article
   body*, plus code-LTR and no-horizontal-overflow (`content-model.md` §5;
   `phase2-workflow.md` §9.2).

### 2.2 Owed scaffold-time verifications — all named, all owned

The §0 verification pass (five items) is intact and `phase2-workflow.md`
§5 assigns it to one parallel `docs-explorer` batch, with §7.1's mandatory
checkpoint on the results before anything installs:

| # | Verification | Why it can change the design |
|---|---|---|
| 1 | Astro 7.x compat ranges (@astrojs/mdx, sitemap, @tailwindcss/vite) | Q9 unconfirmed (npm 403s) |
| 2 | Current `prisma migrate` CI guidance | Q24 flagged unverified |
| 3 | AWS public-IPv4 billing | moves the ADR 0021 budget vs G6's $15 |
| 4 | QEMU arm64 build times | may force paid ARM runners / on-instance builds |
| 5 | Fresh patch pins for every package | plan's versions are 2026-07-21 facts, stale by design |

Plus two verifications owed from M4, not in the plan's §0 list — carried
here so the batch includes them:

| 6 | Caddy `handle_errors` on the `/he/*` prefix serves a second 404 page | `/he/404`'s serving mechanism (`sitemap.md` §11b) — and `not-found.md` additionally requires a **real 404 status** for both error pages from Caddy's static file serving |
| 7 | Whether the glob loader exposes raw `body` at `getStaticPaths` time | decides how the `caseStudy`-vs-empty-body build guard is implemented; must be re-implemented, not dropped, if the first approach fails (ADR 0024) |

### 2.3 Config decisions the scaffold itself must make (specified, not yet valued)

- **`trailingSlash`: pick one form and enforce it** (ADR 0024; sitemap §1
  requires the non-canonical spelling to redirect, never 404).
- **The i18n block**: shape fixed in content-model §5
  (`prefixDefaultLocale: false`, en default, he) — copy it, no decision
  needed.
- **HTTP framework for the API**: Express-5-class, pinned from a lookup at
  run time (architecture-decision §1) — decision rule exists; only the pin
  is open.

## 3. Workflow readiness — ready, with two known soft spots

- **Rules exist and are decided:** tracks, tiered review, cap 2, scope cap
  3 (M6 exempt), branch model, delegation patterns (ADRs 0025–0026,
  `phase2-workflow.md`, `worktree-and-branching.md`).
- **Skills exist:** `review-work` (carries `context: fork`,
  `agent: red-team-reviewer`) and `publish-translation` (the grant's
  ordered conditions incl. the upstream back-link PR). Neither sets
  `disable-model-invocation` — deliberate, so sessions can self-invoke.
- **Enforcement is live and tested:** closed-mission freeze, Phase 2
  protect-workshop split (both phase branches exercised against fixtures),
  settings untouched. Zero escalations required to open Phase 2 — by
  design (ADR 0028 decision 3).
- **Soft spot 1 — the `context: fork` behaviour test has still not run**
  (IMPROVEMENTS #3's caveat, restated in `phase2-workflow.md` §5). Must
  confirm (a) fork truly withholds parent conversation, (b) `agent:`
  resolves a project-defined agent. Until then the reviewer's own
  refuse-if-context-visible rule is what holds the invariant — adequate,
  named, not silent. Cheap to run at Phase 2 open; non-blocking.
- **Soft spot 2 — branch protection is a habit until Tal sets it**
  ("require ci.yml green before merge", GitHub console). Flagged for the
  Phase 2 open checkpoint (`worktree-and-branching.md` §5.4); until then
  nothing mechanical stops a direct push to `main` firing `deploy.yml`.
- **Condition from coherence C1:** the `infra/workshop-cleanup` work item
  (PHASE2-CLEANUP-TODO) may not run until that document's conflict with
  ADRs 0025/0028 is resolved (Tal, checkpoint 1). All *other* Phase 2 work
  is unaffected.

## 4. Undecided items — enumerated, classified by what they block

### 4.1 Blocks cloud provisioning (§6) only

- **The domain.** No document names the domain to be registered/hosted —
  Route 53 §6.1 says "the domain". Choosing (and registering) it is a Tal
  decision; G6 excludes registration cost, so no budget impact. Everything
  local (§1–§5) proceeds without it; Caddy/TLS/DNS need it.

### 4.2 Blocks specific work items, not the scaffold

- **Email address for `/contact/`** — not in the research file; the brief
  requires Tal to confirm it before that page ships (`contact.md` §6).
- **Reaction vocabulary members** — contract fixed (small enum, additive
  via migration, no free text); the members are a copy decision needed
  when the reactions endpoint + article template land.
- **About-page content** — hard launch gate by M4's own rule ("if About
  cannot be written at launch, the site cannot launch"). Tal's copy.
- **Tagline, standing descriptions, all Hebrew strings** — Tal is the
  voice owner; placeholders are binding in structure only.
- **Portrait digitization** → 32px favicon legibility check → ink
  treatment call (ADR 0018's deferred-by-decision items). The favicon is
  launch-required; the portrait can be absent (brief §3 handles it).
- **Admin credential seeding** — procedure decided (seeded row, argon2,
  re-seed by migration); the actual secret is created at provisioning.

### 4.3 Open by design, non-blocking

- **Footer content-licence line** — flagged as Tal's decision
  (`navigation-spec.md` §4.2); ships without one until made.
- **Social-card / OG imagery** — deliberately not decided by M4; must be a
  decision at Phase 2, not a default.
- **Spacing scale** — tokens fix the 4px base grid; the full scale is
  component-spec territory derived from the prototypes at build time.
- **Lazy-loading warm-theme fonts** — optional, constrained (no visible
  swap inside the 600ms transition); count warm as **4 families** when
  sizing it (coherence C3).

## 5. The CI pipeline's full obligation set — compiled

Scattered across five documents; compiled here because `ci.yml` is a
single authored artifact and a missing stage is a silent gap. Sources in
parentheses.

1. `node scripts/test-machinery.ts` — first job (ADR 0028).
2. Typecheck: `tsc --noEmit` (api) + `astro check` (web) (ADR 0021).
3. API tests against ephemeral postgres:18 with `prisma migrate deploy`
   applied first (ADR 0021).
4. Build: `astro build` + both docker images, not pushed on PRs (ADR 0021).
5. Playwright RTL stage, **five** assertions (content-model §5): lang/dir
   on route; credit complete **and states translation** **and precedes
   body**; code panels LTR; screenshot baseline; no horizontal overflow.
6. Contrast gate: `scripts/contrast.ts --pairs` over palette-spec §5's
   tables, **full precision** (thinnest margin 4.50) (ADR 0015).
7. Token parity: both theme blocks' key sets diff empty
   (tokens-reference §4.1).
8. Banned-vocabulary grep over shipped CSS/JS/HTML — **whole identifier
   tokens, not substrings** (tokens-reference §1; `sitemap.xml` and
   `[hidden]` are the recorded non-violations).
9. No-raw-hex lint — tokens only (tokens-reference §4.4).
10. Workflow-lint for the monorepo path filters (ADR 0013's mitigation for
    silently-failing filters).
11. `perf` stage (Lighthouse against budgets) + `bundle` stage — source of
    truth: `performance-budgets.md`, **this mission's deliverable 4**
    (hooks-plan §4.2).
12. `sec` stage (dependency audit + secrets scan) — source of truth:
    `security-requirements.md`, **deliverable 3** (hooks-plan §4.2).

Items 6–10 have no stage assigned in ADR 0021's three-stage description —
they are additional `ci.yml` steps the specs impose. Compiled so the
`infra` track receives one list, not five documents.

## 6. Verdict

**Complete enough to open Phase 2.** Nothing undecided blocks the scaffold
(§1–§5). One decision (domain) gates provisioning; a short list of content
and copy decisions gates individual work items and is correctly owned by
Tal. The two workflow soft spots are named, cheap, and scheduled at Phase 2
open. The gate verdict should carry: the three standing corrections
(§2.1), the two added verifications (§2.2 items 6–7), the C1 condition, and
the compiled CI obligation list (§5) as handoffs.
