---
status: pending
title: Real-User QA Execution and Verified Publication
type: qa-execution
complexity: critical
---

# Task 9: Real-User QA Execution and Verified Publication

## Overview

Have an independent native QA subagent verify the complete candidate and block release on relevant defects. Delegate remediation to separate agents, publish only the verified revision and prove the actual Vercel game works through live guest and account journeys.

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
1. MUST read all in-scope docs/qa scenarios, open bug registry, cycle charters, TechSpec, ADRs and prior evidence before execution.
2. MUST adapt qa-execution guidance to native Codex/Playwright using qa-docs-path=docs/qa; no Compozy runtime, browser-use-only dependency or daemon harness.
3. MUST run ordinary build/typecheck/lint/unit/integration/content/E2E gates and drive actual public game screens; shell-only checks cannot replace browser QA.
4. MUST independently inspect all 120 authored layouts/routes and required mechanics, execute complete guest and real Google/account/conflict/reset journeys and report exact device/browser scope.
5. MUST register deduplicated BUG-YYYYMMDD-slug defects, delegate fixes, capture appropriate failing-before/passing-after evidence and repeat affected journeys.
6. MUST keep publication blocked while relevant failures or required real account evidence remain unresolved; never fabricate completion from unavailable access.
7. MUST commit/push/deploy the verified revision with existing authorization, check safe environment/build identity and run live guest/account smoke on the published URL.
8. MUST preserve independent review ownership; final QA cannot be only the implementer's self-check.
</requirements>

## Subtasks

- [ ] 9.1 Start independent candidate QA with recorded commit/content version and environment.
- [ ] 9.2 Run fresh automated gates and real browser exploratory charter sessions.
- [ ] 9.3 Review complete content variation/reachability and interaction family coverage.
- [ ] 9.4 Execute real guest/account, import/conflict, death/reset and storage failure journeys.
- [ ] 9.5 Register defects, delegate correction agents and repeat affected verification.
- [ ] 9.6 Produce the dated QA report and machine-readable release gate outcome.
- [ ] 9.7 Publish only the eligible revision to the dedicated Vercel project.
- [ ] 9.8 Verify live revision, guest/account continuation and final durable report.

## Implementation Details

Canonical design: [_techspec.md](_techspec.md). Scope references: US-040; PRD goals G-01–G-07. These are proposed create/modify targets because the planning workspace contained no game code. Consolidate nearby files if simpler while preserving authority and ownership boundaries; record actual final paths in the task handoff.

Own independent release QA, defect/repair coordination and publication evidence. Reviewers must differ from implementation authors; fixes can use native subagents with inherited model and bounded file ownership.

The upstream `qa-execution`/`eng-real-scenario-qa` intent is fulfilled by independent native subagents and real Playwright/browser sessions. Do not install a Compozy daemon, tmux/isolation runtime or model router; use distinct browser contexts/test data and bounded file ownership when concurrent.

### Relevant Files

- docs/qa/scenarios/, charters/, bugs/, reports/ — actual independent verdicts and fixes
- scripts/release-gate.ts, scripts/qa-report.ts — reproducible candidate/issue/revision checks
- tests/integration/release/, tests/unit/release/ — owned release guard cases
- README.md, docs/integrations.md — verified public URL and nonsecret resource identity
- Vercel/GitHub connected resources — authorized publication of independently verified build

### Dependent Files

- src/ — remediation affects only reproduced defect ownership and is rechecked
- supabase/migrations/ — rerun owner/CAS checks if schema changes during remediation
- public/content/ and public/assets/ — revalidate entire catalog after relevant fixes

### Related ADRs

- [ADR-001](adrs/adr-001.md) — applicable boundary and rationale; read its full decision.
- [ADR-002](adrs/adr-002.md) — applicable boundary and rationale; read its full decision.
- [ADR-003](adrs/adr-003.md) — applicable boundary and rationale; read its full decision.
- [ADR-004](adrs/adr-004.md) — applicable boundary and rationale; read its full decision.
- [ADR-005](adrs/adr-005.md) — applicable boundary and rationale; read its full decision.
- [ADR-006](adrs/adr-006.md) — applicable boundary and rationale; read its full decision.
- [ADR-007](adrs/adr-007.md) — applicable boundary and rationale; read its full decision.

### QA Impact

reset affected docs/qa/scenarios verdicts to untested after changes, then walk to recorded pass/fail/blocked with dated evidence; retain bug links and live deployment identity.

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

- [ ] UT-048 — US-040.EC-1: qa:report validation receives a relevant unresolved QA bug or deployed SHA different from the verified candidate.
- [ ] UT-061 — QA report gate: qa:report validator receives candidate SHA=abc123, deployed SHA=abc123, all required journey evidence present and zero relevant open bugs.

### Integration

- [ ] IT-056 — US-040: Run the content/build/test gate for the candidate revision, then independent QA guest/account journeys.
- [ ] IT-057 — US-040.EC-2: Provide unavailable Google credentials or no real mobile device evidence to QA reporting.

Validation commands: use the actual locked `pnpm` scripts from the TechSpec — `typecheck`, `lint`, `test`, `test:integration`, `test:e2e`, `validate:content`, `build` and `qa:report` as applicable to the slice. Execute scoped implemented gates for intermediate handoff; full candidate gates and independent browser journeys are mandatory before publication. Record exact commands and nonzero failure results. Browser suites use native Playwright, with supported browser control tools for actual interactive journeys; no shell-only substitute for game/UI verification.

## Success Criteria

- Every assigned test case implemented and passing.
- Every assigned test case implemented and passing, and relevant independent QA defects are resolved/reverified.
- The final release gate refers to the same candidate revision that was tested.
- The published URL passes actual guest/account smoke and reports all device/access limitations truthfully.
- Requirements, acceptance/edge cases and actual deliverables agree with the canonical specs; unresolved relevant failures block a completion claim.
