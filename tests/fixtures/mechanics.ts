import { CollisionSolver } from '../../src/core/collision';
import { MechanicsWorld } from '../../src/core/mechanics/world';
import type { Context } from '../../src/core/mechanics/model';
import type { TerrainPlayer } from '../../src/core/movement';
import type { DomainEvent } from '../../src/core/events';
import type { EntityDefinition, RunState, TerrainDefinition } from '../../src/core/types';
import { actionFrame } from './foundation';
import { terrainLevel } from './terrain';

export const mechanicEntity = (id: string, kind: string, x = 40, y = 144, parameters: EntityDefinition['parameters'] = {}): EntityDefinition => ({ id, kind, position: { x, y }, parameters });
export const mechanicRun = (overrides: Partial<RunState> = {}): RunState => ({ coins: 0, bonusStars: 0, score: 0, form: 'small', reserve: null, carried: null, mount: null, effects: { invincibility: 0, float: 0, mountShell: 0 }, ...overrides });

/** Real mechanic systems with their actual collision authority, without renderer or storage adapters. */
export function mechanicHarness(entities: EntityDefinition[] = [], run = mechanicRun(), terrain: TerrainDefinition[] = []) {
  const area = terrainLevel(terrain, entities).subareas[0]!;
  const world = new MechanicsWorld(area, run);
  const events: DomainEvent[] = [];
  const player: TerrainPlayer = { id: 'arthur', position: { x: 48, y: 160 }, velocity: { x: 0, y: 0 }, body: { x: 40, y: 144, width: 16, height: 16 }, hurt: { x: 40, y: 144, width: 16, height: 16 }, attack: null, mode: 'air', grounded: false, supportId: null, facing: 1, form: run.form, climbTarget: null, fenceSide: 'front', gateTicks: 0, verticalRun: null, crouching: false, spinning: false, carried: run.carried };
  const solver = new CollisionSolver(terrain);
  const context: Context = { player, run, tick: 1, difficulty: 'classic', input: actionFrame(), move: (body, dx, dy) => solver.move(body, dx, dy, []), clear: body => !solver.move(body, 0, 0, []).crushed, event: kind => `event:${kind}:1`, terrain, surfaces: [], emit: event => events.push(event) };
  return { area, world, context, player, run, events, solver };
}
