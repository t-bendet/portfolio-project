---
id: 0012
title: The portfolio must genuinely showcase SQL, Docker, from-scratch CI/CD, and cloud deployment
status: active
date: 2026-07-20
decided-by: tal
reopened-by: null
superseded-by: null
---

## Context
The portfolio is also proof of capability. Tal requires these incorporated as
demonstrated skills, not incidental tooling.

## Decision
The architecture must include: (a) SQL — a real database with a reason to exist,
(b) Docker — containerized dev and/or deploy, (c) CI/CD — a pipeline built from
scratch, not a copied template, (d) deployment to AWS or an equivalent cloud
provider.

## Consequences
This materially changes the Mission 3 evaluation: a purely static host
(the original Vercel/Netlify target) cannot satisfy (a)–(d) alone. Mission 3
must design where the dynamic boundary sits and must not fake it (e.g., a
database bolted on with no honest purpose fails the "genuinely" test).
