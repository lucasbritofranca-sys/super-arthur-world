import type { Campaign, Difficulty, Slot } from '../core/types';
import type { CampaignCatalog, CampaignSession, CommandResult, TransitionMeta } from '../core/campaign/model';
import { createCampaign, lowerDifficulty as reduceDifficulty } from '../core/campaign/reducer';
import { immutable, reject } from '../core/campaign/model';
export function lowerDifficulty(session: CampaignSession, catalog: CampaignCatalog, next: Difficulty, meta: TransitionMeta, reducer: typeof reduceDifficulty = reduceDifficulty): CommandResult {
  if (session.screen !== 'map') return reject(session, 'unavailable');
  return reducer(session, catalog, next, meta);
}
export interface SlotState { slot: Slot; campaign: Campaign | null }
export type SlotResult = { ok: true; slots: SlotState[]; persistence: { slot: Slot; campaign: Campaign } } | { ok: false; code: 'slot_range' | 'slot_occupied' | 'invalid'; slots: readonly SlotState[] };
export const emptySlots = (): SlotState[] => immutable(Array.from({ length: 6 }, (_, n) => ({ slot: (n + 1) as Slot, campaign: null })));
export function newSlot(slots: readonly SlotState[], slot: number, catalog: CampaignCatalog, difficulty: Difficulty, meta: TransitionMeta & { campaignId: string }): SlotResult {
  if (!Number.isInteger(slot) || slot < 1 || slot > 6) return { ok: false, code: 'slot_range', slots };
  if (slots.length !== 6 || new Set(slots.map(s => s.slot)).size !== 6 || slots.some(s => s.slot < 1 || s.slot > 6)) return { ok: false, code: 'invalid', slots };
  if (slots.find(s => s.slot === slot)!.campaign) return { ok: false, code: 'slot_occupied', slots };
  let campaign: Campaign;
  try { campaign = createCampaign(catalog, difficulty, meta); } catch { return { ok: false, code: 'invalid', slots }; }
  return immutable({ ok: true, slots: slots.map(s => ({ slot: s.slot, campaign: s.slot === slot ? campaign : structuredClone(s.campaign) })), persistence: { slot: slot as Slot, campaign } });
}
export function replaceActiveSlot(slots: readonly SlotState[], slot: Slot, result: CommandResult): readonly SlotState[] {
  if (!result.ok) return slots;
  const existing = slots.find(s => s.slot === slot);
  if (!existing?.campaign || existing.campaign.campaignId !== result.session.campaign.campaignId) return slots;
  return immutable(slots.map(s => ({ slot: s.slot, campaign: s.slot === slot ? structuredClone(result.session.campaign) : structuredClone(s.campaign) })));
}
