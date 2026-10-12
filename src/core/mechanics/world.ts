import type { EntityDefinition, SubareaDefinition, RunState, Rect, CarriedDescriptor } from '../types';
import type { Context, MechanicView, EnemyFamily, BlockFamily, MountActor, BlockActor } from './model';
import { entityRect } from '../traversal';
import { overlaps, bottom } from '../geometry';
import { acquirePower, damage, fitForm } from './powers';
import { controlFlight } from './flight';
import { objectActor, controlObject, moveObjects, replenish, moveProjectiles } from './objects';
import { capabilities, controlMount, moveMounts } from './mount';
import { moveEnemies, contactEnemies, strikeEnemy } from './enemies';
import { moveBosses, bossContacts } from './bosses';
import { activateBlocks, blockContacts, blockTerrain } from './blocks';

export interface AreaMechanicMemory { consumed: string[]; blocks: BlockActor[]; convertedCollected: string[] }
export class MechanicsWorld {
  readonly state: MechanicView = { objects: [], mounts: [], enemies: [], projectiles: [], blocks: [], bosses: [], temporaryCoins: [], protectionTicks: 0, flight: 'none', chargeTicks: 0, climbTicks: 0 };
  private consumed = new Set<string>();
  private shotCooldown = 0;
  private convertedCollected = new Set<string>();
  constructor(readonly area: SubareaDefinition, run: RunState, memory?: AreaMechanicMemory) {
    for (const e of [...area.entities].sort((a, b) => a.id.localeCompare(b.id))) {
      const body = entityRect(e); const subtype = e.kind.split(':')[1];
      if (e.kind.startsWith('object:')) this.state.objects.push(objectActor({ id: e.id, kind: subtype as CarriedDescriptor['kind'], variant: String(e.parameters['variant'] ?? 'green') }, body));
      if (e.kind.startsWith('enemy:')) this.state.enemies.push({ id: e.id, family: subtype as EnemyFamily, body, home: { ...e.position }, velocity: { x: Number(e.parameters['speed'] ?? 30), y: 0 }, alive: true, respawnTicks: 0, phase: 0, attackTicks: 0, side: e.parameters['side'] === 'back' ? 'back' : 'front' });
      if (e.kind.startsWith('block:')) this.state.blocks.push({ id: e.id, family: subtype as BlockFamily, body, consumed: false, solid: subtype !== 'hidden', rotationTicks: 0, reward: e.parameters['reward'] === 'life' ? 'life' : e.parameters['reward'] === 'score' ? 'score' : 'coin', message: String(e.parameters['message'] ?? 'Explore os caminhos.'), switchId: typeof e.parameters['switchId'] === 'string' ? e.parameters['switchId'] : null });
      if (e.kind === 'mount' && area.allowMount) this.state.mounts.push({ descriptor: { id: e.id, color: String(e.parameters['color'] ?? 'green') as MountActor['descriptor']['color'], state: e.parameters['baby'] === true ? 'baby' : 'following', berries: 0, swallowed: null }, body, velocity: { x: 0, y: 0 }, tongueTicks: 0, shellTicks: 0, fleeDirection: 1 });
      if (e.kind === 'boss') this.state.bosses.push({ id: e.id, controller: Number(e.parameters['controller']), body, home: { ...e.position }, hits: 0, phase: 0, hitCooldown: 0, alive: true, attackTicks: 0, exitId: String(e.parameters['exitId'] ?? ''), replenisher: typeof e.parameters['replenisher'] === 'string' ? e.parameters['replenisher'] : null, decoys: [] });
    }
    run.temporarySwitches ??= [];
    if (memory) {
      this.consumed = new Set(memory.consumed); this.convertedCollected = new Set(memory.convertedCollected);
      for (const block of this.state.blocks) {
        const saved = memory.blocks.find(b => b.id === block.id);
        if (saved) { block.consumed = saved.consumed; block.solid = saved.solid; block.rotationTicks = 0; }
        if (block.switchId) block.solid = !this.convertedCollected.has(block.id) && !run.temporarySwitches.some(s => s.id === block.switchId);
      }
    }
    if (!area.allowMount) { run.mount = null; run.effects.mountShell = 0; }
    if (run.mount) {
      let mount = this.state.mounts.find(m => m.descriptor.id === run.mount?.id);
      if (!mount) { mount = { descriptor: run.mount, body: { x: area.spawn.x - 8, y: area.spawn.y - 16, width: 16, height: 16 }, velocity: { x: 0, y: 0 }, tongueTicks: 0, shellTicks: 0, fleeDirection: 1 }; this.state.mounts.push(mount); }
      mount.descriptor = run.mount; mount.shellTicks = run.effects.mountShell;
      if (run.mount.swallowed) this.restoreObject(run.mount.swallowed, 'mouth', run.mount.id, mount.body);
    }
    if (run.carried) this.restoreObject(run.carried, 'carried', 'arthur', { ...area.spawn, width: 16, height: 16 });
    for (const b of this.state.blocks) if (b.switchId && run.temporarySwitches.some(s => s.id === b.switchId)) b.solid = false;
  }
  private restoreObject(d: CarriedDescriptor, mode: 'mouth' | 'carried', owner: string, body: Rect): void {
    let object = this.state.objects.find(o => o.descriptor.id === d.id);
    if (!object) { object = objectActor(d, body); this.state.objects.push(object); }
    object.mode = mode; object.owner = owner; object.descriptor = d;
  }
  terrain(): ReturnType<typeof blockTerrain> { return blockTerrain(this.state.blocks); }
  begin(c: Context): void {
    if (this.state.protectionTicks) this.state.protectionTicks--;
    if (this.shotCooldown) this.shotCooldown--;
    for (const key of ['invincibility', 'float', 'mountShell'] as const) if (c.run.effects[key]) c.run.effects[key]--;
    for (const s of c.run.temporarySwitches ?? []) s.remainingTicks--;
    c.run.temporarySwitches = (c.run.temporarySwitches ?? []).filter(s => {
      if (s.remainingTicks > 0) return true;
      if (!activateBlocks(c, this.state.blocks.filter(b => b.switchId === s.id && !this.convertedCollected.has(b.id)))) { s.remainingTicks = 1; return true; }
      return false;
    });
    this.state.temporaryCoins = this.state.blocks.filter(b => b.switchId && c.run.temporarySwitches?.some(s => s.id === b.switchId) && !this.convertedCollected.has(b.id)).map(b => ({ id: b.id, body: { ...b.body } }));
    for (const o of this.state.objects) if (o.descriptor.kind === 'timed' && o.remainingTicks === 1 && o.mode !== 'consumed') {
      for (const direction of [-1, 1]) this.state.projectiles.push({ id: `${o.descriptor.id}:burst:${direction}`, body: { ...o.body, width: 12, height: 12 }, velocity: { x: direction * 120, y: 0 }, source: 'enemy', remainingTicks: 30 });
      if (o.owner === c.player.id) { c.player.carried = null; c.run.carried = null; o.owner = null; o.mode = 'world'; }
    }
    moveObjects(c, this.state.objects, this.area.bounds); moveMounts(c, this.state.mounts, this.state.objects);
    moveEnemies(c, this.state); moveBosses(c, this.state); moveProjectiles(c, this.state.projectiles);
    this.state.projectiles = this.state.projectiles.filter(p => p.remainingTicks > 0);
    replenish(c, this.state.objects, this.area.entities.filter(e => e.kind === 'dispenser').sort((a, b) => a.id.localeCompare(b.id)));
  }
  control(c: Context, wasGrounded: boolean): void {
    fitForm(c); controlObject(c, this.state.objects); controlMount(c, this.state.mounts, this.state.objects, this.state.projectiles);
    const mount = this.state.mounts.find(m => m.descriptor.id === c.run.mount?.id);
    controlFlight(c, this.state, wasGrounded, capabilities(mount).flight);
    if (c.player.verticalRun && mount) { c.player.verticalRun = null; c.player.velocity = { x: -c.player.facing * 90, y: -270 }; }
    if (c.run.form === 'projectile' && c.input.pressed.has('action') && !this.shotCooldown && !c.run.carried && !c.run.mount) {
      this.shotCooldown = 15; this.state.projectiles.push({ id: `arthur:${c.tick}`, body: { x: c.player.position.x + c.player.facing * 12, y: c.player.body.y + 8, width: 6, height: 6 }, velocity: { x: c.player.facing * 240, y: 0 }, source: 'arthur', remainingTicks: 120 });
    }
  }
  private pickups(c: Context): void {
    for (const coin of this.state.temporaryCoins) if (overlaps(c.player.body, coin.body) && !this.convertedCollected.has(coin.id)) {
      this.convertedCollected.add(coin.id);
      c.emit({ kind: 'reward', eventId: c.event(`reward:${coin.id}`), tick: c.tick, entityId: coin.id, reward: 'coin', amount: 1 });
    }
    this.state.temporaryCoins = this.state.temporaryCoins.filter(coin => !this.convertedCollected.has(coin.id));
    for (const e of [...this.area.entities].sort((a, b) => a.id.localeCompare(b.id))) {
      if (this.consumed.has(e.id) || !overlaps(c.player.body, entityRect(e))) continue;
      if (e.kind.startsWith('power:')) {
        const power = e.kind.slice(6);
        if (power === 'invincibility') c.run.effects.invincibility = Number(e.parameters['duration'] ?? 600);
        else if (power === 'float') c.run.effects.float = Number(e.parameters['duration'] ?? 1200);
        else acquirePower(c.run, power as 'large' | 'projectile' | 'gliding');
        fitForm(c); this.consumed.add(e.id);
      }
      if (e.kind === 'berry') {
        const mount = this.state.mounts.find(m => m.descriptor.id === c.run.mount?.id) ?? this.state.mounts.find(m => m.descriptor.state === 'baby' && Math.abs(m.body.x - e.position.x) < 40);
        if (mount) { mount.descriptor.berries++; if (mount.descriptor.state === 'baby' && mount.descriptor.berries >= 5) mount.descriptor.state = 'following'; this.consumed.add(e.id); }
      }
      if (e.kind === 'wings' && c.run.mount) {
        this.consumed.add(e.id); c.emit({ kind: 'mountBonus', eventId: c.event(`mountBonus:${e.id}`), tick: c.tick, entityId: e.id, destination: String(e.parameters['destination']) });
      }
      if (e.kind === 'switch' && c.input.pressed.has('action')) {
        const remainingTicks = Number(e.parameters['duration'] ?? 60);
        const previous = c.run.temporarySwitches?.find(s => s.id === e.id);
        if (previous) previous.remainingTicks = remainingTicks; else c.run.temporarySwitches?.push({ id: e.id, remainingTicks });
        for (const b of this.state.blocks.filter(b => b.switchId === e.id)) b.solid = false;
      }
      if (e.kind === 'sanctuary' && c.input.pressed.has('action')) c.emit({ kind: 'sanctuary', eventId: c.event(`sanctuary:${e.id}`), tick: c.tick, sanctuaryId: e.id, color: String(e.parameters['color']) as 'green' | 'red' | 'blue' | 'yellow' });
    }
  }
  private releaseReserve(c: Context): void {
    if (!c.run.reserve) return;
    const reserve = c.run.reserve;
    const id = `reserve:${c.tick}`;
    const start = { x: c.player.position.x - 8, y: bottom(c.player.body) - 16, width: 16, height: 16 };
    const targetY = Math.max(this.area.bounds.y, c.player.body.y - 40);
    const release = c.move(start, 0, targetY - start.y);
    if (release.crushed || !c.clear(release.body)) return;
    c.run.reserve = null;
    // These falling collectibles are runtime entities, not extra authored level entries.
    this.fallingPowers.push({ id, form: reserve, body: release.body, velocity: 0, createdTick: c.tick });
  }
  readonly fallingPowers: { id: string; form: 'large' | 'projectile' | 'gliding'; body: Rect; velocity: number; createdTick: number }[] = [];
  finish(c: Context, previous: { y: number; bottom: number; vy: number }): { lethal: boolean; bossExits: string[] } {
    this.pickups(c);
    if (c.input.pressed.has('reserve')) this.releaseReserve(c);
    for (const power of this.fallingPowers) {
      if (this.consumed.has(power.id) || power.createdTick === c.tick) continue;
      power.velocity = Math.min(120, power.velocity + 5); const moved = c.move(power.body, 0, power.velocity / 60);
      if (moved.crushed) { this.consumed.add(power.id); continue; }
      power.body = moved.body;
      if (overlaps(c.player.body, power.body) && !this.consumed.has(power.id)) { acquirePower(c.run, power.form); this.consumed.add(power.id); fitForm(c); }
    }
    const blockStates = new Map(this.state.blocks.map(b => [b.id, { consumed: b.consumed, rotationTicks: b.rotationTicks }]));
    blockContacts(c, this.state.blocks, previous);
    for (const block of this.state.blocks) {
      const before = blockStates.get(block.id)!;
      if ((!before.consumed && block.consumed || !before.rotationTicks && block.rotationTicks > 0) && previous.vy < 0) {
        const above = { ...block.body, y: block.body.y - 16, height: 16 };
        for (const enemy of this.state.enemies) if (enemy.alive && overlaps(enemy.body, above)) strikeEnemy(c, enemy, 'block');
      }
    }
    for (const b of this.state.blocks) if (b.family === 'grab' && b.consumed && !blockStates.get(b.id)!.consumed && !this.state.objects.some(o => o.descriptor.id === b.id)) {
      const object = objectActor({ id: b.id, kind: 'block', variant: 'grab' }, b.body);
      if (!c.run.carried && !c.run.mount) { object.mode = 'carried'; object.owner = c.player.id; c.player.carried = object.descriptor; c.run.carried = object.descriptor; }
      this.state.objects.push(object);
    }
    const boss = bossContacts(c, this.state, previous.vy); let harm = contactEnemies(c, this.state, previous.bottom, previous.vy > 0) || boss.harmed;
    if (this.state.protectionTicks || c.run.effects.invincibility) harm = false;
    if (harm && c.run.mount) {
      const m = this.state.mounts.find(m => m.descriptor.id === c.run.mount?.id)!; m.descriptor.state = 'fleeing'; m.shellTicks = c.run.effects.mountShell; c.run.mount = null; c.run.effects.mountShell = 0;
      this.state.protectionTicks = 60; c.player.velocity.y = -180; harm = false;
    }
    if (harm) {
      if (damage(c) === 'death') return { lethal: true, bossExits: [] };
      this.state.protectionTicks = c.difficulty === 'easy' ? 120 : c.difficulty === 'hard' ? 30 : 60; this.releaseReserve(c);
    }
    const mount = this.state.mounts.find(m => m.descriptor.id === c.run.mount?.id);
    if (c.run.form !== 'gliding' && !capabilities(mount).flight) {
      this.state.flight = 'none'; this.state.chargeTicks = 0; this.state.climbTicks = 0;
      if (c.player.mode === 'flight') c.player.mode = c.player.grounded ? 'ground' : 'air';
    }
    if (c.player.grounded) {
      if (capabilities(mount).stomp && previous.vy > 0) for (const enemy of this.state.enemies) if (enemy.alive && Math.abs(enemy.body.x - c.player.position.x) < 48 && Math.abs(bottom(enemy.body) - bottom(c.player.body)) < 8) { enemy.alive = false; c.emit({ kind: 'reward', eventId: c.event(`reward:${enemy.id}`), tick: c.tick, entityId: enemy.id, reward: 'score', amount: 100 }); }
      this.state.flight = 'none';
    } else if (this.state.flight !== 'none') c.player.mode = 'flight';
    if (c.run.effects.float > 0) c.player.mode = 'float';
    const bossExits: string[] = [];
    for (const b of boss.defeated) { c.emit({ kind: 'bossVictory', eventId: c.event(`bossVictory:${b.id}`), tick: c.tick, bossId: b.id }); if (b.exitId) bossExits.push(b.exitId); }
    return { lethal: false, bossExits };
  }
  reset(): void { this.state.projectiles.length = 0; }
  memory(): AreaMechanicMemory { return structuredClone({ consumed: [...this.consumed], blocks: this.state.blocks, convertedCollected: [...this.convertedCollected] }); }
  powerVisible(id: string): boolean { return !this.consumed.has(id); }
  visiblePickups(): EntityDefinition[] { return this.area.entities.filter(e => !this.consumed.has(e.id) && (e.kind.startsWith('power:') || e.kind === 'berry' || e.kind === 'wings')); }
}
