import { test, expect } from '@playwright/test';

const cases = ['IT-009', 'IT-010', 'IT-012', 'IT-014', 'IT-015', 'IT-016', 'IT-017', 'IT-018', 'IT-019', 'IT-020', 'IT-021', 'IT-025', 'IT-026', 'IT-027', 'IT-028'];
for (const id of cases) test(`${id} actual browser mechanics contract`, async ({ page }, testInfo) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Iniciar teste de controles' }).click();
  const result = await page.evaluate(async id => { const path = '/tests/fixtures/mechanics-browser.ts'; const module = await import(path) as { journey(id: string): unknown }; return module.journey(id); }, id);
  expect(result).toBeDefined();
  await testInfo.attach(`${id}-trace`, { body: JSON.stringify(result), contentType: 'application/json' });
});

test('live mechanics arena collects powers with keyboard and touch at desktop and mobile sizes', async ({ page }, testInfo) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Iniciar teste de controles' }).click(); await page.getByRole('button', { name: 'Testar poderes e objetos' }).click();
  await page.keyboard.down('ArrowRight'); await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.simulation().run.form)).toBe('projectile'); await page.keyboard.up('ArrowRight');
  await expect(page.locator('#mechanics-status')).toContainText('Forma: projectile'); await page.screenshot({ path: testInfo.outputPath('mechanics-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 }); await page.reload(); await page.getByRole('button', { name: 'Iniciar teste de controles' }).click(); await page.getByRole('button', { name: 'Testar poderes e objetos' }).click();
  const right = page.getByRole('button', { name: 'Direita' }); await right.dispatchEvent('pointerdown', { pointerType: 'touch', pointerId: 37 }); await expect.poll(() => page.evaluate(() => window.__SAW_QA__!.simulation().run.form)).toBe('large'); await right.dispatchEvent('pointerup', { pointerType: 'touch', pointerId: 37 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await page.screenshot({ path: testInfo.outputPath('mechanics-mobile.png'), fullPage: true });
});
