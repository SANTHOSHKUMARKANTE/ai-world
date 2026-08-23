import { expect, test } from '@playwright/test';

test.describe('WPR-M04 published Experience', () => {
  test('renders published Block, Knowledge and Media composition without authentication', async ({
    page,
  }) => {
    const pageId = '11111111-1111-4111-8111-111111111111';
    const knowledgeId = '22222222-2222-4222-8222-222222222222';
    const assetId = '33333333-3333-4333-8333-333333333333';

    await page.setViewportSize({ width: 390, height: 844 });

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

    await page.route(`**/api/composition/public/pages/${pageId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: {
            id: pageId,
            universeKey: 'universe.devotional',
            routePath: '/experience-proof',
            title: 'Published Experience',
            lifecycle: 'PUBLISHED',
          },
          items: [
            {
              position: 0,
              kind: 'BLOCK',
              id: '44444444-4444-4444-8444-444444444444',
              blockType: 'composition.block.text',
              text: 'First published composition item.',
            },
            {
              position: 1,
              kind: 'KNOWLEDGE_RESOURCE',
              id: knowledgeId,
              resourceType: 'devotional.temple',
              lifecycle: 'PUBLISHED',
            },
            {
              position: 2,
              kind: 'MEDIA_ASSET',
              id: assetId,
            },
          ],
        }),
      });
    });

    await page.route(`**/api/media/assets/${assetId}/content`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
          'base64',
        ),
      });
    });

    const response = await page.goto(`/experiences/${pageId}`);
    expect(response?.status()).toBe(200);

    await expect(
      page.getByRole('heading', { level: 1, name: 'Published Experience' }),
    ).toBeVisible();
    await expect(page.getByText('Devotional · Published Experience')).toBeVisible();

    const items = page
      .getByRole('list', { name: 'Published experience content' })
      .getByRole('listitem');
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toContainText('First published composition item.');
    await expect(items.nth(1).getByRole('heading', { name: 'Temple' })).toBeVisible();
    await expect(
      items.nth(1).getByRole('link', { name: 'Open Knowledge resource' }),
    ).toHaveAttribute('href', `/knowledge/resources/${knowledgeId}`);
    await expect(items.nth(2).getByRole('img')).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});
