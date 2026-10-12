import type { Action, ActionFrame, ActorState, CarriedDescriptor, Difficulty, LevelDefinition, RestartSnapshot, RunState, Simulation, SimulationState, Vec2 } from './types';
import type { DomainEvent } from './events';
import { CollisionSolver } from './collision';
import { EPSILON, bottom, horizontalOverlap, overlaps, right } from './geometry';
import { PlatformSystem, surfaceFloor, type DynamicSurface } from './platforms';
import { region, platform, transfer, validateTerrainLevel, safeAnchor, type Region } from './traversal';

export const TUNING = { walk: 90, run: 150, acceleration: 900, braking: 1200, airAcceleration: 450, gravity: 900, jump: -270, spin: -240, fall: 360, release: -120, buffer: 5, grace: 4 } as const;
const DT = 1 / 60;
const approach = (v: number, target: number, amount: number): number => v < target ? Math.min(v + amount, target) : Math.max(v - amount, target);
export interface TerrainPlayer extends ActorState {
  climbTarget: string | null; fenceSide: 'front' | 'back'; gateTicks: number; verticalRun: string | null;
  crouching: boolean; spinning: boolean; carried: CarriedDescriptor | null;
}
export interface TerrainState extends SimulationState { player: TerrainPlayer; surfaces: readonly DynamicSurface[]; run: RunState }
export interface SimulationOptions { level: LevelDefinition; difficulty?: Difficulty; seed?: number; attemptId?: string; run?: RunState; position?: Vec2; velocity?: Vec2; displacementBudget?: number }
export function validateSimulationOptions(options: SimulationOptions): { path: string; code: string }[] {
  const result = validateTerrainLevel(options.level); const issues = result.ok ? [] : [...result.issues];
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
  private enterArea(id: string): void {
    const area = this.options.level.subareas.find(a => a.id === id); if (!area) throw new Error('dangling_destination');
    this.state.subareaId = id; this.solver = new CollisionSolver(area.terrain);
    this.regions = area.entities.filter(e => ['water', 'vine', 'rope', 'fence', 'gate', 'ice', 'conveyor', 'lava'].includes(e.kind)).map(region);
    this.platforms = new PlatformSystem(area.entities.filter(e => e.kind.startsWith('platform:')).map(platform));
    this.platforms.step(0, null); this.state.surfaces = this.platforms.surfaces;
    const p = this.state.player; p.climbTarget = null; p.verticalRun = null; p.gateTicks = 0; p.fenceSide = 'front'; p.supportId = null; p.grounded = false;
  }
  private syncPlayer(): void { const p = this.state.player; p.position = { x: p.body.x + p.body.width / 2, y: bottom(p.body) }; p.hurt = { ...p.body }; this.state.run.carried = p.carried; }
  private applyMove(dx: number, dy: number, snap: boolean, exclude: string | null = null): boolean {
    const p = this.state.player; const result = this.solver.move(p.body, dx, dy, this.platforms.surfaces, snap, exclude);
    p.body = result.body; p.supportId = result.support?.id ?? null; p.grounded = !!result.support;
    if (result.blockedX) p.velocity.x = 0; if (result.blockedY) p.velocity.y = 0;
    this.syncPlayer(); return result.crushed;
  }
  private lethal(cause: 'crush' | 'pit' | 'lava' | 'timeout'): DomainEvent[] {
    const p = this.state.player; p.mode = 'dying'; p.velocity = { x: 0, y: 0 };
    return [{ kind: 'death', eventId: this.eventId('death'), tick: this.state.tick, cause, levelId: this.state.levelId, worldId: this.options.level.worldId }];
  }
  private eventId(kind: string): string {
    const identity = `${this.options.attemptId ?? '00000000-0000-4000-8000-000000000000'}/${this.attemptOrdinal}/${this.state.levelId}/${kind}/${this.state.tick}`;
    const words = [2166136261, 2246822519, 3266489917, 668265263].map(seed => { let hash = seed; for (let i = 0; i < identity.length; i++) hash = Math.imul(hash ^ identity.charCodeAt(i), 16777619); return (hash >>> 0).toString(16).padStart(8, '0'); });
    const hex = words.join(''); return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20)}`;
  }
  step(input: ActionFrame): readonly DomainEvent[] {
    const p = this.state.player; if (p.mode === 'dying' || input.pressed.has('pause')) return [];
    this.state.tick++; this.state.remainingTicks = Math.max(0, this.state.remainingTicks - 1);
    if (!this.state.remainingTicks) return this.lethal('timeout');
    const pressed = new Set([...input.pressed].filter(a => !this.previousHeld.has(a))); this.previousHeld = new Set(input.held);
    if (this.transferTicks) {
      if (--this.transferTicks === 0 && this.pendingDestination) {
        const destination = this.pendingDestination; this.pendingDestination = null;
        this.enterArea(destination.subareaId); p.body.x = destination.anchor.x - p.body.width / 2; p.body.y = destination.anchor.y - p.body.height;
        p.velocity = { x: 0, y: 0 }; if (!destination.carry) p.carried = null;
        p.mode = 'air'; this.jumpBuffer = 0; this.grace = 0; this.applyMove(0, 0, false);
        if (p.grounded) p.mode = 'ground';
        return [{ kind: 'transition', eventId: this.eventId('transition'), tick: this.state.tick, subareaId: destination.subareaId }];
      }
      return [];
    }
    const oldSupport = p.supportId; this.platforms.step(this.state.tick, oldSupport);
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
        if (this.jumpBuffer && this.grace) { p.spinning = this.bufferedSpin; p.velocity.y = p.spinning ? TUNING.spin : TUNING.jump; this.jumpBuffer = 0; this.grace = 0; p.grounded = false; p.supportId = null; p.mode = 'air'; }
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
    let dx = p.velocity.x * DT; const conveyor = this.regions.find(r => r.kind === 'conveyor' && p.grounded && horizontalOverlap(p.body, r) && Math.abs(bottom(p.body) - r.y) < 4);
    if (conveyor) dx += conveyor.speed * DT;
    const wasGrounded = p.grounded;
    if (this.applyMove(dx, p.velocity.y * DT, wasGrounded && p.velocity.y >= 0)) return this.lethal('crush');
    if (!p.climbTarget && !water) p.mode = p.grounded ? 'ground' : 'air';
    if (p.grounded) p.spinning = false;
    p.body.x = Math.max(area.bounds.x, Math.min(area.bounds.x + area.bounds.width - p.body.width, p.body.x)); this.syncPlayer();
    if (p.body.y > bottom(area.bounds)) return this.lethal('pit');
    if (this.regions.some(r => r.kind === 'lava' && overlaps(p.body, r))) return this.lethal('lava');
    for (const entity of area.entities.filter(e => e.kind === 'pipe' || e.kind === 'door')) {
      const t = transfer(entity);
      if (overlaps(p.body, t) && pressed.has(t.direction as Action)) {
        this.pendingDestination = { subareaId: t.destination, anchor: t.anchor, carry: t.carry }; this.transferTicks = 12; p.mode = 'transition'; p.velocity = { x: 0, y: 0 }; break;
      }
    }
    return [];
  }
  view(): Readonly<TerrainState> { return structuredClone(this.state); }
  restart(at: RestartSnapshot): void {
    if (at.levelId !== this.state.levelId) throw new Error('unknown_level');
    const area = this.options.level.subareas.find(a => a.id === at.subareaId); if (!area || !safeAnchor(area, at.anchor)) throw new Error('unsafe_spawn');
    this.attemptOrdinal++;
    this.enterArea(at.subareaId); const p = this.state.player;
    p.body = { x: at.anchor.x - 8, y: at.anchor.y - 16, width: 16, height: 16 }; p.velocity = { x: 0, y: 0 }; p.mode = 'air';
    this.state.run = structuredClone(at.run); p.carried = this.state.run.carried; p.form = this.state.run.form;
    this.state.tick = 0; this.state.remainingTicks = at.remainingTicks; this.transferTicks = 0; this.pendingDestination = null; this.jumpBuffer = 0; this.grace = 0; this.previousHeld.clear();
    if (this.applyMove(0, 0, false)) throw new Error('unsafe_spawn'); if (p.grounded) p.mode = 'ground';
  }
}
