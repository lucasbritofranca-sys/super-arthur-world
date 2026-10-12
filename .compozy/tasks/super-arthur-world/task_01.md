---
status: completed
title: Browser Foundation, Shared Contracts and Input Adapters
type: frontend
complexity: high
---

# Task 1: Browser Foundation, Shared Contracts and Input Adapters

## Overview

Deliver the single-app foundation and explicit contracts that the gameplay, content and persistence slices consume. Establish real input and pause behavior in a small bootable harness without pretending that the complete campaign or account flows already exist.

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
1. MUST pin the verified compatible Node 24.19.0/pnpm 11.25.0/TypeScript/Vite/Phaser toolchain, commit pnpm-lock.yaml and expose the TechSpec validation scripts.
2. MUST define shared ActionFrame, Simulation, DomainEvent, Campaign, RestartSnapshot, content and repository result contracts in pure TypeScript; keep core free of browser/framework imports.
3. MUST implement keyboard remapping, one-player gamepad arbitration, multi-pointer touch, edge consumption and focus/orientation/disconnect pause guards.
4. MUST establish strict save/content schema boundaries, deterministic fixture helpers and a QA-only real-state bridge disabled in production.
5. MUST leave Supabase/Google provisioning to the persistence slice; unavailable external credentials cannot block deterministic core development.
</requirements>

## Subtasks

- [x] 1.1 Establish reproducible application bootstrap and validation commands.
- [x] 1.2 Declare and validate the shared contracts used by every later slice.
- [x] 1.3 Provide semantic input frames with keyboard, gamepad and touch adapters.
- [x] 1.4 Provide safe pause/resume, device release and intentional user-gesture entry.
- [x] 1.5 Provide deterministic fixtures and a QA build bridge using actual app state.
- [x] 1.6 Record framework compatibility, setup and original-code attribution.

## Implementation Details

Canonical design: [_techspec.md](_techspec.md). Scope references: US-004, US-005, US-006; PRD goals G-02, G-03, G-07. These are proposed create/modify targets because the planning workspace contained no game code. Consolidate nearby files if simpler while preserving authority and ownership boundaries; record actual final paths in the task handoff.

Own bootstrap, shared contracts and input adapters. Later agents consume these contracts; coordinate any necessary shared-type amendment serially with the current owner.

Apply `cy-execute-task` for execution, then `cy-final-verify` before handoff/commit claims. Independent reviewers apply `cy-review-round`; remediation uses `cy-fix-reviews` with native Codex delegation under AGENTS.md.

### Relevant Files

- package.json, pnpm-lock.yaml, tsconfig.json, vite.config.ts — verified Node/pnpm toolchain and frozen lockfile
- index.html, src/main.ts, src/app/bootstrap.ts — single app and composition interfaces
- src/core/types.ts, src/core/events.ts, src/core/schema.ts — pure shared contracts
- src/input/keyboard.ts, src/input/gamepad.ts, src/input/touch.ts, src/input/router.ts — semantic actions
- src/app/pause.ts, tests/fixtures/, tests/unit/input/, tests/integration/input/ — interruption harness
- README.md, .gitignore, .env.example, scripts/ — ordinary build and validation tooling

### Dependent Files

- src/core/ — later solver/mechanics/reducers consume these contracts without importing adapters
- src/persistence/ — later adapters implement repository contracts
- src/content/ and src/ui/ — later content/menu consumers use explicit schemas and action semantics

### Related ADRs

- [ADR-004](adrs/adr-004.md) — applicable boundary and rationale; read its full decision.
- [ADR-007](adrs/adr-007.md) — applicable boundary and rationale; read its full decision.

### QA Impact

new scenarios — add content-addressed untested input/focus/device-release files under docs/qa/scenarios/; retain reproducible fixture traces for task 08.

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

- [x] UT-004 — US-004.EC-1: InputRouter receives remap(normalJump,Escape), already bound to pause.
- [x] UT-005 — US-005.EC-2: Two controllers and keyboard all produce jump on the same tick.
- [x] UT-055 — App/config: Parse two valid VITE_SUPABASE public values versus absent/malformed values.
- [x] UT-065 — Gamepad deadzone: InputRouter receives stick x=0.19 then x=0.21 with deadzone=0.2.

### Integration

- [x] IT-004 — US-004.EC-2: Hold Right through the keyboard adapter, dispatch blur, focus the page and intentionally resume without a new keydown.
- [x] IT-006 — US-005.EC-1: Disconnect the active gamepad during a jump.
- [x] IT-007 — US-006.EC-1: Hold touch Right then dispatch pointercancel and orientationchange.

Validation commands: use the actual locked `pnpm` scripts from the TechSpec — `typecheck`, `lint`, `test`, `test:integration`, `test:e2e`, `validate:content`, `build` and `qa:report` as applicable to the slice. Execute scoped implemented gates for intermediate handoff; full candidate gates and independent browser journeys are mandatory before publication. Record exact commands and nonzero failure results. Browser suites use native Playwright, with supported browser control tools for actual interactive journeys; no shell-only substitute for game/UI verification.

## Success Criteria

- Every assigned test case implemented and passing.
- The app boots with one Phaser instance and real input/pause adapters.
- No competing actor-position authority or production debug-unlock bridge is introduced.
- Requirements, acceptance/edge cases and actual deliverables agree with the canonical specs; unresolved relevant failures block a completion claim.

## Execution evidence

Affected gates passed; final-game verification is deferred to tasks 08/09. See [task-01 verification](evidence/task_01/verification.md) for exact commands, results, source hashes, screenshots, warnings and handoff limits. Root confirmed the supported-browser Start/Pause/Resume journey on the actual foundation. Independent review precedes task 02; no commit was created by this agent.
