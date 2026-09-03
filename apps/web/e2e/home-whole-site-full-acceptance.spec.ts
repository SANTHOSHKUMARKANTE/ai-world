import { expect, test, type Page } from '@playwright/test';

const TEMPLE_ID = '11111111-1111-4111-8111-111111111111';

async function mockAnonymousSession(page: Page): Promise<void> {
  await page.route('**/api/session', (route) =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        error: {
          code: 'identity.session.invalid',
          message: 'Authentication is required.',
          status: 401,
        },
      }),
    }),
  );
}

test.describe('UXP-11D full Home and whole-site integration acceptance', () => {
  test('keeps Home to Search to generic detail continuity and restores Search history', async ({
    page,
  }) => {
    await mockAnonymousSession(page);

    await page.route('**/api/knowledge/discovery?**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [] }),
      }),
    );
    await page.route('**/api/discovery/search?*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [
            {
              resourceId: TEMPLE_ID,
              resourceType: 'devotional.temple',
              universeKey: 'universe.devotional',
            },
          ],
          pagination: { offset: 0, limit: 20 },
        }),
      }),
    );
    await page.route(`**/api/knowledge/resources/${TEMPLE_ID}`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: TEMPLE_ID,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.temple',
          createdAt: '2026-09-03T08:00:00.000Z',
          updatedAt: '2026-09-03T09:00:00.000Z',
        }),
      }),
    );
    await page.route(`**/api/knowledge/entities/by-resource/${TEMPLE_ID}`, (route) =>
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'knowledge.entity.public_not_found',
            message: 'Knowledge Entity not found.',
            status: 404,
          },
        }),
      }),
    );
    await page.route(`**/api/knowledge/resources/${TEMPLE_ID}/assets`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ assetIds: [] }),
      }),
    );

    await page.goto('/');
    await page.getByRole('link', { name: 'Search AI World' }).first().click();
    await page.getByLabel('Search query').fill('temple');
    await page.getByLabel('Search scope').selectOption('universe.devotional');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page).toHaveURL(/\/search\?query=temple&universeKey=universe\.devotional$/);
    await page.getByRole('link', { name: 'Explore Temple' }).click();

    await expect(page).toHaveURL(`/knowledge/resources/${TEMPLE_ID}`);
    await expect(page.getByRole('heading', { level: 1, name: 'Temple' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in' }).last()).toHaveAttribute(
      'href',
      `/sign-in?continueTo=${encodeURIComponent(`/knowledge/resources/${TEMPLE_ID}`)}`,
    );

    await page.goBack();

    await expect(page).toHaveURL(/\/search\?query=temple&universeKey=universe\.devotional$/);
    await expect(page.getByLabel('Search query')).toHaveValue('temple');
    await expect(page.getByLabel('Search scope')).toHaveValue('universe.devotional');
    await expect(page.getByRole('link', { name: 'Explore Temple' })).toBeVisible();
  });
});
