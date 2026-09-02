import { expect, test } from '@playwright/test';

test.describe('Creator workspace', () => {
  test('selects existing Knowledge from the active Universe for typed management', async ({
    page,
  }) => {
    const resourceId = '22222222-2222-4222-8222-222222222222';
    await page.route('**/api/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          actorId: 'creator-list-e2e-actor',
          expiresAt: '2026-09-03T12:00:00.000Z',
        }),
      });
    });
    await page.route('**/api/knowledge/creator/resources?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [
            {
              id: resourceId,
              universeKey: 'universe.devotional',
              resourceType: 'devotional.deity',
              lifecycle: 'DRAFT',
            },
          ],
        }),
      });
    });

    await page.goto('/creator');
    await page.getByRole('button', { name: 'Refresh list' }).click();
    await expect(page.getByRole('status')).toContainText('Found 1 Knowledge Resources');
    await page.getByLabel('Existing Knowledge in active Universe').selectOption(resourceId);

    await expect(page.getByLabel('Deity Knowledge Resource ID')).toHaveValue(resourceId);
    await expect(page.getByText('Knowledge status: DRAFT')).toBeVisible();
  });

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
          assetType: 'AUDIO',
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
    const taskNavigation = page.getByRole('navigation', { name: 'Creator Studio tasks' });
    await expect(taskNavigation.getByRole('link', { name: 'Pages' })).toHaveAttribute(
      'href',
      '#creator-page-task',
    );
    await expect(taskNavigation.getByRole('link', { name: 'Composition' })).toHaveAttribute(
      'href',
      '#creator-composition-task',
    );
    await expect(page.getByText('No Page selected')).toBeVisible();

    await page.getByLabel('Route path').fill('/creator-e2e');
    await page.getByLabel('Presentation title').fill('Creator E2E');
    await page.getByRole('button', { name: 'Create draft Page' }).click();
    await expect(page.getByRole('status')).toContainText('created as a DRAFT');

    await page.getByRole('button', { name: 'Create Knowledge draft' }).click();
    await expect(page.getByRole('button', { name: /Add Knowledge/ })).toBeVisible();

    await page.getByLabel('Text content').fill('Welcome to the creator proof.');
    await page.getByRole('button', { name: 'Create Text Block' }).click();
    await expect(page.getByRole('button', { name: /Add Block/ })).toBeVisible();

    const mediaInput = page.getByLabel('Image or Experience audio file');
    await expect(mediaInput).toHaveAttribute('accept', 'image/png,image/jpeg,audio/mp4');
    await expect(
      page.getByText(/Experience audio must be original, owned, properly licensed/),
    ).toBeVisible();
    await expect(page.getByText(/public by Asset ID immediately/)).toBeVisible();

    await mediaInput.setInputFiles({
      name: 'creator-proof.m4a',
      mimeType: 'audio/mp4',
      buffer: Buffer.from('creator-audio-proof'),
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
    await expect(page.getByRole('link', { name: 'View published experience' })).toHaveAttribute(
      'href',
      `/experiences/${pageId}`,
    );
    await expect(page.getByRole('button', { name: 'Save composition' })).toBeDisabled();

    await page.getByRole('button', { name: 'Archive Page' }).click();
    await expect(page.getByText('Archived Pages are terminal and read-only.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'View published experience' })).toHaveCount(0);
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
            {
              position: 2,
              kind: 'MEDIA_ASSET',
              id: assetId,
              assetType: 'AUDIO',
              durationMs: 273,
            },
          ],
        }),
      });
    });

    await page.route(`**/api/media/assets/${assetId}/content`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'audio/mp4',
        body: Buffer.from(
          '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',
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
    const audio = items.nth(2).getByLabel('Draft media 3 in Controlled preview E2E');
    await expect(audio).toBeVisible();
    await expect(audio).toHaveAttribute('controls', '');
    await expect(audio).toHaveAttribute('preload', 'none');
    expect(await audio.getAttribute('autoplay')).toBeNull();
    expect(await audio.getAttribute('loop')).toBeNull();
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
