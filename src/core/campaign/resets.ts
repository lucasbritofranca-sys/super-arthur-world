import type { CampaignSession, CampaignCatalog } from './model';
import { emptyRun, profiles } from './model';
import { refreshCosmetic } from './progression';
export function resetCampaign(session: CampaignSession, catalog: CampaignCatalog, eventId: string): void {
  const c = session.campaign; const current = catalog.levels.find(l => l.id === session.activeLevelId)!;
  const scope = c.difficulty === 'easy' ? 'level' : c.difficulty === 'classic' ? 'world' : 'campaign';
  const owned = new Set(catalog.levels.filter(l => scope === 'campaign' || scope === 'world' && l.worldId === current.worldId || scope === 'level' && l.id === current.id).map(l => l.id));
  const exits = new Set(catalog.levels.filter(l => owned.has(l.id)).flatMap(l => l.exits.map(e => e.id)));
  c.progress.completedLevels = c.progress.completedLevels.filter(id => !owned.has(id)); c.progress.exits = c.progress.exits.filter(id => !exits.has(id));
  for (const id of owned) delete c.progress.medallions[id];
  c.progress.sanctuaries = c.progress.sanctuaries.filter(id => !catalog.sanctuaries.some(s => s.id === id && owned.has(s.levelId)));
  c.rewardMarks = scope === 'campaign' ? [] : c.rewardMarks.filter(mark => ![...owned].some(id => mark.startsWith(`${id}|`)));
  if (scope === 'campaign') c.progress.visitedWorlds = [catalog.levels.find(l => l.id === catalog.startLevelId)!.worldId];
  if (owned.has(catalog.finalBoss.levelId)) c.progress.storyComplete = false;
  const destination = scope === 'level' ? current.id : scope === 'world' ? catalog.worlds.find(w => w.id === current.worldId)!.entryLevelId : catalog.startLevelId;
  const worldId = catalog.levels.find(l => l.id === destination)!.worldId;
  c.run = emptyRun(); session.run = emptyRun(); c.pendingBonus = null; session.bonus = null; c.lives = profiles[c.difficulty].lives;
  c.resume = { kind: 'map', worldId, levelId: destination }; session.activeLevelId = destination;
  c.lastTransition = { eventId, kind: 'gameOver', resetScope: scope, resetId: scope === 'campaign' ? c.campaignId : scope === 'world' ? current.worldId : current.id };
  session.pendingMedallions = []; session.levelStart = null; session.chain = 0; session.screen = 'gameOver'; refreshCosmetic(c, catalog);
}
