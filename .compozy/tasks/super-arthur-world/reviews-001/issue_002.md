---
provider: manual
pr:
round: 1
round_created_at: 2026-10-12T12:32:23Z
status: resolved
file: src/core/mechanics/mount.ts
line: 67
severity: high
author: codex
provider_ref:
---

# Issue 002: Flee recovery mounts a creature across vertical separation

## Review Comment

Flee recovery checks only horizontal distance `<20` and a jump edge. A fleeing mount can be hundreds of pixels below Arthur, behind a floor, and still become ridden. Reproduction: default floor at y160, Arthur spawn `(48,160)`, mount entity `(48,350)`; arrange that real runtime mount in `fleeing` state, then step a jump edge. Production TerrainSimulation changes run.mount to ridden and controlMount teleports the mount body from y350 to y144 beside Arthur. Vite SSR reproduction exited 0. This same separation occurs naturally when a fleeing mount falls off a ledge. The following-state mounting path correctly uses overlapping bodies, but the flee path bypasses that condition and terrain separation.

Require physical reachable contact for fleeing recovery, with the same safe mount attachment rules as ordinary mounting. Keep the creature fleeing when horizontally close but vertically separated or separated by solid terrain. Add a regression asserting no possession or teleport in that situation, plus a nearby-contact recovery case. This is a US-015 ownership/traversal correctness defect, not a balancing preference.

## Triage

- Decision: `VALID`
- Notes: Confirmed the flee path checks only X, bypassing the normal body-contact attachment condition. Fix in scoped mount.ts by requiring actual overlapping reachable mount contact. Test vertically separated and nearby actual recovery through TerrainSimulation. No commit; native root owns final closure.

## Native root closure

Resolved after independent original-failure reproductions and current 70-file manifest verification (954ceb86282819724e0d39a15c1be8123b824975629a219c20d89d691d5a0055). Scoped gates: 65 unit, 25 Chromium, typecheck, lint and build passed. Native Codex root performs the finalizer role under AGENTS.md; no Compozy runtime used. Full release QA remains pending.
