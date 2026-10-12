---
provider: manual
pr:
round: 1
round_created_at: 2026-10-12T12:32:23Z
status: resolved
file: src/core/mechanics/world.ts
line: 42
severity: high
author: codex
provider_ref:
---

# Issue 005: Restored carried objects start embedded at the area spawn

## Review Comment

The restored mount now tracks Arthur's safe solved position, but carried objects still restore using `{...area.spawn,width:16,height:16}` as a top-left body, even though spawn is Arthur's foot anchor. `syncPlayer` aligns only the mounted body. Reproduced on the final frozen source with a floor at y160 and carried spring: constructor position `(400,160)` publishes Arthur body `(392,144,16,16)` but the spring remains `(48,160,16,16)`, embedded in the floor and hundreds of pixels away. Restarting the snapshot at `(500,160)` repeats the same embedded spring body. Production TerrainSimulation plus overlaps reports `embedded:true` in both cases; Vite SSR reproduction exited zero. The first ordinary tick repairs attachment, but constructor/restart/transfer views can already be rendered while paused or before input.

Initialize and synchronize the carried runtime body's pose from the actual safe player anchor, respecting the established floor-safe attachment/clearance logic without waiting for an action tick. Apply this also to owned mouth objects if they otherwise remain at an obsolete spawn. Add constructor/restart/transfer initial-view assertions at non-default anchors: object owner and identity remain unique, body is attached to Arthur or the mount, and it overlaps no solid terrain. This is the same safe continuation contract as restored mounted actors, not a final-art concern.

## Triage

- Decision: `VALID`
- Notes: Constructor/restart published the area-spawn top-left object pose before controlObject. Reuse floor-safe attachment in syncPlayer for every solved position, and align mouth-owned objects to the actual owning mount. Add constructor/restart/transfer initial-view regression assertions; root owns final issue closure and commit.

## Native root closure

Resolved after independent original-failure reproductions and current 70-file manifest verification (954ceb86282819724e0d39a15c1be8123b824975629a219c20d89d691d5a0055). Scoped gates: 65 unit, 25 Chromium, typecheck, lint and build passed. Native Codex root performs the finalizer role under AGENTS.md; no Compozy runtime used. Full release QA remains pending.
