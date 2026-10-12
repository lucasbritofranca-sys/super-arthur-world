import { expect, it } from 'vitest';
import { validateCampaign, validateRestart } from '../../src/core/schema';
import { campaignFixture } from '../fixtures/foundation';
it('accepts the grounded campaign fixture and rejects partial reset metadata', () => {
  const campaign = campaignFixture(); expect(validateCampaign(campaign).ok).toBe(true);
  for (const reset of [{ resetScope: 'world' as const, resetId: null }, { resetScope: null, resetId: 'world01' }]) {
    expect(validateCampaign({ ...campaign, lastTransition: { ...campaign.lastTransition, ...reset } }).ok).toBe(false);
  }
});
it('rejects duplicate object ownership and shell effects without a swallowed shell', () => {
  const campaign = campaignFixture();
  const carried = { id: 'shell1', kind: 'shell' as const, variant: 'green' };
  const mount = { id: 'mount1', color: 'green' as const, state: 'ridden' as const, berries: 0, swallowed: carried };
  expect(validateCampaign({ ...campaign, run: { ...campaign.run, carried, mount } }).ok).toBe(false);
  expect(validateCampaign({ ...campaign, run: { ...campaign.run, effects: { ...campaign.run.effects, mountShell: 10 } } }).ok).toBe(false);
});
it('strictly rejects prototype-named unknown fields, oversized and incompatible saves', () => {
  const campaign = campaignFixture();
  expect(validateCampaign({ ...campaign, toString: 'unexpected' }).ok).toBe(false);
  expect(validateCampaign({ ...campaign, schemaVersion: 2 })).toMatchObject({ ok: false, issues: [{ code: 'incompatible' }] });
  expect(validateCampaign({ ...campaign, contentVersion: 'a'.repeat(262145) })).toMatchObject({ ok: false, issues: [{ code: 'too_large' }] });
});
it('restart snapshots never restore lives and map destinations use known worlds', () => {
  const campaign = campaignFixture();
  const snapshot = { levelId: 'level01', subareaId: 'main', checkpointId: null, anchor: { x: 0, y: 0 }, remainingTicks: 100, run: campaign.run, hazardSeed: 1 };
  expect(validateRestart(snapshot).ok).toBe(true);
  expect(validateRestart({ ...snapshot, lives: 99 }).ok).toBe(false);
  expect(validateCampaign(campaign, { levels: new Set([campaign.resume.kind === 'map' ? campaign.resume.levelId : 'level01']), exits: new Set(), worlds: new Set() }).ok).toBe(false);
});
