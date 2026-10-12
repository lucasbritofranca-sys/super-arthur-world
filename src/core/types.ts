import type { DomainEvent, CheckpointEvent, ExitEvent, DeathEvent } from './events';

export const ACTIONS = ['left', 'right', 'up', 'down', 'jump', 'spin', 'action', 'reserve', 'pause'] as const;
export type Action = typeof ACTIONS[number];
export type Difficulty = 'easy' | 'classic' | 'hard';
export type Slot = 1 | 2 | 3 | 4 | 5 | 6;
export type SaveScope = 'guest' | `account:${string}`;
export type Form = 'small' | 'large' | 'projectile' | 'gliding';
export interface Vec2 { x: number; y: number }
export interface Rect extends Vec2 { width: number; height: number }
export interface ActionFrame {
  held: ReadonlySet<Action>; pressed: ReadonlySet<Action>; released: ReadonlySet<Action>;
}
export interface Effects { invincibility: number; float: number; mountShell: number }
export interface CarriedDescriptor { id: string; kind: 'shell' | 'key' | 'spring' | 'block' | 'timed'; variant: string }
export interface MountDescriptor {
  id: string; color: 'green' | 'red' | 'blue' | 'yellow';
  state: 'baby' | 'following' | 'ridden' | 'fleeing' | 'swallowing'; berries: number;
  swallowed: CarriedDescriptor | null;
}
export interface RunState {
  coins: number; bonusStars: number; score: number; form: Form; reserve: Exclude<Form, 'small'> | null;
  carried: CarriedDescriptor | null; mount: MountDescriptor | null; effects: Effects;
}
export interface RestartSnapshot {
  levelId: string; subareaId: string; checkpointId: string | null;
  anchor: Vec2; remainingTicks: number; run: RunState; hazardSeed: number;
}
export type Resume = { kind: 'map'; worldId: string; levelId: string } |
  { kind: 'checkpoint' | 'start'; snapshot: RestartSnapshot };
export interface Progress {
  completedLevels: string[]; exits: string[]; medallions: Record<string, number>;
  sanctuaries: string[]; visitedWorlds: string[]; storyComplete: boolean; cosmeticUnlocked: boolean;
}
export interface LastTransition {
  eventId: string; kind: 'newCampaign' | 'checkpoint' | 'exit' | 'death' | 'gameOver' | 'difficulty';
  resetScope: 'level' | 'world' | 'campaign' | null; resetId: string | null;
}
export interface Campaign {
  schemaVersion: 1; contentVersion: string; campaignId: string; difficulty: Difficulty;
  progress: Progress; lives: number; resume: Resume; run: RunState;
  rewardMarks: string[]; lastTransition: LastTransition; savedAt: string;
}
export interface ActorState {
  id: string; position: Vec2; velocity: Vec2; body: Rect; hurt: Rect; attack: Rect | null;
  mode: 'ground' | 'air' | 'swim' | 'climb' | 'fence' | 'flight' | 'float' | 'transition' | 'dying';
  grounded: boolean; supportId: string | null; facing: -1 | 1; form: Form;
}
export interface SimulationState {
  tick: number; levelId: string; subareaId: string; player: ActorState; remainingTicks: number;
}
export interface Simulation {
  step(input: ActionFrame): readonly DomainEvent[];
  view(): Readonly<SimulationState>;
  restart(at: RestartSnapshot): void;
}
export interface CampaignCommands {
  checkpoint(state: Campaign, event: CheckpointEvent): Campaign;
  exit(state: Campaign, event: ExitEvent): Campaign;
  death(state: Campaign, event: DeathEvent): Campaign;
  lowerDifficulty(state: Campaign, next: Difficulty): Campaign;
}
export interface LocalRecord {
  scope: SaveScope; slot: Slot; localVersion: number; payload: Campaign | null;
  acknowledgedRemoteRevision: number; desiredMutationId: string | null;
  syncStatus: 'local' | 'pending' | 'confirmed' | 'conflict';
}
export type CommitResult = { ok: true; version: number } |
  { ok: false; code: 'local-conflict' | 'quota' | 'unavailable' | 'invalid' };
export interface LocalRepository {
  read(scope: SaveScope, slot: Slot): Promise<LocalRecord | null>;
  commit(expectedVersion: number, next: LocalRecord): Promise<CommitResult>;
}
export interface RemoteRecord {
  userId: string; slot: Slot; revision: number; mutationId: string; payload: Campaign | null; updatedAt: string;
}
export interface SaveMutation { slot: Slot; expectedRevision: number; mutationId: string; payload: Campaign | null }
export interface InitialSave { slot: Slot; mutationId: string; payload: Campaign }
export type WriteResult = { kind: 'accepted' | 'conflict'; record: RemoteRecord } |
  { kind: 'retry'; code: 'network' | 'auth' | 'rate-limit' | 'remote-error' } |
  { kind: 'invalid'; code: 'schema' | 'too-large' | 'forbidden' };
export type RemoteResult = { kind: 'found'; record: RemoteRecord } | { kind: 'empty' } |
  Extract<WriteResult, { kind: 'retry' | 'invalid' }>;
export interface RemoteRepository {
  read(slot: Slot): Promise<RemoteResult>; insert(request: InitialSave): Promise<WriteResult>;
  compareAndSwap(request: SaveMutation): Promise<WriteResult>;
}
export interface Outbox { inFlight: Readonly<SaveMutation> | null; desired: SaveMutation | null }
export interface TerrainDefinition extends Rect {
  id: string; shape: 'solid' | 'oneWay' | 'slope' | 'verticalRun';
  rise: number; direction: -1 | 1;
}
export interface EntityDefinition { id: string; kind: string; position: Vec2; parameters: Record<string, string | number | boolean> }
export interface SubareaDefinition {
  id: string; bounds: Rect; spawn: Vec2; terrain: TerrainDefinition[]; entities: EntityDefinition[];
  allowMount: boolean; camera: Rect;
}
export interface ExitDefinition { id: string; subareaId: string; destination: string; kind: 'normal' | 'secret' | 'key' | 'boss' | 'orb' }
export interface CheckpointDefinition { id: string; subareaId: string; anchor: Vec2; modes: Difficulty[] }
export interface LevelDefinition {
  id: string; worldId: string; contentVersion: string; geometryHash: string; designNote: string;
  baselineTimer: number; subareas: SubareaDefinition[]; exits: ExitDefinition[];
  checkpoints: CheckpointDefinition[]; medallions: string[]; families: string[];
}
export interface ValidationIssue { path: string; code: string }
export type ValidationResult<T> = { ok: true; value: T } | { ok: false; issues: ValidationIssue[] };
