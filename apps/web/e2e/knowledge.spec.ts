import { expect, test } from '@playwright/test';

interface PublicKnowledgeFixture {
  readonly id: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

test.describe('Web Knowledge experience', () => {
  test('renders Devotional as primary and Anime through the shared public Knowledge contract', async ({
    page,
  }) => {
    const requestedUniverses: string[] = [];

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
                id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
                universeKey: 'universe.devotional',
                resourceType: 'devotional.deity',
                createdAt: '2026-08-16T05:00:00.000Z',
                updatedAt: '2026-08-16T05:10:00.000Z',
              },
            ]
          : universeKey === 'universe.anime'
            ? [
                {
                  id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
                  universeKey: 'universe.anime',
                  resourceType: 'anime.series',
                  createdAt: '2026-08-16T04:00:00.000Z',
                  updatedAt: '2026-08-16T04:10:00.000Z',
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
        name: 'Deity',
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      anime.getByRole('heading', {
        name: 'Series',
        exact: true,
      }),
    ).toBeVisible();

    await expect(devotional.getByText('devotional.deity')).toBeVisible();
    await expect(anime.getByText('anime.series')).toBeVisible();

    expect(requestedUniverses).toEqual(
      expect.arrayContaining(['universe.devotional', 'universe.anime']),
    );
  });
});
