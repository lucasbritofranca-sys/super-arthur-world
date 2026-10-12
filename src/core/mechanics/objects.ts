import type { CarriedDescriptor, Rect, EntityDefinition } from '../types';
import type { Context, ObjectActor, ProjectileActor } from './model';
import { bottom, overlaps } from '../geometry';
import { carrySupported } from './support';
export function objectActor(descriptor: CarriedDescriptor, body: Rect, dispenser: string | null = null): ObjectActor {
  return { descriptor, body: { ...body }, velocity: { x: 0, y: 0 }, mode: 'world', owner: null, remainingTicks: descriptor.kind === 'timed' ? 180 : 0, dispenser };
}
export function alignCarried(player: Context['player'], objects: ObjectActor[], clear: (body: Rect) => boolean): void {
  const held = objects.find(o => o.owner === player.id && o.mode === 'carried');
  if (!held) return;
  const proposed = { ...held.body, x: player.body.x + player.facing * 12, y: Math.min(player.body.y + 4, bottom(player.body) - held.body.height) };
  held.body = clear(proposed) ? proposed : { ...proposed, x: player.body.x };
}
export function controlObject(c: Context, objects: ObjectActor[]): void {
  const p = c.player; const held = objects.find(o => o.owner === p.id && o.mode === 'carried');
  if (held) {
    alignCarried(p, objects, c.clear); p.carried = held.descriptor;
    if (c.input.pressed.has('action')) {
      held.owner = null; p.carried = null;
      if (c.input.held.has('down')) { held.mode = 'world'; held.velocity = { x: 0, y: 0 }; held.body.y = bottom(p.body) - held.body.height; }
      else { held.mode = 'thrown'; held.velocity = c.input.held.has('up') ? { x: 0, y: -300 } : { x: p.facing * 240, y: -90 }; }
    }
  } else if (c.input.pressed.has('action') && !c.run.mount) {
    const candidates = objects.filter(o => o.mode === 'world' && overlaps({ ...p.body, x: p.body.x - 12, width: p.body.width + 24 }, o.body));
    candidates.sort((a, b) => Math.abs(a.body.x - p.body.x) - Math.abs(b.body.x - p.body.x) || a.descriptor.id.localeCompare(b.descriptor.id));
    const candidate = candidates[0];
    if (candidate) { candidate.mode = 'carried'; candidate.owner = p.id; candidate.velocity = { x: 0, y: 0 }; p.carried = candidate.descriptor; }
  }
  c.run.carried = p.carried;
}
export function moveObjects(c: Context, objects: ObjectActor[], bounds: Rect): void {
  for (const o of objects) {
    if (o.mode === 'consumed') continue;
    if (o.remainingTicks > 0 && --o.remainingTicks === 0) { o.mode = 'consumed'; continue; }
    if (['carried', 'mouth', 'tongue'].includes(o.mode)) continue;
    const carried = carrySupported(c, o.body); o.body = carried.body;
    if (carried.crushed) { o.mode = 'consumed'; continue; }
    o.velocity.y = Math.min(360, o.velocity.y + 15);
    const moved = c.move(o.body, o.velocity.x / 60, o.velocity.y / 60); o.body = moved.body;
    if (moved.blockedX) o.velocity.x *= -1;
    if (moved.blockedY) o.velocity.y = 0;
    if (moved.crushed || o.body.y > bottom(bounds) || o.body.x < bounds.x - 32 || o.body.x > bounds.x + bounds.width + 32) o.mode = 'consumed';
    if (o.descriptor.kind === 'spring' && o.mode === 'world' && c.player.velocity.y >= 0 && overlaps(c.player.body, { ...o.body, y: o.body.y - 4, height: o.body.height + 4 })) c.player.velocity.y = -360;
    if (o.descriptor.kind === 'shell' && o.mode === 'world' && overlaps(c.player.body, o.body) && !c.input.held.has('action')) { o.mode = 'kicked'; o.velocity.x = c.player.facing * 300; }
  }
}
export function replenish(c: Context, objects: ObjectActor[], dispensers: readonly EntityDefinition[]): void {
  for (const d of dispensers) {
    const objectId = String(d.parameters['objectId']); const existing = objects.find(o => o.descriptor.id === objectId);
    const range = Number(d.parameters['range'] ?? 96);
    if (Math.abs(c.player.position.x - d.position.x) > range || existing && existing.mode !== 'consumed') continue;
    const descriptor = { id: objectId, kind: String(d.parameters['objectKind'] ?? 'key') as CarriedDescriptor['kind'], variant: String(d.parameters['variant'] ?? 'green') };
    const replacement = objectActor(descriptor, { ...d.position, width: 16, height: 16 }, d.id);
    if (existing) Object.assign(existing, replacement); else objects.push(replacement);
  }
}
export function moveProjectiles(c: Context, projectiles: ProjectileActor[]): void {
  for (const shot of projectiles) {
    if (--shot.remainingTicks <= 0) continue;
    const move = c.move(shot.body, shot.velocity.x / 60, shot.velocity.y / 60); shot.body = move.body;
    if (move.blockedX || move.blockedY || move.crushed) shot.remainingTicks = 0;
  }
}
