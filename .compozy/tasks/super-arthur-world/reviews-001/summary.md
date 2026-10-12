# Task 03 independent review — round 001

Reviewer: native Codex subagent. Initial frozen review date: 2026-10-12.

Initial recommendation: **Needs fixes before merge**. Three high-severity correctness issues were reproduced using production TerrainSimulation/validation through Vite SSR; both reproduction commands exited zero. No core outcomes were mocked. Issue 002 arranges the real runtime fleeing actor before actual stepping, matching a mount that has fallen below Arthur.

| Issue | Severity | Finding |
|---|---|---|
| [001](issue_001.md) | high | Reserve item starts inside a low ceiling and falling ignores crushed collision |
| [002](issue_002.md) | high | Horizontal-only flee recovery teleports a vertically distant mount |
| [003](issue_003.md) | high | Throwable boss accepts a dispenser whose objects cannot damage it |
| [004](issue_004.md) | high | Damaging contact publishes flight after losing its only power source |
| [005](issue_005.md) | high | Carried continuation body restores at stale spawn inside the floor |

The review reread canonical task 03, PRD M-06–M-13, relevant stories/tests, mechanics source and integration fixtures. The earlier carry-transfer, flee reversal, fence mask, tongue immunity, platform ordering, flight recovery, ammunition parameter and isolated block-test findings were addressed before this round. Canonical IT-021 now supplies real Simulation inputs; IT-028 observes actual ammunition replacement. Frozen desktop/mobile images were opened and inspected: mechanic readouts and controls are visible with a restrained test palette and no mobile horizontal overflow. These are geometric test assets; final art/device/release evidence remains later task scope.

The implementer has triaged all three issues VALID and supplied fixes and regressions. This document does not declare those fixes independently verified. Final closure requires rereproducing the original failures on the next frozen fingerprint, reading fresh gate evidence, and independent root approval. No source changes or commits were made by this reviewer. Review metadata identifies Codex honestly rather than retaining the upstream Claude runtime label.

Follow-up independent SSR on the post-001–003 repair tree, 2026-10-12T12:41:03Z, exit 0: reserve body y128 is clear of the ceiling; vertically separated mount remains unowned at y350.25; key replenishment returns `incompatible_ammunition`. The same run confirmed issue 004, initially suspected by the implementer: damaging gliding Arthur produces small form with mode flight and flight glide on that tick. Recommendation remains **Needs fixes before merge** until 004 is repaired and the final frozen gates and regressions are independently checked.

Next follow-up independently confirms 004 repaired: form-only and mount-only harm yield air/none immediately; a surviving gliding form retains legitimate flight after mount loss. Restored ridden mount pose follows the actual solver anchor for 30 ticks. However, issue 005 reproduces on frozen manifest `754a628c0ebc22cc23d8e37af5a62f4bb6df0ab4821ce528f250f52ed8edee03`: a carried spring starts at `(48,160)` embedded in the floor for both constructor anchor400 and restart anchor500. The initial-view defect remains a correctness blocker even though next-tick attachment repairs it. No additional heavy gates ran while the implementer owned serial browser execution.

## Final independent disposition

**PASS for the affected task-03 slice; clean after remediation.** The five recorded findings were independently rereproduced after fixes and no remaining actionable issue was identified within the mechanical slice. Issue 005 now publishes the spring at `(404,144)` for constructor anchor400 and `(504,144)` for restart anchor500, with `embedded:false` in both cases; SSR command exit 0. Readback confirms immediate carried/mouth synchronization and genuine constructor/restart/12-tick-transfer regression coverage. Issue statuses remain `valid` for the native root's closure; this reviewer did not implement changes or commit.

VERIFICATION REPORT
-------------------
Claim: Independent task-03 review accepts the repaired affected slice; full campaign/release readiness is not claimed.
Command: Read fresh typecheck/lint/unit/integration/build logs; recompute all 70 entries in `evidence/task_03/source-sha256.txt` using Get-FileHash; independent original-failure Vite SSR reproductions.
Executed: 2026-10-12 after the last repair; fingerprint-keyed gate evidence from 10:17–10:19 local time.
Exit code: 0 for independent reads/fingerprint/reproductions and all recorded gate commands. Production bridge search exit 1 means no matches, as intended.
Output summary: Manifest SHA256 `954ceb86282819724e0d39a15c1be8123b824975629a219c20d89d691d5a0055`; 70 files, zero mismatches. Types pass; lint 51 files pass; 65/65 unit tests in 8 files; Chromium 25/25 using explicit workers=1, 1.4m; build 36 modules, 1.89s, JS gzip 378.36kB.
Warnings: Existing browser NO_COLOR/FORCE_COLOR advisory, Vitest isolation suggestion, Vite chunk-size advisory; no suppression or release-performance claim.
Errors: No remaining reproduced blocker in reviewed task-03 scope.
Contract parity: PASS for canonical 27 assigned cases, M-06–M-13 mechanics, applicable stories/edge cases and single simulation authority. Lifecycle coverage also verifies baby/berries, wings, float and restored possession. Full authored content/balancing and campaign durability remain later owners.
Visual contract: n/a — no named normative reference. Actual desktop/mobile fixture PNGs inspected; final art and physical-device release checks remain later tasks.
QA impact: Mechanical scenario stays flagged for the dedicated full-game QA phase; task-scoped real browser integration evidence reviewed.
Verdict: PASS for this intermediate affected slice only.
