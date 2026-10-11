# User Stories: Super Arthur World

Canonical acceptance catalog for [_prd.md](_prd.md); component and test mapping belong in the Techspec and test contract. AC and EC references are permanent: `US-NNN.AC-N` and `US-NNN.EC-N`.

## Personas

- Guest player: immediate play with private local saves, without registration.
- Account player: guest capabilities plus optional cross-device continuation.
- Explorer: secrets, collectibles and complete campaign coverage.
- Mobile/controller player: the same game with touch or gamepad input.
- Project owner/QA agent: build, reproduce bugs and verify the complete delivered game.

## Story Index

| ID | Area | Persona | Capability |
|---|---|---|---|
| US-001 | Entry | Guest | Start without registration |
| US-002 | Saves | Player | Manage six independent campaigns |
| US-003 | Difficulty | Player | Select and lower difficulty |
| US-004 | Input | Player | Keyboard controls and remapping |
| US-005 | Input | Controller player | Gamepad gameplay and menus |
| US-006 | Input | Mobile player | Touch and orientation |
| US-007 | Movement | Player | Running and jumping |
| US-008 | Terrain | Player | Slopes and vertical-run surfaces |
| US-009 | Terrain | Player | Swimming |
| US-010 | Terrain | Player | Climbing and fences |
| US-011 | Traversal | Player | Pipes, doors and camera |
| US-012 | Powers | Player | Forms, damage and reserve |
| US-013 | Powers | Player | Temporary invincibility and floating |
| US-014 | Powers | Player | Flight and gliding |
| US-015 | Mount | Player | Ride and use mount abilities |
| US-016 | Objects | Player | Carry and throw objects |
| US-017 | Blocks | Explorer | Distinct block behavior |
| US-018 | Switches | Explorer | Timed and permanent switches |
| US-019 | Environment | Player | Platforms and hazards |
| US-020 | Enemies | Player | Distinct enemy interactions |
| US-021 | Bosses | Player | Original boss encounters |
| US-022 | Rewards | Player | Coins, lives and score chains |
| US-023 | Collectibles | Explorer | Persistent special collection |
| US-024 | Bonuses | Player | Exit rewards and bonus rooms |
| US-025 | Checkpoints | Player | Save and resume checkpoint |
| US-026 | Death | Player | Lose one life and respawn |
| US-027 | Game Over | Player | Difficulty-specific reset |
| US-028 | Overworld | Explorer | Unlock routes and replay |
| US-029 | Secrets | Explorer | Secret worlds and travel |
| US-030 | Campaign | Player | Play 120 original levels |
| US-031 | Completion | Explorer | Finish story and reach 100% |
| US-032 | Persistence | Guest | Local continuation |
| US-033 | Accounts | Account player | Private synchronized continuation |
| US-034 | Import | Account player | Import guest campaigns |
| US-035 | Conflicts | Account player | Choose divergent save version |
| US-036 | Failure | Player | Understand save failures |
| US-037 | Presentation | Player | Arthur, Brazilian fantasy and short story |
| US-038 | Settings | Player | Pause and sound control |
| US-039 | Accessibility | Player | Readable and accessible interaction |
| US-040 | QA | Owner/QA | Reproduce, verify and publish |

## Entry and input

### US-001: Start without registration
As a guest, I want to start a campaign immediately so that account setup does not block play.

Acceptance criteria:
- AC-1: Given the initial screen, when I choose guest play, then I can create a slot and enter the campaign without signing in.
- AC-2: Given my first interaction, when I start, then music may begin according to my sound setting and the opening can be skipped.

Edge cases:
- EC-1: First visit with no saves → six empty slots and a usable new-game action.
- EC-2: Missing required game assets → actionable loading failure and retry, without pretending the game started or overwriting saves.

### US-002: Six independent campaigns
As a player, I want six identifiable slots so that experiments do not overwrite another campaign.

Acceptance criteria:
- AC-1: Given a slot, when I create a campaign, then its difficulty and progress are independent of the other five.
- AC-2: Given an occupied slot, when I request deletion or replacement, then a confirmation names that slot; cancel keeps it unchanged.

Edge cases:
- EC-1: All six slots occupied → no implicit seventh slot or silent replacement.
- EC-2: Repeated confirmation or a stale open slot screen → at most one intended operation, never a change to a different slot.

### US-003: Difficulty choice and reduction
As a player, I want clear difficulty rules so that I understand the risks before playing.

Acceptance criteria:
- AC-1: Given a new campaign, when I choose Easy, Classic or Hard, then the game explains that mode's Game Over penalty and applies its rules.
- AC-2: Given the map, when I lower difficulty, then future play and the durable save use the new mode; raising it is unavailable for that campaign.

Edge cases:
- EC-1: Attempt to change mode during a level → unavailable without changing the active rules midlevel.
- EC-2: Reload after lowering, including after Game Over → the lowered difficulty persists; no restore through an ordinary stale update.

### US-004: Keyboard control
As a keyboard player, I want movement and separate jump/action controls so that I can perform all required mechanics.

Acceptance criteria:
- AC-1: Given keyboard play, when I use movement, normal jump, spin jump, action, reserve and pause, then each documented action is reachable.
- AC-2: Given the controls menu, when I remap a command, then its prompt and binding update and persist with settings.

Edge cases:
- EC-1: Conflicting or unsupported binding → explain the conflict and keep a usable binding, including menu navigation.
- EC-2: Focus lost while a key is held → pause and release the action; returning does not move Arthur until fresh input.

### US-005: Gamepad control
As a controller player, I want menus and gameplay to work with my gamepad so that I do not need the keyboard during a session.

Acceptance criteria:
- AC-1: Given a recognized controller, when I navigate slots and play, then the required commands have visible button guidance.
- AC-2: Given an analog stick near its center, when I release it, then Arthur stops according to normal braking rather than drifting from stick noise.

Edge cases:
- EC-1: Controller disconnected midjump → pause, clear held actions and offer reconnect or another input method.
- EC-2: More than one controller or simultaneous keyboard input → one player remains active and each game action is applied only once.

### US-006: Touch and orientation
As a mobile player, I want simultaneous touch controls so that I can move, jump and act without browser gestures interfering.

Acceptance criteria:
- AC-1: Given touch play, when I hold movement and jump/action with different fingers, then the same mechanics remain usable.
- AC-2: Given a supported phone/tablet viewport, when controls appear, then they remain visible and the game recommends landscape without losing the campaign.

Edge cases:
- EC-1: Finger leaves a control, touch is canceled or orientation changes → release that action and safely pause when layout changes.
- EC-2: Small viewport or denied fullscreen → a readable view or rotate guidance remains; no trapped menu or accidental page scrolling during gameplay input.

## Movement and interactions

### US-007: Run and jump
As a player, I want predictable movement so that timing challenges depend on my input.

Acceptance criteria:
- AC-1: Given solid terrain, when I accelerate, brake, crouch and jump with different hold durations, then the movement and jump heights follow consistent rules across modes.
- AC-2: Given normal versus spin jump, when I contact their supported enemies or blocks, then the distinct bounce/attack outcomes are visible.

Edge cases:
- EC-1: Slow rendering or repeated input events → no wall tunneling, extra jump or faster simulation.
- EC-2: Jump at an edge or against a ceiling → a stable collision outcome without becoming embedded or gaining a second unintended jump.

### US-008: Slopes and vertical-run surfaces
As a player, I want terrain-specific movement so that slopes and special surfaces create distinct routes.

Acceptance criteria:
- AC-1: Given a slope, when I traverse or crouch-slide down it, then I stay on its surface and hit eligible enemies with the slide.
- AC-2: Given the required approach to a triangular surface, when I run into it, then the special vertical route is available; the mount has its documented rebound equivalent.

Edge cases:
- EC-1: A slope meets flat ground or a wall → no sinking, hovering or passing through the corner.
- EC-2: Insufficient speed or unsupported surface → ordinary collision, not unexplained vertical running.

### US-009: Swim
As a player, I want water movement so that underwater routes have their own controllable challenges.

Acceptance criteria:
- AC-1: Given water, when I steer and swim, then Arthur uses the water movement rules and can exit at eligible boundaries.
- AC-2: Given a supported carried object, when I enter water, then its effect and retention follow the documented object rule.

Edge cases:
- EC-1: Crossing the surface repeatedly → no duplicate jump, floating state lock or lost carried object.
- EC-2: Respawn beside water → a safe checkpoint, not immediate lethal contact or an invalid movement state.

### US-010: Climb and use fences
As a player, I want climbable routes and fence sides so that vertical traversal differs from jumping.

Acceptance criteria:
- AC-1: Given a rope, vine or fence, when I grab and move, then I climb and can intentionally release into ordinary movement.
- AC-2: Given a two-sided fence, when I use a revolving gate or fence attack, then the side and eligible enemy interaction are correct.

Edge cases:
- EC-1: Repeated gate input while changing sides → one transition, without duplicating Arthur or passing through nonclimbable geometry.
- EC-2: A climbing route ends or changes subarea → no invisible attachment to the previous fence.

### US-011: Doors, pipes and camera
As a player, I want clear subarea traversal so that I can explore routes and secrets.

Acceptance criteria:
- AC-1: Given an eligible door/pipe, when I use its entry action, then I emerge at its paired safe destination with permitted state preserved.
- AC-2: Given a level allowing look-ahead, when I use the camera command, then it respects the authored limits and does not reveal impossible traversal.

Edge cases:
- EC-1: Entry input repeated during transfer → one transfer without duplicate rewards or lost state.
- EC-2: Missing or invalid destination → a caught content error, not a playable dead end, infinite transfer or player deletion.

### US-012: Forms, damage and reserve
As a player, I want recognizable power states and one reserve item so that I can plan combat and recovery.

Acceptance criteria:
- AC-1: Given small, large, projectile or gliding Arthur, when I collect a power or take damage, then the selected mode's transformation rules apply.
- AC-2: Given the reserve, when I manually release it or its damage-triggered rule applies, then one collectible item appears and the reserve updates once.

Edge cases:
- EC-1: Multiple enemy contacts during damage protection → at most one permitted damage transition, not rapid form/life loss.
- EC-2: Power pickup and damage in the same moment → one documented result, with no impossible form/reserve combination.

### US-013: Temporary powers
As a player, I want timed invincibility and floating abilities so that special sections expand movement and combat.

Acceptance criteria:
- AC-1: Given a temporary power, when I collect it, then its visual state and limited duration are apparent and the appropriate enemy interaction changes.
- AC-2: Given expiration, when the duration ends, then normal rules resume without leaving Arthur trapped by changed collision size.

Edge cases:
- EC-1: Pause, death or subarea transfer while powered → duration and restored state follow the authored contract, without indefinite invincibility.
- EC-2: Invincible contact with a pit or other instant-death boundary → a life is still lost as specified.

### US-014: Flight
As a player, I want run-up takeoff, glide and dive so that aerial routes require skilled control.

Acceptance criteria:
- AC-1: Given the gliding form and sufficient runway, when I take off and steer, then I can control lift/descent through the documented flight inputs.
- AC-2: Given an eligible flight attack, when I spin or dive, then supported enemies receive the correct effect and landing returns to ordinary movement.

Edge cases:
- EC-1: Insufficient runway or lost power → no unintended takeoff or persistent flight.
- EC-2: Flight into terrain, map boundary or moving platform → safe bounded collision, not tunneling or camera escape.

### US-015: Mount
As a player, I want an original mount with distinct abilities so that mounted traversal and shell puzzles remain part of the game.

Acceptance criteria:
- AC-1: Given the mount, when I ride, dismount, eat, hold or spit a supported target, then Arthur and the mount have a single consistent ownership state.
- AC-2: Given the documented shell/mount variants, when I use them, then fire, flight, landing attack, growth and feeding outcomes remain distinct.

Edge cases:
- EC-1: Mount damage → its flee behavior is recoverable; no duplicate mount, duplicated swallowed object or unintended Arthur damage chain.
- EC-2: Restricted subarea or checkpoint reload → apply a documented safe mount rule; never spawn it inside an unsupported area.

### US-016: Carryable objects
As a player, I want carrying, placing, kicking and throwing so that object puzzles and combat work predictably.

Acceptance criteria:
- AC-1: Given a supported shell, key, spring, block or timed object, when I pick up/place/throw it, then its identity and behavior remain intact.
- AC-2: Given an eligible target, when a moving object hits it, then the response and score occur once.

Edge cases:
- EC-1: Two pickup candidates or repeated action → Arthur carries no more than the permitted object, without duplication.
- EC-2: Required key or object lost → a replenishment/recovery route prevents permanently blocking a mandatory exit.

### US-017: Blocks
As an explorer, I want distinct blocks so that interactions reveal rewards and paths.

Acceptance criteria:
- AC-1: Given each required block family, when I hit, spin-break, grab or bounce on it, then its own supported behavior occurs.
- AC-2: Given a consumed reward block, when I hit it again, then its consumed state is visible and no duplicate unique reward appears.

Edge cases:
- EC-1: Two contacts against the same reward → at most one reward event.
- EC-2: A hidden or temporary block changes collision near Arthur → no trapping, crushing without a visible hazard or embedding in new geometry.

### US-018: Switches
As an explorer, I want temporary and permanent switches so that puzzles and world changes have distinct persistence.

Acceptance criteria:
- AC-1: Given a temporary switch, when I activate it, then the associated world-object transformation expires according to its timer.
- AC-2: Given one of the four permanent sanctuary switches, when I complete it, then its owned effects persist until a reset scope erases that sanctuary.

Edge cases:
- EC-1: Reload or repeat activation → no duplicated conversion/reward and no permanently stuck temporary effect.
- EC-2: Classic resets a world with a sanctuary → its effects turn off, unrelated sanctuary effects remain and other worlds stay accessible as specified.

### US-019: Platforms and environment
As a player, I want moving terrain and hazards so that authored levels have varied traversal challenges.

Acceptance criteria:
- AC-1: Given moving, falling, guided, rotating or balance platforms, when Arthur rides them, then he is carried without sinking or passing through nearby terrain.
- AC-2: Given conveyors, ice, crushers, changing water, lava, vertical or autoscrolling sections, when I traverse them, then their readable authored rules apply.

Edge cases:
- EC-1: Two moving surfaces converge → an explicit crush or escape outcome, never silent clipping.
- EC-2: Checkpoint resume or frame-rate change → a safe reproducible hazard arrangement and no offscreen unavoidable immediate death.

### US-020: Enemy interactions
As a player, I want distinguishable enemies so that I learn which actions work against them.

Acceptance criteria:
- AC-1: Given each required behavior family, when it acts, then patrol, flight, water movement, pursuit, armor, gaze reaction or regeneration is recognizable.
- AC-2: Given jump, spin, projectile, shell, slide, block strike, mount or invincibility contact, when applied to an enemy, then its documented vulnerability produces the correct response.

Edge cases:
- EC-1: Multiple defeat events in one moment → at most one death and reward for that enemy.
- EC-2: Offscreen, paused or restored enemies → no stale projectile or hidden hit that invalidates the restart point.

### US-021: Boss encounters
As a player, I want original bosses with varied attack solutions so that world conclusions test learned skills.

Acceptance criteria:
- AC-1: Given each main world's boss stage, when I enter, then its readable arena/pattern supports the intended nontrivial defeat method.
- AC-2: Given the final staged encounter, when I complete all stages, then one victory event concludes the story and records progression.

Edge cases:
- EC-1: Arthur and boss suffer terminal hits together → a defined outcome, not simultaneous uncommitted victory and Game Over.
- EC-2: Required ammunition, throwable target or mount lost → an authored recovery path keeps the fight solvable.

## Rewards, progress and penalties

### US-022: Rewards and HUD
As a player, I want accurate coins, lives, score, time and power indicators so that I understand my state.

Acceptance criteria:
- AC-1: Given a coin threshold or eligible defeat chain, when I earn a reward, then lives/score update according to the documented rule once.
- AC-2: Given play or pause, when I inspect the HUD, then lives, reserve, time, coins, medallions and bonus progress match the active campaign.

Edge cases:
- EC-1: Counter maximum or large chain → documented bounded display and reward behavior, without negative values or overflow.
- EC-2: Exit/death overlaps a reward → one ordered result and no repeated reward after reopening.

### US-023: Special collectibles
As an explorer, I want medallions to accumulate across attempts so that collecting every one is achievable without repeating the entire set.

Acceptance criteria:
- AC-1: Given a new medallion, when I reach a checkpoint or exit, then its unique collection mark persists into another attempt.
- AC-2: Given a newly completed five-medallion set, when it is committed, then its life reward occurs once and the completion view updates.

Edge cases:
- EC-1: Death before checkpoint/exit → only new uncommitted medallions are lost; previously committed marks remain unless Game Over resets their scope.
- EC-2: Recollect a marked item or replay a completed set → no duplicate completion or unlimited life farming.

### US-024: Bonus activities
As a player, I want exit rewards and bonus activities so that exploration and good timing grant useful rewards.

Acceptance criteria:
- AC-1: Given a reward-bearing exit, when I finish it, then its timing/position reward and remaining-time score conversion follow the declared rules.
- AC-2: Given a hundred bonus stars, when the threshold is crossed, then one symbol-alignment bonus game grants its earned rewards and consumes the threshold.

Edge cases:
- EC-1: Exit animation interrupted after commit → resume with the reward already recorded, without repeating the bonus.
- EC-2: Insufficient bonus progress or revisiting a replenishment area → only its declared repeatable resources recur; no duplicate unique progression.

### US-025: Checkpoint continuation
As a player, I want autosave and safe checkpoint continuation so that closing the browser does not discard committed progress.

Acceptance criteria:
- AC-1: Given each mode's available checkpoint, when I reach it, then the save records its safe restart and current committed campaign state.
- AC-2: Given a saved checkpoint, when I reopen and continue, then I resume there with the documented timer, state and fresh hazard arrangement.

Edge cases:
- EC-1: Checkpoint event duplicated → no duplicate reward or life change.
- EC-2: Reset/deletion invalidates a checkpoint → it cannot resume; use the valid reset destination and explain a genuinely incompatible save.

### US-026: Ordinary death
As a player, I want a single predictable life loss so that hazards do not cause accidental compounded penalties.

Acceptance criteria:
- AC-1: Given lives remaining, when Arthur dies, then exactly one life is lost and the latest eligible checkpoint or level start is restored.
- AC-2: Given pickups since that checkpoint, when death occurs, then uncommitted pickups disappear while previously committed progress remains.

Edge cases:
- EC-1: Multiple lethal contacts or input during death animation → exactly one death transition; checkpoint restore or browser reopen keeps the reduced life count instead of restoring the snapshot's older lives.
- EC-2: Last life consumed → Game Over takes precedence over ordinary checkpoint respawn.

### US-027: Game Over
As a player, I want the selected difficulty's advertised penalty to apply consistently so that the challenge is meaningful.

Acceptance criteria:
- AC-1: Given zero lives, when Game Over commits, then Easy resets the level, Classic resets the current world and Hard resets the active campaign, according to the PRD reset boundaries.
- AC-2: Given Continue, when I restart, then the correct destination, renewed lives, cleared run state and retained difficulty appear; all other slots are unchanged.

Edge cases:
- EC-1: Closing/reopening or a delayed pre-reset save → no silent recovery of erased progression; genuine divergent versions use the conflict flow.
- EC-2: Classic death in a secret or revisited world → reset that world only; preserved other-world progress remains accessible without an invalid checkpoint or shortcut.

### US-028: Overworld routes
As an explorer, I want normal and secret exits to unlock distinct routes so that exploration changes my path.

Acceptance criteria:
- AC-1: Given a normal/secret/key/boss/orb exit, when I complete it, then its unique exit mark and declared route update together.
- AC-2: Given a completed accessible level, when I select it on the map, then I can replay it; a locked route shows its locked state.

Edge cases:
- EC-1: Repeat an exit → no duplicate exit count or contradictory route state.
- EC-2: A world reset removes an outgoing shortcut → it becomes unavailable until earned again, without erasing unrelated visited worlds.

### US-029: Secret worlds
As an explorer, I want two secret worlds and a travel network so that alternate exits lead to meaningful challenges.

Acceptance criteria:
- AC-1: Given an authored qualifying secret exit, when I discover it, then the first secret world/network becomes reachable as its route declares.
- AC-2: Given the first network's required route completion, when its condition is met, then the second secret world becomes accessible.

Edge cases:
- EC-1: Attempt a destination without its prerequisites → blocked visibly, not a softlock or skipped progression.
- EC-2: Reset a relevant world → its owned routes reset while preserved destinations remain reachable under the visited-world rule.

### US-030: Complete original campaign
As a player, I want 120 real original levels so that the game delivers the selected campaign rather than a short demo.

Acceptance criteria:
- AC-1: Given the campaign catalog, when I explore all worlds, then there are exactly 10 main worlds, 2 secret worlds and 120 playable levels; subareas/exits do not inflate the count.
- AC-2: Given the full campaign, when reviewed and played, then levels have distinct traversal/objective/hazard arrangements and the required mechanical families have actual authored uses.

Edge cases:
- EC-1: Missing, duplicate or dangling level/exit identity → content validation fails before publication.
- EC-2: Mandatory route depends on a consumable unavailable power/object → a recovery route must exist; QA rejects a permanently unsolvable level.

### US-031: Story victory and 100%
As an explorer, I want separate ending and completion milestones so that finishing the story does not conceal remaining secrets.

Acceptance criteria:
- AC-1: Given final boss victory, when the story ends, then a short skippable ending appears and the saved campaign remains playable.
- AC-2: Given all levels, all defined exits and all medallions, when I inspect completion, then it reads 100%; before that, separate counts show what is missing.

Edge cases:
- EC-1: One secret exit or medallion missing → never claim 100% from level completion alone.
- EC-2: Game Over resets completion-owned state → completion falls accordingly; a cosmetic secret reward must not preserve erased gameplay progress or obscure hazards.

## Persistence and account flows

### US-032: Guest local continuation
As a guest, I want my six campaigns to remain on this device so that I can return without an account.

Acceptance criteria:
- AC-1: Given a completed checkpoint or level save, when I close/reopen this browser, then the saved campaign and selected difficulty are available.
- AC-2: Given no account, when I continue, then sign-in is never mandatory and local save status is explicit.

Edge cases:
- EC-1: Local storage unavailable, full or cleared → explain its impact and never falsely claim durable progress.
- EC-2: Corrupted slot → isolate that slot and offer an explicit recovery/new-campaign action; other slots remain usable.

### US-033: Optional account continuation
As an account player, I want private cross-device saves so that I can continue my campaign elsewhere.

Acceptance criteria:
- AC-1: Given successful sign-in and synchronization, when I open another supported device, then my six account slots and committed state are available.
- AC-2: Given another account or logout, when slots are displayed, then private account saves are not exposed as the next guest's campaigns.

Edge cases:
- EC-1: Expired session or network failure → keep local continuation usable and show pending sign-in/sync rather than deleting progress.
- EC-2: Attempt to access another player's campaign → no private save data is returned or changed.

### US-034: Guest-save import
As an account player, I want to choose which guest campaigns to import so that account setup does not discard my progress.

Acceptance criteria:
- AC-1: Given guest slots after login, when import is offered, then I can choose slots or decline without losing local progress.
- AC-2: Given an occupied account slot, when I import, then I see both campaigns and explicitly choose which version occupies that slot.

Edge cases:
- EC-1: Cancel or partial network failure → no unrelated slot overwritten; imported and pending slots are identified separately.
- EC-2: Duplicate import action → one resulting version, not duplicated campaign rewards or loss of the unchosen source without confirmation.

### US-035: Device conflict choice
As an account player, I want to compare divergent campaign versions so that the game does not silently choose for me.

Acceptance criteria:
- AC-1: Given two divergent versions, when synchronization detects the conflict, then I see their difficulty, world, completion, checkpoint, save time and reset status.
- AC-2: Given my choice, when resolution succeeds, then one whole version becomes authoritative; progression is not merged or chosen only by timestamp.

Edge cases:
- EC-1: Another device updates while the conflict screen is open → refresh the versions and require a valid choice rather than overwrite unseen progress.
- EC-2: One version predates Game Over → explain that distinction; only an explicit replacement can restore it, never a late background save.

### US-036: Save failure and recovery
As a player, I want truthful save status so that I know whether I can safely leave.

Acceptance criteria:
- AC-1: Given a failed cloud write, when the failure is shown, then a usable local campaign is retained and retry is available.
- AC-2: Given a failed local write, when the game reports it, then it clearly says progress is not safely saved rather than showing success.

Edge cases:
- EC-1: Interrupted write or corrupted/incompatible version → detect the problem without crashing or silently erasing unaffected data.
- EC-2: Rapid checkpoints followed by reset → a retry cannot publish the older checkpoint over the reset.

## Presentation and delivery

### US-037: Original identity and short story
As a player, I want Arthur's Brazilian-inspired adventure so that the game has the chosen identity without lengthy interruptions.

Acceptance criteria:
- AC-1: Given title, character and environments, when I play, then the title is Super Arthur World, the protagonist is Arthur and the art uses restrained SNES-era pixel presentation.
- AC-2: Given opening, boss dialogue or ending, when I skip it, then play/progression continues without loss of rewards or mandatory context hidden behind a long scene.

Edge cases:
- EC-1: Replaying a completed stage → no forced repeated story sequence.
- EC-2: Reduced effects or small screen → dialogue remains readable and muted art retains useful hazard/foreground contrast.

### US-038: Pause and sound
As a player, I want pause and sound settings so that browser interruptions do not punish me.

Acceptance criteria:
- AC-1: Given a pause/menu/focus loss, when simulation pauses, then movement, hazards and the level timer stop until intentional resume.
- AC-2: Given music/effect volume or mute settings, when I change them, then their independent settings persist and sound respects the choice.

Edge cases:
- EC-1: Browser blocks audio/fullscreen → the game remains playable, with an intentional sound-enable action where needed.
- EC-2: Switch tabs or disconnect input while a menu opens → no hidden continued simulation or automatic unsafe resume.

### US-039: Readable accessible interaction
As a player, I want readable menus and non-color-only cues so that controls and status are understandable.

Acceptance criteria:
- AC-1: Given menus and settings, when I navigate without a mouse, then focus, labels and actions are clear and reachable.
- AC-2: Given switches, collectibles, damage or reduced-effect settings, when they are displayed, then shape/icon/text cues supplement color and reduced flashes/shake do not change rules.

Edge cases:
- EC-1: Large text setting or narrow viewport → controls and confirmations remain reachable without text covering essential actions.
- EC-2: Input prompts switch device → relevant guidance changes without resetting progress or requiring all devices.

### US-040: Reproducible QA and publication
As the owner/QA agent, I want build and failure reproduction tools so that autonomous implementation can find bugs before publication.

Acceptance criteria:
- AC-1: Given authored levels and required behaviors, when project verification runs, then invalid routes/content and core movement, interaction, reset and save failures are reported reproducibly.
- AC-2: Given a candidate final build, when an independent QA subagent verifies the complete flow and fixes are rechecked, then publish to Vercel and verify the actual published version through guest and account journeys.

Edge cases:
- EC-1: Relevant unresolved QA failure or wrong deployed revision → do not claim completion; fix and repeat appropriate verification.
- EC-2: Missing auth/resource access or unavailable mobile verification → record the actual limitation, keep unaffected work moving and do not fabricate passing evidence.

## Edge-case sweep and applicability

Each story above was probed against invalid input, missing state, limits, permissions, concurrency, interruption, repetition, ordering, state transitions and scale. The following shared cases supplement each story's specific ECs and are referenced as `SW-NN`; do not duplicate forty identical tests merely to reproduce this table.

| ID | Class | Applicable stories | Expected outcome |
|---|---|---|---|
| SW-01 | Invalid input | US-001–US-040 | Unsupported input/content/state is rejected at its boundary; no impossible action, silent overwrite or crash. Local gameplay stories have no free-form user payload; probe malformed authored content and invalid control states instead. |
| SW-02 | Empty/missing | US-001–US-040 | First-run state works; missing optional powers/controller/account do not block ordinary play; missing required content fails validation/loading explicitly. |
| SW-03 | Limits | US-001–US-040 | Six slots, one player, finite counters and bounded content obey their limits. No negative lives, excessive duplicate entities or clipped unusable UI. Concrete numeric bounds are Techspec contracts. |
| SW-04 | Permissions | US-001–US-006, US-025, US-027–US-040 | Account data stays owner-private; browser-denied input/audio/fullscreen/storage yields its specified user-facing outcome. Other local mechanics have no account permission gate and remain guest-capable. |
| SW-05 | Concurrency | US-001–US-040 | Duplicate/simultaneous events have one ordered outcome; overlapping saves and device versions follow conflict rules. Local enemy/object stories probe simultaneous contacts rather than invented multiplayer. |
| SW-06 | Interruption | US-001–US-040 | Focus/background pauses; checkpoint/exit commits survive only when actually saved; failed writes are truthful; canceled menus do not mutate unrelated state. |
| SW-07 | Repetition | US-001–US-040 | Repeated input, defeat, pickup, exit, import or retry does not duplicate unique rewards, lose multiple lives or count the same achievement twice. |
| SW-08 | Ordering | US-001–US-040 | Prerequisites are enforced; Game Over wins over respawn, resets invalidate old checkpoints, locked routes cannot be entered through stale menus. |
| SW-09 | State transitions | US-001–US-040 | Deleted/reset campaigns, defeated entities and consumed items cannot receive actions as if still active; transitions clear stale input and ownership. |
| SW-10 | Scale | US-001–US-040 | Validate empty, typical and complete 120-level campaigns; unusually dense or malformed content is bounded/rejected, not a promise of arbitrary-size mod support. Account/data volumes are tested proportionally to six slots, without enterprise load requirements. |

Author-default values and content proposals originate in the PRD and must not be described downstream as user-confirmed facts. No implementation technique is mandated by this story catalog.
