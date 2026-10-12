import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => { await page.goto('/'); await page.getByRole('button', { name: 'Iniciar teste de controles' }).click(); });
test('IT-004 blur clears held keyboard input and focus cannot resume it', async ({ page }) => {
  await page.keyboard.down('ArrowRight');
  await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.state().held)).toContain('right');
  await page.evaluate(() => { window.dispatchEvent(new Event('blur')); window.dispatchEvent(new Event('focus')); });
  await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.state().paused)).toBe(true);
  await page.getByRole('button', { name: 'Retomar' }).click();
  await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.state().held)).toEqual([]);
  await page.keyboard.up('ArrowRight');
});
test('IT-006 active gamepad disconnect pauses and empties held actions', async ({ page }) => {
  await page.evaluate(() => window.__SAW_QA__!.gamepads([{ index: 0, connected: true, axes: [0, 0], buttons: [] }]));
  await page.evaluate(() => window.__SAW_QA__!.gamepads([{ index: 0, connected: true, axes: [0, 0], buttons: [true] }]));
  await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.state().held)).toContain('jump');
  await page.evaluate(() => window.__SAW_QA__!.gamepads([]));
  await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.state().paused)).toBe(true);
  await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.state().held)).toEqual([]);
});
test('IT-007 touch cancellation and orientation clear Right and retain pause', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Direita' });
  const box = await button.boundingBox(); if (!box) throw new Error('touch_control_missing');
  await button.dispatchEvent('pointerdown', { pointerId: 1, pointerType: 'touch', clientX: box.x + 10, clientY: box.y + 10 });
  await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.state().held)).toContain('right');
  await page.evaluate(() => { window.dispatchEvent(new PointerEvent('pointercancel', { pointerId: 1 })); window.dispatchEvent(new Event('orientationchange')); });
  await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.state().paused)).toBe(true);
  await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.state().held)).toEqual([]);
});
