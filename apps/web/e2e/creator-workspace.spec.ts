import { expect, test } from '@playwright/test';

test.describe('Creator workspace', () => {
  test('creates owner-backed content and saves ordered Page composition', async ({ page }) => {
    const pageId = '11111111-1111-4111-8111-111111111111';
    const knowledgeId = '22222222-2222-4222-8222-222222222222';
    const blockId = '33333333-3333-4333-8333-333333333333';
    const assetId = '44444444-4444-4444-8444-444444444444';
    let savedItems: unknown = null;

    await page.route('**/api/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          actorId: 'creator-e2e-actor',
          expiresAt: '2026-08-22T12:00:00.000Z',
        }),
      });
    });

    await page.route('**/api/composition/pages', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: pageId,
          universeKey: 'universe.devotional',
          routePath: '/creator-e2e',
          title: 'Creator E2E',
          lifecycle: 'DRAFT',
          createdAt: '2026-08-21T12:00:00.000Z',
          updatedAt: '2026-08-21T12:00:00.000Z',
        }),
      });
    });

    await page.route('**/api/knowledge/resources', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: knowledgeId,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.deity',
          lifecycle: 'DRAFT',
          createdAt: '2026-08-21T12:01:00.000Z',
          updatedAt: '2026-08-21T12:01:00.000Z',
        }),
      });
    });

    await page.route('**/api/composition/blocks/text', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: blockId,
          universeKey: 'universe.devotional',
          blockType: 'composition.block.text',
          text: 'Welcome to the creator proof.',
          createdAt: '2026-08-21T12:02:00.000Z',
          updatedAt: '2026-08-21T12:02:00.000Z',
        }),
      });
    });

    await page.route('**/api/media/assets', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: assetId,
          assetType: 'IMAGE',
          lifecycle: 'ACTIVE',
        }),
      });
    });

    await page.route(`**/api/composition/pages/${pageId}/composition`, async (route) => {
      savedItems = route.request().postDataJSON();
      const request = savedItems as { items: readonly { kind: string; id: string }[] };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          pageId,
          items: request.items.map((item, position) => ({ position, ...item })),
        }),
      });
    });

    await page.route(`**/api/composition/pages/${pageId}/publish`, async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: pageId,
          universeKey: 'universe.devotional',
          routePath: '/creator-e2e',
          title: 'Creator E2E',
          lifecycle: 'PUBLISHED',
          createdAt: '2026-08-21T12:00:00.000Z',
          updatedAt: '2026-08-22T12:00:00.000Z',
        }),
      });
    });

    await page.route(`**/api/composition/pages/${pageId}/archive`, async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: pageId,
          universeKey: 'universe.devotional',
          routePath: '/creator-e2e',
          title: 'Creator E2E',
          lifecycle: 'ARCHIVED',
          createdAt: '2026-08-21T12:00:00.000Z',
          updatedAt: '2026-08-22T12:01:00.000Z',
        }),
      });
    });

    await page.goto('/creator');
    await expect(page.getByRole('heading', { name: 'Creator workspace', level: 1 })).toBeVisible();

    await page.getByLabel('Route path').fill('/creator-e2e');
    await page.getByLabel('Presentation title').fill('Creator E2E');
    await page.getByRole('button', { name: 'Create draft Page' }).click();
    await expect(page.getByRole('status')).toContainText('created as a DRAFT');

    await page.getByRole('button', { name: 'Create Knowledge draft' }).click();
    await expect(page.getByRole('button', { name: /Add Knowledge/ })).toBeVisible();

    await page.getByLabel('Text content').fill('Welcome to the creator proof.');
    await page.getByRole('button', { name: 'Create Text Block' }).click();
    await expect(page.getByRole('button', { name: /Add Block/ })).toBeVisible();

    await page.getByLabel('Image file').setInputFiles({
      name: 'creator-proof.png',
      mimeType: 'image/png',
      buffer: Buffer.from('creator-media-proof'),
    });
    await page.getByRole('button', { name: 'Upload Media Asset' }).click();
    await expect(page.getByRole('button', { name: /Add Media/ })).toBeVisible();

    await page.getByRole('button', { name: /Add Knowledge/ }).click();
    await page.getByRole('button', { name: /Add Block/ }).click();
    await page.getByRole('button', { name: /Add Media/ }).click();
    await expect(
      page.getByRole('list', { name: 'Page composition order' }).getByRole('listitem'),
    ).toHaveCount(3);

    await page.getByRole('button', { name: 'Move item 2 up' }).click();
    await page.getByRole('button', { name: 'Save composition' }).click();
    await expect(page.getByRole('status')).toHaveText('Saved 3 ordered composition items.');

    expect(savedItems).toEqual({
      items: [
        { kind: 'BLOCK', id: blockId },
        { kind: 'KNOWLEDGE_RESOURCE', id: knowledgeId },
        { kind: 'MEDIA_ASSET', id: assetId },
      ],
    });

    await page.getByRole('button', { name: 'Publish Page' }).click();
    await expect(page.getByRole('button', { name: 'Archive Page' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save composition' })).toBeDisabled();

    await page.getByRole('button', { name: 'Archive Page' }).click();
    await expect(page.getByText('Archived Pages are terminal and read-only.')).toBeVisible();
  });

  test('renders a controlled saved draft preview in typed composition order', async ({ page }) => {
    test.setTimeout(60_000);

    const pageId = '11111111-1111-4111-8111-111111111111';
    const assetId = '44444444-4444-4444-8444-444444444444';

    await page.route('**/api/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          actorId: 'preview-e2e-actor',
          expiresAt: '2026-08-22T12:00:00.000Z',
        }),
      });
    });

    await page.route(`**/api/composition/pages/${pageId}/preview`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: {
            id: pageId,
            universeKey: 'universe.devotional',
            routePath: '/preview-e2e',
            title: 'Controlled preview E2E',
            lifecycle: 'DRAFT',
          },
          items: [
            {
              position: 0,
              kind: 'BLOCK',
              id: '22222222-2222-4222-8222-222222222222',
              blockType: 'composition.block.text',
              text: 'First saved preview item.',
            },
            {
              position: 1,
              kind: 'KNOWLEDGE_RESOURCE',
              id: '33333333-3333-4333-8333-333333333333',
              resourceType: 'devotional.deity',
              lifecycle: 'DRAFT',
            },
            { position: 2, kind: 'MEDIA_ASSET', id: assetId },
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

    await page.goto(`/creator/preview/${pageId}`);
    await expect(page.getByRole('heading', { name: 'Controlled preview E2E' })).toBeVisible();
    await expect(page.getByText('Draft preview', { exact: true })).toBeVisible();

    const items = page.getByRole('list', { name: 'Saved draft preview' }).getByRole('listitem');
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toContainText('First saved preview item.');
    await expect(items.nth(1)).toContainText('devotional.deity');
    await expect(items.nth(2).getByRole('img')).toBeVisible();
  });

  test('reviews an AI suggestion before accepting canonical Knowledge', async ({ page }) => {
    const generationId = '55555555-5555-4555-8555-555555555555';
    const resourceId = '66666666-6666-4666-8666-666666666666';

    await page.route('**/api/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          actorId: 'ai-creator-e2e-actor',
          expiresAt: '2026-08-22T12:00:00.000Z',
        }),
      });
    });

    await page.route('**/api/composition/ai/knowledge-candidates', async (route) => {
      expect(route.request().postDataJSON()).toEqual({
        universeKey: 'universe.devotional',
        request: 'Suggest a Devotional Knowledge Resource type.',
        contextQuery: 'temple',
      });
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          generationId,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.temple',
          canonical: false,
          createdAt: '2026-08-22T11:00:00.000Z',
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
              id: resourceId,
              universeKey: 'universe.devotional',
              resourceType: 'devotional.temple',
              lifecycle: 'DRAFT',
              createdAt: '2026-08-22T11:01:00.000Z',
              updatedAt: '2026-08-22T11:01:00.000Z',
            },
          }),
        });
      },
    );

    await page.goto('/creator');
    await page
      .getByLabel('Assistance request')
      .fill('Suggest a Devotional Knowledge Resource type.');
    await page.getByLabel('Published Knowledge context search').fill('temple');
    await page.getByRole('button', { name: 'Generate AI suggestion' }).click();

    await expect(page.getByText('Non-canonical suggestion')).toBeVisible();
    await expect(page.getByText('devotional.temple', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Accept as Knowledge draft' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Add Knowledge/ })).toHaveCount(0);

    await page.getByRole('button', { name: 'Accept as Knowledge draft' }).click();

    await expect(page.getByText('Non-canonical suggestion')).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: /Add Knowledge.*devotional.temple/ }),
    ).toBeVisible();
    await expect(page.getByRole('status')).toContainText('accepted as a canonical Knowledge draft');
  });
});
