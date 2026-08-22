import { expect, test } from '@playwright/test';

test.describe('WPR-M01 Web product shell', () => {
  test('serves a coherent accessible application shell', async ({ page }) => {
    const response = await page.goto('/');

    expect(response?.status()).toBe(200);

    await expect(page.getByRole('banner')).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 1, name: 'One world. Many universes.' }),
    ).toBeVisible();

    const primaryNavigation = page.getByRole('navigation', { name: 'Primary' });

    await expect(primaryNavigation).toBeVisible();
    await expect(
      primaryNavigation.getByRole('link', { name: 'Explore', exact: true }),
    ).toHaveAttribute('href', '/knowledge');
    await expect(
      primaryNavigation.getByRole('link', { name: 'Search', exact: true }),
    ).toHaveAttribute('href', '/search');
    await expect(
      primaryNavigation.getByRole('link', { name: 'Create', exact: true }),
    ).toHaveAttribute('href', '/creator');
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('keeps the primary shell usable at a narrow mobile viewport', async ({ page }) => {
    await page.setViewportSize({
      width: 390,
      height: 844,
    });

    const response = await page.goto('/');

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { level: 1, name: 'One world. Many universes.' }),
    ).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );

    expect(hasHorizontalOverflow).toBe(false);
  });
});
