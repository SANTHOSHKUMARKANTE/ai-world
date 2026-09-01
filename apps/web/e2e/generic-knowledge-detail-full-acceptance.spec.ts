import { expect, test, type Page } from '@playwright/test';

const GENERIC_ID = 'a9100000-0000-4000-8000-000000000001';
const PROFILELESS_ID = 'a9100000-0000-4000-8000-000000000002';
const CHARACTER_ID = 'a9100000-0000-4000-8000-000000000003';
const IMAGE_ID = 'a9200000-0000-4000-8000-000000000001';
const VIDEO_ID = 'a9200000-0000-4000-8000-000000000002';
const POSTER_ID = 'a9200000-0000-4000-8000-000000000003';

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII=',
  'base64',
);

function resource(id = GENERIC_ID) {
  const specializedCharacter = id === CHARACTER_ID;

  return {
    id,
    universeKey: specializedCharacter ? 'universe.anime' : 'universe.devotional',
    resourceType: specializedCharacter ? 'anime.character' : 'devotional.temple',
    createdAt: '2026-08-30T08:00:00.000Z',
    updatedAt: '2026-08-31T08:00:00.000Z',
  };
}

function genericEntity() {
  return {
    resource: {
      id: GENERIC_ID,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.temple',
    },
    profile: {
      slug: 'kashi-vishwanath',
      displayName: 'Kashi Vishwanath Temple',
      nativeName: 'काशी विश्वनाथ मंदिर',
      alternateNames: ['Golden Temple'],
      summary: 'A published sacred-place Knowledge fixture.',
      overview: 'A longer public overview used by the generic Knowledge destination.',
      facts: [{ key: 'devotional.location', label: 'Location', value: 'Varanasi' }],
    },
    media: [
      {
        assetId: IMAGE_ID,
        assetType: 'IMAGE',
        mimeType: 'image/png',
        role: 'HERO',
        playback: 'STILL',
        position: 0,
        altText: 'Kashi Vishwanath Temple artwork',
        caption: 'Published temple artwork',
        posterAssetId: null,
      },
      {
        assetId: VIDEO_ID,
        assetType: 'VIDEO',
        mimeType: 'video/mp4',
        role: 'HIGHLIGHT',
        playback: 'SHORT_LOOP',
        position: 1,
        altText: 'Temple short motion',
        caption: 'Five second motion',
        durationMs: 5000,
        posterAssetId: POSTER_ID,
      },
    ],
    relations: [
      {
        sectionKey: 'entity.family',
        relationshipType: 'devotional.association',
        position: 0,
        target: {
          id: 'a9300000-0000-4000-8000-000000000001',
          universeKey: 'universe.devotional',
          resourceType: 'devotional.deity',
          slug: 'shiva',
          displayName: 'Lord Shiva',
          summary: 'Related canonical Deity.',
          previewAssetId: null,
        },
      },
    ],
  };
}

function characterEntity() {
  return {
    ...genericEntity(),
    resource: {
      id: CHARACTER_ID,
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
    },
    profile: {
      ...genericEntity().profile,
      slug: 'naruto-uzumaki',
      displayName: 'Naruto Uzumaki',
      nativeName: null,
      alternateNames: [],
      summary: 'Published Character should use its specialized canonical destination.',
      facts: [],
    },
    media: [],
    relations: [],
  };
}

async function mockAnonymous(page: Page): Promise<void> {
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

async function mockGenericApi(page: Page): Promise<void> {
  await page.route('**/api/knowledge/resources/**', async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname.endsWith('/assets')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ assetIds: [] }),
      });
      return;
    }

    const match = url.pathname.match(/\/api\/knowledge\/resources\/([^/]+)$/);
    if (!match) {
      await route.fallback();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(resource(match[1])),
    });
  });

  await page.route('**/api/knowledge/entities/by-resource/*', async (route) => {
    const id = new URL(route.request().url()).pathname.split('/').at(-1);
    const payload =
      id === GENERIC_ID ? genericEntity() : id === CHARACTER_ID ? characterEntity() : null;

    if (!payload) {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'knowledge.entity.public_not_found',
            message: 'Knowledge Entity not found.',
            status: 404,
          },
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(payload),
    });
  });

  await page.route('**/api/media/assets/*/thumbnail', async (route) => {
    await route.fulfill({ status: 200, contentType: 'image/png', body: PNG });
  });

  await page.route('**/api/media/assets/*/content', async (route) => {
    await route.fulfill({ status: 204, contentType: 'video/mp4', body: '' });
  });
}

async function assertNoOverflow(page: Page): Promise<void> {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
}

test.describe('UXP-08B finished generic Knowledge detail', () => {
  test('renders real generic identity, facts, Media, relations, Engagement and no raw Resource ID', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await mockAnonymous(page);
    await mockGenericApi(page);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (value: string) => {
            window.sessionStorage.setItem('uxp08b-copied-link', value);
          },
        },
      });
    });

    const response = await page.goto(`/knowledge/resources/${GENERIC_ID}?utm_source=instagram`);
    expect(response?.status()).toBe(200);

    await expect(
      page.getByRole('heading', { level: 1, name: 'Kashi Vishwanath Temple' }),
    ).toBeVisible();
    await expect(page.getByText('A published sacred-place Knowledge fixture.')).toBeVisible();
    await expect(page.getByText('Varanasi')).toBeVisible();
    await expect(page.getByText('Golden Temple')).toBeVisible();
    await expect(page.getByText(GENERIC_ID, { exact: true })).toHaveCount(0);
    await expect(page.getByText('devotional.temple', { exact: true })).toHaveCount(0);
    await expect(page.getByAltText('Kashi Vishwanath Temple artwork')).toBeVisible();
    await expect(page.getByLabel('Temple short motion')).toBeVisible();
    await expect(page.getByRole('link', { name: /^Lord Shiva/ })).toHaveAttribute(
      'href',
      '/devotional/shiva',
    );
    await expect(
      page.locator('.aw-resource-detail').getByRole('link', { name: 'Sign in' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Copy link', exact: true }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Link copied.' })).toBeVisible();

    const copied = await page.evaluate(() => sessionStorage.getItem('uxp08b-copied-link'));
    expect(copied).not.toBeNull();
    const copiedUrl = new URL(copied!);
    expect(copiedUrl.pathname).toBe(`/knowledge/resources/${GENERIC_ID}`);
    expect(copiedUrl.search).toBe('');

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).not.toBeNull();
    const canonicalUrl = new URL(canonical!, page.url());
    expect(canonicalUrl.pathname).toBe(`/knowledge/resources/${GENERIC_ID}`);
    expect(canonicalUrl.search).toBe('');

    await assertNoOverflow(page);
    await page.screenshot({
      path: '.playwright/uxp-08b-generic-detail-1440.png',
      fullPage: true,
    });
  });

  for (const target of [
    { name: '834 tablet', width: 834, height: 1112, screenshot: '834' },
    { name: '390 mobile', width: 390, height: 844, screenshot: '390' },
    { name: 'effective 200 percent', width: 720, height: 900, screenshot: 'zoom200' },
  ]) {
    test(`keeps ${target.name} hierarchy readable without horizontal overflow`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: target.width, height: target.height });
      await mockAnonymous(page);
      await mockGenericApi(page);

      await page.goto(`/knowledge/resources/${GENERIC_ID}`);
      await expect(
        page.getByRole('heading', { level: 1, name: 'Kashi Vishwanath Temple' }),
      ).toBeVisible();
      await assertNoOverflow(page);

      await page.screenshot({
        path: `.playwright/uxp-08b-generic-detail-${target.screenshot}.png`,
        fullPage: true,
      });
    });
  }

  test('uses a reduced-motion poster instead of ambient short-loop playback', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockAnonymous(page);
    await mockGenericApi(page);

    await page.goto(`/knowledge/resources/${GENERIC_ID}`);

    await expect(
      page.getByRole('heading', { level: 1, name: 'Kashi Vishwanath Temple' }),
    ).toBeVisible();
    await expect(page.locator('video[data-generic-short-loop="true"]')).toHaveCount(0);
    await expect(page.locator('[data-generic-video-poster="true"]')).toBeVisible();
  });

  test('keeps a profileless PUBLISHED Resource as a truthful generic fallback', async ({
    page,
  }) => {
    await mockAnonymous(page);
    await mockGenericApi(page);

    await page.goto(`/knowledge/resources/${PROFILELESS_ID}`);

    await expect(page.getByRole('heading', { level: 1, name: 'Temple' })).toBeVisible();
    await expect(page.getByText(/Published Temple in Devotional/)).toBeVisible();
    await expect(page.getByText(PROFILELESS_ID, { exact: true })).toHaveCount(0);
    await expect(
      page.locator('.aw-resource-detail').getByRole('link', { name: 'Sign in' }),
    ).toBeVisible();
  });

  test('redirects a specialized Resource URL to its accepted canonical destination', async ({
    page,
  }) => {
    await mockAnonymous(page);
    await mockGenericApi(page);

    await page.goto(`/knowledge/resources/${CHARACTER_ID}?utm_source=generic-fallback`);
    await page.waitForURL('**/anime/characters/naruto-uzumaki');

    const canonicalUrl = new URL(page.url());
    expect(canonicalUrl.pathname).toBe('/anime/characters/naruto-uzumaki');
    expect(canonicalUrl.search).toBe('');
  });

  test('shows loading, not-found, unexpected-error and local retry states', async ({ page }) => {
    await mockAnonymous(page);

    let release: (() => void) | undefined;
    let attempts = 0;

    await page.route(`**/api/knowledge/resources/${GENERIC_ID}`, async (route) => {
      attempts += 1;
      if (attempts === 1) {
        await new Promise<void>((resolve) => {
          release = resolve;
        });
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: { code: 'test.failure', message: 'Failed.', status: 500 },
          }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(resource()),
      });
    });

    await page.goto(`/knowledge/resources/${GENERIC_ID}`);
    await expect(page.locator('.aw-generic-status[role="status"]')).toContainText(
      'Loading published Knowledge',
    );
    await expect.poll(() => Boolean(release)).toBe(true);
    release?.();

    await expect(
      page.getByRole('alert').filter({ hasText: 'temporarily unavailable' }),
    ).toContainText('temporarily unavailable');
    await page.getByRole('button', { name: 'Try again' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Temple' })).toBeVisible();

    const missingId = 'a9100000-0000-4000-8000-000000000099';
    await page.route(`**/api/knowledge/resources/${missingId}`, async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'knowledge.resource.public_not_found',
            message: 'Knowledge Resource not found.',
            status: 404,
          },
        }),
      });
    });

    await page.goto(`/knowledge/resources/${missingId}`);
    await expect(page.getByText('Published Knowledge not found')).toBeVisible();
  });
});
