---
provider: manual
pr:
round: 1
round_created_at: 2026-10-12T12:32:23Z
status: resolved
file: src/core/mechanics/validation.ts
line: 19
severity: high
author: codex
provider_ref:
---

# Issue 003: Boss recovery accepts ammunition its hit method rejects

## Review Comment

Throwable boss validation requires a referenced dispenser to exist, but never checks whether that dispenser supplies supported ammunition. `bossContacts` accepts only thrown `block` objects. A controller 5 with replenisher `ammo`, whose dispenser has `objectId: ammo1, objectKind: key`, passes `validateSimulationOptions` with `[]`, and the actual simulation creates a key as its only recovery resource. Omitting objectKind has the same result because the dispenser defaults to key. The encounter cannot be defeated using its advertised mandatory recovery route. Verified against production validation and stepping with Vite SSR, command exit 0.

Validate the replenisher's effective object kind against the boss hit method, and reject an incompatible or missing required ammunition contract. Include the staged controllers containing throwable phases. Add rejection tests for key/default-key replenishment and acceptance/play tests for block replenishment. Full content authoring remains task 06, but task 03 owns mechanic definitions, solvable recovery contracts and their validation.

## Triage

- Decision: `VALID`
- Notes: Confirmed typed boss hit method accepts blocks while the validator accepts any dispenser. Fix in scoped validation.ts: every controller containing a throwable phase must reference a dispenser whose effective objectKind is block; the default key is incompatible. Add acceptance/rejection tests for controllers 5, 9 and 10. Existing actual boss journeys verify block refill and victory. No commit; native root owns final closure.

## Native root closure

Resolved after independent original-failure reproductions and current 70-file manifest verification (954ceb86282819724e0d39a15c1be8123b824975629a219c20d89d691d5a0055). Scoped gates: 65 unit, 25 Chromium, typecheck, lint and build passed. Native Codex root performs the finalizer role under AGENTS.md; no Compozy runtime used. Full release QA remains pending.
