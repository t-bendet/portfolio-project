#!/usr/bin/env bash
# The perf and bundle stages, end to end — ci-obligations.md §10, budgets in
# specs/performance-budgets.md.
#
#   web/tests/run-perf.sh               all three halves
#   web/tests/run-perf.sh --bytes-only  the byte and bundle gate alone, no docker
#
# What it does: install the fixtures into the collections, rebuild web/dist with
# them, measure that dist against §3/§3.1/§4.1/§4.1a/§5, serve it through the
# real deploy/Caddyfile and run Lighthouse (§2) and the idle-cost check (§3)
# against it, then take the fixtures back out and remove the build.
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
# Its own network, port and container rather than sharing run-e2e.sh's: two
# harnesses on one docker network is a race the day someone runs both at once.
# The allocation lives in specs/ci-obligations.md's "Local harnesses" table —
# this comment used to name the one neighbouring port it happened to know about,
# which is not the same as there being a list.
#
# Both images are the ones the RTL stage has already pulled, and `lighthouse` is
# a devDependency of web/ — so the browser side of §10 adds no action to
# allowlist and downloads no browser.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PLAYWRIGHT_IMAGE='mcr.microsoft.com/playwright:v1.62.1-noble'   # == web/package.json @playwright/test
CADDY_IMAGE='caddy:2.11.4'
NETWORK='portfolio-perf'
WEB_CONTAINER='portfolio-perf-web'
PORT=8082

BYTES_ONLY=''
case "${1:-}" in
  '') ;;
  --bytes-only) BYTES_ONLY=1 ;;
  *)
    echo "usage: web/tests/run-perf.sh [--bytes-only]" >&2
    exit 2
    ;;
esac

cleanup() {
  if [ -z "$BYTES_ONLY" ]; then
    docker rm -f "$WEB_CONTAINER" >/dev/null 2>&1 || true
    docker network rm "$NETWORK" >/dev/null 2>&1 || true
  fi
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
# the way the four design gates do. Bytes first, because a budget breach should
# cost two hundred milliseconds rather than a container start.
cd "$ROOT"
node scripts/perf-budgets.ts

if [ -n "$BYTES_ONLY" ]; then
  exit 0
fi

docker network create "$NETWORK" >/dev/null

# `web` is the hostname both playwright.perf.config.ts and lighthouse.ts default
# to. The Caddyfile is mounted verbatim: measuring anything else would be
# measuring a test double's compression and headers.
docker run -d --rm \
  --name "$WEB_CONTAINER" \
  --network "$NETWORK" \
  --network-alias web \
  --publish "127.0.0.1:$PORT:80" \
  --volume "$ROOT/deploy/Caddyfile:/etc/caddy/Caddyfile:ro" \
  --volume "$ROOT/web/dist:/srv:ro" \
  "$CADDY_IMAGE" >/dev/null

ready=''
for _ in $(seq 1 30); do
  if curl -fsS -o /dev/null "http://127.0.0.1:$PORT/" 2>/dev/null; then ready=1; break; fi
  sleep 1
done
if [ -z "$ready" ]; then
  echo "caddy did not come up on 127.0.0.1:$PORT" >&2
  docker logs "$WEB_CONTAINER" >&2 || true
  exit 1
fi

# The whole workspace is mounted so pnpm's relative node_modules symlinks
# resolve inside the container, exactly as in run-e2e.sh.
docker run --rm \
  --network "$NETWORK" \
  --volume "$ROOT:/work" \
  --workdir /work/web \
  --env CI \
  --env PERF_RUNS \
  "$PLAYWRIGHT_IMAGE" \
  node tests/perf/lighthouse.ts

docker run --rm \
  --network "$NETWORK" \
  --volume "$ROOT:/work" \
  --workdir /work/web \
  --env CI \
  "$PLAYWRIGHT_IMAGE" \
  npx playwright test --config playwright.perf.config.ts
