import { describe, expect, it } from 'vitest';
import { TerrainSimulation } from '../../src/core/movement';
import { CollisionSolver } from '../../src/core/collision';
import { overlaps } from '../../src/core/geometry';
import { controlFlight, FLIGHT } from '../../src/core/mechanics/flight';
import { hitBlock, activateBlock, blockTerrain } from '../../src/core/mechanics/blocks';
import { controlObject } from '../../src/core/mechanics/objects';
import type { MechanicsWorld } from '../../src/core/mechanics/world';
import { mechanicEntity as entity, mechanicHarness, mechanicRun } from '../fixtures/mechanics';
import { actionFrame } from '../fixtures/foundation';
import { solid, terrainLevel, platformEntity } from '../fixtures/terrain';
import type { DomainEvent } from '../../src/core/events';

const previous = { y: 144, bottom: 160, vy: 0 };
// Arrange concrete runtime actors for single-tick edge cases; all stepping, collision,
// interaction, and domain-event production remain the production implementation.
const runtimeWorld = (sim: TerrainSimulation): MechanicsWorld => (sim as unknown as { mechanics: MechanicsWorld }).mechanics;
describe('Task 03 canonical mechanic edge cases', () => {
  it('UT-015 three contacts in one protection window shrink Classic Arthur once without a life event', () => {
    const h = mechanicHarness([entity('enemy1', 'enemy:armored')], mechanicRun({ form: 'large' }));
    for (let hit = 0; hit < 3; hit++) expect(h.world.finish(h.context, previous).lethal).toBe(false);
    expect(h.run.form).toBe('small'); expect(h.world.state.protectionTicks).toBe(60);
    expect(h.events.filter(e => e.kind === 'death')).toHaveLength(0);
  });
  it('UT-016 projectile pickup precedes harm and releases precisely one reserve mushroom', () => {
    const h = mechanicHarness([entity('power1', 'power:projectile'), entity('enemy1', 'enemy:armored')], mechanicRun({ form: 'large' }));
    expect(h.world.finish(h.context, previous).lethal).toBe(false);
    expect(h.run.form).toBe('small'); expect(h.run.reserve).toBeNull();
    expect(h.world.fallingPowers).toHaveLength(1); expect(h.world.fallingPowers[0]!.form).toBe('large');
    h.world.finish(h.context, previous); expect(h.world.fallingPowers).toHaveLength(1);
  });
  it('UT-017 timed invincibility freezes during pause/transfer and an unpowered checkpoint restores no effect', () => {
    const level = terrainLevel(undefined, [entity('star', 'power:invincibility', 64, 144, { duration: 600 }), entity('door', 'door', 40, 128, { width: 32, height: 32, destination: 'dry', direction: 'up', anchorX: 48, anchorY: 160 })]);
    level.subareas.push({ ...terrainLevel([solid('dry-floor', 0, 160, 640)]).subareas[0]!, id: 'dry' });
    level.checkpoints.push({ id: 'unpowered-checkpoint', subareaId: 'main', anchor: { x: 48, y: 160 }, modes: ['classic'] });
    const sim = new TerrainSimulation({ level }); const checkpointEvent = sim.step(actionFrame()).find(e => e.kind === 'checkpoint');
    expect(checkpointEvent?.kind).toBe('checkpoint'); if (checkpointEvent?.kind !== 'checkpoint') throw new Error('Missing real checkpoint event');
    const checkpoint = checkpointEvent.snapshot; expect(checkpoint.run.effects.invincibility).toBe(0);
    for (let n = 0; n < 30 && sim.view().run.effects.invincibility === 0; n++) sim.step(actionFrame(['right']));
    expect(sim.view().run.effects.invincibility).toBe(600);
    for (let n = 0; n < 30; n++) sim.step(n === 29 ? actionFrame(['up'], ['up']) : actionFrame());
    expect(sim.view().run.effects.invincibility).toBe(570);
    const pausedTick = sim.view().tick;
    for (let n = 0; n < 500; n++) sim.step(actionFrame([], ['pause']));
    expect(sim.view().tick).toBe(pausedTick); expect(sim.view().run.effects.invincibility).toBe(570);
    for (let n = 0; n < 12; n++) sim.step(actionFrame());
    expect(sim.view().subareaId).toBe('dry'); expect(sim.view().run.effects.invincibility).toBe(570);
    sim.restart({ ...sim.snapshot(), remainingTicks: 1 }); expect(sim.step(actionFrame()).filter(e => e.kind === 'death')).toHaveLength(1);
    sim.restart(checkpoint); expect(sim.view().run.effects.invincibility).toBe(0);
  });
  it('UT-018 invincibility cannot suppress pit death and terminal state emits it once', () => {
    const level = terrainLevel([]); const sim = new TerrainSimulation({ level, position: { x: 48, y: 479 }, velocity: { x: 0, y: 360 }, run: mechanicRun({ effects: { invincibility: 600, float: 0, mountShell: 0 } }) });
    const events: DomainEvent[] = []; for (let n = 0; n < 10; n++) events.push(...sim.step(actionFrame()));
    expect(events.filter(e => e.kind === 'death' && e.cause === 'pit')).toHaveLength(1); expect(sim.view().player.mode).toBe('dying');
  });
  it('UT-019 insufficient run-up never enables flight and losing the gliding form cancels powered flight', () => {
    const h = mechanicHarness([], mechanicRun({ form: 'gliding' })); h.player.grounded = true; h.player.velocity.x = FLIGHT.threshold - 1;
    h.context.input = actionFrame(['action', 'jump'], ['jump']); h.world.state.chargeTicks = FLIGHT.charge;
    controlFlight(h.context, h.world.state, true, false); expect(h.world.state.flight).toBe('none');
    h.player.grounded = false; h.world.state.flight = 'glide'; h.run.form = 'small';
    controlFlight(h.context, h.world.state, false, false); expect(h.world.state.flight).toBe('none'); expect(h.world.state.chargeTicks).toBe(0);
  });
  it('UT-020 maximum authored dive sweeps a 16px wall beside a moving platform within world bounds', () => {
    const wall = solid('wall', 64, 0, 16, 320); const level = terrainLevel([solid('floor', 0, 400, 640), wall], [{ ...platformEntity('moving'), position: { x: 96, y: 240 } }]);
    const sim = new TerrainSimulation({ level, position: { x: 48, y: 120 }, velocity: { x: 150, y: 0 }, run: mechanicRun({ form: 'gliding' }) });
    runtimeWorld(sim).state.flight = 'glide';
    sim.step(actionFrame(['right', 'action', 'down'])); expect(sim.view().player.velocity.y).toBe(FLIGHT.dive); expect(sim.view().mechanics!.flight).toBe('dive');
    const direct = new CollisionSolver([wall]).move({ x: 40, y: 80, width: 16, height: 32 }, 64, FLIGHT.dive / 60, sim.view().surfaces);
    expect(direct.blockedX).toBe(true); expect(direct.body.x + direct.body.width).toBe(64); expect(overlaps(direct.body, wall)).toBe(false);
    for (let n = 0; n < 45; n++) { sim.step(actionFrame(['right', 'action', 'down'])); const body = sim.view().player.body; expect(overlaps(body, wall)).toBe(false); expect(body.x).toBeGreaterThanOrEqual(0); expect(body.x + body.width).toBeLessThanOrEqual(640); }
  });
  it('UT-021 duplicate mounted damage leaves one fleeing mount with one swallowed shell and no Arthur harm', () => {
    const swallowed = { id: 'shell1', kind: 'shell' as const, variant: 'blue' };
    const h = mechanicHarness([entity('mount1', 'mount'), entity('shell1', 'object:shell'), entity('enemy1', 'enemy:armored')], mechanicRun({ form: 'large', mount: { id: 'mount1', color: 'green', state: 'swallowing', berries: 0, swallowed }, effects: { invincibility: 0, float: 0, mountShell: 1200 } }));
    for (let hit = 0; hit < 2; hit++) expect(h.world.finish(h.context, previous).lethal).toBe(false);
    expect(h.run.form).toBe('large'); expect(h.run.mount).toBeNull();
    expect(h.world.state.mounts).toHaveLength(1); expect(h.world.state.mounts[0]!.descriptor.state).toBe('fleeing'); expect(h.world.state.mounts[0]!.descriptor.swallowed).toEqual(swallowed);
    expect(h.world.state.objects.filter(o => o.descriptor.id === 'shell1')).toHaveLength(1); expect(h.world.state.objects[0]!.owner).toBe('mount1'); expect(h.world.state.objects[0]!.mode).toBe('mouth');
    expect(h.events.filter(e => e.kind === 'death')).toHaveLength(0);
  });
  it('UT-022 equally distant key and shell use stable identity and never gain duplicate owners', () => {
    const h = mechanicHarness([entity('shell1', 'object:shell', 64), entity('key1', 'object:key', 16)]);
    h.context.input = actionFrame(['action'], ['action']); controlObject(h.context, h.world.state.objects);
    expect(h.run.carried?.id).toBe('key1');
    // Duplicate input edges are filtered by the actual simulation input boundary.
    const sim = new TerrainSimulation({ level: terrainLevel(undefined, [entity('shell1', 'object:shell', 64), entity('key1', 'object:key', 16)]) });
    for (let n = 0; n < 3; n++) sim.step(actionFrame(['action'], ['action']));
    expect(sim.view().run.carried?.id).toBe('key1'); const objects = sim.view().mechanics!.objects;
    expect(objects.filter(o => o.mode === 'carried')).toHaveLength(1); expect(objects.find(o => o.descriptor.id === 'shell1')!.owner).toBeNull(); expect(objects.find(o => o.descriptor.id === 'shell1')!.mode).toBe('world');
  });
  it('UT-023 two head contacts consume a reward block and emit one reward', () => {
    const h = mechanicHarness([entity('block1', 'block:reward')]); const block = h.world.state.blocks[0]!;
    hitBlock(h.context, block, 'head'); hitBlock(h.context, block, 'head');
    expect(block.consumed).toBe(true); expect(h.events.filter(e => e.kind === 'reward' && e.entityId === 'block1')).toHaveLength(1);
  });
  it('UT-024 temporary block activation safely depenetrates before it becomes solid', () => {
    const h = mechanicHarness([entity('block1', 'block:reward')]); const block = h.world.state.blocks[0]!; block.solid = false;
    expect(overlaps(h.player.body, block.body)).toBe(true); expect(activateBlock(h.context, block)).toBe(true);
    expect(block.solid).toBe(true); expect(overlaps(h.player.body, block.body)).toBe(false);
    expect(new CollisionSolver(blockTerrain(h.world.state.blocks)).move(h.player.body, 0, 0, []).crushed).toBe(false);
  });
  it('UT-028 simultaneous shell and projectile defeat one enemy and reward it once', () => {
    const h = mechanicHarness([entity('enemy1', 'enemy:patrol'), entity('shell1', 'object:shell')]); const shell = h.world.state.objects[0]!; shell.mode = 'kicked'; shell.velocity.x = 300;
    h.world.state.projectiles.push({ id: 'shot1', body: { x: 40, y: 144, width: 6, height: 6 }, velocity: { x: 240, y: 0 }, source: 'arthur', remainingTicks: 120 });
    expect(h.world.finish(h.context, previous).lethal).toBe(false); expect(h.world.state.enemies[0]!.alive).toBe(false);
    expect(h.events.filter(e => e.kind === 'reward' && e.entityId === 'enemy1')).toHaveLength(1);
  });
  it('UT-029 terminal Arthur contact suppresses simultaneous boss victory, exit and rewards; restart recreates encounter', () => {
    const level = terrainLevel(undefined, [entity('boss1', 'boss', 40, 144, { controller: 3, exitId: 'boss-exit' }), entity('enemy1', 'enemy:projectile', 40, 144, { speed: 0 })]);
    level.exits.push({ id: 'boss-exit', subareaId: 'main', destination: 'map', kind: 'boss' });
    const sim = new TerrainSimulation({ level, velocity: { x: 0, y: 60 } }); const checkpoint = sim.snapshot();
    runtimeWorld(sim).state.bosses[0]!.hits = 2;
    const terminal = sim.step(actionFrame());
    expect(runtimeWorld(sim).state.bosses[0]!.alive).toBe(false); // Final boss attack really resolved on this tick.
    expect(terminal.filter(e => e.kind === 'death')).toHaveLength(1); expect(terminal.some(e => ['bossVictory', 'exit', 'reward'].includes(e.kind))).toBe(false);
    expect(sim.step(actionFrame())).toHaveLength(0); sim.restart(checkpoint); expect(sim.view().mechanics!.bosses[0]!.alive).toBe(true); expect(sim.view().mechanics!.bosses[0]!.hits).toBe(0);
  });
});
