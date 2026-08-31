import { expect, test } from '@playwright/test';

test.describe('Web Knowledge experience', () => {
  test('reuses public Knowledge discovery identity and canonical destinations across Universes', async ({
    page,
  }) => {
    const templeResourceId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    const animeCharacterResourceId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
    const animeSeriesResourceId = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';

    const templeAssetId = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
    const animeCharacterAssetId = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
    const animeSeriesAssetId = 'ffffffff-ffff-4fff-8fff-ffffffffffff';

    const requestedUniverses: string[] = [];
    const requestedThumbnailAssetIds: string[] = [];

    await page.route('**/api/session', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'identity.session.invalid',
            message: 'Authentication is required.',
            status: 401,
          },
        }),
      });
    });

    await page.route('**/api/media/assets/*/thumbnail', async (route) => {
      const url = new URL(route.request().url());
      const match = url.pathname.match(/\/api\/media\/assets\/([^/]+)\/thumbnail$/);
      const assetId = match?.[1] ?? '';

      requestedThumbnailAssetIds.push(assetId);

      await route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
          'base64',
        ),
      });
    });

    await page.route('**/api/knowledge/discovery?*', async (route) => {
      const url = new URL(route.request().url());
      const universeKey = url.searchParams.get('universeKey');

      expect(url.searchParams.get('limit')).toBe('8');
      expect(url.searchParams.get('resourceType')).toBeNull();

      if (!universeKey) {
        await route.fulfill({ status: 400, body: '{}' });
        return;
      }

      requestedUniverses.push(universeKey);

      const items =
        universeKey === 'universe.devotional'
          ? [
              {
                resourceId: templeResourceId,
                universeKey,
                resourceType: 'devotional.temple',
                slug: 'kashi-vishwanath',
                displayName: 'Kashi Vishwanath Temple',
                summary: 'A published sacred-place Knowledge fixture.',
                updatedAt: '2026-08-30T08:00:00.000Z',
                previewMedia: {
                  assetId: templeAssetId,
                  assetType: 'IMAGE',
                  mimeType: 'image/png',
                  playback: 'STILL',
                  posterAssetId: null,
                  altText: 'Kashi Vishwanath Temple',
                },
              },
            ]
          : [
              {
                resourceId: animeCharacterResourceId,
                universeKey,
                resourceType: 'anime.character',
                slug: 'naruto-uzumaki',
                displayName: 'Naruto Uzumaki',
                summary: 'A published Anime Character Knowledge fixture.',
                updatedAt: '2026-08-30T09:00:00.000Z',
                previewMedia: {
                  assetId: animeCharacterAssetId,
                  assetType: 'IMAGE',
                  mimeType: 'image/png',
                  playback: 'STILL',
                  posterAssetId: null,
                  altText: 'Naruto Uzumaki',
                },
              },
              {
                resourceId: animeSeriesResourceId,
                universeKey,
                resourceType: 'anime.series',
                slug: 'naruto',
                displayName: 'Naruto',
                summary: 'A published Anime Series Knowledge fixture.',
                updatedAt: '2026-08-30T07:00:00.000Z',
                previewMedia: {
                  assetId: animeSeriesAssetId,
                  assetType: 'IMAGE',
                  mimeType: 'image/png',
                  playback: 'STILL',
                  posterAssetId: null,
                  altText: 'Naruto series',
                },
              },
            ];

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items }),
      });
    });

    const response = await page.goto('/knowledge');
    expect(response?.status()).toBe(200);

    await expect(
      page.getByRole('heading', {
        name: 'Explore published Knowledge',
        level: 1,
      }),
    ).toBeVisible();

    const devotional = page.getByRole('region', { name: 'Devotional Knowledge' });
    const anime = page.getByRole('region', { name: 'Anime Knowledge' });

    await expect(
      devotional.getByRole('heading', { name: 'Kashi Vishwanath Temple' }),
    ).toBeVisible();
    await expect(anime.getByRole('heading', { name: 'Naruto Uzumaki' })).toBeVisible();
    await expect(anime.getByRole('heading', { name: 'Naruto', exact: true })).toBeVisible();

    await expect(
      devotional.getByRole('link', { name: 'Open Kashi Vishwanath Temple' }),
    ).toHaveAttribute('href', `/knowledge/resources/${templeResourceId}`);
    await expect(anime.getByRole('link', { name: 'Open Naruto Uzumaki' })).toHaveAttribute(
      'href',
      '/anime/characters/naruto-uzumaki',
    );
    await expect(anime.getByRole('link', { name: 'Open Naruto', exact: true })).toHaveAttribute(
      'href',
      '/anime/series/naruto',
    );

    await expect(page.getByText(templeResourceId, { exact: true })).toHaveCount(0);
    await expect(page.getByText(animeCharacterResourceId, { exact: true })).toHaveCount(0);
    await expect(page.getByText(animeSeriesResourceId, { exact: true })).toHaveCount(0);

    expect([...new Set(requestedUniverses)].sort()).toEqual([
      'universe.anime',
      'universe.devotional',
    ]);
    expect([...new Set(requestedThumbnailAssetIds)].sort()).toEqual(
      [animeCharacterAssetId, animeSeriesAssetId, templeAssetId].sort(),
    );
  });
});
