import { expect, test, type Page } from '@playwright/test';

const RESOURCE_ID = '91000000-0000-4000-8000-000000000001';
const RIVAL_A = '91000000-0000-4000-8000-000000000002';
const RIVAL_B = '91000000-0000-4000-8000-000000000003';
const ALLY_ID = '91000000-0000-4000-8000-000000000004';
const MEDIA_ID = '91000000-0000-4000-8000-000000000005';

function resource(lifecycle: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') {
  return {
    id: RESOURCE_ID,
    universeKey: 'universe.anime',
    resourceType: 'anime.character',
    lifecycle,
  };
}

function configuration(lifecycle: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' = 'DRAFT') {
  return {
    resource: resource(lifecycle),
    resourceId: RESOURCE_ID,
    slug: 'naruto-creator-proof',
    displayName: 'Naruto Creator Proof',
    nativeName: 'うずまきナルト',
    alternateNames: ['Naruto'],
    summary: 'A Creator Character management proof.',
    overview: 'The saved long overview.',
    facts: [
      { key: 'anime.series', label: 'Series', value: 'Naruto' },
      { key: 'anime.role', label: 'Role', value: 'Shinobi' },
    ],
    relations: [
      {
        targetResourceId: RIVAL_A,
        sectionKey: 'entity.rivals',
        relationshipType: 'anime.rival',
        position: 0,
      },
      {
        targetResourceId: RIVAL_B,
        sectionKey: 'entity.rivals',
        relationshipType: 'anime.teammate',
        position: 1,
      },
    ],
    updatedAt: '2026-08-24T18:20:00.000Z',
  };
}

async function authenticated(page: Page): Promise<void> {
  await page.route('**/api/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        actorId: 'uxp-02d-creator',
        expiresAt: '2030-01-01T00:00:00.000Z',
      }),
    });
  });
}

test.describe('UXP-02D Creator Character manager', () => {
  test('round-trips profile/facts/ordered relationships, previews DRAFT without public leakage, and uses Knowledge lifecycle endpoints', async ({
    page,
  }) => {
    await authenticated(page);

    let currentLifecycle: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' = 'DRAFT';
    let savedBody: unknown = null;
    let publicEntityRequests = 0;

    await page.route(`**/api/knowledge/resources/${RESOURCE_ID}/entity`, async (route) => {
      if (route.request().method() === 'PUT') {
        savedBody = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ...configuration(currentLifecycle),
            ...(savedBody as object),
          }),
        });
        return;
      }

      const base = configuration(currentLifecycle);
      const saved = savedBody as {
        profile?: Record<string, unknown>;
        relations?: unknown[];
      } | null;

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...base,
          resource: resource(currentLifecycle),
          ...(saved?.profile ?? {}),
          relations: saved?.relations ?? base.relations,
        }),
      });
    });

    await page.route(`**/api/knowledge/resources/${RESOURCE_ID}/media`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          placements: [
            {
              assetId: MEDIA_ID,
              role: 'HERO',
              playback: 'STILL',
              position: 0,
              altText: 'Naruto creator preview portrait',
              caption: 'Creator preview media',
              posterAssetId: null,
            },
          ],
        }),
      });
    });

    await page.route(`**/api/knowledge/resources/${RESOURCE_ID}/publish`, async (route) => {
      currentLifecycle = 'PUBLISHED';
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(resource(currentLifecycle)),
      });
    });

    await page.route(`**/api/knowledge/resources/${RESOURCE_ID}/archive`, async (route) => {
      currentLifecycle = 'ARCHIVED';
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(resource(currentLifecycle)),
      });
    });

    await page.route('**/api/knowledge/entities/**', async (route) => {
      publicEntityRequests += 1;
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'knowledge.entity.not_found',
            message: 'Entity not found.',
            status: 404,
          },
        }),
      });
    });

    await page.route(`**/api/media/assets/${MEDIA_ID}/thumbnail`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="#1b2c54"/></svg>',
      });
    });

    await page.goto('/creator');

    await page.getByLabel('Character Knowledge Resource ID').fill(RESOURCE_ID);
    await expect(page.getByLabel('Active Knowledge Resource ID')).toHaveValue(RESOURCE_ID);

    await page.getByRole('button', { name: 'Load Character configuration' }).click();
    await expect(page.getByRole('status')).toContainText('Loaded Character configuration');

    await page.getByLabel('Display name').fill('Naruto Managed Character');
    await page.getByLabel('Short summary').fill('Updated short Character summary.');
    await page.getByLabel('Long overview').fill('Updated long Character overview.');

    await page.getByLabel('Fact 2 value').fill('Hokage');

    await page.getByRole('button', { name: 'Move relation 2 up within section' }).click();

    await page.locator('#creator-new-relation-section').selectOption('entity.allies');
    await page.locator('#creator-new-relation-type').fill('anime.ally');
    await page.locator('#creator-new-relation-target').fill(ALLY_ID);
    await page.getByRole('button', { name: 'Add relationship' }).click();

    await page.getByRole('button', { name: 'Save Character configuration' }).click();
    await expect(page.getByRole('status')).toContainText('Saved Character configuration');

    expect(savedBody).toEqual({
      profile: {
        slug: 'naruto-creator-proof',
        displayName: 'Naruto Managed Character',
        nativeName: 'うずまきナルト',
        alternateNames: ['Naruto'],
        summary: 'Updated short Character summary.',
        overview: 'Updated long Character overview.',
        facts: [
          { key: 'anime.series', label: 'Series', value: 'Naruto' },
          { key: 'anime.role', label: 'Role', value: 'Hokage' },
        ],
      },
      relations: [
        {
          targetResourceId: RIVAL_B,
          sectionKey: 'entity.rivals',
          relationshipType: 'anime.teammate',
          position: 0,
        },
        {
          targetResourceId: RIVAL_A,
          sectionKey: 'entity.rivals',
          relationshipType: 'anime.rival',
          position: 1,
        },
        {
          targetResourceId: ALLY_ID,
          sectionKey: 'entity.allies',
          relationshipType: 'anime.ally',
          position: 0,
        },
      ],
    });

    await page.screenshot({
      path: '.playwright/uxp-02d-character-manager.png',
      fullPage: true,
    });

    await page.getByRole('link', { name: 'Preview Character' }).click();

    await expect(
      page.getByRole('heading', { level: 1, name: 'Naruto Managed Character' }),
    ).toBeVisible();
    await expect(page.getByText('Creator-only Character preview')).toBeVisible();
    await expect(page.getByText('DRAFT', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Rivals' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Allies' })).toBeVisible();
    await expect(page.getByAltText('Naruto creator preview portrait')).toBeVisible();
    expect(publicEntityRequests).toBe(0);

    await page.screenshot({
      path: '.playwright/uxp-02d-character-preview.png',
      fullPage: true,
    });

    await page.goto('/creator');
    await page.getByLabel('Character Knowledge Resource ID').fill(RESOURCE_ID);
    await page.getByRole('button', { name: 'Load Character configuration' }).click();

    await page.getByRole('button', { name: 'Publish Character' }).click();
    await expect(page.getByText('PUBLISHED', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Archive Character' }).click();
    await expect(page.getByText('ARCHIVED', { exact: true })).toBeVisible();
    await expect(page.getByText('Archived Character Resources are terminal.')).toBeVisible();
  });

  test('surfaces the existing authorization denial instead of exposing configuration', async ({
    page,
  }) => {
    await authenticated(page);

    await page.route(`**/api/knowledge/resources/${RESOURCE_ID}/entity`, async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'knowledge.authorization.forbidden',
            message: 'You do not have permission to perform this action.',
            status: 403,
          },
        }),
      });
    });

    await page.goto('/creator');
    await page.getByLabel('Character Knowledge Resource ID').fill(RESOURCE_ID);
    await page.getByRole('button', { name: 'Load Character configuration' }).click();

    await expect(
      page.locator('[aria-labelledby="creator-anime-character-title"]').getByRole('alert'),
    ).toContainText('You do not have permission');
    await expect(page.getByLabel('Display name')).toHaveValue('');
  });
});
