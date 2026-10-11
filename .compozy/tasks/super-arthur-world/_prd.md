# PRD: Super Arthur World

Date: 2026-10-11. Product interview completed for the principal decisions. Author defaults below are reviewable design choices, not invented interview answers. Companion: [_user_stories.md](_user_stories.md).

## Overview

Super Arthur World is a single-player browser platform adventure and a non-commercial experiment in AI programming and Spec Driven Development. It must deliver a complete, playable campaign and prevent gameplay and save bugs without enterprise architecture. Arthur explores an original fantasy inspired by Brazil, rendered in restrained 16-bit pixel art. A short opening, brief boss encounters and ending support the action.

The intended players are the project owner, people testing the game and platform-game players on computers, phones and tablets. Guests can play immediately. Optional accounts provide cross-device continuation. Super Mario World (SNES) defines the requested mechanical breadth, while this PRD records explicit adaptations selected by the user. Original characters, music, art and level layouts are required.

## Goals

- G-01: Play all 120 original levels across 10 main and 2 secret worlds, with a planned main route, alternate exits and secret shortcuts.
- G-02: Use the reference's movement, transformations, mount, interaction, enemy, environment, map and bonus families; preserve their distinct gameplay roles rather than replacing them with generic jumping.
- G-03: Play through keyboard, gamepad or touch with the same game rules and usable menus.
- G-04: Select Easy, Classic or Hard and observe the specified death, Game Over and downward-only difficulty rules.
- G-05: Resume one of six independent campaigns from saved checkpoints or the map, locally or through an optional account, without silent overwrites.
- G-06: Finish the short story and separately complete 100% through all levels, exits and special collectibles.
- G-07: Publish a working game after independent QA, with reproducible evidence for movement, progression, resets and saves.

## User Stories

- US-001–US-006: Entry, save slots, difficulty, keyboard, gamepad and touch.
- US-007–US-019: Movement, terrain, transitions, transformations, flight, mount, objects, switches and platforms.
- US-020–US-027: Enemies, bosses, rewards, HUD, checkpoints, death and Game Over.
- US-028–US-031: Overworld, secret worlds, original campaign and completion.
- US-032–US-036: Guest persistence, accounts, import, conflicts and save failures.
- US-037–US-040: Presentation, pause/settings, accessibility and operator/QA workflow.

[Full user stories](_user_stories.md) is the canonical acceptance and edge-case catalog.

## Core Features

### F-01: Start, modes and controls

Single-player only. Six independent slots show difficulty, world, completion, checkpoint and save status. New campaign, continue and delete are distinct actions; deleting or replacing a campaign requires a clear confirmation. Difficulty selection explains Game Over before play. Menus and gameplay support keyboard, gamepad and touch; held buttons must not remain active after losing focus or disconnecting a controller.

### F-02: Mechanical breadth

The acceptance inventory below distinguishes reference-backed families from additional interaction coverage requiring further research. All rows are product requirements, not a claim that reference research is exhaustive. Each family requires original art and an identifiable equivalent; power names and visuals may differ. Preserve combinations rather than implementing each item in isolation.

| ID | Required family | Owning stories |
|---|---|---|
| M-01 | Walking/running, braking, crouching, normal/spin jumps, variable jump height, enemy bounce | US-007, US-020 |
| M-02 | Slopes, sliding, triangular vertical-run surfaces | US-008 |
| M-03 | Swimming, carried items in water, leaving water | US-009 |
| M-04 | Vines, ropes, two-sided fences, fence attack and side change | US-010 |
| M-05 | Doors, pipes, subareas, eligible camera look-ahead, vertical and scrolling sections | US-011, US-019 |
| M-06 | Small/large/projectile/gliding forms, reserve item, invulnerability and balloon-like float | US-012, US-013 |
| M-07 | Run-up takeoff, controlled flight, glide, spin attack and dive | US-014 |
| M-08 | Mount/dismount, tongue, swallowing/spitting, shell-driven fire/flight/stomp, colored mounts, growth, berries, wings and fleeing on damage | US-015 |
| M-09 | Carry, place, kick and throw shells, keys, springs, throwable blocks and timed hazards | US-016 |
| M-10 | Reward, hidden, bounce, rotating, grab, message and bonus blocks; timed switches and permanent four-color switch effects | US-017, US-018 |
| M-11 | Moving, falling, guided, rotating and balance platforms; conveyors, crushers, ice, lava and changing water | US-019 |
| M-12 | Ground, aerial, aquatic, projectile, armor, pursuit, gaze-reactive and regenerating enemy behaviors with distinct attack responses | US-020 |
| M-13 | Original boss encounters using tilted arenas, underside attacks, decoys, ceilings, thrown objects and rotating platforms; staged final encounter | US-021 |
| M-14 | Coin/life rewards, score chains, special collectibles, reserve, timer, exit rewards, bonus-star minigame and replenishment areas | US-022–US-024 |
| M-15 | Midlevel checkpoints, death/respawn, normal/secret/key/boss/orb-style exits | US-025–US-028 |
| M-16 | Overworld branches, secret travel network, switch-dependent paths, replay and secret-completion cosmetic change | US-028, US-029, US-031 |

Research confidence: the official Nintendo manuals directly support major actions, forms, mount systems, blocks, switches, bonuses, map and checkpoint families. Exact physics, enemy/attack interactions, boss patterns, platform variants and hidden exceptions require the Techspec reference audit. Those rows are deliberately required coverage, not asserted quotations of Nintendo specifications. No source-derived uncertainty is permission to omit a mechanic. Maintain [_reference_inventory.md](_reference_inventory.md) through technical research and QA.

### F-03: Original campaign

Exactly 120 playable, distinct level layouts across the 12 worlds; exits and subareas are not counted as additional levels. Levels may reuse enemies and tiles but must have meaningful differences in traversal, hazards, objectives and secrets. Reskinning one layout 120 times does not satisfy this requirement.

Author default: 10 levels per world; the final level of each main world contains its boss. Four permanent switch sanctuaries are included within the 120 levels. Two secret worlds each contain 10 challenge levels. Every ordinary level supports the three difficulty variants without changing terrain or player physics. The content catalog must identify world, entry, exit destinations, checkpoints, collectibles, enemy variants and mechanical families per level.

Author world proposals, in main order: Mata das Nascentes, Campos do Cerrado, Veredas do Pantanal, Grutas da Serra, Trilhas da Caatinga, Mangues e Marés, Ruínas da Chapada, Alturas da Mantiqueira, Forjas da Pedra, Cidadela do Eclipse. Secret worlds: Caminhos do Encantado and Memória das Constelações. These are fantasy reinterpretations, not geographic claims. Water, sky, low-grip and lava mechanics appear in suitable fantasy subareas. Use muted greens, earth, stone and water tones with limited accents and readable contrast.

Author narrative proposal: an original antagonist disrupts the paths connecting the realms; Arthur restores their guardian seals and confronts the antagonist. No prolonged dialogue, voice acting requirement or repeated unskippable cutscenes. Final names, appearance and brief dialogue are content-authoring choices.

### F-04: Difficulty and resets

Easy, Classic and Hard vary lives, timer, damage, enemy behavior and checkpoint density. Terrain, control rules, jump tuning and flight behavior remain the same. Every mode supports checkpoints. Difficulty can be lowered only from the map; it can never be raised within that campaign, including after Game Over. A new campaign may select any difficulty.

Author tuning defaults, to be validated for playability:

| Rule | Easy | Classic | Hard |
|---|---|---|---|
| Initial/renewed lives | 10 | 5 | 3 |
| Per-level time allowance | 1.5 × baseline | baseline | 0.8 × baseline |
| Powered-form contact damage | Projectile/gliding → large → small | Any powered form → small | Any powered form → small |
| Contact protection | 2 seconds | 1 second | 0.5 second |
| Enemy variant | Reduced authored hazards and slower attack cycles | Baseline authored pattern | Denser authored hazards and faster attack cycles |
| Checkpoints in standard full-length level | 3 | 2 | 1 |
| Game Over | Reset current level | Reset current world | Reset active campaign |

Instant-death hazards and timeout consume a life regardless of form. Small Arthur dies from unprotected harmful contact in all modes. Damage protection cannot make a lethal pit safe. Short special rooms are subareas of a level; they do not inflate counts or promise checkpoints in every room. Boss levels contain an approach and eligible checkpoints before the arena. No mandatory route may require flying with a missing power, a disposable mount or a consumed key without a replenishment or recovery route.

Ordinary death deducts one life, discards gains since the last checkpoint and restores its snapshot. The life deduction is durable immediately: restoring a checkpoint or reopening cannot restore the lives held when that checkpoint was originally reached. Record the post-death life count alongside continuation without committing newly collected items. With lives remaining, a missing checkpoint returns to level start. Game Over takes precedence over checkpoint continuation and commits its penalty immediately before offering Continue. Continue renews lives for the selected mode and starts from the reset location. Closing the tab must not evade a penalty already saved.

Reset boundary defaults:

- Easy clears current-level collectible marks, discovered exits, boss completion and checkpoint; previously unlocked worlds and other levels remain. Progression completion may decrease. The already accessible world entrance remains available.
- Classic clears the current world's level completions, exits, special collectibles, boss/sanctuary records and checkpoint. Arthur returns to its first level. Progress in other worlds remains. Switch effects owned by the reset world turn off; effects earned in other worlds remain. A previously visited world's access is retained so reset does not strand the player; shortcuts originating in the reset world must be earned again.
- Hard clears all active-campaign completions, exits, collectibles, switches, world unlocks beyond the starting world, bonuses and checkpoint. The slot retains its identity and current lowered difficulty, then starts at the beginning. Other slots and account settings remain.
- Every Game Over clears active form, mount, carried item, reserve, pending rewards, coin/bonus counters and run score, renewing only the mode's initial lives. Durable marks outside the penalty's boundary remain. These reset details are author defaults implementing the user's selected penalty scopes.

### F-05: Saving and synchronization

Checkpoint and level-completion autosaves include enough state to resume safely: difficulty, lives, progression, committed collectibles, rewards, form/reserve and eligible carried/mount state. A checkpoint is a safe restart position with a fresh local hazard pattern and its documented remaining timer, not an arbitrary mid-frame freeze. Only one pending defeat or reward may be applied once. A Game Over reset replaces the checkpoint snapshot rather than coexisting with it.

For collected special items, keep unique per-level marks across attempts, committing at checkpoints and exits. Uncommitted pickups are lost on death. A repeated previously committed pickup does not count twice or yield unlimited lives. Author default: five original guardian medallions per level; completing a newly earned set grants one life. Normal coins grant a life per hundred. Bonus stars trigger their minigame per hundred; these counters consume thresholds once. Score and display counters have finite documented limits in the Techspec.

Guest campaigns remain local. Login is optional. If connectivity drops after the game is open, continue play and local saving; retry synchronization when connectivity returns. Opening or reopening requires internet; full offline reopening is not required (confirmed in the technical interview). Offer importing guest slots; explain occupied-slot collisions and allow the player to choose local or account version. For genuinely divergent device versions, show difficulty, world, completion, checkpoint, save time and whether a reset occurred; the player selects one complete version. Do not merge progression or silently pick the newest. Choosing an older pre-reset campaign is an explicit version replacement, not an automatic resurrection. A delayed save from before a reset must not silently overwrite it.

Account saves are private to their owner. Optional account sign-in uses Google, as selected in the technical interview; guest play remains available. Logging out does not expose account saves to the next guest. Failed synchronization retains a usable local save, displays pending status and permits retry. A failed local write must show that progress is not safely saved; do not display success. Damaged or incompatible saves must not crash the game or overwrite unaffected slots. The technical plan must define provider setup and resource ownership.

### F-06: Map, secrets and completion

Normal exits advance the planned route; distinct secret exits open explicit alternate paths. Each exit has a stable identity and destination, and repeating it never double-counts completion. Author default: 30 additional secret exits across the main worlds, three per main world, for 150 total exits. The first secret travel network is reachable through exploratory exits; its completed routes connect unlocked worlds. Complete its routes to access the second secret challenge world. Exact edges belong in the content catalog and must be solvable without circular mandatory requirements.

Winning the final boss ends the story; exploration continues afterward. 100% requires completion of all 120 levels, discovery of all 150 defined exits and collection of all five medallions in each level. Show separate level, exit and collectible counts so a player can see what is missing. A secret-content completion unlocks an original cosmetic world variant; it does not change physics, invalidate checkpoints or hide gameplay hazards.

## Business Rules

- BR-01: One active slot and one player; modifying or resetting it cannot modify another slot.
- BR-02: Reference breadth is preserved except recorded user overrides: original identity/content, single player, 120 levels, six slots, three modes, autosave, persistent collectibles and selected reset rules.
- BR-03: Main-world access follows the authored route graph. A secret exit is not a second level.
- BR-04: A persistent reward is keyed to a unique achievement; revisiting, retrying or repeated input cannot award it twice.
- BR-05: Lives never become negative. One death cannot deduct multiple lives; terminal death causes exactly one Game Over reset.
- BR-06: A lowered difficulty is durable and cannot be increased by Continue, import or ordinary sync. Selecting a different existing campaign is not changing its difficulty. Explicit conflict replacement adopts the selected campaign version as a whole.
- BR-07: Reset-owned progression is erased atomically from the player's perspective. Local continuation must agree with the visible reset even while cloud synchronization is pending.
- BR-08: Collectibles save only on the chosen boundaries; exit completion and its rewards become visible together.
- BR-09: A checkpoint invalidated by a reset, deleted slot or unsupported level version cannot resume into unsafe geometry.
- BR-10: The same input has the same meaning across difficulty modes and devices. On focus loss, pause and release held inputs.
- BR-11: On pause or menus, player/enemy movement and the level timer stop. Resume requires intentional player input.
- BR-12: Saving, account interaction and dialogues must not continue a hazardous simulation behind an obstructing screen.
- BR-13: Do not overwrite campaign versions, delete slots or substitute saves without the specified explicit action.

## User Experience

Primary flow: open → start with a user gesture → select/create slot → choose difficulty and read penalty → brief opening → map → phase → checkpoint → exit/map → next world → final boss → optional complete exploration.

Returning flow: select existing slot → see save source/status → resume valid checkpoint or map. Guest-to-account flow: sign in → choose whether to import → resolve occupied slots individually → show actual synchronization state. Conflicts pause save replacement until the player chooses a version.

Author presentation defaults: Brazilian Portuguese interface; brief readable prompts; muted original music and effects with separate volume/mute. Keyboard remapping and gamepad button guidance. Touch controls support simultaneous movement/jump/action without triggering browser scrolling; landscape is recommended, portrait shows a usable scaled view or a clear rotate prompt. No failure from changing orientation midplay: pause and preserve state. Fullscreen is optional and unavailable permission is not a blocker. Do not rely only on color for secrets, switches or damage cues. Respect readable UI sizes and offer reduced flashes/shake without altering game rules.

## High-Level Technical Constraints

The browser is the game runtime; support current desktop Chrome, Edge, Firefox and Safari, plus mobile Chrome and Safari. Exact supported versions and reference devices belong in the Techspec. Movement must stay consistent when rendering slows; no skipping through walls, sinking into slopes, losing mount state or time advancing while paused. Aim for smooth play on ordinary devices, with concrete measurement settings in the test contract.

Supabase and Vercel are fixed user requirements for account persistence and hosting, with GitHub for repository collaboration. They are named here only because the user explicitly fixed them. Framework choice, data design, migrations and authentication mechanisms belong in the Techspec. Do not expose account data or privileged credentials in the game. No payments, analytics platform or operational dashboard is necessary for this experiment.

Agent/operator outcome: Codex subagents must be able to build, validate all authored levels, reproduce save/physics failures, review changes and verify the final live game using ordinary project tools and documented commands. Do not build a separate operator product or runtime extension ecosystem; Compozy contributes skills only. Independent final QA must inspect the complete playable flow and failure cases before publication, followed by smoke verification of the published build.

## Non-Goals (Out of Scope)

- Local or online multiplayer, explicitly withdrawn by the user.
- Reproduction of Nintendo characters, art, music or level layouts; original equivalents were selected.
- Enterprise scope, complex infrastructure and business/monetization expectations; explicitly rejected for this experiment.
- Implementation through Compozy OS or Herdr; execution is through Codex App.

No mechanical family or original level is excluded to make the document smaller.

## Success Metrics

These are delivery checks for the experiment, not commercial KPIs:

- The campaign catalog contains 120 distinct playable levels in 12 worlds; QA verifies every level's entries, exits, checkpoints and collectible reachability.
- Every M-01–M-16 mechanical family has an implemented equivalent and passing evidence for its defining interactions; uncertain reference details remain labeled until investigated.
- Keyboard, gamepad and touch can start, play, pause and continue a campaign; device and browser evidence identifies what was actually tested.
- Each difficulty's Game Over produces exactly its defined reset boundary, and reopening or delayed synchronization does not silently undo it.
- All six slots remain independent, and guest continuation, account synchronization, import and explicit conflict selection pass their acceptance cases.
- Story completion and 100% show separate accurate counts. A final independent QA report has no unresolved blocking gameplay, save or release defects before publication; the published URL passes its live smoke checks.

## Architecture Decision Records

- [ADR-001](adrs/adr-001.md): full mechanical scope, original identity, single player and Brazilian-inspired setting.
- [ADR-002](adrs/adr-002.md): difficulty penalties and downward-only difficulty changes.
- [ADR-003](adrs/adr-003.md): six guest-capable slots, optional account sync and explicit conflicts.

## Open Questions

No remaining principal product choice is blocking this PRD. Reviewable author defaults are explicitly labeled above: content distribution/names, narrative hook, medallions, exit counts, exact difficulty tuning, reset-owned substate and presentation details. They may be adjusted with an explicit documented reason, without altering confirmed scope or quietly weakening penalties.

Connectivity is resolved: continue locally if the connection drops with the game open; reopening requires internet. The user selected a dedicated new Supabase project, its existing organization and Free plan, Google sign-in, and a public GitHub repository. Framework/reference selection, exact movement constants and uncertain reference interactions require the technical research and testable contracts in the Techspec. A verified reference audit is still required before claiming complete mechanical fidelity; the current inventory is a coverage target, not that claim.

## File References

- [_idea.md](_idea.md): confirmed user answers and corrections.
- [_reference_inventory.md](_reference_inventory.md): source confidence and mechanical coverage mapping.
- [_user_stories.md](_user_stories.md): observable acceptance and edge cases.
- [Nintendo original manual](https://www.nintendo.co.jp/clvs/manuals/common/pdf/CLV-P-SAAAE.pdf) and [condensed manual](https://www.nintendo.com/es-es/games/oms/snes-classic/manuals/super-mario-world/manual.pdf): primary reference inputs; not proof of exhaustive coverage.
- [SuperTux browser build](https://play.supertux.org/): comparable direct browser access.
- [Browser audio guidance](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay): interaction-dependent audio startup.
