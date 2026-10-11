---
status: pending
title: Original Assets and the Complete 120-Level Campaign
type: frontend
complexity: high
---

# Task 6: Original Assets and the Complete 120-Level Campaign

## Overview

Author the full original campaign and its restrained Brazilian-fantasy presentation using the proven mechanics and route contracts. Deliver real varied playable layouts, original licensed assets and explicit recovery paths rather than repeating one generated layout with new colors.

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
1. MUST provide exactly 10 main worlds, 2 secret worlds, 120 levels, 150 exits, 600 medallions, four sanctuary levels and ten main-world bosses.
2. MUST provide meaningful distinct traversal/objective/hazard/secret arrangements and design notes; subareas and alternate exits do not inflate level count.
3. MUST use validated Tiled JSON, stable identities, supported collision shapes, safe checkpoint/transfer anchors, difficulty masks and mandatory-item recovery.
4. MUST place every required family in actual authored levels with the reference ledger mapping; fixture coverage alone is insufficient.
5. MUST supply original Arthur/mount/enemy/boss/tile sprites, muted readable pixel palettes, brief Portuguese narrative, original audio and attribution/license manifest.
6. MUST validate route reachability, secret conditions, counts, duplicate/dangling IDs, geometry uniqueness signals, checkpoint masks and load/decode budgets.
7. MUST consume established solver/reducer interfaces without mutating persistence code in the parallel wave.
</requirements>

## Subtasks

- [ ] 6.1 Author world order, route graph and complete content identities.
- [ ] 6.2 Author 120 distinct layouts including secrets, sanctuaries and all boss stages.
- [ ] 6.3 Validate safe entry/checkpoint/subarea destinations and difficulty placement.
- [ ] 6.4 Provide mandatory power/key/mount/ammunition replenishment or alternatives.
- [ ] 6.5 Produce original pixel atlases, effects, music and sound with provenance.
- [ ] 6.6 Provide short skippable opening/boss/ending and cosmetic-only secret variant.
- [ ] 6.7 Deliver content loader, budgeted current-world prefetch and completeness validator.
- [ ] 6.8 Record per-level mechanical coverage and playable route evidence.

## Implementation Details

Canonical design: [_techspec.md](_techspec.md). Scope references: US-030, US-037; PRD goals G-01, G-02, G-06, G-07. These are proposed create/modify targets because the planning workspace contained no game code. Consolidate nearby files if simpler while preserving authority and ownership boundaries; record actual final paths in the task handoff.

Own content/asset pipeline and authoring. Collision failures return to solver/mechanics owners and block the expansion gate; do not trim the required catalog.

Apply `cy-execute-task` for execution, then `cy-final-verify` before handoff/commit claims. Independent reviewers apply `cy-review-round`; remediation uses `cy-fix-reviews` with native Codex delegation under AGENTS.md.

### Relevant Files

- src/content/catalog.ts, worlds.ts, loader.ts, validator.ts — validated actual production content
- public/content/worlds/, public/content/levels/ — 120 authored Tiled maps and world graph
- public/assets/sprites/, tiles/, audio/, manifest.json — original media/provenance
- src/game/story.ts, src/game/assets.ts — narrative/loading adapters
- scripts/validate-content.ts, docs/content-catalog.md, tests/integration/content/ — catalog and reachability evidence

### Dependent Files

- src/game/scenes/LevelScene.ts and OverworldScene.ts — integrate real content/views
- src/core/campaign/completion.ts — consumes final stable counts and routes
- src/ui/story.ts and src/ui/hud.ts — later full app uses original presentation

### Related ADRs

- [ADR-001](adrs/adr-001.md) — applicable boundary and rationale; read its full decision.
- [ADR-004](adrs/adr-004.md) — applicable boundary and rationale; read its full decision.
- [ADR-007](adrs/adr-007.md) — applicable boundary and rationale; read its full decision.

### QA Impact

new scenarios — add content-addressed untested main-route, secret-route, medallion, story and individual level/arena files under docs/qa/scenarios/.

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

- [ ] UT-043 — US-030.EC-1: Parameterize malformed catalogs with missing level120, duplicate level001 and an exit to unknown level999.
- [ ] UT-044 — US-030.EC-2: Validate a mandatory flight route requiring a consumed feather with no dispenser or ground alternative.
- [ ] UT-060 — ContentValidator: Validate the final catalog with 12 worlds, 120 level IDs, 150 exit IDs, 600 medallion IDs and 10 bosses.

### Integration

- [ ] IT-039 — US-030: Load the production content catalog and solve each mandatory route fixture.
- [ ] IT-052 — US-037.EC-1: Replay a completed stage with openingSeen=true.

Validation commands: use the actual locked `pnpm` scripts from the TechSpec — `typecheck`, `lint`, `test`, `test:integration`, `test:e2e`, `validate:content`, `build` and `qa:report` as applicable to the slice. Execute scoped implemented gates for intermediate handoff; full candidate gates and independent browser journeys are mandatory before publication. Record exact commands and nonzero failure results. Browser suites use native Playwright, with supported browser control tools for actual interactive journeys; no shell-only substitute for game/UI verification.

## Success Criteria

- Every assigned test case implemented and passing.
- The validator accepts the full 120-level/150-exit/600-medallion catalog and rejects malformed alternatives.
- Every mechanical family has actual playable placements and every mandatory route is recoverable.
- Layout hashes and independent play/design review substantiate variation.
- Requirements, acceptance/edge cases and actual deliverables agree with the canonical specs; unresolved relevant failures block a completion claim.
