# Test Specification: Super Arthur World

Canonical planned test contract for [_techspec.md](_techspec.md), derived from all 40 stories and 80 explicit edge cases in [_user_stories.md](_user_stories.md). No case is verified merely because it appears here. IDs are sequential per prefix and become permanent when task files assign them.

## Strategy

- Vitest exercises pure TypeScript simulation, progression and persistence boundaries; Playwright exercises real public browser journeys. Small authored fixtures isolate a particular mechanic without exposing a public debug menu. Unit tests fake only I/O; integration tests use the real participating components.
- Use deterministic fixed-tick input traces and fresh IndexedDB/browser contexts. Each parameterized family row produces independent assertions for named fixtures, rather than one broad smoke assertion.
- E2E uses the actual title, slot, map, settings, phase, pause and account screens. No invented public cheat, instant-win or debug-click flow counts as a player journey. Test-only adapters can control hardware samples and failures at I/O boundaries; they cannot pretend a cloud roundtrip occurred.
- Cloud ownership tests must use real Supabase migrations/RLS and separate authenticated test users. Google OAuth, second-device/browser continuation, mobile Safari and published URL checks require actual external evidence. A fake provider demonstrates only local integration; report its scope. Missing access is blocked/unverified, never passing.
- Account fixtures use dedicated test data, never read unrelated user projects; keep tokens out of reports. Guest saves remain separate from account caches.
- Record observed revision, command, timestamp, platform and failing fixture in docs/qa evidence. Independent QA reruns the suite plus complete manual journeys, checks real artwork/content, and blocks publication on relevant unresolved failures. Postdeploy evidence must identify the actual deployed revision.
- Ownership hints below guide cy-create-tasks. Each test ID belongs to exactly one task; QA reexecution does not duplicate implementation ownership. Task 08 authors QA plans/scenarios and owns document validation rather than another copy of these cases.

## Coverage Matrix

Every story and explicit edge case has its own row. A case ID can appear in additional component rows when it actually checks that same contract; ownership remains singular. Fixture IDs such as `main01.level01` are named representative content fixtures, not permission to change the final catalog's counts. Responsibility labels such as PowerSystem/SlotService describe the tested domain function; they do not mandate extra classes or an ECS. Primary interfaces retain the names from the Techspec.

| Source | Behavior | Unit | Integration | E2E |
|---|---|---|---|---|
| US-001 | Guest entry — complete journey | — | — | E2E-001 |
| US-001.EC-1 | Guest entry — edge 1 | — | IT-001 | — |
| US-001.EC-2 | Guest entry — edge 2 | — | IT-002 | — |
| US-002 | Independent slots — complete journey | — | — | E2E-002 |
| US-002.EC-1 | Independent slots — edge 1 | UT-001 | — | — |
| US-002.EC-2 | Independent slots — edge 2 | UT-002 | — | — |
| US-003 | Difficulty reduction — complete journey | — | — | E2E-003 |
| US-003.EC-1 | Difficulty reduction — edge 1 | UT-003 | — | — |
| US-003.EC-2 | Difficulty reduction — edge 2 | — | IT-003 | — |
| US-004 | Keyboard input — complete journey | — | — | E2E-004 |
| US-004.EC-1 | Keyboard input — edge 1 | UT-004 | — | — |
| US-004.EC-2 | Keyboard input — edge 2 | — | IT-004 | — |
| US-005 | Gamepad input — complete journey | — | IT-005 | — |
| US-005.EC-1 | Gamepad input — edge 1 | — | IT-006 | — |
| US-005.EC-2 | Gamepad input — edge 2 | UT-005 | — | — |
| US-006 | Touch input — complete journey | — | — | E2E-005 |
| US-006.EC-1 | Touch input — edge 1 | — | IT-007 | — |
| US-006.EC-2 | Touch input — edge 2 | — | — | E2E-006 |
| US-007 | Run and jump — complete journey | — | IT-008 | — |
| US-007.EC-1 | Run and jump — edge 1 | UT-006 | — | — |
| US-007.EC-2 | Run and jump — edge 2 | UT-007 | — | — |
| US-008 | Slopes and vertical run — complete journey | — | IT-009 | — |
| US-008.EC-1 | Slopes and vertical run — edge 1 | UT-008 | — | — |
| US-008.EC-2 | Slopes and vertical run — edge 2 | UT-009 | — | — |
| US-009 | Swimming — complete journey | — | IT-010 | — |
| US-009.EC-1 | Swimming — edge 1 | UT-010 | — | — |
| US-009.EC-2 | Swimming — edge 2 | — | IT-011 | — |
| US-010 | Climbing and fences — complete journey | — | IT-012 | — |
| US-010.EC-1 | Climbing and fences — edge 1 | UT-011 | — | — |
| US-010.EC-2 | Climbing and fences — edge 2 | UT-012 | — | — |
| US-011 | Transfers and camera — complete journey | — | IT-013 | — |
| US-011.EC-1 | Transfers and camera — edge 1 | UT-013 | — | — |
| US-011.EC-2 | Transfers and camera — edge 2 | UT-014 | — | — |
| US-012 | Forms and reserve — complete journey | — | IT-014 | — |
| US-012.EC-1 | Forms and reserve — edge 1 | UT-015 | — | — |
| US-012.EC-2 | Forms and reserve — edge 2 | UT-016 | — | — |
| US-013 | Timed powers — complete journey | — | IT-015 | — |
| US-013.EC-1 | Timed powers — edge 1 | UT-017 | — | — |
| US-013.EC-2 | Timed powers — edge 2 | UT-018 | — | — |
| US-014 | Flight — complete journey | — | IT-016 | — |
| US-014.EC-1 | Flight — edge 1 | UT-019 | — | — |
| US-014.EC-2 | Flight — edge 2 | UT-020 | — | — |
| US-015 | Mount — complete journey | — | IT-017 | — |
| US-015.EC-1 | Mount — edge 1 | UT-021 | — | — |
| US-015.EC-2 | Mount — edge 2 | — | IT-018 | — |
| US-016 | Carryable objects — complete journey | — | IT-019 | — |
| US-016.EC-1 | Carryable objects — edge 1 | UT-022 | — | — |
| US-016.EC-2 | Carryable objects — edge 2 | — | IT-020 | — |
| US-017 | Blocks — complete journey | — | IT-021 | — |
| US-017.EC-1 | Blocks — edge 1 | UT-023 | — | — |
| US-017.EC-2 | Blocks — edge 2 | UT-024 | — | — |
| US-018 | Switches — complete journey | — | IT-022 | — |
| US-018.EC-1 | Switches — edge 1 | UT-025 | — | — |
| US-018.EC-2 | Switches — edge 2 | UT-026 | — | — |
| US-019 | Platforms and hazards — complete journey | — | IT-023 | — |
| US-019.EC-1 | Platforms and hazards — edge 1 | UT-027 | — | — |
| US-019.EC-2 | Platforms and hazards — edge 2 | — | IT-024 | — |
| US-020 | Enemies — complete journey | — | IT-025 | — |
| US-020.EC-1 | Enemies — edge 1 | UT-028 | — | — |
| US-020.EC-2 | Enemies — edge 2 | — | IT-026 | — |
| US-021 | Bosses — complete journey | — | IT-027 | — |
| US-021.EC-1 | Bosses — edge 1 | UT-029 | — | — |
| US-021.EC-2 | Bosses — edge 2 | — | IT-028 | — |
| US-022 | Rewards and HUD — complete journey | — | IT-029 | — |
| US-022.EC-1 | Rewards and HUD — edge 1 | UT-030 | — | — |
| US-022.EC-2 | Rewards and HUD — edge 2 | UT-031 | — | — |
| US-023 | Medallions — complete journey | — | IT-030 | — |
| US-023.EC-1 | Medallions — edge 1 | UT-032 | — | — |
| US-023.EC-2 | Medallions — edge 2 | UT-033 | — | — |
| US-024 | Bonuses — complete journey | — | IT-031 | — |
| US-024.EC-1 | Bonuses — edge 1 | — | IT-032 | — |
| US-024.EC-2 | Bonuses — edge 2 | UT-034 | — | — |
| US-025 | Checkpoint resume — complete journey | — | — | E2E-007 |
| US-025.EC-1 | Checkpoint resume — edge 1 | UT-035 | — | — |
| US-025.EC-2 | Checkpoint resume — edge 2 | UT-036 | — | — |
| US-026 | Ordinary death — complete journey | — | IT-033 | — |
| US-026.EC-1 | Ordinary death — edge 1 | — | IT-034 | — |
| US-026.EC-2 | Ordinary death — edge 2 | UT-037 | — | — |
| US-027 | Game Over scopes — complete journey | — | IT-035 | — |
| US-027.EC-1 | Game Over scopes — edge 1 | — | IT-036 | — |
| US-027.EC-2 | Game Over scopes — edge 2 | UT-038 | — | — |
| US-028 | Map routes — complete journey | — | IT-037 | — |
| US-028.EC-1 | Map routes — edge 1 | UT-039 | — | — |
| US-028.EC-2 | Map routes — edge 2 | UT-040 | — | — |
| US-029 | Secret network — complete journey | — | IT-038 | — |
| US-029.EC-1 | Secret network — edge 1 | UT-041 | — | — |
| US-029.EC-2 | Secret network — edge 2 | UT-042 | — | — |
| US-030 | 24-level content — complete journey | — | IT-039 | — |
| US-030.EC-1 | 24-level content — edge 1 | UT-043 | — | — |
| US-030.EC-2 | 24-level content — edge 2 | UT-044 | — | — |
| US-031 | Story versus 100 percent — complete journey | — | IT-040 | — |
| US-031.EC-1 | Story versus 100 percent — edge 1 | UT-045 | — | — |
| US-031.EC-2 | Story versus 100 percent — edge 2 | UT-046 | — | — |
| US-032 | Guest local persistence — complete journey | — | — | E2E-008 |
| US-032.EC-1 | Guest local persistence — edge 1 | — | IT-041 | — |
| US-032.EC-2 | Guest local persistence — edge 2 | — | IT-042 | — |
| US-033 | Optional Google account — complete journey | — | — | E2E-009 |
| US-033.EC-1 | Optional Google account — edge 1 | — | IT-043 | — |
| US-033.EC-2 | Optional Google account — edge 2 | — | IT-044 | — |
| US-034 | Guest import — complete journey | — | — | E2E-010 |
| US-034.EC-1 | Guest import — edge 1 | — | IT-045 | — |
| US-034.EC-2 | Guest import — edge 2 | UT-047 | — | — |
| US-035 | Conflict selection — complete journey | — | IT-046 | — |
| US-035.EC-1 | Conflict selection — edge 1 | — | IT-047 | — |
| US-035.EC-2 | Conflict selection — edge 2 | — | IT-048 | — |
| US-036 | Save status and recovery — complete journey | — | IT-049 | — |
| US-036.EC-1 | Save status and recovery — edge 1 | — | IT-050 | — |
| US-036.EC-2 | Save status and recovery — edge 2 | — | IT-051 | — |
| US-037 | Original presentation — complete journey | — | — | E2E-011 |
| US-037.EC-1 | Original presentation — edge 1 | — | IT-052 | — |
| US-037.EC-2 | Original presentation — edge 2 | — | — | E2E-012 |
| US-038 | Pause and audio — complete journey | — | — | E2E-013 |
| US-038.EC-1 | Pause and audio — edge 1 | — | IT-053 | — |
| US-038.EC-2 | Pause and audio — edge 2 | — | IT-054 | — |
| US-039 | Accessible controls — complete journey | — | — | E2E-014 |
| US-039.EC-1 | Accessible controls — edge 1 | — | — | E2E-015 |
| US-039.EC-2 | Accessible controls — edge 2 | — | IT-055 | — |
| US-040 | QA and publication — complete journey | — | IT-056 | — |
| US-040.EC-1 | QA and publication — edge 1 | UT-048 | — | — |
| US-040.EC-2 | QA and publication — edge 2 | — | IT-057 | — |
| src/main.ts / src/app | Valid composition config; disabled sync fallback | UT-055 | IT-002, IT-004 | E2E-001 |
| src/core / Simulation | Deterministic view/step/restart; invalid geometry/budget and collision states | UT-006–UT-014, UT-049, UT-050, UT-062 | IT-008, IT-010, IT-013 | E2E-007 |
| src/game | Camera projection limits and invalid content; actual required-asset load failures | UT-056, UT-057 | IT-002, IT-072, IT-073 | E2E-001 |
| src/input / ActionFrame | Unique semantic edges, conflicting bindings, deadzone and released stale input | UT-004, UT-005, UT-065 | IT-004, IT-006, IT-007 | E2E-004–E2E-006 |
| src/ui | Whole-version conflict summaries; private namespace denial | UT-058, UT-059 | IT-046, IT-047, IT-054 | E2E-014, E2E-015 |
| src/content / ContentValidator | Complete catalog and malformed/dangling/recovery rejection | UT-043, UT-044, UT-060 | IT-039 | E2E-011, E2E-012 |
| src/persistence / runtime schema | Valid decoding and corrupt/incompatible/range errors | UT-051, UT-052, UT-063, UT-064 | IT-041, IT-050 | E2E-008 |
| CampaignCommands | Checkpoint/exit/death/reduction; invalid phase, reset and idempotency boundaries | UT-003, UT-026, UT-030–UT-042, UT-045, UT-046 | IT-003, IT-029–IT-038 | E2E-003, E2E-007 |
| LocalRepository | Read/commit valid schema, revision conflict and quota/unavailable/abort | UT-002, UT-051, UT-052, UT-063 | IT-041, IT-050, IT-071 | E2E-007, E2E-008 |
| RemoteRepository / SaveMutation | Accepted response and every documented adapter failure shape | UT-053, UT-054 | IT-044, IT-058–IT-065, IT-069, IT-070 | E2E-009, E2E-010 |
| RestartSnapshot | Safe effect remainder, invalid life field and invalidated continuation | UT-036, UT-064 | IT-024, IT-034 | E2E-007 |
| Supabase migrations / game_saves | Owner/slot/revision/version/byte invariants and direct API outcomes | UT-053, UT-054, UT-063 | IT-044, IT-058–IT-065, IT-069 | E2E-009 |
| Google auth redirect/callback | Allowlisted PKCE session/cancel/error/expiry without guest loss | UT-055, UT-059 | IT-043, IT-066 | E2E-009, E2E-010 |
| scripts/tests/docs/qa | Valid report gate and unresolved/wrong-revision rejection | UT-048, UT-061 | IT-056, IT-057, IT-067, IT-068 | E2E-001, E2E-009 |
| GET /rest/v1/game_saves | Owner rows/tombstones; anon denial/auth/network failures | UT-054 | IT-058, IT-059, IT-043 | E2E-009 |
| POST /rest/v1/game_saves | Initial insert; duplicate, invalid version/slot/revision/bytes/owner | UT-053, UT-054 | IT-060, IT-061, IT-062, IT-044 | E2E-010 |
| PATCH /rest/v1/game_saves | CAS accepted/zero rows; immutable identity/monotonicity/owner failures | UT-053, UT-054 | IT-063, IT-064, IT-065, IT-044, IT-069 | — |

Shared sweep SW-01–SW-10 is exercised by the concrete invalid-state, first-run, bounded counter/content, RLS, duplicate event, interruption, ordering and transition cases above. It is not forty duplicated generic tests. Scale is this game's six slots/24 levels and supported dense fixture, never an enterprise load target.

## Unit Tests

- **UT-001** (state; owner hint task_05; US-002.EC-1): Give SlotService six occupied slots; requesting slot=7 fails validation with path=slot,code=range and all six stored versions stay byte-identical.
- **UT-002** (idempotency; owner hint task_05; US-002.EC-2): Confirm deletion of slot 2 twice using expected localVersion=1, while slot 3 exists; first stores its tombstone/version2, second returns local-conflict without touching slot 3.
- **UT-003** (state; owner hint task_04; US-003.EC-1): Request lowerDifficulty(easy) through the app command while screen=level and campaign difficulty=hard; the command returns unavailable and keeps the active Hard rules without calling the map-only reducer.
- **UT-004** (error; owner hint task_01; US-004.EC-1): InputRouter receives remap(normalJump,Escape), already bound to pause; return binding_conflict with the original jump binding retained.
- **UT-005** (idempotency; owner hint task_01; US-005.EC-2): Two controllers and keyboard all produce jump on the same tick; InputRouter outputs one normalJump edge for the single player.
- **UT-006** (idempotency; owner hint task_02; US-007.EC-1): Physics.step sees 250ms render delay and duplicated jump edges; bounded fixed steps keep Arthur left of a solid 16px wall and apply one jump impulse.
- **UT-007** (state; owner hint task_02; US-007.EC-2): Jump under a ceiling at y=64 with Arthur top y=66; ceiling contact zeros upward velocity and never places his top above 64 or enables another airborne jump.
- **UT-008** (state; owner hint task_02; US-008.EC-1): Cross the authored slope-flat-wall junction over 60 ticks; Arthur's collision box never intersects the wall or sinks below the sampled slope surface.
- **UT-009** (state; owner hint task_02; US-008.EC-2): Approach triangular turn block with speed=0, then approach an ordinary wall at full run speed; both retain ground/wall motion without entering verticalRun.
- **UT-010** (idempotency; owner hint task_02; US-009.EC-1): Cross one water surface ten times with no new jump edge; movement mode follows the medium with no additional jump impulse or duplicate spring.
- **UT-011** (state; owner hint task_02; US-010.EC-1): Deliver ten gate actions during one active side-change transition; FenceController finishes exactly one front-to-back transition for the existing actor.
- **UT-012** (state; owner hint task_02; US-010.EC-2): Transfer from a rope subarea to a dry-ground destination; PhysicsController.climbTarget becomes null and the next tick uses ground gravity.
- **UT-013** (state; owner hint task_02; US-011.EC-1): Deliver three pipe-entry events during one transfer; TransitionController creates one destination actor retaining its original ID.
- **UT-014** (error; owner hint task_02; US-011.EC-2): Validate a pipe destination=subarea_missing in level main01.level01; ContentValidator returns dangling_destination before the level can boot.
- **UT-015** (idempotency; owner hint task_03; US-012.EC-1): Three contact hits arrive during the same protection window on large Classic Arthur; PowerSystem transitions once to small without consuming a life.
- **UT-016** (idempotency; owner hint task_03; US-012.EC-2): Resolve projectile pickup and damaging contact in the same tick on large Classic Arthur; interactions acquire projectile first, harm reduces it to small and the damage-triggered reserve release creates one mushroom with reserve=null.
- **UT-017** (state; owner hint task_03; US-013.EC-1): Collect 600-tick invincibility after an unpowered checkpoint, advance 30 ticks, pause for 500 wall-clock ticks and transfer subarea; remaining duration stays 570 simulation ticks; death returns to the unpowered checkpoint rather than preserving that uncommitted effect.
- **UT-018** (state; owner hint task_03; US-013.EC-2): Invincible Arthur crosses the pit death boundary; Simulation.step emits one lethal death event rather than suppressing harm as an eligible enemy contact; life deduction is covered by the campaign death integration.
- **UT-019** (state; owner hint task_03; US-014.EC-1): Try takeoff below the authored speed threshold and separately remove the gliding form while airborne; neither state retains poweredFlight.
- **UT-020** (state; owner hint task_03; US-014.EC-2): Dive at maximum authored speed into a 16px wall beside a moving platform; swept collision stops at the wall and the actor remains inside world bounds.
- **UT-021** (idempotency; owner hint task_03; US-015.EC-1): Apply a damaging contact to mounted Arthur twice in one tick; MountSystem creates one fleeing mount carrying one swallowed shell, without an extra Arthur hit.
- **UT-022** (idempotency; owner hint task_03; US-016.EC-1): Offer key1 and shell1 at equal pickup distance plus repeated action edges; stable tie-breaking gives Arthur one carried object and leaves the other world-owned.
- **UT-023** (state; owner hint task_03; US-017.EC-1): Two head contacts hit reward block block1 in one tick; BlockSystem emits one reward and block1 becomes consumed.
- **UT-024** (state; owner hint task_03; US-017.EC-2): Reactivate a temporary solid block overlapping Arthur's bounds; BlockSystem applies safe activation/depenetration and produces no embedded collision state.
- **UT-025** (state; owner hint task_04; US-018.EC-1): Reactivate a temporary switch on its conversion tick, then reload its checkpoint; each object has one canonical identity and the effect expires at the declared remaining-tick boundary.
- **UT-026** (state; owner hint task_04; US-018.EC-2): Classic-reset main03 which owns yellow sanctuary while green belongs to main01; yellow=false, green=true and visited main04 remains accessible.
- **UT-027** (state; owner hint task_02; US-019.EC-1): Two opposing crusher surfaces close a 12px gap around a 16px actor; PhysicsController reports one lethal crush transition rather than clipping.
- **UT-028** (idempotency; owner hint task_03; US-020.EC-1): Shell and projectile both defeat enemy1 on the same tick; EnemySystem produces one defeated state and one reward event for enemy1.
- **UT-029** (state; owner hint task_03; US-021.EC-1): Resolve terminal Arthur hit and boss final hit on one tick; Simulation.step emits one Arthur death event and no bossVictory, exit or reward event; the next restart recreates the boss encounter.
- **UT-030** (state; owner hint task_04; US-022.EC-1): Add 500 score to score=9999998 and award a chain life when lives=99; RewardSystem returns score=9999999,lives=99 with no overflow or negative counter.
- **UT-031** (state; owner hint task_05; US-022.EC-2): Collect coin100 during the committed exit transition, then reopen; its reward ledger records one event and lives increases once.
- **UT-032** (state; owner hint task_04; US-023.EC-1): Starting with medallion1 committed, collect medallion2 then die before checkpoint; committed marks remain {medallion1} and pending marks become empty.
- **UT-033** (state; owner hint task_04; US-023.EC-2): Complete the five-medallion set, commit, then recollect a marked medallion in replay; the achievement ledger grants no second set life.
- **UT-034** (idempotency; owner hint task_04; US-024.EC-2): Enter a declared repeatable replenishment room with bonusStars=99 twice; repeatable supplies may recur but no bonus threshold or unique completion is synthesized.
- **UT-035** (idempotency; owner hint task_05; US-025.EC-1): Apply the identical checkpoint event ID twice; CampaignReducer retains one commit and the same lives/reward ledger as after its first application.
- **UT-036** (error; owner hint task_05; US-025.EC-2): Reset commits localVersion=3 with lastTransition.kind=gameOver, invalidating the old localVersion=2 checkpoint; continuation uses the reset destination instead of that stale snapshot.
- **UT-037** (state; owner hint task_04; US-026.EC-2): Die with lives=1 at an active checkpoint; CampaignReducer emits gameOver/reset and does not emit ordinary checkpointRespawn.
- **UT-038** (state; owner hint task_04; US-027.EC-2): Classic-reset secret01 while main01 and main02 are visited; secret01-owned marks and outgoing shortcuts clear while main01/main02 visited access remains.
- **UT-039** (idempotency; owner hint task_04; US-028.EC-1): Complete exit main01.level03.secret twice; ProgressionSystem exit count grows by 1 and route state remains one unlocked edge.
- **UT-040** (error; owner hint task_04; US-028.EC-2): Classic-reset the world owning a secret shortcut; that shortcut becomes locked while another visited world's entrance remains unlocked.
- **UT-041** (error; owner hint task_04; US-029.EC-1): Travel to secret02 before its required network exits are complete; ProgressionSystem returns route_locked and retains the current map node.
- **UT-042** (state; owner hint task_04; US-029.EC-2): Reset secret01 after visiting secret02; owned network exits reset but the retained visited-world entry rule still permits return to secret02.
- **UT-043** (idempotency; owner hint task_06; US-030.EC-1): Parameterize malformed catalogs with missing level024, duplicate level001 and an exit to unknown level999; ContentValidator returns the corresponding missing/duplicate/dangling identity error.
- **UT-044** (error; owner hint task_06; US-030.EC-2): Validate a mandatory flight route requiring a consumed feather with no dispenser or ground alternative; ContentValidator reports missing_recovery_route and blocks publication.
- **UT-045** (state; owner hint task_04; US-031.EC-1): With 24 levels,33 exits,120 medallions, then separately 24/34/119, CompletionSystem reports below 100% in both fixtures.
- **UT-046** (state; owner hint task_04; US-031.EC-2): Classic-reset one completed world after 100%; recomputed completion decreases and the cosmetic flag never reinstates erased exits or hides hazard foreground contrast.
- **UT-047** (idempotency; owner hint task_05; US-034.EC-2): Submit the same import intent/revision twice; SyncService accepts one authoritative version and duplicate import cannot award progression rewards.
- **UT-048** (error; owner hint task_09; US-040.EC-1): qa:report validation receives a relevant unresolved QA bug or deployed SHA different from the verified candidate; it returns blocked rather than complete.
- **UT-049** (happy; owner hint task_02; Simulation): Simulation.step in a solid-floor fixture for 60 ticks with Right held produces the same view()/event trace for repeated runs of seed=17.
- **UT-050** (error; owner hint task_02; Simulation): Reject an initial non-finite x=NaN or displacement budget=65px/tick through core validation; validation reports a path/code issue instead of advancing through geometry.
- **UT-051** (happy; owner hint task_05; LocalRepository): LocalRepository.read decoder receives schemaVersion=1,slot=1,localVersion=4 valid fixture; it returns the same campaign and version=4 without changing payload.
- **UT-052** (error; owner hint task_05; LocalRepository): LocalRepository.read decoder receives schemaVersion=999 in slot2; it returns incompatible for slot2 without guessing a migration or erasing valid slot1.
- **UT-053** (happy; owner hint task_05; RemoteRepository): RemoteRepository response adapter receives a returned own row revision=4,mutation_id=M4,payload=P4 for its CAS request; returns kind=accepted with that exact record.
- **UT-054** (error; owner hint task_05; RemoteRepository): Parameterize direct API failures 401, 429, 500, network error, 23514 and 42501; response adapter returns retry/auth, retry/rate-limit, retry/remote-error, retry/network, invalid/schema and invalid/forbidden respectively.
- **UT-055** (state; owner hint task_01; App/config): Parse two valid VITE_SUPABASE public values versus absent/malformed values; configuration returns an enabled client only for the valid pair, otherwise guest-ready syncUnavailable state.
- **UT-056** (happy; owner hint task_02; Game adapter): Camera adapter applies right look-ahead to a 384x216 logical view at its rightmost bound; camera x never exceeds the authored maximum and simulation coordinates remain unchanged.
- **UT-057** (error; owner hint task_02; Game adapter): Reject content camera rectangle with width=-1 or nonexistent subarea before scene creation; surface invalid content with its field path instead of spawning an unbounded camera.
- **UT-058** (happy; owner hint task_07; UI view models): Construct a conflict view for local Classic checkpoint C1 at 24/34/119 and remote Hard reset at 0/0/0; both cards expose source, difficulty, checkpoint, counts and reset distinction as separate version summaries.
- **UT-059** (error; owner hint task_07; UI view models): Construct slots after logout with account:A slot1 and guest slot2 cached; view model emits only guest slots and never includes account:A's campaign title/progress.
- **UT-060** (happy; owner hint task_06; ContentValidator): Validate the final catalog with 12 worlds, 24 level IDs, 34 exit IDs, 120 medallion IDs and 10 bosses; return zero issues while excluding subareas from the level count.
- **UT-061** (happy; owner hint task_09; QA report gate): qa:report validator receives candidate SHA=abc123, deployed SHA=abc123, all required journey evidence present and zero relevant open bugs; it accepts that complete report without fabricating missing artifacts.
- **UT-062** (boundary; owner hint task_02; One-way terrain): Parameterize a top-only platform at y=100: a rising actor crosses from below without support; a descending bottom crossing 99→101 lands at 100 with that platform's single support ID.
- **UT-063** (boundary; owner hint task_05; Save schema): Decode valid nested Campaign with lives=99,score=9999999,timer=216000 and medallionmask=31; parameterize bounds+1 and NaN; strict runtime validator rejects each invalid field with its path and code, without clamping a damaged save into invented progress.
- **UT-064** (boundary; owner hint task_05; RestartSnapshot): Decode a valid checkpoint with remaining invincibility=270 and float=0; restart preserves 270 rather than assigning the 600-tick default, while a snapshot containing a forbidden lives field is rejected.
- **UT-065** (boundary; owner hint task_01; Gamepad deadzone): InputRouter receives stick x=0.19 then x=0.21 with deadzone=0.2; the first frame has no horizontal held action and the second has Right, without manufacturing a second player.

## Integration Tests

- **IT-001** (owner hint task_05; US-001.EC-1): Boot with an empty local store; SlotService.list returns six entries numbered 1..6 with status=empty.
- **IT-002** (owner hint task_07; US-001.EC-2): Intercept the required atlas request with HTTP 404; BootScene shows retry instead of entering the map; retry after restoring the response enters the map and the preexisting slot checksum is unchanged.
- **IT-003** (owner hint task_05; US-003.EC-2): Lower Hard to Classic, trigger Game Over, reopen the same slot and deliver its old Hard autosave; the resumed campaign remains Classic and the old write is refused.
- **IT-004** (owner hint task_01; US-004.EC-2): Hold Right through the keyboard adapter, dispatch blur, focus the page and intentionally resume without a new keydown; InputRouter/App input guard retains no held Right action.
- **IT-005** (owner hint task_07; US-005): Inject standard gamepad samples through the input adapter: choose slot 1, confirm, run and jump; one Arthur receives the same semantic actions as keyboard input.
- **IT-006** (owner hint task_01; US-005.EC-1): Disconnect the active gamepad during a jump; the game enters paused state with an empty held-action set until an intentional resume.
- **IT-007** (owner hint task_01; US-006.EC-1): Hold touch Right then dispatch pointercancel and orientationchange; Right clears and simulation remains paused after relayout.
- **IT-008** (owner hint task_02; US-007): In a flat-terrain fixture, execute identical run/jump actions in Easy, Classic and Hard for 120 fixed ticks; position and velocity traces match tick-for-tick.
- **IT-009** (owner hint task_03; US-008): Run down a 1:1 slope then crouch-slide into one vulnerable enemy; the terrain contact stays on the slope and the enemy receives one slide defeat.
- **IT-010** (owner hint task_03; US-009): Enter water holding a spring, swim to an eligible surface and leave; spring ownership stays with Arthur throughout the water movement transition.
- **IT-011** (owner hint task_05; US-009.EC-2): Die beside water and restore its authored dry checkpoint; Arthur starts grounded outside the water hazard with one deducted life.
- **IT-012** (owner hint task_03; US-010): Grab a two-sided fence, climb, turn its gate and punch an enemy on the opposite side; the punch targets that side and releasing restores ordinary gravity.
- **IT-013** (owner hint task_02; US-011): Enter a paired upward pipe holding a permitted key; emerge at its safe destination with the same key ID and camera clamped to that subarea's authored extent.
- **IT-014** (owner hint task_03; US-012): In Classic acquire projectile power then reserve mushroom; damage reduces Arthur to small and drops exactly one reserve mushroom collectible.
- **IT-015** (owner hint task_03; US-013): Collect an invincibility item, contact a normally harmful enemy and run until its configured duration expires; contact after expiry applies ordinary damage.
- **IT-016** (owner hint task_03; US-014): Acquire gliding form, reach the authored run-up threshold, take off and perform controlled glide then dive into an eligible enemy; landing exits flight mode.
- **IT-017** (owner hint task_03; US-015): Mount the original creature, ingest each red/blue/yellow shell fixture and activate its effect; fire/flight/landing attack outcomes match the shell ability table.
- **IT-018** (owner hint task_03; US-015.EC-2): Resume a checkpoint whose destination forbids mounts; the restart uses the documented safe unmounted state and does not instantiate the mount inside the restricted subarea.
- **IT-019** (owner hint task_03; US-016): Pick up spring object spring1, place it, reacquire it and throw it upward; ObjectSystem keeps one spring1 with one owner at each transition.
- **IT-020** (owner hint task_03; US-016.EC-2): Lose the mandatory key into a pit and revisit its authored dispenser; one replacement key enables its exit without requiring campaign restart.
- **IT-021** (owner hint task_03; US-017): Strike parameterized reward/hidden/bounce/rotating/grab/message/bonus/spin-break block fixtures with their supported actions; each fixture produces its cataloged single block outcome.
- **IT-022** (owner hint task_05; US-018): Activate a 60-tick temporary switch, advance 60 ticks, then complete sanctuary yellow; temporary coins revert and the yellow sanctuary flag persists after reload.
- **IT-023** (owner hint task_02; US-019): Stand on each moving/falling/guided/rotating/balance platform fixture for its full cycle; actor displacement follows platform displacement without overlap with terrain.
- **IT-024** (owner hint task_05; US-019.EC-2): Save and restore the checkpoint before an autoscrolling crusher section at two rendering cadences; both restarts use the same safe phase and no lethal contact occurs before player input.
- **IT-025** (owner hint task_03; US-020): Run EnemySystem's attack-versus-family fixture matrix for patrol/aerial/aquatic/projectile/armored/pursuit/gaze/regeneration actors; each supported action yields its declared vulnerable or immune result.
- **IT-026** (owner hint task_03; US-020.EC-2): Pause with an enemy projectile near the restart anchor, then call Simulation.restart with its safe snapshot; initialization recreates the authored hazard phase without retaining that projectile.
- **IT-027** (owner hint task_03; US-021): Play each boss fixture with its intended tilted-arena/underside/decoy/ceiling/throwable/rotating-platform solution; Simulation emits exactly one bossVictory and the authored exit event after its defeat method succeeds.
- **IT-028** (owner hint task_03; US-021.EC-2): Throw the last required ammunition object out of the arena; the authored replenisher produces one replacement and the boss remains defeatable.
- **IT-029** (owner hint task_07; US-022): Collect coin100 when coins=99 and lives=5; HUD displays coins=0,lives=6 with a single extra-life event.
- **IT-030** (owner hint task_04; US-023): Collect medallion1, commit at checkpoint, die after collecting medallion2 and retry; medallion1 remains marked and medallion2 is available again.
- **IT-031** (owner hint task_04; US-024): With bonusStars=99, finish an exit granting 1 star; one symbol-alignment minigame consumes 100 stars and records its earned life reward once.
- **IT-032** (owner hint task_05; US-024.EC-1): Commit an exit that grants a bonus, interrupt its animation, reopen the slot; continuation uses the saved reward ledger without replaying that awarded bonus.
- **IT-033** (owner hint task_04; US-026): With lives=3 and a committed checkpoint, fall into a pit; one death commit sets lives=2 and restores checkpoint progression without uncommitted pickups.
- **IT-034** (owner hint task_05; US-026.EC-1): Deliver two lethal contacts during death animation, close/reopen after its durable write; resumed lives is 2 from initial 3, never checkpoint snapshot lives=3.
- **IT-035** (owner hint task_04; US-027): Parameterize zero-life Easy/Classic/Hard campaigns with progress in two worlds and another occupied slot; reset erases exactly level/world/campaign ownership and renews lives to 10/5/3 before Continue, with the other slot unchanged.
- **IT-036** (owner hint task_05; US-027.EC-1): Queue a localVersion=2 checkpoint write, commit the localVersion=3 reset then retry the older write; LocalRepository.commit with its stale expectedVersion returns local-conflict and retains the Game Over destination.
- **IT-037** (owner hint task_04; US-028): Complete normal and secret exits of one accessible level; its two stable exit IDs unlock their two declared map edges, while replay remains selectable.
- **IT-038** (owner hint task_04; US-029): Earn the qualifying main-world secret exit, enter secret01, complete its two required network routes and select secret02; prerequisites permit the authored second secret world.
- **IT-039** (owner hint task_06; US-030): Load the production content catalog and solve each mandatory route fixture; catalog exposes 24 unique playable levels in 10 main and 2 secret worlds with distinct authored layout signatures.
- **IT-040** (owner hint task_07; US-031): Defeat the final staged boss and skip the ending; saved storyComplete=true, exploration is selectable and completion uses 24 levels,34 exits,120 medallions as separate denominators.
- **IT-041** (owner hint task_05; US-032.EC-1): Parameterize IndexedDB denial, quota exhaustion and external clearing; SaveStore/UI emits unavailable/not_saved or empty-after-clear instead of local_saved.
- **IT-042** (owner hint task_05; US-032.EC-2): Corrupt slot2 JSON while slot1 is valid; opening slots exposes recovery for slot2 and slot1 remains playable with its original checksum.
- **IT-043** (owner hint task_05; US-033.EC-1): Expire the access token while network writes fail; a checkpoint still commits locally and UI shows cloud_pending/sign_in_required without discarding the campaign.
- **IT-044** (owner hint task_05; US-033.EC-2): Use account B's real authenticated token to read/update/delete account A's campaign through Supabase; no A payload is returned or modified under RLS.
- **IT-045** (owner hint task_05; US-034.EC-1): Import selected guest slots 1 and 2 with slot2 request failing; result identifies slot1 imported and slot2 pending without overwriting unselected slot3.
- **IT-046** (owner hint task_05; US-035): Two clients advance the same base campaign differently; SyncService detects conflict, UI displays both summaries and explicit selection publishes one whole version without union of their exit sets.
- **IT-047** (owner hint task_05; US-035.EC-1): While conflict screen targets cloud revision4, another device commits revision5; choice of revision4 returns conflict and screen refreshes to revision5 without overwriting it.
- **IT-048** (owner hint task_05; US-035.EC-2): Compare local pre-reset lastTransition with authoritative Game Over reset; UI labels the reset distinction and background sync cannot restore the pre-reset payload; explicit whole-version replacement is the only adoption path.
- **IT-049** (owner hint task_05; US-036): Fail one cloud write after a successful local checkpoint; UI reports locally_saved/cloud_pending and retry publishes the retained local version.
- **IT-050** (owner hint task_05; US-036.EC-1): Abort an IndexedDB transaction after snapshot put but before outbox put; rereading retains the old snapshot and old outbox together, reports not_saved and preserves unrelated slot checksums.
- **IT-051** (owner hint task_05; US-036.EC-2): Queue checkpoint writes revision2/revision3 then a reset revision4; reconnect and retry; SyncService sends the reset without publishing an older checkpoint over it.
- **IT-052** (owner hint task_06; US-037.EC-1): Replay a completed stage with openingSeen=true; StoryController does not force its previously completed opening sequence.
- **IT-053** (owner hint task_07; US-038.EC-1): Reject AudioContext.resume and fullscreen; UI stays playable with an explicit enable-sound action rather than failing campaign entry.
- **IT-054** (owner hint task_07; US-038.EC-2): Open pause menu, dispatch blur and disconnect controller; simulation remains paused with no held action until an explicit resume.
- **IT-055** (owner hint task_07; US-039.EC-2): Switch from gamepad action to keyboard action; InputRouter/UI updates relevant prompts without replacing or resetting the active campaign.
- **IT-056** (owner hint task_09; US-040): Run the content/build/test gate for the candidate revision, then independent QA guest/account journeys; release eligibility is produced only for the same verified revision.
- **IT-057** (owner hint task_09; US-040.EC-2): Provide unavailable Google credentials or no real mobile device evidence to QA reporting; report records blocked/unverified scope and contains no invented pass for those journeys.
- **IT-058** (owner hint task_05; GET game_saves): Real authenticated account A reads game_saves with six rows including one tombstone; GET returns 200 with exactly those six owner rows and payload=null retained for the tombstone.
- **IT-059** (owner hint task_05; GET game_saves): A real anon token attempts GET game_saves after migrations; access is denied by revoked privileges and no campaign payload appears.
- **IT-060** (owner hint task_05; POST game_saves): Real account A inserts empty slot 1 with revision=1, a new mutation UUID and a valid Campaign; returned row has owner A, slot=1, revision=1 and that payload.
- **IT-061** (owner hint task_05; POST game_saves): Repeat an insert for occupied account A slot 1; SQLSTATE 23505/HTTP 409 maps to fetch-and-compare conflict without replacing the first payload.
- **IT-062** (owner hint task_05; POST game_saves): Parameterize slot=7, initial revision=2, payload schemaVersion=999 and UTF-8 payload size>262144 bytes; database rejects each invalid record with 23514 and retains no inserted row.
- **IT-063** (owner hint task_05; PATCH game_saves): CAS own slot 1 expected revision=1 with revision=2, a new mutation UUID and payload=P2; exactly one returned row has revision=2 and payload=P2.
- **IT-064** (owner hint task_05; PATCH game_saves): Two real authenticated clients CAS expected revision=1; one returns revision=2 and the other updates zero rows, reads authoritative revision=2 and reports conflict.
- **IT-065** (owner hint task_05; PATCH game_saves): Parameterize updates changing owner/slot, retaining the same revision or retaining mutation_id; trigger/RLS refuses each documented misuse without altering the existing row.
- **IT-066** (owner hint task_05; Google Auth callback): Cancel Google sign-in and separately supply a PKCE callback with invalid state/code; auth flow shows cancel/error and returns to guest slots with unchanged checksums.
- **IT-067** (owner hint task_07; Performance/browser): Run the supported dense fixture of 200 actors, 64 dynamic surfaces and 128 projectiles for 60s after warmup on the recorded 1080p desktop; report simulation p95<=4ms, frame p95<=20ms and no routine >100ms long task; any observed violation fails that budget.
- **IT-068** (owner hint task_07; Performance/browser): Load boot/current-world content and commit local saves on the recorded reference device; report compressed boot<=3MiB, current world<=8MiB, decoded active assets<=128MiB and local commit p95<=100ms; an unavailable measurement is unverified rather than fabricated.
- **IT-069** (owner hint task_05; Tombstone CAS): In real Supabase, tombstone slot1 at revision2 then recreate it with a new campaign UUID at revision3; delayed old revision1/2 requests update zero rows and cannot resurrect the previous campaign.
- **IT-070** (owner hint task_05; Lost acknowledgement): Persist immutable in-flight mutation M2, simulate its accepted HTTP response being lost and reopen; read remote mutation_id=M2, acknowledge it and then send desired successor M3 without changing M2's payload or reapplying rewards.
- **IT-071** (owner hint task_05; Concurrent local tabs): Two real browser tabs read localVersion=4 for the same guest slot; simultaneous commit(expectedVersion=4) permits one version5 transaction, the other returns local-conflict and its app pauses instead of overwriting.
- **IT-072** (owner hint task_07; Session content cache): Complete mandatory session prefetch, disable network while the game remains open and travel from main01 to an already unlocked main02 level; real cached map/assets load and local saving stays usable without a new HTTP dependency.
- **IT-073** (owner hint task_07; Session content cache): Disconnect before main02's required atlas finishes downloading, then select its unlocked destination; loading view shows retry while the latest saved main01 checksum remains unchanged and no false ready state appears.

## End-to-End Tests

- **E2E-001** (owner hint task_07; US-001): Open a fresh browser → select Jogar sem conta → create slot 1 Classic → skip the opening → enter main01.level01; no sign-in request appears.
- **E2E-002** (owner hint task_07; US-002): Create Classic slot 1 and Easy slot 2; reopen slots; each card retains its own difficulty and independent first-world progress.
- **E2E-003** (owner hint task_07; US-003): Create Hard campaign → return to map → lower to Classic → reload → campaign card shows Classic and no increase action.
- **E2E-004** (owner hint task_07; US-004): Use only keyboard to select slot, move, normal-jump, spin-jump, act, release reserve and pause; remap normal-jump to K then reload; K remains its displayed binding.
- **E2E-005** (owner hint task_07; US-006): At 844x390 touch viewport, hold Right with pointer 1 and Jump with pointer 2; Arthur performs a running jump while page scrollY remains 0.
- **E2E-006** (owner hint task_07; US-006.EC-2): At 320x568 reject requestFullscreen; rotate guidance and a keyboard/touch reachable Back action remain visible with the slot preserved.
- **E2E-007** (owner hint task_07; US-025): Reach the first eligible checkpoint, wait for local-saved status, reload and continue; Arthur appears at that checkpoint with the stored lives and remaining timer and a fresh safe hazard phase.
- **E2E-008** (owner hint task_07; US-032): Create two guest slots, save a checkpoint in slot1, close/reopen and continue without signing in; both slots remain and slot1 resumes its committed checkpoint.
- **E2E-009** (owner hint task_07; US-033): Using a dedicated test account sign in through Google, sync slot1, sign in on a second browser profile and continue; the six account slots include slot1's committed checkpoint.
- **E2E-010** (owner hint task_07; US-034): Create guest slot1, Google-sign in to an account with occupied slot1, inspect both cards and choose guest version; account slot1 adopts that whole version while guest source remains recoverable.
- **E2E-011** (owner hint task_07; US-037): Open title, skip opening and enter main01.level01; UI reads Super Arthur World, character is Arthur and QA captures the restrained Brazilian-fantasy pixel-art scene.
- **E2E-012** (owner hint task_07; US-037.EC-2): At 390x844 with reduced effects enabled, open a boss dialogue; text and its Skip/Continue actions remain visible and hazards retain recognizable foreground contrast.
- **E2E-013** (owner hint task_07; US-038): Start after a user gesture, change music/effects independently, pause for five seconds and reopen; settings persist and paused actor/hazard/timer values are unchanged.
- **E2E-014** (owner hint task_07; US-039): Navigate slots/settings/confirmation entirely by keyboard; visible focus and labels remain usable, and reduced-flash settings leave gameplay outcomes unchanged.
- **E2E-015** (owner hint task_07; US-039.EC-1): At 320px width with large text, open deletion confirmation; named slot and both Cancel/Delete actions remain reachable without covering each other.

## Execution and Evidence

- Implement `npm run test`, `test:integration`, `test:e2e`, `validate:content`, `build` and `qa:report` contracts with nonzero failure exit codes. If the chosen dependency setup uses the equivalent pnpm commands, document and use the locked package manager consistently. Do not report a command passed before executing it.
- A semantic input frame is test data, not a fake gameplay response. Integration fixtures wire the real Simulation, campaign commands, content and repositories where named. Browser hardware/network adapters may be controlled; schema, reducer, collision and actual saved output are not replaced by canned success.
- Unit/fixture definitions use Techspec engineering tuning, including 60Hz, 16px tiles, maximum five catch-up steps, 4px collision substeps, 64px/tick displacement, 0.2 gamepad deadzone, lives 0..99, score <=9999999, residual coin/bonus 0..99, medallion mask 0..31, timer <=216000 and payload <=262144 UTF-8 bytes. Insert whitespace in display text; these are numeric contracts, not release claims.
- Replayed traces at 30/60/120 render FPS must yield identical executed fixed-tick positions/contact/timer outcomes. Bounded slow spikes deliberately discard backlog rather than comparing unequal executed ticks. A gate failure must repair the solver, not remove a mechanic.
- E2E-009/010 and real-Supabase cases cannot pass with only MCP login or mocked OAuth. Record configured game provider, test identities, actual read/write ownership outcomes and second-browser continuation. Do not include token/secret material. Actual mobile Safari/Chrome evidence is separate from Playwright WebKit/viewport emulation.
- Independent task09 QA covers full release journeys beyond authored unit assertions: guest create→checkpoint→ordinary death→Game Over→reopen; Google account→import/conflict→second-device continuation→logout; exploration/boss/secret/100% evidence; keyboard/gamepad/touch/pause/audio; all 24 cataloged levels and all mechanical families. Each stage links actual runs/screenshots/reproduction traces, or explicitly reports unverified/blocked. QA evidence is not an invented test API.
- Publication gate checks the verified source revision, real tested build and relevant open bug registry. Relevant failure prevents publication. After deploy, run guest/account smoke at the real Vercel URL and record displayed SHA/contentVersion; a mismatched deployed revision fails the gate.

## Ownership Hints

| Task | Test IDs | Responsibility |
|---|---|---|
| task_01 | UT-004, IT-004, IT-006, UT-005, IT-007, UT-055, UT-065 | Foundation/input |
| task_02 | IT-008, UT-006, UT-007, UT-008, UT-009, UT-010, UT-011, UT-012, IT-013, UT-013, UT-014, IT-023, UT-027, UT-049, UT-050, UT-056, UT-057, UT-062 | Movement/terrain/transfers |
| task_03 | IT-009, IT-010, IT-012, IT-014, UT-015, UT-016, IT-015, UT-017, UT-018, IT-016, UT-019, UT-020, IT-017, UT-021, IT-018, IT-019, UT-022, IT-020, IT-021, UT-023, UT-024, IT-025, UT-028, IT-026, IT-027, UT-029, IT-028 | Forms/mount/objects/enemies/bosses |
| task_04 | UT-003, UT-025, UT-026, UT-030, IT-030, UT-032, UT-033, IT-031, UT-034, IT-033, UT-037, IT-035, UT-038, IT-037, UT-039, UT-040, IT-038, UT-041, UT-042, UT-045, UT-046 | Rewards/progress/resets/map |
| task_05 | IT-001, UT-001, UT-002, IT-003, IT-011, IT-022, IT-024, UT-031, IT-032, UT-035, UT-036, IT-034, IT-036, IT-041, IT-042, IT-043, IT-044, IT-045, UT-047, IT-046, IT-047, IT-048, IT-049, IT-050, IT-051, UT-051, UT-052, UT-053, UT-054, IT-058, IT-059, IT-060, IT-061, IT-062, IT-063, IT-064, IT-065, IT-066, IT-069, IT-070, IT-071, UT-063, UT-064 | Save/auth/cloud |
| task_06 | IT-039, UT-043, UT-044, IT-052, UT-060 | 24-level content/assets |
| task_07 | E2E-001, IT-002, E2E-002, E2E-003, E2E-004, IT-005, E2E-005, E2E-006, IT-029, E2E-007, IT-040, E2E-008, E2E-009, E2E-010, E2E-011, E2E-012, E2E-013, IT-053, IT-054, E2E-014, E2E-015, IT-055, UT-058, UT-059, IT-067, IT-068, IT-072, IT-073 | UI/browser integration/accessibility/performance |
| task_09 | IT-056, UT-048, IT-057, UT-061 | Independent QA/report/release |
