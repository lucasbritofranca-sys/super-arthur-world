import { test, expect } from '@playwright/test';
test('actual Phaser browser foundation boots once and uses explicit entry', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await expect(page.locator('canvas')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Arthur começa por aqui.' })).toBeVisible();
  expect(await page.evaluate(() => window.__SAW_QA__!.state().paused)).toBe(true);
  await page.getByRole('button', { name: 'Iniciar teste de controles' }).click();
  await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.state().tick)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  const tick = await page.evaluate(() => window.__SAW_QA__!.state().tick);
  await page.waitForTimeout(150); expect(await page.evaluate(() => window.__SAW_QA__!.state().tick)).toBe(tick);
  expect(await page.evaluate(() => window.__SAW_QA__!.state().phaserInstances)).toBe(1);
  await page.screenshot({ path: '.compozy/tasks/super-arthur-world/evidence/task_01/desktop.png', fullPage: true });
  expect(errors).toEqual([]);
});
test('mobile foundation keeps readable controls inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/'); await expect(page.locator('canvas')).toHaveCount(1);
  await page.getByRole('button', { name: 'Iniciar teste de controles' }).click();
  await expect(page.locator('#status')).toHaveText('Controles ativos');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const button of await page.locator('[data-action]').all()) {
    const bounds = await button.boundingBox(); expect(bounds?.width).toBeGreaterThanOrEqual(48); expect(bounds?.height).toBeGreaterThanOrEqual(48);
  }
  await page.screenshot({ path: '.compozy/tasks/super-arthur-world/evidence/task_01/mobile.png', fullPage: true });
});
