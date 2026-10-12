# Task 04 verification and handoff

Base: task 03 commit `f3a0070`. Execution resumed on 2026-10-12 after the usage window reopened; prior local work was preserved. No stage, commit, push, cloud change or later task implementation was performed by this author.

## Verification report

Claim: task 04 campaign authority implemented; scoped implemented gates pass. Complete game/release eligibility remains later work.

Command: `pnpm typecheck`; `pnpm lint`; `pnpm test`; `pnpm build`; `pnpm test:integration --workers=1`; production QA-bridge scan; all manifest row hashes.

Executed: fresh final serial pipeline on 2026-10-12, approximately 17:11–17:13 UTC, after source freeze. Node 24.19.0, pnpm 11.25.0; Chromium via locked Playwright 1.64.0 and Vite QA-mode server. Windows bundled Node/pnpm directories prepended to PATH. External runtime access used the authorized escalation.

Exit code: 0 for every final command.

Output summary: strict types pass; `PASS: 64 TypeScript files; no any/debugger/suppression; pure-core boundaries valid`; Vitest `Test Files 9 passed (9), Tests 87 passed (87)`; Vite `36 modules transformed`, successful production build; Chromium `31 passed (1.6m)` with one worker; `PASS: production build excludes QA bridge`; manifest 85 files, zero mismatches.

Warnings: existing Phaser vendor/application chunk is 1,443.61 kB minified, 378.51 kB gzip, exceeding Vite's default 500 kB chunk advisory. It remains below the initial transfer budget and is disclosed, not suppressed. Playwright warns that FORCE_COLOR overrides NO_COLOR. Vitest prints worker-startup optimization advice. No gameplay failure or skipped case remains in the final pipeline. This slice does not establish measured performance on physical mobile hardware.

The final `git diff --check` exited 0 and emitted Git's configured Windows LF-to-CRLF informational warnings; no whitespace defect was reported.

Errors: none in the final records. Intermediate failures and their concrete corrections are retained in `failure-history.md` and qualified browser logs. No fake future gate script or retry-based workaround was added.

Contract parity: PASS for task 04's resolved scope. Read full AGENTS, PRD, user-story catalog, TechSpec, test catalog, graph, idea, ADR-001–007, references/research, authoring review and task contracts. Independent mandatory survey resolved 151 local Markdown links and identified no additional missing normative artifact. `_examples.md`, `_qa.md`, memory and handoffs were absent and not claimed. Checklist items 1–30 are addressed by the implementation, cases and evidence below. The full content catalog, UI/storage and release claims remain assigned elsewhere, rather than reinterpreting their requirements.

Visual contract: n/a — no named visual reference found for this domain slice. Actual current harness screenshots `mechanics-desktop.png` and `mechanics-mobile.png` were copied from fresh Playwright `testInfo.outputPath` outputs and opened/inspected. Arthur, form/reserve readout and controls remain legible, including the 390px mobile viewport without horizontal overflow. These are development arena evidence, not original final pixel assets or campaign-menu evidence.

QA impact: added `docs/qa/scenarios/campaign-reset-ff0549ffc7c9.md`, `qa_status: untested`, explicitly deferred to the graph's dedicated independent task-08/09 phase once tasks 05–07 assemble the real player journey. No stale pass verdict or disk/cloud durability claim.

Verdict: PASS for the implemented task 04 slice and current gates; independent review report and root's native issue finalizer complete the review/commit handoff. No production publication verdict is implied.

## Exact source evidence

`source-sha256.txt` lists 85 source/test/config/license/player/QA files. Manifest SHA-256: `d0887a3cae00a08d39fb17f16b955420126c8689848e4f54a5452da482e16408`. All rows were independently checked by the reviewer with zero mismatches. Evidence/tracking reports are excluded from the source fingerprint so recording completion does not silently invalidate the tested code. Logs: `typecheck.log`, `lint.log`, `unit.log`, `build.log`, `integration.log`, `production-bridge.log`. Earlier evidence for tasks 01–03 was not overwritten.

## Deliverables and parity

| Contract | Actual implementation and proof |
| --- | --- |
| Six solo slots, identity isolation and difficulty | `src/app/campaign-commands.ts` and core reducer; UT-003 stops the app call before the real reducer during play; IT-035 replaces exactly the active slot and compares another occupied slot byte-for-byte. Core profiles are 10/5/3 lives, 1.5/1/.8 timer, 120/60/30 protection ticks. |
| Pure command/persistence boundary | `model.ts`, `reducer.ts`, `catalog.ts`; recursive frozen results, untouched input, attempt UUID guards, validated version/reference boundaries and persistence intent. No DOM/storage/network/core framework imports; boundary lint and types pass. |
| Current lives and checkpoint overlays | `applyEvents`, `snapshotRun`, `continueCampaign`; lives are outside RestartSnapshot. Same-tick reward counters overwrite stale simulation counters. Real switch restart UT-025, current-life pit IT-033 and collection IT-030; extra regression asserts nested immutability and coins99+2→life+residual1 before checkpoint. |
| Tentative collections and unique rewards | `rewards.ts`; bitmasks 0–31 and level-owned set mark. UT-032/033 commit only at safe boundaries, discard later attempts and never duplicate the life award. |
| Scoped Game Over | `resets.ts`; Easy active phase, Classic current world, Hard campaign. Owner-filtered sanctuaries/exits/medallions/marks, full Hard ledger clear, preserved campaign/slot identity, renewed lives before Continue. UT-026/037/038/040/042 and IT-035, extra duplicate-death/full-ledger regression. |
| Derived routes and access | `progression.ts`; current committed prerequisites plus retained visited entrances, no cached unlock list. UT-039–042 and IT-037/038 assert distinct exits, shortcut relock, ten-network prerequisites and retained second-secret entrance. Small test arenas are explicitly not the final 120-level authored catalog. |
| Counters, chains and actual pickups | `rewards.ts`, real world coin/life pickups and actual landing `chainReset`; score table and saturation, coin threshold. UT-030, actual repeatable block-room UT-034 and actual pickup/landing regression. |
| Bonus continuation | `bonus.ts`, `settleBonus`, optional v1 `pendingBonus`; original deterministic symbol stops and eight qualifying lines, threshold consumed once, interrupted stops resume and settlement is idempotent. IT-031 and interrupted-bonus regression. |
| Exit eligible mechanics | Actual ExitEvent carries cloned RunState; schema validates and reducer overlays reward counters, clears level temporary effects and commits final eligible state. Independent high issue reproduced/repaired; same-tick pickup and post-checkpoint damage regressions prove persisted/reopened final state. |
| Story/exploration/cosmetics and projections | Final-boss hook, `refreshCosmetic`, separate 120/150/600 computation and `src/app/view-models.ts`; UT-045/046 proves 149 exits or599medallions stays below100 and world reset lowers progress. Final short-story presentation is task07; optional v1 `openingSeen` is preserved for it. |

Assigned canonical cases: all 15 UT IDs (003,025,026,030,032,033,034,037,038,039,040,041,042,045,046) and six IT IDs (030,031,033,035,037,038), exactly 21. Unit file has 22 cases including seven meaningful regressions; complete repository suite has 87 units. Browser campaign fixtures execute real core commands/simulation through Vite and attach actual traces, while the complete implemented Chromium suite also checks prior input/mechanics/collision/rendering regressions.

## Next integration contracts

- Task 05 persists the emitted campaign atomically, including optional `pendingBonus` and `openingSeen`; absent optional v1 fields mean null/false. It owns localVersion/outbox/account/RLS/CAS and real error handling, not this reducer.
- Task 06 supplies the validated original catalog and ownership graph. `CampaignCatalog` has world entrances/secrecy, level definitions, route conditions, owning sanctuary records, final boss and secret-network exits. `catalogIssues` checks references without substituting repeated test arenas for original content.
- Task 07 passes each simulation tick's facts as one batch, enters new attempt UUIDs after continue/restart, uses current run views for HUD, and consumes actual ExitEvent.run. It owns complete maps/slot/settings/story/bonus screens and final gameplay presentation. Enemy population difficulty, changing water/autoscroll authored presentation and recovery metadata remain explicit 06/07 integration duties from their prep, not a reduced scope.
- No external code or assets were copied for the campaign algorithms; existing exact software attribution remains intact. No Nintendo assets/layouts are present.
- Review round 002 issue001 is VALID after repair and independent reproduction; root's native finalizer owns formal closure. Root owns the eventual commit. Tasks 05/06 were not started by this author.
