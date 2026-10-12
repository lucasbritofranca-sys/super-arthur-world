import Phaser from 'phaser';
import type { ActionFrame, LevelDefinition } from '../../core/types';
import type { TerrainSimulation } from '../../core/movement';
import { slopeY } from '../../core/geometry';
import { cameraPosition } from '../camera';
import { surfaceY } from '../../core/platforms';

export class LevelScene extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics;
  constructor(private simulation: () => TerrainSimulation, private level: () => LevelDefinition, private updateApp: (delta: number) => void, private frame: () => ActionFrame) { super('terrain'); }
  create(): void { this.graphics = this.add.graphics(); }
  update(_time: number, delta: number): void {
    this.updateApp(delta);
    const state = this.simulation().view(); const area = this.level().subareas.find(a => a.id === state.subareaId)!;
    const view = cameraPosition(state.player.position, area.camera, this.frame().held.has('up') ? 64 * state.player.facing : 0);
    this.cameras.main.setScroll(view.x, view.y);
    const g = this.graphics; g.clear(); g.fillStyle(0x273b31); g.fillRect(area.bounds.x, area.bounds.y, area.bounds.width, area.bounds.height);
    for (const tile of area.terrain) {
      g.fillStyle(tile.shape === 'oneWay' ? 0x809786 : tile.shape === 'verticalRun' ? 0xb49a60 : 0x786d54);
      if (tile.shape === 'slope') g.fillTriangle(tile.x, slopeY(tile, tile.x), tile.x + tile.width, slopeY(tile, tile.x + tile.width), tile.direction === 1 ? tile.x + tile.width : tile.x, tile.y + tile.height);
      else g.fillRect(tile.x, tile.y, tile.width, tile.height);
    }
    for (const e of area.entities) {
      if (e.kind.startsWith('platform:')) continue;
      g.fillStyle(e.kind === 'water' ? 0x476b80 : e.kind === 'fence' || e.kind === 'gate' ? 0x58684a : 0x9b805b, e.kind === 'water' ? 0.65 : 0.85);
      g.fillRect(e.position.x, e.position.y, Number(e.parameters['width'] ?? 16), Number(e.parameters['height'] ?? 16));
    }
    g.fillStyle(0xb49a60); for (const surface of state.surfaces) {
      const leftY = surfaceY(surface, surface.x); const rightY = surfaceY(surface, surface.x + surface.width);
      g.fillTriangle(surface.x, leftY, surface.x + surface.width, rightY, surface.x, leftY + surface.height);
      g.fillTriangle(surface.x + surface.width, rightY, surface.x + surface.width, rightY + surface.height, surface.x, leftY + surface.height);
    }
    const body = state.player.body; g.fillStyle(state.player.mode === 'dying' ? 0x894f44 : 0xd8c6a0); g.fillRect(body.x, body.y, body.width, body.height);
    g.fillStyle(0x594d3b); g.fillRect(body.x + (state.player.facing === 1 ? 11 : 2), body.y + 4, 3, 3);
  }
}
