import type { DomainEvent } from '../events';
import type { CampaignSession, CampaignCatalog } from './model';
export const chainScores = [100, 200, 400, 800, 1000, 2000, 4000, 8000] as const;
export function addReward(session: CampaignSession, event: Extract<DomainEvent, { kind: 'reward' }>): void {
  const { run, campaign } = session;
  if (event.chain) {
    if (session.chain >= chainScores.length) campaign.lives = Math.min(99, campaign.lives + 1);
    else run.score = Math.min(9999999, run.score + chainScores[session.chain]!);
    session.chain = Math.min(9, session.chain + 1);
  } else if (event.reward === 'coin') { const total = run.coins + event.amount; campaign.lives = Math.min(99, campaign.lives + Math.floor(total / 100)); run.coins = total % 100; }
  else if (event.reward === 'score') run.score = Math.min(9999999, run.score + event.amount);
  else campaign.lives = Math.min(99, campaign.lives + event.amount);
}
export function commitMedallions(session: CampaignSession, catalog: CampaignCatalog, ids: readonly string[]): boolean {
  const level = catalog.levels.find(l => l.id === session.activeLevelId)!;
  let mask = session.campaign.progress.medallions[level.id] ?? 0;
  for (const id of [...session.pendingMedallions, ...ids]) { const index = level.medallions.indexOf(id); if (index < 0) return false; mask |= 1 << index; }
  if (mask) session.campaign.progress.medallions[level.id] = mask;
  const mark = `${level.id}|medallion-set`;
  if (mask === 31 && !session.campaign.rewardMarks.includes(mark)) { session.campaign.rewardMarks.push(mark); session.campaign.lives = Math.min(99, session.campaign.lives + 1); }
  session.pendingMedallions = []; return true;
}
