import { expect, test } from '@playwright/test';

interface PublicKnowledgeFixture {
  readonly id: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

test.describe('Web Knowledge experience', () => {
  test('renders Devotional Temple and Anime Character/Series imagery through the same Knowledge and Media contracts', async ({
    page,
  }) => {
    const templeResourceId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    const animeCharacterResourceId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
    const animeSeriesResourceId = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';

    const templeAssetId = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
    const animeCharacterAssetId = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
    const animeSeriesAssetId = 'ffffffff-ffff-4fff-8fff-ffffffffffff';

    const requestedUniverses: string[] = [];
    const requestedAssetReferenceResourceIds: string[] = [];
    const requestedThumbnailAssetIds: string[] = [];

    const assetIdsByResourceId: Readonly<Record<string, readonly string[]>> = {
      [templeResourceId]: [templeAssetId],
      [animeCharacterResourceId]: [animeCharacterAssetId],
      [animeSeriesResourceId]: [animeSeriesAssetId],
    };

    await page.route('**/api/session', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'identity.session.invalid',
            message: 'Authentication is required.',
            status: 401,
            requestId: 'web-knowledge-anonymous-session-001',
          },
        }),
      });
    });

    await page.route('**/api/knowledge/resources/*/assets', async (route) => {
      const url = new URL(route.request().url());
      const match = url.pathname.match(/\/api\/knowledge\/resources\/([^/]+)\/assets$/);
      const resourceId = match?.[1] ?? '';

      requestedAssetReferenceResourceIds.push(resourceId);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          assetIds: assetIdsByResourceId[resourceId] ?? [],
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

    await page.route('**/api/knowledge/resources?*', async (route) => {
      const url = new URL(route.request().url());
      const universeKey = url.searchParams.get('universeKey');

      if (!universeKey) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: {
              code: 'knowledge.public.invalid_query',
              message: 'The public Knowledge query is invalid.',
              status: 400,
            },
          }),
        });
        return;
      }

      requestedUniverses.push(universeKey);

      const fixtures: readonly PublicKnowledgeFixture[] =
        universeKey === 'universe.devotional'
          ? [
              {
                id: templeResourceId,
                universeKey: 'universe.devotional',
                resourceType: 'devotional.temple',
                createdAt: '2026-08-16T05:00:00.000Z',
                updatedAt: '2026-08-16T05:10:00.000Z',
              },
            ]
          : universeKey === 'universe.anime'
            ? [
                {
                  id: animeCharacterResourceId,
                  universeKey: 'universe.anime',
                  resourceType: 'anime.character',
                  createdAt: '2026-08-17T05:00:00.000Z',
                  updatedAt: '2026-08-17T05:10:00.000Z',
                },
                {
                  id: animeSeriesResourceId,
                  universeKey: 'universe.anime',
                  resourceType: 'anime.series',
                  createdAt: '2026-08-17T04:00:00.000Z',
                  updatedAt: '2026-08-17T04:10:00.000Z',
                },
              ]
            : [];

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: fixtures,
        }),
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

    const devotional = page.getByRole('region', {
      name: 'Devotional Resources',
    });
    const anime = page.getByRole('region', {
      name: 'Anime Resources',
    });

    await expect(devotional).toHaveAttribute('data-priority', 'primary');
    await expect(anime).toHaveAttribute('data-priority', 'secondary');

    await expect(
      devotional.getByRole('heading', {
        name: 'Temple',
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      anime.getByRole('heading', {
        name: 'Character',
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      anime.getByRole('heading', {
        name: 'Series',
        exact: true,
      }),
    ).toBeVisible();

    const templeImage = devotional.getByRole('img', {
      name: 'Temple imagery for this published resource',
    });
    const templeFullImageLink = devotional.getByRole('link', {
      name: 'Open full-size temple imagery',
    });

    await expect(templeImage).toBeVisible();

    expect(new URL((await templeImage.getAttribute('src')) ?? '', page.url()).pathname).toBe(
      `/api/media/assets/${templeAssetId}/thumbnail`,
    );
    await expect(templeFullImageLink).toHaveAttribute(
      'href',
      `/api/media/assets/${templeAssetId}/content`,
    );

    const characterImagery = anime.getByRole('region', {
      name: 'Anime imagery for anime.character',
    });
    const seriesImagery = anime.getByRole('region', {
      name: 'Anime imagery for anime.series',
    });

    const characterImage = characterImagery.getByRole('img', {
      name: 'Anime imagery for this published resource',
    });
    const seriesImage = seriesImagery.getByRole('img', {
      name: 'Anime imagery for this published resource',
    });

    await expect(characterImage).toBeVisible();
    await expect(seriesImage).toBeVisible();

    expect(new URL((await characterImage.getAttribute('src')) ?? '', page.url()).pathname).toBe(
      `/api/media/assets/${animeCharacterAssetId}/thumbnail`,
    );
    expect(new URL((await seriesImage.getAttribute('src')) ?? '', page.url()).pathname).toBe(
      `/api/media/assets/${animeSeriesAssetId}/thumbnail`,
    );

    await expect(
      characterImagery.getByRole('link', {
        name: 'Open full-size anime imagery',
      }),
    ).toHaveAttribute('href', `/api/media/assets/${animeCharacterAssetId}/content`);
    await expect(
      seriesImagery.getByRole('link', {
        name: 'Open full-size anime imagery',
      }),
    ).toHaveAttribute('href', `/api/media/assets/${animeSeriesAssetId}/content`);

    expect(requestedUniverses).toEqual(
      expect.arrayContaining(['universe.devotional', 'universe.anime']),
    );

    const uniqueResourceIds = [...new Set(requestedAssetReferenceResourceIds)];
    expect(uniqueResourceIds).toHaveLength(3);
    expect(uniqueResourceIds).toEqual(
      expect.arrayContaining([templeResourceId, animeCharacterResourceId, animeSeriesResourceId]),
    );

    const uniqueThumbnailAssetIds = [...new Set(requestedThumbnailAssetIds)];
    expect(uniqueThumbnailAssetIds).toHaveLength(3);
    expect(uniqueThumbnailAssetIds).toEqual(
      expect.arrayContaining([templeAssetId, animeCharacterAssetId, animeSeriesAssetId]),
    );
  });
});
