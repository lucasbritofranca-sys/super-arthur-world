---
status: pending
title: Transactional Saves, Google Accounts and Dedicated Integrations
type: backend
complexity: critical
---

# Task 5: Transactional Saves, Google Accounts and Dedicated Integrations

## Overview

Connect the real campaign reducer to durable local saves and owner-private optional cloud continuation. Configure dedicated game resources, prove stale-write/conflict protections and deliver complete truthful account/save views while guest play remains usable.

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
1. MUST use IndexedDB slots/outbox/settings transactions with expected localVersion and account namespaces; only transaction completion means saved.
2. MUST create or verify dedicated Supabase on the user-confirmed US$0 Free plan, public GitHub super-arthur-world and own Vercel resources through authorized integrations; record verified nonsecret IDs and do not substitute paid resources.
3. MUST apply versioned game_saves schema, DB byte/object/version bounds, authenticated owner RLS, monotonic revision trigger and no DELETE grant; strict nested/content validation remains client-side, and direct conditional updates use returned row count.
4. MUST serialize one immutable in-flight request per slot, preserve newer desired payload through acknowledgement and retain tombstone revisions.
5. MUST deliver Google PKCE, import/occupied-slot selection, whole-version conflicts, stale-choice refresh, retries, logout isolation and truthful storage/network/auth failure.
6. MUST retain the guest source and unchosen conflict version until valid acknowledgement, never silently merge or choose by timestamp.
7. MUST prepare concrete Google provider configuration and report missing real credentials/access; authentication of MCPs is not provider setup and cannot count as account QA.
8. MUST keep secrets out of public files/client/reports; expose only the two public Vite integration keys.
</requirements>

## Subtasks

- [ ] 5.1 Implement and validate local transactional repository and settings.
- [ ] 5.2 Integrate real campaign death/checkpoint/reset commands with durable acknowledgement.
- [ ] 5.3 Implement serialized revision/CAS outbox, lost-ack reconciliation and tombstones.
- [ ] 5.4 Deliver optional Google PKCE session lifecycle and private account namespaces.
- [ ] 5.5 Deliver explicit import/conflict/delete/recovery/save-status DOM flows.
- [ ] 5.6 Provision dedicated resources, apply migrations and verify owner boundaries.
- [ ] 5.7 Prepare provider callback/origin configuration and blocked-access evidence.
- [ ] 5.8 Document reproducible integration setup and safe QA test accounts.

## Implementation Details

Canonical design: [_techspec.md](_techspec.md). Scope references: US-002, US-022, US-025, US-034, US-001, US-003, US-009, US-018, US-019, US-024, US-026, US-027, US-032, US-033, US-035, US-036; PRD goals G-05, G-07. These are proposed create/modify targets because the planning workspace contained no game code. Consolidate nearby files if simpler while preserving authority and ownership boundaries; record actual final paths in the task handoff.

Own persistence, migrations, resource configuration and account/save DOM surfaces. In the parallel wave with task 06, do not edit content/assets or its loader; core contract amendments are serialized.

Apply `cy-execute-task` for execution, then `cy-final-verify` before handoff/commit claims. Independent reviewers apply `cy-review-round`; remediation uses `cy-fix-reviews` with native Codex delegation under AGENTS.md.

### Relevant Files

- src/persistence/codec.ts, local.ts, remote.ts, sync.ts, auth.ts — durability and account I/O
- src/app/slots.ts, src/app/save-coordinator.ts — real reducer-to-transaction wiring
- src/ui/slots.ts, account.ts, conflicts.ts, save-status.ts — explicit save/account flow
- supabase/migrations/*.sql, supabase/config.toml — dedicated schema and provider-related project configuration
- src/core/schema.ts, .env.example, vercel.json — strict client validation/public deployment contracts
- docs/integrations.md, README.md, tests/integration/persistence/, tests/integration/supabase/ — setup and real boundary evidence

### Dependent Files

- src/app/bootstrap.ts — composition installs persistence adapters
- src/ui/settings.ts — settings consumer later integrated with presentation
- src/game/scenes/LevelScene.ts — pauses critical commits and resumes only after truthful outcome
- docs/qa/ — independent account/guest/reset/conflict verification consumes real resources

### Related ADRs

- [ADR-002](adrs/adr-002.md) — applicable boundary and rationale; read its full decision.
- [ADR-003](adrs/adr-003.md) — applicable boundary and rationale; read its full decision.
- [ADR-005](adrs/adr-005.md) — applicable boundary and rationale; read its full decision.
- [ADR-006](adrs/adr-006.md) — applicable boundary and rationale; read its full decision.

### Web/Docs Impact

- Browser surfaces: `src/ui/slots.ts`, `account.ts`, `conflicts.ts`, `save-status.ts` and `src/app/save-coordinator.ts` consume repository result types and Portuguese error/status messages; update actual fixtures with contract changes.
- Documentation: `docs/integrations.md`, `README.md` and `.env.example` co-ship verified setup, redirects, error codes and public env contracts.
- Upstream `web/` and `packages/site/`: none — neither directory nor Compozy runtime/generated CLI docs is part of this game. Browser impact is represented by the concrete `src/ui/` paths above.
- QA impact: new scenarios — add content-addressed untested guest/account/import/conflict/storage-failure/CAS/RLS files under docs/qa/scenarios/; never store tokens in evidence.

### Extensibility / Agent Manageability / Config Lifecycle

- Extensibility: none on Compozy manifests/hooks/capabilities/registries/bridges/MCP sidecars — authoring skills and connected integrations are consumed, not a product extension runtime.
- Agent manageability: `pnpm test:integration`, `pnpm test:e2e`, `pnpm qa:report` and connected Supabase/GitHub/Vercel tools; direct GET/POST/PATCH `game_saves` contracts, deterministic errors and redacted evidence are documented. No UDS or custom operator HTTP/CLI product is added.
- Config lifecycle: the two public Vite env keys, provider redirect allowlist, versioned SQL migrations, `.env.example`, `vercel.json` and documentation move together. Missing/malformed env reports sync unavailable while preserving guests. No impact on Compozy `config.toml`, overlays or generated runtime site docs; the game has no such dependency.

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

- [ ] UT-001 — US-002.EC-1: Give SlotService six occupied slots.
- [ ] UT-002 — US-002.EC-2: Confirm deletion of slot 2 twice using expected localVersion=1, while slot 3 exists.
- [ ] UT-031 — US-022.EC-2: Collect coin100 during the committed exit transition, then reopen.
- [ ] UT-035 — US-025.EC-1: Apply the identical checkpoint event ID twice.
- [ ] UT-036 — US-025.EC-2: Reset commits localVersion=3 with lastTransition.kind=gameOver, invalidating the old localVersion=2 checkpoint.
- [ ] UT-047 — US-034.EC-2: Submit the same import intent/revision twice.
- [ ] UT-051 — LocalRepository: LocalRepository.read decoder receives schemaVersion=1,slot=1,localVersion=4 valid fixture.
- [ ] UT-052 — LocalRepository: LocalRepository.read decoder receives schemaVersion=999 in slot2.
- [ ] UT-053 — RemoteRepository: RemoteRepository response adapter receives a returned own row revision=4,mutation_id=M4,payload=P4 for its CAS request.
- [ ] UT-054 — RemoteRepository: Parameterize direct API failures 401, 429, 500, network error, 23514 and 42501.
- [ ] UT-063 — Save schema: Decode valid nested Campaign with lives=99,score=9999999,timer=216000 and medallionmask=31.
- [ ] UT-064 — RestartSnapshot: Decode a valid checkpoint with remaining invincibility=270 and float=0.

### Integration

- [ ] IT-001 — US-001.EC-1: Boot with an empty local store.
- [ ] IT-003 — US-003.EC-2: Lower Hard to Classic, trigger Game Over, reopen the same slot and deliver its old Hard autosave.
- [ ] IT-011 — US-009.EC-2: Die beside water and restore its authored dry checkpoint.
- [ ] IT-022 — US-018: Activate a 60-tick temporary switch, advance 60 ticks, then complete sanctuary yellow.
- [ ] IT-024 — US-019.EC-2: Save and restore the checkpoint before an autoscrolling crusher section at two rendering cadences.
- [ ] IT-032 — US-024.EC-1: Commit an exit that grants a bonus, interrupt its animation, reopen the slot.
- [ ] IT-034 — US-026.EC-1: Deliver two lethal contacts during death animation, close/reopen after its durable write.
- [ ] IT-036 — US-027.EC-1: Queue a localVersion=2 checkpoint write, commit the localVersion=3 reset then retry the older write.
- [ ] IT-041 — US-032.EC-1: Parameterize IndexedDB denial, quota exhaustion and external clearing.
- [ ] IT-042 — US-032.EC-2: Corrupt slot2 JSON while slot1 is valid.
- [ ] IT-043 — US-033.EC-1: Expire the access token while network writes fail.
- [ ] IT-044 — US-033.EC-2: Use account B's real authenticated token to read/update/delete account A's campaign through Supabase.
- [ ] IT-045 — US-034.EC-1: Import selected guest slots 1 and 2 with slot2 request failing.
- [ ] IT-046 — US-035: Two clients advance the same base campaign differently.
- [ ] IT-047 — US-035.EC-1: While conflict screen targets cloud revision4, another device commits revision5.
- [ ] IT-048 — US-035.EC-2: Compare local pre-reset lastTransition with authoritative Game Over reset.
- [ ] IT-049 — US-036: Fail one cloud write after a successful local checkpoint.
- [ ] IT-050 — US-036.EC-1: Abort an IndexedDB transaction after snapshot put but before outbox put.
- [ ] IT-051 — US-036.EC-2: Queue checkpoint writes revision2/revision3 then a reset revision4.
- [ ] IT-058 — GET game_saves: Real authenticated account A reads game_saves with six rows including one tombstone.
- [ ] IT-059 — GET game_saves: A real anon token attempts GET game_saves after migrations.
- [ ] IT-060 — POST game_saves: Real account A inserts empty slot 1 with revision=1, a new mutation UUID and a valid Campaign.
- [ ] IT-061 — POST game_saves: Repeat an insert for occupied account A slot 1.
- [ ] IT-062 — POST game_saves: Parameterize slot=7, initial revision=2, payload schemaVersion=999 and UTF-8 payload size>262144 bytes.
- [ ] IT-063 — PATCH game_saves: CAS own slot 1 expected revision=1 with revision=2, a new mutation UUID and payload=P2.
- [ ] IT-064 — PATCH game_saves: Two real authenticated clients CAS expected revision=1.
- [ ] IT-065 — PATCH game_saves: Parameterize updates changing owner/slot, retaining the same revision or retaining mutation_id.
- [ ] IT-066 — Google Auth callback: Cancel Google sign-in and separately supply a PKCE callback with invalid state/code.
- [ ] IT-069 — Tombstone CAS: In real Supabase, tombstone slot1 at revision2 then recreate it with a new campaign UUID at revision3.
- [ ] IT-070 — Lost acknowledgement: Persist immutable in-flight mutation M2, simulate its accepted HTTP response being lost and reopen.
- [ ] IT-071 — Concurrent local tabs: Two real browser tabs read localVersion=4 for the same guest slot.

Validation commands: use the actual locked `pnpm` scripts from the TechSpec — `typecheck`, `lint`, `test`, `test:integration`, `test:e2e`, `validate:content`, `build` and `qa:report` as applicable to the slice. Execute scoped implemented gates for intermediate handoff; full candidate gates and independent browser journeys are mandatory before publication. Record exact commands and nonzero failure results. Browser suites use native Playwright, with supported browser control tools for actual interactive journeys; no shell-only substitute for game/UI verification.

## Success Criteria

- Every assigned test case implemented and passing.
- Local snapshot and desired outbox cannot diverge after transaction failure.
- Two real authenticated QA users prove save-owner isolation and conditional stale writes cannot silently replace reset/deletion state.
- Missing provider credentials are explicitly blocked and do not fabricate account completion.
- Requirements, acceptance/edge cases and actual deliverables agree with the canonical specs; unresolved relevant failures block a completion claim.
