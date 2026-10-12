import { describe, expect, it } from 'vitest';
import { TerrainSimulation, validateSimulationOptions } from '../../src/core/movement';
import { CollisionSolver } from '../../src/core/collision';
import { FixedClock, STEP_MS } from '../../src/core/clock';
import { slopeY, overlaps } from '../../src/core/geometry';
import { validateTerrainLevel } from '../../src/core/traversal';
import { cameraPosition, validateCamera } from '../../src/game/camera';
import { actionFrame } from '../fixtures/foundation';
import { solid, terrainLevel, platformEntity } from '../fixtures/terrain';
import type { DomainEvent } from '../../src/core/events';
import { surfaceY } from '../../src/core/platforms';

describe('Task 02 canonical terrain contract', () => {
  it('UT-006 slow render executes bounded ticks and duplicated held jump cannot retrigger', () => {
    const sim = new TerrainSimulation({ level: terrainLevel([solid('floor', 0, 160, 640), solid('wall', 90, 0, 16, 160)]) });
    const clock = new FixedClock(); const ys: number[] = [];
    expect(clock.advance(250, () => { sim.step(actionFrame(['right', 'jump'], ['jump'])); ys.push(sim.view().player.velocity.y); })).toBe(5);
    expect(clock.discardedSteps).toBeGreaterThan(0); expect(sim.view().player.body.x + 16).toBeLessThanOrEqual(90);
    expect(ys[0]).toBe(-270); expect(ys.slice(1).every(y => y > ys[0]!)).toBe(true);
  });
  it('UT-007 ceiling zeros ascent without a second airborne jump', () => {
    const sim = new TerrainSimulation({ level: terrainLevel([solid('ceiling', 0, 48, 200, 16)]), position: { x: 48, y: 82 }, velocity: { x: 0, y: -270 } });
    sim.step(actionFrame(['jump'], ['jump'])); expect(sim.view().player.body.y).toBeGreaterThanOrEqual(64); expect(sim.view().player.velocity.y).toBe(0);
    sim.step(actionFrame(['jump'], ['jump'])); expect(sim.view().player.velocity.y).toBeGreaterThan(0);
  });
  it('UT-008 crosses flat slope and wall seam without sinking or penetration', () => {
    const slope = { ...solid('slope', 64, 128, 32, 32), shape: 'slope' as const, rise: 32 };
    const wall = solid('wall', 128, 96, 16, 64);
    const sim = new TerrainSimulation({ level: terrainLevel([solid('floor', 0, 160, 64), slope, solid('ridge', 96, 128, 32, 32), wall]) });
    for (let n = 0; n < 60; n++) {
      sim.step(actionFrame(['right'])); const body = sim.view().player.body;
      expect(overlaps(body, wall)).toBe(false);
      if (body.x >= 64 && body.x + body.width <= 96) expect(body.y + body.height).toBeLessThanOrEqual(slopeY(slope, body.x + body.width - 0.01) + 0.02);
      expect(sim.view().player.mode).not.toBe('dying');
    }
    expect(sim.view().player.body.x).toBeGreaterThan(96);
  });
  it('UT-009 triangle requires speed, ordinary walls never grant vertical running', () => {
    for (const shape of ['verticalRun', 'solid'] as const) {
      const level = terrainLevel([solid('floor', 0, 160, 640), { ...solid('triangle', 64, 80, 16, 80), shape }]);
      const sim = new TerrainSimulation({ level, position: { x: 48, y: 160 }, velocity: { x: shape === 'solid' ? 150 : 0, y: 0 } });
      sim.step(actionFrame(['right', 'action'])); expect(sim.view().player.verticalRun).toBeNull();
    }
  });
  it('UT-010 repeated water crossings without jump edge never add an impulse', () => {
    const level = terrainLevel([], [{ id: 'water', kind: 'water', position: { x: 100, y: 0 }, parameters: { width: 100, height: 400 } }]);
    level.subareas[0]!.bounds.height = 100000; level.subareas[0]!.camera.height = 100000; level.subareas[0]!.entities[0]!.parameters['height'] = 100000;
    const sim = new TerrainSimulation({ level, position: { x: 80, y: 160 } }); let crossings = 0; let wet = false;
    for (let n = 0; n < 10; n++) {
      const direction = n % 2 ? 'left' : 'right';
      let crossed = false;
      for (let tick = 0; tick < 200 && !crossed; tick++) { sim.step(actionFrame([direction])); const state = sim.view(); const nowWet = state.player.mode === 'swim'; if (wet !== nowWet) { crossings++; wet = nowWet; crossed = true; } expect(state.player.velocity.y).toBeGreaterThanOrEqual(0); expect(state.player.carried).toBeNull(); }
      expect(crossed).toBe(true);
    }
    expect(crossings).toBe(10);
  });
  it('UT-011 repeated gate actions produce one fence side change', () => {
    const sim = new TerrainSimulation({ level: terrainLevel([], [{ id: 'fence', kind: 'fence', position: { x: 0, y: 0 }, parameters: { width: 100, height: 200 } }, { id: 'gate', kind: 'gate', position: { x: 0, y: 0 }, parameters: { width: 100, height: 200 } }]) });
    for (let n = 0; n < 10; n++) sim.step(actionFrame(['up'], ['action']));
    expect(sim.view().player.fenceSide).toBe('back'); expect(sim.view().player.id).toBe('arthur');
  });
  it('UT-012 rope transfer clears climb attachment and resumes ordinary gravity', () => {
    const level = terrainLevel([], [{ id: 'rope', kind: 'rope', position: { x: 40, y: 0 }, parameters: { width: 16, height: 200 } }, { id: 'door', kind: 'door', position: { x: 32, y: 0 }, parameters: { width: 32, height: 200, destination: 'dry', anchorX: 48, anchorY: 120, direction: 'up' } }]);
    level.subareas.push({ ...terrainLevel().subareas[0]!, id: 'dry', entities: [] });
    const sim = new TerrainSimulation({ level }); sim.step(actionFrame(['up'], ['up']));
    for (let n = 0; n < 12; n++) sim.step(actionFrame());
    expect(sim.view().subareaId).toBe('dry'); expect(sim.view().player.climbTarget).toBeNull();
    sim.step(actionFrame()); expect(sim.view().player.velocity.y).toBeGreaterThan(0);
  });
  it('UT-013 repeated pipe entries yield one actor and one transfer event', () => {
    const level = terrainLevel(undefined, [{ id: 'pipe', kind: 'pipe', position: { x: 32, y: 128 }, parameters: { width: 32, height: 32, destination: 'dry', anchorX: 48, anchorY: 160, direction: 'up' } }]);
    level.subareas.push({ ...terrainLevel([solid('dry-floor', 0, 160, 640)]).subareas[0]!, id: 'dry' });
    const sim = new TerrainSimulation({ level }); const events: DomainEvent[] = [];
    for (let n = 0; n < 15; n++) events.push(...sim.step(actionFrame(['up'], ['up'])));
    expect(events.filter(e => e.kind === 'transition')).toHaveLength(1); expect(sim.view().player.id).toBe('arthur');
  });
  it('UT-014 dangling pipe destination is rejected before boot', () => {
    const level = terrainLevel(undefined, [{ id: 'pipe', kind: 'pipe', position: { x: 32, y: 128 }, parameters: { destination: 'subarea_missing', anchorX: 48, anchorY: 160 } }]);
    const validation = validateTerrainLevel(level); expect(validation.ok).toBe(false);
    if (!validation.ok) expect(validation.issues.some(i => i.code === 'dangling_destination')).toBe(true);
  });
  it('UT-027 opposing crushers give one lethal event, never wall clipping', () => {
    const level = terrainLevel([solid('floor', 0, 160, 640)], [
      { ...platformEntity('crusher', { width: 16, height: 80, path: '0,0;20,0' }), id: 'left', position: { x: 20, y: 80 } },
      { ...platformEntity('crusher', { width: 16, height: 80, path: '0,0;-20,0' }), id: 'right', position: { x: 60, y: 80 } },
    ]);
    const sim = new TerrainSimulation({ level }); const events: DomainEvent[] = [];
    for (let n = 0; n < 120; n++) events.push(...sim.step(actionFrame()));
    expect(events.filter(e => e.kind === 'death' && e.cause === 'crush')).toHaveLength(1);
  });
  it('UT-049 seed17 fixed trace produces exactly repeated view and event results', () => {
    const replay = (): unknown => { const sim = new TerrainSimulation({ level: terrainLevel(), seed: 17 }); const views = []; for (let n = 0; n < 60; n++) views.push([sim.step(actionFrame(['right'])), sim.view()]); return views; };
    expect(replay()).toEqual(replay());
  });
  it('UT-050 nonfinite position and >64px budget are rejected with path/code', () => {
    expect(validateSimulationOptions({ level: terrainLevel(), position: { x: NaN, y: 100 } })).toContainEqual({ path: 'position', code: 'non_finite' });
    expect(validateSimulationOptions({ level: terrainLevel(), displacementBudget: 65 })).toContainEqual({ path: 'displacementBudget', code: 'displacement_budget' });
  });
  it('UT-056 lookahead clamps camera without mutating simulation position', () => {
    const position = { x: 630, y: 160 }; expect(cameraPosition(position, { x: 0, y: 0, width: 640, height: 216 }, 64)).toEqual({ x: 256, y: 0 }); expect(position).toEqual({ x: 630, y: 160 });
  });
  it('UT-057 malformed camera and missing area are rejected before scene creation', () => {
    const level = terrainLevel(); level.subareas[0]!.camera.width = -1; expect(validateTerrainLevel(level).ok).toBe(false); expect(validateCamera(undefined)[0]?.path).toBe('camera.subarea');
  });
  it('UT-062 top-only crossing: rising passes, downward crossing gets one support', () => {
    const tile = { ...solid('one', 0, 100, 200, 8), shape: 'oneWay' as const }; const solver = new CollisionSolver([tile]);
    expect(solver.move({ x: 40, y: 101, width: 16, height: 16 }, 0, -20, []).support).toBeNull();
    const landed = solver.move({ x: 40, y: 83, width: 16, height: 16 }, 0, 2, []); expect(landed.body.y + 16).toBe(100); expect(landed.support?.id).toBe('one');
  });
  it('base collision gate repeats 180 fixed ticks at 30/60/120FPS and bounded spikes', () => {
    const run = (fps: number): unknown => {
      const sim = new TerrainSimulation({ level: terrainLevel() }); const clock = new FixedClock(); const trace: unknown[] = [];
      for (let render = 0; render < fps * 3; render++) clock.advance(1000 / fps, () => { const tick = sim.view().tick; trace.push([sim.step(actionFrame(['right', 'action', ...(tick >= 30 && tick < 50 ? ['jump' as const] : [])], tick === 30 ? ['jump'] : [])), sim.view()]); });
      return trace;
    };
    expect(run(30)).toEqual(run(60)); expect(run(60)).toEqual(run(120));
    const clock = new FixedClock(); let ticks = 0; expect(clock.advance(250, () => ticks++)).toBe(5); expect(ticks).toBe(5); expect(clock.advance(STEP_MS, () => ticks++)).toBe(1);
  });
  it('review regressions block slope underside and high face, and clear obsolete support', () => {
    const slope = { ...solid('slope', 0, 128, 32, 32), shape: 'slope' as const, rise: 32 };
    const solver = new CollisionSolver([slope]);
    const underside = solver.move({ x: 8, y: 170, width: 16, height: 16 }, 0, -40, []); expect(underside.body.y).toBe(160); expect(underside.crushed).toBe(false);
    const face = solver.move({ x: 40, y: 136, width: 16, height: 16 }, -20, 0, []); expect(face.body.x).toBe(32); expect(face.blockedX).toBe(true); expect(face.crushed).toBe(false);
    expect(new CollisionSolver([solid('tiny', 0, 100, 16)]).move({ x: 0, y: 84, width: 16, height: 16 }, 64, 1, []).support).toBeNull();
  });
  it('review regressions sweep fast surfaces and reject embedded spawns and destinations', () => {
    const level = terrainLevel(undefined, [{ ...platformEntity('moving', { width: 8, height: 20, period: 60, path: '0,0;1800,0' }), position: { x: 0, y: 140 } }]);
    const sim = new TerrainSimulation({ level }); sim.step(actionFrame()); expect(sim.view().player.body.x).toBeGreaterThanOrEqual(68);
    const embedded = terrainLevel(); embedded.subareas[0]!.spawn.y = 168; expect(validateTerrainLevel(embedded).ok).toBe(false);
    const pipe = terrainLevel(undefined, [{ id: 'pipe', kind: 'pipe', position: { x: 32, y: 128 }, parameters: { destination: 'main', anchorX: 48, anchorY: 168 } }]); expect(validateTerrainLevel(pipe).ok).toBe(false);
  });
  it('buffered spin preserves its impulse and full-speed triangle enables wall running', () => {
    const spin = new TerrainSimulation({ level: terrainLevel(), position: { x: 48, y: 159 }, velocity: { x: 0, y: 60 } });
    spin.step(actionFrame(['spin'], ['spin'])); spin.step(actionFrame(['spin'])); expect(spin.view().player.velocity.y).toBe(-240); expect(spin.view().player.spinning).toBe(true);
    const sim = new TerrainSimulation({ level: terrainLevel([solid('floor', 0, 160, 640), { ...solid('triangle', 64, 80, 16, 80), shape: 'verticalRun' }]), position: { x: 54, y: 160 }, velocity: { x: 150, y: 0 } });
    sim.step(actionFrame(['right', 'action'])); expect(sim.view().player.verticalRun).toBe('triangle'); expect(sim.view().player.velocity.y).toBe(-150);
  });
  it('balance contact follows the higher foot and remains above the real tilted profile', () => {
    const level = terrainLevel([solid('floor', 0, 440, 640)], [platformEntity('balance', { tilt: 0.5 })]); level.subareas[0]!.spawn = { x: 104, y: 100 };
    const sim = new TerrainSimulation({ level });
    for (let tick = 0; tick < 120; tick++) { sim.step(actionFrame()); const s = sim.view(); const p = s.player.body; const surface = s.surfaces[0]!; expect(p.y + p.height).toBeLessThanOrEqual(Math.min(surfaceY(surface, p.x + 0.01), surfaceY(surface, p.x + p.width - 0.01)) + 0.01); expect(s.player.supportId).toBe('platform'); }
  });
  it('persistible UUID event identities replay deterministically and differ after safe restart', () => {
    const level = terrainLevel(); level.baselineTimer = 1;
    const sim = new TerrainSimulation({ level, attemptId: '11111111-1111-4111-8111-111111111111' });
    const death = (): DomainEvent => { const events: DomainEvent[] = []; for (let n = 0; n < 60; n++) events.push(...sim.step(actionFrame())); return events[0]!; };
    const first = death(); expect(first.eventId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/);
    sim.restart({ levelId: level.id, subareaId: 'main', checkpointId: null, anchor: { x: 48, y: 160 }, remainingTicks: 60, run: sim.view().run, hazardSeed: 17 }); expect(death().eventId).not.toBe(first.eventId);
  });
});
