---
provider: manual
pr:
round: 1
round_created_at: 2026-10-12T12:32:23Z
status: resolved
file: src/core/mechanics/world.ts
line: 118
severity: high
author: codex
provider_ref:
---

# Issue 001: Reserve release embeds the collectible in a low ceiling

## Review Comment

Task 03 requires a safe reserve release offset and single-authority collision. `releaseReserve` subtracts 40 from Arthur's top and clamps only the world's top; it never checks terrain clearance. With floor `(0,160,640,16)`, ceiling `(0,100,96,28)`, default spawn `(48,160)`, small form and reserve `large`, stepping a reserve edge produces a visible pickup body `(40,104.0833,16,16)`, wholly inside the ceiling. Verified against frozen production TerrainSimulation with Vite SSR, command exit 0. The subsequent falling loop ignores `c.move(...).crushed`, so this object can fall through solid terrain. Manual release and damage-triggered release share the defect.

Choose a genuinely clear bounded release position through the real solver, preserving exactly one item and the reserve transaction. Handle crushed/invalid movement instead of rendering an embedded collectible. Add manual and damaging-contact regressions in low corridors and assert clearance throughout the falling trace, not just the number of spawned items. This violates TechSpec safe release and PRD collision correctness; existing UT-016 alone does not cover obstruction.

## Triage

- Decision: `VALID`
- Notes: Confirmed the release path validates only world bounds and falling movement ignores crushed. Fix in scoped world.ts: sweep the item from Arthur's clear body to the release offset, use the safe resulting position, and consume a runtime item crushed by subsequently changed geometry. Add actual Simulation manual/damage low-corridor traces in a regression test; test files are in scope under cy-fix-reviews. No commit; native root owns final closure.

## Native root closure

Resolved after independent original-failure reproductions and current 70-file manifest verification (954ceb86282819724e0d39a15c1be8123b824975629a219c20d89d691d5a0055). Scoped gates: 65 unit, 25 Chromium, typecheck, lint and build passed. Native Codex root performs the finalizer role under AGENTS.md; no Compozy runtime used. Full release QA remains pending.
