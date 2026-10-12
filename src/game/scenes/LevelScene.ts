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
      if (e.kind.startsWith('platform:') || e.kind.includes(':') && !e.kind.startsWith('pipe:') || ['mount', 'berry', 'wings', 'boss'].includes(e.kind)) continue;
      g.fillStyle(e.kind === 'water' ? 0x476b80 : e.kind === 'fence' || e.kind === 'gate' ? 0x58684a : 0x9b805b, e.kind === 'water' ? 0.65 : 0.85);
      g.fillRect(e.position.x, e.position.y, Number(e.parameters['width'] ?? 16), Number(e.parameters['height'] ?? 16));
    }
    const rectangle = (body: { x: number; y: number; width: number; height: number }, color: number): void => { g.fillStyle(color); g.fillRect(body.x, body.y, body.width, body.height); };
    const mechanics = state.mechanics;
    if (mechanics) {
      for (const b of mechanics.blocks) if (b.solid && !b.rotationTicks) rectangle(b.body, b.consumed ? 0x655b48 : 0xb49a60);
      for (const o of mechanics.objects) if (o.mode !== 'consumed' && o.mode !== 'mouth') rectangle(o.body, o.descriptor.kind === 'shell' ? 0x667d57 : 0x9b805b);
      for (const m of mechanics.mounts) rectangle(m.body, m.descriptor.state === 'baby' ? 0x88a276 : 0x4f6e50);
      for (const e of mechanics.enemies) if (e.alive) rectangle(e.body, 0x975f50);
      for (const p of mechanics.projectiles) if (p.remainingTicks) rectangle(p.body, p.source === 'arthur' ? 0xe0ba72 : 0xab6c53);
      for (const b of mechanics.bosses) if (b.alive) { rectangle(b.body, 0x6a5262); for (const decoy of b.decoys) rectangle(decoy, 0x806878); }
      for (const coin of mechanics.temporaryCoins) rectangle(coin.body, 0xd0b371);
    }
    for (const power of state.pickups ?? []) rectangle(power.body, power.form === 'projectile' ? 0xba825e : power.form === 'gliding' ? 0xa29b79 : 0xc7b690);
    g.fillStyle(0xb49a60); for (const surface of state.surfaces) {
      const leftY = surfaceY(surface, surface.x); const rightY = surfaceY(surface, surface.x + surface.width);
      g.fillTriangle(surface.x, leftY, surface.x + surface.width, rightY, surface.x, leftY + surface.height);
      g.fillTriangle(surface.x + surface.width, rightY, surface.x + surface.width, rightY + surface.height, surface.x, leftY + surface.height);
    }
    const body = state.player.body; const protectedColor = state.run.effects.invincibility > 0 ? 0xc6c999 : state.run.form === 'projectile' ? 0xb88065 : state.run.form === 'gliding' ? 0x9c9a7c : 0xd8c6a0;
    g.fillStyle(state.player.mode === 'dying' ? 0x894f44 : protectedColor); g.fillRect(body.x, body.y, body.width, body.height);
    if (state.run.effects.float) { g.lineStyle(2, 0xb1bdac); g.strokeEllipse(body.x + body.width / 2, body.y + body.height / 2, body.width + 8, body.height + 8); }
    g.fillStyle(0x594d3b); g.fillRect(body.x + (state.player.facing === 1 ? 11 : 2), body.y + 4, 3, 3);
  }
}
