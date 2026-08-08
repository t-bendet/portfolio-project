#!/usr/bin/env bash
# scripts/check.sh — the local half of ci.yml.
#
# Membership rule, and the only rule: a check belongs here if it needs no
# services — no Docker daemon, no Postgres, no network. That boundary is
# ci.yml's own ("The design gates need neither the build nor the database"),
# which makes this file a subset by construction rather than a copy of a step
# list that would drift out of agreement in silence.
#
#   scripts/check.sh        all — gates, typechecks, then build + vocabulary
#   scripts/check.sh fast   the tight loop: gates + typechecks, no build
#
# Deliberately not here, and where each lives instead:
#   SR-17 secrets, SR-21 audit    scripts/sec.sh          (docker + network)
#   api tests                     ci.yml                  (postgres service)
#   image builds, caddy validate  ci.yml                  (docker)
#   the RTL stage                 web/tests/run-e2e.sh
#   §10 Lighthouse, idle cost     web/tests/run-perf.sh   (docker)
#
# Unlike sec.sh this cds to the root. The four gate scripts address their
# inputs as bare relative paths ('web/dist', 'specs/design/palette.md'), so
# they resolve against cwd and agree with CI only from the repo root.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

what="${1:-all}"
case "$what" in
  all | fast) ;;
  *)
    echo "usage: scripts/check.sh [all|fast]" >&2
    exit 2
    ;;
esac

# CI stops at the first red step, which locally would mean one fix per run.
# This collects and reports at the end instead: stricter in what it runs, never
# laxer in what it accepts. A plain string rather than an array — macOS still
# ships bash 3.2, where `${#arr[@]}` on an empty array trips `set -u`.
failed=''
run() {
  local name="$1"
  shift
  printf '\n── %s\n' "$name"
  if "$@"; then return 0; fi
  failed="${failed}  ${name}"$'\n'
}

run 'token parity (ci-obligations §6)' node scripts/token-parity.ts
run 'no raw hex (ci-obligations §8)' node scripts/no-raw-hex.ts
run 'contrast (ci-obligations §5)' node scripts/contrast.ts
run 'typecheck api' pnpm --filter api typecheck
run 'typecheck web' pnpm --filter web exec astro check

if [ "$what" = all ]; then
  # Not optional before the vocabulary gate: banned-vocab.ts greps web/dist,
  # and a dist left from an earlier tree passes on output that no longer
  # ships. A missing dist that script reports; a stale one it cannot see.
  run 'build web' pnpm --filter web build
  run 'banned vocabulary (ci-obligations §7)' node scripts/banned-vocab.ts
  # Last, and never before the vocabulary gate: this rebuilds web/dist with the
  # fixtures installed, which is a dist that must not be grepped for what ships.
  # It removes that build on the way out, so `check.sh all` now leaves no dist
  # behind at all — a missing one the next run rebuilds, a fixture one it could
  # not tell from the real thing.
  run 'perf budgets (ci-obligations §10)' web/tests/run-perf.sh
fi

if [ -n "$failed" ]; then
  printf '\nfailed:\n%s' "$failed" >&2
  exit 1
fi

printf '\nall green — ci.yml'"'"'s service-free subset, not ci.yml\n'
