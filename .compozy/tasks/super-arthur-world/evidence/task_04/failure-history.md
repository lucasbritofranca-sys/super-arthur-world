# Nonpassing intermediate evidence

These records are not the final gate. Final files without an intermediate qualifier apply to the frozen source manifest.

- Initial typecheck failed on a narrowed `screen` comparison and fixture route inference; corrected with transition-kind inspection and explicit route typing. No type suppression was introduced.
- `integration-initial-failed.log`: 29/31 passed, exit 1. IT-021 assumed every emitted fact was a block reward; the new actual landing fact is a separate event. The test now counts exactly one actual reward (and checks the consumed block), exact bonus amount and one message independently. IT-023 lost its page execution context while source edits caused Vite HMR. Subsequent complete serial 31-test runs passed after source stabilization. No retry or skipped test was added.
- A real independent same-tick pickup/exit probe demonstrated stale saved form; recorded as reviews-002/issue_001.md. Production ExitEvent now carries the actual eligible simulation run, validates it and overlays the reducer's current counters. Independent large/gliding+coin100 probes and regressions for acquisition and post-checkpoint damage pass.
- One unit run exited 1 with 86/87 passing because the new regression used nonexistent `enemy:walker`. The level validator correctly rejected it. Corrected to the actual `enemy:patrol` family; the regression now genuinely damages a large Arthur after the checkpoint and verifies small form at exit, persistence intent and reopen. The final full unit suite passes 87/87.

Build still reports the existing engine chunk above the default 500 kB warning threshold; no threshold override conceals it. Playwright's forced-color environment warns about NO_COLOR. Both are disclosed in the final verification report and are separate from gameplay failures.
