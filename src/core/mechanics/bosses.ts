import type { BossActor, BossMethod, Context, MechanicView } from './model';
import { overlaps } from '../geometry';
export const BOSS_METHODS: readonly (readonly BossMethod[])[] = [
  ['tilted'], ['underside'], ['decoy'], ['ceiling'], ['throwable'], ['rotating'],
  ['tilted', 'ceiling'], ['decoy', 'underside'], ['rotating', 'throwable'], ['tilted', 'decoy', 'throwable'],
];
export function bossMethod(boss: BossActor): BossMethod { const methods = BOSS_METHODS[boss.controller - 1]!; return methods[Math.min(boss.phase, methods.length - 1)]!; }
export function moveBosses(c: Context, view: MechanicView): void {
  for (const boss of view.bosses) {
    if (!boss.alive) continue;
    if (boss.hitCooldown) boss.hitCooldown--;
    boss.attackTicks++;
    const method = bossMethod(boss); const period = 180 + boss.controller * 12;
    const dx = boss.home.x + Math.sin(boss.attackTicks / period * Math.PI * 2) * (method === 'decoy' ? 48 : 16) - boss.body.x;
    const dy = method === 'ceiling' ? boss.home.y + Math.sin(boss.attackTicks / 60) * 24 - boss.body.y : 0;
    boss.body = c.move(boss.body, dx, dy).body;
    boss.decoys = method === 'decoy' ? [-40, 40].map(x => ({ ...boss.body, x: boss.body.x + x })) : [];
    if (boss.attackTicks % 120 === 0 && Math.abs(boss.body.x - c.player.position.x) > 48) view.projectiles.push({ id: `${boss.id}:${c.tick}`, body: { ...boss.body, width: 8, height: 8 }, velocity: { x: Math.sign(c.player.position.x - boss.body.x) * 120, y: 0 }, source: 'enemy', remainingTicks: 180 });
  }
}
export function bossContacts(c: Context, view: MechanicView, previousVy: number): { harmed: boolean; defeated: BossActor[] } {
  let harmed = false; const defeated: BossActor[] = [];
  for (const b of view.bosses) {
    if (!b.alive) continue;
    const method = bossMethod(b); const p = c.player;
    const thrown = view.objects.find(o => o.mode === 'thrown' && o.descriptor.kind === 'block' && overlaps(o.body, b.body));
    const under = previousVy < 0 && overlaps({ ...p.body, y: p.body.y - 8 }, b.body);
    const touching = overlaps(p.body, b.body);
    if (b.decoys.some(d => overlaps(p.body, d)) && !c.run.effects.invincibility) harmed = true;
    const onRotating = c.surfaces.some(s => (s.id === p.supportId || s.id === p.launchSupportId) && s.kind === 'rotating');
    const onTilt = c.surfaces.some(s => (s.id === p.supportId || s.id === p.launchSupportId) && s.kind === 'balance');
    const downward = previousVy > 0;
    const hit = method === 'throwable' ? !!thrown : method === 'underside' ? under : method === 'rotating' ? touching && downward && onRotating : method === 'tilted' ? touching && downward && onTilt : method === 'ceiling' ? under && b.attackTicks % 120 < 60 : touching && downward;
    if (hit && !b.hitCooldown) {
      b.hits++; b.hitCooldown = 30; p.velocity.y = method === 'underside' || method === 'ceiling' ? 90 : -180;
      if (thrown) { thrown.mode = 'consumed'; thrown.owner = null; }
      const methods = BOSS_METHODS[b.controller - 1]!;
      if (b.hits >= 3) { b.hits = 0; if (++b.phase >= methods.length) { b.alive = false; defeated.push(b); } }
    } else if (touching && !c.run.effects.invincibility && !b.hitCooldown) harmed = true;
  }
  return { harmed, defeated };
}
