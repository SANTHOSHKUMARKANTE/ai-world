import { expect, test } from '@playwright/test';

const NARUTO_ID = '93000000-0000-4000-8000-000000000001';
const SASUKE_ID = '93000000-0000-4000-8000-000000000002';

function discoveryBody() {
  return {
    items: [
      {
        resourceId: NARUTO_ID,
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        slug: 'naruto-uzumaki',
        displayName: 'Naruto Uzumaki',
        summary: 'A determined shinobi.',
        updatedAt: '2026-08-25T04:00:00.000Z',
        previewMedia: null,
      },
      {
        resourceId: SASUKE_ID,
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        slug: 'sasuke-uchiha',
        displayName: 'Sasuke Uchiha',
        summary: 'A gifted shinobi.',
        updatedAt: '2026-08-24T03:00:00.000Z',
        previewMedia: null,
      },
    ],
  };
}

test.describe('UXP-03A Anime Universe route foundation', () => {
  test('connects /anime to the real typed discovery contract without pulling the finished landing forward', async ({
    page,
  }) => {
    let discoveryRequests = 0;

    await page.route('**/api/knowledge/discovery?*', async (route) => {
      const url = new URL(route.request().url());

      expect(url.searchParams.get('universeKey')).toBe('universe.anime');
      expect(url.searchParams.get('resourceType')).toBe('anime.character');
      expect(url.searchParams.get('limit')).toBe('6');

      discoveryRequests += 1;

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(discoveryBody()),
      });
    });

    const response = await page.goto('/anime');
    expect(response?.status()).toBe(200);

    const main = page.locator('main[data-uxp03a-route-foundation="true"]');
    await expect(main).toBeVisible();
    await expect(main).toHaveAttribute('data-universe', 'universe.anime');
    await expect(main).toHaveAttribute('data-universe-tone', 'anime');
    await expect(main).toHaveAttribute('data-universe-motion', 'energetic');

    await expect(page.getByRole('heading', { level: 1, name: 'Anime' })).toBeVisible();

    const foundation = page.locator('[data-uxp03a-discovery-foundation="true"]');
    await expect(foundation).toHaveAttribute('data-discovery-status', 'ready');
    await expect(foundation).toHaveAttribute('data-discovery-count', '2');
    expect(discoveryRequests).toBe(1);

    await expect(page.getByText('Naruto Uzumaki')).toHaveCount(0);
    await expect(page.getByText('Sasuke Uchiha')).toHaveCount(0);
    await expect(page.getByText('Recently Updated Characters')).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Explore Characters/i })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Search Anime/i })).toHaveCount(0);
    await expect(main.getByRole('status')).toHaveCount(0);
    await expect(main.getByRole('alert')).toHaveCount(0);

    await page.screenshot({
      path: '.playwright/uxp-03a-anime-route-foundation.png',
      fullPage: true,
    });
  });
});
