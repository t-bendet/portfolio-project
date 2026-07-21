---
id: 0020
title: Dynamic layer scope — first-party analytics, reactions, private admin dashboard; comments deferred but designed for
status: active
date: 2026-07-21
decided-by: tal
mission: mission-3
reopened-by: null
superseded-by: null
---

## Context

ADR 0012 demands SQL with an honest reason to exist — "genuinely" is a
test, and Mission 3's gate G3 (requirements-and-weights.md) formalized it:
delete the database and something observable must break. The evaluation's
base capability (first-party view analytics + per-article reactions) passed
that test. At checkpoint 2 (2026-07-21) Tal approved the base capability
and amended the scope: a private admin dashboard is in scope now, widening
the SQL showcase to real queries and aggregation over his own data; comments
are deferred but must not be foreclosed.

## Decision

The dynamic layer (the hand-built API of ADR 0019) does exactly this:

1. **First-party view analytics** — the site embeds no third-party
   tracker; view events (article/path, timestamp, referrer host, coarse
   UA class) are stored in Postgres. Privacy stance: no raw IP retention;
   nothing stored identifies a visitor.
2. **Per-article reactions** — runtime visitor writes, shown on article
   pages via progressive enhancement.
3. **Private admin dashboard** — server-rendered at `/admin` by the API,
   where Tal reads aggregations (per-article, per-day, per-referrer,
   per-language) of his own data.
4. **Admin auth: server-side sessions, not JWT** — httpOnly / Secure /
   SameSite=Strict cookie backed by a Postgres `sessions` table; single
   seeded admin identity, argon2-class hash, rate-limited login, no reset
   flow.
5. **Comments: deferred, designed-for** — stable article ids, versioned
   `/api/v1/` prefix, and additive Prisma migrations guarantee comments can
   land later as new tables and endpoints without reshaping anything. The
   feature itself — rendering, threading, and above all the
   moderation/abuse surface — is NOT designed now and gets its own honest
   cost analysis when it lands (Phase 2+).

## Consequences

- The G3 deletion test now cuts deeper: removing the database breaks
  visitor-visible counts/reactions, Tal's analytics, AND the admin login
  itself. The SQL showcase includes schema design, migrations, runtime
  writes, aggregation queries, and a UI over them.
- Operational surface added and accepted: an authenticated endpoint on the
  public internet (rate limiting and session hygiene are requirements, and
  Phase 2 CI's security-review runs in code mode against it).
- The static core is untouched by all of this — public pages survive the
  entire dynamic layer dying (ADR 0019).
- Mission 4 should account for where counts/reactions appear on article
  pages; the admin dashboard is outside Mission 4's public IA (it is a
  private tool, not a site page).
- When comments land, this ADR does not authorize them silently — their
  scope, moderation cost, and abuse handling get a new ADR then.

## Alternatives rejected

- **JWT auth for the admin.** Tal has real JWT experience (about-tal.md,
  Audiophile), which is exactly why choosing it here would be
  resume-driven: statelessness and cross-service tokens solve problems a
  one-admin, one-instance system does not have, while adding refresh/
  rotation machinery and a bigger surface to get wrong. Sessions give
  row-delete revocation and make the sessions table honest SQL. The JWT
  competence is already publicly demonstrated elsewhere.
- **Third-party analytics (hosted or script-embed).** Rejected on both
  principle and architecture: it contradicts the no-tracker stance, and it
  would hollow out the database's reason to exist — failing ADR 0012's
  "genuinely" test.
- **Building comments now.** Rejected as scope creep against the
  maintenance budget (R4): the true cost of comments is moderation and
  abuse handling, which cannot be honestly priced while the site has no
  audience yet. Designing headroom costs almost nothing; building the
  feature now costs real ongoing attention.
- **No admin dashboard (base capability only).** Rejected by Tal at
  checkpoint 2: it left the SQL showcase thin — writes without queries.
  The dashboard adds aggregation and a real consumer of the data at small,
  bounded cost.
