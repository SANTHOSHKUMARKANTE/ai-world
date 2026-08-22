import { resolve } from 'node:path';

import { defineConfig, devices } from '@playwright/test';

const webOrigin = 'http://127.0.0.1:3100';
const apiOrigin = 'http://127.0.0.1:3001';

const localDatabaseUrl = 'postgresql://ai_world:ai_world@127.0.0.1:55432/ai_world';

const isCI = Boolean(process.env.CI);
const useSystemChrome = process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === 'true';

function resolveDatabaseUrl(): string {
  const configuredDatabaseUrl = process.env.DATABASE_URL;

  if (configuredDatabaseUrl) {
    return configuredDatabaseUrl;
  }

  if (isCI) {
    throw new Error('DATABASE_URL must be configured for Playwright E2E in CI.');
  }

  return localDatabaseUrl;
}

const databaseUrl = resolveDatabaseUrl();

const webDirectory = __dirname;
const apiDirectory = resolve(webDirectory, '../api');

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
    baseURL: webOrigin,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(useSystemChrome ? { channel: 'chrome' } : {}),
      },
    },
  ],

  webServer: [
    {
      name: 'API',
      cwd: apiDirectory,
      command: 'pnpm run start',
      url: `${apiOrigin}/session`,
      reuseExistingServer: !isCI,
      timeout: 120_000,
      stdout: 'pipe',
      stderr: 'pipe',
      env: {
        AI_WORLD_ENV: 'test',
        NODE_ENV: 'test',
        PORT: '3001',
        DATABASE_URL: databaseUrl,
        LOG_LEVEL: 'warn',
      },
    },
    {
      name: 'Web',
      cwd: webDirectory,
      command: 'pnpm run dev:e2e',
      url: webOrigin,
      reuseExistingServer: !isCI,
      timeout: 120_000,
      stdout: 'pipe',
      stderr: 'pipe',
      env: {
        AI_WORLD_API_ORIGIN: apiOrigin,
      },
    },
  ],
});
