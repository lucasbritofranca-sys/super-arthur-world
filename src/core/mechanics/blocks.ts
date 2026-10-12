import type { BlockActor, Context } from './model';
import type { TerrainDefinition } from '../types';
import { overlaps, bottom, horizontalOverlap } from '../geometry';
export function blockTerrain(blocks: readonly BlockActor[]): TerrainDefinition[] {
  return blocks.filter(b => b.solid && b.rotationTicks === 0).map(b => ({ ...b.body, id: b.id, shape: 'solid', rise: 0, direction: 1 }));
}
export function hitBlock(c: Context, block: BlockActor, action: 'head' | 'spin' | 'grab' | 'bounce'): void {
  if (block.consumed) return;
  switch (block.family) {
    case 'rotating': block.rotationTicks = 60; break;
    case 'bounce': if (action === 'bounce') c.player.velocity.y = -360; break;
    case 'spin-break': if (action === 'spin' && c.run.form !== 'small') { block.solid = false; block.consumed = true; } break;
    case 'message': if (action === 'head') c.emit({ kind: 'message', eventId: c.event(`message:${block.id}`), tick: c.tick, entityId: block.id, text: block.message }); break;
    case 'grab': if (action === 'grab') { block.solid = false; block.consumed = true; } break;
    default:
      if (action !== 'head' && action !== 'spin') break;
      block.consumed = true; block.solid = true;
      c.emit({ kind: 'reward', eventId: c.event(`reward:${block.id}`), tick: c.tick, entityId: block.id, reward: block.reward, amount: block.family === 'bonus' ? 3 : 1 });
  }
}
export function blockContacts(c: Context, blocks: BlockActor[], previous: { y: number; bottom: number; vy: number }): void {
  for (const b of blocks) {
    if (b.rotationTicks) { if (--b.rotationTicks === 0 && overlaps(c.player.body, b.body)) b.rotationTicks = 1; }
    if (b.family === 'grab' && c.input.pressed.has('action') && overlaps({ ...c.player.body, x: c.player.body.x - 16, width: c.player.body.width + 32 }, b.body)) hitBlock(c, b, 'grab');
    if (!horizontalOverlap(c.player.body, b.body)) continue;
    if (previous.vy < 0 && previous.y >= bottom(b.body) - 0.01 && c.player.body.y <= bottom(b.body) + 0.01) {
      if (b.family === 'hidden' && !b.solid) { c.player.body.y = bottom(b.body); c.player.velocity.y = 0; }
      hitBlock(c, b, 'head');
    }
    if (previous.vy > 0 && previous.bottom <= b.body.y + 1 && bottom(c.player.body) >= b.body.y - 1) hitBlock(c, b, c.player.spinning ? 'spin' : 'bounce');
  }
}
export function activateBlock(c: Context, b: BlockActor): boolean {
  return activateBlocks(c, [b]);
}
export function activateBlocks(c: Context, blocks: readonly BlockActor[]): boolean {
  const occupying = blocks.filter(b => overlaps(c.player.body, b.body));
  if (occupying.length) {
    const choices = occupying.flatMap(b => [{ ...c.player.body, y: b.body.y - c.player.body.height }, { ...c.player.body, x: b.body.x - c.player.body.width }, { ...c.player.body, x: b.body.x + b.body.width }]);
    const safe = choices.find(body => {
      if (blocks.some(b => overlaps(body, b.body)) || !c.clear(body)) return false;
      const moved = c.move(c.player.body, body.x - c.player.body.x, body.y - c.player.body.y);
      return !moved.crushed && Math.abs(moved.body.x - body.x) < 0.01 && Math.abs(moved.body.y - body.y) < 0.01;
    });
    if (!safe) return false;
    c.player.body = safe;
  }
  for (const b of blocks) b.solid = true;
  return true;
}
