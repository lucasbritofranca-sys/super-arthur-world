# Browser framework and open-source reference research

Date: 2026-10-11. Read-only research by a Codex subagent; inspected sources, not executed framework tests. Current workspace has documents/skills but no game architecture to preserve.

## Provisional recommendation

Phaser 4.2.1 with TypeScript and Vite, Tiled-authored content and a small explicitly tested platform controller. Phaser supplies game infrastructure; no researched repository supplies a verified complete SMW controller. Before authoring the entire campaign, test slopes, seams, one-way surfaces, moving platforms/crush, form-size transitions, mount/dismount, flight landing and equivalent simulation at different render rates. Failure means fix or reconsider the solver, not remove required mechanics.

[ADR-004](../adrs/adr-004.md) now records the final framework/authority choice. Keep the architecture simple: one game, one authoritative movement owner, ordinary accessible menus, account persistence outside gameplay frames. Do not equate popularity, a stable release or the existence of tests with proven mechanical correctness.

## Options and inspected sources

- **Phaser 4.2.1:** complete game engine, MIT. [Pinned package](https://github.com/phaserjs/phaser/blob/v4.2.1/package.json); [physics world](https://github.com/phaserjs/phaser/blob/v4.2.1/src/physics/arcade/World.js). Arcade uses simple collision shapes and does not support slopes: [official slope article](https://phaser.io/news/2025/04/phaser-tile-based-platformer-handling-slopes). Matter's polygons do not by themselves supply the required platform-game feel. Do not select Phaser 3 merely from stale recollection.
- **melonJS 20.8.0:** MIT engine with polygon collision and Tiled support. Release commit reported by inspected metadata: `86f2ff3a71120bf6650b80a31f7fdc7c7415b24b`. [Platformer player](https://github.com/melonjs/melonJS/blob/20.8.0/packages/examples/src/examples/platformer/entities/player.ts) contains custom slope and one-way response and keyboard/gamepad input. [Parity tests](https://github.com/melonjs/melonJS/blob/20.8.0/packages/melonjs/tests/builtin-adapter-platformer-parity.spec.js) are useful; [bug-hunt tests](https://github.com/melonjs/melonJS/blob/20.8.0/packages/melonjs/tests/builtin-adapter-physics-bug-hunt.spec.js) expose grounded/falling flag and time-integration pitfalls. Existing tests documenting these behaviors do not prove suitability for the PRD. Prefer contact-based grounding and an explicit time contract if adapting ideas.
- **PixiJS:** strong rendering option but needs more game infrastructure assembled; weaker simplicity fit for this full game. Final version/API audit was not performed, so no dependency pin is proposed.

## Reuse candidates and licensing boundaries

1. [Phaser official TypeScript/Vite template](https://github.com/phaserjs/template-vite-ts/tree/d1d7d58acfcf47f97642bcb8b4967071b85f8db9), MIT. Inspected package and bootstrap files on main; root-agent metadata verification pins commit `d1d7d58acfcf47f97642bcb8b4967071b85f8db9`. Package 1.4.0 references Phaser 4.0.0 although description mentions Phaser 3. Remove dispensable template logging, not relevant game behavior.
2. [Phaser official examples](https://github.com/phaserjs/examples), MIT code with separate asset terms. Run examples against the chosen stable version; the live labs catalog can use development builds. Useful for tilemaps, input, cameras and engine integration, not a complete controller.
3. [melonJS code/examples](https://github.com/melonjs/melonJS/tree/20.8.0), especially its player and collision tests. Example [asset license](https://github.com/melonjs/melonJS/blob/20.8.0/packages/examples/LICENSE.md) differs from code terms. Adapt isolated ideas only after addressing observed limitations.
4. [Celeste partial source](https://github.com/NoelFB/Celeste/tree/1b0ce45c75e05649ae91b44a8bb6b196684e4352), MIT partial source, archived; [Player.cs](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/Source/Player/Player.cs) inspected for states, variable jump, carried objects and moving-surface interaction. Root-agent metadata verification pins revision `1b0ce45c75e05649ae91b44a8bb6b196684e4352`. C#/Monocle is not directly runnable in this browser game. Do not import the giant class, unrelated dash/wall-jump mechanics or proprietary game assets.
5. [Tiled custom properties](https://doc.mapeditor.org/en/stable/manual/custom-properties/): authored checkpoints/exits/platform paths and difficulty data instead of a custom editor.

Record exact revisions and attribution for any code actually copied. Original game art, music and levels remain mandatory. Research has not downloaded or run these engines; quality claims are limited to the specific inspected files and documented constraints.
