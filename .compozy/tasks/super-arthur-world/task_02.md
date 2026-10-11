---
status: pending
title: Deterministic Terrain, Traversal and Collision Gate
type: frontend
complexity: critical
---

# Task 2: Deterministic Terrain, Traversal and Collision Gate

## Overview

Deliver the authoritative fixed-step platform controller and terrain traversal beneath every mechanic. Prove contact, camera and dynamic-surface behavior with small real authored fixtures before the full content expansion.

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
1. MUST implement 60 Hz simulation, bounded five-step catch-up, 4 px displacement substeps/sweeps and stable contact tie-breaking according to the TechSpec.
2. MUST support running/braking/crouch/jump/spin, variable jump height, slope/flat seams, one-way surfaces and triangular vertical-run entry.
3. MUST support water, climbing, fence-side traversal, pipes/doors, camera limits and dynamic moving/falling/guided/rotating/balance support geometry; enemy/carried-object combinations are implemented with actual mechanics in task 03.
4. MUST preserve one movement authority; Phaser physics/tweens cannot write gameplay positions.
5. MUST provide safe deterministic restart geometry and carrier descriptors without implementing persistence or inventing combat responses.
6. MUST pass the terrain portion of the collision gate; task 03 extends it for forms/mount/flight before task 06 authoring.
</requirements>

## Subtasks

- [ ] 2.1 Implement the fixed-step clock and contact-based grounded state.
- [ ] 2.2 Deliver flat, one-way, slope and vertical-run terrain behavior.
- [ ] 2.3 Deliver swimming, climbing, fence transitions and safe paired transfers.
- [ ] 2.4 Deliver dynamic platform carrying, relative collision and single crush outcome.
- [ ] 2.5 Adapt real simulation views to Phaser camera and rendering.
- [ ] 2.6 Record render-cadence, seam, fast-motion and restart safety evidence.

## Implementation Details

Canonical design: [_techspec.md](_techspec.md). Scope references: US-007, US-008, US-009, US-010, US-011, US-019; PRD goals G-02, G-03, G-07. These are proposed create/modify targets because the planning workspace contained no game code. Consolidate nearby files if simpler while preserving authority and ownership boundaries; record actual final paths in the task handoff.

Own movement/collision/dynamic surfaces and Phaser view adapters. Do not add an enemy/reward/save simulator to satisfy a fixture; downstream integration cases belong to their completing slice.

Apply `cy-execute-task` for execution, then `cy-final-verify` before handoff/commit claims. Independent reviewers apply `cy-review-round`; remediation uses `cy-fix-reviews` with native Codex delegation under AGENTS.md.

### Relevant Files

- src/core/clock.ts, src/core/geometry.ts, src/core/collision.ts — timing and kinematic authority
- src/core/movement.ts, src/core/traversal.ts, src/core/platforms.ts — movement/terrain states
- src/game/scenes/LevelScene.ts, src/game/camera.ts, src/game/render.ts — view-only Phaser adapters
- tests/fixtures/terrain/, tests/unit/physics/, tests/integration/terrain/ — actual small collision arenas

### Dependent Files

- src/core/mechanics/ — forms/mounts/combat consume collision and contact facts
- src/core/campaign/ — continuation reducer consumes safe RestartSnapshot descriptors
- src/content/ — authors target supported collision/path shapes

### Related ADRs

- [ADR-004](adrs/adr-004.md) — applicable boundary and rationale; read its full decision.
- [ADR-007](adrs/adr-007.md) — applicable boundary and rationale; read its full decision.

### QA Impact

new scenarios — add content-addressed untested terrain, seam, water, transfer and crusher scenarios under docs/qa/scenarios/.

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

- [ ] UT-006 — US-007.EC-1: Physics.step sees 250ms render delay and duplicated jump edges.
- [ ] UT-007 — US-007.EC-2: Jump under a ceiling at y=64 with Arthur top y=66.
- [ ] UT-008 — US-008.EC-1: Cross the authored slope-flat-wall junction over 60 ticks.
- [ ] UT-009 — US-008.EC-2: Approach triangular turn block with speed=0, then approach an ordinary wall at full run speed.
- [ ] UT-010 — US-009.EC-1: Cross one water surface ten times with no new jump edge.
- [ ] UT-011 — US-010.EC-1: Deliver ten gate actions during one active side-change transition.
- [ ] UT-012 — US-010.EC-2: Transfer from a rope subarea to a dry-ground destination.
- [ ] UT-013 — US-011.EC-1: Deliver three pipe-entry events during one transfer.
- [ ] UT-014 — US-011.EC-2: Validate a pipe destination=subarea_missing in level main01.level01.
- [ ] UT-027 — US-019.EC-1: Two opposing crusher surfaces close a 12px gap around a 16px actor.
- [ ] UT-049 — Simulation: Simulation.step in a solid-floor fixture for 60 ticks with Right held produces the same view()/event trace for repeated runs of seed=17.
- [ ] UT-050 — Simulation: Reject an initial non-finite x=NaN or displacement budget=65px/tick through core validation.
- [ ] UT-056 — Game adapter: Camera adapter applies right look-ahead to a 384x216 logical view at its rightmost bound.
- [ ] UT-057 — Game adapter: Reject content camera rectangle with width=-1 or nonexistent subarea before scene creation.
- [ ] UT-062 — One-way terrain: Parameterize a top-only platform at y=100: a rising actor crosses from below without support.

### Integration

- [ ] IT-008 — US-007: In a flat-terrain fixture, execute identical run/jump actions in Easy, Classic and Hard for 120 fixed ticks.
- [ ] IT-013 — US-011: Enter a paired upward pipe holding a permitted key.
- [ ] IT-023 — US-019: Stand on each moving/falling/guided/rotating/balance platform fixture for its full cycle.

Validation commands: use the actual locked `pnpm` scripts from the TechSpec — `typecheck`, `lint`, `test`, `test:integration`, `test:e2e`, `validate:content`, `build` and `qa:report` as applicable to the slice. Execute scoped implemented gates for intermediate handoff; full candidate gates and independent browser journeys are mandatory before publication. Record exact commands and nonzero failure results. Browser suites use native Playwright, with supported browser control tools for actual interactive journeys; no shell-only substitute for game/UI verification.

## Success Criteria

- Every assigned test case implemented and passing.
- Identical fixed-tick traces at 30/60/120 FPS have identical supported contacts and outcomes.
- No supported seam, platform carry or fast movement tunnels or embeds the actor.
- Requirements, acceptance/edge cases and actual deliverables agree with the canonical specs; unresolved relevant failures block a completion claim.
