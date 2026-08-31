import { expect, test, type Page } from '@playwright/test';

const DEVOTIONAL_DEITY_ID = 'b8100000-0000-4000-8000-000000000001';
const DEVOTIONAL_TEMPLE_ID = 'b8100000-0000-4000-8000-000000000002';
const ANIME_CHARACTER_ID = 'b8100000-0000-4000-8000-000000000003';
const ANIME_SERIES_ID = 'b8100000-0000-4000-8000-000000000004';

const DEITY_IMAGE_ID = 'b8200000-0000-4000-8000-000000000001';
const CHARACTER_VIDEO_ID = 'b8200000-0000-4000-8000-000000000002';
const CHARACTER_POSTER_ID = 'b8200000-0000-4000-8000-000000000003';
const SERIES_IMAGE_ID = 'b8200000-0000-4000-8000-000000000004';

const ACTOR_ID = 'b8300000-0000-4000-8000-000000000001';

const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII=',
  'base64',
);

function devotionalItems() {
  return [
    {
      resourceId: DEVOTIONAL_DEITY_ID,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      slug: 'shiva',
      displayName: 'Lord Shiva',
      summary: 'Published Devotional identity with a canonical Deity destination.',
      updatedAt: '2026-08-30T09:00:00.000Z',
      previewMedia: {
        assetId: DEITY_IMAGE_ID,
        assetType: 'IMAGE',
        mimeType: 'image/png',
        playback: 'STILL',
        posterAssetId: null,
        altText: 'Lord Shiva devotional portrait',
      },
    },
    {
      resourceId: DEVOTIONAL_TEMPLE_ID,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.temple',
      slug: 'kashi-vishwanath',
      displayName: 'Kashi Vishwanath Temple',
      summary: 'Published temple Knowledge using the safe generic detail fallback.',
      updatedAt: '2026-08-30T08:00:00.000Z',
      previewMedia: null,
    },
  ];
}

function animeItems() {
  return [
    {
      resourceId: ANIME_CHARACTER_ID,
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
      slug: 'naruto-uzumaki',
      displayName: 'Naruto Uzumaki',
      summary: 'Published Character Knowledge with bounded short motion.',
      updatedAt: '2026-08-30T10:00:00.000Z',
      previewMedia: {
        assetId: CHARACTER_VIDEO_ID,
        assetType: 'VIDEO',
        mimeType: 'video/mp4',
        playback: 'SHORT_LOOP',
        posterAssetId: CHARACTER_POSTER_ID,
        altText: 'Naruto Uzumaki short motion',
      },
    },
    {
      resourceId: ANIME_SERIES_ID,
      universeKey: 'universe.anime',
      resourceType: 'anime.series',
      slug: 'naruto',
      displayName: 'Naruto',
      summary: 'Published Series Knowledge with a canonical Series destination.',
      updatedAt: '2026-08-30T07:00:00.000Z',
      previewMedia: {
        assetId: SERIES_IMAGE_ID,
        assetType: 'IMAGE',
        mimeType: 'image/png',
        playback: 'STILL',
        posterAssetId: null,
        altText: 'Naruto series artwork',
      },
    },
  ];
}

async function mockAnonymousSession(page: Page) {
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

async function mockAuthenticatedSession(page: Page) {
  await page.route('**/api/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        actorId: ACTOR_ID,
        expiresAt: '2027-08-30T00:00:00.000Z',
      }),
    });
  });
}

async function assertDiscoveryRequest(url: URL) {
  expect(url.searchParams.get('limit')).toBe('8');
  expect(url.searchParams.get('resourceType')).toBeNull();
  expect(['universe.devotional', 'universe.anime']).toContain(url.searchParams.get('universeKey'));
}

async function mockDiscovery(
  page: Page,
  options: {
    readonly devotional?: readonly Record<string, unknown>[];
    readonly anime?: readonly Record<string, unknown>[];
  } = {},
) {
  await page.route('**/api/knowledge/discovery?*', async (route) => {
    const url = new URL(route.request().url());
    await assertDiscoveryRequest(url);

    const universeKey = url.searchParams.get('universeKey');
    const items =
      universeKey === 'universe.devotional'
        ? (options.devotional ?? devotionalItems())
        : (options.anime ?? animeItems());

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ items }),
    });
  });
}

async function mockMedia(page: Page) {
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

async function assertNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
}

test.describe('UXP-08A finished Knowledge browse acceptance', () => {
  test('proves real identity, canonical destinations, media modes and anonymous shell at 1440px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await mockAnonymousSession(page);
    await mockMedia(page);
    await mockDiscovery(page);

    const response = await page.goto('/knowledge');
    expect(response?.status()).toBe(200);

    await expect(
      page.getByRole('heading', { level: 1, name: 'Explore published Knowledge' }),
    ).toBeVisible();

    const devotional = page.getByRole('region', { name: 'Devotional Knowledge' });
    const anime = page.getByRole('region', { name: 'Anime Knowledge' });

    await expect(devotional.locator('[data-knowledge-resource-id]')).toHaveCount(2);
    await expect(anime.locator('[data-knowledge-resource-id]')).toHaveCount(2);

    await expect(devotional.getByRole('heading', { name: 'Lord Shiva' })).toBeVisible();
    await expect(
      devotional.getByRole('heading', { name: 'Kashi Vishwanath Temple' }),
    ).toBeVisible();
    await expect(anime.getByRole('heading', { name: 'Naruto Uzumaki' })).toBeVisible();
    await expect(anime.getByRole('heading', { name: 'Naruto', exact: true })).toBeVisible();

    await expect(devotional.getByRole('link', { name: 'Open Lord Shiva' })).toHaveAttribute(
      'href',
      '/devotional/shiva',
    );
    await expect(
      devotional.getByRole('link', { name: 'Open Kashi Vishwanath Temple' }),
    ).toHaveAttribute('href', `/knowledge/resources/${DEVOTIONAL_TEMPLE_ID}`);
    await expect(anime.getByRole('link', { name: 'Open Naruto Uzumaki' })).toHaveAttribute(
      'href',
      '/anime/characters/naruto-uzumaki',
    );
    await expect(anime.getByRole('link', { name: 'Open Naruto', exact: true })).toHaveAttribute(
      'href',
      '/anime/series/naruto',
    );

    for (const resourceId of [
      DEVOTIONAL_DEITY_ID,
      DEVOTIONAL_TEMPLE_ID,
      ANIME_CHARACTER_ID,
      ANIME_SERIES_ID,
    ]) {
      await expect(page.getByText(resourceId, { exact: true })).toHaveCount(0);
    }

    await expect(devotional.locator('[data-preview-kind="image"]')).toHaveCount(1);
    await expect(devotional.locator('[data-preview-kind="none"]')).toHaveCount(1);
    await expect(anime.locator('[data-preview-kind="short-loop"]')).toHaveCount(1);
    await expect(anime.locator('[data-preview-kind="image"]')).toHaveCount(1);

    const motion = anime.locator('video[data-knowledge-discovery-short-loop="true"]');
    const flags = await motion.evaluate((node) => {
      const video = node as HTMLVideoElement;
      return {
        muted: video.muted,
        autoplay: video.autoplay,
        loop: video.loop,
        playsInline: video.playsInline,
      };
    });
    expect(flags).toEqual({ muted: true, autoplay: true, loop: true, playsInline: true });

    const account = page.getByRole('navigation', { name: 'Account' });
    await expect(account.getByRole('link', { name: 'Create account' })).toBeVisible();
    await expect(account.getByRole('link', { name: 'Sign in' })).toBeVisible();

    await expect(page.getByRole('link', { name: 'Search AI World' }).first()).toHaveAttribute(
      'href',
      '/search',
    );

    await assertNoHorizontalOverflow(page);

    await page.screenshot({
      path: '.playwright/uxp-08a-knowledge-1440.png',
      fullPage: true,
    });
  });

  for (const target of [
    { name: '834px tablet', width: 834, height: 1112, screenshot: '834' },
    { name: '390px mobile', width: 390, height: 844, screenshot: '390' },
    {
      name: 'effective 200% zoom hierarchy',
      width: 720,
      height: 900,
      screenshot: 'zoom200-effective',
    },
  ]) {
    test(`keeps ${target.name} readable and free of horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: target.width, height: target.height });
      await mockAnonymousSession(page);
      await mockMedia(page);
      await mockDiscovery(page);

      await page.goto('/knowledge');

      await assertNoHorizontalOverflow(page);
      await expect(
        page.getByRole('heading', { level: 1, name: 'Explore published Knowledge' }),
      ).toBeVisible();
      await expect(page.getByRole('region', { name: 'Devotional Knowledge' })).toBeVisible();
      await expect(page.getByRole('region', { name: 'Anime Knowledge' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Open Lord Shiva' })).toBeVisible();

      if (target.width <= 720) {
        const first = await page.getByRole('link', { name: 'Open Lord Shiva' }).boundingBox();
        const second = await page
          .getByRole('link', { name: 'Open Kashi Vishwanath Temple' })
          .boundingBox();

        expect(first).not.toBeNull();
        expect(second).not.toBeNull();
        expect(second!.y).toBeGreaterThan(first!.y + first!.height - 2);
      }

      await page.screenshot({
        path: `.playwright/uxp-08a-knowledge-${target.screenshot}.png`,
        fullPage: true,
      });
    });
  }

  test('keeps a visible loading state until a Universe discovery request resolves', async ({
    page,
  }) => {
    await mockAnonymousSession(page);

    let release: (() => void) | undefined;

    await page.route('**/api/knowledge/discovery?*', async (route) => {
      const url = new URL(route.request().url());
      await assertDiscoveryRequest(url);

      if (url.searchParams.get('universeKey') === 'universe.devotional') {
        await new Promise<void>((resolve) => {
          release = resolve;
        });
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items:
            url.searchParams.get('universeKey') === 'universe.devotional'
              ? devotionalItems()
              : animeItems(),
        }),
      });
    });

    await page.goto('/knowledge');

    const devotional = page.getByRole('region', { name: 'Devotional Knowledge' });
    await expect(devotional.getByRole('status')).toContainText(
      'Loading published Devotional Knowledge',
    );

    await expect.poll(() => Boolean(release)).toBe(true);
    release?.();

    await expect(devotional.getByRole('heading', { name: 'Lord Shiva' })).toBeVisible();
  });

  test('shows a bounded discovery error and retries the failed Universe locally', async ({
    page,
  }) => {
    await mockAnonymousSession(page);

    let devotionalAttempts = 0;

    await page.route('**/api/knowledge/discovery?*', async (route) => {
      const url = new URL(route.request().url());
      await assertDiscoveryRequest(url);

      if (url.searchParams.get('universeKey') === 'universe.devotional') {
        devotionalAttempts += 1;

        if (devotionalAttempts === 1) {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: { code: 'test.discovery' } }),
          });
          return;
        }
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items:
            url.searchParams.get('universeKey') === 'universe.devotional'
              ? devotionalItems()
              : animeItems(),
        }),
      });
    });

    await page.goto('/knowledge');

    const devotional = page.getByRole('region', { name: 'Devotional Knowledge' });
    await expect(devotional.getByRole('alert')).toContainText(
      'Devotional Knowledge is temporarily unavailable.',
    );

    await devotional.getByRole('button', { name: 'Try again' }).click();

    await expect(devotional.getByRole('heading', { name: 'Lord Shiva' })).toBeVisible();
    expect(devotionalAttempts).toBe(2);
  });

  test('renders honest empty states without inventing featured or popularity semantics', async ({
    page,
  }) => {
    await mockAnonymousSession(page);
    await mockDiscovery(page, { devotional: [], anime: [] });

    await page.goto('/knowledge');

    await expect(page.getByText('No published resources yet.', { exact: true })).toHaveCount(2);
    await expect(page.locator('[data-knowledge-resource-id]')).toHaveCount(0);
    await expect(page.getByText(/Trending|Popular|Recommended|Featured resource/i)).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Search AI World' }).last()).toHaveAttribute(
      'href',
      '/search',
    );
  });

  test('uses the poster instead of ambient short motion when reduced motion is requested', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockAnonymousSession(page);
    await mockMedia(page);
    await mockDiscovery(page);

    await page.goto('/knowledge');

    const anime = page.getByRole('region', { name: 'Anime Knowledge' });
    const character = anime.locator(`[data-knowledge-resource-id="${ANIME_CHARACTER_ID}"]`);

    await expect(character.locator('[data-preview-kind="video-poster"]')).toBeVisible();
    await expect(
      character.locator('video[data-knowledge-discovery-short-loop="true"]'),
    ).toHaveCount(0);
  });

  test('keeps /knowledge canonical and social identity stable across campaign entry', async ({
    page,
  }) => {
    await mockAnonymousSession(page);
    await mockDiscovery(page, { devotional: [], anime: [] });

    await page.goto('/knowledge?utm_source=campaign&utm_campaign=uxp08a');

    await expect(page).toHaveTitle('Knowledge · AI World');

    const canonicalHref = await page.locator('head link[rel="canonical"]').getAttribute('href');
    expect(canonicalHref).toBeTruthy();

    const canonical = new URL(canonicalHref!);
    expect(canonical.pathname).toBe('/knowledge');
    expect(canonical.search).toBe('');
    expect(canonical.hash).toBe('');

    await expect(page.locator('head meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Knowledge · AI World',
    );

    const ogImage = await page
      .locator('head meta[property="og:image"]')
      .first()
      .getAttribute('content');
    expect(ogImage).toBeTruthy();
    expect(new URL(ogImage!).pathname).toBe('/knowledge/opengraph-image');
  });

  test('keeps the authenticated shared shell without introducing browse-specific management controls', async ({
    page,
  }) => {
    await mockAuthenticatedSession(page);
    await mockDiscovery(page, { devotional: [], anime: [] });

    await page.goto('/knowledge');

    const account = page.getByRole('navigation', { name: 'Account' });
    await expect(account.getByRole('link', { name: 'Create', exact: true })).toBeVisible();
    await expect(account.getByRole('link', { name: 'Saved' })).toBeVisible();
    await expect(account.getByRole('link', { name: 'Account', exact: true })).toBeVisible();
    await expect(account.getByRole('button', { name: 'Sign out' })).toBeVisible();

    const main = page.locator('main[data-uxp08a-knowledge-browse="true"]');
    await expect(main.getByText(/Admin|Manage Knowledge|Featured Resources/i)).toHaveCount(0);
  });

  test('keeps keyboard focus visible on a real canonical Knowledge card destination', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await mockAnonymousSession(page);
    await mockDiscovery(page);

    await page.goto('/knowledge');

    const card = page.getByRole('link', { name: 'Open Lord Shiva' });
    await card.focus();
    await expect(card).toBeFocused();

    const style = await card.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        outlineStyle: computed.outlineStyle,
        outlineWidth: computed.outlineWidth,
        boxShadow: computed.boxShadow,
      };
    });

    expect(
      style.outlineStyle !== 'none' || style.outlineWidth !== '0px' || style.boxShadow !== 'none',
    ).toBe(true);
  });
});
