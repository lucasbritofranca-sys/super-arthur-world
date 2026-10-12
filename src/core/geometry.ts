import type { Rect, TerrainDefinition } from './types';

export const EPSILON = 0.01;
export const TILE_SIZE = 16;
export const right = (r: Rect): number => r.x + r.width;
export const bottom = (r: Rect): number => r.y + r.height;
export function overlaps(a: Rect, b: Rect): boolean {
  return a.x < right(b) - EPSILON && right(a) > b.x + EPSILON && a.y < bottom(b) - EPSILON && bottom(a) > b.y + EPSILON;
}
export function horizontalOverlap(a: Rect, b: Rect): boolean { return a.x < right(b) - EPSILON && right(a) > b.x + EPSILON; }
export function slopeY(tile: TerrainDefinition, x: number): number {
  const t = Math.max(0, Math.min(1, (x - tile.x) / tile.width));
  return tile.y + tile.height - tile.rise * (tile.direction === 1 ? t : 1 - t);
}
export function floorY(tile: TerrainDefinition, body: Rect): number {
  if (tile.shape !== 'slope') return tile.y;
  return Math.min(slopeY(tile, Math.max(tile.x, body.x + EPSILON)), slopeY(tile, Math.min(right(tile), right(body) - EPSILON)));
}
/** Static broad phase. Large rectangles occupy each covered tile cell. */
export class TerrainIndex {
  private cells = new Map<string, TerrainDefinition[]>();
  constructor(terrain: readonly TerrainDefinition[]) {
    for (const tile of terrain) this.eachCell(tile, key => {
      const cell = this.cells.get(key) ?? []; cell.push(tile); this.cells.set(key, cell);
    });
  }
  private eachCell(r: Rect, visit: (key: string) => void): void {
    for (let y = Math.floor(r.y / TILE_SIZE); y <= Math.floor(bottom(r) / TILE_SIZE); y++)
      for (let x = Math.floor(r.x / TILE_SIZE); x <= Math.floor(right(r) / TILE_SIZE); x++) visit(`${x},${y}`);
  }
  query(body: Rect): TerrainDefinition[] {
    const found = new Map<string, TerrainDefinition>();
    this.eachCell(body, key => { for (const tile of this.cells.get(key) ?? []) found.set(tile.id, tile); });
    return [...found.values()].sort((a, b) => a.id.localeCompare(b.id));
  }
}
