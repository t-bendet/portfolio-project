#!/usr/bin/env bash
# The perf and bundle stages, end to end — ci-obligations.md §10, budgets in
# specs/performance-budgets.md.
#
#   web/tests/run-perf.sh
#
# What it does: install the fixtures into the collections, rebuild web/dist with
# them, measure that dist against §3/§4.1/§4.1a/§5, then take the fixtures back
# out and remove the build.
#
# Why the fixtures: §8 item 4 names /writing/[id]/ and /he/writing/[id]/ among
# the routes to measure, and both collections are empty in the shipping tree.
# §8's own note says the RTL stage's fixture mechanism is the precedent for
# giving this stage something real to measure, and that inventing content is
# not.
#
# Why its own harness rather than a flag on run-e2e.sh: the obligation numbers
# are identifiers, cited from workflow step names and script headers, and a
# budget breach reporting as "RTL stage (ci-obligations §4)" is exactly the
# silent gap the obligation list exists to prevent. It also keeps
# `run-e2e.sh --update-snapshots` from re-running this.
#
# This is the service-free half of §10. The Lighthouse and idle-cost halves land
# with the `perf` stage's browser side and bring the network, the Caddy
# container and a `--bytes-only` flag for this script with them.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

cleanup() {
  node "$ROOT/web/tests/install-fixtures.ts" clean
  # web/dist is a FIXTURE build at this point, and scripts/banned-vocab.ts greps
  # web/dist. A dist left behind here is output that does not ship being read as
  # output that does — so the build goes out with the fixtures that made it.
  rm -rf "$ROOT/web/dist"
}
trap cleanup EXIT

# A previous run that died mid-flight leaves a fixture and a fixture build
# behind; start from the same state either way.
cleanup

node "$ROOT/web/tests/install-fixtures.ts" install
pnpm --dir "$ROOT" --filter web build

# From the root: the gate addresses web/dist and specs/ as bare relative paths,
# the way the four design gates do.
cd "$ROOT"
node scripts/perf-budgets.ts
