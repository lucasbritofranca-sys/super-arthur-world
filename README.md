# Super Arthur World

A non-commercial, single-player browser platformer experiment. The complete planned game is described in `.compozy/tasks/super-arthur-world/`. Current code is the task-01 foundation: real Phaser bootstrap, shared pure contracts, input and pause guards. It is not a complete game or campaign.

## Tools and commands

Use Node **24.19.0** and pnpm **11.25.0**, then `pnpm install --frozen-lockfile`.
On this Codex Windows host, Node is bundled at `C:\Users\Lucas\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`; pnpm's wrapper is `C:\Users\Lucas\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd`. Add both directories to PATH for package scripts. No globally installed npm is required.

Available commands: `pnpm dev`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:integration`, `pnpm test:boot`, `pnpm build`, `pnpm preview`. Install the browser once with `pnpm exec playwright install chromium`. `pnpm dev:qa` / `pnpm build:qa` enables the test bridge for actual state and hardware-adapter samples; ordinary builds omit it. Do not publish a QA build.

Full-screen `test:e2e`, production `validate:content`, `qa:report` and release eligibility are introduced by their owning later tasks. They are intentionally not success-returning placeholders. Browser integration currently runs Chromium; Firefox/WebKit and physical mobile evidence remain later full-game verification.

The lint command uses the TypeScript AST to reject `any`, debugger/type suppression and forbidden browser/engine imports in pure core; typecheck separately checks full strict types. It is a project boundary lint, not a claim to run ESLint.

## Controls and boundaries

Keyboard: arrows/WASD movement, Z/Space jump, X spin, Shift/J action, C reserve, Escape pause. The preparation harness displays actual actions; movement arrives in task 02. Touch supports multiple independent pointers. Gamepad arbitrates one active controller with 0.2 deadzone. Focus loss, orientation and active controller disconnect pause and release inputs; explicit Resume does not restore held keys/buttons.

`src/core` imports no Phaser/DOM/storage; `src/input` samples devices; `src/app` composes the one Phaser instance. Shared contracts are in `types.ts`, `events.ts`, `schema.ts`; changes are coordinated serially. Test prose `normalJump` aliases canonical Action `jump`.

Cloud/auth/schema provisioning is task 05. `.env.example` contains only public Supabase configuration placeholders. Missing/invalid configuration keeps guest preparation available and indicates sync unavailable. No tokens or provider secrets belong in source or the public repository.

## Attribution

See `THIRD_PARTY_NOTICES.md` and `docs/licenses/` for software licenses. Original game assets/content will have a provenance manifest in their implementation task. No Nintendo sprites, music or layouts are included.
