import type { RestartSnapshot } from './types';
interface EventBase { eventId: string; tick: number }
export interface CheckpointEvent extends EventBase { kind: 'checkpoint'; snapshot: RestartSnapshot; medallions: string[] }
export interface ExitEvent extends EventBase { kind: 'exit'; exitId: string; levelId: string; bonusStars: number; medallions: string[] }
export interface DeathEvent extends EventBase { kind: 'death'; cause: 'pit' | 'contact' | 'crush' | 'lava' | 'timeout'; levelId: string; worldId: string }
export type DomainEvent = CheckpointEvent | ExitEvent | DeathEvent |
  (EventBase & { kind: 'reward'; entityId: string; reward: 'coin' | 'score' | 'life'; amount: number }) |
  (EventBase & { kind: 'bossVictory'; bossId: string }) |
  (EventBase & { kind: 'transition'; subareaId: string });
