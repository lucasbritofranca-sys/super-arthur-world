import type { Rect, TerrainDefinition, Vec2 } from './types';
import { EPSILON, TerrainIndex, bottom, floorY, horizontalOverlap, overlaps, right } from './geometry';
import type { DynamicSurface } from './platforms';
import { surfaceFloor } from './platforms';

export interface Contact { id: string; normal: Vec2 }
export interface CollisionResult { body: Rect; support: Contact | null; blockedX: boolean; blockedY: boolean; crushed: boolean }
export class CollisionSolver {
  readonly index: TerrainIndex;
  constructor(readonly terrain: readonly TerrainDefinition[]) { this.index = new TerrainIndex(terrain); }
  move(initial: Rect, dx: number, dy: number, surfaces: readonly DynamicSurface[], snap = false, excludedId: string | null = null): CollisionResult {
    if (![initial.x, initial.y, dx, dy].every(Number.isFinite) || Math.max(Math.abs(dx), Math.abs(dy)) > 64) throw new RangeError('displacement_budget');
    const body = { ...initial }; let blockedX = false; let blockedY = false; let support: Contact | null = null;
    const dynamic = surfaces.filter(s => s.id !== excludedId).sort((a, b) => a.id.localeCompare(b.id));
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 4));
    for (let step = 0; step < steps; step++) {
      support = null;
      const previous = { ...body }; body.x += dx / steps;
      const tiles = this.index.query({ x: Math.min(previous.x, body.x) - 4, y: body.y - 4, width: body.width + Math.abs(dx / steps) + 8, height: body.height + 8 });
      const boxes = [...tiles.filter(t => t.shape === 'solid' || t.shape === 'verticalRun'), ...dynamic.filter(s => !s.tilt)];
      for (const tile of tiles.filter(t => t.shape === 'slope')) {
        const highX = tile.direction === 1 ? right(tile) : tile.x;
        const highY = tile.y + tile.height - tile.rise;
        if (bottom(body) > highY + EPSILON && body.y < bottom(tile)) {
          if (tile.direction === 1 && dx < 0 && previous.x >= highX - EPSILON && body.x < highX) { body.x = highX; blockedX = true; }
          if (tile.direction === -1 && dx > 0 && right(previous) <= highX + EPSILON && right(body) > highX) { body.x = highX - body.width; blockedX = true; }
        }
      }
      for (const tile of boxes) if (overlaps(body, tile)) {
        // A support at the actor's foot is not a side wall.
        if (bottom(previous) <= tile.y + EPSILON) continue;
        if (dx > 0 && right(previous) <= tile.x + EPSILON) { body.x = tile.x - body.width; blockedX = true; }
        else if (dx < 0 && previous.x >= right(tile) - EPSILON) { body.x = right(tile); blockedX = true; }
      }
      const beforeY = { ...body }; body.y += dy / steps;
      const candidates = this.index.query({ x: body.x, y: Math.min(beforeY.y, body.y) - 4, width: body.width, height: body.height + Math.abs(dy / steps) + 8 });
      const floors: { id: string; y: number; slope: boolean; bottom: number; oneWay: boolean }[] = candidates.map(t => ({ id: t.id, y: floorY(t, body), slope: t.shape === 'slope', bottom: bottom(t), oneWay: t.shape === 'oneWay' }));
      for (const s of dynamic) if (horizontalOverlap(body, s)) floors.push({ id: s.id, y: surfaceFloor(s, body), slope: s.tilt !== 0, bottom: bottom(s), oneWay: false });
      const overlapping = new Set(candidates.filter(t => horizontalOverlap(body, t)).map(t => t.id));
      for (const s of dynamic) if (horizontalOverlap(body, s)) overlapping.add(s.id);
      floors.sort((a, b) => a.y - b.y || a.id.localeCompare(b.id));
      for (const tile of floors) {
        if (!overlapping.has(tile.id)) continue;
        const prevBottom = bottom(beforeY); const newBottom = bottom(body);
        const canSnap = snap && dy >= 0 && Math.abs(prevBottom - tile.y) <= 4 + EPSILON;
        if (dy >= 0 && (prevBottom <= tile.y + EPSILON || (tile.slope && canSnap)) && newBottom >= tile.y - EPSILON || canSnap) {
          body.y = tile.y - body.height; blockedY = true; support = { id: tile.id, normal: { x: 0, y: -1 } }; break;
        }
        if (!tile.oneWay && dy < 0 && beforeY.y >= tile.bottom - EPSILON && body.y < tile.bottom && newBottom > tile.y) {
          body.y = tile.bottom; blockedY = true;
        }
      }
    }
    // Probe a tiny downward displacement only to retain a genuine touching support.
    if (!support && dy >= 0) {
      const tiles = this.index.query({ ...body, height: body.height + EPSILON * 2 });
      for (const tile of tiles) if (horizontalOverlap(body, tile) && Math.abs(bottom(body) - floorY(tile, body)) <= EPSILON) {
        support = { id: tile.id, normal: { x: 0, y: -1 } }; break;
      }
      for (const s of dynamic) if (!support && horizontalOverlap(body, s) && Math.abs(bottom(body) - surfaceFloor(s, body)) <= EPSILON) support = { id: s.id, normal: { x: 0, y: -1 } };
    }
    const embedded = this.index.query(body).some(t => t.shape !== 'oneWay' && overlaps(body, t) && (t.shape !== 'slope' || bottom(body) > floorY(t, body) + EPSILON));
    return { body, support, blockedX, blockedY, crushed: embedded || dynamic.some(s => !s.tilt && overlaps(body, s)) };
  }
}
