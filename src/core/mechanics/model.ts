import type { Rect, Vec2, CarriedDescriptor, MountDescriptor, ActionFrame, RunState, Difficulty, TerrainDefinition } from '../types';
import type { TerrainPlayer } from '../movement';
import type { DomainEvent } from '../events';
import type { DynamicSurface } from '../platforms';
export type Attack = 'stomp' | 'spin' | 'projectile' | 'shell' | 'slide' | 'block' | 'tongue' | 'invincibility' | 'dive' | 'fence';
export type EnemyFamily = 'patrol' | 'aerial' | 'aquatic' | 'projectile' | 'armored' | 'pursuit' | 'gaze' | 'regeneration';
export type ObjectMode = 'world' | 'carried' | 'mouth' | 'tongue' | 'kicked' | 'thrown' | 'consumed';
export interface ObjectActor { descriptor: CarriedDescriptor; body: Rect; velocity: Vec2; mode: ObjectMode; owner: string | null; remainingTicks: number; dispenser: string | null }
export interface MountActor { descriptor: MountDescriptor; body: Rect; velocity: Vec2; tongueTicks: number; shellTicks: number; fleeDirection: -1 | 1 }
export interface EnemyActor { id: string; family: EnemyFamily; body: Rect; velocity: Vec2; home: Vec2; side: 'front' | 'back'; alive: boolean; respawnTicks: number; phase: number; attackTicks: number }
export interface ProjectileActor { id: string; body: Rect; velocity: Vec2; source: 'arthur' | 'enemy'; remainingTicks: number }
export type BlockFamily = 'reward' | 'hidden' | 'bounce' | 'rotating' | 'grab' | 'message' | 'bonus' | 'spin-break';
export interface BlockActor { id: string; family: BlockFamily; body: Rect; consumed: boolean; solid: boolean; rotationTicks: number; reward: 'coin' | 'life' | 'score'; message: string; switchId: string | null }
export type BossMethod = 'tilted' | 'underside' | 'decoy' | 'ceiling' | 'throwable' | 'rotating';
export interface BossActor { id: string; controller: number; body: Rect; home: Vec2; hits: number; phase: number; hitCooldown: number; alive: boolean; attackTicks: number; exitId: string; replenisher: string | null; decoys: Rect[] }
export interface MechanicView { objects: ObjectActor[]; mounts: MountActor[]; enemies: EnemyActor[]; projectiles: ProjectileActor[]; blocks: BlockActor[]; bosses: BossActor[]; temporaryCoins: { id: string; body: Rect }[]; protectionTicks: number; flight: 'none' | 'climb' | 'glide' | 'dive' | 'recovery'; chargeTicks: number; climbTicks: number }
export interface Context { player: TerrainPlayer; run: RunState; tick: number; difficulty: Difficulty; input: ActionFrame; move(body: Rect, dx: number, dy: number, exclude?: string): { body: Rect; blockedX: boolean; blockedY: boolean; crushed: boolean }; clear(body: Rect): boolean; event(kind: string): string; terrain: readonly TerrainDefinition[]; surfaces: readonly DynamicSurface[]; emit(event: DomainEvent): void }
