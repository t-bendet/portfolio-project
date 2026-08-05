#!/usr/bin/env bash
# ci-obligations.md §11 — the `sec` stage. Two checks with two different
# charters, both from security-requirements.md:
#
#   SR-17  the tree must never contain a credential
#   SR-21  fail on high/critical in PRODUCTION dependencies, warn otherwise
#
#   scripts/sec.sh            both, which is what to run locally
#   scripts/sec.sh secrets    SR-17 only
#   scripts/sec.sh deps       SR-21 only
#
# The halves are separable because CI runs them from different workflows, and
# that split is itself a requirement rather than a convenience — see sec.yml.
#
# gitleaks comes as a pinned docker image rather than the action: repo settings
# allow only github-owned actions, and an image sidesteps the allowlist
# entirely — the same reasoning behind the Caddy and Playwright images in the
# RTL stage.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GITLEAKS_IMAGE='ghcr.io/gitleaks/gitleaks:v8.30.1'

what="${1:-all}"
case "$what" in
  all | secrets | deps) ;;
  *)
    echo "usage: scripts/sec.sh [all|secrets|deps]" >&2
    exit 2
    ;;
esac

if [ "$what" = all ] || [ "$what" = secrets ]; then
  # SR-17. The working tree, not the history: `.env` is instance-local by
  # decision and nothing else should ever carry a credential, so what is
  # *here* is the question — and on a PR the checkout is shallow anyway, which
  # makes a history scan one that quietly examines almost nothing. --redact
  # keeps a finding out of a public repo's build log; the log says where, not
  # what. gitleaks' default allowlist already skips node_modules, .git and
  # binaries.
  echo '── secrets scan (SR-17) ─────────────────────────────────────────────'
  docker run --rm --volume "$ROOT:/repo:ro" "$GITLEAKS_IMAGE" \
    dir /repo --no-banner --redact
fi

if [ "$what" = all ] || [ "$what" = deps ]; then
  # SR-21, warn half. Everything, every severity, never fails the build — it is
  # here so the gate below has context above it in the log rather than firing
  # into silence. It runs first for that reason: the gate is what stops the run.
  echo '── dependency audit, full (SR-21, advisory) ─────────────────────────'
  pnpm -C "$ROOT" audit || true

  # SR-21, gate half. Production dependencies only. Note that `@prisma/client`
  # is one and pulls the whole prisma CLI behind it, so this reaches further
  # than an api/package.json read suggests — see pnpm-workspace.yaml's
  # overrides, both of which exist because of that chain.
  #
  # Deliberately no --ignore-registry-errors: a security gate that passes
  # because it could not reach the registry is worse than a red run you
  # re-trigger.
  echo '── dependency audit, production gate (SR-21) ────────────────────────'
  pnpm -C "$ROOT" audit --prod --audit-level high
fi
