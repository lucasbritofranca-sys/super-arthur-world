import { validateCampaign, validateLevel } from '../schema';
import type { Campaign, ValidationIssue } from '../types';
import type { CampaignCatalog } from './model';
import { knownIds } from './model';

/** Referential integrity for the loaded graph; final content counts belong to the content gate. */
export function catalogIssues(catalog: CampaignCatalog): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const fail = (path: string): void => { issues.push({ path, code: 'invalid_catalog' }); };
  const unique = (ids: string[], path: string): void => { if (new Set(ids).size !== ids.length || ids.some(id => !id || id.length > 256)) fail(path); };
  unique(catalog.worlds.map(w => w.id), 'worlds'); unique(catalog.levels.map(l => l.id), 'levels');
  unique(catalog.routes.map(r => r.id), 'routes'); unique(catalog.sanctuaries.map(s => s.id), 'sanctuaries');
  unique(catalog.levels.flatMap(l => l.exits.map(e => e.id)), 'exits'); unique(catalog.secretNetworkExitIds, 'secretNetworkExitIds');
  const levels = new Map(catalog.levels.map(l => [l.id, l]));
  const worlds = new Map(catalog.worlds.map(w => [w.id, w]));
  const exits = new Set(catalog.levels.flatMap(l => l.exits.map(e => e.id)));
  if (!catalog.contentVersion || !levels.has(catalog.startLevelId) || !levels.has(catalog.finalBoss.levelId)) fail('startLevelId');
  for (const world of catalog.worlds) if (levels.get(world.entryLevelId)?.worldId !== world.id) fail(`worlds.${world.id}`);
  for (const level of catalog.levels) {
    if (!worlds.has(level.worldId) || level.contentVersion !== catalog.contentVersion || !validateLevel(level).ok) fail(`levels.${level.id}`);
    unique(level.medallions, `levels.${level.id}.medallions`);
    if (level.medallions.length !== 5) fail(`levels.${level.id}.medallions`);
  }
  for (const sanctuary of catalog.sanctuaries) if (levels.get(sanctuary.levelId)?.worldId !== sanctuary.worldId) fail(`sanctuaries.${sanctuary.id}`);
  for (const route of catalog.routes) {
    if (!levels.has(route.fromLevelId) || !levels.has(route.toLevelId) || route.viaExitId !== null && !levels.get(route.fromLevelId)?.exits.some(e => e.id === route.viaExitId) || route.requiresExits.some(id => !exits.has(id)) || route.requiresSanctuaries.some(id => !catalog.sanctuaries.some(s => s.id === id))) fail(`routes.${route.id}`);
  }
  if (catalog.secretNetworkExitIds.some(id => !exits.has(id))) fail('secretNetworkExitIds');
  return issues;
}
export function campaignFitsCatalog(campaign: Campaign, catalog: CampaignCatalog): boolean {
  if (!validateCampaign(campaign, knownIds(catalog)).ok) return false;
  const at = campaign.resume;
  const level = catalog.levels.find(l => l.id === (at.kind === 'map' ? at.levelId : at.snapshot.levelId));
  if (!level || campaign.contentVersion !== catalog.contentVersion || campaign.progress.sanctuaries.some(id => !catalog.sanctuaries.some(s => s.id === id))) return false;
  if (at.kind === 'map') return at.worldId === level.worldId;
  return level.subareas.some(a => a.id === at.snapshot.subareaId) && (at.kind === 'start' ? at.snapshot.checkpointId === null : level.checkpoints.some(cp => cp.id === at.snapshot.checkpointId && cp.subareaId === at.snapshot.subareaId && cp.modes.includes(campaign.difficulty)));
}
