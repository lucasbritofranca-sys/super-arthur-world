import type { BonusRound, Campaign, Difficulty, LevelDefinition, RestartSnapshot, RunState } from '../types';
import type { DomainEvent } from '../events';
export interface WorldDefinition { id: string; entryLevelId: string; secret: boolean }
export interface RouteDefinition { id: string; fromLevelId: string; toLevelId: string; viaExitId: string | null; requiresExits: string[]; requiresSanctuaries: string[] }
export interface SanctuaryDefinition { id: string; levelId: string; worldId: string; color: 'green' | 'red' | 'blue' | 'yellow' }
export interface CampaignCatalog { contentVersion: string; startLevelId: string; worlds: WorldDefinition[]; levels: LevelDefinition[]; routes: RouteDefinition[]; sanctuaries: SanctuaryDefinition[]; finalBoss: { id: string; levelId: string }; secretNetworkExitIds: string[] }
export interface TransitionMeta { eventId: string; savedAt: string }
export interface EventBatch { attemptId: string; events: readonly DomainEvent[]; savedAt: string }
export interface CampaignSession {
  campaign: Campaign; run: RunState; screen: 'map' | 'level' | 'death' | 'gameOver' | 'bonus'; activeLevelId: string;
  levelStart: RestartSnapshot | null; pendingMedallions: string[]; seenEventIds: string[]; attemptId: string; chain: number; bonus: BonusRound | null;
}
export type CommandEffect = 'checkpointRespawn' | 'gameOver' | 'map' | 'bonus';
export type CommandCode = 'unavailable' | 'route_locked' | 'invalid' | 'stale_attempt' | 'capacity' | 'difficulty_increase' | 'slot_range' | 'slot_occupied';
export type CommandResult = { ok: true; session: CampaignSession; effects: CommandEffect[]; persistence: Campaign | null } | { ok: false; code: CommandCode; session: CampaignSession };
export const profiles: Record<Difficulty, { lives: number; timer: number; protection: number; checkpoints: number }> = { easy: { lives: 10, timer: 1.5, protection: 120, checkpoints: 3 }, classic: { lives: 5, timer: 1, protection: 60, checkpoints: 2 }, hard: { lives: 3, timer: 0.8, protection: 30, checkpoints: 1 } };
export const difficultyRank: Record<Difficulty, number> = { easy: 0, classic: 1, hard: 2 };
export const emptyRun = (): RunState => ({ coins: 0, bonusStars: 0, score: 0, form: 'small', reserve: null, carried: null, mount: null, effects: { invincibility: 0, float: 0, mountShell: 0 }, temporarySwitches: [] });
export function immutable<T>(value: T): T { if (value !== null && typeof value === 'object') { for (const child of Object.values(value)) immutable(child); Object.freeze(value); } return value; }
export const reject = (session: CampaignSession, code: CommandCode): CommandResult => immutable({ ok: false, code, session: structuredClone(session) });
export const success = (session: CampaignSession, effects: CommandEffect[] = [], persist = false): CommandResult => immutable({ ok: true, session, effects, persistence: persist ? structuredClone(session.campaign) : null });
export const knownIds = (catalog: CampaignCatalog): { levels: Set<string>; exits: Set<string>; worlds: Set<string> } => ({ levels: new Set(catalog.levels.map(l => l.id)), exits: new Set(catalog.levels.flatMap(l => l.exits.map(e => e.id))), worlds: new Set(catalog.worlds.map(w => w.id)) });
export const uuid = (id: string): boolean => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
export const validMeta = (meta: TransitionMeta): boolean => uuid(meta.eventId) && /^\d{4}-\d{2}-\d{2}T/.test(meta.savedAt) && Number.isFinite(Date.parse(meta.savedAt));
