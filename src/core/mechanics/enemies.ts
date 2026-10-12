import type { Attack, Context, EnemyActor, MechanicView } from './model';
import { VULNERABILITY } from './vulnerability';
import { overlaps, bottom } from '../geometry';
import { carrySupported } from './support';
export function strikeEnemy(c: Context, enemy: EnemyActor, attack: Attack): 'defeat' | 'bounce' | 'immune' {
  const response = VULNERABILITY[enemy.family][attack];
  if (!enemy.alive) return 'immune';
  if (response === 'defeat') {
    enemy.alive = false; enemy.respawnTicks = enemy.family === 'regeneration' ? 180 : 0;
    c.emit({ kind: 'reward', eventId: c.event(`reward:${enemy.id}`), tick: c.tick, entityId: enemy.id, reward: 'score', amount: 100, chain: ['stomp', 'spin', 'shell', 'invincibility'].includes(attack) });
  }
  if (attack === 'stomp' && response !== 'immune' || attack === 'spin' && response === 'bounce') c.player.velocity.y = -180;
  return response;
}
export function moveEnemies(c: Context, view: MechanicView): void {
  for (const e of view.enemies) {
    if (!e.alive) { if (e.respawnTicks && --e.respawnTicks === 0) { e.alive = true; e.body.x = e.home.x; e.body.y = e.home.y; e.velocity = { x: 30, y: 0 }; } continue; }
    if (Math.abs(e.body.x - c.player.position.x) > 640) continue;
    const carried = carrySupported(c, e.body); e.body = carried.body;
    if (carried.crushed) { e.alive = false; continue; }
    e.phase++; e.attackTicks++;
    const rate = c.difficulty === 'easy' ? 0.7 : c.difficulty === 'hard' ? 1.3 : 1;
    if (e.family === 'aerial' || e.family === 'aquatic') { e.velocity.y = Math.cos(e.phase / (e.family === 'aerial' ? 30 : 45)) * (e.family === 'aerial' ? 40 : 20); }
    else e.velocity.y = Math.min(360, e.velocity.y + 15);
    if (e.family === 'pursuit') e.velocity.x = Math.sign(c.player.position.x - e.body.x) * 55;
    if (e.family === 'gaze') e.velocity.x = c.player.facing === Math.sign(e.body.x - c.player.position.x) ? 0 : Math.sign(c.player.position.x - e.body.x) * 40;
    const moved = c.move(e.body, e.velocity.x * rate / 60, e.velocity.y / 60); e.body = moved.body;
    if (moved.blockedX) e.velocity.x *= -1; if (moved.blockedY) e.velocity.y = 0;
    if (e.attackTicks >= Math.round(120 / rate) && ['projectile', 'armored', 'aerial'].includes(e.family)) {
      e.attackTicks = 0;
      if (Math.abs(e.body.x - c.player.position.x) > 48) view.projectiles.push({ id: `${e.id}:shot:${c.tick}`, body: { x: e.body.x, y: e.body.y, width: 6, height: 6 }, velocity: { x: Math.sign(c.player.position.x - e.body.x) * 100 * rate, y: 0 }, source: 'enemy', remainingTicks: 180 });
    }
  }
}
export function contactEnemies(c: Context, view: MechanicView, previousBottom: number, downward: boolean): boolean {
  let harm = false;
  for (const e of view.enemies) {
    if (!e.alive) continue;
    for (const o of view.objects) if (['kicked', 'thrown'].includes(o.mode) && overlaps(o.body, e.body)) strikeEnemy(c, e, o.descriptor.kind === 'shell' ? 'shell' : 'block');
    for (const shot of view.projectiles) if (shot.source === 'arthur' && shot.remainingTicks && overlaps(shot.body, e.body)) { const hit = strikeEnemy(c, e, 'projectile'); if (hit !== 'immune') shot.remainingTicks = 0; }
    const p = c.player; const mount = view.mounts.find(m => m.descriptor.id === c.run.mount?.id);
    const fenceAttack = p.mode === 'fence' && c.input.pressed.has('action') && e.side === p.fenceSide && overlaps({ ...p.body, x: p.body.x - 16, width: p.body.width + 32 }, e.body);
    const tongue = mount?.tongueTicks && overlaps({ ...p.body, x: p.facing === 1 ? p.body.x : p.body.x - 40, width: p.body.width + 40 }, e.body);
    if (fenceAttack) { strikeEnemy(c, e, 'fence'); continue; }
    if (tongue && strikeEnemy(c, e, 'tongue') !== 'immune') continue;
    if (p.mode === 'fence' && e.side !== p.fenceSide) continue;
    if (!e.alive || !overlaps(p.body, e.body)) continue;
    let attack: Attack | null = null;
    if (c.run.effects.invincibility) attack = 'invincibility';
    else if (view.flight === 'dive') attack = 'dive';
    else if (p.spinning) attack = 'spin';
    else if (p.crouching && Math.abs(p.velocity.x) > 30) attack = 'slide';
    else if (downward && previousBottom <= e.body.y + 6 && bottom(p.body) >= e.body.y) attack = 'stomp';
    const response = attack ? strikeEnemy(c, e, attack) : 'immune';
    if (response === 'immune') harm = true;
  }
  for (const shot of view.projectiles) if (shot.source === 'enemy' && shot.remainingTicks && overlaps(c.player.body, shot.body)) harm = true;
  return harm;
}
