import { expect, test, type Page } from '@playwright/test';

const CHARACTER_ID = '95000000-0000-4000-8000-000000000001';
const SERIES_ONE_ID = '96000000-0000-4000-8000-000000000001';
const SERIES_TWO_ID = '96000000-0000-4000-8000-000000000002';
const SERIES_IMAGE_ID = '97000000-0000-4000-8000-000000000001';

const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII=',
  'base64',
);

function characterBody() {
  return {
    items: [
      {
        resourceId: CHARACTER_ID,
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        slug: 'series-proof-character',
        displayName: 'Series Proof Character',
        summary: 'A published Character keeping the accepted Character-first landing visible.',
        updatedAt: '2026-08-25T08:00:00.000Z',
        previewMedia: null,
      },
    ],
  };
}

function seriesBody() {
  return {
    items: [
      {
        resourceId: SERIES_ONE_ID,
        universeKey: 'universe.anime',
        resourceType: 'anime.series',
        slug: 'attack-on-titan',
        displayName: 'Attack on Titan',
        summary: 'A published Anime Series represented through the generic Knowledge contract.',
        updatedAt: '2026-08-25T07:00:00.000Z',
        previewMedia: {
          assetId: SERIES_IMAGE_ID,
          assetType: 'IMAGE',
          mimeType: 'image/png',
          playback: 'STILL',
          posterAssetId: null,
          altText: 'Attack on Titan series artwork',
        },
      },
      {
        resourceId: SERIES_TWO_ID,
        universeKey: 'universe.anime',
        resourceType: 'anime.series',
        slug: 'fullmetal-alchemist',
        displayName: 'Fullmetal Alchemist',
        summary: 'A second published Series proving reusable optional discovery.',
        updatedAt: '2026-08-24T07:00:00.000Z',
        previewMedia: null,
      },
    ],
  };
}

async function mockMedia(page: Page): Promise<void> {
  await page.route('**/api/media/assets/*/thumbnail', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: ONE_PIXEL_PNG,
    });
  });
}

async function mockDiscovery(
  page: Page,
  seriesItems: readonly Record<string, unknown>[] = seriesBody().items,
): Promise<void> {
  await page.route('**/api/knowledge/discovery?*', async (route) => {
    const url = new URL(route.request().url());

    expect(url.searchParams.get('universeKey')).toBe('universe.anime');

    const resourceType = url.searchParams.get('resourceType');

    if (resourceType === 'anime.character') {
      expect(url.searchParams.get('limit')).toBe('6');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(characterBody()),
      });
      return;
    }

    expect(resourceType).toBe('anime.series');
    expect(url.searchParams.get('limit')).toBe('4');

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ items: seriesItems }),
    });
  });
}

test.describe('UXP-03C Anime Series + social identity integration', () => {
  test('renders optional real Series with canonical Anime Series destinations', async ({
    page,
  }) => {
    await mockMedia(page);
    await mockDiscovery(page);

    const response = await page.goto('/anime');
    expect(response?.status()).toBe(200);

    const main = page.locator('main[data-uxp03c-series-social="true"]');
    await expect(main).toBeVisible();

    await expect(page.getByRole('heading', { level: 2, name: 'Explore Series' })).toBeVisible();

    const attackOnTitan = page.getByRole('link', { name: /Attack on Titan/ });
    const fullmetal = page.getByRole('link', { name: /Fullmetal Alchemist/ });

    await expect(attackOnTitan).toHaveAttribute('href', '/anime/series/attack-on-titan');
    await expect(fullmetal).toHaveAttribute('href', '/anime/series/fullmetal-alchemist');

    await expect(page.locator('a[href^="/anime/series/"]')).toHaveCount(2);

    await expect(
      page.locator(`[data-series-resource-id="${SERIES_ONE_ID}"] [data-preview-kind="image"]`),
    ).toBeVisible();
    await expect(
      page.locator(`[data-series-resource-id="${SERIES_TWO_ID}"] [data-preview-kind="none"]`),
    ).toBeVisible();

    await page.screenshot({
      path: '.playwright/uxp-03c-anime-series-present.png',
      fullPage: true,
    });
  });

  test('omits the optional Series section truthfully when no published Series exist', async ({
    page,
  }) => {
    await mockDiscovery(page, []);

    await page.goto('/anime');

    await expect(
      page.getByRole('heading', { level: 2, name: 'Recently Updated Characters' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Explore Series' })).toHaveCount(0);
    await expect(page.locator('[data-series-resource-id]')).toHaveCount(0);

    await page.screenshot({
      path: '.playwright/uxp-03c-anime-series-absent.png',
      fullPage: true,
    });
  });

  test('keeps canonical and Open Graph identity on the configured Web origin despite campaign parameters', async ({
    page,
  }) => {
    await mockDiscovery(page, []);

    await page.goto('/anime?utm_source=campaign&utm_campaign=anime-launch');

    await expect(page).toHaveTitle('Anime · AI World');

    const pageUrl = new URL(page.url());

    const canonical = page.locator('head link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);

    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBeTruthy();

    const canonicalUrl = new URL(canonicalHref!);
    expect(canonicalUrl.origin).toBe(pageUrl.origin);
    expect(canonicalUrl.pathname).toBe('/anime');
    expect(canonicalUrl.search).toBe('');
    expect(canonicalUrl.hash).toBe('');

    await expect(page.locator('head meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Anime · AI World',
    );
    await expect(page.locator('head meta[property="og:description"]')).toHaveAttribute(
      'content',
      'Explore published Anime Knowledge without leaving the shared platform or learning a new product.',
    );

    const ogImage = page.locator('head meta[property="og:image"]').first();
    await expect(ogImage).toHaveCount(1);

    const ogImageContent = await ogImage.getAttribute('content');
    expect(ogImageContent).toBeTruthy();

    const ogImageUrl = new URL(ogImageContent!);

    // Next intentionally uses localhost for file-based metadata routes in dev mode.
    // Production absolute-origin behavior is proven separately against `next start`.
    expect(ogImageUrl.protocol).toBe('http:');
    expect(ogImageUrl.port).toBe(pageUrl.port);
    expect(['localhost', '127.0.0.1']).toContain(ogImageUrl.hostname);
    expect(ogImageUrl.pathname).toBe('/anime/opengraph-image');

    const imageResponse = await page.request.get(ogImageUrl.toString());
    expect(imageResponse.status()).toBe(200);
    expect(imageResponse.headers()['content-type']).toContain('image/png');
  });

  test('keeps Search Anime on the existing Search route with native Anime and Series filters', async ({
    page,
  }) => {
    await mockDiscovery(page, []);

    await page.goto('/anime');

    const searchAnime = page.getByRole('link', { name: 'Search Anime' }).first();
    await expect(searchAnime).toHaveAttribute('href', '/search?universeKey=universe.anime');
    await searchAnime.click();

    await expect(page).toHaveURL(/\/search\?universeKey=universe\.anime$/);
    await expect(page.getByLabel('Search scope')).toHaveValue('universe.anime');
    await expect(page.getByRole('option', { name: 'Anime Universe' })).toHaveCount(1);
    await expect(page.getByRole('checkbox', { name: 'Anime series' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Anime character' })).toBeVisible();
  });
});
