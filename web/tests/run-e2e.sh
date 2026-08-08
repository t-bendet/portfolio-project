#!/usr/bin/env bash
# The RTL stage, end to end — the same command locally and in CI, which is the
# only reason a checked-in screenshot baseline can be trusted.
#
#   web/tests/run-e2e.sh                      run the suite
#   web/tests/run-e2e.sh --update-snapshots   regenerate the baseline
#
# What it does: install the fixtures into the collections, rebuild web/dist
# with them, serve that dist through the real deploy/Caddyfile in a pinned
# Caddy container, run the suite from the pinned Playwright container on the
# same docker network, then take the fixtures back out again.
#
# Both images are pinned, and the Playwright image tag must match
# web/package.json's @playwright/test exactly — the browser build and the
# client are one artifact, and a mismatch shows up as a baseline that differs
# by a few pixels rather than as an error.
#
# The port, network and container names below are allocated in
# specs/ci-obligations.md's "Local harnesses" table, which is where a new
# harness goes to find a free port rather than reading this file and two others.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PLAYWRIGHT_IMAGE='mcr.microsoft.com/playwright:v1.62.1-noble'
CADDY_IMAGE='caddy:2.11.4'
NETWORK='portfolio-e2e'
WEB_CONTAINER='portfolio-e2e-web'
PORT=8080

cleanup() {
  docker rm -f "$WEB_CONTAINER" >/dev/null 2>&1 || true
  docker network rm "$NETWORK" >/dev/null 2>&1 || true
  node "$ROOT/web/tests/install-fixtures.ts" clean
  # The fixture goes, and so does the build that contains it: web/dist is a
  # fixture build by the time this runs, and scripts/banned-vocab.ts greps
  # web/dist. Leaving it behind is output that does not ship being read as
  # output that does. (web/tests/run-perf.sh does the same, for the same
  # reason.)
  rm -rf "$ROOT/web/dist"
}
trap cleanup EXIT

# A previous run that died mid-flight leaves the network, the container, and a
# fixture behind; start from the same state either way.
cleanup

node "$ROOT/web/tests/install-fixtures.ts" install
pnpm --dir "$ROOT" --filter web build

docker network create "$NETWORK" >/dev/null

# `web` is the hostname playwright.config.ts's baseURL uses. The Caddyfile is
# mounted verbatim: the point of this stage is that the error handling under
# test is the deployed one, not a test double.
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
# resolve inside the container. Browsers come from the image
# (PLAYWRIGHT_BROWSERS_PATH is set there), never from the host.
docker run --rm \
  --network "$NETWORK" \
  --volume "$ROOT:/work" \
  --workdir /work/web \
  --env CI \
  "$PLAYWRIGHT_IMAGE" \
  npx playwright test "$@"
