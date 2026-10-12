import type { Campaign } from '../types';
import type { CampaignCatalog } from './model';
export function deriveMap(campaign: Campaign, catalog: CampaignCatalog): { levels: { id: string; accessible: boolean; replay: boolean }[]; routes: { id: string; unlocked: boolean }[]; worlds: { id: string; accessible: boolean }[] } {
  const exits = new Set(campaign.progress.exits); const sanctuaries = new Set(campaign.progress.sanctuaries);
  const accessible = new Set([catalog.startLevelId]);
  for (const world of catalog.worlds) if (campaign.progress.visitedWorlds.includes(world.id)) {
    accessible.add(world.entryLevelId);
    for (const level of catalog.levels) if (level.worldId === world.id && campaign.progress.completedLevels.includes(level.id)) accessible.add(level.id);
  }
  const conditions = (route: CampaignCatalog['routes'][number]): boolean => (!route.viaExitId || exits.has(route.viaExitId)) && route.requiresExits.every(id => exits.has(id)) && route.requiresSanctuaries.every(id => sanctuaries.has(id));
  let changed = true;
  while (changed) { changed = false; for (const route of catalog.routes) if (accessible.has(route.fromLevelId) && conditions(route) && !accessible.has(route.toLevelId)) { accessible.add(route.toLevelId); changed = true; } }
  return {
    levels: catalog.levels.map(l => ({ id: l.id, accessible: accessible.has(l.id), replay: accessible.has(l.id) && campaign.progress.completedLevels.includes(l.id) })),
    routes: catalog.routes.map(r => ({ id: r.id, unlocked: accessible.has(r.fromLevelId) && conditions(r) })),
    worlds: catalog.worlds.map(w => ({ id: w.id, accessible: accessible.has(w.entryLevelId) })),
  };
}
export function completion(campaign: Campaign, catalog: CampaignCatalog): { levels: { count: number; total: 120 }; exits: { count: number; total: 150 }; medallions: { count: number; total: 600 }; percent: number; complete: boolean } {
  const levels = catalog.levels.filter(l => campaign.progress.completedLevels.includes(l.id)).length;
  const exits = catalog.levels.flatMap(l => l.exits).filter(e => campaign.progress.exits.includes(e.id)).length;
  let medallions = 0; for (const l of catalog.levels) { const mask = campaign.progress.medallions[l.id] ?? 0; for (let n = 0; n < l.medallions.length; n++) if (mask & (1 << n)) medallions++; }
  const complete = levels === 120 && exits === 150 && medallions === 600;
  return { levels: { count: levels, total: 120 }, exits: { count: exits, total: 150 }, medallions: { count: medallions, total: 600 }, percent: complete ? 100 : Math.min(99.99, Math.floor((levels + exits + medallions) / 870 * 10000) / 100), complete };
}
export function refreshCosmetic(campaign: Campaign, catalog: CampaignCatalog): void {
  const secret = catalog.worlds.filter(w => w.secret);
  campaign.progress.cosmeticUnlocked = secret.length === 2 && secret.every(w => catalog.levels.filter(l => l.worldId === w.id).every(l => campaign.progress.completedLevels.includes(l.id) && l.exits.every(e => campaign.progress.exits.includes(e.id))));
}
