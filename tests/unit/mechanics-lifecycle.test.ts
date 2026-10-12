import { describe, expect, it } from 'vitest';
import { TerrainSimulation } from '../../src/core/movement';
import { capabilities } from '../../src/core/mechanics/mount';
import { mechanicEntity as entity, mechanicRun } from '../fixtures/mechanics';
import { terrainLevel, solid } from '../fixtures/terrain';
import { actionFrame } from '../fixtures/foundation';
import { overlaps } from '../../src/core/geometry';

describe('complete mount and temporary-power lifecycles', () => {
  it('constructor, restart and permitted transfer publish carried objects at the actual safe anchor before input', () => {
    const carried = { id: 'spring', kind: 'spring' as const, variant: 'green' };
    const floor = solid('floor', 0, 160, 640);
    const level = terrainLevel([floor], [entity('door', 'door', 384, 128, { width: 32, height: 32, destination: 'dry', anchorX: 500, anchorY: 160, direction: 'up', carry: true })]);
    level.subareas.push({ ...terrainLevel([{ ...floor, id: 'dry-floor' }]).subareas[0]!, id: 'dry' });
    const sim = new TerrainSimulation({ level, position: { x: 400, y: 160 }, run: mechanicRun({ carried }) });
    const attached = (): void => {
      const state = sim.view(); const objects = state.mechanics!.objects.filter(o => o.descriptor.id === carried.id);
      expect(objects).toHaveLength(1); expect(objects[0]!.owner).toBe('arthur'); expect(objects[0]!.mode).toBe('carried');
      expect(Math.abs(objects[0]!.body.x - state.player.body.x)).toBeLessThanOrEqual(12); expect(overlaps(objects[0]!.body, floor)).toBe(false);
    };
    attached(); const start = sim.snapshot(); sim.restart({ ...start, anchor: { x: 500, y: 160 } }); attached();
    sim.restart(start); sim.step(actionFrame(['up'], ['up'])); for (let n = 0; n < 12; n++) sim.step(actionFrame());
    expect(sim.view().subareaId).toBe('dry'); expect(sim.view().player.position.x).toBe(500); attached();
  });
  it('restored mouth ownership follows the actual mounted anchor before input and restart', () => {
    const floor = solid('floor', 0, 160, 640);
    const run = mechanicRun({ mount: { id: 'mount', color: 'blue', state: 'swallowing', berries: 0, swallowed: { id: 'shell', kind: 'shell', variant: 'blue' } }, effects: { invincibility: 0, float: 0, mountShell: 1200 } });
    const sim = new TerrainSimulation({ level: terrainLevel([floor]), position: { x: 400, y: 160 }, run });
    for (const x of [400, 500]) {
      if (x === 500) sim.restart({ ...sim.snapshot(), anchor: { x, y: 160 } });
      const state = sim.view(); const owned = state.mechanics!.objects.filter(o => o.owner === 'mount'); expect(owned).toHaveLength(1);
      expect(owned[0]!.mode).toBe('mouth'); expect(owned[0]!.body.x).toBe(state.mechanics!.mounts[0]!.body.x); expect(overlaps(owned[0]!.body, floor)).toBe(false);
    }
  });
  it('a restored ridden mount starts at the actual safe player anchor and follows the solved position', () => {
    const floor = solid('floor', 0, 160, 640); const sim = new TerrainSimulation({ level: terrainLevel([floor]), position: { x: 400, y: 160 }, run: mechanicRun({ mount: { id: 'mount', color: 'green', state: 'ridden', berries: 0, swallowed: null } }) });
    for (let n = 0; n < 30; n++) {
      const state = sim.view(); const body = state.mechanics!.mounts[0]!.body;
      expect(body.x).toBe(state.player.body.x); expect(body.y + body.height).toBe(state.player.position.y); expect(body.y + body.height).toBeLessThanOrEqual(floor.y);
      sim.step(actionFrame(['right']));
    }
  });
  it('five distinct berries grow one baby, which can then be ridden', () => {
    const sim = new TerrainSimulation({ level: terrainLevel(undefined, [entity('mount', 'mount', 40, 144, { baby: true }), ...Array.from({ length: 5 }, (_, n) => entity(`berry${n}`, 'berry'))]) });
    sim.step(actionFrame()); expect(sim.view().mechanics!.mounts).toHaveLength(1); expect(sim.view().mechanics!.mounts[0]!.descriptor).toMatchObject({ state: 'following', berries: 5 });
    expect(sim.view().pickups!.filter(p => p.id.startsWith('berry'))).toHaveLength(0);
    sim.step(actionFrame(['jump'], ['jump'])); expect(sim.view().run.mount?.id).toBe('mount');
  });
  it('wings enter the actual bonus subarea, preserve one mount and turn it blue', () => {
    const level = terrainLevel(undefined, [entity('wings', 'wings', 40, 144, { destination: 'bonus' })]);
    level.subareas.push({ ...terrainLevel([solid('bonus-floor', 0, 160, 640)]).subareas[0]!, id: 'bonus' });
    const sim = new TerrainSimulation({ level, run: mechanicRun({ mount: { id: 'mount', color: 'green', state: 'ridden', berries: 0, swallowed: null } }) });
    const events = [...sim.step(actionFrame())]; for (let n = 0; n < 12; n++) events.push(...sim.step(actionFrame()));
    expect(events.filter(e => e.kind === 'mountBonus')).toHaveLength(1); expect(events.filter(e => e.kind === 'transition')).toHaveLength(1);
    expect(sim.view().subareaId).toBe('bonus'); expect(sim.view().run.mount?.color).toBe('blue'); expect(sim.view().mechanics!.mounts).toHaveLength(1);
  });
  it('float steers temporarily, freezes on pause and returns to gravity at expiry', () => {
    const sim = new TerrainSimulation({ level: terrainLevel(undefined, [entity('float', 'power:float', 40, 144, { duration: 3 })]) });
    sim.step(actionFrame()); sim.step(actionFrame(['up'])); expect(sim.view().player.mode).toBe('float'); expect(sim.view().player.velocity.y).toBe(-55);
    const before = sim.view(); sim.step(actionFrame([], ['pause'])); expect(sim.view()).toEqual(before);
    sim.step(actionFrame()); sim.step(actionFrame()); expect(sim.view().run.effects.float).toBe(0); expect(sim.view().player.mode).toBe('air'); expect(sim.view().player.velocity.y).toBeGreaterThan(0);
  });
  it('combined mount and shell colors add capabilities until spit removes every shell-dependent ability', () => {
    const run = mechanicRun({ mount: { id: 'mount', color: 'yellow', state: 'swallowing', berries: 0, swallowed: { id: 'shell', kind: 'shell', variant: 'blue' } }, effects: { invincibility: 0, float: 0, mountShell: 1200 } });
    const sim = new TerrainSimulation({ level: terrainLevel(), run });
    expect(capabilities(sim.view().mechanics!.mounts[0])).toEqual({ fire: false, flight: true, stomp: true });
    sim.step(actionFrame(['action'], ['action'])); expect(sim.view().run.mount?.swallowed).toBeNull(); expect(sim.view().run.effects.mountShell).toBe(0);
    expect(capabilities(sim.view().mechanics!.mounts[0])).toEqual({ fire: false, flight: false, stomp: false });
  });
});
