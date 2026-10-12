import type { LevelDefinition, ValidationIssue } from '../types';
import { ENEMY_FAMILIES } from './vulnerability';
import { BOSS_METHODS } from './bosses';
export function validateMechanics(level: LevelDefinition): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const area of level.subareas) for (const e of area.entities) {
    const subtype = e.kind.split(':')[1] ?? ''; const p = e.parameters;
    const reject = (field: string, code: string): void => { issues.push({ path: `entities.${e.id}.${field}`, code }); };
    for (const dimension of ['width', 'height']) if (p[dimension] !== undefined && (typeof p[dimension] !== 'number' || !Number.isFinite(p[dimension]) || p[dimension] <= 0)) reject(dimension, 'invalid_dimension');
    if (e.kind === 'object:shell' && p['variant'] !== undefined && !['green', 'red', 'blue', 'yellow'].includes(String(p['variant']))) reject('variant', 'unknown_color');
    if (e.kind.startsWith('enemy:') && !ENEMY_FAMILIES.includes(subtype as typeof ENEMY_FAMILIES[number])) reject('kind', 'unknown_enemy');
    if (e.kind.startsWith('object:') && !['shell', 'key', 'spring', 'block', 'timed'].includes(subtype)) reject('kind', 'unknown_object');
    if (e.kind.startsWith('block:') && !['reward', 'hidden', 'bounce', 'rotating', 'grab', 'message', 'bonus', 'spin-break'].includes(subtype)) reject('kind', 'unknown_block');
    if (e.kind.startsWith('power:') && !['large', 'projectile', 'gliding', 'invincibility', 'float'].includes(subtype)) reject('kind', 'unknown_power');
    if (e.kind === 'boss') {
      if (!Number.isSafeInteger(p['controller']) || Number(p['controller']) < 1 || Number(p['controller']) > BOSS_METHODS.length) reject('controller', 'unknown_boss');
      if (p['exitId'] && !level.exits.some(x => x.id === p['exitId'])) reject('exitId', 'dangling_destination');
      if (p['replenisher'] && !area.entities.some(x => x.id === p['replenisher'] && x.kind === 'dispenser')) reject('replenisher', 'missing_recovery_route');
      if (BOSS_METHODS[Number(p['controller']) - 1]?.includes('throwable')) {
        const dispenser = area.entities.find(x => x.id === p['replenisher'] && x.kind === 'dispenser');
        if (!dispenser) reject('replenisher', 'missing_recovery_route');
        else if (dispenser.parameters['objectKind'] !== 'block') reject('replenisher', 'incompatible_ammunition');
      }
    }
    if (e.kind === 'mount' && p['color'] !== undefined && !['green', 'red', 'blue', 'yellow'].includes(String(p['color']))) reject('color', 'unknown_color');
    for (const key of ['duration', 'range']) if (p[key] !== undefined && (!Number.isSafeInteger(p[key]) || Number(p[key]) <= 0 || Number(p[key]) > 216000)) reject(key, 'range');
    if (p['speed'] !== undefined && (!Number.isFinite(p['speed']) || Math.abs(Number(p['speed'])) > 3840)) reject('speed', 'displacement_budget');
    if (e.kind === 'dispenser' && (typeof p['objectId'] !== 'string' || !p['objectId'] || !['shell', 'key', 'spring', 'block', 'timed'].includes(String(p['objectKind'] ?? 'key')))) reject('objectId', 'invalid_dispenser');
    if (e.kind === 'wings' && !level.subareas.some(x => x.id === p['destination'])) reject('destination', 'dangling_destination');
    if (e.kind === 'sanctuary' && !['green', 'red', 'blue', 'yellow'].includes(String(p['color']))) reject('color', 'unknown_color');
    if (p['switchId'] && !area.entities.some(x => x.id === p['switchId'] && x.kind === 'switch')) reject('switchId', 'dangling_destination');
  }
  return issues;
}
