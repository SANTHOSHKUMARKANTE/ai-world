import { expect, test, type Page } from '@playwright/test';

const SPARSE_ID = '96800000-0000-4000-8000-000000000001';
const ENGAGEMENT_ID = '96800000-0000-4000-8000-000000000002';
const AUDIO_ID = '96800000-0000-4000-8000-000000000003';
const FORM_ID = '96810000-0000-4000-8000-000000000001';
const COLLECTION_ID = '96820000-0000-4000-8000-000000000001';

function entityFixture({
  id,
  slug,
  displayName,
  nativeName = null,
  alternateNames = [],
  overview = null,
  facts = [],
  media = [],
  relations = [],
}: {
  readonly id: string;
  readonly slug: string;
  readonly displayName: string;
  readonly nativeName?: string | null;
  readonly alternateNames?: readonly string[];
  readonly overview?: string | null;
  readonly facts?: readonly object[];
  readonly media?: readonly object[];
  readonly relations?: readonly object[];
}) {
  return {
    resource: {
      id,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
    },
    profile: {
      slug,
      displayName,
      nativeName,
      alternateNames,
      summary: `${displayName} acceptance summary.`,
      overview,
      facts,
    },
    media,
    relations,
  };
}

function sparseFixture() {
  return entityFixture({
    id: SPARSE_ID,
    slug: 'sparse-deity',
    displayName: 'Sparse Deity',
    relations: [
      {
        sectionKey: 'entity.forms',
        relationshipType: 'devotional.form',
        position: 0,
        target: {
          id: FORM_ID,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.deity',
          slug: 'sparse-form',
          displayName: 'Sparse Form',
          summary: 'One bounded relationship proves a sparse relationship shape.',
          previewAssetId: null,
        },
      },
    ],
  });
}

function engagementFixture() {
  return entityFixture({
    id: ENGAGEMENT_ID,
    slug: 'engagement-deity',
    displayName: 'Engagement Deity',
    nativeName: 'देव',
    alternateNames: ['Acceptance Form'],
    overview: 'A rich acceptance fixture for authenticated Engagement behavior.',
    facts: [
      { key: 'devotional.mantra', label: 'Mantra', value: 'Acceptance mantra' },
      { key: 'devotional.symbol', label: 'Symbol', value: 'Acceptance symbol' },
      { key: 'devotional.festival', label: 'Festival', value: 'Acceptance festival' },
    ],
  });
}

function audioFixture() {
  return entityFixture({
    id: AUDIO_ID,
    slug: 'audio-deity',
    displayName: 'Audio Boundary Deity',
    media: [
      {
        assetId: '96830000-0000-4000-8000-000000000001',
        assetType: 'AUDIO',
        mimeType: 'audio/mpeg',
        role: 'HERO',
        playback: 'STILL',
        position: 0,
        altText: 'Direct audio placement',
        caption: 'This AUDIO placement must not render on the Deity page.',
        posterAssetId: null,
      },
    ],
  });
}

async function anonymous(page: Page): Promise<void> {
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
}

async function authenticated(page: Page): Promise<void> {
  await page.route('**/api/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        actorId: '96840000-0000-4000-8000-000000000001',
        expiresAt: '2030-01-01T00:00:00.000Z',
      }),
    });
  });
}

test.describe('UXP-06D full Devotional Deity acceptance gaps', () => {
  test('shows loading, then resolves a sparse 834px Deity with current /knowledge context and no overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 834, height: 1112 });
    await anonymous(page);

    let releaseResponse: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      releaseResponse = resolve;
    });

    await page.route(
      '**/api/knowledge/entities/universe.devotional/sparse-deity',
      async (route) => {
        await gate;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(sparseFixture()),
        });
      },
    );

    await page.goto('/devotional/sparse-deity?utm_source=uxp06d');

    const loading = page.getByRole('status').filter({ hasText: 'Opening this world…' });
    await expect(loading).toBeVisible();

    releaseResponse?.();

    await expect(page.getByRole('heading', { level: 1, name: 'Sparse Deity' })).toBeVisible();
    await expect(loading).not.toBeVisible();

    await expect(page.getByLabel('Deity identity')).toHaveCount(0);
    await expect(page.locator('.aw-entity-facts')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Media Highlights' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Explore media' })).toHaveCount(0);

    const context = page.locator('.aw-entity-context-link');
    await expect(context).toHaveAttribute('href', '/knowledge');
    await expect(context).toContainText('Devotional Universe');

    const sections = page.locator('.aw-entity-section');
    await expect(sections).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Forms of Sparse Deity' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sparse Form' })).toHaveAttribute(
      'href',
      '/devotional/sparse-form',
    );

    const navLabels = await page
      .locator('.aw-entity-section-nav a')
      .evaluateAll((links) => links.map((link) => link.textContent?.trim()));
    expect(navLabels).toEqual(['Overview', 'Forms of Sparse Deity']);

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);

    await page.screenshot({
      path: 'test-results/uxp-06d-sparse-tablet.png',
      fullPage: true,
    });
  });

  test('distinguishes unexpected API failure from a nonexistent Deity slug', async ({ page }) => {
    await anonymous(page);

    await page.route('**/api/knowledge/entities/universe.devotional/error-deity', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'knowledge.unexpected',
            message: 'Unexpected acceptance failure.',
            status: 500,
          },
        }),
      });
    });

    await page.goto('/devotional/error-deity');
    await expect(page.locator('.aw-entity-status[role="alert"]')).toHaveText(
      'This page is not available yet.',
    );

    await page.route(
      '**/api/knowledge/entities/universe.devotional/not-a-real-deity',
      async (route) => {
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
      },
    );

    await page.goto('/devotional/not-a-real-deity');

    const notFound = page.getByRole('status').filter({ hasText: 'Deity not found' });
    await expect(notFound).toBeVisible();
    await expect(notFound.getByText('This published page is not available.')).toBeVisible();
    await expect(
      notFound.getByRole('link', { name: 'Explore published Knowledge' }),
    ).toHaveAttribute('href', '/knowledge');
  });

  test('maps a malformed Deity slug to bounded not-found behavior', async ({ page }) => {
    await anonymous(page);

    const invalidEntityResponse = page.waitForResponse((response) => {
      const url = new URL(response.url());

      return (
        url.pathname === '/api/knowledge/entities/universe.devotional/Invalid-Slug' &&
        response.request().method() === 'GET'
      );
    });

    const routeResponse = await page.goto('/devotional/Invalid-Slug');
    expect(routeResponse?.status()).toBe(200);

    const apiResponse = await invalidEntityResponse;
    expect(apiResponse.status()).toBe(404);

    const notFound = page.getByRole('status').filter({ hasText: 'Deity not found' });
    await expect(notFound).toBeVisible();
    await expect(notFound.getByText('This published page is not available.')).toBeVisible();
    await expect(
      notFound.getByRole('link', { name: 'Explore published Knowledge' }),
    ).toHaveAttribute('href', '/knowledge');
  });

  test('performs authenticated Favorite add/remove and Collection membership mutations for a Deity', async ({
    page,
  }) => {
    await authenticated(page);

    const collection = {
      id: COLLECTION_ID,
      name: 'Devotional study',
      createdAt: '2026-08-30T08:30:00.000Z',
      updatedAt: '2026-08-30T08:30:00.000Z',
    };

    let favoriteAdds = 0;
    let favoriteRemoves = 0;
    let collectionAdds = 0;

    await page.route(
      '**/api/knowledge/entities/universe.devotional/engagement-deity',
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(engagementFixture()),
        });
      },
    );

    await page.route('**/api/engagement/favorites**', async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      const method = request.method();

      if (url.pathname === '/api/engagement/favorites' && method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ favorites: [] }),
        });
        return;
      }

      if (url.pathname === '/api/engagement/favorites' && method === 'POST') {
        expect(request.postDataJSON()).toEqual({ resourceId: ENGAGEMENT_ID });
        favoriteAdds += 1;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '96850000-0000-4000-8000-000000000001',
            resourceId: ENGAGEMENT_ID,
            createdAt: '2026-08-30T08:31:00.000Z',
          }),
        });
        return;
      }

      if (url.pathname === `/api/engagement/favorites/${ENGAGEMENT_ID}` && method === 'DELETE') {
        favoriteRemoves += 1;
        await route.fulfill({ status: 204 });
        return;
      }

      await route.fulfill({ status: 405 });
    });

    await page.route('**/api/engagement/collections**', async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      const method = request.method();

      if (url.pathname === '/api/engagement/collections' && method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ collections: [collection] }),
        });
        return;
      }

      if (
        url.pathname === `/api/engagement/collections/${COLLECTION_ID}/resources` &&
        method === 'POST'
      ) {
        expect(request.postDataJSON()).toEqual({ resourceId: ENGAGEMENT_ID });
        collectionAdds += 1;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            resourceId: ENGAGEMENT_ID,
            addedAt: '2026-08-30T08:32:00.000Z',
          }),
        });
        return;
      }

      await route.fulfill({ status: 405 });
    });

    await page.goto('/devotional/engagement-deity');

    const engagement = page.getByLabel('Save this resource');
    const favorite = engagement.getByRole('button', { name: 'Add to Favorites' });
    await expect(favorite).toBeVisible();

    await favorite.click();
    await expect(engagement.getByRole('status')).toHaveText('Saved to Favorites.');
    await expect(engagement.getByRole('button', { name: 'Remove favorite' })).toBeVisible();

    await engagement.getByRole('button', { name: 'Remove favorite' }).click();
    await expect(engagement.getByRole('status')).toHaveText('Removed from Favorites.');
    await expect(engagement.getByRole('button', { name: 'Add to Favorites' })).toBeVisible();

    await expect(engagement.getByLabel('Collection')).toHaveValue(COLLECTION_ID);
    await engagement.getByRole('button', { name: 'Add to Collection' }).click();
    await expect(engagement.getByRole('status')).toHaveText('Added to Collection.');

    expect(favoriteAdds).toBe(1);
    expect(favoriteRemoves).toBe(1);
    expect(collectionAdds).toBe(1);
  });

  test('omits direct AUDIO Knowledge placement from the public Deity page', async ({ page }) => {
    await anonymous(page);

    let mediaDeliveryRequests = 0;

    await page.route('**/api/knowledge/entities/universe.devotional/audio-deity', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(audioFixture()),
      });
    });

    await page.route('**/api/media/assets/**', async (route) => {
      mediaDeliveryRequests += 1;
      await route.fulfill({ status: 204 });
    });

    await page.goto('/devotional/audio-deity');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Audio Boundary Deity' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Media Highlights' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Explore media' })).toHaveCount(0);
    await expect(page.locator('audio')).toHaveCount(0);
    await expect(page.locator('video[data-short-loop="true"]')).toHaveCount(0);
    await expect(page.getByRole('dialog')).toHaveCount(0);

    expect(mediaDeliveryRequests).toBe(0);
  });
});
