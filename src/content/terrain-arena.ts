import type { LevelDefinition } from '../core/types';
/** Original small mechanics arena, not one of the final campaign's 120 levels. */
export const terrainArena: LevelDefinition = {
  id: 'arena.terrain', worldId: 'arena', contentVersion: 'arena-v1', geometryHash: 'terrain-arena-v1', designNote: 'Terrain gate: slopes, water, fence, platforms and paired subareas.', baselineTimer: 300, exits: [], checkpoints: [], medallions: [], families: ['M-01', 'M-02', 'M-03', 'M-04', 'M-05', 'M-11'],
  subareas: [{ id: 'outdoors', bounds: { x: 0, y: 0, width: 1600, height: 320 }, camera: { x: 0, y: 0, width: 1600, height: 320 }, spawn: { x: 48, y: 192 }, allowMount: true,
    terrain: [
      { id: 'floor-a', x: 0, y: 192, width: 224, height: 128, shape: 'solid', rise: 0, direction: 1 },
      { id: 'slope-up', x: 224, y: 144, width: 96, height: 48, shape: 'slope', rise: 48, direction: 1 },
      { id: 'ridge', x: 320, y: 144, width: 112, height: 176, shape: 'solid', rise: 0, direction: 1 },
      { id: 'slope-down', x: 432, y: 144, width: 96, height: 48, shape: 'slope', rise: 48, direction: -1 },
      { id: 'pool-floor', x: 528, y: 240, width: 240, height: 80, shape: 'solid', rise: 0, direction: 1 },
      { id: 'shore', x: 768, y: 192, width: 208, height: 128, shape: 'solid', rise: 0, direction: 1 },
      { id: 'one-way', x: 816, y: 120, width: 96, height: 8, shape: 'oneWay', rise: 0, direction: 1 },
      { id: 'last-floor', x: 1184, y: 192, width: 416, height: 128, shape: 'solid', rise: 0, direction: 1 },
      { id: 'triangle', x: 1400, y: 80, width: 16, height: 112, shape: 'verticalRun', rise: 0, direction: 1 },
    ], entities: [
      { id: 'pool', kind: 'water', position: { x: 528, y: 144 }, parameters: { width: 240, height: 96 } },
      { id: 'fence', kind: 'fence', position: { x: 790, y: 64 }, parameters: { width: 128, height: 128 } },
      { id: 'gate', kind: 'gate', position: { x: 834, y: 100 }, parameters: { width: 32, height: 32 } },
      { id: 'guided', kind: 'platform:guided', position: { x: 976, y: 192 }, parameters: { width: 64, height: 8, path: '0,0;96,-48;208,0', period: 300 } },
      { id: 'pipe', kind: 'pipe', position: { x: 1500, y: 160 }, parameters: { width: 32, height: 32, destination: 'cave', anchorX: 48, anchorY: 160, direction: 'down', carry: true } },
    ] }, { id: 'cave', bounds: { x: 0, y: 0, width: 640, height: 216 }, camera: { x: 0, y: 0, width: 640, height: 216 }, spawn: { x: 48, y: 160 }, allowMount: false,
    terrain: [{ id: 'cave-floor', x: 0, y: 160, width: 640, height: 56, shape: 'solid', rise: 0, direction: 1 }], entities: [{ id: 'return', kind: 'pipe', position: { x: 560, y: 128 }, parameters: { width: 32, height: 32, destination: 'outdoors', anchorX: 1536, anchorY: 192, direction: 'down', carry: true } }] }],
};
