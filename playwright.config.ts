import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/integration',
  fullyParallel: false,
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'pnpm dev:qa', url: 'http://127.0.0.1:4173', reuseExistingServer: false },
  reporter: [['list'], ['json', { outputFile: 'test-results/integration.json' }]],
});
