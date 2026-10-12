import { TerrainSimulation } from '../../src/core/movement';
import { CollisionSolver } from '../../src/core/collision';
import { strikeEnemy } from '../../src/core/mechanics/enemies';
import { ATTACKS, ENEMY_FAMILIES } from '../../src/core/mechanics/vulnerability';
import { bossMethod } from '../../src/core/mechanics/bosses';
import type { Context, EnemyActor } from '../../src/core/mechanics/model';
import type { Action, EntityDefinition, RunState } from '../../src/core/types';
import type { DomainEvent } from '../../src/core/events';
import { terrainLevel, solid, platformEntity } from './terrain';

const entity = (id: string, kind: string, x: number, y: number, parameters: EntityDefinition['parameters'] = {}): EntityDefinition => ({ id, kind, position: { x, y }, parameters });
const run = (form: RunState['form'] = 'small'): RunState => ({ coins: 0, bonusStars: 0, score: 0, form, reserve: null, carried: null, mount: null, effects: { invincibility: 0, float: 0, mountShell: 0 } });
function step(s: TerrainSimulation, held: Action[] = [], pressed: Action[] = []): readonly DomainEvent[] { return s.step({ held: new Set(held), pressed: new Set(pressed), released: new Set() }); }
function ticks(s: TerrainSimulation, count: number, held: Action[] = []): DomainEvent[] { const e: DomainEvent[] = []; for (let i = 0; i < count; i++) e.push(...step(s, held)); return e; }
function check(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function context(s: TerrainSimulation, events: DomainEvent[], held: Action[] = [], pressed: Action[] = []): Context {
  const v = s.view(); const solver = new CollisionSolver(s.options.level.subareas[0]!.terrain);
  return { player: v.player, run: v.run, tick: v.tick, difficulty: 'classic', input: { held: new Set(held), pressed: new Set(pressed), released: new Set() }, surfaces: v.surfaces, terrain: solver.terrain, move: (body, dx, dy) => solver.move(body, dx, dy, v.surfaces), clear: body => !solver.move(body, 0, 0, v.surfaces).crushed, event: () => crypto.randomUUID(), emit: e => events.push(e) };
}

export function journey(id: string): unknown {
  if (id === 'IT-009') {
    const level = terrainLevel([{ id: 'slope', x: 0, y: 64, width: 128, height: 128, rise: 128, shape: 'slope', direction: -1 }, solid('floor', 128, 192, 512)], [entity('enemy', 'enemy:patrol', 145, 176, { speed: 0 })]);
    level.subareas[0]!.spawn = { x: 24, y: 80 };
    const s = new TerrainSimulation({ level, velocity: { x: 90, y: 0 } }); const events: DomainEvent[] = []; const supports: string[] = [];
    for (let i = 0; i < 100; i++) { const facts = step(s, ['right', 'action', ...(i > 10 ? ['down' as const] : [])]); events.push(...facts); if (facts.some(e => e.kind === 'reward' && e.entityId === 'enemy')) check(s.view().player.crouching && Math.abs(s.view().player.velocity.x) > 30, 'defeat must be crouch slide'); if (s.view().player.supportId) supports.push(s.view().player.supportId!); }
    check(supports.includes('slope'), 'slide must contact authored 1:1 slope'); check(events.filter(e => e.kind === 'reward' && e.entityId === 'enemy').length === 1, 'slide must defeat enemy once'); return { supports, events };
  }
  if (id === 'IT-010') {
    const r = run(); r.carried = { id: 'spring1', kind: 'spring', variant: 'green' };
    const s = new TerrainSimulation({ level: terrainLevel(undefined, [entity('water', 'water', 65, 70, { width: 140, height: 90 })]), run: r }); const modes: string[] = [];
    for (let i = 0; i < 180; i++) { step(s, ['right', ...(i > 25 && i < 110 ? ['up' as const] : [])]); const v = s.view(); modes.push(v.player.mode); check(v.run.carried?.id === 'spring1' && v.mechanics!.objects.filter(o => o.descriptor.id === 'spring1' && o.owner === 'arthur').length === 1, 'spring ownership changed in water'); }
    check(modes.includes('swim') && modes.slice(modes.indexOf('swim')).some(m => m !== 'swim'), 'must enter and leave swimming'); return modes;
  }
  if (id === 'IT-012') {
    const s = new TerrainSimulation({ level: terrainLevel(undefined, [entity('fence', 'fence', 24, 40, { width: 80, height: 120 }), entity('gate', 'gate', 24, 40, { width: 80, height: 120 }), entity('back-enemy', 'enemy:aerial', 62, 135, { side: 'back', speed: 0 }), entity('front-enemy', 'enemy:aerial', 62, 135, { side: 'front', speed: 0 })]) });
    ticks(s, 5, ['up']); const before = s.view(); const events = [...step(s, ['up', 'action'], ['action'])]; const after = s.view();
    check(before.player.mode === 'fence' && after.player.fenceSide === 'back', 'fence gate must turn'); check(!after.mechanics!.enemies.find(e => e.id === 'back-enemy')!.alive && after.mechanics!.enemies.find(e => e.id === 'front-enemy')!.alive, 'punch must target opposite side only');
    step(s, ['jump'], ['jump']); ticks(s, 10); check(s.view().player.mode !== 'fence' && s.view().player.velocity.y > 0, 'released fence must restore gravity'); return events;
  }
  if (id === 'IT-014') {
    const s = new TerrainSimulation({ level: terrainLevel(undefined, [entity('projectile', 'power:projectile', 40, 135), entity('mushroom', 'power:large', 90, 135), entity('enemy', 'enemy:patrol', 135, 144, { speed: 0 })]) });
    step(s); check(s.view().run.form === 'projectile', 'projectile acquisition'); for (let i = 0; i < 100 && s.view().run.form !== 'small'; i++) step(s, ['right']); const v = s.view();
    check(v.run.form === 'small' && v.run.reserve === null && v.pickups!.filter(p => p.form === 'large').length === 1, 'damage must drop one reserve mushroom'); return v;
  }
  if (id === 'IT-015') {
    const s = new TerrainSimulation({ level: terrainLevel(undefined, [entity('power', 'power:invincibility', 40, 144, { duration: 20 }), entity('enemy', 'enemy:patrol', 62, 144, { speed: 0 }), entity('later', 'enemy:patrol', 140, 144, { speed: 0 })]), run: run('large') });
    step(s); const e = ticks(s, 12, ['right']); check(e.some(e => e.kind === 'reward' && e.entityId === 'enemy') && s.view().run.form === 'large', 'invincibility should defeat harmful contact'); ticks(s, 55, ['right']); check(s.view().run.effects.invincibility === 0 && s.view().run.form === 'small', 'after expiry ordinary contact must damage'); return s.view();
  }
  if (id === 'IT-016') {
    const level = terrainLevel(undefined, [entity('cape', 'power:gliding', 40, 144), entity('enemy', 'enemy:patrol', 175, 144, { speed: 0 })]);
    const s = new TerrainSimulation({ level }); ticks(s, 35, ['right', 'action']); check(s.view().mechanics!.chargeTicks >= 18, 'charged run up'); step(s, ['right', 'action', 'jump'], ['jump']);
    const modes: string[] = []; const events: DomainEvent[] = [];
    for (let i = 0; i < 100; i++) { const v = s.view(); const held: Action[] = ['action']; if (v.player.position.x < 182) held.push('right'); if (i < 8) held.push('up'); if (i > 18) held.push('down'); events.push(...step(s, held)); modes.push(s.view().mechanics!.flight); }
    check(modes.includes('glide') && modes.includes('dive'), 'controlled glide and dive'); check(events.some(e => e.kind === 'reward' && e.entityId === 'enemy'), 'dive must defeat eligible enemy'); check(s.view().player.grounded && s.view().mechanics!.flight === 'none', 'landing must exit flight'); return { modes, events };
  }
  if (id === 'IT-017') {
    const results = [];
    for (const color of ['red', 'blue', 'yellow']) {
      const s = new TerrainSimulation({ level: terrainLevel(undefined, [entity('mount', 'mount', 40, 144), entity('shell', 'object:shell', 68, 144, { variant: color }), entity('enemy', 'enemy:patrol', 120, 144, { speed: 0 })]) });
      step(s, ['jump'], ['jump']); ticks(s, 35); step(s, ['action'], ['action']); check(s.view().run.mount?.swallowed?.variant === color, `ingest ${color}`); step(s);
      if (color === 'red') { step(s, ['action'], ['action']); check(s.view().mechanics!.projectiles.filter(p => p.source === 'arthur').length === 3, 'red shell fire'); const events = ticks(s, 25); check(events.some(e => e.kind === 'reward' && e.entityId === 'enemy'), 'red fire defeat'); }
      if (color === 'blue') { step(s, ['jump'], ['jump']); check(s.view().mechanics!.flight === 'climb', 'blue shell flight'); }
      if (color === 'yellow') { ticks(s, 15, ['right']); step(s, ['jump'], ['jump']); const events = ticks(s, 10, ['right']); events.push(...ticks(s, 40)); check(events.some(e => e.kind === 'reward' && e.entityId === 'enemy'), 'yellow landing attack'); }
      results.push(s.view());
    }
    return results;
  }
  if (id === 'IT-018') {
    const level = terrainLevel(); level.subareas.push({ ...structuredClone(level.subareas[0]!), id: 'restricted', allowMount: false, terrain: [solid('restricted-floor', 0, 160, 640)] });
    const s = new TerrainSimulation({ level }); const at = s.snapshot(); at.subareaId = 'restricted'; at.run.mount = { id: 'mount', color: 'green', state: 'ridden', berries: 0, swallowed: null }; s.restart(at);
    check(s.view().run.mount === null && s.view().mechanics!.mounts.length === 0 && s.view().player.mode !== 'dying', 'restricted restart must safely unmount'); return s.view();
  }
  if (id === 'IT-019') {
    const s = new TerrainSimulation({ level: terrainLevel(undefined, [entity('spring1', 'object:spring', 55, 144)]) });
    step(s, ['action'], ['action']); check(s.view().run.carried?.id === 'spring1', 'pick up'); step(s); step(s, ['action', 'down'], ['action']); check(s.view().run.carried === null, 'place'); step(s); step(s, ['action'], ['action']); check(s.view().run.carried?.id === 'spring1', 'reacquire'); step(s); step(s, ['action', 'up'], ['action']);
    const objects = s.view().mechanics!.objects.filter(o => o.descriptor.id === 'spring1'); check(objects.length === 1 && objects[0]!.owner === null && objects[0]!.mode === 'thrown' && objects[0]!.velocity.y < 0, 'unique upward thrown spring'); return objects;
  }
  if (id === 'IT-020') {
    const level = terrainLevel([solid('floor', 0, 160, 100)], [entity('key', 'object:key', 58, 144), entity('dispenser', 'dispenser', 48, 144, { objectId: 'key', objectKind: 'key' }), entity('exit', 'exit', 75, 128, { exitId: 'key-exit', height: 32 })]); level.exits = [{ id: 'key-exit', subareaId: 'main', kind: 'key', destination: 'main01.level02' }];
    const s = new TerrainSimulation({ level }); step(s, ['action'], ['action']); step(s); step(s, ['action'], ['action']); let lost = false; for (let i = 0; i < 100; i++) { step(s); if (s.view().mechanics!.objects[0]!.body.y > 400) lost = true; } check(lost, 'mandatory key must really fall into pit');
    const objects = s.view().mechanics!.objects.filter(o => o.descriptor.id === 'key'); check(objects.length === 1 && objects[0]!.mode === 'world', 'pit key must replenish once'); step(s, ['action'], ['action']); const events = ticks(s, 30, ['right']); check(events.some(e => e.kind === 'exit' && e.exitId === 'key-exit'), 'replacement key opens exit'); return events;
  }
  if (id === 'IT-021') {
    const outcomes = [];
    for (const family of ['reward', 'hidden', 'bounce', 'rotating', 'grab', 'message', 'bonus', 'spin-break']) {
      const level = terrainLevel(undefined, [entity('block', `block:${family}`, family === 'spin-break' ? 74 : family === 'grab' ? 58 : 40, family === 'spin-break' || family === 'grab' ? 128 : 110, { message: 'A pista', reward: 'coin' })]);
      if (family === 'bounce') level.subareas[0]!.spawn = { x: 48, y: 70 };
      const s = new TerrainSimulation({ level, run: run('large') }); const events: DomainEvent[] = [];
      if (family === 'bounce') events.push(...ticks(s, 20));
      else if (family === 'grab') events.push(...step(s, ['action'], ['action']));
      else if (family === 'spin-break') { step(s); events.push(...step(s, ['spin', 'right'], ['spin'])); events.push(...ticks(s, 35, ['spin', 'right'])); }
      else { step(s); events.push(...step(s, ['jump'], ['jump'])); events.push(...ticks(s, 4, ['jump'])); }
      const block = s.view().mechanics!.blocks[0]!;
      const rewards = events.filter(e => e.kind === 'reward');
      if (['reward', 'hidden', 'bonus'].includes(family)) check(rewards.length === 1 && block.consumed, `single ${family} reward`);
      if (family === 'bonus') check(rewards[0]!.amount === 3, 'bonus amount');
      if (family === 'grab') check(s.view().run.carried?.id === 'block' && s.view().mechanics!.objects.filter(o => o.descriptor.id === 'block' && o.owner === 'arthur').length === 1, 'grab block becomes uniquely carried object');
      if (family === 'bounce') check(s.view().player.velocity.y < 0, 'bounce velocity'); if (family === 'rotating') check(block.rotationTicks > 0, 'rotation timer'); if (['grab', 'spin-break'].includes(family)) check(block.consumed && !block.solid, `${family} removal`); if (family === 'message') check(events.filter(e => e.kind === 'message').length === 1, 'message outcome');
      outcomes.push({ family, block, events });
    }
    return outcomes;
  }
  if (id === 'IT-025') {
    const outcomes = []; const s = new TerrainSimulation({ level: terrainLevel() });
    for (const family of ENEMY_FAMILIES) for (const attack of ATTACKS) {
      const events: DomainEvent[] = []; const c = context(s, events); const enemy: EnemyActor = { id: `${family}-${attack}`, family, body: { x: 80, y: 144, width: 16, height: 16 }, home: { x: 80, y: 144 }, velocity: { x: 0, y: 0 }, side: 'front', alive: true, phase: 0, attackTicks: 0, respawnTicks: 0 };
      const immune: Record<string, string[]> = { aquatic: ['stomp', 'slide'], projectile: ['stomp', 'projectile', 'shell', 'slide', 'block', 'tongue', 'fence'], armored: ['stomp', 'projectile', 'tongue'], pursuit: ['stomp', 'projectile'], gaze: ['stomp', 'spin', 'projectile', 'slide', 'tongue'], regeneration: ['tongue'] };
      const expected = ['projectile', 'armored'].includes(family) && attack === 'spin' ? 'bounce' : immune[family]?.includes(attack) ? 'immune' : 'defeat';
      const result = strikeEnemy(c, enemy, attack); check(result === expected && enemy.alive === (expected !== 'defeat') && events.length === Number(expected === 'defeat'), `matrix ${family}/${attack}`); outcomes.push({ family, attack, result });
    }
    return outcomes;
  }
  if (id === 'IT-026') {
    const s = new TerrainSimulation({ level: terrainLevel(undefined, [entity('shooter', 'enemy:projectile', 180, 144, { speed: 0 })]), run: run('large') }); const at = s.snapshot(); ticks(s, 165); const before = s.view(); check(before.mechanics!.projectiles.some(p => p.source === 'enemy' && Math.abs(p.body.x - at.anchor.x) < 80), 'live projectile near restart anchor'); step(s, [], ['pause']); check(s.view().tick === before.tick, 'pause freezes hazard'); s.restart(at); check(s.view().mechanics!.projectiles.length === 0 && s.view().mechanics!.enemies[0]!.attackTicks === 0, 'restart recreates fresh hazard phase'); return s.view();
  }
  if (id === 'IT-027' || id === 'IT-028') return bosses(id === 'IT-028');
  throw new Error(`unknown journey ${id}`);
}

function bosses(recovery: boolean): unknown {
  const results = [];
  for (const controller of recovery ? [5] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    const surface = platformEntity(controller === 6 || controller === 9 ? 'rotating' : 'balance', { width: 260, radius: 0, tilt: 0.05 }); surface.position = { x: 0, y: 160 };
    const level = terrainLevel([], [surface, entity('boss', 'boss', 95, 128, { width: 24, height: 24, controller, exitId: 'boss-exit', replenisher: 'ammo' }), entity('ammo', 'dispenser', 48, 144, { objectId: 'ammo1', objectKind: 'block' })]);
    level.exits = [{ id: 'boss-exit', kind: 'boss', subareaId: 'main', destination: 'main01.level02' }];
    const r = run('large'); r.effects.invincibility = 12000; const s = new TerrainSimulation({ level, run: r }); const events: DomainEvent[] = []; const visited = new Set<string>(); let edge = false; let discarded = false; let replacementSeen = false;
    for (let i = 0; i < 6000 && s.view().mechanics!.bosses[0]!.alive; i++) {
      const v = s.view(); const boss = v.mechanics!.bosses[0]!; const method = bossMethod(boss); visited.add(method); const held: Action[] = []; const pressed: Action[] = [];
      if (discarded && v.mechanics!.objects.some(o => o.descriptor.id === 'ammo1' && o.mode === 'world' && o.dispenser === 'ammo')) replacementSeen = true;
      if (method === 'throwable') {
        if (v.run.carried) {
          if (recovery && !discarded) { held.push('left'); if (v.player.position.x <= 20 && !edge) { held.push('action'); pressed.push('action'); discarded = true; edge = true; } }
          else { const target = boss.body.x - 27; if (v.player.position.x < target - 2) held.push('right'); else if (v.player.position.x > target + 2) held.push('left'); else if (!edge) { held.push('action'); pressed.push('action'); edge = true; } }
        } else {
          if (v.player.position.x > 61) held.push('left'); else if (v.player.position.x < 42) held.push('right'); else if (!edge) { held.push('action'); pressed.push('action'); edge = true; }
        }
      } else {
        const target = boss.body.x + boss.body.width / 2; if (v.player.position.x < target - 3) held.push('right'); else if (v.player.position.x > target + 3) held.push('left');
        if (v.player.grounded && !edge) { held.push('jump'); pressed.push('jump'); edge = true; } else if (v.player.velocity.y < 0) held.push('jump');
      }
      if (!pressed.length) edge = false;
      events.push(...step(s, held, pressed));
    }
    check(!s.view().mechanics!.bosses[0]!.alive, `controller ${controller} unsolved: ${JSON.stringify(s.view())}`);
    check(events.filter(e => e.kind === 'bossVictory').length === 1 && events.filter(e => e.kind === 'exit').length === 1, `controller ${controller} victory and exit once`);
    if (recovery) check(discarded && replacementSeen && s.view().mechanics!.objects.filter(o => o.descriptor.id === 'ammo1').length === 1, 'lost last ammo replenishes one identity'); results.push({ controller, visited: [...visited], events });
  }
  return results;
}
