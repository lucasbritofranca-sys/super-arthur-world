# Mechanics verification boundary

Task 03's original arenas exercise the production `TerrainSimulation`; no Phaser physics body owns gameplay positions. `LevelScene` reads snapshots and uses temporary geometric art, pending task 06 original assets. The harness is not the final campaign.

## Authored behavior defaults

- Simulation is 60Hz. Classic damage protection lasts 60 ticks; Easy 120, Hard 30. Small Arthur dies on ordinary harm; Classic/Hard powered forms shrink directly to small. Easy projectile/gliding forms first shrink to large. Reserve is released once on unprotected nonterminal damage.
- Form growth proposes a 32px-high bottom-preserving collider and checks real geometry. A low ceiling defers growth of the physical body until clear. Crouching uses the 16px body.
- Contract resolution: the concrete IT-014 reserve-mushroom journey takes precedence over the TechSpec's broad distinct-form replacement sentence. A growth item collected while projectile/gliding is active fills the reserve without downgrading the current advanced form; advanced-to-advanced pickup still replaces and reserves the former form.
- Invincibility defaults to 600 ticks, float and swallowed shells to 1200. Pause and the 12-tick transfer animation freeze these powers; the stage timer continues during transfer. All are bounded integer simulation counters.
- Gliding requires at least 149px/s with Action for 18 grounded ticks. Ascent control is bounded to 30 ticks; glide descent caps at 48px/s, dive at 480px/s, and releasing a dive enters 12-tick recovery. This is an original documented tuning, not a measured SNES byte-for-byte reconstruction.
- Each object is world-owned, Arthur-carried, mount-held, moving, or consumed. Pickup ties use stable ID. Red shell/mount gives fire, blue gives flight, yellow gives landing attacks; abilities require a swallowed shell. An unmounted/fleeing mount owns its own remaining shell timer. Five berries grow a baby mount. Wings enter the authored bonus subarea and turn the mount blue.
- Temporary switch durations survive `RestartSnapshot.run.temporarySwitches`; missing optional field in old v1 data means no active switches. Expiry tests proposed geometry atomically and defers if no safe relocation exists. Sanctuary events are facts for task 04 to commit or revoke with world progress.
- Block/power consumption survives a subarea revisit during the attempt. A checkpoint restart recreates hazard phases and uncommitted attempt consumption. Carried state comes only from the snapshot; lives never come from this snapshot.
- `vulnerability.ts` enumerates ten attacks across eight original enemy families. Boss controllers use six distinct methods and staged combinations for controllers 7–10. Throwable encounters require a declared dispenser and accept throwable blocks, not keys as ammunition.
- Terminal Arthur contact discards same-tick victory, exit, checkpoint and reward events. UUID attempt identity plus restart ordinal/tick produces deterministic domain event identities; task 04 remains the reward/life/progress authority.

## Verification ownership

The canonical 27 cases are listed in task_03.md and `_tests.md`. Unit cases isolate concrete edge conditions using real systems and collision. Browser integrations load those actual TypeScript modules in Chromium; real keyboard/touch harness journeys verify Phaser presentation separately. Screenshots and traces are written into ignored `test-results/`, then frozen in task evidence only after inspection. Later tasks own final campaign validation, persisted/synchronized campaign tests, cross-browser release QA and published-URL verification.
