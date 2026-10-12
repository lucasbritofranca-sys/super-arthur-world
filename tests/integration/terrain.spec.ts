import { test, expect } from '@playwright/test';
import { terrainLevel, solid, platformEntity } from '../fixtures/terrain';
import type { Action, Difficulty, RunState } from '../../src/core/types';
test.beforeEach(async ({ page }) => { await page.goto('/'); await page.getByRole('button', { name: 'Iniciar teste de controles' }).click(); });
test('IT-008 actual browser simulation has mode-independent run and jump physics', async ({ page }) => {
  const traces = [];
  for (const difficulty of ['easy', 'classic', 'hard'] as Difficulty[]) {
    traces.push(await page.evaluate(({ level, difficulty }) => {
      const q = window.__SAW_QA__!; q.load({ level, difficulty, attemptId: '11111111-1111-4111-8111-111111111111' }); const states = [];
      for (let n = 0; n < 120; n++) { q.trace([{ held: ['right', 'action', ...(n >= 20 && n < 40 ? ['jump' as const] : [])], pressed: n === 20 ? ['jump'] : [], released: n === 40 ? ['jump'] : [] }]); const p = q.simulation().player; states.push({ position: p.position, velocity: p.velocity, mode: p.mode, grounded: p.grounded, support: p.supportId }); }
      return states;
    }, { level: terrainLevel(), difficulty }));
  }
  expect(traces[0]).toEqual(traces[1]); expect(traces[1]).toEqual(traces[2]);
  expect(traces[0]!.some(p => p.velocity.y < 0)).toBe(true); expect(traces[0]![119]!.grounded).toBe(true);
});
test('IT-013 upward paired pipe preserves a permitted key and changes real Phaser camera', async ({ page }) => {
  const level = terrainLevel(undefined, [{ id: 'up-pipe', kind: 'pipe', position: { x: 32, y: 128 }, parameters: { width: 32, height: 32, destination: 'other', anchorX: 560, anchorY: 160, direction: 'up', carry: true } }]);
  level.subareas.push({ ...terrainLevel([solid('other-floor', 0, 160, 640)], [{ id: 'return-pipe', kind: 'pipe', position: { x: 544, y: 128 }, parameters: { width: 32, height: 32, destination: 'main', anchorX: 48, anchorY: 160, direction: 'down' } }]).subareas[0]!, id: 'other' });
  const run: RunState = { coins: 0, bonusStars: 0, score: 0, form: 'small', reserve: null, carried: { id: 'key', kind: 'key', variant: 'bronze' }, mount: null, effects: { invincibility: 0, float: 0, mountShell: 0 } };
  await page.evaluate(({ level, run }) => { const q = window.__SAW_QA__!; q.load({ level, run }); q.trace([{ held: ['up'], pressed: ['up'], released: [] }, ...Array.from({ length: 12 }, () => ({ held: [] as Action[], pressed: [] as Action[], released: [] as Action[] }))]); }, { level, run });
  await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.camera().x)).toBe(256);
  const state = await page.evaluate(() => window.__SAW_QA__!.simulation()); expect(state.subareaId).toBe('other'); expect(state.player.position).toEqual({ x: 560, y: 160 }); expect(state.player.carried).toEqual(run.carried); expect(state.player.grounded).toBe(true);
});
test('IT-023 five dynamic surface types carry real actor throughout complete cycles', async ({ page }) => {
  for (const kind of ['moving', 'falling', 'guided', 'rotating', 'balance']) {
    const entity = platformEntity(kind, kind === 'falling' ? { path: '0,96' } : kind === 'guided' ? { path: '0,0;32,-24;64,0' } : { radius: 24 });
    const level = terrainLevel([solid('floor', 0, 440, 640)], [entity]); level.subareas[0]!.spawn = { x: kind === 'rotating' ? 136 : 104, y: 100 };
    const result = await page.evaluate(({ level }) => { const q = window.__SAW_QA__!; q.load({ level }); const trace = []; for (let n = 0; n < 120; n++) { q.trace([{ held: [], pressed: [], released: [] }]); trace.push(q.simulation()); } return trace; }, { level });
    expect(result.every(s => s.player.mode !== 'dying' && s.player.supportId === 'platform'), kind).toBe(true);
    for (const s of result) { const surface = s.surfaces[0]!; expect(s.player.body.x + 16).toBeGreaterThan(surface.x); expect(s.player.body.x).toBeLessThan(surface.x + surface.width); }
    if (kind !== 'balance') expect(result.some(s => s.player.position.x !== level.subareas[0]!.spawn.x || s.player.position.y !== 100), kind).toBe(true);
    else expect(result.some(s => s.player.position.y !== 100)).toBe(true);
  }
});
test('actual keyboard arena traversal, jump and camera remain visible on desktop and mobile', async ({ page }, testInfo) => {
  await page.keyboard.down('ArrowRight');
  await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.simulation().player.position.x), { timeout: 10000 }).toBeGreaterThan(220);
  await page.keyboard.down('z');
  await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.simulation().player.velocity.y)).toBeLessThan(0);
  await page.keyboard.up('z'); await page.keyboard.up('ArrowRight');
  await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.camera().x)).toBeGreaterThan(0);
  await page.screenshot({ path: testInfo.outputPath('desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 }); await page.reload(); await page.getByRole('button', { name: 'Iniciar teste de controles' }).click();
  const right = page.getByRole('button', { name: 'Direita' }); await right.dispatchEvent('pointerdown', { pointerId: 22, pointerType: 'touch' });
  await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.simulation().player.position.x)).toBeGreaterThan(70);
  await right.dispatchEvent('pointerup', { pointerId: 22, pointerType: 'touch' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('mobile.png'), fullPage: true });
});
