import type { LevelDefinition, EntityDefinition } from '../core/types';
const entity = (id: string, kind: string, x: number, y: number, parameters: EntityDefinition['parameters'] = {}): EntityDefinition => ({ id, kind, position: { x, y }, parameters });
/** Original verification arena; not a substitute for the authored campaign. */
export const mechanicsArena: LevelDefinition = {
  id: 'arena.mechanics', worldId: 'arena', contentVersion: 'arena-v1', geometryHash: 'mechanics-arena-v1', designNote: 'Keyboard/touch power, reserve, mount and object verification.', baselineTimer: 300,
  medallions: [], checkpoints: [], exits: [], families: ['M-06', 'M-07', 'M-08', 'M-09', 'M-10', 'M-12'],
  subareas: [{ id: 'main', bounds: { x: 0, y: 0, width: 1600, height: 320 }, camera: { x: 0, y: 0, width: 1600, height: 320 }, spawn: { x: 48, y: 192 }, allowMount: true,
    terrain: [{ id: 'floor', x: 0, y: 192, width: 1600, height: 128, shape: 'solid', rise: 0, direction: 1 }],
    entities: [entity('mushroom', 'power:large', 96, 176), entity('flower', 'power:projectile', 160, 176), entity('reserve', 'power:large', 224, 176), entity('spring', 'object:spring', 288, 176), entity('block', 'block:reward', 352, 112), entity('mount', 'mount', 448, 176), entity('red-shell', 'object:shell', 512, 176, { variant: 'red' }), entity('invincible', 'power:invincibility', 624, 176), entity('patrol', 'enemy:patrol', 704, 176), entity('cape', 'power:gliding', 816, 176), entity('float', 'power:float', 1200, 160)],
  }],
};
