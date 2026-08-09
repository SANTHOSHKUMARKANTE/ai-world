import { expect, test } from '@playwright/test';

test.describe('Web browser baseline', () => {
  test('serves the application home page in Chromium', async ({ page }) => {
    const response = await page.goto('/');

    expect(response?.status()).toBe(200);

    await expect(page.locator('body')).toBeVisible();
  });
});
