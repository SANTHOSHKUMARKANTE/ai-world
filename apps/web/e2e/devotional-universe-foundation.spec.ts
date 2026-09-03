import { expect, test, type Page } from '@playwright/test';

const SHIVA_ID = 'a7000000-0000-4000-8000-000000000001';
const HANUMAN_ID = 'a7000000-0000-4000-8000-000000000002';
const DURGA_ID = 'a7000000-0000-4000-8000-000000000003';
const SHIVA_IMAGE_ID = 'a7100000-0000-4000-8000-000000000001';
const DURGA_VIDEO_ID = 'a7100000-0000-4000-8000-000000000002';
const DURGA_POSTER_ID = 'a7100000-0000-4000-8000-000000000003';
const ACTOR_ID = 'a7200000-0000-4000-8000-000000000001';

const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII=',
  'base64',
);

function deities() {
  return [
    {
      resourceId: SHIVA_ID,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      slug: 'shiva',
      displayName: 'Lord Shiva',
      summary: 'A published Deity represented through the shared Knowledge discovery contract.',
      updatedAt: '2026-08-30T08:00:00.000Z',
      previewMedia: {
        assetId: SHIVA_IMAGE_ID,
        assetType: 'IMAGE',
        mimeType: 'image/png',
        playback: 'STILL',
        posterAssetId: null,
        altText: 'Lord Shiva devotional portrait',
      },
    },
    {
      resourceId: HANUMAN_ID,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      slug: 'hanuman',
      displayName: 'Lord Hanuman',
      summary: 'A second published Deity proving one reusable landing card path.',
      updatedAt: '2026-08-29T07:00:00.000Z',
      previewMedia: null,
    },
    {
      resourceId: DURGA_ID,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      slug: 'durga',
      displayName: 'Goddess Durga',
      summary: 'A published Deity with bounded poster-backed short motion.',
      updatedAt: '2026-08-28T06:00:00.000Z',
      previewMedia: {
        assetId: DURGA_VIDEO_ID,
        assetType: 'VIDEO',
        mimeType: 'video/mp4',
        playback: 'SHORT_LOOP',
        posterAssetId: DURGA_POSTER_ID,
        altText: 'Goddess Durga short devotional motion',
      },
    },
  ];
}

function shivaEntity() {
  return {
    resource: {
      id: SHIVA_ID,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
    },
    profile: {
      slug: 'shiva',
      displayName: 'Lord Shiva',
      nativeName: 'शिव',
      alternateNames: ['Mahadeva'],
      summary: 'A published Deity represented through the shared Knowledge discovery contract.',
      overview: 'A finished canonical Devotional Deity page.',
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
        expiresAt: '2027-08-30T00:00:00.000Z',
      }),
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

async function assertDevotionalDiscoveryRequest(url: URL): Promise<void> {
  expect(url.searchParams.get('universeKey')).toBe('universe.devotional');
  expect(url.searchParams.get('resourceType')).toBe('devotional.deity');
  expect(url.searchParams.get('limit')).toBe('6');
}

async function mockDiscovery(
  page: Page,
  items: readonly Record<string, unknown>[] = deities(),
): Promise<void> {
  await page.route('**/api/knowledge/discovery?*', async (route) => {
    const url = new URL(route.request().url());
    await assertDevotionalDiscoveryRequest(url);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ items }),
    });
  });
}

test.describe('UXP-07A Devotional Universe landing + Deity discovery + social identity', () => {
  test('renders the calm Devotional shell and reusable Deity cards from generic discovery', async ({
    page,
  }) => {
    await mockAnonymousSession(page);
    await mockMedia(page);
    await mockDiscovery(page);

    const response = await page.goto('/devotional');
    expect(response?.status()).toBe(200);

    const main = page.locator('main[data-uxp07a-landing="true"]');
    await expect(main).toBeVisible();
    await expect(main).toHaveAttribute('data-universe', 'universe.devotional');
    await expect(main).toHaveAttribute('data-universe-tone', 'devotional');
    await expect(main).toHaveAttribute('data-universe-motion', 'calm');

    await expect(page.getByRole('heading', { level: 1, name: 'Devotional' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explore Deities' })).toHaveAttribute(
      'href',
      '#recently-updated-deities',
    );
    await expect(page.getByRole('link', { name: 'Search Devotional' }).first()).toHaveAttribute(
      'href',
      '/search?universeKey=universe.devotional',
    );

    await expect(
      page.getByRole('heading', { level: 2, name: 'Recently Updated Deities' }),
    ).toBeVisible();

    await expect(page.locator('[data-deity-slug]')).toHaveCount(3);

    await expect(page.getByRole('link', { name: /Lord Shiva/ })).toHaveAttribute(
      'href',
      '/devotional/shiva',
    );
    await expect(page.getByRole('link', { name: /Lord Hanuman/ })).toHaveAttribute(
      'href',
      '/devotional/hanuman',
    );
    await expect(page.getByRole('link', { name: /Goddess Durga/ })).toHaveAttribute(
      'href',
      '/devotional/durga',
    );

    await expect(
      page.locator('[data-deity-slug="shiva"] [data-preview-kind="image"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-deity-slug="hanuman"] [data-preview-kind="none"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-deity-slug="durga"] [data-preview-kind="short-loop"]'),
    ).toBeVisible();

    await expect(page.getByRole('heading', { name: /Popular|Trending|Recommended/i })).toHaveCount(
      0,
    );

    await expect(page.getByRole('link', { name: 'Explore Knowledge' })).toHaveAttribute(
      'href',
      '/knowledge',
    );

    await page.screenshot({
      path: '.playwright/uxp-07a-devotional-landing-desktop.png',
      fullPage: true,
    });
  });

  test('shows visible loading state until Deity discovery resolves', async ({ page }) => {
    await mockAnonymousSession(page);

    let release: (() => void) | undefined;

    await page.route('**/api/knowledge/discovery?*', async (route) => {
      const url = new URL(route.request().url());
      await assertDevotionalDiscoveryRequest(url);

      await new Promise<void>((resolve) => {
        release = resolve;
      });

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: deities() }),
      });
    });

    await page.goto('/devotional');

    await expect(
      page.getByRole('status').filter({ hasText: 'Loading recently updated Deities' }),
    ).toBeVisible();

    await expect.poll(() => Boolean(release)).toBe(true);
    release?.();

    await expect(page.getByRole('link', { name: /Lord Shiva/ })).toBeVisible();
  });

  test('shows accessible discovery error and recovers through retry', async ({ page }) => {
    await mockAnonymousSession(page);

    let attempts = 0;

    await page.route('**/api/knowledge/discovery?*', async (route) => {
      const url = new URL(route.request().url());
      await assertDevotionalDiscoveryRequest(url);
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
        body: JSON.stringify({ items: deities() }),
      });
    });

    await page.goto('/devotional');

    const alert = page
      .getByRole('alert')
      .filter({ hasText: 'Deity discovery is temporarily unavailable.' });
    await expect(alert).toBeVisible();

    await page.getByRole('button', { name: 'Try again' }).click();

    await expect(page.getByRole('link', { name: /Lord Shiva/ })).toBeVisible();
    expect(attempts).toBe(2);
  });

  test('shows truthful empty state when no published Deities exist', async ({ page }) => {
    await mockAnonymousSession(page);
    await mockDiscovery(page, []);

    await page.goto('/devotional');

    await expect(page.getByText('No published Deities yet.', { exact: true })).toBeVisible();
    await expect(page.locator('[data-deity-slug]')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Search Devotional' }).last()).toHaveAttribute(
      'href',
      '/search?universeKey=universe.devotional',
    );
  });

  test('uses poster instead of ambient short motion when reduced motion is requested', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockAnonymousSession(page);
    await mockMedia(page);
    await mockDiscovery(page);

    await page.goto('/devotional');

    const durga = page.locator('[data-deity-slug="durga"]');
    await expect(durga.locator('[data-preview-kind="video-poster"]')).toBeVisible();
    await expect(durga.locator('video[data-devotional-discovery-short-loop="true"]')).toHaveCount(
      0,
    );
  });

  test('keeps canonical/social identity campaign-safe with a stable Universe image', async ({
    page,
  }) => {
    await mockAnonymousSession(page);
    await mockDiscovery(page, []);

    await page.goto('/devotional?utm_source=campaign&utm_campaign=devotional-launch');

    await expect(page).toHaveTitle('Devotional · AI World');

    const pageUrl = new URL(page.url());
    const canonical = page.locator('head link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);

    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBeTruthy();

    const canonicalUrl = new URL(canonicalHref!);
    expect(canonicalUrl.origin).toBe(pageUrl.origin);
    expect(canonicalUrl.pathname).toBe('/devotional');
    expect(canonicalUrl.search).toBe('');
    expect(canonicalUrl.hash).toBe('');

    await expect(page.locator('head meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Devotional · AI World',
    );
    await expect(page.locator('head meta[property="og:description"]')).toHaveAttribute(
      'content',
      'Explore published devotional Knowledge through the same shared AI World experience.',
    );

    const ogImage = page.locator('head meta[property="og:image"]').first();
    await expect(ogImage).toHaveCount(1);

    const ogImageContent = await ogImage.getAttribute('content');
    expect(ogImageContent).toBeTruthy();

    const ogImageUrl = new URL(ogImageContent!);
    expect(ogImageUrl.protocol).toBe('http:');
    expect(ogImageUrl.port).toBe(pageUrl.port);
    expect(['localhost', '127.0.0.1']).toContain(ogImageUrl.hostname);
    expect(ogImageUrl.pathname).toBe('/devotional/opengraph-image');

    const imageResponse = await page.request.get(ogImageUrl.toString());
    expect(imageResponse.status()).toBe(200);
    expect(imageResponse.headers()['content-type']).toContain('image/png');
  });

  test('remains usable at 390px with keyboard navigation and no horizontal overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await mockAnonymousSession(page);
    await mockMedia(page);
    await mockDiscovery(page);

    await page.goto('/devotional');

    const devotionalHeading = page.getByRole('heading', { level: 1, name: 'Devotional' });
    await expect(devotionalHeading).toBeVisible();
    await expect(page.getByRole('link', { name: /Lord Shiva/ })).toBeVisible();

    const headingBounds = await devotionalHeading.evaluate((heading) => {
      const range = document.createRange();
      range.selectNodeContents(heading);
      const textRect = range.getBoundingClientRect();
      const hero = heading.closest('.aw-devotional-universe-hero');
      const heroRect = hero?.getBoundingClientRect();

      return {
        textLeft: textRect.left,
        textRight: textRect.right,
        heroLeft: heroRect?.left ?? Number.NaN,
        heroRight: heroRect?.right ?? Number.NaN,
      };
    });

    expect(Number.isFinite(headingBounds.heroLeft)).toBe(true);
    expect(Number.isFinite(headingBounds.heroRight)).toBe(true);
    expect(headingBounds.textLeft).toBeGreaterThanOrEqual(headingBounds.heroLeft - 1);
    expect(headingBounds.textRight).toBeLessThanOrEqual(headingBounds.heroRight + 1);

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);

    let reachedExplore = false;

    for (let index = 0; index < 24; index += 1) {
      await page.keyboard.press('Tab');

      const activeText = await page.evaluate(
        () => document.activeElement?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      );

      if (activeText === 'Explore Deities') {
        reachedExplore = true;
        break;
      }
    }

    expect(reachedExplore).toBe(true);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/devotional#recently-updated-deities$/);

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Search Devotional' }).first()).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: /Lord Shiva/ })).toBeFocused();

    await page.screenshot({
      path: '.playwright/uxp-07a-devotional-landing-390.png',
      fullPage: true,
    });
  });

  test('keeps authenticated shared shell and navigates into the finished canonical Deity route', async ({
    page,
  }) => {
    await mockAuthenticatedSession(page);
    await mockDiscovery(page);
    await page.route('**/api/knowledge/entities/universe.devotional/shiva', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(shivaEntity()),
      });
    });

    await page.goto('/devotional');

    const account = page.getByRole('navigation', { name: 'Account' });
    await expect(account.getByRole('link', { name: 'Create', exact: true })).toBeVisible();
    await expect(account.getByRole('link', { name: 'Saved' })).toBeVisible();
    await expect(account.getByRole('link', { name: 'Account', exact: true })).toBeVisible();
    await expect(account.getByRole('button', { name: 'Sign out' })).toBeVisible();

    await page.getByRole('link', { name: /Lord Shiva/ }).click();

    await expect(page).toHaveURL(/\/devotional\/shiva$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Lord Shiva' })).toBeVisible();
  });
});
