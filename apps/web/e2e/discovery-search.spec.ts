import { expect, test } from '@playwright/test';

test.describe('Phase 6 Web Discovery integration', () => {
  test('supports global Search, Universe filters, and Resource navigation', async ({ page }) => {
    const animeId = '11111111-1111-4111-8111-111111111111';
    const devotionalId = '22222222-2222-4222-8222-222222222222';
    const searchRequests: URL[] = [];

    await page.route('**/api/discovery/search?*', async (route) => {
      const url = new URL(route.request().url());
      searchRequests.push(url);
      const universeKey = url.searchParams.get('universeKey');
      const resourceTypes = url.searchParams.getAll('resourceType');
      if (universeKey === 'universe.devotional' && !resourceTypes.includes('devotional.temple')) {
        throw new Error('Expected Devotional temple filter.');
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items:
            universeKey === 'universe.devotional'
              ? [
                  {
                    resourceId: devotionalId,
                    resourceType: 'devotional.temple',
                    universeKey: 'universe.devotional',
                  },
                ]
              : [
                  {
                    resourceId: animeId,
                    resourceType: 'anime.character',
                    universeKey: 'universe.anime',
                  },
                  {
                    resourceId: devotionalId,
                    resourceType: 'devotional.temple',
                    universeKey: 'universe.devotional',
                  },
                ],
          pagination: { offset: 0, limit: 20 },
        }),
      });
    });

    await page.route(`**/api/knowledge/resources/${devotionalId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: devotionalId,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.temple',
          createdAt: '2026-08-18T09:00:00.000Z',
          updatedAt: '2026-08-18T09:10:00.000Z',
        }),
      });
    });

    expect((await page.goto('/search'))?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'Search AI World', level: 1 })).toBeVisible();
    await page.getByLabel('Search query').fill('A');
    await page.getByRole('button', { name: 'Search' }).click();
    const results = page.getByRole('list', { name: 'Search results' });
    await expect(results.getByText('anime.character')).toBeVisible();
    await expect(results.getByText('devotional.temple')).toBeVisible();
    expect(searchRequests[0]?.searchParams.get('universeKey')).toBeNull();

    await page.getByLabel('Search scope').selectOption('universe.devotional');
    await page.getByLabel('Devotional temple').check();
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(results.getByText('devotional.temple')).toBeVisible();
    await expect(results.getByText('anime.character')).toHaveCount(0);
    const scoped = searchRequests.at(-1);
    expect(scoped?.searchParams.get('universeKey')).toBe('universe.devotional');
    expect(scoped?.searchParams.getAll('resourceType')).toContain('devotional.temple');

    await results.getByRole('link', { name: 'Open resource' }).click();
    await expect(page).toHaveURL(new RegExp(`/knowledge/resources/${devotionalId}$`));
    await expect(page.getByRole('heading', { name: 'devotional.temple' })).toBeVisible();
    await expect(page.getByText('universe.devotional')).toBeVisible();
  });
});
