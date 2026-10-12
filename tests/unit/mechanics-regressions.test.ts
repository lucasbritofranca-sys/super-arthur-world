import { describe, expect, it } from 'vitest';
import { TerrainSimulation } from '../../src/core/movement';
import { overlaps } from '../../src/core/geometry';
import { moveMounts } from '../../src/core/mechanics/mount';
import { controlFlight, FLIGHT } from '../../src/core/mechanics/flight';
import type { MechanicsWorld } from '../../src/core/mechanics/world';
import { mechanicEntity as entity, mechanicHarness, mechanicRun } from '../fixtures/mechanics';
import { terrainLevel, solid, platformEntity } from '../fixtures/terrain';
import { actionFrame } from '../fixtures/foundation';

const world = (sim: TerrainSimulation): MechanicsWorld => (sim as unknown as { mechanics: MechanicsWorld }).mechanics;
const transferTicks = (sim: TerrainSimulation): void => { for (let n = 0; n < 12; n++) sim.step(actionFrame()); };
describe('Task 03 interaction regressions', () => {
  it('a door forbidding carried items clears both descriptors before creating the destination runtime', () => {
    const carried = { id: 'spring1', kind: 'spring' as const, variant: 'green' };
    const level = terrainLevel(undefined, [entity('door', 'door', 32, 128, { width: 32, height: 32, destination: 'dry', anchorX: 48, anchorY: 160, direction: 'up', carry: false })]);
    level.subareas.push({ ...terrainLevel([solid('dry-floor', 0, 160, 640)]).subareas[0]!, id: 'dry' });
    const sim = new TerrainSimulation({ level, run: mechanicRun({ carried }) });
    expect(sim.view().mechanics!.objects.filter(o => o.mode === 'carried')).toHaveLength(1);
    sim.step(actionFrame(['up'], ['up'])); transferTicks(sim);
    expect(sim.view().subareaId).toBe('dry'); expect(sim.view().player.carried).toBeNull(); expect(sim.view().run.carried).toBeNull();
    expect(sim.view().mechanics!.objects.some(o => o.mode === 'carried' || o.owner === 'arthur')).toBe(false);
  });
  it('revisiting an area preserves used powers and blocks, whereas restart creates a fresh attempt', () => {
    const level = terrainLevel(undefined, [entity('mushroom', 'power:large'), entity('block1', 'block:reward', 40, 100), entity('door', 'door', 32, 128, { width: 32, height: 32, destination: 'dry', anchorX: 48, anchorY: 160, direction: 'up' })]);
    level.subareas.push({ ...terrainLevel([solid('dry-floor', 0, 160, 640)], [entity('return-door', 'door', 32, 128, { width: 32, height: 32, destination: 'main', anchorX: 48, anchorY: 160, direction: 'up' })]).subareas[0]!, id: 'dry' });
    const sim = new TerrainSimulation({ level }); const start = sim.snapshot(); sim.step(actionFrame());
    expect(sim.view().run.form).toBe('large'); expect(sim.view().pickups!.some(p => p.id === 'mushroom')).toBe(false);
    const rewards = []; for (let n = 0; n < 10; n++) rewards.push(...sim.step(actionFrame(['jump'], n === 0 ? ['jump'] : [])));
    expect(rewards.filter(e => e.kind === 'reward' && e.entityId === 'block1')).toHaveLength(1);
    for (let n = 0; n < 60; n++) sim.step(actionFrame());
    sim.step(actionFrame(['up'], ['up'])); transferTicks(sim); expect(sim.view().subareaId).toBe('dry');
    sim.step(actionFrame(['up'], ['up'])); transferTicks(sim); expect(sim.view().subareaId).toBe('main');
    expect(sim.view().pickups!.some(p => p.id === 'mushroom')).toBe(false); expect(sim.view().mechanics!.blocks[0]!.consumed).toBe(true);
    sim.restart(start); expect(sim.view().pickups!.some(p => p.id === 'mushroom')).toBe(true); expect(sim.view().mechanics!.blocks[0]!.consumed).toBe(false);
    sim.step(actionFrame()); expect(sim.view().run.form).toBe('large');
  });
  it('a fleeing mount remembers its wall reversal on the following tick', () => {
    const wall = solid('wall', 64, 0, 16, 160); const h = mechanicHarness([entity('mount1', 'mount', 48, 144)], mechanicRun(), [solid('floor', 0, 160, 640), wall]);
    const mount = h.world.state.mounts[0]!; mount.descriptor.state = 'fleeing'; mount.fleeDirection = 1;
    moveMounts(h.context, h.world.state.mounts, h.world.state.objects); const atWall = mount.body.x;
    expect(mount.fleeDirection).toBe(-1); expect(mount.velocity.x).toBe(-90); expect(overlaps(mount.body, wall)).toBe(false);
    moveMounts(h.context, h.world.state.mounts, h.world.state.objects); expect(mount.body.x).toBeLessThan(atWall); expect(mount.fleeDirection).toBe(-1);
  });
  it('opposite-side fence enemies do not harm Arthur through the fence', () => {
    const h = mechanicHarness([entity('enemy1', 'enemy:armored', 40, 144, { side: 'back' })]); h.player.mode = 'fence'; h.player.fenceSide = 'front';
    expect(h.world.finish(h.context, { y: 144, bottom: 160, vy: 0 }).lethal).toBe(false);
    expect(h.run.form).toBe('small'); expect(h.world.state.enemies[0]!.alive).toBe(true); expect(h.world.state.protectionTicks).toBe(0);
  });
  it('an armored enemy immune to the tongue still causes mounted Arthur to flee on body contact', () => {
    const mount = { id: 'mount1', color: 'green' as const, state: 'ridden' as const, berries: 0, swallowed: null };
    const h = mechanicHarness([entity('mount1', 'mount'), entity('enemy1', 'enemy:armored')], mechanicRun({ form: 'large', mount })); h.world.state.mounts[0]!.tongueTicks = 6;
    expect(h.world.finish(h.context, { y: 144, bottom: 160, vy: 0 }).lethal).toBe(false);
    expect(h.world.state.enemies[0]!.alive).toBe(true); expect(h.world.state.mounts[0]!.descriptor.state).toBe('fleeing'); expect(h.run.mount).toBeNull(); expect(h.run.form).toBe('large');
    const unmounted = mechanicHarness([entity('enemy1', 'enemy:armored')], mechanicRun({ form: 'large' }));
    unmounted.world.finish(unmounted.context, { y: 144, bottom: 160, vy: 0 }); expect(unmounted.run.form).toBe('small');
  });
  it('releasing a dive enters bounded recovery for 12 ticks before ordinary glide', () => {
    const h = mechanicHarness([], mechanicRun({ form: 'gliding' })); h.world.state.flight = 'dive'; h.player.velocity.y = FLIGHT.dive;
    controlFlight(h.context, h.world.state, false, false); expect(h.world.state.flight).toBe('recovery'); expect(h.world.state.climbTicks).toBe(12);
    for (let n = 0; n < 12; n++) { controlFlight(h.context, h.world.state, false, false); expect(h.world.state.flight).toBe('recovery'); expect(h.player.velocity.y).toBeLessThanOrEqual(FLIGHT.glide); }
    expect(h.world.state.climbTicks).toBe(0); controlFlight(h.context, h.world.state, false, false); expect(h.world.state.flight).toBe('glide');
  });
  it('enemy and thrown-object collision uses the current moving-platform phase', () => {
    for (const actor of ['enemy', 'object'] as const) {
      const level = terrainLevel(undefined, [{ ...platformEntity('moving', { width: 16, height: 16, period: 60, path: '0,0;-60,0' }), position: { x: 80, y: 144 } }, entity('actor1', actor === 'enemy' ? 'enemy:patrol' : 'object:block', 62, 144, { speed: 30 })]);
      const sim = new TerrainSimulation({ level });
      if (actor === 'object') { const object = world(sim).state.objects[0]!; object.mode = 'thrown'; object.velocity.x = 30; }
      sim.step(actionFrame()); const view = sim.view(); const surface = view.surfaces[0]!;
      expect(surface.x).toBe(78); const body = actor === 'enemy' ? view.mechanics!.enemies[0]!.body : view.mechanics!.objects[0]!.body;
      expect(overlaps(body, surface)).toBe(false); expect(body.x + body.width).toBeLessThanOrEqual(surface.x);
      if (actor === 'object') expect(view.mechanics!.objects[0]!.mode).not.toBe('consumed');
    }
  });
});
