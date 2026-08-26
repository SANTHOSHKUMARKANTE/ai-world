import { expect, test, type Page } from '@playwright/test';

const NARUTO_ID = '98000000-0000-4000-8000-000000000001';
const SASUKE_ID = '98000000-0000-4000-8000-000000000002';
const KAKASHI_ID = '98000000-0000-4000-8000-000000000003';
const NARUTO_IMAGE_ID = '98100000-0000-4000-8000-000000000001';
const KAKASHI_VIDEO_ID = '98100000-0000-4000-8000-000000000002';
const KAKASHI_POSTER_ID = '98100000-0000-4000-8000-000000000003';

const SERIES_ONE_ID = '98200000-0000-4000-8000-000000000001';
const SERIES_TWO_ID = '98200000-0000-4000-8000-000000000002';
const SERIES_IMAGE_ID = '98300000-0000-4000-8000-000000000001';

const ACTOR_ID = '98400000-0000-4000-8000-000000000001';

const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII=',
  'base64',
);

function characters() {
  return [
    {
      resourceId: NARUTO_ID,
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
      slug: 'naruto-uzumaki',
      displayName: 'Naruto Uzumaki',
      summary: 'A determined shinobi whose journey is shaped by courage and bonds.',
      updatedAt: '2026-08-25T10:00:00.000Z',
      previewMedia: {
        assetId: NARUTO_IMAGE_ID,
        assetType: 'IMAGE',
        mimeType: 'image/png',
        playback: 'STILL',
        posterAssetId: null,
        altText: 'Naruto Uzumaki portrait',
      },
    },
    {
      resourceId: SASUKE_ID,
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
      slug: 'sasuke-uchiha',
      displayName: 'Sasuke Uchiha',
      summary: 'A gifted shinobi whose path is defined by rivalry and resolve.',
      updatedAt: '2026-08-24T09:00:00.000Z',
      previewMedia: null,
    },
    {
      resourceId: KAKASHI_ID,
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
      slug: 'kakashi-hatake',
      displayName: 'Kakashi Hatake',
      summary: 'A veteran shinobi and teacher with a calm eye for every challenge.',
      updatedAt: '2026-08-23T08:00:00.000Z',
      previewMedia: {
        assetId: KAKASHI_VIDEO_ID,
        assetType: 'VIDEO',
        mimeType: 'video/mp4',
        playback: 'SHORT_LOOP',
        posterAssetId: KAKASHI_POSTER_ID,
        altText: 'Kakashi Hatake short-motion portrait',
      },
    },
  ];
}

function series() {
  return [
    {
      resourceId: SERIES_ONE_ID,
      universeKey: 'universe.anime',
      resourceType: 'anime.series',
      slug: 'attack-on-titan',
      displayName: 'Attack on Titan',
      summary: 'A published Anime Series represented through the generic Knowledge contract.',
      updatedAt: '2026-08-22T07:00:00.000Z',
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
      updatedAt: '2026-08-21T06:00:00.000Z',
      previewMedia: null,
    },
  ];
}

function narutoEntity() {
  return {
    resource: {
      id: NARUTO_ID,
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
    },
    profile: {
      slug: 'naruto-uzumaki',
      displayName: 'Naruto Uzumaki',
      nativeName: null,
      alternateNames: [],
      summary: 'A determined shinobi whose journey is shaped by courage and bonds.',
      overview: null,
      facts: [],
    },
    media: [],
    relations: [],
  };
}

async function mockAnonymousSession(page: Page): Promise<void> {
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

async function mockAuthenticatedSession(page: Page): Promise<void> {
  await page.route('**/api/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        actorId: ACTOR_ID,
        expiresAt: '2027-08-25T00:00:00.000Z',
      }),
    });
  });
}

async function mockDiscovery(
  page: Page,
  options: {
    readonly characters?: readonly Record<string, unknown>[];
    readonly series?: readonly Record<string, unknown>[];
  } = {},
): Promise<void> {
  const characterItems = options.characters ?? characters();
  const seriesItems = options.series ?? series();

  await page.route('**/api/knowledge/discovery?*', async (route) => {
    const url = new URL(route.request().url());

    expect(url.searchParams.get('universeKey')).toBe('universe.anime');

    const resourceType = url.searchParams.get('resourceType');

    if (resourceType === 'anime.character') {
      expect(url.searchParams.get('limit')).toBe('6');

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: characterItems }),
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

async function mockMedia(page: Page): Promise<void> {
  await page.route('**/api/media/assets/*/thumbnail', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: ONE_PIXEL_PNG,
    });
  });

  await page.route('**/api/media/assets/*/content', async (route) => {
    await route.fulfill({
      status: 204,
      contentType: 'video/mp4',
      body: '',
    });
  });
}

test.describe('UXP-03D full Anime landing acceptance gaps', () => {
  test('proves the reusable Character + optional Series media matrix at tablet width', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await mockAnonymousSession(page);
    await mockMedia(page);
    await mockDiscovery(page);

    const response = await page.goto('/anime');
    expect(response?.status()).toBe(200);

    const main = page.locator('main[data-uxp03c-series-social="true"]');
    await expect(main).toBeVisible();

    await expect(
      page.getByRole('heading', { level: 2, name: 'Recently Updated Characters' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Explore Series' })).toBeVisible();

    await expect(page.locator('[data-character-slug]')).toHaveCount(3);
    await expect(page.locator('[data-series-resource-id]')).toHaveCount(2);

    await expect(
      page.locator('[data-character-slug="naruto-uzumaki"] [data-preview-kind="image"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-character-slug="sasuke-uchiha"] [data-preview-kind="none"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-character-slug="kakashi-hatake"] [data-preview-kind="short-loop"]'),
    ).toBeVisible();

    await expect(
      page.locator(`[data-series-resource-id="${SERIES_ONE_ID}"] [data-preview-kind="image"]`),
    ).toBeVisible();
    await expect(
      page.locator(`[data-series-resource-id="${SERIES_TWO_ID}"] [data-preview-kind="none"]`),
    ).toBeVisible();

    const attackOnTitan = page.getByRole('link', { name: /Attack on Titan/ });
    const fullmetal = page.getByRole('link', { name: /Fullmetal Alchemist/ });

    await expect(attackOnTitan).toHaveAttribute('href', '/anime/series/attack-on-titan');
    await expect(fullmetal).toHaveAttribute('href', '/anime/series/fullmetal-alchemist');
    await expect(page.locator('a[href^="/anime/series/"]')).toHaveCount(2);

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);

    await page.screenshot({
      path: '.playwright/uxp-03d-anime-landing-tablet.png',
      fullPage: true,
    });
  });

  test('keeps the public Anime landing coherent inside the anonymous shared shell', async ({
    page,
  }) => {
    await mockAnonymousSession(page);
    await mockDiscovery(page, { series: [] });

    await page.goto('/anime');

    const account = page.getByRole('navigation', { name: 'Account' });

    await expect(account.getByRole('link', { name: 'Create account' })).toBeVisible();
    await expect(account.getByRole('link', { name: 'Sign in' })).toBeVisible();
    await expect(account.getByRole('link', { name: 'Saved' })).toHaveCount(0);
    await expect(account.getByRole('link', { name: 'Account', exact: true })).toHaveCount(0);
    await expect(account.getByRole('button', { name: 'Sign out' })).toHaveCount(0);

    await expect(page.getByRole('heading', { level: 1, name: 'Anime' })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Recently Updated Characters' }),
    ).toBeVisible();

    await page.screenshot({
      path: '.playwright/uxp-03d-anime-anonymous-shell.png',
      fullPage: true,
    });
  });

  test('keeps the public Anime landing coherent inside the authenticated shared shell', async ({
    page,
  }) => {
    await mockAuthenticatedSession(page);
    await mockDiscovery(page, { series: [] });

    await page.goto('/anime');

    const account = page.getByRole('navigation', { name: 'Account' });

    await expect(account.getByRole('link', { name: 'Create', exact: true })).toBeVisible();
    await expect(account.getByRole('link', { name: 'Saved' })).toBeVisible();
    await expect(account.getByRole('link', { name: 'Account', exact: true })).toBeVisible();
    await expect(account.getByRole('button', { name: 'Sign out' })).toBeVisible();

    await expect(account.getByRole('link', { name: 'Create account' })).toHaveCount(0);
    await expect(account.getByRole('link', { name: 'Sign in' })).toHaveCount(0);

    await expect(page.getByRole('heading', { level: 1, name: 'Anime' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Naruto Uzumaki/ })).toBeVisible();

    await page.screenshot({
      path: '.playwright/uxp-03d-anime-authenticated-shell.png',
      fullPage: true,
    });
  });

  test('navigates from landing discovery into the finished canonical Character route', async ({
    page,
  }) => {
    await mockAnonymousSession(page);
    await mockDiscovery(page, { series: [] });

    await page.route('**/api/knowledge/entities/universe.anime/naruto-uzumaki', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(narutoEntity()),
      });
    });

    await page.goto('/anime');

    await page.getByRole('link', { name: /Naruto Uzumaki/ }).click();

    await expect(page).toHaveURL(/\/anime\/characters\/naruto-uzumaki$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Naruto Uzumaki' })).toBeVisible();
  });
});
