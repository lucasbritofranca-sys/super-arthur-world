---
provider: manual
pr:
round: 1
round_created_at: 2026-10-12T12:32:23Z
status: resolved
file: src/core/mechanics/world.ts
line: 157
severity: high
author: codex
provider_ref:
---

# Issue 004: Damage leaves an unsupported flight state until the next tick

## Review Comment

`finish` transforms Arthur to small or detaches a shell-powered mount, but only the next tick's controlFlight reevaluates flight eligibility. At the end of the damaging tick, finish still sets player.mode to flight whenever its old state.flight is non-none. Reproduced with the real mechanicHarness/CollisionSolver: gliding Arthur, flight `glide`, mode `flight`, ordinary overlapping armored enemy, then real world.finish yields `{form: small, mode: flight, flight: glide, protection:60}`. Vite SSR reproduction exited zero on the post-001–003 repair tree. The parent implementer independently identified the candidate; this reviewer reproduced it before recording the finding.

Clear unsupported flight and charge immediately after form loss or mount flee, then publish a compatible air/ground mode. Preserve flight only when another valid source remains (e.g. gliding form after mount loss). Add damaging-contact regressions for gliding-form loss and blue-shell mount loss, including the same-tick view rather than waiting for the next update. This violates UT-019/US-014 lost-power cancellation and the TechSpec's mutually compatible state invariant.

## Triage

- Decision: `VALID`
- Notes: Confirmed finish resolves damage/mount flee after controlFlight, then promotes a stale flight state into the emitted view. Fix scoped world.ts to recompute capability after harm, cancel flight and charge immediately when no gliding form or blue-shell source remains, and retain flight when a distinct valid source survives. Add three actual system regressions for form loss, blue-shell flee and remaining gliding source. Native root owns final closure; no commit.

## Native root closure

Resolved after independent original-failure reproductions and current 70-file manifest verification (954ceb86282819724e0d39a15c1be8123b824975629a219c20d89d691d5a0055). Scoped gates: 65 unit, 25 Chromium, typecheck, lint and build passed. Native Codex root performs the finalizer role under AGENTS.md; no Compozy runtime used. Full release QA remains pending.
