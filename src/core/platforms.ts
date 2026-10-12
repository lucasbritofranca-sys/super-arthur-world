import type { Rect, Vec2 } from './types';

export type PlatformKind = 'moving' | 'falling' | 'guided' | 'rotating' | 'balance' | 'crusher';
export interface PlatformDefinition extends Rect {
  id: string; kind: PlatformKind; period: number; path: Vec2[]; radius: number; tilt: number;
}
export interface DynamicSurface extends Rect { id: string; previous: Rect; tilt: number; previousTilt: number }
export function surfaceY(surface: DynamicSurface, x: number, previous = false): number {
  const shape = previous ? surface.previous : surface;
  return shape.y + (x - (shape.x + shape.width / 2)) * (previous ? surface.previousTilt : surface.tilt);
}
export function surfaceFloor(surface: DynamicSurface, body: Rect, previous = false): number {
  const rect = previous ? surface.previous : surface;
  const leftFoot = Math.max(rect.x, Math.min(rect.x + rect.width, body.x + 0.01));
  const rightFoot = Math.max(rect.x, Math.min(rect.x + rect.width, body.x + body.width - 0.01));
  return Math.min(surfaceY(surface, leftFoot, previous), surfaceY(surface, rightFoot, previous));
}
function alongPath(path: readonly Vec2[], tick: number, period: number): Vec2 {
  if (path.length === 1) return { ...path[0]! };
  const phase = ((tick % period) / period) * (path.length - 1) * 2;
  const progress = phase <= path.length - 1 ? phase : (path.length - 1) * 2 - phase;
  const i = Math.min(path.length - 2, Math.floor(progress)); const t = progress - i;
  const a = path[i]!; const b = path[i + 1]!;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}
export class PlatformSystem {
  private fallTicks = new Map<string, number>();
  surfaces: DynamicSurface[];
  constructor(readonly definitions: readonly PlatformDefinition[]) {
    this.surfaces = definitions.map(d => ({ ...d, previous: { x: d.x, y: d.y, width: d.width, height: d.height }, previousTilt: 0, tilt: 0 }));
  }
  step(tick: number, supportId: string | null): void {
    for (let i = 0; i < this.definitions.length; i++) {
      const d = this.definitions[i]!; const s = this.surfaces[i]!;
      s.previous = { x: s.x, y: s.y, width: s.width, height: s.height }; s.previousTilt = s.tilt;
      if (d.kind === 'falling') {
        if (supportId === d.id || this.fallTicks.has(d.id)) this.fallTicks.set(d.id, (this.fallTicks.get(d.id) ?? 0) + 1);
        const t = (this.fallTicks.get(d.id) ?? 0) / 60;
        s.y = d.y + Math.min(d.path[0]?.y ?? 96, 180 * t * t); s.x = d.x;
      } else if (d.kind === 'rotating') {
        const angle = tick * Math.PI * 2 / d.period;
        s.x = d.x + Math.cos(angle) * d.radius; s.y = d.y + Math.sin(angle) * d.radius;
      } else if (d.kind === 'balance') {
        s.tilt = Math.sin(tick * Math.PI * 2 / d.period) * d.tilt;
      } else {
        const offset = alongPath(d.path, tick, d.period); s.x = d.x + offset.x; s.y = d.y + offset.y;
      }
    }
  }
}
