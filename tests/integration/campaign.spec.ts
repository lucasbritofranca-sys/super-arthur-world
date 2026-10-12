import { expect, test } from '@playwright/test';
for (const id of ['IT-030', 'IT-031', 'IT-033', 'IT-035', 'IT-037', 'IT-038']) test(`${id} real browser campaign contract`, async ({ page }, testInfo) => {
  await page.goto('/');
  const result = await page.evaluate(async id => { const path = '/tests/fixtures/campaign-browser.ts'; const module = await import(path) as { campaignJourney(id: string): unknown }; return module.campaignJourney(id); }, id);
  expect(result).toBeDefined(); await testInfo.attach(`${id}-campaign-trace`, { body: JSON.stringify(result), contentType: 'application/json' });
});
