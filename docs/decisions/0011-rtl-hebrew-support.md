---
id: 0011
title: RTL/Hebrew rendering is a hard design and IA constraint
status: active
date: 2026-07-20
decided-by: workshop-bootstrap
reopened-by: null
superseded-by: null
---

## Context
Translated articles are Hebrew. With palettes and IA reopened, this requirement
risked silently falling out of scope. Seeded as an explicit constraint.

## Decision
All design-system and IA decisions must account for RTL: typography choices must
have Hebrew-capable companions or fallbacks, layouts must not break under
dir="rtl", and translated post pages render RTL with original-author credit.

## Consequences
Mission 2 must verify font choices against Hebrew glyph coverage. Mission 4 must
specify RTL behavior in the content model. Phase 2 CI should include an RTL
rendering check.
