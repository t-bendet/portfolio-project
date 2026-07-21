---
id: 0002
title: Jekyll/Hyde duality shipped as the hidden Marauder's Map easter egg
status: active
date: 2026-07-20
decided-by: pre-workshop
reopened-by: null
superseded-by: null
---

## Context
The Jekyll & Hyde duality (order-oriented vs experimentative) needed expression
without splitting the site into two visibly different designs.

## Decision
One dark design for all visitors. Typing `i solemnly swear that i am up to no good`
anywhere transforms the site to a warm editorial theme; `mischief managed` reverts.
No labels, no hints. Global keydown buffer → `data-theme` on `<html>` → localStorage
persistence → 600ms transition. Console logs on toggle.

## Consequences
Requires two full themes (see 0004, 0005 — currently reopened; the MECHANISM here
is active even while the palettes are re-decided). Mission 1 must either defend
this ADR against the Greek mythology direction or formally reopen it — silence is
not an option (reconciliation clause in M1's contract).

## Alternatives rejected
Dual design visible to all (reads as two sites); Jekyll/Hyde as split sections
(confusing without explanation).
