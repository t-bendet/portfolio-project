#!/usr/bin/env bash
# PreToolUse gate on `gh pr create`.
#
# specs/build-status.md records mutable build state and its header carries the
# rule: it is updated in the PR that changes what it records. Nothing enforced
# that, so PRs landed work and left the status page stale. This blocks the PR
# when the branch changes a tracked area and never touches the file.
#
# It cannot tell a complete update from a partial one — that stays on the author.
set -uo pipefail

# The command check lives here rather than in the hook's `if` filter: a filter
# pattern that is slightly wrong fails silent, and a gate that never fires is
# worse than no gate.
cmd=$(jq -r '.tool_input.command // empty' 2>/dev/null) || exit 0
printf '%s' "$cmd" | grep -qE '(^|[;&|]|&&)[[:space:]]*gh[[:space:]]+pr[[:space:]]+create\b' || exit 0

base=${BUILD_STATUS_GATE_BASE:-main}
git rev-parse --verify --quiet "$base" >/dev/null 2>&1 ||
  base=origin/main
git rev-parse --verify --quiet "$base" >/dev/null 2>&1 || exit 0

changed=$(git diff --name-only "$base...HEAD" 2>/dev/null) || exit 0
[ -n "$changed" ] || exit 0

tracked=$(printf '%s\n' "$changed" |
  grep -E '^(web/|api/|deploy/|\.github/workflows/)') || true
[ -n "$tracked" ] || exit 0

printf '%s\n' "$changed" | grep -qx 'specs/build-status.md' && exit 0

count=$(printf '%s\n' "$tracked" | wc -l | tr -d ' ')
reason="Blocked: this branch changes ${count} file(s) under web/, api/, deploy/, or .github/workflows/ but does not touch specs/build-status.md.

That file records what is built; its header states it is updated in the PR that changes what it records. Re-read it and update whichever of these the branch moved: the routes table (§1), the API table (§2), the CI obligations checklist (§3), the cloud section (§4), and the 'Last checked' commit on line 3.

If this PR genuinely changes nothing that file records, say so and the block can be overridden."

jq -n --arg r "$reason" '{
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "deny",
    permissionDecisionReason: $r
  }
}'
