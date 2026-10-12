import { describe, expect, it } from 'vitest';
import { TerrainSimulation, validateSimulationOptions } from '../../src/core/movement';
import { overlaps } from '../../src/core/geometry';
import type { MechanicsWorld } from '../../src/core/mechanics/world';
import { mechanicEntity as entity, mechanicRun, mechanicHarness } from '../fixtures/mechanics';
import { terrainLevel, solid } from '../fixtures/terrain';
import { actionFrame } from '../fixtures/foundation';

describe('review round 001 collision and recovery regressions', () => {
  for (const source of ['form', 'mount', 'both'] as const) it(`harm immediately rechecks flight capability from ${source}`, () => {
    const mounted = source !== 'form';
    const run = mechanicRun({ form: source === 'mount' ? 'small' : 'gliding', mount: mounted ? { id: 'mount', color: 'green', state: 'swallowing', berries: 0, swallowed: { id: 'shell', kind: 'shell', variant: 'blue' } } : null, effects: { invincibility: 0, float: 0, mountShell: mounted ? 1200 : 0 } });
    const h = mechanicHarness([entity('enemy', 'enemy:armored')], run); h.player.mode = 'flight'; h.world.state.flight = 'glide';
    h.world.finish(h.context, { y: 144, bottom: 160, vy: 0 });
    if (source === 'both') { expect(h.run.mount).toBeNull(); expect(h.run.form).toBe('gliding'); expect(h.world.state.flight).toBe('glide'); expect(h.player.mode).toBe('flight'); }
    else { expect(h.world.state.flight).toBe('none'); expect(h.player.mode).toBe('air'); expect(h.world.state.chargeTicks).toBe(0); }
  });
  for (const release of ['manual', 'damage'] as const) it(`reserve ${release} release respects a low ceiling throughout its falling trace`, () => {
    const ceiling = solid('ceiling', 0, 100, 96, 28);
    const sim = new TerrainSimulation({ level: terrainLevel([solid('floor', 0, 160, 640), ceiling], release === 'damage' ? [entity('enemy', 'enemy:armored', 40, 144, { speed: 0 })] : []), run: mechanicRun({ form: release === 'damage' ? 'large' : 'small', reserve: 'large' }) });
    sim.step(release === 'manual' ? actionFrame(['reserve'], ['reserve']) : actionFrame());
    expect(sim.view().run.reserve).toBeNull(); expect(sim.view().pickups!.filter(p => p.id.startsWith('reserve:'))).toHaveLength(1);
    for (let n = 0; n < 30; n++) {
      for (const p of sim.view().pickups!) expect(overlaps(p.body, ceiling)).toBe(false);
      expect(overlaps(sim.view().player.body, ceiling)).toBe(false); sim.step(actionFrame());
    }
  });
  it('a fleeing mount behind a floor cannot teleport upward, while physically nearby recovery works', () => {
    for (const y of [350, 144]) {
      const sim = new TerrainSimulation({ level: terrainLevel(undefined, [entity('mount', 'mount', 48, y)]) });
      const runtime = (sim as unknown as { mechanics: MechanicsWorld }).mechanics; runtime.state.mounts[0]!.descriptor.state = 'fleeing';
      sim.step(actionFrame(['jump'], ['jump']));
      if (y === 350) { expect(sim.view().run.mount).toBeNull(); expect(sim.view().mechanics!.mounts[0]!.body.y).toBeGreaterThanOrEqual(350); }
      else expect(sim.view().run.mount?.id).toBe('mount');
    }
  });
  it('throwable phases reject key/default-key refill but accept a block refill contract', () => {
    for (const controller of [5, 9, 10]) for (const objectKind of ['key', undefined, 'block']) {
      const level = terrainLevel(undefined, [entity('boss', 'boss', 140, 128, { controller, replenisher: 'ammo' }), entity('ammo', 'dispenser', 40, 144, { objectId: 'ammo1', ...(objectKind ? { objectKind } : {}) })]);
      const errors = validateSimulationOptions({ level });
      if (objectKind === 'block') { expect(errors).toEqual([]); const sim = new TerrainSimulation({ level }); sim.step(actionFrame()); expect(sim.view().mechanics!.objects[0]!.descriptor.kind).toBe('block'); }
      else { expect(errors.some(e => e.code === 'incompatible_ammunition')).toBe(true); expect(() => new TerrainSimulation({ level })).toThrow('incompatible_ammunition'); }
    }
  });
});
