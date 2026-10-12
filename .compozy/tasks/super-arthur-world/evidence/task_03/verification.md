# Task 03 verification

VERIFICATION REPORT
-------------------
Claim: Task 03's mechanical slice is implemented and its affected gates and independent review pass on the final source fingerprint. This is not final campaign/release eligibility.
Command: `pnpm typecheck`; `pnpm lint`; `pnpm test`; `pnpm test:integration --workers=1`; `pnpm build`; `rg -n '__SAW_QA__|manualSimulation|hardwareOverride|phaserInstances' dist/assets`.
Executed: 2026-10-12 America/Sao_Paulo. Final sequential gates ran 10:17–10:19 after all production/test corrections. Source manifest: 70 files, SHA256 `954ceb86282819724e0d39a15c1be8123b824975629a219c20d89d691d5a0055`.
Exit code: 0 for types/lint/unit/browser/build; rg exit 1 is expected for no production bridge markers.
Output summary: `$ tsc --noEmit`; `PASS: 51 TypeScript files; no any/debugger/suppression; pure-core boundaries valid`; `Test Files 8 passed (8)`, `Tests 65 passed (65)`; Chromium `25 passed (1.4m)` with one worker; Vite `36 modules transformed`, build 1.89s, JS 1,442.88kB raw / 378.36kB gzip. Exact stdout retained in sibling logs; production-bridge.log records no QA markers.
Warnings: Browser runner NO_COLOR/FORCE_COLOR environment advisory; Phaser-containing production chunk exceeds Vite's 500kB advisory. Neither final content/device performance nor cross-browser release readiness is claimed. Vitest emitted an isolation performance suggestion; no suppression/config change was made.
Errors: none in the final affected pipeline. Earlier concrete failures are recorded below.
Contract parity: PASS. All 12 assigned unit cases and 15 assigned browser integrations are implemented against `_tests.md`; `task_03.md`, PRD M-06–M-13, US-012–US-021, `_reference_inventory.md`, TechSpec and ADR-001/002/004/007 compared. Growth-item reserve interpretation is explicitly resolved by IT-014 over broad prose, in `docs/qa/mechanics-contract.md`. Native independent review accepts the slice in `reviews-001/summary.md`, independently checking every manifest entry and the five original failure reproductions.
Visual contract: n/a — no named normative screenshot. Frozen desktop and 390×844 mobile screenshots opened and inspected: actual Arthur/form readout and controls visible, muted colors, no horizontal mobile overflow. Geometric fixture graphics are temporary original test art, not final task-06 pixel artwork.
QA impact: New content-addressed mechanics scenario is deliberately untested for the dedicated full-game QA phase; affected desktop keyboard/mobile touch harness walks passed here. Native independent final review PASS; root's optional complementary CUA inspection remains available.
Verdict: PASS for this intermediate task's implemented mechanical slice; full candidate/release gates remain with the planned owners.

## Source and environment

Parent baseline is task-02 commit `7cef6a6`. This task performs no staging/commit. Node 24.19.0, pnpm 11.25.0, locked Phaser 4.2.1, TypeScript 7.0.2, Vite 8.3.4, Vitest 5.0.3, Playwright 1.64.0. Chromium is the currently installed Playwright browser; physical phone/gamepad and Firefox/WebKit remain release QA scope.

`source-sha256.txt` fingerprints source/config/tests/README/licenses/QA documents, excluding evidence/logs/generated files. Recompute after any substantive change; commits alone do not alter content hashes. Screenshots are frozen copies from Playwright testInfo.outputPath under ignored test-results; later runs must not overwrite task-01/02/03 frozen evidence.

## Meaningful cases and regression coverage

- Canonical unit IDs: UT-015/016/017/018/019/020/021/022/023/024/028/029.
- Canonical browser IDs: IT-009/010/012/014/015/016/017/018/019/020/021/025/026/027/028.
- IT-021 uses actual Simulation jump, grab, bounce and spin inputs for eight block families. IT-025 exercises 80 real EnemySystem attack/family rows against independent expected responses. IT-027's pilot supplies input commands to each of ten actual encounters and staged final controller, without mutating bosses/health. Its generous timed invincibility isolates hit-method mechanics; this proves attack/controller behavior, not final encounter balancing. IT-028 observes actual ammunition loss and a single dispenser replacement before victory.
- Unit edge cases may arrange real runtime flight/HP state through a test-only structural cast; no system/event/collision outcome is replaced. UT-029 verifies an actual boss final hit resolves but only Arthur death is emitted, and restart recreates the boss.
- Added regressions cover carry-forbidden transfers; power/used-block revisit memory versus fresh checkpoint restart; persistent flee wall reversal; fence-side immunity; immune tongue body harm; twelve-tick dive recovery; current-phase moving surfaces for enemies/objects; low-ceiling deferred growth; powered/mounted full-view replay equality at 30/60/120 render FPS.
- Additional lifecycle cases cover five-berry baby growth, actual wings bonus transfer, timed float steering/pause/expiry, combined mount/shell abilities and initial constructor/restart/transfer views at non-default anchors. The restored ridden mount, carried spring and mouth shell are unique, attached to the solved owner pose and clear of the floor before any input.
- Real keyboard/touch harness tests select the mechanics arena, collect powers and inspect the visible form readout; screenshots are actual Phaser output. Existing 29 unit and nine browser foundation/terrain cases remain covered by the final pipeline.

## Failures repaired without weakening contracts

The first resumed typecheck rejected contact as a death cause; the union was aligned with the existing DeathEvent. The deterministic combination trace initially had an implicit array type; fixed with a concrete TerrainState type, without suppression.

Early read-only review identified forbidden-carried transfer restoration, fleeing direction reset, opposite fence-side body harm, immune tongue suppressing body harm, actor-before-platform ordering, missing recovery phase and an incorrect test dispenser parameter. Production fixes preserve single ownership, collision masks, persistent direction and deterministic phases. Integration fixtures now use canonical objectKind and genuine block input routes.

The first browser fixture run was 7/15; strengthened fixtures exposed further concrete checks. Later 14/16 and 15/16 runs remained failing rather than being declared complete. IT-020 explicitly requires observing the required key fall into the pit before replacement; this caught small-Arthur carried-object Y embedding in the floor. Carry and spit positions now preserve bottom clearance and fall back to safe attachment before movement. The unchanged loss assertion passes in the full final run. Block grab reach is checked before narrow horizontal contact, and safe materialization verifies the swept path instead of only its endpoint. No timeout/retry suppression or runtime mock was added.

Independent review round 001 reproduced five correctness failures: low-ceiling reserve spawn, vertically distant fleeing mount recovery, incompatible throwable-boss ammunition, same-tick stale flight after power loss, and restored carried objects embedded at obsolete area spawn. All were triaged VALID, fixed in production and covered by concrete regression assertions. The reviewer independently reran original symptoms, including three flight-source combinations and safe restored anchors. The reserve regression initially exposed immediate same-tick recollection; runtime creation tick now preserves the falling item for that tick. A new transfer test initially failed strict duplicate-ID validation (64/65); its second floor now has a distinct global ID, preserving the validator and the complete assertion. One intermediate browser command accidentally used the configured two workers; the final current evidence reran explicitly with `--workers=1`. Issue metadata remains VALID for native root closure after approval.

## Implementation handoff

`TerrainSimulation` remains the sole movement authority. Mechanics modules use its CollisionSolver context; `support.ts` carries non-player genuine foot contacts through that solver. Phaser only reads views.

Task 04 consumes factual UUID domain events: checkpoint snapshots plus pending medallions, exits plus bonusStars/medallions, one death, reward amount/type/entityId, bossVictory, sanctuary color/id, message and mountBonus. `snapshot()` excludes lives; `restart()` validates the checkpoint, clears attempt state and stale hazards and reconstructs RunState safely. Restricted areas remove mount/shell ability before actor creation. Optional `RunState.temporarySwitches` serializes remaining simulation ticks; absent legacy-v1 field means empty. Reward/life/campaign durability remains downstream; no cloud/schema/OAuth provisioning belongs to this task.

Task 04 must preserve its authoritative reward ledger when committing a checkpoint: apply the ordered reward facts, then overlay the snapshot's mechanical form/reserve/carried/mount/effects/temporarySwitches without replacing updated coins/score/bonusStars with the simulation's starting counters. Lives stay outside RestartSnapshot. No resetEpoch field was introduced. Sanctuary facts are not themselves durable global switch state; the campaign owner applies/revokes them under difficulty reset scopes.

All mechanics are original TypeScript implementations. Exact consulted Celeste collision-clearance/holding source revision is attributed in THIRD_PARTY_NOTICES; no third-party implementation/assets or Nintendo content were imported. Full campaign placement/balancing, original pixel assets/audio, save menus/auth and deployment eligibility remain their owning later tasks.
