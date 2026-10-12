# Task 01 verification

VERIFICATION REPORT
-------------------
Claim: Task 01 foundation implemented; affected gates green; complete-game gate remains tasks 08/09.
Command: `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:integration`, `pnpm build`; `rg -n '__SAW_QA__|hardwareOverride|phaserInstances' dist/assets`.
Executed: 2026-10-11 21:24–21:26 America/Sao_Paulo, after final source edits. Root inspected real browser entry/pause/resume afterward on port 4242.
Exit code: 0 for the full sequential gate; 1 for rg meaning zero matching production bridge markers.
Output summary: `Already up to date`; `Done in 571ms using pnpm v11.25.0`; typecheck exit 0; `PASS: 18 TypeScript files; no any/debugger/suppression; pure-core boundaries valid`; `Test Files 2 passed (2)`, `Tests 8 passed (8)`; browser `5 passed (42.3s)`; `✓ built in 2.00s`, production JavaScript 1,384.58 kB / gzip 361.37 kB.
Warnings: Vite warns about the complete Phaser engine chunk exceeding its default 500 kB raw threshold. The measured gzip size is recorded rather than hiding the warning or claiming final-game performance. Browser runner reports conflicting NO_COLOR/FORCE_COLOR environment settings. Neither warning denotes a failed test. Final release must measure the complete content/device budgets.
Errors: none in the final gate. Earlier failures were recorded below and corrected or re-executed after setup.
Contract parity: PASS for assigned foundation scope against AGENTS.md, _prd.md, _user_stories.md US-004/005/006, _techspec.md shared contracts/input boundaries, _tests.md UT-004/005/055/065 and IT-004/006/007, _reference_inventory.md, ADR-004/007 and task_01.md. `normalJump` in test prose aliases canonical action `jump`; snapshots exclude lives. Catalog-aware content validation is extended by tasks 05/06 with the actual catalog.
Visual contract: n/a — no named visual reference found. Actual desktop and 390×844 mobile screenshots inspected; readable restrained palette, no mobile horizontal overflow, touch targets at least 48 px. Foundation is explicitly labelled preparation, with no gameplay completion claim.
QA impact: content-addressed input-focus scenario flagged `qa_status: untested` for dedicated task-08/09 independent full-game QA. Scoped automated walks passed all three interruption cases. Root CUA walk confirmed Start → active, Pause → paused/empty actions, Resume → active/empty actions; durable interactive-desktop.jpg copied from root evidence.
Verdict: PASS for task-01 affected scope; independent review completed before advancing.

Independent review: native reviewer prd_game_research reran typecheck, lint (18 files), unit tests (8/8), Chromium integration/boot tests (5/5) and production build, all exit 0. Production bridge marker search found no matches. The reviewer reported no remaining correctness issues and created no empty review round. Root independently checked all 32 source-manifest hashes against the current files and the manifest fingerprint below, inspected the actual supported-browser Start/Pause/Resume journey and its screenshot, and verified the staged diff has no whitespace errors. Approval remains limited to task 01; final gameplay, account and release QA are pending.

## Environment and source identity

- Windows, Node 24.19.0, pnpm 11.25.0; pinned package versions and pnpm-lock.yaml.
- Parent planning HEAD: `49abb85318b8b1272622c68edbd812cc5032388d`. This task makes no commit.
- `source-sha256.txt` records exact source/config/test/license contents. Manifest SHA256: `988568bf4ea17e66289ee9656c288668a8174e461e296f665dbc0e92f9df491e`.
- Runtime screenshots: desktop.png, mobile.png and root interactive-desktop.jpg. Mobile is a Chromium viewport test, not evidence from physical iOS/Android hardware.
- Playwright Chromium 156.0.8078.4 / revision1248; actual Phaser renderer and DOM/input adapters, injected gamepad samples only at the hardware adapter boundary.

## Assigned cases and meaningful regressions

- UT-004 conflict keeps original jump binding; UT-005 keyboard/two pads produce one semantic edge; UT-055 valid public config vs guest fallback; UT-065 0.19/0.21 deadzone.
- IT-004 real keyboard held Right, blur/refocus and explicit resume without new keydown; IT-006 active pad disconnect pauses and clears; IT-007 pointercancel/orientation clears touch Right and retains pause.
- Four additional schema regressions: partial reset metadata, duplicate carried/swallowed ownership and shell effects without shell, unknown fields/oversize/version, snapshots cannot restore lives and unknown map worlds fail.
- Two real browser bootstrap checks: single Phaser instance and intentional entry/pause clock freeze; mobile containment/target dimensions and actual screenshots.

## Corrected setup and failures

- Sandbox pnpm realpath access to installed node_modules failed EPERM; approved execution outside that restriction supplied dependency access.
- Initial lint used removed TypeScript compiler API. Fixed using the pinned TypeScript 7 native API snapshot/project.program AST; no secondary compiler/parser dependency or suppressed checks.
- First browser run happened while Chromium was still downloading and failed executable-not-found. After official Playwright browser installation completed, all five tests passed.
- Neutral controller sampling after Resume was corrected to permit a fresh button edge. Keyboard repeat without a tracked fresh keydown is rejected after release. Lost pointer capture releases touch ownership.
- QA bridge cleanup is also compile-time gated so production output contains none of its state/hardware markers.
- Root CUA surface was available; this child CUA inventory had zero browsers. Root supplied the actual supported-tool browser journey.

## Handoff boundaries

Foundation owns src/core/{types,events,schema,clock}.ts, src/input/, src/app/{bootstrap,pause,config}.ts, app entry/styles, fixtures, scoped tests, configs and scripts. No solver, campaign reducer, cloud client, content catalog, production game journeys or account provisioning is claimed. Later owners add real gates for their slices; there are no success-returning future placeholders. Core imports stay pure TypeScript. A single input router arbitrates one player; the render engine does not own gameplay positions. Schema references may be enriched serially when the actual content registry exists.

Licenses: exact installed Phaser LICENSE.md preserved in docs/licenses/phaser.txt; official template MIT license fetched at d1d7d58acfcf47f97642bcb8b4967071b85f8db9 preserved in docs/licenses/phaser-template.txt. No template assets, Nintendo assets, melonJS code or Celeste code were copied in task01.
