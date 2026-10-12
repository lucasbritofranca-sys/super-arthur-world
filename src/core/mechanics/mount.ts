import type { Context, MountActor, ObjectActor, ProjectileActor } from './model';
import { bottom, overlaps } from '../geometry';
import { carrySupported } from './support';
export function capabilities(mount: MountActor | undefined): { fire: boolean; flight: boolean; stomp: boolean } {
  const shell = mount?.descriptor.swallowed;
  return { fire: !!shell && (shell.variant === 'red' || mount?.descriptor.color === 'red'), flight: !!shell && (shell.variant === 'blue' || mount?.descriptor.color === 'blue'), stomp: !!shell && (shell.variant === 'yellow' || mount?.descriptor.color === 'yellow') };
}
export function controlMount(c: Context, mounts: MountActor[], objects: ObjectActor[], projectiles: ProjectileActor[]): void {
  const p = c.player; let riding = mounts.find(m => m.descriptor.id === c.run.mount?.id && m.descriptor.state !== 'fleeing' && m.descriptor.state !== 'baby');
  if (!riding && c.input.pressed.has('jump')) {
    riding = mounts.find(m => m.descriptor.state === 'following' && overlaps(p.body, { ...m.body, y: m.body.y - 16, height: m.body.height + 16 }));
    if (riding) { riding.descriptor.state = 'ridden'; c.run.mount = riding.descriptor; }
  }
  if (!riding) return;
  riding.body = { ...riding.body, x: p.body.x, y: bottom(p.body) - 16 };
  if (c.input.pressed.has('spin')) {
    const proposed = { ...p.body, y: p.body.y - 16 };
    if (c.clear(proposed)) { p.body = proposed; p.velocity.y = -270; riding.descriptor.state = 'following'; riding.shellTicks = c.run.effects.mountShell; c.run.mount = null; c.run.effects.mountShell = 0; }
    return;
  }
  if (!c.input.pressed.has('action')) return;
  const swallowed = riding.descriptor.swallowed;
  if (swallowed) {
    const object = objects.find(o => o.descriptor.id === swallowed.id);
    if (object) {
      object.owner = null;
      const proposed = { ...object.body, x: p.body.x + p.facing * 24, y: Math.min(p.body.y + 8, bottom(p.body) - object.body.height) };
      object.body = c.clear(proposed) ? proposed : { ...proposed, x: p.body.x };
      if (capabilities(riding).fire) {
        object.mode = 'consumed';
        for (const dy of [-60, 0, 60]) projectiles.push({ id: `${object.descriptor.id}:fire:${c.tick}:${dy}`, body: { ...object.body, width: 6, height: 6 }, velocity: { x: p.facing * 240, y: dy }, source: 'arthur', remainingTicks: 120 });
      } else { object.mode = 'kicked'; object.velocity = { x: p.facing * 300, y: 0 }; }
    }
    riding.descriptor.swallowed = null; riding.descriptor.state = 'ridden'; c.run.effects.mountShell = 0;
  } else {
    const tongue = { ...p.body, x: p.facing === 1 ? p.body.x : p.body.x - 40, width: p.body.width + 40 };
    const target = objects.filter(o => o.mode === 'world' && o.descriptor.kind === 'shell' && overlaps(tongue, o.body)).sort((a, b) => a.descriptor.id.localeCompare(b.descriptor.id))[0];
    riding.tongueTicks = 6;
    if (target) { target.mode = 'mouth'; target.owner = riding.descriptor.id; target.velocity = { x: 0, y: 0 }; riding.descriptor.swallowed = target.descriptor; riding.descriptor.state = 'swallowing'; c.run.effects.mountShell = 1200; }
  }
  c.run.mount = riding.descriptor;
}
export function moveMounts(c: Context, mounts: MountActor[], objects: ObjectActor[]): void {
  for (const m of mounts) {
    if (m.tongueTicks) m.tongueTicks--;
    if (m.descriptor.id === c.run.mount?.id) {
      m.shellTicks = c.run.effects.mountShell;
      if (!c.run.effects.mountShell && m.descriptor.swallowed) {
        const o = objects.find(o => o.descriptor.id === m.descriptor.swallowed?.id); if (o) { o.mode = 'consumed'; o.owner = null; }
        m.descriptor.swallowed = null; m.descriptor.state = 'ridden';
      }
      continue;
    }
    if (m.shellTicks > 0) m.shellTicks--;
    if (!m.shellTicks && m.descriptor.swallowed) {
      const o = objects.find(o => o.descriptor.id === m.descriptor.swallowed?.id);
      if (o) { o.mode = 'consumed'; o.owner = null; }
      m.descriptor.swallowed = null;
    }
    const carried = carrySupported(c, m.body); m.body = carried.body;
    if (carried.crushed) { m.descriptor.state = 'following'; m.velocity = { x: 0, y: 0 }; continue; }
    m.velocity.y = Math.min(360, m.velocity.y + 15);
    m.velocity.x = m.descriptor.state === 'fleeing' ? m.fleeDirection * 90 : m.descriptor.state === 'following' ? Math.sign(c.player.position.x - m.body.x) * 30 : 0;
    const moved = c.move(m.body, m.velocity.x / 60, m.velocity.y / 60); m.body = moved.body;
    if (moved.blockedY) m.velocity.y = 0;
    if (moved.blockedX && m.descriptor.state === 'fleeing') { m.fleeDirection = m.fleeDirection === 1 ? -1 : 1; m.velocity.x *= -1; }
    if (m.descriptor.state === 'fleeing' && overlaps(c.player.body, { ...m.body, y: m.body.y - 16, height: m.body.height + 16 }) && c.input.pressed.has('jump')) { m.descriptor.state = 'ridden'; c.run.mount = m.descriptor; c.run.effects.mountShell = m.shellTicks; }
  }
}
