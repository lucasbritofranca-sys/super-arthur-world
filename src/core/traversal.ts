import type { EntityDefinition, LevelDefinition, Rect, ValidationResult, ValidationIssue, Vec2 } from './types';
import { validateLevel } from './schema';
import type { PlatformDefinition, PlatformKind } from './platforms';
import { PlatformSystem } from './platforms';
import { CollisionSolver } from './collision';

export function safeAnchor(area: LevelDefinition['subareas'][number], anchor: Vec2): boolean {
  const body = { x: anchor.x - 8, y: anchor.y - 16, width: 16, height: 16 };
  if (![anchor.x, anchor.y].every(Number.isFinite) || body.x < area.bounds.x || body.y < area.bounds.y || body.x + 16 > area.bounds.x + area.bounds.width || anchor.y > area.bounds.y + area.bounds.height) return false;
  const surfaces = new PlatformSystem(area.entities.filter(e => e.kind.startsWith('platform:')).map(platform)); surfaces.step(0, null);
  return !new CollisionSolver(area.terrain).move(body, 0, 0, surfaces.surfaces).crushed;
}

export interface Region extends Rect { id: string; kind: 'water' | 'vine' | 'rope' | 'fence' | 'gate' | 'ice' | 'conveyor' | 'lava'; speed: number }
export interface Transfer extends Rect { id: string; destination: string; anchor: Vec2; direction: string; carry: boolean }
export function entityRect(entity: EntityDefinition): Rect {
  return { ...entity.position, width: Number(entity.parameters['width'] ?? 16), height: Number(entity.parameters['height'] ?? 16) };
}
export function region(entity: EntityDefinition): Region {
  return { ...entityRect(entity), id: entity.id, kind: entity.kind as Region['kind'], speed: Number(entity.parameters['speed'] ?? 40) };
}
export function transfer(entity: EntityDefinition): Transfer {
  return { ...entityRect(entity), id: entity.id, destination: String(entity.parameters['destination']), anchor: { x: Number(entity.parameters['anchorX']), y: Number(entity.parameters['anchorY']) }, direction: String(entity.parameters['direction'] ?? 'down'), carry: entity.parameters['carry'] !== false };
}
export function platform(entity: EntityDefinition): PlatformDefinition {
  const path = String(entity.parameters['path'] ?? '0,0;64,0').split(';').map(p => { const [x, y] = p.split(',').map(Number); return { x: x ?? NaN, y: y ?? NaN }; });
  return { ...entityRect(entity), id: entity.id, kind: entity.kind.slice(9) as PlatformKind, period: Number(entity.parameters['period'] ?? 240), path, radius: Number(entity.parameters['radius'] ?? 32), tilt: Number(entity.parameters['tilt'] ?? 0.25) };
}
export function validateTerrainLevel(value: unknown): ValidationResult<LevelDefinition> {
  const base = validateLevel(value); if (!base.ok) return base;
  const issues: ValidationIssue[] = []; const level = base.value; const areas = new Map(level.subareas.map(a => [a.id, a]));
  const ids = new Set<string>(); const reject = (path: string, code: string): void => { issues.push({ path, code }); };
  for (const area of level.subareas) {
    if (!safeAnchor(area, area.spawn)) reject(`subareas.${area.id}.spawn`, 'unsafe_spawn');
    if (ids.has(area.id)) reject(`subareas.${area.id}`, 'duplicate_id'); ids.add(area.id);
    if (area.camera.x < area.bounds.x || area.camera.y < area.bounds.y || area.camera.x + area.camera.width > area.bounds.x + area.bounds.width || area.camera.y + area.camera.height > area.bounds.y + area.bounds.height) reject(`subareas.${area.id}.camera`, 'invalid_camera');
    for (const tile of area.terrain) {
      if (ids.has(tile.id)) reject(`terrain.${tile.id}`, 'duplicate_id'); ids.add(tile.id);
      if (tile.shape === 'slope' && (![0.5, 1].includes(tile.rise / tile.width) || tile.rise > tile.height)) reject(`terrain.${tile.id}.rise`, 'unsupported_slope');
    }
    for (const entity of area.entities) {
      if (ids.has(entity.id)) reject(`entities.${entity.id}`, 'duplicate_id'); ids.add(entity.id);
      const rect = entityRect(entity);
      if (![rect.width, rect.height].every(n => Number.isFinite(n) && n > 0)) reject(`entities.${entity.id}.size`, 'invalid_geometry');
      if (entity.kind === 'pipe' || entity.kind === 'door') {
        const t = transfer(entity); const destination = areas.get(t.destination);
        if (!destination) reject(`entities.${entity.id}.destination`, 'dangling_destination');
        else if (!safeAnchor(destination, t.anchor)) reject(`entities.${entity.id}.anchor`, 'unsafe_spawn');
        if (!['left', 'right', 'up', 'down'].includes(t.direction)) reject(`entities.${entity.id}.direction`, 'invalid_direction');
      }
      if (entity.kind.startsWith('platform:')) {
        const p = platform(entity);
        if (!['moving', 'falling', 'guided', 'rotating', 'balance', 'crusher'].includes(p.kind) || !Number.isSafeInteger(p.period) || p.period < 60 || !p.path.length || p.path.some(v => ![v.x, v.y].every(Number.isFinite)) || !Number.isFinite(p.radius) || p.radius < 0 || !Number.isFinite(p.tilt) || Math.abs(p.tilt) > 0.5) reject(`entities.${entity.id}.platform`, 'invalid_platform');
        const speed = p.kind === 'rotating' ? p.radius * Math.PI * 2 / p.period : p.kind === 'falling' ? 2 * Math.sqrt(180 * Math.abs(p.path[0]?.y ?? 96)) / 60 : p.kind === 'balance' ? p.width * Math.abs(p.tilt) * Math.PI / p.period : Math.max(0, ...p.path.slice(1).map((v, index) => Math.max(Math.abs(v.x - p.path[index]!.x), Math.abs(v.y - p.path[index]!.y)) * (p.path.length - 1) * 2 / p.period));
        if (speed > 64) reject(`entities.${entity.id}.platform`, 'displacement_budget');
      }
    }
  }
  return issues.length ? { ok: false, issues } : base;
}
