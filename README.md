# Super Arthur World

A non-commercial, single-player browser platformer experiment. The complete planned game is described in `.compozy/tasks/super-arthur-world/`. Current code includes the task-01 foundation and task-02 deterministic terrain arena: real Phaser presentation, shared pure contracts, input/pause guards, slopes, water/climbing, safe transfers, dynamic supports and bounded camera. It is not a complete game or campaign.

## Tools and commands

Use Node **24.19.0** and pnpm **11.25.0**, then `pnpm install --frozen-lockfile`.
On this Codex Windows host, Node is bundled at `C:\Users\Lucas\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`; pnpm's wrapper is `C:\Users\Lucas\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd`. Add both directories to PATH for package scripts. No globally installed npm is required.

Available commands: `pnpm dev`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:integration`, `pnpm test:boot`, `pnpm build`, `pnpm preview`. Install the browser once with `pnpm exec playwright install chromium`. `pnpm dev:qa` / `pnpm build:qa` enables the test bridge for actual state and hardware-adapter samples; ordinary builds omit it. Do not publish a QA build.

Full-screen `test:e2e`, production `validate:content`, `qa:report` and release eligibility are introduced by their owning later tasks. They are intentionally not success-returning placeholders. Browser integration currently runs Chromium; Firefox/WebKit and physical mobile evidence remain later full-game verification.

The lint command uses the TypeScript AST to reject `any`, debugger/type suppression and forbidden browser/engine imports in pure core; typecheck separately checks full strict types. It is a project boundary lint, not a claim to run ESLint.

Browser tests write mutable screenshots through Playwright `testInfo.outputPath` into ignored `test-results/`. Task evidence is a frozen handoff snapshot, copied and inspected when that task is verified; later test runs must not overwrite earlier task evidence.

## Controls and boundaries

Keyboard: arrows/WASD movement, Z/Space jump, X spin, Shift/J action, C reserve, Escape pause. The arena uses actual fixed-step movement. Run with Action, crouch with Down, swim with Up/Down or jump, attach to ropes/fences with Up/Down and jump to detach. Fence gates switch sides with Action. Pipes/doors require their authored direction. Recomeçar arena starts a fresh attempt. This small fixture establishes terrain behavior; final campaign artwork, forms, enemies and saves belong to later tasks. Touch supports multiple independent pointers. Gamepad arbitrates one active controller with 0.2 deadzone. Focus loss, orientation and active controller disconnect pause and release inputs; explicit Resume does not restore held keys/buttons.

`src/core` imports no Phaser/DOM/storage; `src/input` samples devices; `src/app` composes the one Phaser instance. Shared contracts are in `types.ts`, `events.ts`, `schema.ts`; changes are coordinated serially. `TerrainSimulation` is the single position authority; `CollisionSolver` uses at most 4px substeps and 64px/tick, with swept moving surfaces and high-foot tilted contacts. `LevelScene` only renders views and scrolls the camera. Host-created UUID attempt identities produce deterministic UUID event IDs; safe restart advances the local attempt ordinal, while replay preserves the supplied identity. No wall-clock or global random source enters core. Test prose `normalJump` aliases canonical Action `jump`.

Cloud/auth/schema provisioning is task 05. `.env.example` contains only public Supabase configuration placeholders. Missing/invalid configuration keeps guest preparation available and indicates sync unavailable. No tokens or provider secrets belong in source or the public repository.

## Attribution

See `THIRD_PARTY_NOTICES.md` and `docs/licenses/` for software licenses. Original game assets/content will have a provenance manifest in their implementation task. No Nintendo sprites, music or layouts are included.
