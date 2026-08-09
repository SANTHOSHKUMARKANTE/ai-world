import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:3100';
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './e2e',

  fullyParallel: true,

  forbidOnly: isCI,

  retries: isCI ? 2 : 0,

  ...(isCI
    ? {
        workers: 1,
      }
    : {}),

  reporter: 'list',

  outputDir: '.playwright/test-results',

  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  webServer: {
    command: 'pnpm run dev:e2e',
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
