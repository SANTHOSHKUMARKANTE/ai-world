import { expect, test, type Page } from '@playwright/test';

const RESOURCE_ID = '98900000-0000-4000-8000-000000000001';
const CHARACTER_TARGET_ID = '98910000-0000-4000-8000-000000000001';
const RELATED_SERIES_ID = '98920000-0000-4000-8000-000000000001';
const MEDIA_ID = '98930000-0000-4000-8000-000000000001';

type Lifecycle = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

function resource(lifecycle: Lifecycle, resourceType = 'anime.series') {
  return {
    id: RESOURCE_ID,
    universeKey: 'universe.anime',
    resourceType,
    lifecycle,
  };
}

function configuration(lifecycle: Lifecycle = 'DRAFT', resourceType = 'anime.series') {
  return {
    resource: resource(lifecycle, resourceType),
    resourceId: RESOURCE_ID,
    slug: 'series-creator-proof',
    displayName: 'Series Creator Proof',
    nativeName: null,
    alternateNames: [],
    summary: 'A Creator Series management proof.',
    overview: null,
    facts: [],
    relations: [],
    updatedAt: '2026-08-27T07:40:00.000Z',
  };
}

async function installSession(page: Page, state: { authenticated: boolean }): Promise<void> {
  await page.route('**/api/session', async (route) => {
    if (state.authenticated) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          actorId: 'uxp-04c-creator',
          expiresAt: '2030-01-01T00:00:00.000Z',
        }),
      });
      return;
    }

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
}

test.describe('UXP-04C Creator Anime Series manager + Creator-only preview', () => {
  test('creates and round-trips Series identity/facts/relations/media, previews DRAFT privately, then publishes and archives publicly', async ({
    page,
  }) => {
    const session = { authenticated: true };
    await installSession(page, session);

    let currentLifecycle: Lifecycle = 'DRAFT';
    let savedBody: {
      profile: {
        slug: string;
        displayName: string;
        nativeName: string | null;
        alternateNames: readonly string[];
        summary: string;
        overview: string | null;
        facts: readonly { key: string; label: string; value: string }[];
      };
      relations: readonly {
        targetResourceId: string;
        sectionKey: string;
        relationshipType: string;
        position: number;
      }[];
    } | null = null;

    let persistedPlacements: readonly Record<string, unknown>[] = [
      {
        assetId: MEDIA_ID,
        role: 'HERO',
        playback: 'STILL',
        position: 0,
        altText: 'Series creator preview artwork',
        caption: 'Initial Series caption',
        posterAssetId: null,
      },
    ];
    let publicEntityRequests = 0;

    await page.route('**/api/knowledge/resources', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }

      expect(route.request().postDataJSON()).toEqual({
        universeKey: 'universe.anime',
        resourceType: 'anime.series',
      });

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          ...resource('DRAFT'),
          createdAt: '2026-08-27T07:40:00.000Z',
          updatedAt: '2026-08-27T07:40:00.000Z',
        }),
      });
    });

    await page.route(`**/api/knowledge/resources/${RESOURCE_ID}/entity`, async (route) => {
      if (route.request().method() === 'PUT') {
        savedBody = route.request().postDataJSON() as NonNullable<typeof savedBody>;

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ...configuration(currentLifecycle),
            resource: resource(currentLifecycle),
            ...savedBody.profile,
            relations: savedBody.relations,
          }),
        });
        return;
      }

      const base = configuration(currentLifecycle);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...base,
          resource: resource(currentLifecycle),
          ...(savedBody?.profile ?? {}),
          relations: savedBody?.relations ?? base.relations,
        }),
      });
    });

    await page.route(`**/api/knowledge/resources/${RESOURCE_ID}/media`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ placements: persistedPlacements }),
        });
        return;
      }

      if (route.request().method() === 'PUT') {
        const request = route.request().postDataJSON() as {
          placements: readonly Record<string, unknown>[];
        };
        persistedPlacements = request.placements.map((placement, position) => ({
          ...placement,
          position,
        }));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ placements: persistedPlacements }),
        });
        return;
      }

      await route.fulfill({ status: 405 });
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

    await page.route(
      '**/api/knowledge/entities/universe.anime/series-creator-proof',
      async (route) => {
        publicEntityRequests += 1;

        if (currentLifecycle !== 'PUBLISHED' || !savedBody) {
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
          return;
        }

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            resource: {
              id: RESOURCE_ID,
              universeKey: 'universe.anime',
              resourceType: 'anime.series',
            },
            profile: savedBody.profile,
            media: [],
            relations: [],
          }),
        });
      },
    );

    await page.route(`**/api/media/assets/${MEDIA_ID}/thumbnail`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="#172554"/></svg>',
      });
    });

    await page.goto('/creator');

    await page.getByLabel('Anime Entity editor').selectOption('series');
    await expect(page.getByLabel('Active Universe')).toHaveValue('universe.anime');
    await expect(page.getByRole('textbox', { name: 'Resource type', exact: true })).toHaveValue(
      'anime.series',
    );

    await page.getByRole('button', { name: 'Create Knowledge draft' }).click();

    await expect(page.getByLabel('Anime Entity editor')).toHaveValue('series');
    await expect(page.getByLabel('Series Knowledge Resource ID')).toHaveValue(RESOURCE_ID);
    await expect(page.getByLabel('Active Knowledge Resource ID')).toHaveValue(RESOURCE_ID);

    await page.getByLabel('Slug').fill('series-creator-proof');
    await page.getByLabel('Display name').fill('Managed Anime Series');
    await page.getByLabel('Native name').fill('管理されたアニメシリーズ');
    await page.getByLabel('Alternate names · one per line').fill('Managed Series\nSeries Proof');
    await page.getByLabel('Short summary').fill('Updated short Series summary.');
    await page.getByLabel('Long overview').fill('Updated long Series overview.');

    await page.getByRole('button', { name: 'Use Format template' }).click();
    await page.locator('#creator-new-fact-value').fill('TV');
    await page.getByRole('button', { name: 'Add quick fact' }).click();

    await page.getByRole('button', { name: 'Use Status template' }).click();
    await page.locator('#creator-new-fact-value').fill('FINISHED');
    await page.getByRole('button', { name: 'Add quick fact' }).click();

    await page.getByRole('button', { name: 'Use Episodes template' }).click();
    await page.locator('#creator-new-fact-value').fill('64');
    await page.getByRole('button', { name: 'Add quick fact' }).click();

    await page.locator('#creator-new-relation-section').selectOption('entity.characters');
    await expect(page.locator('#creator-new-relation-type')).toHaveValue('anime.character');
    await expect(page.locator('#creator-new-relation-type')).toHaveAttribute('readonly', '');
    await page.locator('#creator-new-relation-target').fill(CHARACTER_TARGET_ID);
    await page.getByRole('button', { name: 'Add relationship' }).click();

    await page.locator('#creator-new-relation-section').selectOption('entity.series');
    await expect(page.locator('#creator-new-relation-type')).toHaveValue('anime.related-series');
    await expect(page.locator('#creator-new-relation-type')).toHaveAttribute('readonly', '');
    await page.locator('#creator-new-relation-target').fill(RELATED_SERIES_ID);
    await page.getByRole('button', { name: 'Add relationship' }).click();

    await page.getByRole('button', { name: 'Initialize Series configuration' }).click();
    await expect(
      page
        .locator('[data-creator-anime-series-manager="true"]')
        .getByRole('status')
        .filter({ hasText: 'Saved Series configuration' }),
    ).toBeVisible();

    expect(savedBody).toEqual({
      profile: {
        slug: 'series-creator-proof',
        displayName: 'Managed Anime Series',
        nativeName: '管理されたアニメシリーズ',
        alternateNames: ['Managed Series', 'Series Proof'],
        summary: 'Updated short Series summary.',
        overview: 'Updated long Series overview.',
        facts: [
          { key: 'anime.format', label: 'Format', value: 'TV' },
          { key: 'anime.status', label: 'Status', value: 'FINISHED' },
          { key: 'anime.episodes', label: 'Episodes', value: '64' },
        ],
      },
      relations: [
        {
          targetResourceId: CHARACTER_TARGET_ID,
          sectionKey: 'entity.characters',
          relationshipType: 'anime.character',
          position: 0,
        },
        {
          targetResourceId: RELATED_SERIES_ID,
          sectionKey: 'entity.series',
          relationshipType: 'anime.related-series',
          position: 0,
        },
      ],
    });

    const mediaManager = page.getByRole('region', { name: 'Knowledge media placements' });
    await mediaManager.getByRole('button', { name: 'Load media placements' }).click();
    await expect(mediaManager.getByRole('status')).toHaveText(
      'Loaded 1 Knowledge media placements.',
    );
    await mediaManager.getByLabel('Caption for media 1').fill('Updated Series hero caption');
    await mediaManager.getByRole('button', { name: 'Save media placements' }).click();

    expect(persistedPlacements).toEqual([
      {
        assetId: MEDIA_ID,
        role: 'HERO',
        playback: 'STILL',
        altText: 'Series creator preview artwork',
        caption: 'Updated Series hero caption',
        posterAssetId: null,
        position: 0,
      },
    ]);

    await page.screenshot({
      path: '.playwright/uxp-04c-series-manager.png',
      fullPage: true,
    });

    await page.getByRole('link', { name: 'Preview Series' }).click();

    await expect(page.locator('[data-creator-anime-series-preview="true"]')).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 1, name: 'Managed Anime Series' }),
    ).toBeVisible();
    await expect(page.getByText('Creator-only Series preview')).toBeVisible();
    await expect(page.getByText('DRAFT', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Characters' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Related Series & Movies' })).toBeVisible();
    await expect(page.getByAltText('Series creator preview artwork')).toBeVisible();
    expect(publicEntityRequests).toBe(0);

    await page.screenshot({
      path: '.playwright/uxp-04c-series-preview.png',
      fullPage: true,
    });

    await page.goto('/creator');
    await page.getByLabel('Anime Entity editor').selectOption('series');
    await page.getByLabel('Series Knowledge Resource ID').fill(RESOURCE_ID);
    await page.getByRole('button', { name: 'Load Series configuration' }).click();
    await page.getByRole('button', { name: 'Publish Series' }).click();
    await expect(
      page.locator('[data-creator-anime-series-manager="true"]').getByText('PUBLISHED', {
        exact: true,
      }),
    ).toBeVisible();

    session.authenticated = false;
    await page.goto('/anime/series/series-creator-proof');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Managed Anime Series' }),
    ).toBeVisible();
    expect(publicEntityRequests).toBe(1);

    session.authenticated = true;
    await page.goto('/creator');
    await page.getByLabel('Anime Entity editor').selectOption('series');
    await page.getByLabel('Series Knowledge Resource ID').fill(RESOURCE_ID);
    await page.getByRole('button', { name: 'Load Series configuration' }).click();
    await page.getByRole('button', { name: 'Archive Series' }).click();
    await expect(
      page.locator('[data-creator-anime-series-manager="true"]').getByText('ARCHIVED', {
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.getByText('Archived Series Resources are terminal.')).toBeVisible();

    session.authenticated = false;
    await page.goto('/anime/series/series-creator-proof');
    await expect(page.getByText('Series not found')).toBeVisible();
    expect(publicEntityRequests).toBe(2);
  });

  test('rejects an Anime Character Resource in both the Series manager and Series preview', async ({
    page,
  }) => {
    const session = { authenticated: true };
    await installSession(page, session);

    await page.route(`**/api/knowledge/resources/${RESOURCE_ID}/entity`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(configuration('DRAFT', 'anime.character')),
      });
    });

    await page.route(`**/api/knowledge/resources/${RESOURCE_ID}/media`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ placements: [] }),
      });
    });

    await page.goto('/creator');
    await page.getByLabel('Anime Entity editor').selectOption('series');
    await page.getByLabel('Series Knowledge Resource ID').fill(RESOURCE_ID);
    await page.getByRole('button', { name: 'Load Series configuration' }).click();

    const manager = page.locator('[data-creator-anime-series-manager="true"]');
    await expect(manager.getByRole('alert')).toContainText(
      'Anime Series management requires an universe.anime / anime.series Knowledge Resource.',
    );
    await expect(page.getByLabel('Display name')).toHaveValue('');

    await page.goto(`/creator/series/${RESOURCE_ID}/preview`);
    await expect(page.getByRole('heading', { name: 'Series preview unavailable' })).toBeVisible();
    await expect(page.locator('#aw-main-content').getByRole('alert')).toContainText(
      'Creator Series preview requires an Anime Series Resource.',
    );
    await expect(page.getByText('Creator-only Series preview')).toHaveCount(0);
  });

  test('surfaces existing Creator authorization denial in the Series manager and preview', async ({
    page,
  }) => {
    const session = { authenticated: true };
    await installSession(page, session);

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

    await page.route(`**/api/knowledge/resources/${RESOURCE_ID}/media`, async (route) => {
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
    await page.getByLabel('Anime Entity editor').selectOption('series');
    await page.getByLabel('Series Knowledge Resource ID').fill(RESOURCE_ID);
    await page.getByRole('button', { name: 'Load Series configuration' }).click();

    await expect(
      page.locator('[data-creator-anime-series-manager="true"]').getByRole('alert'),
    ).toContainText('You do not have permission');
    await expect(page.getByLabel('Display name')).toHaveValue('');

    await page.goto(`/creator/series/${RESOURCE_ID}/preview`);
    await expect(page.getByRole('heading', { name: 'Series preview unavailable' })).toBeVisible();
    await expect(page.locator('#aw-main-content').getByRole('alert')).toContainText(
      'You do not have permission',
    );
  });

  test('keeps anonymous Series preview outside the Creator Entity/Media boundary', async ({
    page,
  }) => {
    const session = { authenticated: false };
    await installSession(page, session);

    let creatorRequests = 0;
    await page.route(`**/api/knowledge/resources/${RESOURCE_ID}/entity`, async (route) => {
      creatorRequests += 1;
      await route.fulfill({ status: 500 });
    });
    await page.route(`**/api/knowledge/resources/${RESOURCE_ID}/media`, async (route) => {
      creatorRequests += 1;
      await route.fulfill({ status: 500 });
    });

    await page.goto(`/creator/series/${RESOURCE_ID}/preview`);

    await expect(
      page.getByRole('heading', { name: 'Sign in to preview this Series' }),
    ).toBeVisible();
    await expect(
      page.locator('#aw-main-content').getByRole('link', { name: 'Sign in' }),
    ).toBeVisible();
    expect(creatorRequests).toBe(0);
  });
});
