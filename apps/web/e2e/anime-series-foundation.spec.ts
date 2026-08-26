import { expect, test, type Page } from '@playwright/test';

const SERIES_ID = '98700000-0000-4000-8000-000000000001';
const SPARSE_SERIES_ID = '98700000-0000-4000-8000-000000000002';
const HERO_ID = '98710000-0000-4000-8000-000000000001';
const CHARACTER_ID = '98720000-0000-4000-8000-000000000001';
const COLLECTION_ID = '98730000-0000-4000-8000-000000000001';

interface SeriesFixture {
  readonly id: string;
  readonly slug: string;
  readonly displayName: string;
  readonly nativeName: string | null;
  readonly alternateNames: readonly string[];
  readonly summary: string;
  readonly overview: string | null;
  readonly facts: readonly {
    readonly key: string;
    readonly label: string;
    readonly value: string;
  }[];
  readonly includeDeferredContent: boolean;
}

const featured: SeriesFixture = {
  id: SERIES_ID,
  slug: 'fullmetal-alchemist-brotherhood',
  displayName: 'Fullmetal Alchemist: Brotherhood',
  nativeName: '鋼の錬金術師 FULLMETAL ALCHEMIST',
  alternateNames: ['FMAB', 'Fullmetal Alchemist 2009'],
  summary: 'Two brothers search for a way to restore what they lost.',
  overview:
    'Edward and Alphonse Elric pursue the Philosopher’s Stone while confronting the cost of equivalent exchange.',
  facts: [
    { key: 'anime.format', label: 'Format', value: 'TV' },
    { key: 'anime.status', label: 'Status', value: 'Finished' },
    { key: 'anime.episodes', label: 'Episodes', value: '64' },
  ],
  includeDeferredContent: true,
};

const sparse: SeriesFixture = {
  id: SPARSE_SERIES_ID,
  slug: 'quiet-series',
  displayName: 'Quiet Series',
  nativeName: null,
  alternateNames: [],
  summary: 'A sparse Series fixture proving optional identity and facts degrade cleanly.',
  overview: null,
  facts: [],
  includeDeferredContent: false,
};

function entityBody(series: SeriesFixture) {
  return {
    resource: {
      id: series.id,
      universeKey: 'universe.anime',
      resourceType: 'anime.series',
    },
    profile: {
      slug: series.slug,
      displayName: series.displayName,
      nativeName: series.nativeName,
      alternateNames: series.alternateNames,
      summary: series.summary,
      overview: series.overview,
      facts: series.facts,
    },
    media: series.includeDeferredContent
      ? [
          {
            assetId: HERO_ID,
            assetType: 'IMAGE',
            mimeType: 'image/png',
            role: 'HERO',
            playback: 'STILL',
            position: 0,
            altText: `${series.displayName} artwork`,
            caption: 'Deferred to UXP-04B public Media behavior.',
            posterAssetId: null,
          },
        ]
      : [],
    relations: series.includeDeferredContent
      ? [
          {
            sectionKey: 'entity.characters',
            relationshipType: 'anime.character',
            position: 0,
            target: {
              id: CHARACTER_ID,
              universeKey: 'universe.anime',
              resourceType: 'anime.character',
              slug: 'edward-elric',
              displayName: 'Edward Elric',
              summary: 'A related Character deliberately deferred from the 04A page.',
              previewAssetId: null,
            },
          },
        ]
      : [],
  };
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
        actorId: '98740000-0000-4000-8000-000000000001',
        expiresAt: '2030-01-01T00:00:00.000Z',
      }),
    });
  });

  await page.route('**/api/engagement/favorites', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ favorites: [] }),
      });
      return;
    }

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        id: '98750000-0000-4000-8000-000000000001',
        resourceId: SERIES_ID,
        createdAt: '2026-08-25T17:00:00.000Z',
      }),
    });
  });

  await page.route('**/api/engagement/collections', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        collections: [
          {
            id: COLLECTION_ID,
            name: 'Anime Series',
            createdAt: '2026-08-25T16:55:00.000Z',
            updatedAt: '2026-08-25T16:55:00.000Z',
          },
        ],
      }),
    });
  });

  await page.route(`**/api/engagement/collections/${COLLECTION_ID}/resources`, async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        resourceId: SERIES_ID,
        addedAt: '2026-08-25T17:01:00.000Z',
      }),
    });
  });
}

async function routeSeries(
  page: Page,
  series: SeriesFixture,
  options: { readonly delayMs?: number } = {},
): Promise<void> {
  await page.route(`**/api/knowledge/entities/universe.anime/${series.slug}`, async (route) => {
    if (options.delayMs) {
      await new Promise((resolve) => setTimeout(resolve, options.delayMs));
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(entityBody(series)),
    });
  });
}

test.describe('UXP-04A Anime Series canonical identity/social shell', () => {
  test('renders a published Series desktop identity without leaking 04B Media or relationships', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await anonymous(page);
    await routeSeries(page, featured);

    const response = await page.goto(
      '/anime/series/fullmetal-alchemist-brotherhood?utm_source=instagram&utm_campaign=series-launch',
    );
    expect(response?.status()).toBe(200);

    await expect(page.locator('.aw-anime-series')).toHaveAttribute('data-series-shell', 'anime');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Fullmetal Alchemist: Brotherhood' }),
    ).toBeVisible();
    await expect(page.getByText('鋼の錬金術師 FULLMETAL ALCHEMIST')).toBeVisible();
    await expect(page.getByText('Also known as FMAB · Fullmetal Alchemist 2009')).toBeVisible();
    await expect(page.getByText('TV', { exact: true })).toBeVisible();
    await expect(page.getByText('Finished', { exact: true })).toBeVisible();
    await expect(page.getByText('64', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'About Fullmetal Alchemist: Brotherhood' }),
    ).toBeVisible();
    await expect(page.getByText(featured.overview!)).toBeVisible();

    await expect(page.getByRole('button', { name: 'Share', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy link', exact: true })).toBeVisible();

    const engagement = page.locator('#entity-engagement');
    await expect(engagement.getByRole('link', { name: 'Sign in' })).toBeVisible();

    await expect(page.getByRole('link', { name: 'Explore media' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Media Highlights' })).toHaveCount(0);
    await expect(page.getByText('Edward Elric', { exact: true })).toHaveCount(0);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).not.toBeNull();
    const canonicalUrl = new URL(canonical!, page.url());
    expect(canonicalUrl.pathname).toBe('/anime/series/fullmetal-alchemist-brotherhood');
    expect(canonicalUrl.search).toBe('');

    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (value: string) => {
            (window as Window & { __uxp04aCopied?: string }).__uxp04aCopied = value;
          },
        },
      });
    });

    await page.getByRole('button', { name: 'Copy link', exact: true }).click();
    await expect(
      page.getByRole('status').filter({ hasText: 'Canonical link copied.' }),
    ).toBeVisible();

    const copied = await page.evaluate(
      () => (window as Window & { __uxp04aCopied?: string }).__uxp04aCopied,
    );
    expect(copied).toBeTruthy();
    const copiedUrl = new URL(copied!);
    expect(copiedUrl.pathname).toBe('/anime/series/fullmetal-alchemist-brotherhood');
    expect(copiedUrl.search).toBe('');

    await page.screenshot({
      path: '.playwright/uxp-04a-series-desktop.png',
      fullPage: true,
    });
  });

  test('keeps a sparse Series coherent at 390px with no optional facts or identity', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await anonymous(page);
    await routeSeries(page, sparse);

    await page.goto('/anime/series/quiet-series');

    await expect(page.locator('.aw-anime-series')).toHaveAttribute('data-series-shell', 'anime');
    await expect(page.getByRole('heading', { level: 1, name: 'Quiet Series' })).toBeVisible();
    await expect(page.locator('.aw-entity-hero__summary')).toHaveText(sparse.summary);
    await expect(page.locator('.aw-entity-facts')).toHaveCount(0);
    await expect(page.locator('.aw-anime-series__identity')).toHaveCount(0);

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);

    await page.screenshot({
      path: '.playwright/uxp-04a-series-mobile.png',
      fullPage: true,
    });
  });

  test('shows the loading state while a published Series read is pending', async ({ page }) => {
    await anonymous(page);
    await routeSeries(page, featured, { delayMs: 700 });

    await page.goto('/anime/series/fullmetal-alchemist-brotherhood');
    await expect(page.locator('.aw-entity-status[role="status"]')).toContainText(
      'Opening this world',
    );
    await expect(
      page.getByRole('heading', { level: 1, name: 'Fullmetal Alchemist: Brotherhood' }),
    ).toBeVisible();
  });

  test('rejects a valid Anime Character payload at the Series route', async ({ page }) => {
    await anonymous(page);

    await page.route('**/api/knowledge/entities/universe.anime/wrong-type', async (route) => {
      const body = entityBody(featured);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...body,
          resource: {
            ...body.resource,
            id: CHARACTER_ID,
            resourceType: 'anime.character',
          },
          profile: {
            ...body.profile,
            slug: 'wrong-type',
            displayName: 'Wrong Character',
          },
        }),
      });
    });

    await page.goto('/anime/series/wrong-type');

    await expect(page.getByText('Series not found')).toBeVisible();
    await expect(page.getByText('This published page is not available.')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Wrong Character' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Explore Anime' })).toBeVisible();
  });

  test('distinguishes unpublished/not-found from unexpected Series errors', async ({ page }) => {
    await anonymous(page);

    await page.route('**/api/knowledge/entities/universe.anime/missing-series', async (route) => {
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

    await page.goto('/anime/series/missing-series');
    await expect(page.getByText('Series not found')).toBeVisible();

    await page.route('**/api/knowledge/entities/universe.anime/broken-series', async (route) => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'web.fixture.unavailable',
            message: 'Temporarily unavailable.',
            status: 503,
          },
        }),
      });
    });

    await page.goto('/anime/series/broken-series');
    await expect(page.locator('.aw-entity-status[role="alert"]')).toHaveText(
      'This page is not available yet.',
    );
  });

  test('reuses the authenticated shared shell and generic Engagement controls', async ({
    page,
  }) => {
    await authenticated(page);
    await routeSeries(page, featured);

    await page.goto('/anime/series/fullmetal-alchemist-brotherhood');

    const account = page.getByRole('navigation', { name: 'Account' });
    await expect(account.getByRole('link', { name: 'Saved' })).toBeVisible();
    await expect(account.getByRole('link', { name: 'Account', exact: true })).toBeVisible();
    await expect(account.getByRole('button', { name: 'Sign out' })).toBeVisible();

    const engagement = page.getByRole('complementary', { name: 'Save this resource' });
    await engagement.getByRole('button', { name: 'Add to Favorites' }).click();
    await expect(engagement.getByRole('status')).toHaveText('Saved to Favorites.');

    await engagement.getByLabel('Collection').selectOption(COLLECTION_ID);
    await engagement.getByRole('button', { name: 'Add to Collection' }).click();
    await expect(engagement.getByRole('status')).toHaveText('Added to Collection.');
  });
});
