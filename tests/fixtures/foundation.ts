import type { Action, ActionFrame, Campaign, RunState } from '../../src/core/types';
export function actionFrame(held: Action[] = [], pressed: Action[] = [], released: Action[] = []): ActionFrame {
  return { held: new Set(held), pressed: new Set(pressed), released: new Set(released) };
}
export function emptyRun(): RunState {
  return { coins: 0, bonusStars: 0, score: 0, form: 'small', reserve: null, carried: null, mount: null, effects: { invincibility: 0, float: 0, mountShell: 0 } };
}
export function campaignFixture(): Campaign {
  return {
    schemaVersion: 1, contentVersion: 'fixture-v1', campaignId: '00000000-0000-4000-8000-000000000001', difficulty: 'classic',
    progress: { completedLevels: [], exits: [], medallions: {}, sanctuaries: [], visitedWorlds: ['main01'], storyComplete: false, cosmeticUnlocked: false },
    lives: 5, resume: { kind: 'map', worldId: 'main01', levelId: 'main01.level01' }, run: emptyRun(), rewardMarks: [],
    lastTransition: { eventId: '00000000-0000-4000-8000-000000000002', kind: 'newCampaign', resetScope: null, resetId: null }, savedAt: '2026-10-11T00:00:00.000Z',
  };
}
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return state / 4294967296; };
}
