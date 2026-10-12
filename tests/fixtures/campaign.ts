import type { Campaign, Difficulty } from '../../src/core/types';
import type { CampaignCatalog, CampaignSession, CommandResult } from '../../src/core/campaign/model';
import { createCampaign, openSession, enterLevel, applyEvents } from '../../src/core/campaign/reducer';
import { terrainLevel, solid } from './terrain';
import { mechanicEntity } from './mechanics';

export const SAVED_AT = '2026-10-12T15:00:00.000Z';
export const uuid = (n: number): string => `00000000-0000-4000-8000-${n.toString(16).padStart(12, '0')}`;
/** Logical progression fixture only. These repeated tiny arenas are not final campaign content. */
export function campaignCatalog(): CampaignCatalog {
  const worlds = ['main01', 'main02', 'main03', 'main04', 'secret01', 'secret02'].map(id => ({ id, entryLevelId: `${id}.level01`, secret: id.startsWith('secret') }));
  const levels = worlds.flatMap(w => Array.from({ length: w.id === 'secret01' ? 2 : w.id === 'main01' ? 3 : 1 }, (_, i) => {
    const id = `${w.id}.level${String(i + 1).padStart(2, '0')}`; const level = terrainLevel();
    return { ...level, id, worldId: w.id, contentVersion: 'campaign-test-v1', medallions: Array.from({ length: 5 }, (_, j) => `${id}.medallion${j + 1}`), checkpoints: [{ id: `${id}.checkpoint`, subareaId: 'main', anchor: { x: 96, y: 160 }, modes: ['easy', 'classic', 'hard'] as Difficulty[] }], exits: [{ id: `${id}.normal`, kind: 'normal' as const, subareaId: 'main', destination: id }, ...(id === 'main01.level03' ? [{ id: `${id}.secret`, kind: 'secret' as const, subareaId: 'main', destination: 'secret01.level01' }] : [])] };
  }));
  const routes: CampaignCatalog['routes'] = [{ id: 'main01.advance', fromLevelId: 'main01.level01', toLevelId: 'main01.level02', viaExitId: 'main01.level01.normal', requiresExits: [], requiresSanctuaries: [] }, { id: 'main01.advance2', fromLevelId: 'main01.level02', toLevelId: 'main01.level03', viaExitId: 'main01.level02.normal', requiresExits: [], requiresSanctuaries: [] }, { id: 'secret-shortcut', fromLevelId: 'main01.level03', toLevelId: 'secret01.level01', viaExitId: 'main01.level03.secret', requiresExits: [], requiresSanctuaries: [] }];
  routes.push({ id: 'normal-next-world', fromLevelId: 'main01.level03', toLevelId: 'main02.level01', viaExitId: 'main01.level03.normal', requiresExits: [], requiresSanctuaries: [] });
  const secretNetworkExitIds = levels.filter(l => l.worldId === 'secret01').map(l => `${l.id}.normal`);
  for (let i = 0; i < 1; i++) routes.push({ id: `network-${i}`, fromLevelId: `secret01.level${String(i + 1).padStart(2, '0')}`, toLevelId: `secret01.level${String(i + 2).padStart(2, '0')}`, viaExitId: secretNetworkExitIds[i]!, requiresExits: [], requiresSanctuaries: [] });
  routes.push({ id: 'second-secret', fromLevelId: 'secret01.level02', toLevelId: 'secret02.level01', viaExitId: null, requiresExits: secretNetworkExitIds, requiresSanctuaries: [] });
  return { contentVersion: 'campaign-test-v1', startLevelId: 'main01.level01', worlds, levels, routes, sanctuaries: [{ id: 'green', levelId: 'main01.level01', worldId: 'main01', color: 'green' }, { id: 'yellow', levelId: 'main03.level01', worldId: 'main03', color: 'yellow' }], finalBoss: { id: 'final-boss', levelId: 'main04.level01' }, secretNetworkExitIds };
}
export function fullCountCatalog(): CampaignCatalog {
  const c = campaignCatalog(); c.worlds = [...Array.from({ length: 10 }, (_, i) => `main${String(i + 1).padStart(2, '0')}`), 'secret01', 'secret02'].map(id => ({ id, entryLevelId: `${id}.level01`, secret: id.startsWith('secret') }));
  c.levels = c.worlds.flatMap(w => Array.from({ length: 2 }, (_, i) => { const level = terrainLevel(); const id = `${w.id}.level${String(i + 1).padStart(2, '0')}`; return { ...level, id, worldId: w.id, contentVersion: c.contentVersion, medallions: Array.from({ length: 5 }, (_, j) => `${id}.medallion${j + 1}`), exits: [{ id: `${id}.normal`, kind: 'normal' as const, subareaId: 'main', destination: id }, ...(!w.secret && i < 1 ? [{ id: `${id}.secret`, kind: 'secret' as const, subareaId: 'main', destination: id }] : [])] }; }));
  const levelIds = new Set(c.levels.map(level => level.id));
  const exitIds = new Set(c.levels.flatMap(level => level.exits.map(exit => exit.id)));
  c.routes = c.routes.filter(route => levelIds.has(route.fromLevelId) && levelIds.has(route.toLevelId) && (route.viaExitId === null || exitIds.has(route.viaExitId)));
  c.finalBoss = { id: 'final-boss', levelId: 'main10.level02' };
  return c;
}
export function sessionFixture(catalog = campaignCatalog(), difficulty: Difficulty = 'classic'): CampaignSession { return structuredClone(openSession(createCampaign(catalog, difficulty, { campaignId: uuid(1), eventId: uuid(2), savedAt: SAVED_AT }), uuid(3))); }
export function success(result: CommandResult): CampaignSession { if (!result.ok) throw new Error(result.code); return structuredClone(result.session); }
export function inLevel(catalog = campaignCatalog(), levelId = catalog.startLevelId, difficulty: Difficulty = 'classic'): CampaignSession { const s = sessionFixture(catalog, difficulty); s.campaign.progress.visitedWorlds = catalog.worlds.map(w => w.id); if (levelId === 'main01.level02' || levelId === 'main01.level03') s.campaign.progress.exits.push('main01.level01.normal'); if (levelId === 'main01.level03') s.campaign.progress.exits.push('main01.level02.normal'); return success(enterLevel(s, catalog, levelId, uuid(4))); }
export function exitFixture(session: CampaignSession, catalog: CampaignCatalog, exitId = `${session.activeLevelId}.normal`, number = 10): CommandResult { return applyEvents(session, catalog, { attemptId: session.attemptId, savedAt: SAVED_AT, events: [{ kind: 'exit', eventId: uuid(number), tick: number, exitId, levelId: session.activeLevelId, bonusStars: 0, medallions: session.pendingMedallions }] }); }
export function completeProgress(campaign: Campaign, catalog: CampaignCatalog): void { campaign.progress.completedLevels = catalog.levels.map(l => l.id); campaign.progress.exits = catalog.levels.flatMap(l => l.exits.map(e => e.id)); campaign.progress.medallions = Object.fromEntries(catalog.levels.map(l => [l.id, 31])); campaign.progress.visitedWorlds = catalog.worlds.map(w => w.id); }
export function collectionArena(catalog: CampaignCatalog): void {
  const level = catalog.levels[0]!; level.subareas[0]!.terrain = [solid('floor', 0, 160, 150)];
  level.subareas[0]!.entities = [mechanicEntity(level.medallions[0]!, 'medallion', 48, 140, { width: 16, height: 16 }), mechanicEntity(level.medallions[1]!, 'medallion', 126, 140, { width: 16, height: 16 })];
}
