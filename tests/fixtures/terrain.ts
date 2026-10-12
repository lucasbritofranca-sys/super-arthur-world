import type { EntityDefinition, LevelDefinition, TerrainDefinition } from '../../src/core/types';
export function solid(id: string, x: number, y: number, width: number, height = 16): TerrainDefinition { return { id, x, y, width, height, shape: 'solid', rise: 0, direction: 1 }; }
export function terrainLevel(terrain: TerrainDefinition[] = [solid('floor', 0, 160, 640)], entities: EntityDefinition[] = []): LevelDefinition {
  return { id: 'main01.level01', worldId: 'main01', contentVersion: 'terrain-test-v1', geometryHash: 'fixture', designNote: 'Actual terrain fixture.', baselineTimer: 300, medallions: [], families: [], checkpoints: [], exits: [], subareas: [{ id: 'main', bounds: { x: 0, y: 0, width: 640, height: 480 }, camera: { x: 0, y: 0, width: 640, height: 480 }, spawn: { x: 48, y: 160 }, terrain, entities, allowMount: true }] };
}
export function platformEntity(kind: string, parameters: Record<string, string | number | boolean> = {}): EntityDefinition {
  return { id: 'platform', kind: `platform:${kind}`, position: { x: 80, y: 100 }, parameters: { width: 64, height: 8, period: 120, path: '0,0;32,0', ...parameters } };
}
