import { expect, test } from '@playwright/test';

test.describe('P8-M09 Anime Composition proof', () => {
  test('uses the shared creator workspace for an Anime character spotlight', async ({ page }) => {
    const pageId = '11111111-1111-4111-8111-111111111119';
    const seriesId = '22222222-2222-4222-8222-222222222229';
    const characterId = '33333333-3333-4333-8333-333333333339';
    const blockId = '44444444-4444-4444-8444-444444444449';
    const generationId = '55555555-5555-4555-8555-555555555559';
    let savedItems: unknown = null;

    await page.route('**/api/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          actorId: 'anime-composition-e2e-actor',
          expiresAt: '2026-08-22T14:00:00.000Z',
        }),
      });
    });

    await page.route('**/api/composition/pages', async (route) => {
      expect(route.request().postDataJSON()).toEqual({
        universeKey: 'universe.anime',
        routePath: '/anime/home',
        title: 'Anime Home',
      });
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: pageId,
          universeKey: 'universe.anime',
          routePath: '/anime/home',
          title: 'Anime Home',
          lifecycle: 'DRAFT',
          createdAt: '2026-08-22T13:00:00.000Z',
          updatedAt: '2026-08-22T13:00:00.000Z',
        }),
      });
    });

    await page.route('**/api/knowledge/resources', async (route) => {
      expect(route.request().postDataJSON()).toEqual({
        universeKey: 'universe.anime',
        resourceType: 'anime.series',
      });
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: seriesId,
          universeKey: 'universe.anime',
          resourceType: 'anime.series',
          lifecycle: 'DRAFT',
          createdAt: '2026-08-22T13:01:00.000Z',
          updatedAt: '2026-08-22T13:01:00.000Z',
        }),
      });
    });

    await page.route('**/api/composition/ai/knowledge-candidates', async (route) => {
      expect(route.request().postDataJSON()).toEqual({
        universeKey: 'universe.anime',
        request: 'Suggest an Anime Character spotlight.',
        contextQuery: 'series',
      });
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          generationId,
          universeKey: 'universe.anime',
          resourceType: 'anime.character',
          canonical: false,
          createdAt: '2026-08-22T13:02:00.000Z',
        }),
      });
    });

    await page.route(
      `**/api/composition/ai/knowledge-candidates/${generationId}/accept`,
      async (route) => {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            generationId,
            canonical: true,
            canonicalOwner: 'knowledge',
            resource: {
              id: characterId,
              universeKey: 'universe.anime',
              resourceType: 'anime.character',
              lifecycle: 'DRAFT',
              createdAt: '2026-08-22T13:03:00.000Z',
              updatedAt: '2026-08-22T13:03:00.000Z',
            },
          }),
        });
      },
    );

    await page.route('**/api/composition/blocks/text', async (route) => {
      expect(route.request().postDataJSON()).toEqual({
        universeKey: 'universe.anime',
        text: 'Character spotlight grounded in its Series.',
      });
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: blockId,
          universeKey: 'universe.anime',
          blockType: 'composition.block.text',
          text: 'Character spotlight grounded in its Series.',
          createdAt: '2026-08-22T13:04:00.000Z',
          updatedAt: '2026-08-22T13:04:00.000Z',
        }),
      });
    });

    await page.route(`**/api/composition/pages/${pageId}/composition`, async (route) => {
      savedItems = route.request().postDataJSON();
      const input = savedItems as { items: readonly { kind: string; id: string }[] };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          pageId,
          items: input.items.map((item, position) => ({ position, ...item })),
        }),
      });
    });

    await page.route(`**/api/composition/pages/${pageId}/publish`, async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: pageId,
          universeKey: 'universe.anime',
          routePath: '/anime/home',
          title: 'Anime Home',
          lifecycle: 'PUBLISHED',
          createdAt: '2026-08-22T13:00:00.000Z',
          updatedAt: '2026-08-22T13:05:00.000Z',
        }),
      });
    });

    await page.goto('/creator');
    await page.getByLabel('Active Universe').fill('universe.anime');

    await page.getByLabel('Route path').fill('/anime/home');
    await page.getByLabel('Presentation title').fill('Anime Home');
    await page.getByRole('button', { name: 'Create draft Page' }).click();
    await expect(page.getByText('universe.anime', { exact: true })).toBeVisible();

    await page.getByLabel('Resource type', { exact: true }).fill('anime.series');
    await page.getByRole('button', { name: 'Create Knowledge draft' }).click();
    await expect(page.getByRole('button', { name: /Add Knowledge.*anime.series/ })).toBeVisible();

    await page.getByLabel('Assistance request').fill('Suggest an Anime Character spotlight.');
    await page.getByLabel('Published Knowledge context search').fill('series');
    await page.getByRole('button', { name: 'Generate AI suggestion' }).click();
    await expect(page.getByText('Non-canonical suggestion')).toBeVisible();
    await expect(page.getByText('anime.character', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Accept as Knowledge draft' }).click();
    await expect(
      page.getByRole('button', { name: /Add Knowledge.*anime.character/ }),
    ).toBeVisible();

    await page.getByLabel('Text content').fill('Character spotlight grounded in its Series.');
    await page.getByRole('button', { name: 'Create Text Block' }).click();

    await page.getByRole('button', { name: /Add Knowledge.*anime.character/ }).click();
    await page.getByRole('button', { name: /Add Knowledge.*anime.series/ }).click();
    await page.getByRole('button', { name: /Add Block.*Character spotlight/ }).click();
    await page.getByRole('button', { name: 'Save composition' }).click();
    await expect(page.getByRole('status')).toHaveText('Saved 3 ordered composition items.');

    expect(savedItems).toEqual({
      items: [
        { kind: 'KNOWLEDGE_RESOURCE', id: characterId },
        { kind: 'KNOWLEDGE_RESOURCE', id: seriesId },
        { kind: 'BLOCK', id: blockId },
      ],
    });

    await page.getByRole('button', { name: 'Publish Page' }).click();
    await expect(page.getByRole('status')).toContainText('published');
    await expect(page.getByRole('button', { name: 'Save composition' })).toBeDisabled();
  });
});
