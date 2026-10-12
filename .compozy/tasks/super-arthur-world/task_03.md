---
status: completed
title: Forms, Mounts, Objects, Combat and Boss Mechanics
type: frontend
complexity: critical
---

# Task 3: Forms, Mounts, Objects, Combat and Boss Mechanics

## Overview

Deliver all remaining mechanical families through the real solver and a complete interaction matrix. These systems produce ordered domain facts that the campaign slice later commits, while original full-campaign placement belongs to the content slice.

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
1. MUST implement all M-06–M-13 state/interaction families plus terrain combinations required by the PRD, without generic substitutes.
2. MUST implement safe growth/reserve/damage, tick-limited invulnerability/float and controlled charged takeoff/glide/dive/landing.
3. MUST maintain unique mount/carried/tongue/mouth ownership across variants, feeding/growth/wings, dismount, fleeing and restricted-area restarts.
4. MUST implement distinct blocks, temporary/permanent switch event boundaries, enemy behavior/attack responses and ten boss controller families including a staged final encounter.
5. MUST order simultaneous terminal contact as Arthur death before boss victory and emit deduplicated events; persistence/reward ownership remains downstream.
6. MUST close the forms/mount/flight portion of the collision gate and record safe required-object/ammunition replenishment.
</requirements>

## Subtasks

- [x] 3.1 Deliver transformations, reserve and damage protection.
- [x] 3.2 Deliver temporary powers and controlled flight states.
- [x] 3.3 Deliver mount lifecycle, shell combinations and safe inventory ownership.
- [x] 3.4 Deliver carry/throw/kick/timed objects and replenishment.
- [x] 3.5 Deliver block/switch interaction and safe materialization.
- [x] 3.6 Deliver enemy vulnerability and behavior matrix.
- [x] 3.7 Deliver original boss controllers with recovery resources.
- [x] 3.8 Verify combination fixtures and complete the collision gate.

## Implementation Details

Canonical design: [_techspec.md](_techspec.md). Scope references: US-012, US-013, US-014, US-015, US-016, US-017, US-020, US-021, US-008, US-009, US-010; PRD goals G-02, G-03, G-07. These are proposed create/modify targets because the planning workspace contained no game code. Consolidate nearby files if simpler while preserving authority and ownership boundaries; record actual final paths in the task handoff.

Own mechanics and interaction definitions; extend solver interfaces only through coordinated serial amendments. Fixtures are small genuine content, never mocked win/defeat outcomes.

Apply `cy-execute-task` for execution, then `cy-final-verify` before handoff/commit claims. Independent reviewers apply `cy-review-round`; remediation uses `cy-fix-reviews` with native Codex delegation under AGENTS.md.

### Relevant Files

- src/core/mechanics/powers.ts, flight.ts, mount.ts, objects.ts — orthogonal state systems
- src/core/mechanics/blocks.ts, switches.ts, enemies.ts, bosses.ts — documented interactions/events
- src/content/entity-definitions.ts, src/content/vulnerability.ts — strict mechanic definitions
- src/game/entities.ts, src/game/effects.ts — presentation without position ownership
- tests/fixtures/mechanics/, tests/unit/mechanics/, tests/integration/mechanics/ — combined real-core cases

### Dependent Files

- src/core/campaign/ — consumes ordered death/defeat/checkpoint/exit/sanctuary facts
- public/content/ and public/assets/ — full campaign authors place implemented families
- src/ui/ — later HUD/control prompts reflect real mechanics

### Related ADRs

- [ADR-001](adrs/adr-001.md) — applicable boundary and rationale; read its full decision.
- [ADR-002](adrs/adr-002.md) — applicable boundary and rationale; read its full decision.
- [ADR-004](adrs/adr-004.md) — applicable boundary and rationale; read its full decision.
- [ADR-007](adrs/adr-007.md) — applicable boundary and rationale; read its full decision.

### QA Impact

new scenarios — add content-addressed untested power/mount/object/enemy/boss combination files under docs/qa/scenarios/.

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

- [x] UT-015 — US-012.EC-1: Three contact hits arrive during the same protection window on large Classic Arthur.
- [x] UT-016 — US-012.EC-2: Resolve projectile pickup and damaging contact in the same tick on large Classic Arthur.
- [x] UT-017 — US-013.EC-1: Collect 600-tick invincibility after an unpowered checkpoint, advance 30 ticks, pause for 500 wall-clock ticks and transfer subarea.
- [x] UT-018 — US-013.EC-2: Invincible Arthur crosses the pit death boundary.
- [x] UT-019 — US-014.EC-1: Try takeoff below the authored speed threshold and separately remove the gliding form while airborne.
- [x] UT-020 — US-014.EC-2: Dive at maximum authored speed into a 16px wall beside a moving platform.
- [x] UT-021 — US-015.EC-1: Apply a damaging contact to mounted Arthur twice in one tick.
- [x] UT-022 — US-016.EC-1: Offer key1 and shell1 at equal pickup distance plus repeated action edges.
- [x] UT-023 — US-017.EC-1: Two head contacts hit reward block block1 in one tick.
- [x] UT-024 — US-017.EC-2: Reactivate a temporary solid block overlapping Arthur's bounds.
- [x] UT-028 — US-020.EC-1: Shell and projectile both defeat enemy1 on the same tick.
- [x] UT-029 — US-021.EC-1: Resolve terminal Arthur hit and boss final hit on one tick.

### Integration

- [x] IT-009 — US-008: Run down a 1:1 slope then crouch-slide into one vulnerable enemy.
- [x] IT-010 — US-009: Enter water holding a spring, swim to an eligible surface and leave.
- [x] IT-012 — US-010: Grab a two-sided fence, climb, turn its gate and punch an enemy on the opposite side.
- [x] IT-014 — US-012: In Classic acquire projectile power then reserve mushroom.
- [x] IT-015 — US-013: Collect an invincibility item, contact a normally harmful enemy and run until its configured duration expires.
- [x] IT-016 — US-014: Acquire gliding form, reach the authored run-up threshold, take off and perform controlled glide then dive into an eligible enemy.
- [x] IT-017 — US-015: Mount the original creature, ingest each red/blue/yellow shell fixture and activate its effect.
- [x] IT-018 — US-015.EC-2: Resume a checkpoint whose destination forbids mounts.
- [x] IT-019 — US-016: Pick up spring object spring1, place it, reacquire it and throw it upward.
- [x] IT-020 — US-016.EC-2: Lose the mandatory key into a pit and revisit its authored dispenser.
- [x] IT-021 — US-017: Strike parameterized reward/hidden/bounce/rotating/grab/message/bonus/spin-break block fixtures with their supported actions.
- [x] IT-025 — US-020: Run EnemySystem's attack-versus-family fixture matrix for patrol/aerial/aquatic/projectile/armored/pursuit/gaze/regeneration actors.
- [x] IT-026 — US-020.EC-2: Pause with an enemy projectile near the restart anchor, then call Simulation.restart with its safe snapshot.
- [x] IT-027 — US-021: Play each boss fixture with its intended tilted-arena/underside/decoy/ceiling/throwable/rotating-platform solution.
- [x] IT-028 — US-021.EC-2: Throw the last required ammunition object out of the arena.

Validation commands: use the actual locked `pnpm` scripts from the TechSpec — `typecheck`, `lint`, `test`, `test:integration`, `test:e2e`, `validate:content`, `build` and `qa:report` as applicable to the slice. Execute scoped implemented gates for intermediate handoff; full candidate gates and independent browser journeys are mandatory before publication. Record exact commands and nonzero failure results. Browser suites use native Playwright, with supported browser control tools for actual interactive journeys; no shell-only substitute for game/UI verification.

## Success Criteria

- Every assigned test case implemented and passing.
- Every required enemy attack response is explicit and every boss remains solvable after losing consumables.
- Collision gate includes growth clearance, mount attach/detach and flight landing before campaign expansion.
- Requirements, acceptance/edge cases and actual deliverables agree with the canonical specs; unresolved relevant failures block a completion claim.

## Verified implementation handoff (2026-10-12)

Task 03 is complete at its mechanical boundary after self-review and native independent review PASS (`reviews-001/summary.md`). All 27 assigned cases passed; full affected pipeline recorded under `evidence/task_03/verification.md`: 65 unit tests, 25 Chromium tests with one worker, types, lint and production build. Source manifest includes 70 files, SHA256 `954ceb86282819724e0d39a15c1be8123b824975629a219c20d89d691d5a0055`. Five reproduced review issues were fixed and independently checked; their VALID metadata awaits native root closure. No staging or commit was performed.

Actual files consolidate switch behavior into `src/core/mechanics/world.ts`/`blocks.ts` and typed definitions into `model.ts`/`validation.ts`; no empty switches.ts/entity-definitions.ts or presentation ECS was added. Modules `powers.ts`, `flight.ts`, `mount.ts`, `objects.ts`, `enemies.ts`, `vulnerability.ts`, `bosses.ts` and `support.ts` share the authoritative TerrainSimulation/CollisionSolver. Existing movement, schema, events and platform contracts were extended serially. Phaser LevelScene reads real views; the original mechanics-arena harness and tests use temporary geometry, pending final original artwork/content.

Task 04 consumes ordered UUID reward/death/checkpoint/exit/sanctuary facts. Checkpoint snapshots exclude lives and carry mechanical state plus remaining temporary-switch ticks; downstream reward counters must not be overwritten by the simulation's initial counters when the same tick commits a checkpoint. See `docs/qa/mechanics-contract.md` and the detailed evidence handoff. Campaign durability, 120-level placement/balance, final assets/audio, physical devices/cross-browser QA and published-URL verification remain their planned owners. Existing environment/chunk-size advisories are recorded without suppression; no final performance or release claim is made.
