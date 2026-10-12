# Task 04 independent review

Reviewer: native Codex subagent, separate from implementation. Date: 2026-10-12.
Scope: campaign reducers, graph projection, difficulty, reward/bonus rules, scoped reset ownership, six-slot commands, shared event/schema changes and their actual simulation/browser fixtures. Skills: cy-review-round and cy-final-verify, adapted under AGENTS.md to native Codex. No source, staging or commit mutations were performed by this reviewer.

## Findings and reproduction

One high-severity defect was reproduced and recorded in `reviews-002/issue_001.md`: actual power acquisition followed by exit saved the previous session form rather than the simulation's final eligible inventory. The production simulator emitted an exit at tick 1 with simulation form large, while reducer and persistence form were small. The implementer repaired the exit event contract and validates its run state while retaining reducer-authoritative counters. Independent post-repair Vite SSR probes with actual simultaneous coin100, large/gliding pickups and exits now observe the final form in emitted exit, reducer, persistence intent and reopened session, coins=0 and lives=6. Evidence: `review-exit-probe.json`, command exit 0 at 2026-10-12T17:05:07Z. This narrow repair verification does not replace the full frozen-source pipeline. Native root owns final issue closure.

No additional meaningful blocking defect was found in the inspected task 04 source. Campaign/catalog guards now reject invalid active IDs and foreign content versions instead of dereferencing missing levels. Static full-catalog counts, original layouts, actual storage/account synchronization and complete player screens remain their explicitly assigned later task boundaries.

## Contract parity inspected

Canonical inputs: task_04.md, _prd.md, _user_stories.md, _techspec.md, _tests.md, _tasks.md and ADR-001 through ADR-007. Source compared to the actual fields and rules, not only task paraphrases: six solo slots; downward-only map changes; current lives outside restart snapshots; 10/5/3 renewal before Continue; Easy level, Classic world, Hard campaign reset; sanctuary/reward ownership; retained visited entrances with relocked erased shortcuts; tentative medallion commit boundaries; unique set reward; saturation and residual counters; symbol alignment continuation; separate 120/150/600 denominators and story/cosmetic flags.

All 21 assigned test IDs are present and assert their stated behaviors:

- UT-003: app guard stops map reducer during active play.
- UT-025: real switch activation/restart and exact remaining duration.
- UT-026: yellow ownership revoked while green and visited access remain.
- UT-030: bounded score and chain life.
- UT-032/033: tentative loss versus committed set and unique reward.
- UT-034: actual repeatable reward-block visits; no synthetic bonus or completion.
- UT-037: terminal checkpoint death commits one reset before Continue.
- UT-038/040/042: secret/current-world ownership, shortcut revocation and retained visited entries.
- UT-039/041: stable exit identity and prerequisite denial.
- UT-045/046: independent completion denominators and decrease after reset.
- IT-030/033: actual simulation pickup/checkpoint/pit/restart, real reducer current-life deduction.
- IT-031: actual bonus grid stops and one line reward settlement.
- IT-035: all three real reset scopes and app-level active-slot replacement, another slot unchanged.
- IT-037/038: real reducer exit/graph/replay/network transitions; small logical fixtures explicitly do not claim 120 final layouts.

Additional regressions inspect Hard ledger clearing, duplicate terminal death, active Continue rejection, ordinary coin/life emission, actual landing chain reset, same-tick checkpoint counter overlay, immutable inputs/results and exact pending bonus reopening.

## Import/dependency map

The reducer imports schema, actual TerrainSimulation, model, progression, rewards, bonus, reset and catalog modules. Campaign modules consume core types/events; app commands call reducers and view models project progression. TerrainSimulation delegates actual mechanics/collision, emits facts and clones snapshot inventory; no campaign module imports DOM, storage, Supabase, Phaser or global random/time. No circular runtime dependency or second position authority was found. Root owns task 05 transaction/CAS integration; task 07 owns the complete UI/host assembly.

## Verification status

The final serial frozen-source records were independently read: typecheck and lint pass; 87 unit tests pass; all 31 Chromium integration tests pass using one worker; production build succeeds. The initial failed browser and unit runs are retained as diagnostics and do not serve as final passing evidence. All 85 source manifest rows were independently recalculated and match current files. One high issue was found and its original failure no longer reproduces after repair; native root owns formal resolved status. No remaining task 04 blocking finding was identified. No complete game, cloud durability, physical device or publication claim is made.

Visual contract: n/a — no named normative visual reference exists for this pure reducer slice. Later final UI and release QA remain required.


VERIFICATION REPORT
-------------------
Claim: Independent task 04 source/contract review is complete; repaired exit defect independently verified; current scoped pipeline records match the inspected tree.
Command: Current recorded pnpm typecheck; pnpm lint; pnpm test; pnpm exec playwright test tests/integration --project=chromium --workers=1; pnpm build. Independent Get-FileHash SHA256 comparison for every source-sha256.txt row; narrow production Vite SSR exit probe.
Executed: Final fresh serial records independently inspected on 2026-10-12 after the 17:11Z frozen-source run; manifest SHA256 d0887a3cae00a08d39fb17f16b955420126c8689848e4f54a5452da482e16408.
Exit code: Recorded gates 0; independent manifest comparison 0; narrow exit probe 0.
Output summary: 85/85 manifest rows match; 87/87 units; 31/31 Chromium using 1 worker; lint 64 TypeScript files with no suppression/boundary errors; 36 transformed modules and production build completed.
Warnings: Inherited Vite vendor chunk >500 kB (1,443.61 kB, gzip 378.51 kB); Playwright NO_COLOR/FORCE_COLOR environment warning. These are reported, not hidden or suppressed; final loading/performance budget ownership remains task 07.
Errors: None in final scoped records. Earlier failed runs retained separately and superseded by post-repair runs.
Contract parity: PASS for declared task 04 boundary versus task_04, PRD F-04/F-05/F-06, relevant user stories, full TechSpec/test catalogs and ADRs; all 21 assigned cases mapped above.
Visual contract: n/a — no named visual reference found; pure reducers/projections here, final UI and original campaign remain later tasks.
QA impact: campaign-reset-ff0549ffc7c9 remains untested under the explicit graph-owned task 08/09 QA-phase exception; no stale passing scenario is claimed.
Verdict: PASS for independent task 04 review and scoped current evidence; full-game release remains pending later tasks and final independent QA.
