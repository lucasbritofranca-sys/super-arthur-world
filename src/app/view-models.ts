import type { CampaignCatalog, CampaignSession } from '../core/campaign/model';
import { completion, deriveMap } from '../core/campaign/progression';
import type { SlotState } from './campaign-commands';
export function campaignView(session: CampaignSession, catalog: CampaignCatalog) {
  return { difficulty: session.campaign.difficulty, screen: session.screen, levelId: session.activeLevelId, lives: session.campaign.lives, coins: session.run.coins, bonusStars: session.run.bonusStars, score: session.run.score,
    form: session.run.form, reserve: session.run.reserve, checkpoint: session.campaign.resume.kind === 'map' ? null : session.campaign.resume.snapshot.checkpointId,
    progress: completion(session.campaign, catalog), map: deriveMap(session.campaign, catalog), storyComplete: session.campaign.progress.storyComplete, cosmeticUnlocked: session.campaign.progress.cosmeticUnlocked,
    switches: Object.fromEntries(['green', 'red', 'blue', 'yellow'].map(color => [color, catalog.sanctuaries.some(s => s.color === color && session.campaign.progress.sanctuaries.includes(s.id))])), bonus: structuredClone(session.bonus) };
}
export const slotViews = (slots: readonly SlotState[]) => slots.map(s => ({ slot: s.slot, status: s.campaign ? 'occupied' : 'empty', difficulty: s.campaign?.difficulty ?? null, resume: structuredClone(s.campaign?.resume ?? null) }));
