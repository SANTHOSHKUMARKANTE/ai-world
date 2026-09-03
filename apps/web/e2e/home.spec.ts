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

test.describe('UXP-11A finished Home content foundation', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/knowledge/discovery?**', async (route) => {
      const url = new URL(route.request().url());
      const universeKey = url.searchParams.get('universeKey');
      const devotional = universeKey === 'universe.devotional';

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [
            {
              resourceId: devotional
                ? '11111111-1111-4111-8111-111111111111'
                : '22222222-2222-4222-8222-222222222222',
              universeKey,
              resourceType: devotional ? 'devotional.deity' : 'anime.character',
              slug: devotional ? 'shiva' : 'naruto-uzumaki',
              displayName: devotional ? 'Lord Shiva' : 'Naruto Uzumaki',
              summary: devotional
                ? 'Published Devotional Knowledge.'
                : 'Published Anime Knowledge.',
              updatedAt: '2026-09-03T08:00:00.000Z',
              previewMedia: null,
            },
          ],
        }),
      });
    });
  });

  test('connects each Universe and renders bounded published Knowledge', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Enter Devotional' })).toHaveAttribute(
      'href',
      '/devotional',
    );
    await expect(page.getByRole('link', { name: 'Enter Anime' })).toHaveAttribute('href', '/anime');
    await expect(page.getByRole('heading', { name: 'Lord Shiva' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Naruto Uzumaki' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Open Lord Shiva' })).toHaveAttribute(
      'href',
      '/devotional/shiva',
    );
    await expect(page.getByRole('link', { name: 'Open Naruto Uzumaki' })).toHaveAttribute(
      'href',
      '/anime/characters/naruto-uzumaki',
    );
  });
});
