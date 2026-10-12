# TechSpec: Super Arthur World

Date: 2026-10-11. Inputs: [_prd.md](_prd.md), [_user_stories.md](_user_stories.md), [reference inventory](_reference_inventory.md), [framework research](analysis/framework-research.md), and ADRs 001–007. Technical interviews selected Google sign-in, a dedicated Supabase project, a public GitHub repository, and continued local play after connection loss while the application remains open. Reopening requires internet. Engineering defaults below implement those decisions without another interview or a scope reduction.

## Executive Summary

Build one static browser application with Phaser 4.2.1, TypeScript and Vite. Phaser owns rendering, scene lifetime, assets, cameras, animation and audio. A pure TypeScript simulation owns all gameplay positions, collision and transitions at a fixed 60 Hz. Accessible DOM menus surround the canvas. IndexedDB holds transactional local snapshots and a compact synchronization outbox; Supabase Auth and one owner-private Postgres table provide optional Google account saves. Vercel serves the build; there is no custom application server, React dependency, realtime multiplayer, service worker or enterprise infrastructure.

MVP boundary: implementation tasks 01–07 deliver the entire confirmed scope, including all mechanical families and 24 distinct levels; tasks 08–09 plan and execute independent QA and publication verification. There is no reduced demo or deferred required mechanic. Post-MVP features are not proposed. Multiplayer, copied Nintendo assets/layouts and Compozy runtime execution remain out of scope. This template marker describes a delivery boundary, not permission to trim the PRD.

Neither researched engine supplies a verified complete SNES-style controller. Phaser Arcade does not support slopes, and the inspected melonJS example/solver has contact-state and timestep pitfalls. Reuse validated engine infrastructure and inspected algorithms with attribution; treat our controller as unproven until a small collision arena passes the specified gates. Complete planning and tasks precede implementation.

## System Architecture

### Component Overview

| Component and proposed path | Responsibility and boundary | PRD goals |
|---|---|---|
| `src/main.ts`, `src/app/` | Composition root, screen/slot lifecycle, pause and auth return; create one Phaser instance | G-03, G-05, G-07 |
| `src/core/` | Pure types, fixed-step simulation, kinematic geometry, movement states, mechanics, combat, rewards and campaign reducers | G-02, G-04, G-06 |
| `src/game/` | Phaser scenes, camera, sprite/audio adapters and content loading; project simulation state into pixels | G-01, G-02, G-03 |
| `src/input/` | Keyboard/gamepad/pointer adapters to one action frame; focus/device reset | G-03 |
| `src/ui/` | DOM title, slots, settings, map summaries, dialogs, sync/conflict/error views | G-03, G-04, G-05, G-06 |
| `src/content/`, `public/content/` | Validated Tiled JSON maps, world graph, entity/interaction definitions, asset manifest | G-01, G-02, G-06 |
| `src/persistence/` | Runtime validation, IndexedDB repository, account namespace, serialized CAS sync | G-04, G-05 |
| `supabase/migrations/`, `scripts/`, `tests/`, `docs/qa/` | Reproducible schema/build/content checks and independent QA evidence | G-07 |

Flow: device inputs → action frame → simulation step → domain events → campaign reducer → local transaction → optional outbox upload. Rendering observes simulation state; successful HTTP responses never replace newer local gameplay state. Menu actions pass through the same reducers. Account integration runs only outside simulation frames. Loading screens remain until level JSON, original graphics, audio and current snapshot validate.

### Architectural Boundaries

`src/core/` imports no Phaser, DOM, IndexedDB, Supabase, time clock or random global. Its public inputs are content, explicit action frames, tick count and seeded randomness; it returns state/events. `src/content/` validation imports core data types only. `src/game/` and `src/input/` may import Phaser and core, but must not mutate persistent campaign records directly. `src/persistence/` imports core validation/data types and browser/Supabase APIs, never a scene or sprite. `src/ui/` calls app commands and renders view models; it does not write storage or infer unlocks independently. `src/main.ts` is the composition root; there is no daemon. Tests call actual core/reducers and replace only I/O adapters. Do not add a generic ECS, DI container, plugin bus or per-world application package.

### Story-to-component coverage

| Stories | Owning component and concrete surface |
|---|---|
| US-001, US-002, US-003 | App/UI start, six-slot commands, difficulty reducer, reset explanation |
| US-004, US-005, US-006 | Input action mapper/remapping, gamepad deadzone/disconnect, multi-pointer touch/orientation |
| US-007, US-008 | Movement state machine, slope/vertical-run kinematic solver |
| US-009, US-010 | Water, climbing and front/back fence states |
| US-011 | Transition reducer, subarea entry validation and camera adapter |
| US-012, US-013, US-014 | Form/reserve/damage rules, temporary timers, flight state machine |
| US-015, US-016 | Mount state and possession ownership, carried/projectile object rules |
| US-017, US-018, US-019 | Block/switch definitions, dynamic surfaces and environment systems |
| US-020, US-021 | Enemy vulnerability matrix and authored boss controllers |
| US-022, US-023, US-024 | Reward ledger/HUD, medallion commits, exit rewards/bonus minigame |
| US-025, US-026, US-027 | Continuation snapshots, durable death ledger and reset reducers |
| US-028, US-029, US-030, US-031 | World graph/content catalog, secret routes, completeness validator and ending/completion views |
| US-032, US-033, US-034, US-035, US-036 | IndexedDB, Google/Supabase client, import/conflict resolver and truthful save status |
| US-037, US-038, US-039 | Original asset/story manifest, pause/audio settings and accessible DOM interaction |
| US-040 | Build/content validator, actual-state test bridge, QA tools and deployment verification |

## Implementation Design

### Core Interfaces

These are TypeScript contracts, the project's primary language. Each code example is at most 20 lines. The imported checker expects Go; do not add fictional Go interfaces to satisfy that heuristic.

```ts
type Difficulty = 'easy' | 'classic' | 'hard';
type Slot = 1 | 2 | 3 | 4 | 5 | 6;
type SaveScope = 'guest' | `account:${string}`;
type Action = 'left' | 'right' | 'up' | 'down' | 'jump' |
  'spin' | 'action' | 'reserve' | 'pause';
interface ActionFrame {
  held: ReadonlySet<Action>;
  pressed: ReadonlySet<Action>;
  released: ReadonlySet<Action>;
}
interface Simulation {
  step(input: ActionFrame): readonly DomainEvent[];
  view(): Readonly<SimulationState>;
  restart(at: RestartSnapshot): void;
}
```

```ts
interface CampaignCommands {
  checkpoint(state: Campaign, event: CheckpointEvent): Campaign;
  exit(state: Campaign, event: ExitEvent): Campaign;
  death(state: Campaign, event: DeathEvent): Campaign;
  lowerDifficulty(state: Campaign, next: Difficulty): Campaign;
}
interface LocalRepository {
  read(scope: SaveScope, slot: Slot): Promise<LocalRecord | null>;
  commit(expectedVersion: number, next: LocalRecord): Promise<CommitResult>;
}
type CommitResult = { ok: true; version: number } |
  { ok: false; code: 'local-conflict' | 'quota' | 'unavailable' | 'invalid' };
```

```ts
interface RemoteRepository {
  read(slot: Slot): Promise<RemoteResult>;
  insert(request: InitialSave): Promise<WriteResult>;
  compareAndSwap(request: SaveMutation): Promise<WriteResult>;
}
interface SaveMutation {
  slot: Slot;
  expectedRevision: number;
  mutationId: string;
  payload: Campaign | null; // null means slot tombstone
}
type WriteResult = { kind: 'accepted'; record: RemoteRecord } |
  { kind: 'conflict'; record: RemoteRecord } |
  { kind: 'retry'; code: 'network' | 'auth' | 'rate-limit' | 'remote-error' } |
  { kind: 'invalid'; code: 'schema' | 'too-large' | 'forbidden' };
```

Errors use stable codes plus Portuguese UI messages, not exception strings. Validation returns `{ path, code }` issues; credentials/payloads are not logged. Unknown schema version yields `incompatible`, not migration by guesswork. Both runtime validation and database validation reject impossible slots, non-finite numbers, oversized payloads, unknown IDs and invalid state combinations.

### Fixed-step gameplay and collision authority

Use `STEP_MS = 1000 / 60`. The app accumulates foreground elapsed time, processes at most 5 steps per render and discards remaining backlog with a diagnostic count; game time advances only by executed ticks. A long suspension never produces a huge physics step. Focus loss/visibility/orientation/control disconnect releases input and pauses before another step; intentional Resume clears accumulator. Rendering interpolates between previous/current positions where useful but never feeds coordinates back into simulation. Input pressed/released edges are consumed once on the next tick; held inputs apply on every executed tick. Seeded RNG is used only for declared patterns/bonuses; geometry and progression do not depend on `Math.random()`.

Use bottom-centered integer-pixel visual alignment and numeric subpixel simulation positions. Tile size is 16 px. Each actor has separate body/hurt/attack rectangles. The kinematic solver queries a local tile grid plus nearby dynamic surfaces; it uses swept movement or displacement substeps capped at 4 px, with a maximum per-tick displacement budget of 64 px. Exceeding the supported budget is a validation/programming failure, not permission to tunnel. Resolve horizontal movement, vertical movement, then documented floor/slope attachment; use epsilon 0.01 px solely for contact separation. Grounded means a valid supporting contact, never `velocity.y === 0` or a framework falling flag. Stable IDs break equal-time contact ties; replay order is independent of array insertion order.

Terrain shapes include solid rectangle, top-only one-way, slope height profile (ascending/descending 1:1 and 1:2), and the authored triangular vertical-run transition. Slopes use the body's leading/trailing foot samples and floor height, with up to 4 px ground snap only when grounded/descending. Jumping releases floor attachment. Seam tests cover flat→slope, slope→flat, opposing slopes, shallow/steep junction and ceilings; do not implement a slope as a solid rectangular tile. One-way contact requires crossing its top from above with downward relative movement; upward/side overlap alone cannot catch Arthur. Block rotation/hidden-block changes update collision shapes on a defined tick.

Dynamic surfaces move first, keep previous/current transforms, and carry actors supported in the previous tick by their surface delta before actor input movement. Detect swept collision in relative surface/actor space. Recheck contacts after carrying. A trapped actor with no legal separation receives one crush death; sliding/teleporting through the enclosing wall is forbidden. Guided paths use waypoint data; rotating platforms are independently sampled contact segments/platform rectangles on their orbit, while balance/tilted arenas expose an explicit moving height profile. Retain one support ID and contact normal, not a physics joint. Each actor's position is written exclusively by this solver. Phaser physics and tweens must not move gameplay actors; tweens are presentation only.

Movement tuning starts as an engineering default: walk maximum 90 px/s, run 150 px/s, ground acceleration 900 px/s², ground braking 1200 px/s², air acceleration 450 px/s², gravity 900 px/s², normal jump -270 px/s, spin jump -240 px/s, fall cap 360 px/s and jump-release vertical cap -120 px/s. A 5-tick jump buffer and 4-tick ledge grace improve input reliability equally in all difficulties. Tune these values against representative reference actions and freeze them before content balance; they are not claimed to be measured SNES constants. Mode profiles vary only the PRD-selected modifiers. Any tuning change reruns movement/content reachability evidence and records the reason.

### Mechanical systems and event ordering

Player movement has mutually exclusive `ground`, `air`, `swim`, `climb`, `fence`, `flight`, `float`, `transition`, `dying` states. Form (`small/large/projectile/gliding`), reserve, invulnerability, mount possession and held item are orthogonal typed fields with validators. Disallow incompatible combinations explicitly rather than allowing booleans to drift. Growing checks head clearance; blocked growth keeps a safe body until space exists, never embeds Arthur. Temporary effects use tick expiry and cannot continue while paused. Invulnerability ignores eligible enemy harm but not pits/crush/lava/timeout. Initial engineering durations are 600 ticks for invulnerability, 1200 for balloon-like float and 1200 for a swallowed shell before its declared consumption; each must be tuned/tested without changing save-duration semantics.

Power pickup is applied before nonterminal harm in a tick. A distinct collected form replaces the active form and places the replaced non-small power in the one-item reserve; duplicate active power may replenish its matching reserve but never spawn multiple items. Small-to-large pickup has no former power to reserve. Manual reserve release or permitted damaging contact empties reserve and creates exactly one falling collectible at the safe authored release offset. Protected/ignored contact does not release it. Thus Classic large Arthur collecting projectile power then taking damage in one tick ends small, reserve empty, with exactly one dropped growth item. Lethal-tick outcomes still suppress pickup/progression commits; deduplicated spawn/events prevent double release from repeated contacts.

Flight requires grounded run-speed charge, jump/takeoff, and authored control phases for climb/glide/dive/recovery; it does not substitute a permanent free-fly mode. Underwater movement, carrying in water and emergence use separate acceleration/drag/buoyancy rules. Vines/ropes snap to authored climb anchors; fences include front/back collision masks, attack and flip transition. Doors/pipes validate endpoint, eligibility and safe destination before committing the transition; camera bounds never define collision or death.

Mount is a real world entity with `baby`, `following`, `ridden`, `fleeing` and `swallowing` states; one actor owns it and one object can be held by tongue or mouth. Mount capabilities derive from mount color plus currently held shell type; expiry/spit removes the capability. Define red fire, blue flight and yellow stomp equivalents; berries grow the baby and wings trigger the authored bonus transition. Dismount checks available space and launches safely; damage spawns the fleeing mount without duplicated inventory. Carryables have one owner or world position, never both, and states for carried/placed/kicked/thrown/consumed; timed hazards continue only on simulation ticks.

Data-driven block actions cover all M-10 variants; temporary switch expiry changes coins/blocks atomically on a tick and resolves occupied geometry safely. Four permanent switches derive from their owning sanctuary records so world reset can revoke its switch. Enemy definitions contain behavior ID, movement parameters and an explicit vulnerability/outcome for normal stomp, spin, projectile, shell, slide, block strike, mount/tongue and invincibility. The validator requires every response; immune attacks cannot accidentally emit defeat rewards. Boss definitions include arena geometry, phases, hit method, replenishment and transition/victory hooks. Implement ten original main-world bosses covering all M-13 patterns, with a staged final encounter. Rendering does not determine attack success.

Within a tick: input/pause guard → platforms/environment → player/mount/object movement → collision/contact facts → block/switch/attack interactions → harm/defeat facts → ordered domain events → rewards/progression → view. Deduplicate events by `runId/entityId/eventKind/tick` or unique achievement ID. Simultaneous terminal Arthur/boss hits resolve Arthur's death first; no victory/exit/reward commits from that tick, boss arena restarts on respawn. Lethal outcome wins over checkpoint/exit in the same tick; an otherwise valid exit wins over a later nonterminal cosmetic event. Death immediately stops simulation and requests its local durable transaction before Respawn/Continue. Exit records progression/rewards before playing its animation; interrupted animation resumes map without re-awarding.

### Data Models and field rationale

`Campaign` schema version 1 stores bounded logical state, not Phaser objects, DOM nodes, arbitrary frame snapshots or enemy populations. A strict shared runtime schema validates saves at every browser read/write boundary, with UTF-8 JSON byte limit 262144. The database enforces ownership, slot, monotonic revision, payload byte size and schema version; it does not need a general-purpose JSON-schema extension. Malformed self-owned cloud payloads cannot bypass browser validation or damage other slots. `Campaign` fields:

| Field | Type/shape | Purpose |
|---|---|---|
| `schemaVersion`, `contentVersion` | integer 1, manifest string | Detect incompatible representation or level geometry |
| `campaignId` | UUID | Distinguish campaigns occupying the same slot |
| `difficulty` | three-value enum | Durable selected mode; reducer only lowers it |
| `progress` | level completion IDs, exit IDs, medallion bitmasks, sanctuary IDs, visited worlds, story/cosmetic flags | Exact completion and ownership-aware reset |
| `lives` | integer 0..99 | Current durable life balance; never restored from old checkpoint |
| `resume` | map destination or checkpoint/start continuation tagged union | Valid safe destination after death/reopen/reset |
| `run` | bounded coins, bonus stars, score, form/reserve, eligible held/mount state | Checkpoint-committed resource/continuation state |
| `rewardMarks` | bounded unique IDs | One-shot medallion/bonus/progression rewards and consumption |
| `lastTransition` | event UUID, kind, reset scope/ID where applicable | Explain reset/death and prevent duplicate durable transition |
| `savedAt` | ISO timestamp | Display only; never conflict authority |

Score saturates at 9999999, lives at 99, coin and bonus-star residuals at 0..99 after threshold consumption, per-level medallion mask at 0..31. Score chains use `[100,200,400,800,1000,2000,4000,8000,life]`; additional eligible hits award one life each up to the cap. Reward event deduplication still applies. Timers store nonnegative remaining simulation ticks, maximum 216000; authored baseline starts at 300 seconds unless level catalog gives a measured alternative, with PRD multipliers applied once on entry. Do not use wall-clock elapsed time for the level timer.

`RestartSnapshot` contains level/subarea/checkpoint ID, safe anchor, remaining ticks, form/reserve, eligible mount/carried descriptor and checkpoint-committed counters. It also stores remaining ticks of eligible invulnerability/float/mount-shell effects, never a restarted full duration; normal subarea transitions carry the same remaining duration. Death returns to the saved safe state/effect remainder, not a later uncommitted effect. Map/exit drops level-only temporary effects. It never contains a lives field, enemy/projectile instances or uncommitted medallions. Fresh hazards use checkpoint-specific deterministic initialization. Content version change invalidates continuation unless an explicit tested mapping exists: return to that level's validated start with a visible explanation and preserved compatible progression; do not silently erase the campaign. Resume descriptors verify replenishment/safe entrance for carried items or unavailable forms.

Ordinary death restores snapshot run state and previously committed collectible marks, discards later tentative gains, and writes `max(0,currentLives-1)` as the new durable lives. It cannot reload checkpoint-era lives. Gameplay life rewards update the current life ledger via idempotent domain events; unique medallion-set reward happens only upon checkpoint/exit commit. Coin/score chain repeats have their declared repeatable behavior, but a duplicate collision callback is not a new reward. Saving the death ledger does not commit tentative medallions or other tentative pickups. At zero lives, perform exactly one scoped Game Over transaction instead of respawn: clear PRD-owned progress/run/resume and set renewed initial lives with `resume` at the specified reset destination. Continue is presentation/entry only, never a second reset or renewal. Preserve difficulty and slot/campaign identity. Easy removes current-level-owned marks; Classic removes every mark owned by current world and its permanent switch while retaining visited-world access; Hard restores starting progression. Other slots and settings are never transaction participants.

Checkpoint and exit reducers commit medallions by stable ID and consume thresholds exactly once. Completion equals all 24 levels, 34 exits and 120 medallions; views expose separate counts. Route unlocks are derived from graph conditions and committed exit/switch records, plus the PRD's retained visited-world access. Reset cannot leave stale cached unlocks. Difficulty reduction is map-only, durable and affects future profile selection; it cannot revive invalidated checkpoints or increase within the same version.

### Local storage, transactions and synchronization

IndexedDB database `super-arthur-world`, version 1, object stores `slots` (key `[scope,slot]`), `outbox` (same key) and `settings` (singleton). A slot record contains `localVersion`, validated `Campaign|null`, `acknowledgedRemoteRevision`, latest desired mutation ID and compact sync status. An outbox record contains `{ inFlight: immutable SaveMutation|null, desired: latest SaveMutation|null }`, persisting the request before sending HTTP and preserving it across reload. Store at most two bounded snapshot payloads (512KiB combined plus metadata) per account slot. Account scopes use authenticated UUID, guest is separate. Snapshot+outbox change is one readwrite transaction with localVersion comparison; acknowledge only a completed transaction, not an individual request success. Handle quota/denied/abort explicitly and retain memory without claiming durability. Settings have volume, mute, reduced effects, text size and keyboard bindings; no OAuth token copies or save payloads in diagnostics.

One in-process sequencer per scope/slot serializes commands. If another tab changes the localVersion, pause the stale tab and reload/offer choice instead of overwriting; use BroadcastChannel as notification, IndexedDB revision as authority. Use Web Locks if supported to keep one active gameplay writer per namespace/slot, but correctness must hold without it. Inactive tab/version conflict clears held controls. Logout cancels account sync, closes account views and clears memory; guest slots are unchanged. Cached account saves remain namespaced and cannot be displayed to a guest. Reauthentication is required to load an account namespace after reopening.

Outbox keeps the newest desired full snapshot or tombstone, not every checkpoint. A slot has at most one immutable in-flight request; later local checkpoint/death/reset replaces queued desired state but cannot mutate or erase the persisted request already sent. On known in-flight acknowledgement, update the remote revision and clear only that exact inFlight through the same local sequencer/transaction without replacing newer local payload or erasing its desired successor. This metadata update must not cause a stale localVersion in the active app's next command. Send its successor next. Network-lost acknowledgement and reopening are reconciled by reading remote against the persisted inFlight: matching mutation ID means accepted; a different remote mutation/revision means conflict. Retry the same uncertain request before advancing its successor. Never automatically rebase over an unknown device update.

Resolve conflict while paused, showing local/remote difficulty, world/counts, checkpoint/time and reset/tombstone distinction. Explicit selection creates a new mutation against the exact displayed remote revision and writes one whole chosen payload; remote change during selection reloads the comparison and asks again. Preserve unchosen version until selection write is confirmed. Imports clone the chosen guest payload into account namespace; leave guest source intact. Declining login/import makes no save changes. Empty remote slot uses insert; an occupied/tombstoned slot uses CAS, never unconditional upsert. Manual deletion stores tombstone and retains revision to stop old writes resurrecting deleted campaigns. Recreating that slot uses CAS against tombstone with a new campaign UUID.

Retry transient network/5xx/429 with 1s, 2s, 5s, 15s, 30s cap and jitter, stopping on signout or active conflict; trigger retry on reconnect or explicit UI action. Auth expiry prompts reauthentication while local play remains available. A remote schema/authorization error is actionable and not infinitely retried. After entry, background-prefetch all 24 map JSON files and shared mandatory atlases/audio into the session asset cache, prioritizing current world then remaining worlds. Show truthful downloading/ready status. Once mandatory content is ready, already-open play crosses worlds without internet; no service worker/full offline reopening is promised. If connectivity fails before a required asset finishes, keep the loaded phase/play/local saves usable and preserve progress at the next missing destination with an explicit retry loading screen; never invent downloaded bytes or erase the save. Measure full mandatory session prefetch size separately from first-load/current-world budgets.

### Supabase schema and direct Data API

One domain table `public.game_saves` with primary key `(user_id,slot)`:

| Column | SQL type/default | Purpose |
|---|---|---|
| `user_id` | uuid, FK auth.users ON DELETE CASCADE | Owner/RLS partition |
| `slot` | smallint CHECK 1..6 | Enforce six account campaigns |
| `revision` | bigint NOT NULL, initial 1, max JS safe integer | Compare-and-swap token; monotonic even for tombstones |
| `mutation_id` | uuid NOT NULL | Reconcile uncertain last write idempotently |
| `payload` | jsonb nullable | Complete campaign; NULL is deleted-slot tombstone |
| `updated_at` | timestamptz server-set | Display remote confirmation time |

Side-table-vs-JSON decision: ownership/slot/revision/mutation/time are typed indexed columns because queries and CAS use them. Campaign progression and restart descriptor remain one JSONB snapshot because six slots are read/replaced atomically and gameplay does not query individual coins in SQL. No levels, medallions, history or event side-tables; content belongs to the static build. Auth users are managed by Supabase, not a second profiles table.

Migration installs payload JSON-object/schemaVersion=1 and byte-limit CHECKs, enables RLS, revokes all `anon` privileges and grants only SELECT/INSERT/UPDATE to `authenticated`. SELECT/INSERT/UPDATE policies enforce `(select auth.uid()) = user_id`; UPDATE has both USING and WITH CHECK. No DELETE grant/policy; tombstones preserve the row. A small BEFORE trigger rejects changing owner/slot, sets server time, accepts initial revision 1, and requires each UPDATE revision `OLD.revision+1` with a changed mutation ID. This enforces monotonic revisions even against direct client misuse; RLS still owns authorization. It is not a security-definer write API. Browser runtime validation covers every nested shape/range/length and unknown content IDs against the compiled manifest before play. Client cannot be trusted for competitive scores; there is no leaderboard/anti-cheat requirement.

| API | Request | Result |
|---|---|---|
| GET `/rest/v1/game_saves?select=...` | Auth bearer + publishable key; owner implicit through RLS | 200, at most six rows incl tombstones |
| POST `/rest/v1/game_saves` | owner, slot, revision=1, mutation ID, payload | Returned inserted row; 409 duplicate means fetch/compare, no overwrite |
| PATCH `/rest/v1/game_saves?slot=eq.N&revision=eq.R` | next revision R+1, new mutation ID, full payload; `.select()` | One returned row accepted; zero rows means fetch and classify conflict/idempotent acknowledgement |
| Supabase Auth Google redirect/callback | PKCE auth request with allowlisted return origin | Session or actionable error; never block guest access |

Use supabase-js `.update(...).eq('slot', slot).eq('revision', expected).select()`; owner isolation comes from RLS and explicit owner filter as defense against coding mistakes. Returning zero rows is not success. No custom endpoint/RPC is needed. The schema trigger protects increments, while query predicate protects against stale callers. SQLSTATE 23505→initial-slot collision, 23514→invalid payload/revision, 42501→forbidden; 401→auth, 429→backoff, network/5xx→pending. API errors never discard the last valid local snapshot.

### Content and presentation contracts

Catalog declares exactly 12 worlds, 24 level IDs (two per world), 34 unique exit IDs and five unique medallions per level. Each level has world, contentVersion, geometry hash, subareas, spawn/return points, baseline timer, difficulty enemy/checkpoint masks, route destinations, mandatory power/object recovery, families used, and an authored design note describing its distinct challenge. Tiled JSON layers: background/foreground visuals, terrain shapes, entities, trigger/checkpoint/exit objects and dynamic paths. Reuse tilesets/pattern fragments without turning the campaign into cosmetic seeded repeats. Validator checks dangling IDs, duplicates, counts, all reachable normal routes, secret prerequisites, sanctuaries, masks, safe spawns, supported slope/path geometry and recovery resources. Geometry hashes plus design notes flag repeated layouts; human/QA assessment still verifies meaningful differences.

Original assets live in `public/assets/` with manifest source/author/license. Produce pixel sprites/tile atlases, restrained natural palettes, readable foreground/hazard contrasts and original music/effects; code from MIT references does not license their assets. Use a 384×216 logical view scaled to fit, nearest-neighbor pixel textures, separate crisp DOM text/buttons at CSS sizes. HUD must not consume touch control space. Portrait pauses into a readable rotate/continue layout; landscape controls have at least 48 CSS-px targets and simultaneous pointer capture. Keyboard defaults: arrows/WASD move, Z/Space jump, X spin, Shift/J action/run, C reserve, Escape pause; remapping rejects duplicate essential actions unless explicit accessible alternative exists. Gamepad defaults use standard D-pad/left stick (0.2 deadzone), south jump, west spin, east/right trigger action and Start pause; guidance adapts to actual mappings. No browser scrolling from touch/gameplay keys; menus retain native focus.

## Integration Points

The user superseded the initial Supabase account/organization selection on 2026-10-11 and chose the account currently signed into the dashboard. Its dedicated game project is `elbdwupwmnrssyemexrg`, organization `nmxzxcwfywduntcfhyfy`, named `super-arthur-world`, region `us-west-2`, as verified in the dashboard. The user explicitly confirmed US$0/Free; do not provision a paid substitute. The original MCP cost/confirmation tools returned UNAVAILABLE; the user created the project in the dashboard. The MCP still lists the old account pending reconnection. Do not reuse or modify its unrelated project. In task 05 verify the MCP sees the chosen game project before applying versioned migrations and running RLS/advisors checks. Base gameplay work must not wait for this external access.

Google OAuth requires a Google Cloud web client ID/secret, provider configuration in Supabase and authorized Supabase callback URL. Those credentials are not presently available. Existing MCP authentication is not game OAuth configuration. Prepare code, configuration checklist, callback/redirect URLs and guest behavior autonomously; account end-to-end QA remains blocked until actual provider credentials/access exist. Use PKCE through supabase-js; client secret exists only in provider configuration, never Vite env or GitHub. Allow localhost, the verified production origin and explicitly selected preview callback origins; do not broadly allow arbitrary redirects. Cancel/error/expired session leave guest/local saves intact.

Public GitHub repo `super-arthur-world` and Vercel project use the game build, recorded verified owner/team/project IDs and no assumptions about pre-existing resources. Vercel project `prj_FR4IHo9acL1ucdgRfbgDO7iA71Ei` was created and verified through official CLI 63.1.2 after user login, in Hobby team `team_m0FjP3deRHLnxahFVQG3l6Sz` (`lucas-bf`), and linked to this directory. Pin `packageManager: pnpm@11.25.0`, commit `pnpm-lock.yaml`, use Vercel install `pnpm install --frozen-lockfile`, build `pnpm build`, output `dist`; those settings and Vite / Node 24.x are configured. Cache hashed assets immutably and entry manifest/HTML with revalidation. No deployment is performed before independent final QA. Public env keys are only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`; `.env.local` is ignored and `.env.example` has placeholders. No service-role key, Google secret, access token or database password may enter the client/repository. Guest mode works with account configuration unavailable, visibly indicating sync availability; final all-scope QA cannot mark account flows passed in that condition.

## Safety Invariants

1. Exactly one simulation writer owns every gameplay actor position; rendering and physics plugins cannot compete with it.
2. Paused/focused-out simulation executes zero steps, consumes zero timer ticks and holds no stale input.
3. Each death deducts once from current lives; continuation snapshots contain no life balance that can restore spent lives.
4. A terminal death commits exactly one mode-scoped reset, invalidates old continuation and updates only its slot.
5. Checkpoint/exit/reward marks share one campaign transaction; repeated events cannot duplicate unique progression/rewards.
6. Local snapshot and desired outbox commit atomically after expected localVersion matches; incomplete writes never show saved.
7. At most one immutable request is in flight per account slot; its acknowledgement cannot overwrite newer local state or reset.
8. A remote write compares the exact revision; unknown divergent state requires explicit selection, never timestamp winner or automatic progression merge.
9. Deleted slots retain remote revision through tombstones; recreating cannot make pre-deletion requests valid again.
10. Authenticated identity selects the local namespace and RLS owner; logout cannot reveal account saves to guest/other accounts.
11. Explicit conflict replacement adopts one whole version and may select a pre-reset version only through the visible choice flow.
12. Publication requires independent QA of actual gameplay, local and real account journeys; missing credentials/device evidence is reported as a limitation, not a fabricated pass.

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|---|---|---|---|
| Browser app/core/content | New | Large mechanical breadth; collision/content errors are highest risk | Collision gate, interaction matrix and full catalog validation |
| Local/cloud persistence | New | Reset resurrection, wrong life balance or account leak | Transaction/CAS/tombstone/RLS tests with actual boundaries |
| Supabase dedicated project | New, verified in dashboard | Project exists; MCP account reconnection, Auth/provider/schema pending | Record verified IDs, migrations, provider requirements and RLS evidence |
| GitHub/Vercel | New | Public secrets, wrong revision or incomplete build | Env audit, pinned lockfile, independent QA and live build identity |
| Compozy CLI/daemon/web/config | Unaffected | Imported workflow only; not the product runtime | Record no impact on these surfaces; add no runtime dependencies |

## Testing Approach

Pin Node 24.19.0 and pnpm 11.25.0; dependencies Phaser 4.2.1, `@supabase/supabase-js` 2.117.3; dev dependencies Vite 8.3.4, TypeScript 7.0.2, Vitest 5.0.3 and Playwright 1.64.0, verified from registry during planning. Verify peer/engine compatibility on installation, commit pnpm lockfile and use `pnpm install --frozen-lockfile`. The bundled Node executable exists at `C:\Users\Lucas\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`; npm/gh/vercel are not presently on PATH, and the root agent verified a pnpm 11.25.0 fallback. Document the discovered executable invocation and avoid assuming missing CLIs. If package's TypeScript executable/type support differs from its stable package name, resolve by inspecting its actual exports/install output; do not invent a compiler command or silently downgrade. Document any necessary compatible pin adjustment. No ORM or UI framework is required.

Unit tests execute actual pure simulation/reducers/schema validators under Vitest. Integration tests run IndexedDB transactions in real browser context, import/conflict/outbox with controlled network I/O fakes, and real Supabase RLS/CAS/migration checks against isolated QA accounts in the dedicated project. E2E Playwright runs Chromium, Firefox and WebKit; testing the latter is useful coverage but is not a claim that a physical iPhone/Safari passed. Fixtures include deterministic small collision maps and representative authored maps using real content loaders, not mocked core behavior. An optional test bridge enabled only in QA builds can set real initial state/input and inspect transitions, but never replace game logic; production keeps a harmless build identity only. E2E operator commands reproduce a test by seed, level, checkpoint and input trace.

The collision gate has two dependency-aware checks before the 24-level authoring expansion. Task 02 verifies the base solver: the same input trace with render schedules 30/60/120 FPS produces identical 60Hz positions, support contacts, timer and outcomes; slow spikes execute bounded ticks without tunneling and the deliberate backlog policy is measured. It covers slope seams, one-way crossing, fast actor sweeps and dynamic carry/crush. Task 03 adds the combined-mechanic gate for fast shells, growth/head obstruction, mount attach/detach and flight landing once those mechanics exist. Task 06 requires both checks. Failure means repair/reconsider the solver, never remove mechanics. `_tests.md` owns individual cases and the full story/error-boundary coverage matrix. Full public-screen E2E ownership belongs to task 07, which completes those screens; earlier tasks verify their real domain/I/O boundaries without inventing a final UI or depending on a later task.

### Performance and browser evidence

Support current stable desktop Chrome/Edge/Firefox/Safari and current mobile Chrome/Safari on the QA date; record exact versions/device/OS in the final report. Engineering budget on a recorded 1080p desktop reference machine with 384×216 logical canvas: active level CPU simulation p95 ≤4 ms/tick, foreground frame p95 ≤20 ms over 60 seconds after warmup, no >100 ms gameplay long task attributable to routine saves/content load, <=128 MiB decoded active assets. Test a dense supported content fixture with at most 200 active actors, 64 dynamic surfaces and 128 projectiles; validator caps exceedances and offscreen dormant content unloads/activates deterministically. These are implementation budgets, not measurements already obtained.

Initial compressed app+boot assets target ≤3 MiB; current-world prefetched content target ≤8 MiB; load only current level/subareas and reuse shared atlases. Record observed transfer/decode/memory values using browser instrumentation and note APIs unavailable in a browser. On a physical mobile device, measure playability/frame behavior with touch and orientation; if none is accessible, record mobile viewport emulation separately and do not claim device performance. No mandatory minimum device model is invented; observed device limits accompany the released build. Avoid loading all worlds/audio at startup. Monitor save durability duration; normal local commits target p95 ≤100 ms on reference hardware, with a visible blocking status for critical transitions rather than simulating hazards behind dialogs.

## Development Sequencing

### Build Order

1. **Task 01 — bootstrap, shared contracts, input and harness:** single app, pins/lockfile/scripts, environment placeholders, shared types/schema/input contracts and deterministic/browser harness. Do not block these foundations on cloud provisioning.
2. **Task 02 — core movement and collision gate:** 60Hz controller, all terrain/dynamic support fundamentals and a small real fixture arena; depends on 01.
3. **Task 03 — full mechanics and interactions:** forms/flight/water/climb/fences/mount/objects/blocks/switches/enemies/bosses/environment and vulnerability definitions; depends on 02 passing the gate.
4. **Task 04 — campaign reducers and progression:** rewards/checkpoints/life ledger/resets/slots/difficulty/map/secret/completion state; depends on 01–03 contracts.
5. **Task 05 — transactional persistence, account sync and infrastructure:** IndexedDB/schema/recovery, actual Google account client, CAS/outbox/tombstones/import/conflicts/account isolation, dedicated resources/migrations/RLS/provider setup; depends on 04 and real provider availability for account evidence.
6. **Task 06 — original assets and complete authored campaign:** 12 worlds/24 layouts/34 exits/120 medallions/10 bosses, content atlas/audio/story, validator and QA route catalog; depends on 03–04 and may run alongside 05. Mechanical prototypes do not count as final levels unless distinctly authored and cataloged.
7. **Task 07 — DOM/canvas integration, settings, accessibility and browser remediation:** camera/render/input/pause wiring, full screens and account/error flows, supported input/device suites, budgets, content completeness, reference interaction audit and independent implementation review fixes; depends on 04–06.
8. **Task 08 — QA plan/report preparation:** enumerate runnable scenarios, journeys, exploratory charters, bug registry and evidence plan in `docs/qa/`; depends on 07.
9. **Task 09 — independent QA execution, fixes and publication:** independent subagent verifies candidate, remediation subagents fix and reverify; publish only after relevant blockers resolved, then live guest/account smoke and correct build identity; depends on 08.

Tasks are decomposed by cy-create-tasks later; this sequence is not permission to start implementation before those artifacts exist. Use native Codex subagents with inherited model. Scope ownership prevents simultaneous edits to shared core files; integration depends on explicit type contracts. A different subagent reviews an implementer's output. Continue review/fix cycles until the required evidence passes. Commit/push/deploy authorization already exists; platform authentication/credential blockers are reported concretely.

### Technical Dependencies

Supabase MCP access to the newly selected account and Google provider credentials remain actual infrastructure uncertainties. The dedicated project exists in the dashboard. After reported MCP reconnection, direct access to the new project still returned no permission; task 05 may use verified dashboard access while preserving versioned migration artifacts and actual verification evidence. Vercel creation, settings and local linking are verified through the official CLI after the MCP returned 403; deployment remains subject to final QA. GitHub connector access is verified but repository creation/push require an available creation capability or authenticated official CLI. Chromium binaries are installed and foundation browser tests passed; remaining browser/device evidence belongs to the corresponding tasks. Local command approval barriers are handled through available tools, not assumed to be user refusal. Original content/asset production is implementation work, not a reason to trim the campaign. The mechanical reference inventory requires specific interaction evidence before a fidelity claim; compare behavior sources and playable reference observations where accessible, label confidence, and preserve unverified items as QA obligations.

## Monitoring and Observability

Use development diagnostics and user-visible save status, not an analytics service. Diagnostic records include build SHA/contentVersion, test trace seed, level/checkpoint, tick, event code and performance aggregate; redact auth identifiers, tokens and save payloads. UI distinguishes saving locally, saved locally/pending cloud, cloud confirmed, conflict, local failure and incompatible save. Console errors must not dump the Supabase session. QA records dated JSON/text evidence, screenshots and bug reproduction trace. No alerts, on-call rotation or operational dashboard is needed for this experiment.

## Extensibility Integration Plan

No impact on Compozy extension manifests, hooks/capability registries, bridge SDKs, MCP sidecars or protocol docs: this repository consumes authoring skills and Codex's external integrations, not Compozy runtime. Content is validated static data, not third-party executable plugins. No mod/upload ecosystem is introduced.

## Agent Manageability Plan

Provide ordinary project scripts: `dev`, `build`, `typecheck`, `lint`, `test`, `test:integration`, `test:e2e`, `validate:content` and `qa:report`, with nonzero failure exit codes and machine-readable content/QA summaries. Agents operate the app through these scripts, browser journeys and connected Supabase/Vercel/GitHub tools. No CLI product, HTTP operator endpoints or UDS routes are added. Document exact environment/setup commands discovered from installed tool help. A safe production build identity displays commit SHA/contentVersion; no debug unlock controls ship in production.

## Config Lifecycle

No impact on Compozy `config.toml`, merge/overlay behavior, generated runtime CLI/site docs or operator config: none is a game dependency. Game tuning lives in typed validated constants and authored content; public integration settings come from the two Vite env keys described above. Missing/malformed env disables account sync with a clear UI while guest play remains available; a release with unverified required account capability is not QA-complete. `.env.example`, README and schema tests co-ship any integration/tuning contract change.

## Technical Considerations

### Key Decisions

Phaser supplies mature browser infrastructure; pure deterministic gameplay prevents framework collision limitations from silently changing requirements. IndexedDB transactions keep snapshot/reset/outbox coherent. Direct owner-private Supabase CAS minimizes backend code while preserving explicit conflict semantics. JSONB snapshots avoid dozens of persistence tables for a six-slot game. Tiled supports inspectable authored content without a custom editor. Connected integrations configure resources, while Google OAuth remains a distinct provider requirement. Research code is reused selectively with exact revisions and licenses; its existence is not proof our game behaves correctly.

### Known Risks

- Controller collision is highest risk: fix and test small fixtures before content expansion; moving/crushing/rotating surface interactions remain real work.
- Many mechanics combine: interaction/vulnerability matrix and paired state scenarios must cover mount+form+water/flight/objects rather than isolated demos.
- 24 meaningful levels require authoring/QA: uniqueness hashes are a warning tool, not proof of quality/reachability.
- Stale remote writes can resurrect reset progress: immutable in-flight requests, monotonic revisions/tombstones and explicit selection prevent silent replacement.
- Critical local storage failure cannot promise durable death/reset: pause, retain authoritative memory, show unsaved status and retry; never report saved before transaction completion.
- External Google credentials are unavailable: prepare all reviewable code/setup and record the precise user/provider action needed; do not fake account QA or quietly remove it.
- Budget and physical mobile performance are not yet measured: publish only measured claims and record untested-device limitations.
- Reference manuals are incomplete: retain required inventory and source confidence; do not claim exact SNES fidelity based on author tuning.

## Architecture Decision Records

- [ADR-001](adrs/adr-001.md): Complete mechanical scope with original Brazilian-inspired identity.
- [ADR-002](adrs/adr-002.md): Difficulty-specific Game Over and downward-only difficulty changes.
- [ADR-003](adrs/adr-003.md): Six guest-capable saves with optional account synchronization.
- [ADR-004](adrs/adr-004.md): Phaser static app and single-authority fixed-step gameplay.
- [ADR-005](adrs/adr-005.md): Transactional local saves and revision-based cloud synchronization.
- [ADR-006](adrs/adr-006.md): Dedicated integrations and optional Google sign-in.
- [ADR-007](adrs/adr-007.md): Authored content, pinned reference reuse and QA gates.

## Sources and research limits

Framework code references and verified revision pins are in [framework-research.md](analysis/framework-research.md). Primary integration sources: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [conditional JavaScript update](https://supabase.com/docs/reference/javascript/update), [Google sign-in](https://supabase.com/docs/guides/auth/social-login/auth-google), [PKCE flow](https://supabase.com/docs/guides/auth/sessions/pkce-flow), [Tiled custom properties](https://doc.mapeditor.org/en/stable/manual/custom-properties/). Web changelog markdown fetch returned unsupported-content-type; the root agent retrieved [changelog.md](https://supabase.com/changelog.md) through an approved shell fallback. Reviewed recent entries include Oct 8 incidents, Oct 6 scoped PATs and Oct 5 server-adapter deprecation; no SSR/server-adapter dependency is proposed here. No framework test suite was executed during research, no game code is implemented by this document, and no cloud provisioning/deployment is claimed complete.

## Assumptions and Defaults

- Movement constants, logical resolution, input mappings, numeric limits, performance budgets, exact JSON shapes and task boundaries are engineering defaults, not invented interview answers; change them only with recorded reasons and matching tests.
- PRD author defaults for two levels/world, medallion/exit counts, names/narrative and mode tuning are adopted as the content contract; the user-approved 24 levels and full mechanical breadth remain required.
- Runtime snapshot validation protects gameplay; owner-private direct clients may manipulate their own saves because competitive anti-cheat is outside scope. Ownership, slot, revision and payload size remain database-enforced.
- Physical mobile access, Google client credentials and authenticated dashboard access have not been established. Required missing evidence remains a release blocker or explicitly bounded device limitation, never a claimed pass.
- The imported six quality markers apply in native TypeScript and browser boundaries. Go signatures/daemon leases/config.toml checks are runtime-specific heuristics; no fake Go/runtime surface is introduced to make a checker green.

## Confirmed campaign-size amendment — 2026-10-12

The user accepted reducing the campaign from 120 to 24 original levels: two in each of ten main and two secret worlds. This supersedes the earlier size decision only. All selected mechanical families, ten main-world bosses, four sanctuaries, six solo slots, difficulties, controls, saves, Google synchronization and independent QA/publication remain required. The second level of each main world contains its boss; subareas do not inflate the count. Author defaults aligned with this decision are 24 normal exits plus ten secret exits (one per main world), 34 exits total, five medallions per level and 120 medallions total. Historical verification reports retain their original tested sizes and are not fresh evidence for the amended campaign.
