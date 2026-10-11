---
status: pending
title: Campaign Progression, Rewards and Scoped Reset Reducers
type: frontend
complexity: critical
---

# Task 4: Campaign Progression, Rewards and Scoped Reset Reducers

## Overview

Deliver the pure campaign transition rules that own progression, rewards, continuation and penalties. Preserve the exact difficulty/reset choices and provide coherent view models for map and completion without delegating authority to UI or storage callbacks.

<critical>
- ALWAYS READ the PRD, the TechSpec, and their catalogs (`_user_stories.md`, `_tests.md`) before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — implement every test case assigned in ## Tests
</critical>

<critical>
- Read AGENTS.md and applicable ADRs. NO WORKAROUNDS: do not weaken scope, suppress a failing gate, fabricate evidence or replace actual core behavior with canned success.
- Execute through native Codex subagents with the inherited model; Compozy contributes only authoring conventions.
- Dependency relationships live only in the canonical _tasks.md graph; report actual platform blockers and keep unaffected work moving.
</critical>

<requirements>
1. MUST implement six-slot domain isolation, map-only downward difficulty changes and Easy/Classic/Hard profiles without changing terrain/physics.
2. MUST deduct ordinary death once from current lives, never checkpoint-era lives; terminal death commits exactly one scoped reset and renewed lives before Continue.
3. MUST implement PRD-owned level/world/campaign reset boundaries, sanctuary revocation, retained visited-world access and invalidated continuation.
4. MUST commit medallions, exits, bonuses and unique reward marks together; enforce bounded counters and separate 120/150/600 completion denominators.
5. MUST derive normal/secret/replay/secret-network routes from actual content conditions and preserved access, avoiding stale unlocked caches.
6. MUST expose immutable campaign command results and persistence intent; do not fake local/cloud durability in a pure reducer test.
</requirements>

## Subtasks

- [ ] 4.1 Implement valid new/continue/difficulty campaign transitions.
- [ ] 4.2 Implement deterministic reward counters, chains and unique achievement ledger.
- [ ] 4.3 Implement checkpoint/exit snapshots and tentative-versus-committed collection.
- [ ] 4.4 Implement ordinary death and three Game Over reset scopes.
- [ ] 4.5 Implement derived map routes, sanctuary ownership and secret-world access.
- [ ] 4.6 Implement story victory and complete-exploration computation.
- [ ] 4.7 Produce view models and deterministic reducer fixtures for persistence/UI.

## Implementation Details

Canonical design: [_techspec.md](_techspec.md). Scope references: US-003, US-018, US-022, US-023, US-024, US-026, US-027, US-028, US-029, US-031; PRD goals G-04, G-06, G-07. These are proposed create/modify targets because the planning workspace contained no game code. Consolidate nearby files if simpler while preserving authority and ownership boundaries; record actual final paths in the task handoff.

Own campaign reducers and view models. Keep localVersion, outbox and remote acknowledgements in persistence; no direct database or DOM imports in core.

Apply `cy-execute-task` for execution, then `cy-final-verify` before handoff/commit claims. Independent reviewers apply `cy-review-round`; remediation uses `cy-fix-reviews` with native Codex delegation under AGENTS.md.

### Relevant Files

- src/core/campaign/reducer.ts, difficulty.ts, rewards.ts — campaign authority
- src/core/campaign/checkpoints.ts, resets.ts, progression.ts, completion.ts — continuation/ownership graph
- src/app/campaign-commands.ts, src/app/view-models.ts — command and UI projection boundary
- tests/unit/campaign/, tests/integration/campaign/ — actual reducer and mechanic/event integration

### Dependent Files

- src/persistence/ — transaction and CAS adapters persist reducer output
- src/ui/ and src/game/scenes/OverworldScene.ts — later UI consumes authoritative map/HUD summaries
- src/content/worlds.ts — authored graph conforms to route/reset ownership rules

### Related ADRs

- [ADR-001](adrs/adr-001.md) — applicable boundary and rationale; read its full decision.
- [ADR-002](adrs/adr-002.md) — applicable boundary and rationale; read its full decision.
- [ADR-003](adrs/adr-003.md) — applicable boundary and rationale; read its full decision.
- [ADR-005](adrs/adr-005.md) — applicable boundary and rationale; read its full decision.
- [ADR-007](adrs/adr-007.md) — applicable boundary and rationale; read its full decision.

### QA Impact

new scenarios — add content-addressed untested reward/death/reset/sanctuary/secret-route scenarios under docs/qa/scenarios/.

### References

- [Phaser v4.2.1 package](https://github.com/phaserjs/phaser/blob/v4.2.1/package.json) and [Arcade World](https://github.com/phaserjs/phaser/blob/v4.2.1/src/physics/arcade/World.js) — engine boundary; not a slope solver.
- [Official Vite template, pinned revision](https://github.com/phaserjs/template-vite-ts/tree/d1d7d58acfcf47f97642bcb8b4967071b85f8db9) — bootstrap reference, audit compatibility with our pins.
- [melonJS player](https://github.com/melonjs/melonJS/blob/20.8.0/packages/examples/src/examples/platformer/entities/player.ts), [parity tests](https://github.com/melonjs/melonJS/blob/20.8.0/packages/melonjs/tests/builtin-adapter-platformer-parity.spec.js) and [physics bug-hunt tests](https://github.com/melonjs/melonJS/blob/20.8.0/packages/melonjs/tests/builtin-adapter-physics-bug-hunt.spec.js) — revision 86f2ff3a71120bf6650b80a31f7fdc7c7415b24b, limited algorithm/test ideas.
- [Celeste Player.cs, pinned revision](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/Source/Player/Player.cs) — movement/state reference only; do not import its giant class or unrelated mechanics.
- [Tiled properties](https://doc.mapeditor.org/en/stable/manual/custom-properties/) — authored static level contract.
- [_techspec.md](_techspec.md), [_tests.md](_tests.md), [_user_stories.md](_user_stories.md), [_reference_inventory.md](_reference_inventory.md) and [research](analysis/framework-research.md) — canonical requirements/source confidence.

No `.resources/` checkout is claimed. Consult the pinned remote files above and record attribution/exact revisions for code actually copied; code licenses do not transfer asset rights. No named normative mock/screenshot exists in the current canonical artifacts: visual parity contract is not applicable. For visible game/UI, inspect durable actual screenshots at the required viewports and judge PRD art/readability requirements without inventing a reference image.

## Deliverables

- The complete slice described in Overview, requirements and subtasks, with real integration at its declared boundary.
- Concrete files and updated setup/player/QA documentation for the touched surface.
- Every test case assigned in `## Tests` implemented and passing **(REQUIRED)**; task 08 has explicit document checks instead of gameplay-test ownership.
- Fresh command/evidence record identifying source revision, fixture/environment, observed result and any genuine blocked external scope; no passing claim for unavailable evidence.

## Tests

Cases assigned from [_tests.md](_tests.md), the canonical test contract. Read the full definition before implementation; the descriptions below identify ownership and behavior, not substitute case specifications. Replace only I/O/hardware adapters where authorized, never the participating core/reducer/schema behavior.

### Unit

- [ ] UT-003 — US-003.EC-1: Request lowerDifficulty(easy) through the app command while screen=level and campaign difficulty=hard.
- [ ] UT-025 — US-018.EC-1: Reactivate a temporary switch on its conversion tick, then reload its checkpoint.
- [ ] UT-026 — US-018.EC-2: Classic-reset main03 which owns yellow sanctuary while green belongs to main01.
- [ ] UT-030 — US-022.EC-1: Add 500 score to score=9999998 and award a chain life when lives=99.
- [ ] UT-032 — US-023.EC-1: Starting with medallion1 committed, collect medallion2 then die before checkpoint.
- [ ] UT-033 — US-023.EC-2: Complete the five-medallion set, commit, then recollect a marked medallion in replay.
- [ ] UT-034 — US-024.EC-2: Enter a declared repeatable replenishment room with bonusStars=99 twice.
- [ ] UT-037 — US-026.EC-2: Die with lives=1 at an active checkpoint.
- [ ] UT-038 — US-027.EC-2: Classic-reset secret01 while main01 and main02 are visited.
- [ ] UT-039 — US-028.EC-1: Complete exit main01.level03.secret twice.
- [ ] UT-040 — US-028.EC-2: Classic-reset the world owning a secret shortcut.
- [ ] UT-041 — US-029.EC-1: Travel to secret02 before its required network exits are complete.
- [ ] UT-042 — US-029.EC-2: Reset secret01 after visiting secret02.
- [ ] UT-045 — US-031.EC-1: With 120 levels,149 exits,600 medallions, then separately 120/150/599, CompletionSystem reports below 100% in both fixtures.
- [ ] UT-046 — US-031.EC-2: Classic-reset one completed world after 100%.

### Integration

- [ ] IT-030 — US-023: Collect medallion1, commit at checkpoint, die after collecting medallion2 and retry.
- [ ] IT-031 — US-024: With bonusStars=99, finish an exit granting 1 star.
- [ ] IT-033 — US-026: With lives=3 and a committed checkpoint, fall into a pit.
- [ ] IT-035 — US-027: Parameterize zero-life Easy/Classic/Hard campaigns with progress in two worlds and another occupied slot.
- [ ] IT-037 — US-028: Complete normal and secret exits of one accessible level.
- [ ] IT-038 — US-029: Earn the qualifying main-world secret exit, enter secret01, complete its ten required network routes and select secret02.

Validation commands: use the actual locked `pnpm` scripts from the TechSpec — `typecheck`, `lint`, `test`, `test:integration`, `test:e2e`, `validate:content`, `build` and `qa:report` as applicable to the slice. Execute scoped implemented gates for intermediate handoff; full candidate gates and independent browser journeys are mandatory before publication. Record exact commands and nonzero failure results. Browser suites use native Playwright, with supported browser control tools for actual interactive journeys; no shell-only substitute for game/UI verification.

## Success Criteria

- Every assigned test case implemented and passing.
- Every reset touches exactly its declared scope and active slot.
- Committed rewards and continuation never restore spent lives or resurrect erased progress.
- Requirements, acceptance/edge cases and actual deliverables agree with the canonical specs; unresolved relevant failures block a completion claim.
