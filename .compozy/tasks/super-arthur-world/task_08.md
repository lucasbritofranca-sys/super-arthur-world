---
status: pending
title: QA Plan and Session Charters
type: qa-report
complexity: high
---

# Task 8: QA Plan and Session Charters

## Overview

Prepare a living independent QA plan for the complete implementation and its highest-risk transitions. Convert actual public player journeys and mechanical/content coverage into executable scenarios and exploratory charters with durable evidence requirements.

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
1. MUST read every ADR, all completed task evidence and existing per-task memory before planning.
2. MUST adapt upstream qa-report guidance through native Codex tools because imported runtime-specific QA skills/daemons are not installed; use qa-docs-path=docs/qa.
3. MUST create journey graphs, scenario files, cycle charters, deduplicated bug registry and dated report schema covering every public surface.
4. MUST map all 40 stories, required mechanical families, 24 playable levels and real guest/account/conflict/reset journeys to runnable scenarios.
5. MUST separate automated fixture, real browser, physical device and external account evidence; identify unavailable resources without assigning pass.
6. MUST include dense-content/performance, one adjacent regression canary and full scope publication gate; no standalone Compozy CLI/UDS/config.toml product tests.
</requirements>

## Subtasks

- [ ] 8.1 Inventory completed public screens, content and integration surfaces.
- [ ] 8.2 Create actual player journey graphs and content-addressed scenarios.
- [ ] 8.3 Map stories/mechanics/levels and failure boundaries to scenario entry points.
- [ ] 8.4 Create focused reset/save/collision and adjacent-canary exploratory charters.
- [ ] 8.5 Define defect severity, evidence, duplicate detection and fix/recheck rules.
- [ ] 8.6 Define real account/device access prerequisites and truthful scope reporting.
- [ ] 8.7 Validate scenario links, coverage completeness and report/verdict schema.

## Implementation Details

Canonical design: [_techspec.md](_techspec.md). Scope references: US-001–US-040 through the living QA coverage plan; PRD goals G-01–G-07. These are proposed create/modify targets because the planning workspace contained no game code. Consolidate nearby files if simpler while preserving authority and ownership boundaries; record actual final paths in the task handoff.

Own QA planning documents only. This task does not implement gameplay, invent verification evidence or duplicate test-case implementation ownership.

The upstream `qa-report` skill contract is implemented by this task's native document workflow; the absent runtime-specific skill is not an installation requirement. Its `qa-docs-path` is `docs/qa`.

### Relevant Files

- docs/qa/journeys/*.md — guest/account/exploration/reset flow graphs
- docs/qa/scenarios/*.md — executable steps, entry points, linked evidence and verdict
- docs/qa/charters/*.md — dated focused and adjacent-canary sessions
- docs/qa/bugs/ — durable defect registry
- docs/qa/reports/ and docs/qa/README.md — dated scope/report and execution convention

### Dependent Files

- task_09.md — native independent QA executes these scenario/charter contracts
- scripts/qa-report.ts — machine-readable coverage/status validation

### Related ADRs

- [ADR-001](adrs/adr-001.md) — applicable boundary and rationale; read its full decision.
- [ADR-002](adrs/adr-002.md) — applicable boundary and rationale; read its full decision.
- [ADR-003](adrs/adr-003.md) — applicable boundary and rationale; read its full decision.
- [ADR-004](adrs/adr-004.md) — applicable boundary and rationale; read its full decision.
- [ADR-005](adrs/adr-005.md) — applicable boundary and rationale; read its full decision.
- [ADR-006](adrs/adr-006.md) — applicable boundary and rationale; read its full decision.
- [ADR-007](adrs/adr-007.md) — applicable boundary and rationale; read its full decision.

### QA Impact

new scenarios — bootstrap/update content-addressed untested docs/qa/scenarios files and charter selection; completed planning is not a passing gameplay verdict.

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

No UT/IT/E2E implementation IDs are assigned: this planning task validates documents. Check that every scenario entry point and evidence path is resolvable, every story/family/level has coverage, every selected charter names executable journeys, and unavailable external evidence is marked blocked/unverified rather than pass. Rerunning owned suites in task 09 does not change ownership.

Validation commands: use the actual locked `pnpm` scripts from the TechSpec — `typecheck`, `lint`, `test`, `test:integration`, `test:e2e`, `validate:content`, `build` and `qa:report` as applicable to the slice. Execute scoped implemented gates for intermediate handoff; full candidate gates and independent browser journeys are mandatory before publication. Record exact commands and nonzero failure results. Browser suites use native Playwright, with supported browser control tools for actual interactive journeys; no shell-only substitute for game/UI verification.

## Success Criteria

- Every assigned test case implemented and passing.
- Every in-scope story/family/level and public journey has a runnable mapped scenario.
- Scenario entry points, evidence paths and charter links resolve with no unclaimed coverage gap.
- Real external prerequisites and publication blockers are explicit.
- Requirements, acceptance/edge cases and actual deliverables agree with the canonical specs; unresolved relevant failures block a completion claim.
