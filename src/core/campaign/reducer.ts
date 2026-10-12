import type { Campaign, Difficulty, RestartSnapshot, RunState } from '../types';
import type { DomainEvent } from '../events';
import { validateCampaign, validateRestart, validateRun } from '../schema';
import { TerrainSimulation } from '../movement';
import type { CampaignCatalog, CampaignSession, CommandResult, EventBatch, TransitionMeta } from './model';
import { difficultyRank, emptyRun, immutable, knownIds, profiles, reject, success, uuid, validMeta } from './model';
import { completion, deriveMap, refreshCosmetic } from './progression';
import { addReward, commitMedallions } from './rewards';
import { advanceBonus, bonusLives, newBonus, stopBonus } from './bonus';
import { resetCampaign } from './resets';
import { catalogIssues, campaignFitsCatalog } from './catalog';

export function createCampaign(catalog: CampaignCatalog, difficulty: Difficulty, meta: TransitionMeta & { campaignId: string }): Campaign {
  const level = catalog.levels.find(l => l.id === catalog.startLevelId);
  if (!level || catalogIssues(catalog).length || !profiles[difficulty] || !validMeta(meta) || !uuid(meta.campaignId)) throw new Error('invalid_campaign');
  const campaign: Campaign = { schemaVersion: 1, contentVersion: catalog.contentVersion, campaignId: meta.campaignId, difficulty, lives: profiles[difficulty].lives,
    progress: { completedLevels: [], exits: [], medallions: {}, sanctuaries: [], visitedWorlds: [level.worldId], storyComplete: false, cosmeticUnlocked: false },
    resume: { kind: 'map', worldId: level.worldId, levelId: level.id }, run: emptyRun(), rewardMarks: [], lastTransition: { eventId: meta.eventId, kind: 'newCampaign', resetScope: null, resetId: null }, savedAt: meta.savedAt, pendingBonus: null };
  if (!validateCampaign(campaign, knownIds(catalog)).ok) throw new Error('invalid_campaign');
  return immutable(campaign);
}
export function openSession(campaign: Campaign, attemptId: string): CampaignSession {
  if (!validateCampaign(campaign).ok || !uuid(attemptId)) throw new Error('invalid_session');
  const id = campaign.resume.kind === 'map' ? campaign.resume.levelId : campaign.resume.snapshot.levelId;
  return immutable({ campaign: structuredClone(campaign), run: structuredClone(campaign.run), screen: campaign.pendingBonus ? 'bonus' : 'map', activeLevelId: id,
    levelStart: null, pendingMedallions: [], seenEventIds: [], attemptId, chain: 0, bonus: structuredClone(campaign.pendingBonus ?? null) });
}
export function enterLevel(session: CampaignSession, catalog: CampaignCatalog, levelId: string, attemptId: string): CommandResult {
  if (session.screen !== 'map' || !uuid(attemptId)) return reject(session, 'unavailable');
  if (!campaignFitsCatalog(session.campaign, catalog)) return reject(session, 'invalid');
  if (!deriveMap(session.campaign, catalog).levels.some(l => l.id === levelId && l.accessible)) return reject(session, 'route_locked');
  const level = catalog.levels.find(l => l.id === levelId)!; const next = structuredClone(session);
  let start: RestartSnapshot;
  try { start = new TerrainSimulation({ level, difficulty: next.campaign.difficulty, run: next.run, attemptId }).snapshot(); } catch { return reject(session, 'invalid'); }
  next.screen = 'level'; next.activeLevelId = levelId; next.attemptId = attemptId; next.levelStart = start; next.pendingMedallions = []; next.seenEventIds = []; next.chain = 0;
  next.campaign.rewardMarks = next.campaign.rewardMarks.filter(mark => !mark.includes('|event:'));
  if (!next.campaign.progress.visitedWorlds.includes(level.worldId)) next.campaign.progress.visitedWorlds.push(level.worldId);
  next.campaign.resume = { kind: 'start', snapshot: structuredClone(start) }; next.run = structuredClone(start.run); next.campaign.run = structuredClone(start.run);
  return success(next, [], true);
}
export function continueCampaign(session: CampaignSession, catalog: CampaignCatalog, attemptId: string): CommandResult {
  if (session.screen === 'bonus' || session.screen === 'level') return reject(session, 'unavailable');
  if (!campaignFitsCatalog(session.campaign, catalog)) return reject(session, 'invalid');
  const next = structuredClone(session);
  if (next.screen === 'gameOver') { next.screen = 'map'; return success(next, ['map']); }
  if (next.campaign.resume.kind === 'map') { next.screen = 'map'; return success(next, ['map']); }
  if (!uuid(attemptId)) return reject(session, 'invalid');
  const at = next.campaign.resume.snapshot;
  const level = catalog.levels.find(l => l.id === at.levelId);
  if (!level || level.contentVersion !== next.campaign.contentVersion) return reject(session, 'invalid');
  try { const sim = new TerrainSimulation({ level, difficulty: next.campaign.difficulty, attemptId }); sim.restart(at); } catch { return reject(session, 'invalid'); }
  next.run = structuredClone(at.run); next.activeLevelId = at.levelId; next.screen = 'level'; next.attemptId = attemptId; next.pendingMedallions = []; next.seenEventIds = []; next.chain = 0;
  if (!next.levelStart) next.levelStart = new TerrainSimulation({ level, difficulty: next.campaign.difficulty, run: emptyRun(), attemptId }).snapshot();
  next.campaign.rewardMarks = next.campaign.rewardMarks.filter(mark => !mark.includes('|event:'));
  return success(next, ['checkpointRespawn']);
}
export function travel(session: CampaignSession, catalog: CampaignCatalog, levelId: string): CommandResult {
  if (session.screen !== 'map') return reject(session, 'unavailable');
  if (!campaignFitsCatalog(session.campaign, catalog)) return reject(session, 'invalid');
  if (!deriveMap(session.campaign, catalog).levels.some(l => l.id === levelId && l.accessible)) return reject(session, 'route_locked');
  const next = structuredClone(session); const level = catalog.levels.find(l => l.id === levelId)!;
  next.activeLevelId = levelId; next.campaign.resume = { kind: 'map', worldId: level.worldId, levelId };
  if (!next.campaign.progress.visitedWorlds.includes(level.worldId)) next.campaign.progress.visitedWorlds.push(level.worldId);
  return success(next, ['map'], true);
}
export function returnToMap(session: CampaignSession, catalog: CampaignCatalog): CommandResult {
  if (session.screen !== 'level') return reject(session, 'unavailable');
  if (!campaignFitsCatalog(session.campaign, catalog) || !catalog.levels.some(l => l.id === session.activeLevelId)) return reject(session, 'invalid');
  const next = structuredClone(session); const level = catalog.levels.find(l => l.id === next.activeLevelId)!;
  next.screen = 'map'; next.pendingMedallions = []; next.chain = 0; next.levelStart = null;
  next.run = structuredClone(next.campaign.run); clearLevelEffects(next.run); next.campaign.run = structuredClone(next.run);
  next.campaign.resume = { kind: 'map', worldId: level.worldId, levelId: level.id }; return success(next, ['map'], true);
}
export function lowerDifficulty(session: CampaignSession, catalog: CampaignCatalog, nextDifficulty: Difficulty, meta: TransitionMeta): CommandResult {
  if (session.screen !== 'map') return reject(session, 'unavailable');
  if (!campaignFitsCatalog(session.campaign, catalog) || !catalog.levels.some(l => l.id === session.activeLevelId)) return reject(session, 'invalid');
  if (!profiles[nextDifficulty] || !validMeta(meta)) return reject(session, 'invalid');
  if (difficultyRank[nextDifficulty] > difficultyRank[session.campaign.difficulty]) return reject(session, 'difficulty_increase');
  if (nextDifficulty === session.campaign.difficulty) return success(structuredClone(session));
  const next = structuredClone(session); next.campaign.difficulty = nextDifficulty;
  const level = catalog.levels.find(l => l.id === next.activeLevelId)!;
  next.campaign.resume = { kind: 'map', worldId: level.worldId, levelId: level.id };
  next.campaign.lastTransition = { eventId: meta.eventId, kind: 'difficulty', resetScope: null, resetId: null }; next.campaign.savedAt = meta.savedAt;
  return success(next, [], true);
}
export function collectMedallion(session: CampaignSession, catalog: CampaignCatalog, id: string): CommandResult {
  if (session.screen !== 'level') return reject(session, 'unavailable');
  if (!campaignFitsCatalog(session.campaign, catalog) || !catalog.levels.some(l => l.id === session.activeLevelId)) return reject(session, 'invalid');
  const level = catalog.levels.find(l => l.id === session.activeLevelId)!; const index = level.medallions.indexOf(id);
  if (index < 0) return reject(session, 'invalid'); const next = structuredClone(session);
  if (!((next.campaign.progress.medallions[level.id] ?? 0) & (1 << index)) && !next.pendingMedallions.includes(id)) next.pendingMedallions.push(id);
  return success(next);
}
const clearLevelEffects = (run: RunState): void => { run.effects = { invincibility: 0, float: 0, mountShell: 0 }; run.temporarySwitches = []; if (run.mount) { run.mount.swallowed = null; run.mount.state = 'ridden'; } };
const snapshotRun = (session: CampaignSession, at: RestartSnapshot): RunState => ({ ...structuredClone(at.run), coins: session.run.coins, score: session.run.score, bonusStars: session.run.bonusStars });
function transition(session: CampaignSession, event: DomainEvent, savedAt: string, kind: Campaign['lastTransition']['kind']): void { session.campaign.lastTransition = { eventId: event.eventId, kind, resetScope: null, resetId: null }; session.campaign.savedAt = savedAt; }
function processEvent(session: CampaignSession, catalog: CampaignCatalog, event: DomainEvent, savedAt: string): boolean {
  const campaign = session.campaign; const level = catalog.levels.find(l => l.id === session.activeLevelId)!;
  if (event.kind === 'chainReset') { session.chain = 0; return true; }
  if (event.kind === 'reward') {
    if (!Number.isSafeInteger(event.amount) || event.amount < 0 || event.amount > 9999999 || !['coin', 'score', 'life'].includes(event.reward)) return false;
    addReward(session, event); return true;
  }
  if (event.kind === 'checkpoint') {
    if (!validateRestart(event.snapshot).ok || event.snapshot.levelId !== level.id || !level.checkpoints.some(cp => cp.id === event.snapshot.checkpointId && cp.subareaId === event.snapshot.subareaId && cp.modes.includes(campaign.difficulty) && cp.anchor.x === event.snapshot.anchor.x && cp.anchor.y === event.snapshot.anchor.y)) return false;
    if (!commitMedallions(session, catalog, event.medallions)) return false;
    const snapshot = structuredClone(event.snapshot); snapshot.run = snapshotRun(session, snapshot); campaign.run = structuredClone(snapshot.run); session.run = structuredClone(snapshot.run);
    campaign.resume = { kind: 'checkpoint', snapshot }; transition(session, event, savedAt, 'checkpoint'); return true;
  }
  if (event.kind === 'sanctuary') {
    const declared = catalog.sanctuaries.find(s => s.id === event.sanctuaryId && s.levelId === level.id && s.color === event.color);
    if (!declared) return false; if (!campaign.progress.sanctuaries.includes(declared.id)) campaign.progress.sanctuaries.push(declared.id); return true;
  }
  if (event.kind === 'bossVictory') {
    if (catalog.finalBoss.id === event.bossId && catalog.finalBoss.levelId === level.id) campaign.progress.storyComplete = true;
    else if (!level.subareas.some(a => a.entities.some(e => e.kind === 'boss' && e.id === event.bossId))) return false;
    return true;
  }
  if (event.kind === 'exit') {
    if (event.levelId !== level.id || !level.exits.some(e => e.id === event.exitId) || !Number.isSafeInteger(event.bonusStars) || event.bonusStars < 0 || event.bonusStars > 99) return false;
    if (event.run) {
      if (!validateRun(event.run).ok) return false;
      session.run = { ...structuredClone(event.run), coins: session.run.coins, score: session.run.score, bonusStars: session.run.bonusStars };
    }
    if (!commitMedallions(session, catalog, event.medallions)) return false;
    const first = !campaign.progress.exits.includes(event.exitId);
    if (first) { campaign.progress.exits.push(event.exitId); const total = session.run.bonusStars + event.bonusStars; session.run.bonusStars = total % 100;
      if (total >= 100) { session.bonus = newBonus(`${level.id}|bonus:${event.eventId}`, level.id); campaign.pendingBonus = structuredClone(session.bonus); }
      if (event.remainingTicks !== undefined) { if (!Number.isSafeInteger(event.remainingTicks) || event.remainingTicks < 0 || event.remainingTicks > 216000) return false; session.run.score = Math.min(9999999, session.run.score + Math.floor(event.remainingTicks / 60) * 50); }
    }
    if (!campaign.progress.completedLevels.includes(level.id)) campaign.progress.completedLevels.push(level.id);
    clearLevelEffects(session.run); campaign.run = structuredClone(session.run); campaign.resume = { kind: 'map', worldId: level.worldId, levelId: level.id };
    session.screen = session.bonus ? 'bonus' : 'map'; session.levelStart = null; session.chain = 0; transition(session, event, savedAt, 'exit'); refreshCosmetic(campaign, catalog); return true;
  }
  if (event.kind === 'death') {
    if (event.levelId !== level.id || event.worldId !== level.worldId) return false;
    campaign.lives = Math.max(0, campaign.lives - 1); session.pendingMedallions = []; session.chain = 0;
    if (!campaign.lives) resetCampaign(session, catalog, event.eventId);
    else { const at = campaign.resume.kind === 'checkpoint' || campaign.resume.kind === 'start' ? campaign.resume.snapshot : session.levelStart;
      if (!at) return false; session.run = structuredClone(at.run); campaign.run = structuredClone(at.run); session.screen = 'death'; transition(session, event, savedAt, 'death'); }
    campaign.savedAt = savedAt; return true;
  }
  return ['message', 'mountBonus', 'transition'].includes(event.kind);
}
export function applyEvents(session: CampaignSession, catalog: CampaignCatalog, batch: EventBatch): CommandResult {
  if (batch.attemptId !== session.attemptId) return reject(session, 'stale_attempt');
  if (!campaignFitsCatalog(session.campaign, catalog) || !catalog.levels.some(l => l.id === session.activeLevelId)) return reject(session, 'invalid');
  if (session.screen !== 'level') return batch.events.every(e => session.seenEventIds.includes(e.eventId) || session.campaign.lastTransition.eventId === e.eventId) ? success(structuredClone(session)) : reject(session, 'unavailable');
  if (!/^\d{4}-\d{2}-\d{2}T/.test(batch.savedAt) || !Number.isFinite(Date.parse(batch.savedAt))) return reject(session, 'invalid');
  const next = structuredClone(session); let persist = false; const effects: ('checkpointRespawn' | 'gameOver' | 'map' | 'bonus')[] = [];
  const priority = (event: DomainEvent): number => event.kind === 'reward' ? 0 : event.kind === 'checkpoint' ? 2 : event.kind === 'exit' ? 3 : event.kind === 'chainReset' ? 4 : 1;
  const events = [...batch.events].sort((a, b) => a.tick - b.tick || priority(a) - priority(b) || a.eventId.localeCompare(b.eventId));
  for (const event of events) {
    if (!uuid(event.eventId) || !Number.isSafeInteger(event.tick) || event.tick < 0) return reject(session, 'invalid');
    const death = events.find(e => e.tick === event.tick && e.kind === 'death'); if (death && event !== death) continue;
    const mark = `${next.activeLevelId}|event:${event.eventId}`;
    if (next.seenEventIds.includes(event.eventId) || next.campaign.rewardMarks.includes(mark) || next.campaign.lastTransition.eventId === event.eventId) continue;
    if (next.screen !== 'level') break;
    if (!processEvent(next, catalog, event, batch.savedAt)) return reject(session, 'invalid');
    next.seenEventIds.push(event.eventId);
    // Death is recorded by lastTransition, outside the ledger being erased by reset.
    if (!['death', 'chainReset'].includes(event.kind)) next.campaign.rewardMarks.push(mark);
    persist ||= ['checkpoint', 'exit', 'death', 'sanctuary', 'bossVictory'].includes(event.kind) || next.campaign.lives !== session.campaign.lives;
    if (event.kind === 'death') effects.push(next.campaign.lastTransition.kind === 'gameOver' ? 'gameOver' : 'checkpointRespawn');
    if (event.kind === 'exit') effects.push(next.bonus ? 'bonus' : 'map');
  }
  if (next.seenEventIds.length > 4096 || next.campaign.rewardMarks.length > 4096) return reject(session, 'capacity');
  if (persist) next.campaign.savedAt = batch.savedAt;
  if (!validateCampaign(next.campaign, knownIds(catalog)).ok) return reject(session, 'invalid');
  return success(next, effects, persist);
}
export function settleBonus(session: CampaignSession, _catalog: CampaignCatalog, round: import('../types').BonusRound): CommandResult {
  if (session.screen !== 'bonus' || !session.bonus) return reject(session, 'unavailable');
  if (round.tick < session.bonus.tick) return reject(session, 'invalid');
  let expected: typeof round;
  try { expected = stopBonus(advanceBonus(session.bonus, round.tick - session.bonus.tick)); } catch { return reject(session, 'invalid'); }
  if (JSON.stringify(expected) !== JSON.stringify(round)) return reject(session, 'invalid');
  const next = structuredClone(session); next.bonus = structuredClone(round); next.campaign.pendingBonus = structuredClone(round);
  if (round.cells.every(s => s !== null)) {
    if (!next.campaign.rewardMarks.includes(round.id)) { next.campaign.lives = Math.min(99, next.campaign.lives + bonusLives(round)); next.campaign.rewardMarks.push(round.id); }
    next.bonus = null; next.campaign.pendingBonus = null; next.screen = 'map'; return success(next, ['map'], true);
  }
  return success(next, [], true);
}
export { completion, deriveMap };
