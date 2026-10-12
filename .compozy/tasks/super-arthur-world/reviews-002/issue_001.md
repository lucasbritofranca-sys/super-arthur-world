---
provider: manual
pr:
round: 2
round_created_at: 2026-10-12T17:03:59Z
status: resolved
file: src/core/campaign/reducer.ts
line: 117
severity: high
author: codex
provider_ref:
---

# Issue 001: Exit commits stale form and inventory from the previous checkpoint

## Review Comment

The exit branch commits `session.run`, but gameplay power, reserve, carried-object and mount mutations belong to the real simulation's run and do not emit events that update that reducer field. ExitEvent carries only medallions, stars and timer, so there is no way for applyEvents to obtain the final mechanical inventory. A real TerrainSimulation with power:large and a normal exit overlapping the default spawn emits its actual exit at tick 1; simulationForm is large, while both reducerForm and savedForm remain small. The narrow Vite SSR reproduction exited 0 and used production Simulation, event generation and applyEvents, not mocked responses. The same problem affects state acquired or lost after the last checkpoint, including reserve, held objects and mount. F-05 and TechSpec require exit saves to preserve eligible form/reserve/inventory and drop only level-only temporary effects.

Carry the actual final eligible mechanical RunState in the exit contract, or introduce an explicit authoritative simulation-to-session synchronization boundary. Validate it and overlay the campaign reducer's authoritative coin/score/star counters before the exit transaction, as already done for checkpoints. Add a real simulation integration regression for pickup then exit and for loss/change after a checkpoint; assert the emitted event, persisted intent and reopened campaign retain the final eligible state. Do not make UI callbacks invent persistent state to conceal the missing domain contract.

## Triage

- Decision: `VALID`
- Notes: The genuine simulation changed eligible state without updating the reducer's stale live run. Native remediation extends ExitEvent with optional v1 run, always emitted by TerrainSimulation; validateRun enforces ownership/ranges and the reducer overlays its authoritative counters before committing the exit. Same-tick acquisition and post-checkpoint damage regressions exercise the actual simulation, persistence intent and reopen. Optional fallback preserves existing typed synthetic campaign facts; final host consumes actual events. Root's native finalizer owns closure after the complete verification record and independent review.


## Native root closure

Resolved after independent original-failure production probe and root verification of85 current source hashes (manifest d0887a3cae00a08d39fb17f16b955420126c8689848e4f54a5452da482e16408),87unit tests and31Chromium cases. Native root owns finalizer under AGENTS.md. Complete-game QA remains pending.
