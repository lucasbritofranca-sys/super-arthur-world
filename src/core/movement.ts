import type { Action, ActionFrame, ActorState, CarriedDescriptor, Difficulty, LevelDefinition, RestartSnapshot, RunState, Simulation, SimulationState, Vec2 } from './types';
import type { DomainEvent } from './events';
import { CollisionSolver } from './collision';
import { EPSILON, bottom, horizontalOverlap, overlaps, right } from './geometry';
import { PlatformSystem, surfaceFloor, type DynamicSurface } from './platforms';
import { region, platform, transfer, validateTerrainLevel, safeAnchor, entityRect, type Region } from './traversal';
import { MechanicsWorld, type AreaMechanicMemory } from './mechanics/world';
import type { Context, MechanicView } from './mechanics/model';
import { validateMechanics } from './mechanics/validation';
import { validateRestart } from './schema';
import { alignCarried } from './mechanics/objects';

export const TUNING = { walk: 90, run: 150, acceleration: 900, braking: 1200, airAcceleration: 450, gravity: 900, jump: -270, spin: -240, fall: 360, release: -120, buffer: 5, grace: 4 } as const;
const DT = 1 / 60;
const approach = (v: number, target: number, amount: number): number => v < target ? Math.min(v + amount, target) : Math.max(v - amount, target);
export interface TerrainPlayer extends ActorState {
  climbTarget: string | null; fenceSide: 'front' | 'back'; gateTicks: number; verticalRun: string | null;
  crouching: boolean; spinning: boolean; carried: CarriedDescriptor | null;
  launchSupportId?: string | null;
}
export interface TerrainState extends SimulationState { player: TerrainPlayer; surfaces: readonly DynamicSurface[]; run: RunState; mechanics?: MechanicView; pickups?: readonly { id: string; body: import('./types').Rect; form: string }[]; pendingMedallions?: readonly string[] }
export interface SimulationOptions { level: LevelDefinition; difficulty?: Difficulty; seed?: number; attemptId?: string; run?: RunState; position?: Vec2; velocity?: Vec2; displacementBudget?: number }
export function validateSimulationOptions(options: SimulationOptions): { path: string; code: string }[] {
  const result = validateTerrainLevel(options.level); const issues = result.ok ? [] : [...result.issues];
  if (result.ok) issues.push(...validateMechanics(options.level));
  for (const [key, value] of Object.entries({ position: options.position, velocity: options.velocity })) if (value && ![value.x, value.y].every(Number.isFinite)) issues.push({ path: key, code: 'non_finite' });
  if (result.ok && options.position && [options.position.x, options.position.y].every(Number.isFinite) && !safeAnchor(options.level.subareas[0]!, options.position)) issues.push({ path: 'position', code: 'unsafe_spawn' });
  if (options.attemptId !== undefined && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(options.attemptId)) issues.push({ path: 'attemptId', code: 'invalid_uuid' });
  if (options.displacementBudget !== undefined && (!Number.isFinite(options.displacementBudget) || options.displacementBudget > 64 || options.displacementBudget <= 0)) issues.push({ path: 'displacementBudget', code: 'displacement_budget' });
  return issues;
}
const emptyRun = (): RunState => ({ coins: 0, bonusStars: 0, score: 0, form: 'small', reserve: null, carried: null, mount: null, effects: { invincibility: 0, float: 0, mountShell: 0 } });
export class TerrainSimulation implements Simulation {
  private state: TerrainState;
  private solver: CollisionSolver;
  private platforms: PlatformSystem;
  private regions: Region[] = [];
  private previousHeld = new Set<Action>();
  private jumpBuffer = 0; private grace = 0; private transferTicks = 0;
  private bufferedSpin = false; private attemptOrdinal = 0;
  private pendingDestination: { subareaId: string; anchor: Vec2; carry: boolean } | null = null;
  private mechanics!: MechanicsWorld;
  private pendingMedallions = new Set<string>();
  private checkpointMarks = new Set<string>();
  private exited = false;
  private areaMemories = new Map<string, AreaMechanicMemory>();
  constructor(readonly options: SimulationOptions) {
    const errors = validateSimulationOptions(options); if (errors.length) throw new Error(JSON.stringify(errors));
    const area = options.level.subareas[0]!; const position = options.position ?? area.spawn;
    const run = structuredClone(options.run ?? emptyRun());
    const player: TerrainPlayer = { id: 'arthur', position: { ...position }, velocity: { ...(options.velocity ?? { x: 0, y: 0 }) }, body: { x: position.x - 8, y: position.y - 16, width: 16, height: 16 }, hurt: { x: position.x - 8, y: position.y - 16, width: 16, height: 16 }, attack: null, mode: 'air', grounded: false, supportId: null, facing: 1, form: run.form, climbTarget: null, fenceSide: 'front', gateTicks: 0, verticalRun: null, crouching: false, spinning: false, carried: run.carried };
    const timerMultiplier = options.difficulty === 'easy' ? 1.5 : options.difficulty === 'hard' ? 0.8 : 1;
    this.state = { tick: 0, levelId: options.level.id, subareaId: area.id, player, remainingTicks: Math.round(options.level.baselineTimer * 60 * timerMultiplier), run, surfaces: [] };
    this.solver = new CollisionSolver(area.terrain); this.platforms = new PlatformSystem([]); this.enterArea(area.id);
    if (this.applyMove(0, 0, false)) throw new Error('unsafe_spawn'); this.syncPlayer();
  }
  private enterArea(id: string, remember = true): void {
    if (this.mechanics && remember) this.areaMemories.set(this.state.subareaId, this.mechanics.memory());
    const area = this.options.level.subareas.find(a => a.id === id); if (!area) throw new Error('dangling_destination');
    this.state.subareaId = id; this.solver = new CollisionSolver(area.terrain);
    this.mechanics = new MechanicsWorld(area, this.state.run, this.areaMemories.get(id));
    this.regions = area.entities.filter(e => ['water', 'vine', 'rope', 'fence', 'gate', 'ice', 'conveyor', 'lava'].includes(e.kind)).map(region);
    this.platforms = new PlatformSystem(area.entities.filter(e => e.kind.startsWith('platform:')).map(platform));
    this.platforms.step(0, null); this.state.surfaces = this.platforms.surfaces;
    const p = this.state.player; p.climbTarget = null; p.verticalRun = null; p.gateTicks = 0; p.fenceSide = 'front'; p.supportId = null; p.grounded = false;
  }
  private syncPlayer(): void {
    const p = this.state.player; p.position = { x: p.body.x + p.body.width / 2, y: bottom(p.body) }; p.hurt = { ...p.body }; this.state.run.carried = p.carried;
    const mounted = this.mechanics.state.mounts.find(m => m.descriptor.id === this.state.run.mount?.id);
    if (mounted) mounted.body = { ...mounted.body, x: p.body.x, y: bottom(p.body) - 16 };
    const bounds = this.options.level.subareas.find(a => a.id === this.state.subareaId)!.bounds;
    alignCarried(p, this.mechanics.state.objects, body => body.x >= bounds.x && right(body) <= right(bounds) && body.y >= bounds.y && bottom(body) <= bottom(bounds) && !this.solver.move(body, 0, 0, this.platforms.surfaces).crushed);
    for (const object of this.mechanics.state.objects) if (object.mode === 'mouth') {
      const owner = this.mechanics.state.mounts.find(m => m.descriptor.id === object.owner);
      if (owner) object.body = { ...object.body, x: owner.body.x, y: bottom(owner.body) - object.body.height };
    }
  }
  private context(input: ActionFrame, events: DomainEvent[]): Context {
    const bounds = this.options.level.subareas.find(a => a.id === this.state.subareaId)!.bounds;
    return { player: this.state.player, run: this.state.run, tick: this.state.tick, difficulty: this.options.difficulty ?? 'classic', input,
      move: (body, dx, dy, exclude) => this.solver.move(body, dx, dy, this.platforms.surfaces, false, exclude ?? null),
      clear: body => body.x >= bounds.x && right(body) <= right(bounds) && body.y >= bounds.y && bottom(body) <= bottom(bounds) && !this.solver.move(body, 0, 0, this.platforms.surfaces).crushed,
      event: kind => this.eventId(kind), terrain: this.solver.terrain, surfaces: this.platforms.surfaces, emit: event => events.push(event) };
  }
  private rebuildTerrain(): void { const area = this.options.level.subareas.find(a => a.id === this.state.subareaId)!; this.solver = new CollisionSolver([...area.terrain, ...this.mechanics.terrain()]); }
  snapshot(checkpointId: string | null = null): RestartSnapshot { return { levelId: this.state.levelId, subareaId: this.state.subareaId, checkpointId, anchor: { ...this.state.player.position }, remainingTicks: this.state.remainingTicks, run: structuredClone(this.state.run), hazardSeed: this.options.seed ?? 17 }; }
  private exitEvent(exitId: string): DomainEvent {
    const entity = this.options.level.subareas.flatMap(a => a.entities).find(e => e.kind === 'exit' && e.parameters['exitId'] === exitId);
    return { kind: 'exit', eventId: this.eventId(`exit:${exitId}`), tick: this.state.tick, exitId, levelId: this.state.levelId, bonusStars: Number(entity?.parameters['bonusStars'] ?? 0), medallions: [...this.pendingMedallions].sort(), remainingTicks: this.state.remainingTicks, run: structuredClone(this.state.run) };
  }
  private applyMove(dx: number, dy: number, snap: boolean, exclude: string | null = null): boolean {
    const p = this.state.player; const result = this.solver.move(p.body, dx, dy, this.platforms.surfaces, snap, exclude);
    p.body = result.body; p.supportId = result.support?.id ?? null; p.grounded = !!result.support;
    if (result.blockedX) p.velocity.x = 0; if (result.blockedY) p.velocity.y = 0;
    this.syncPlayer(); return result.crushed;
  }
  private lethal(cause: 'crush' | 'pit' | 'lava' | 'timeout' | 'contact'): DomainEvent[] {
    const p = this.state.player; p.mode = 'dying'; p.velocity = { x: 0, y: 0 };
    return [{ kind: 'death', eventId: this.eventId('death'), tick: this.state.tick, cause, levelId: this.state.levelId, worldId: this.options.level.worldId }];
  }
  private eventId(kind: string): string {
    const identity = `${this.options.attemptId ?? '00000000-0000-4000-8000-000000000000'}/${this.attemptOrdinal}/${this.state.levelId}/${kind}/${this.state.tick}`;
    const words = [2166136261, 2246822519, 3266489917, 668265263].map(seed => { let hash = seed; for (let i = 0; i < identity.length; i++) hash = Math.imul(hash ^ identity.charCodeAt(i), 16777619); return (hash >>> 0).toString(16).padStart(8, '0'); });
    const hex = words.join(''); return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20)}`;
  }
  step(input: ActionFrame): readonly DomainEvent[] {
    const p = this.state.player; if (p.mode === 'dying' || this.exited || input.pressed.has('pause')) return [];
    this.state.tick++; this.state.remainingTicks = Math.max(0, this.state.remainingTicks - 1);
    if (!this.state.remainingTicks) return this.lethal('timeout');
    const pressed = new Set([...input.pressed].filter(a => !this.previousHeld.has(a))); this.previousHeld = new Set(input.held);
    if (this.transferTicks) {
      if (--this.transferTicks === 0 && this.pendingDestination) {
        const destination = this.pendingDestination; this.pendingDestination = null;
        if (!destination.carry) { p.carried = null; this.state.run.carried = null; }
        this.enterArea(destination.subareaId); p.body.x = destination.anchor.x - p.body.width / 2; p.body.y = destination.anchor.y - p.body.height;
        p.velocity = { x: 0, y: 0 };
        p.mode = 'air'; this.jumpBuffer = 0; this.grace = 0; this.applyMove(0, 0, false);
        if (p.grounded) p.mode = 'ground';
        return [{ kind: 'transition', eventId: this.eventId('transition'), tick: this.state.tick, subareaId: destination.subareaId }];
      }
      return [];
    }
    const events: DomainEvent[] = [];
    const frame = { ...input, pressed };
    const ctx = this.context(frame, events);
    const previous = { y: p.body.y, bottom: bottom(p.body), vy: p.velocity.y };
    const beforeRun = structuredClone(this.state.run);
    const beforeGrounded = p.grounded;
    const oldSupport = p.supportId; this.platforms.step(this.state.tick, oldSupport);
    this.mechanics.begin(ctx); this.rebuildTerrain();
    const support = this.platforms.surfaces.find(s => s.id === oldSupport);
    if (support) {
      const dx = support.x - support.previous.x;
      const dy = surfaceFloor(support, { ...p.body, x: p.body.x + dx }) - surfaceFloor(support, p.body, true);
      if (this.applyMove(dx, dy, true, support.id)) return this.lethal('crush');
      p.supportId = support.id; p.grounded = true;
    }
    for (const s of this.platforms.surfaces) if (s.id !== oldSupport && !s.tilt) {
      const mx = s.x - s.previous.x; const my = s.y - s.previous.y;
      const count = Math.max(1, Math.ceil(Math.max(Math.abs(mx), Math.abs(my)) / 4));
      for (let n = 1; n <= count; n++) {
        const swept = { ...s, x: s.previous.x + mx * n / count, y: s.previous.y + my * n / count };
        if (!overlaps(p.body, swept)) continue;
        let dx = 0; let dy = 0;
        if (Math.abs(mx) > Math.abs(my)) dx = mx > 0 ? right(swept) - p.body.x : swept.x - right(p.body);
        else if (my) dy = my > 0 ? bottom(swept) - p.body.y : swept.y - bottom(p.body);
        if ((!dx && !dy) || this.applyMove(dx, dy, false, s.id) || overlaps(p.body, swept)) return this.lethal('crush');
      }
    }
    const area = this.options.level.subareas.find(a => a.id === this.state.subareaId)!;
    const xInput = Number(input.held.has('right')) - Number(input.held.has('left'));
    if (xInput) p.facing = xInput as -1 | 1;
    const water = this.regions.find(r => r.kind === 'water' && overlaps(p.body, r));
    const climb = this.regions.find(r => ['rope', 'vine', 'fence'].includes(r.kind) && overlaps(p.body, r));
    if (p.gateTicks > 0) p.gateTicks--;
    if (climb && (input.held.has('up') || input.held.has('down') || p.climbTarget)) {
      p.climbTarget = climb.id; p.mode = climb.kind === 'fence' ? 'fence' : 'climb';
      const gate = this.regions.find(r => r.kind === 'gate' && overlaps(p.body, r));
      if (gate && pressed.has('action') && p.gateTicks === 0) { p.fenceSide = p.fenceSide === 'front' ? 'back' : 'front'; p.gateTicks = 12; }
      p.velocity = { x: p.mode === 'fence' ? xInput * 60 : 0, y: (Number(input.held.has('down')) - Number(input.held.has('up'))) * 60 };
      if (p.mode === 'climb') p.body.x = climb.x + climb.width / 2 - p.body.width / 2;
      if (pressed.has('jump') || pressed.has('spin')) { p.climbTarget = null; p.mode = 'air'; p.velocity.y = TUNING.jump; }
    } else {
      p.climbTarget = null; p.crouching = p.grounded && input.held.has('down');
      if (water) {
        p.mode = 'swim'; p.velocity.x = approach(p.velocity.x, xInput * 70, 400 * DT);
        p.velocity.y = Math.min(90, p.velocity.y + 180 * DT);
        if (pressed.has('jump') || pressed.has('spin')) p.velocity.y = -130;
        if (input.held.has('up')) p.velocity.y = approach(p.velocity.y, -70, 200 * DT);
        if (input.held.has('down')) p.velocity.y = approach(p.velocity.y, 70, 200 * DT);
      } else {
        p.mode = p.grounded ? 'ground' : 'air';
        if (p.grounded) this.grace = TUNING.grace; else this.grace = Math.max(0, this.grace - 1);
        if (pressed.has('jump') || pressed.has('spin')) { this.jumpBuffer = TUNING.buffer; this.bufferedSpin = pressed.has('spin'); } else this.jumpBuffer = Math.max(0, this.jumpBuffer - 1);
        const ice = this.regions.some(r => r.kind === 'ice' && horizontalOverlap(p.body, r) && Math.abs(bottom(p.body) - r.y) < 4);
        const maximum = input.held.has('action') ? TUNING.run : TUNING.walk;
        p.velocity.x = approach(p.velocity.x, p.crouching ? 0 : xInput * maximum, (xInput ? p.grounded ? TUNING.acceleration : TUNING.airAcceleration : ice ? 120 : TUNING.braking) * DT);
        const slope = this.solver.terrain.find(t => t.id === p.supportId && t.shape === 'slope');
        if (slope && p.crouching) p.velocity.x = approach(p.velocity.x, -slope.direction * TUNING.run, TUNING.acceleration * DT);
        p.velocity.y = Math.min(TUNING.fall, p.velocity.y + TUNING.gravity * DT);
        if (this.jumpBuffer && this.grace) { p.launchSupportId = p.supportId; p.spinning = this.bufferedSpin; p.velocity.y = p.spinning ? TUNING.spin : TUNING.jump; this.jumpBuffer = 0; this.grace = 0; p.grounded = false; p.supportId = null; p.mode = 'air'; }
        if ((!input.held.has('jump') && !input.held.has('spin')) && p.velocity.y < TUNING.release) p.velocity.y = TUNING.release;
      }
    }
    const triangle = this.solver.terrain.find(t => t.shape === 'verticalRun' && p.grounded && Math.abs(p.velocity.x) >= TUNING.run - EPSILON && horizontalOverlap({ ...p.body, x: p.body.x + xInput * 3 }, t));
    if (triangle) { p.verticalRun = triangle.id; p.velocity.y = -TUNING.run; p.velocity.x = 0; p.body.x = triangle.direction === 1 ? triangle.x - p.body.width : right(triangle); }
    if (p.verticalRun) {
      const t = this.solver.terrain.find(t => t.id === p.verticalRun)!;
      p.velocity = { x: 0, y: -TUNING.run };
      if (bottom(p.body) <= t.y || pressed.has('jump') || !input.held.has('action')) { p.verticalRun = null; p.velocity.x = -t.direction * TUNING.walk; p.velocity.y = TUNING.jump; }
    }
    this.mechanics.control(ctx, beforeGrounded);
    previous.vy = p.velocity.y;
    let dx = p.velocity.x * DT; const conveyor = this.regions.find(r => r.kind === 'conveyor' && p.grounded && horizontalOverlap(p.body, r) && Math.abs(bottom(p.body) - r.y) < 4);
    if (conveyor) dx += conveyor.speed * DT;
    const wasGrounded = p.grounded;
    if (this.applyMove(dx, p.velocity.y * DT, wasGrounded && p.velocity.y >= 0)) return this.lethal('crush');
    if (!p.climbTarget && !water) p.mode = p.grounded ? 'ground' : 'air';
    p.body.x = Math.max(area.bounds.x, Math.min(area.bounds.x + area.bounds.width - p.body.width, p.body.x)); this.syncPlayer();
    if (p.body.y > bottom(area.bounds)) return this.lethal('pit');
    if (this.regions.some(r => r.kind === 'lava' && overlaps(p.body, r))) return this.lethal('lava');
    const outcome = this.mechanics.finish(ctx, previous); this.syncPlayer();
    if (p.grounded) p.spinning = false;
    if (outcome.lethal) { this.state.run = beforeRun; return this.lethal('contact'); }
    if (!wasGrounded && p.grounded && p.velocity.y === 0) events.push({ kind: 'chainReset', eventId: this.eventId('chainReset'), tick: this.state.tick });
    for (const entity of area.entities) if (entity.kind === 'medallion' && overlaps(p.body, region({ ...entity, kind: 'water' }))) this.pendingMedallions.add(entity.id);
    for (const exitId of outcome.bossExits) { events.push(this.exitEvent(exitId)); this.exited = true; }
    for (const entity of area.entities) {
      if (entity.kind === 'exit' && !this.exited && overlaps(p.body, region({ ...entity, kind: 'water' }))) {
        const exitId = String(entity.parameters['exitId']); const exit = this.options.level.exits.find(e => e.id === exitId);
        if (exit && (exit.kind !== 'key' || this.state.run.carried?.kind === 'key')) { events.push(this.exitEvent(exitId)); this.exited = true; }
      }
    }
    if (!this.exited) for (const cp of this.options.level.checkpoints) if (cp.subareaId === this.state.subareaId && cp.modes.includes(this.options.difficulty ?? 'classic') && !this.checkpointMarks.has(cp.id) && Math.abs(p.position.x - cp.anchor.x) < 16 && Math.abs(p.position.y - cp.anchor.y) < 16) {
      this.checkpointMarks.add(cp.id); events.push({ kind: 'checkpoint', eventId: this.eventId(`checkpoint:${cp.id}`), tick: this.state.tick, snapshot: { ...this.snapshot(cp.id), anchor: { ...cp.anchor } }, medallions: [...this.pendingMedallions].sort() });
    }
    for (const entity of area.entities.filter(e => e.kind === 'pipe' || e.kind === 'door')) {
      const t = transfer(entity);
      if (overlaps(p.body, t) && pressed.has(t.direction as Action)) {
        this.pendingDestination = { subareaId: t.destination, anchor: t.anchor, carry: t.carry }; this.transferTicks = 12; p.mode = 'transition'; p.velocity = { x: 0, y: 0 }; break;
      }
    }
    const bonus = events.find(e => e.kind === 'mountBonus');
    if (bonus?.kind === 'mountBonus') {
      const destination = this.options.level.subareas.find(a => a.id === bonus.destination)!;
      if (this.state.run.mount) this.state.run.mount.color = 'blue';
      this.pendingDestination = { subareaId: destination.id, anchor: destination.spawn, carry: true }; this.transferTicks = 12; p.mode = 'transition'; p.velocity = { x: 0, y: 0 };
    }
    return events;
  }
  view(): Readonly<TerrainState> { return structuredClone({ ...this.state, mechanics: this.mechanics.state, pickups: [...this.mechanics.fallingPowers.filter(p => this.mechanics.powerVisible(p.id)), ...this.mechanics.visiblePickups().map(e => ({ id: e.id, body: entityRect(e), form: e.kind.slice(6) }))], pendingMedallions: [...this.pendingMedallions].sort() }); }
  restart(at: RestartSnapshot): void {
    const parsed = validateRestart(at); if (!parsed.ok) throw new Error(JSON.stringify(parsed.issues));
    if (at.levelId !== this.state.levelId) throw new Error('unknown_level');
    const area = this.options.level.subareas.find(a => a.id === at.subareaId); if (!area || !safeAnchor(area, at.anchor)) throw new Error('unsafe_spawn');
    this.attemptOrdinal++;
    this.areaMemories.clear();
    this.mechanics.reset();
    this.state.run = structuredClone(at.run); this.enterArea(at.subareaId, false); const p = this.state.player;
    p.body = { x: at.anchor.x - 8, y: at.anchor.y - 16, width: 16, height: 16 }; p.velocity = { x: 0, y: 0 }; p.mode = 'air';
    p.carried = this.state.run.carried; p.form = this.state.run.form;
    this.pendingMedallions.clear(); this.checkpointMarks.clear(); this.exited = false; this.rebuildTerrain();
    this.state.tick = 0; this.state.remainingTicks = at.remainingTicks; this.transferTicks = 0; this.pendingDestination = null; this.jumpBuffer = 0; this.grace = 0; this.previousHeld.clear();
    if (this.applyMove(0, 0, false)) throw new Error('unsafe_spawn'); if (p.grounded) p.mode = 'ground';
  }
}
