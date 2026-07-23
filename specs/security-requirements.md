# Security Requirements — Mission 6, design mode

Mission 6 · 2026-07-22 · `security-review` skill, **design mode** (stated
per the skill: no code exists; this is a threat model plus requirements
that Phase 2 CI checks trace back to, not findings against imaginary code).

Inputs: ADRs 0002, 0012, 0013, 0019, 0020, 0021, 0024;
`architecture.md` §1–6; `scaffold-plan.md`;
`content-model.md` §2, §6; `worktree-and-branching.md` §5.4.

**Calibration, stated up front (per the skill's standing line):** a
portfolio is a low-value target and severities below do not pretend
otherwise. But the site is a public demonstration of Tal's engineering —
sloppy security here is a portfolio bug even where the asset at risk is
small. Requirements are proportionate to *both* facts.

---

## 1. Assets and actors

**Assets, in honest order of value:**

1. The deploy path (GitHub Actions → ECR → EC2): compromise = defacement
   of a site whose whole claim is engineering competence. The highest-value
   target here is reputational.
2. The admin credential/session: grants the dashboard and, transitively,
   nothing else (the admin surface writes nothing to the static site).
3. Data integrity of counts/reactions: public numbers that can embarrass
   if inflated; no confidentiality value.
4. The database contents: view events (key, timestamp, referrer host,
   coarse UA class), reaction counters, sessions, one argon2 hash.
   **Deliberately contains nothing that identifies a visitor** (ADR 0020).
5. The instance itself: a $6/mo box that could be conscripted for someone
   else's workload.

**Actors:** opportunistic scanners and bots (near-certain, constant);
spam/abuse scripts hitting any open POST endpoint (likely); credential
stuffing against `/admin` (likely, low effort); a targeted attacker
(unlikely — nothing here pays for effort). Design for the first three;
do not architect for the fourth beyond what the first three already buy.

## 2. Attack surface inventory (from the architecture, not imagination)

| Surface | Exists because | Exposure |
|---|---|---|
| Static pages via Caddy | ADR 0019 | Read-only files; header hygiene is the whole game |
| Inline theme script + keydown buffer | ADR 0002, tokens.md §2 | Runs on every public page; observes all keystrokes on pages that contain **no input fields** (no forms exist anywhere in the public IA — contact is `mailto:` only) |
| `POST /api/v1/` view-event | ADR 0020(1) | Unauthenticated write, key string + implicit referrer/UA |
| `GET/POST /api/v1/` reactions | ADR 0020(2) | Unauthenticated write against a fixed enum |
| `/admin` + login | ADR 0020(3–4) | The only authenticated surface; sessions in Postgres |
| Caddy reverse proxy seams (`/api/*`, `/admin/*`, `/he/*` handle_errors) | arch §4, sitemap §11b | Misroute = exposure of the api container's internals |
| GitHub Actions workflows + OIDC → ECR/EC2/S3 | ADR 0021 | The deploy path; secrets live here |
| SSH deploy channel to the instance | arch §5 step 7 | Long-lived access credential |
| `pg_dump` backups in S3 | ADR 0021 | Contains sessions + the admin hash |
| Public repo | ADR 0013 | The full trace is the exhibit; also the recon map. Accepted by decision |

Not surface: comments (deferred, ADR 0020), contact form (rejected, ADR
0022/brief), third-party scripts (rejected permanently, ADR 0020).

## 3. Requirements

Numbered for traceability; each names its verification point. "CI `sec`
stage" = the stage `hooks-plan.md` §4.2 defines, whose source of truth is
this document. **Gated review** = ADR 0025 §4.1 (auth, migrations,
containers, workflows, secrets/IAM/DNS are all already Gated classes —
this document adds no new gates, it tells the gates what to check).

### A. The API's unauthenticated write surface

- **SR-1. Every write endpoint is rate-limited.** Login strictest;
  view-events and reactions bounded per-client and globally. In-memory
  rate limiting may use the client IP **transiently**; ADR 0020's "no raw
  IP retention" is a *storage* stance and this distinction is recorded here
  so the rate limiter is not argued away. *(Verify: Gated review of the
  api auth/endpoint item; a load-shaped test is optional, not required.)*
- **SR-2. Reactions validate against the fixed enum** (content-model §6);
  any other value is rejected, never stored. *(Verify: api tests in CI.)*
- **SR-3. Analytics keys are opaque but bounded.** ADR 0024 rule 5 (the
  API never parses keys) is not a licence to store arbitrary input:
  enforce a length cap and charset allowlist, and a bound on total
  distinct keys or rows per window, so an unauthenticated endpoint cannot
  grow unbounded junk rows. Junk that fits the bounds is accepted and
  tolerated — the dashboard is the only consumer and Tal can delete rows.
  *(Verify: api tests; Gated review.)*
- **SR-4. The view-event dedupe approach, when finalized (arch §2), must
  not store raw IP or any stable visitor identifier** — a salted counter,
  coarse time-bucket, or equivalent. This is ADR 0020's privacy stance
  turned into an acceptance test for a design that does not exist yet.
  *(Verify: Gated review of that item, against this line.)*

### B. Admin auth (ADR 0020 decision 4 — already decided; these are the checks)

- **SR-5.** Session cookie httpOnly + Secure + SameSite=Strict; session id
  regenerated at login; sessions expire (absolute TTL — a solo admin needs
  no sliding window); logout deletes the row. *(Verify: api tests + Gated
  review.)*
- **SR-6.** Login: argon2id (or argon2-class per decision), constant-time
  comparison path, rate-limited per SR-1, no user enumeration in error
  responses (trivially satisfied with one identity — keep it true anyway),
  no reset flow (re-seed by migration, as decided). *(Verify: Gated
  review.)*
- **SR-7.** `/admin` responses carry `X-Robots-Tag: noindex` and
  `Cache-Control: no-store`. `robots.txt` disallows `/admin` (sitemap row
  15) — recorded honestly as an indexing control, not a secrecy control;
  the auth is the control. *(Verify: api tests.)*
- **SR-8. CSRF stance:** SameSite=Strict is the primary control and is
  sufficient for a single-admin dashboard with no cross-site consumers; if
  any state-changing admin action is added, it must be POST-only (never
  GET) so Strict actually covers it. *(Verify: Gated review.)*

### C. Proxy, containers, instance

- **SR-9. Caddyfile is default-deny toward the api container:** exactly
  `/api/*` and `/admin/*` proxy; everything else is static files; the
  `handle_errors` `/he/*` matcher serves only the two 404 pages **with
  real 404 status** (not-found.md). A path that reaches the api without
  matching those prefixes is a misconfiguration. *(Verify: Gated review of
  the Caddyfile item + an integration test that unknown paths never reach
  the api.)*
- **SR-10. Security headers on all static responses:**
  `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin` (or stricter), a
  `Content-Security-Policy` compatible with the inline head script —
  hash-based `script-src` (the build is static, so hashes are stable per
  deploy; a nonce has no server to mint it). `frame-ancestors 'none'`.
  The CSP must also cover the beacon's `connect-src` (self only — the API
  is same-origin behind the proxy). *(Verify: CI can assert headers
  against the built container in the RTL/preview stage; Gated review of
  the Caddyfile.)*
- **SR-11. The db container is reachable only on the compose-internal
  network** — no host port mapping in `compose.yaml` (prod); Postgres
  credentials live in the instance-local `.env`, never in the tree
  (scaffold §8). *(Verify: Gated review of compose; CI secrets scan.)*
- **SR-12. Containers run non-root** (already specified for the api image,
  scaffold §4.1); base images pinned by version tag (postgres:18,
  node:24-slim, caddy 2.11-class — exact pins from scaffold-time lookups).
  *(Verify: Gated review of Dockerfiles.)*
- **SR-13. Instance security group: 443/80 open; SSH restricted to Tal's
  source or replaced by SSM** (scaffold §6.2 already offers "key or SSM").
  If SSH: key-only auth, no password auth. *(Verify: at the provisioning
  checkpoint with Tal.)*

### D. Pipeline and cloud (the highest-value surface)

- **SR-14. OIDC trust policy is scoped to this repo AND the `production`
  environment** (ADR 0013/0021 already require this) — the Gated review of
  `deploy.yml` must read the actual trust policy JSON, because "deploys
  correctly and is scoped to every repo in the account" is ADR 0025's own
  named failure case. *(Verify: Gated review, against the policy document,
  not the workflow's claim.)*
- **SR-15. Least privilege per principal:** the deploy role can push to
  the two ECR repos and nothing else; the backup principal can write to
  the backup bucket and nothing else; nothing can read secrets it does not
  use. *(Verify: Gated review of IAM at provisioning.)*
- **SR-16. Deploy secrets live only in the protected `production`
  environment** (ADR 0013); no long-lived AWS keys anywhere; the SSH
  deploy key (if SSH is kept over SSM) is a dedicated key that exists only
  as an environment secret and authorizes only the deploy user. *(Verify:
  Gated review; CI secrets scan.)*
- **SR-17. CI runs a secrets scan on every PR** (the `sec` stage) — the
  tree must never contain a credential; `.env` is instance-local by
  decision. *(Verify: the stage itself; this is its charter.)*
- **SR-18. Branch protection ("require ci.yml green before merge") is
  raised at the Phase 2 open checkpoint** — until set, the deploy gate is
  a habit (`worktree-and-branching.md` §5.4). This document seconds that
  flag as a security requirement, not just workflow hygiene: push-to-main
  is the shortest path from a compromised session to production. *(Verify:
  Tal, console, Phase 2 open.)*
- **SR-19. The S3 backup bucket blocks all public access, uses default
  encryption, and its dumps are treated as sensitive** — they contain the
  sessions table and the admin hash even though they contain no visitor
  data. Restore drill per scaffold §6.7. *(Verify: provisioning
  checkpoint.)*

### E. Supply chain

- **SR-20. Lockfiles committed; every version pinned from a lookup at
  install time** (standing rule, tech-eval / scaffold §8). *(Verify:
  review of the scaffold PR.)*
- **SR-21. Dependency audit in the CI `sec` stage on every PR;** the
  gate policy is: fail on high/critical in production dependencies, warn
  otherwise — proportionate to a solo project; tightening it later is a
  one-line change. *(Verify: the stage itself.)*
- **SR-22. Dependency additions are deliberate:** `app/` adding a
  dependency is already an escalation class in CLAUDE.md; within Phase 2,
  new runtime dependencies in `api` (the only long-running attack surface)
  get named in the PR description. *(Verify: review habit; cheap.)*

### F. The easter egg (ADR 0002) — reviewed because it is a global listener

- **SR-23. The keydown buffer is bounded (fixed max length), compared
  locally, and never transmitted, stored, or logged.** The public site has
  no input fields, so the listener cannot observe credentials today;
  SR-23 keeps that true by construction rather than by circumstance if a
  form ever appears. *(Verify: Gated review — the theme mechanism is
  already a Gated class in ADR 0025.)*
- **SR-24. The incantation's shipped form is decided deliberately** at
  that same Gated review (coherence C7): a plain literal is defensible
  ("discoverable by the attentive" is the feature's register); the
  requirement is only that the choice be made, recorded, and the banned
  identifier vocabulary (tokens.md §1) hold around it either way.

## 4. Data inventory and retention (design-mode statement)

| Data | Where | Identifies a visitor? | Retention stance |
|---|---|---|---|
| View events (key, ts, referrer host, coarse UA class) | Postgres | No (ADR 0020; SR-4 guards the dedupe design) | Indefinite is acceptable at this sensitivity; a pruning window is Tal's option, not a requirement |
| Reactions | Postgres | No — counters | Same |
| Sessions | Postgres | Admin only | TTL per SR-5; rows deleted at logout/expiry |
| Admin identity | Postgres | Tal | One row, argon2 hash |
| Backups | S3 | Same as above | Lifecycle expiry (ADR 0021); SR-19 |
| Contact email | Published on `/contact/` by decision | Tal, deliberately | Public; scraping cost accepted in the brief |
| Server logs (Caddy) | Instance | IPs, transiently | Not first-party analytics (content-model §6 sends 404/broken-link questions here); default rotation; no requirement to ship them anywhere |

## 5. What this model deliberately does not require

Recorded so their absence reads as decisions, not gaps: no WAF/CDN (cost
and complexity out of proportion to actors §1); no image-scanning service
(pinned bases + audit suffice at this scale); no intrusion detection on a
$6 instance (rebuild-from-pipeline is the recovery model — the deploy path
IS the restore path, which is one more reason SR-14–SR-18 are the
requirements that matter most); no 2FA machinery for a single seeded admin
whose credential can be rotated by migration; no security.txt (the contact
brief already rejected it as costume).
