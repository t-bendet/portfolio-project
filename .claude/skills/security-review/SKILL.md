---
name: security-review
description: Dual-mode security review — design mode (threat-model the blueprint ADRs, used by Mission 6) and code mode (audit checklist for Phase 2 CI). State which mode you are in before starting.
---

# Security Review

## Design mode (no code exists — Mission 6)
Input: all active ADRs. Output: a threat model + requirements doc, NOT findings
against imaginary code.
- Attack surface implied by the architecture (forms? auth? DB access paths?
  the easter-egg keydown listener? comment/contact endpoints?)
- Data inventory: what personal data exists (contact info, analytics), where it
  lives per the SQL design, retention stance
- Secrets strategy for CI/CD and cloud deploy (ADR 0012): where credentials
  live, how the from-scratch pipeline gets them without leaking
- Supply chain stance: dependency policy, lockfile discipline
- Deliverable: security-requirements.md that Phase 2 CI checks trace back to

## Code mode (Phase 2 CI)
- Dependency audit (npm audit or equivalent), secrets scan on every commit
- Injection review anywhere SQL meets user input; headers/CSP for the site
- Auth review if any authenticated surface exists
- Each finding: severity, location, concrete fix — no vague "consider hardening"

## Both modes
Honest severity. A portfolio is a low-value target; do not inflate. But it IS a
public demonstration of Tal's engineering — sloppy security is a portfolio bug.
