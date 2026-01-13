# AGENTS

PAUSED: false
BRANCH: copilot/setup-ralph-loop
MAX_FAILURE_RETRIES: 3

## Loop contract
- Read `scripts/ralph/prd.json` (task truth) and `scripts/ralph/progress.txt` (patterns) first.
- Stop immediately if `PAUSED` is true.
- Work on exactly one story: pick the first story with `status: "todo"` and set it to `"doing"` before edits.
- Keep commits tiny; prefer docs-only changes unless code is required.
- Never add dependencies unless a story demands it.
- Persistent memory lives only in repo files + git history.

## Execution checklist
1) Ensure you are on BRANCH.
2) Load state files: `prd.json`, `progress.txt`, `constraints.json`, `failure.json`.
3) Implement the selected story with minimal diff.
4) Run verification commands listed by the story; if none are listed, keep the change docs-only.
5) Run guard: `bash scripts/ralph/guard.sh scripts/ralph/constraints.json`.
6) If guard passes, mark the story `"done"`, reset `consecutiveFailures` to 0 in `failure.json`, and append learnings to `progress.txt`.
7) If anything fails, increment `consecutiveFailures` + metadata in `failure.json`. When `consecutiveFailures` ≥ MAX_FAILURE_RETRIES, set `PAUSED: true` and stop.
8) Commit + push using PAT (see secrets) only when green.

## Files that must exist
- scripts/ralph/prd.json
- scripts/ralph/progress.txt
- scripts/ralph/constraints.json
- scripts/ralph/failure.json
- .opencode/opencode.json

## Guardrails
- Never commit secrets or tokens.
- Only change what the story requires.
- One iteration = one story; no batching.

## Secrets for CI (GitHub)
- `RALPH_PAT` or `RALPH_GITHUB_PAT`: Personal access token with repo scope for checkout/push.
