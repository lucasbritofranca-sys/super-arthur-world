---
status: pending
title: Complete Browser Experience, Accessibility and Integration Remediation
type: frontend
complexity: critical
---

# Task 7: Complete Browser Experience, Accessibility and Integration Remediation

## Overview

Join the independently owned core, saves and complete content into the finished public browser experience. Verify complete player flows, usable input/presentation and measured performance, and remediate independent implementation review findings before the QA pair starts.

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
1. MUST integrate title/slots/difficulty/map/phase/HUD/pause/settings/story/account/save flows through real commands, content and repositories.
2. MUST support keyboard-only menus, gamepad guidance and simultaneous touch with reachable Portuguese labels, non-color-only cues and reduced effects.
3. MUST persist audio/text/input settings and pause on overlays/focus/orientation/disconnect with intentional Resume.
4. MUST keep 384x216 pixel canvas scaling and >=48 CSS-px touch targets usable at required narrow portrait and landscape viewports.
5. MUST run complete Chromium/Firefox/WebKit player journeys and record exact browser/device scope, transfer/decode and timing budget measurements.
6. MUST request independent native review, delegate fixes and rerun affected tests until relevant implementation issues are resolved.
7. MUST not claim physical mobile/Safari, Google OAuth or source fidelity evidence from emulation/fakes; retain concrete access limitations for final QA.
</requirements>

## Subtasks

- [ ] 7.1 Compose final screens/scenes, campaign commands and repository acknowledgements.
- [ ] 7.2 Deliver readable HUD/map/completion and original story presentation.
- [ ] 7.3 Deliver accessible menus, confirmations, touch layouts and device prompts.
- [ ] 7.4 Persist sound/text/reduced-effect/binding settings and browser-denied API recovery.
- [ ] 7.5 Verify full guest, reset, account and resume flows against real content.
- [ ] 7.6 Measure representative dense content, load/memory and frame/simulation budgets.
- [ ] 7.7 Run independent implementation review and delegated remediation.
- [ ] 7.8 Update setup/player documentation and living QA scenario verdicts.

## Implementation Details

Canonical design: [_techspec.md](_techspec.md). Scope references: US-001, US-005, US-022, US-031, US-038, US-039, US-002, US-003, US-004, US-006, US-025, US-032, US-033, US-034, US-037; PRD goals G-01–G-07. These are proposed create/modify targets because the planning workspace contained no game code. Consolidate nearby files if simpler while preserving authority and ownership boundaries; record actual final paths in the task handoff.

Own final UI/integration and review remediation coordination. Do not change core/save/content contracts covertly; fixes use their owner or an explicitly serialized remediation agent.

Apply `cy-execute-task` for execution, then `cy-final-verify` before handoff/commit claims. Independent reviewers apply `cy-review-round`; remediation uses `cy-fix-reviews` with native Codex delegation under AGENTS.md.

### Relevant Files

- src/main.ts, src/app/application.ts — final composition and lifecycle wiring
- src/ui/title.ts, map.ts, hud.ts, pause.ts, settings.ts, story.ts, styles.css — complete public surfaces
- src/game/scenes/BootScene.ts, LevelScene.ts, OverworldScene.ts — real content transitions/rendering
- tests/e2e/, playwright.config.ts, docs/player-guide.md — full browser journeys
- docs/qa/, .compozy/tasks/super-arthur-world/reviews-*/ — durable review/QA evidence

### Dependent Files

- docs/qa/scenarios/, journeys/, charters/ — final QA plan derives from completed surfaces
- scripts/qa-report.ts — consumes measured scope and reviewed revision
- README.md and docs/integrations.md — commands and real access limitations

### Related ADRs

- [ADR-001](adrs/adr-001.md) — applicable boundary and rationale; read its full decision.
- [ADR-002](adrs/adr-002.md) — applicable boundary and rationale; read its full decision.
- [ADR-003](adrs/adr-003.md) — applicable boundary and rationale; read its full decision.
- [ADR-004](adrs/adr-004.md) — applicable boundary and rationale; read its full decision.
- [ADR-005](adrs/adr-005.md) — applicable boundary and rationale; read its full decision.
- [ADR-006](adrs/adr-006.md) — applicable boundary and rationale; read its full decision.
- [ADR-007](adrs/adr-007.md) — applicable boundary and rationale; read its full decision.

### QA Impact

new scenarios — add/reset content-addressed untested complete guest/account, device, accessibility, story and performance files under docs/qa/scenarios/ and record actual verdicts.

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

- [ ] UT-058 — UI view models: Construct a conflict view for local Classic checkpoint C1 at 120/150/599 and remote Hard reset at 0/0/0.
- [ ] UT-059 — UI view models: Construct slots after logout with account:A slot1 and guest slot2 cached.

### Integration

- [ ] IT-002 — US-001.EC-2: Intercept the required atlas request with HTTP 404.
- [ ] IT-005 — US-005: Inject standard gamepad samples through the input adapter: choose slot 1, confirm, run and jump.
- [ ] IT-029 — US-022: Collect coin100 when coins=99 and lives=5.
- [ ] IT-040 — US-031: Defeat the final staged boss and skip the ending.
- [ ] IT-053 — US-038.EC-1: Reject AudioContext.resume and fullscreen.
- [ ] IT-054 — US-038.EC-2: Open pause menu, dispatch blur and disconnect controller.
- [ ] IT-055 — US-039.EC-2: Switch from gamepad action to keyboard action.
- [ ] IT-067 — Performance/browser: Run the supported dense fixture of 200 actors, 64 dynamic surfaces and 128 projectiles for 60s after warmup on the recorded 1080p desktop.
- [ ] IT-068 — Performance/browser: Load boot/current-world content and commit local saves on the recorded reference device.
- [ ] IT-072 — Session content cache: Complete mandatory session prefetch, disable network while the game remains open and travel from main01 to an already unlocked main02 level.
- [ ] IT-073 — Session content cache: Disconnect before main02's required atlas finishes downloading, then select its unlocked destination.

### End-to-end

- [ ] E2E-001 — US-001: Open a fresh browser → select Jogar sem conta → create slot 1 Classic → skip the opening → enter main01.level01.
- [ ] E2E-002 — US-002: Create Classic slot 1 and Easy slot 2.
- [ ] E2E-003 — US-003: Create Hard campaign → return to map → lower to Classic → reload → campaign card shows Classic and no increase action.
- [ ] E2E-004 — US-004: Use only keyboard to select slot, move, normal-jump, spin-jump, act, release reserve and pause.
- [ ] E2E-005 — US-006: At 844x390 touch viewport, hold Right with pointer 1 and Jump with pointer 2.
- [ ] E2E-006 — US-006.EC-2: At 320x568 reject requestFullscreen.
- [ ] E2E-007 — US-025: Reach the first eligible checkpoint, wait for local-saved status, reload and continue.
- [ ] E2E-008 — US-032: Create two guest slots, save a checkpoint in slot1, close/reopen and continue without signing in.
- [ ] E2E-009 — US-033: Using a dedicated test account sign in through Google, sync slot1, sign in on a second browser profile and continue.
- [ ] E2E-010 — US-034: Create guest slot1, Google-sign in to an account with occupied slot1, inspect both cards and choose guest version.
- [ ] E2E-011 — US-037: Open title, skip opening and enter main01.level01.
- [ ] E2E-012 — US-037.EC-2: At 390x844 with reduced effects enabled, open a boss dialogue.
- [ ] E2E-013 — US-038: Start after a user gesture, change music/effects independently, pause for five seconds and reopen.
- [ ] E2E-014 — US-039: Navigate slots/settings/confirmation entirely by keyboard.
- [ ] E2E-015 — US-039.EC-1: At 320px width with large text, open deletion confirmation.

Validation commands: use the actual locked `pnpm` scripts from the TechSpec — `typecheck`, `lint`, `test`, `test:integration`, `test:e2e`, `validate:content`, `build` and `qa:report` as applicable to the slice. Execute scoped implemented gates for intermediate handoff; full candidate gates and independent browser journeys are mandatory before publication. Record exact commands and nonzero failure results. Browser suites use native Playwright, with supported browser control tools for actual interactive journeys; no shell-only substitute for game/UI verification.

## Success Criteria

- Every assigned test case implemented and passing.
- Complete public flows use actual simulation/reducers/storage/content rather than test-only success substitutes.
- All relevant implementation review findings are corrected and affected journeys reverified.
- Measured browser/device limitations are stated accurately.
- Requirements, acceptance/edge cases and actual deliverables agree with the canonical specs; unresolved relevant failures block a completion claim.
