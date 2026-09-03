import { expect, test, type Page, type Route } from '@playwright/test';

const NARUTO_ID = '93000000-0000-4000-8000-000000000001';
const SASUKE_ID = '93000000-0000-4000-8000-000000000002';
const KAKASHI_ID = '93000000-0000-4000-8000-000000000003';
const NARUTO_IMAGE_ID = '94000000-0000-4000-8000-000000000001';
const KAKASHI_VIDEO_ID = '94000000-0000-4000-8000-000000000002';
const KAKASHI_POSTER_ID = '94000000-0000-4000-8000-000000000003';

const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII=',
  'base64',
);

function discoveryBody() {
  return {
    items: [
      {
        resourceId: NARUTO_ID,
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        slug: 'naruto-uzumaki',
        displayName: 'Naruto Uzumaki',
        summary: 'A determined shinobi whose journey is shaped by courage and bonds.',
        updatedAt: '2026-08-25T04:00:00.000Z',
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
        updatedAt: '2026-08-24T03:00:00.000Z',
        previewMedia: null,
      },
      {
        resourceId: KAKASHI_ID,
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        slug: 'kakashi-hatake',
        displayName: 'Kakashi Hatake',
        summary: 'A veteran shinobi and teacher with a calm eye for every challenge.',
        updatedAt: '2026-08-23T02:00:00.000Z',
        previewMedia: {
          assetId: KAKASHI_VIDEO_ID,
          assetType: 'VIDEO',
          mimeType: 'video/mp4',
          playback: 'SHORT_LOOP',
          posterAssetId: KAKASHI_POSTER_ID,
          altText: 'Kakashi Hatake short-motion portrait',
        },
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

  await page.route('**/api/media/assets/*/content', async (route) => {
    await route.fulfill({
      status: 204,
      contentType: 'video/mp4',
      body: '',
    });
  });
}

async function fulfillOptionalSeries(route: Route): Promise<boolean> {
  const url = new URL(route.request().url());

  expect(url.searchParams.get('universeKey')).toBe('universe.anime');

  if (url.searchParams.get('resourceType') !== 'anime.series') {
    return false;
  }

  expect(url.searchParams.get('limit')).toBe('4');

  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ items: [] }),
  });

  return true;
}

async function assertCharacterRequest(route: Route): Promise<void> {
  const url = new URL(route.request().url());

  expect(url.searchParams.get('universeKey')).toBe('universe.anime');
  expect(url.searchParams.get('resourceType')).toBe('anime.character');
  expect(url.searchParams.get('limit')).toBe('6');
}

async function mockDiscovery(page: Page, body = discoveryBody()): Promise<void> {
  await page.route('**/api/knowledge/discovery?*', async (route) => {
    if (await fulfillOptionalSeries(route)) {
      return;
    }

    await assertCharacterRequest(route);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

test.describe('UXP-03B Anime Universe landing + Character discovery', () => {
  test('renders the finished Anime shell and reusable Character cards from real discovery data', async ({
    page,
  }) => {
    await mockMedia(page);
    await mockDiscovery(page);

    const response = await page.goto('/anime');
    expect(response?.status()).toBe(200);

    const main = page.locator('main[data-uxp03b-landing="true"]');
    await expect(main).toBeVisible();
    await expect(main).toHaveAttribute('data-universe', 'universe.anime');
    await expect(main).toHaveAttribute('data-universe-tone', 'anime');
    await expect(main).toHaveAttribute('data-universe-motion', 'energetic');

    await expect(page.getByRole('heading', { level: 1, name: 'Anime' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explore Characters' })).toHaveAttribute(
      'href',
      '#recently-updated-characters',
    );
    await expect(page.getByRole('link', { name: 'Search Anime' }).first()).toHaveAttribute(
      'href',
      '/search?universeKey=universe.anime',
    );

    await expect(
      page.getByRole('heading', { level: 2, name: 'Recently Updated Characters' }),
    ).toBeVisible();

    await expect(page.getByRole('link', { name: /Naruto Uzumaki/ })).toHaveAttribute(
      'href',
      '/anime/characters/naruto-uzumaki',
    );
    await expect(page.getByRole('link', { name: /Sasuke Uchiha/ })).toHaveAttribute(
      'href',
      '/anime/characters/sasuke-uchiha',
    );
    await expect(page.getByRole('link', { name: /Kakashi Hatake/ })).toHaveAttribute(
      'href',
      '/anime/characters/kakashi-hatake',
    );

    await expect(
      page.locator('[data-character-slug="naruto-uzumaki"] [data-preview-kind="image"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-character-slug="sasuke-uchiha"] [data-preview-kind="none"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-character-slug="kakashi-hatake"] [data-preview-kind="short-loop"]'),
    ).toBeVisible();

    await page.screenshot({
      path: '.playwright/uxp-03b-anime-landing-desktop.png',
      fullPage: true,
    });
  });

  test('shows a visible loading state until Character discovery resolves', async ({ page }) => {
    let release: (() => void) | undefined;

    await page.route('**/api/knowledge/discovery?*', async (route) => {
      if (await fulfillOptionalSeries(route)) {
        return;
      }

      await assertCharacterRequest(route);

      await new Promise<void>((resolve) => {
        release = resolve;
      });

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(discoveryBody()),
      });
    });

    await page.goto('/anime');

    await expect(
      page.getByRole('status').filter({ hasText: 'Loading recently updated characters' }),
    ).toBeVisible();

    await expect.poll(() => Boolean(release)).toBe(true);
    release?.();

    await expect(page.getByRole('link', { name: /Naruto Uzumaki/ })).toBeVisible();
  });

  test('shows an accessible unexpected-error state and recovers through retry', async ({
    page,
  }) => {
    let attempts = 0;

    await page.route('**/api/knowledge/discovery?*', async (route) => {
      if (await fulfillOptionalSeries(route)) {
        return;
      }

      await assertCharacterRequest(route);
      attempts += 1;

      if (attempts === 1) {
        await route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({
            error: {
              code: 'test.unavailable',
              message: 'Temporarily unavailable',
            },
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(discoveryBody()),
      });
    });

    await page.goto('/anime');

    const alert = page
      .getByRole('alert')
      .filter({ hasText: 'Character discovery is temporarily unavailable.' });
    await expect(alert).toBeVisible();

    await page.getByRole('button', { name: 'Try again' }).click();

    await expect(page.getByRole('link', { name: /Naruto Uzumaki/ })).toBeVisible();
    expect(attempts).toBe(2);

    await page.screenshot({
      path: '.playwright/uxp-03b-anime-landing-recovered.png',
      fullPage: true,
    });
  });

  test('shows a truthful empty state when no published Anime Characters exist', async ({
    page,
  }) => {
    await mockDiscovery(page, { items: [] });

    await page.goto('/anime');

    await expect(
      page.getByText('No published Anime Characters yet.', { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Search Anime' }).last()).toHaveAttribute(
      'href',
      '/search?universeKey=universe.anime',
    );
    await expect(page.locator('.aw-anime-discovery-card')).toHaveCount(0);

    await page.screenshot({
      path: '.playwright/uxp-03b-anime-landing-empty.png',
      fullPage: true,
    });
  });

  test('uses the video poster instead of ambient motion when reduced motion is requested', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockMedia(page);
    await mockDiscovery(page);

    await page.goto('/anime');

    const kakashi = page.locator('[data-character-slug="kakashi-hatake"]');
    await expect(kakashi.locator('[data-preview-kind="video-poster"]')).toBeVisible();
    await expect(kakashi.locator('video[data-anime-discovery-short-loop="true"]')).toHaveCount(0);
  });

  test('remains usable at 390px and exposes hero actions through keyboard navigation', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await mockMedia(page);
    await mockDiscovery(page);

    await page.goto('/anime');

    await expect(page.getByRole('heading', { level: 1, name: 'Anime' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Naruto Uzumaki/ })).toBeVisible();

    const noHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    );
    expect(noHorizontalOverflow).toBe(true);

    let reachedExplore = false;

    for (let index = 0; index < 24; index += 1) {
      await page.keyboard.press('Tab');

      const activeText = await page.evaluate(
        () => document.activeElement?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      );

      if (activeText === 'Explore Characters') {
        reachedExplore = true;
        break;
      }
    }

    expect(reachedExplore).toBe(true);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/anime#recently-updated-characters$/);

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Search Anime' }).first()).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: /Naruto Uzumaki/ })).toBeFocused();

    await page.screenshot({
      path: '.playwright/uxp-03b-anime-landing-390.png',
      fullPage: true,
    });
  });
});
