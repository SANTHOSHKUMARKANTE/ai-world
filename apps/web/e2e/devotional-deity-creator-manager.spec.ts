import { expect, test, type Page } from '@playwright/test';

const RESOURCE_ID = '96700000-0000-4000-8000-000000000001';
const FORM_A = '96710000-0000-4000-8000-000000000001';
const FORM_B = '96710000-0000-4000-8000-000000000002';
const PARVATI_ID = '96710000-0000-4000-8000-000000000003';
const MEDIA_ID = '96720000-0000-4000-8000-000000000001';

type Lifecycle = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

function resource(
  lifecycle: Lifecycle,
  universeKey = 'universe.devotional',
  resourceType = 'devotional.deity',
) {
  return {
    id: RESOURCE_ID,
    universeKey,
    resourceType,
    lifecycle,
  };
}

function configuration(
  lifecycle: Lifecycle = 'DRAFT',
  universeKey = 'universe.devotional',
  resourceType = 'devotional.deity',
) {
  return {
    resource: resource(lifecycle, universeKey, resourceType),
    resourceId: RESOURCE_ID,
    slug: 'shiva-creator-proof',
    displayName: 'Lord Shiva Creator Proof',
    nativeName: 'शिव',
    alternateNames: ['Mahadeva'],
    summary: 'A Creator Deity management proof.',
    overview: 'The saved Creator-only Deity overview.',
    facts: [],
    relations: [],
    updatedAt: '2026-08-30T05:30:00.000Z',
  };
}

async function installSession(page: Page, state: { authenticated: boolean }): Promise<void> {
  await page.route('**/api/session', async (route) => {
    if (state.authenticated) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          actorId: 'uxp-06c-creator',
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

test.describe('UXP-06C Creator Devotional Deity manager + Creator-only preview', () => {
  test('creates and round-trips Deity identity/facts/ordered relationships/media, previews DRAFT privately, then publishes and archives publicly', async ({
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
        altText: 'Shiva Creator Deity artwork',
        caption: 'Initial Deity caption',
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
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
      });

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          ...resource('DRAFT'),
          createdAt: '2026-08-30T05:30:00.000Z',
          updatedAt: '2026-08-30T05:30:00.000Z',
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
      '**/api/knowledge/entities/universe.devotional/shiva-creator-proof',
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

        const targetNames = new Map([
          [FORM_A, { slug: 'nataraja', displayName: 'Nataraja' }],
          [FORM_B, { slug: 'ardhanarishvara', displayName: 'Ardhanarishvara' }],
          [PARVATI_ID, { slug: 'parvati', displayName: 'Parvati' }],
        ]);

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            resource: {
              id: RESOURCE_ID,
              universeKey: 'universe.devotional',
              resourceType: 'devotional.deity',
            },
            profile: savedBody.profile,
            media: persistedPlacements.map((placement, position) => ({
              assetId: placement.assetId,
              assetType: 'IMAGE',
              mimeType: 'image/png',
              role: placement.role,
              playback: placement.playback,
              position,
              altText: placement.altText,
              caption: placement.caption,
              posterAssetId: placement.posterAssetId,
            })),
            relations: savedBody.relations.map((relation) => {
              const target = targetNames.get(relation.targetResourceId) ?? {
                slug: 'related-deity',
                displayName: 'Related Deity',
              };
              return {
                sectionKey: relation.sectionKey,
                relationshipType: relation.relationshipType,
                position: relation.position,
                target: {
                  id: relation.targetResourceId,
                  universeKey: 'universe.devotional',
                  resourceType: 'devotional.deity',
                  slug: target.slug,
                  displayName: target.displayName,
                  summary: `${target.displayName} relationship summary.`,
                  previewAssetId: null,
                },
              };
            }),
          }),
        });
      },
    );

    await page.route(`**/api/media/assets/${MEDIA_ID}/thumbnail`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="#352515"/></svg>',
      });
    });
    await page.route(`**/api/media/assets/${MEDIA_ID}/content`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="#352515"/></svg>',
      });
    });

    await page.goto('/creator');

    await expect(page.getByLabel('Active Universe')).toHaveValue('universe.devotional');
    await expect(page.getByRole('textbox', { name: 'Resource type', exact: true })).toHaveValue(
      'devotional.deity',
    );
    await expect(page.locator('[data-creator-devotional-deity-manager="true"]')).toBeVisible();
    await expect(page.getByLabel('Character Knowledge Resource ID')).toHaveCount(0);

    await page.getByRole('button', { name: 'Create Knowledge draft' }).click();

    const manager = page.locator('[data-creator-devotional-deity-manager="true"]');
    await expect(manager).toBeVisible();
    await expect(manager.getByLabel('Deity Knowledge Resource ID')).toHaveValue(RESOURCE_ID);
    await expect(page.getByLabel('Active Knowledge Resource ID')).toHaveValue(RESOURCE_ID);

    await manager.getByLabel('Slug').fill('shiva-creator-proof');
    await manager.getByLabel('Display name').fill('Lord Shiva Managed');
    await manager.getByLabel('Native name').fill('शिव');
    await manager.getByLabel('Alternate names · one per line').fill('Mahadeva\nShankara');
    await manager.getByLabel('Short summary').fill('Updated short Deity summary.');
    await manager.getByLabel('Long overview').fill('Updated long Deity overview.');

    await manager.getByRole('button', { name: 'Use Mantra template' }).click();
    await manager.locator('#creator-new-fact-value').fill('Om Namah Shivaya');
    await manager.getByRole('button', { name: 'Add quick fact' }).click();

    await manager.getByRole('button', { name: 'Use Symbol template' }).click();
    await manager.locator('#creator-new-fact-value').fill('Trishul');
    await manager.getByRole('button', { name: 'Add quick fact' }).click();

    await manager.locator('#creator-new-relation-section').selectOption('entity.forms');
    await expect(manager.locator('#creator-new-relation-type')).toHaveValue('devotional.form');
    await manager.locator('#creator-new-relation-target').fill(FORM_A);
    await manager.getByRole('button', { name: 'Add relationship' }).click();

    await manager.locator('#creator-new-relation-section').selectOption('entity.forms');
    await manager.locator('#creator-new-relation-target').fill(FORM_B);
    await manager.getByRole('button', { name: 'Add relationship' }).click();
    await manager.getByRole('button', { name: 'Move relation 2 up within section' }).click();

    await manager.locator('#creator-new-relation-section').selectOption('entity.family');
    await expect(manager.locator('#creator-new-relation-type')).toHaveValue('devotional.consort');
    await manager.locator('#creator-new-relation-target').fill(PARVATI_ID);
    await manager.getByRole('button', { name: 'Add relationship' }).click();

    await manager.getByRole('button', { name: 'Initialize Deity configuration' }).click();
    await expect(
      manager.getByRole('status').filter({ hasText: 'Saved Deity configuration' }),
    ).toBeVisible();

    expect(savedBody).toEqual({
      profile: {
        slug: 'shiva-creator-proof',
        displayName: 'Lord Shiva Managed',
        nativeName: 'शिव',
        alternateNames: ['Mahadeva', 'Shankara'],
        summary: 'Updated short Deity summary.',
        overview: 'Updated long Deity overview.',
        facts: [
          { key: 'devotional.mantra', label: 'Mantra', value: 'Om Namah Shivaya' },
          { key: 'devotional.symbol', label: 'Symbol', value: 'Trishul' },
        ],
      },
      relations: [
        {
          targetResourceId: FORM_B,
          sectionKey: 'entity.forms',
          relationshipType: 'devotional.form',
          position: 0,
        },
        {
          targetResourceId: FORM_A,
          sectionKey: 'entity.forms',
          relationshipType: 'devotional.form',
          position: 1,
        },
        {
          targetResourceId: PARVATI_ID,
          sectionKey: 'entity.family',
          relationshipType: 'devotional.consort',
          position: 0,
        },
      ],
    });

    const mediaManager = page.getByRole('region', { name: 'Knowledge media placements' });
    await mediaManager.getByRole('button', { name: 'Load media placements' }).click();
    await expect(mediaManager.getByRole('status')).toHaveText(
      'Loaded 1 Knowledge media placements.',
    );
    await mediaManager.getByLabel('Caption for media 1').fill('Updated Deity hero caption');
    await mediaManager.getByRole('button', { name: 'Save media placements' }).click();

    expect(persistedPlacements).toEqual([
      {
        assetId: MEDIA_ID,
        role: 'HERO',
        playback: 'STILL',
        altText: 'Shiva Creator Deity artwork',
        caption: 'Updated Deity hero caption',
        posterAssetId: null,
        position: 0,
      },
    ]);

    await manager.getByRole('link', { name: 'Preview Deity' }).click();

    const preview = page.locator('[data-creator-devotional-deity-preview="true"]');
    await expect(preview).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Lord Shiva Managed' })).toBeVisible();
    await expect(page.getByText('Creator-only Deity preview')).toBeVisible();
    await expect(page.getByText('DRAFT', { exact: true })).toBeVisible();
    await expect(page.getByText('शिव', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Also known as Mahadeva · Shankara', { exact: true }),
    ).toBeVisible();
    await expect(page.getByText('Updated short Deity summary.', { exact: true })).toBeVisible();
    await expect(page.getByText('Updated long Deity overview.', { exact: true })).toBeVisible();
    await expect(page.getByText('Om Namah Shivaya', { exact: true })).toBeVisible();
    await expect(page.getByText('Trishul', { exact: true })).toBeVisible();
    await expect(page.getByText('Updated Deity hero caption', { exact: true })).toBeVisible();

    const previewFormsHeading = page.getByRole('heading', { name: 'Forms of Shiva Managed' });
    await expect(previewFormsHeading).toBeVisible();
    const previewForms = previewFormsHeading.locator('..').locator('li');
    await expect(previewForms).toHaveCount(2);
    await expect(previewForms.nth(0)).toContainText(FORM_B);
    await expect(previewForms.nth(1)).toContainText(FORM_A);

    await expect(page.getByRole('heading', { name: 'Family & Relationships' })).toBeVisible();
    await expect(page.getByAltText('Shiva Creator Deity artwork')).toBeVisible();
    expect(publicEntityRequests).toBe(0);

    await page.screenshot({
      path: 'test-results/uxp-06c-deity-preview-draft.png',
      fullPage: true,
    });

    session.authenticated = false;
    await page.goto('/devotional/shiva-creator-proof');
    await expect(page.getByText('Deity not found')).toBeVisible();
    expect(publicEntityRequests).toBe(1);

    session.authenticated = true;
    await page.goto('/creator');
    await page.getByRole('button', { name: 'Use Deity manager' }).click();
    const reloadedManager = page.locator('[data-creator-devotional-deity-manager="true"]');
    await reloadedManager.getByLabel('Deity Knowledge Resource ID').fill(RESOURCE_ID);
    await reloadedManager.getByRole('button', { name: 'Load Deity configuration' }).click();
    await reloadedManager.getByRole('button', { name: 'Publish Deity' }).click();
    await expect(reloadedManager.getByText('PUBLISHED', { exact: true })).toBeVisible();

    session.authenticated = false;
    await page.goto('/devotional/shiva-creator-proof');

    await expect(page.getByRole('heading', { level: 1, name: 'Lord Shiva Managed' })).toBeVisible();
    const publicIdentity = page.getByLabel('Deity identity');
    await expect(publicIdentity.getByText('शिव', { exact: true })).toBeVisible();
    await expect(
      publicIdentity.getByText('Also known as Mahadeva · Shankara', { exact: true }),
    ).toBeVisible();
    await expect(page.getByText('Updated short Deity summary.', { exact: true })).toBeVisible();
    await expect(page.getByText('Updated long Deity overview.', { exact: true })).toBeVisible();
    await expect(page.getByText('Om Namah Shivaya', { exact: true })).toBeVisible();
    await expect(page.getByText('Trishul', { exact: true })).toBeVisible();
    await expect(page.getByText('Updated Deity hero caption', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Forms of Shiva Managed' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ardhanarishvara' })).toHaveAttribute(
      'href',
      '/devotional/ardhanarishvara',
    );
    await expect(page.locator('.aw-entity-hero__visual img')).toHaveAttribute(
      'alt',
      'Shiva Creator Deity artwork',
    );
    expect(publicEntityRequests).toBeGreaterThan(0);

    session.authenticated = true;
    await page.goto('/creator');
    await page.getByRole('button', { name: 'Use Deity manager' }).click();
    const archiveManager = page.locator('[data-creator-devotional-deity-manager="true"]');
    await archiveManager.getByLabel('Deity Knowledge Resource ID').fill(RESOURCE_ID);
    await archiveManager.getByRole('button', { name: 'Load Deity configuration' }).click();
    await archiveManager.getByRole('button', { name: 'Archive Deity' }).click();
    await expect(archiveManager.getByText('ARCHIVED', { exact: true })).toBeVisible();
    await expect(archiveManager.getByText('Archived Deity Resources are terminal.')).toBeVisible();

    session.authenticated = false;
    await page.goto('/devotional/shiva-creator-proof');
    await expect(page.getByText('Deity not found')).toBeVisible();
  });

  test('rejects a wrong-Universe Deity Resource in both the manager and Deity preview', async ({
    page,
  }) => {
    const session = { authenticated: true };
    await installSession(page, session);

    await page.route(`**/api/knowledge/resources/${RESOURCE_ID}/entity`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(configuration('DRAFT', 'universe.anime', 'devotional.deity')),
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
    await page.getByRole('button', { name: 'Use Deity manager' }).click();

    const manager = page.locator('[data-creator-devotional-deity-manager="true"]');
    await manager.getByLabel('Deity Knowledge Resource ID').fill(RESOURCE_ID);
    await manager.getByRole('button', { name: 'Load Deity configuration' }).click();

    await expect(manager.getByRole('alert')).toContainText(
      'Devotional Deity management requires a universe.devotional / devotional.deity Knowledge Resource.',
    );
    await expect(manager.getByLabel('Display name')).toHaveValue('');

    await page.goto(`/creator/deities/${RESOURCE_ID}/preview`);
    await expect(page.getByRole('heading', { name: 'Deity preview unavailable' })).toBeVisible();
    await expect(page.locator('#aw-main-content').getByRole('alert')).toContainText(
      'Creator Deity preview requires a Devotional Deity Resource.',
    );
    await expect(page.getByText('Creator-only Deity preview')).toHaveCount(0);
  });

  test('rejects a correct-Universe non-Deity Resource in both the manager and Deity preview', async ({
    page,
  }) => {
    const session = { authenticated: true };
    await installSession(page, session);

    await page.route(`**/api/knowledge/resources/${RESOURCE_ID}/entity`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(configuration('DRAFT', 'universe.devotional', 'devotional.temple')),
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

    const defaultManager = page.locator('[data-creator-devotional-deity-manager="true"]');
    await expect(defaultManager).toBeVisible();
    await defaultManager.getByLabel('Deity Knowledge Resource ID').fill(RESOURCE_ID);
    await defaultManager.getByRole('button', { name: 'Load Deity configuration' }).click();

    await expect(defaultManager.getByRole('alert')).toContainText(
      'Devotional Deity management requires a universe.devotional / devotional.deity Knowledge Resource.',
    );
    await expect(defaultManager.getByLabel('Display name')).toHaveValue('');

    await page.goto(`/creator/deities/${RESOURCE_ID}/preview`);
    await expect(page.getByRole('heading', { name: 'Deity preview unavailable' })).toBeVisible();
    await expect(page.locator('#aw-main-content').getByRole('alert')).toContainText(
      'Creator Deity preview requires a Devotional Deity Resource.',
    );
    await expect(page.getByText('Creator-only Deity preview')).toHaveCount(0);
  });

  test('surfaces existing Creator authorization denial in the Deity manager and preview', async ({
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
    await page.getByRole('button', { name: 'Use Deity manager' }).click();

    const manager = page.locator('[data-creator-devotional-deity-manager="true"]');
    await manager.getByLabel('Deity Knowledge Resource ID').fill(RESOURCE_ID);
    await manager.getByRole('button', { name: 'Load Deity configuration' }).click();

    await expect(manager.getByRole('alert')).toContainText('You do not have permission');
    await expect(manager.getByLabel('Display name')).toHaveValue('');

    await page.goto(`/creator/deities/${RESOURCE_ID}/preview`);
    await expect(page.getByRole('heading', { name: 'Deity preview unavailable' })).toBeVisible();
    await expect(page.locator('#aw-main-content').getByRole('alert')).toContainText(
      'You do not have permission',
    );
  });

  test('keeps anonymous Deity preview outside the Creator Entity/Media boundary', async ({
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

    await page.goto(`/creator/deities/${RESOURCE_ID}/preview`);

    await expect(
      page.getByRole('heading', { name: 'Sign in to preview this Deity' }),
    ).toBeVisible();
    await expect(
      page.locator('#aw-main-content').getByRole('link', { name: 'Sign in' }),
    ).toBeVisible();
    expect(creatorRequests).toBe(0);
  });
});
