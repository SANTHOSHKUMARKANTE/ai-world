import { expect, test, type Page } from '@playwright/test';

const VISHNU_ID = 'a8100000-0000-4000-8000-000000000001';
const LAKSHMI_ID = 'a8100000-0000-4000-8000-000000000002';
const GANESHA_ID = 'a8100000-0000-4000-8000-000000000003';
const SARASWATI_ID = 'a8100000-0000-4000-8000-000000000004';
const VISHNU_IMAGE_ID = 'a8200000-0000-4000-8000-000000000001';
const SARASWATI_IMAGE_ID = 'a8200000-0000-4000-8000-000000000002';
const GANESHA_VIDEO_ID = 'a8200000-0000-4000-8000-000000000003';
const GANESHA_POSTER_ID = 'a8200000-0000-4000-8000-000000000004';
const ACTOR_ID = 'a8300000-0000-4000-8000-000000000001';

const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII=',
  'base64',
);

function devotionalItems() {
  return [
    {
      resourceId: VISHNU_ID,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      slug: 'vishnu',
      displayName: 'Lord Vishnu',
      summary: 'Preserver within a reusable Devotional discovery acceptance fixture.',
      updatedAt: '2026-08-30T09:00:00.000Z',
      previewMedia: {
        assetId: VISHNU_IMAGE_ID,
        assetType: 'IMAGE',
        mimeType: 'image/png',
        playback: 'STILL',
        posterAssetId: null,
        altText: 'Lord Vishnu devotional portrait',
      },
    },
    {
      resourceId: LAKSHMI_ID,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      slug: 'lakshmi',
      displayName: 'Goddess Lakshmi',
      summary: 'A published Deity intentionally proving the no-Media card path.',
      updatedAt: '2026-08-30T08:00:00.000Z',
      previewMedia: null,
    },
    {
      resourceId: GANESHA_ID,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      slug: 'ganesha',
      displayName: 'Lord Ganesha',
      summary: 'A published Deity with bounded poster-backed short motion.',
      updatedAt: '2026-08-30T07:00:00.000Z',
      previewMedia: {
        assetId: GANESHA_VIDEO_ID,
        assetType: 'VIDEO',
        mimeType: 'video/mp4',
        playback: 'SHORT_LOOP',
        posterAssetId: GANESHA_POSTER_ID,
        altText: 'Lord Ganesha devotional motion',
      },
    },
    {
      resourceId: SARASWATI_ID,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      slug: 'saraswati',
      displayName: 'Goddess Saraswati',
      summary: 'A second still-image Deity proving reusable card composition.',
      updatedAt: '2026-08-30T06:00:00.000Z',
      previewMedia: {
        assetId: SARASWATI_IMAGE_ID,
        assetType: 'IMAGE',
        mimeType: 'image/png',
        playback: 'STILL',
        posterAssetId: null,
        altText: 'Goddess Saraswati devotional portrait',
      },
    },
  ];
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

async function assertDevotionalDiscoveryRequest(url: URL): Promise<void> {
  expect(url.searchParams.get('universeKey')).toBe('universe.devotional');
  expect(url.searchParams.get('resourceType')).toBe('devotional.deity');
  expect(url.searchParams.get('limit')).toBe('6');
}

async function mockDiscovery(
  page: Page,
  items: readonly Record<string, unknown>[] = devotionalItems(),
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

async function mockMedia(
  page: Page,
  options: { readonly failThumbnailAssetId?: string } = {},
): Promise<void> {
  await page.route('**/api/media/assets/*/thumbnail', async (route) => {
    const url = new URL(route.request().url());
    const match = url.pathname.match(/\/api\/media\/assets\/([^/]+)\/thumbnail$/);
    const assetId = match?.[1] ? decodeURIComponent(match[1]) : '';

    if (assetId === options.failThumbnailAssetId) {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: { code: 'test.media_unavailable' } }),
      });
      return;
    }

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

async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
}

async function assertHeadingContained(page: Page): Promise<void> {
  const heading = page.getByRole('heading', { level: 1, name: 'Devotional' });
  await expect(heading).toBeVisible();

  const bounds = await heading.evaluate((node) => {
    const range = document.createRange();
    range.selectNodeContents(node);
    const textRect = range.getBoundingClientRect();
    const hero = node.closest('.aw-devotional-universe-hero');
    const heroRect = hero?.getBoundingClientRect();

    return {
      textLeft: textRect.left,
      textRight: textRect.right,
      heroLeft: heroRect?.left ?? Number.NaN,
      heroRight: heroRect?.right ?? Number.NaN,
    };
  });

  expect(Number.isFinite(bounds.heroLeft)).toBe(true);
  expect(Number.isFinite(bounds.heroRight)).toBe(true);
  expect(bounds.textLeft).toBeGreaterThanOrEqual(bounds.heroLeft - 1);
  expect(bounds.textRight).toBeLessThanOrEqual(bounds.heroRight + 1);
}

test.describe('UXP-07B full Devotional Universe landing acceptance', () => {
  test('proves the 1440px public landing, reusable Deity cards, media semantics and anonymous shell', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await mockAnonymousSession(page);
    await mockMedia(page);
    await mockDiscovery(page);

    const response = await page.goto('/devotional');
    expect(response?.status()).toBe(200);

    await expect(page.getByRole('heading', { level: 1, name: 'Devotional' })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Recently Updated Deities' }),
    ).toBeVisible();
    await expect(page.locator('[data-deity-slug]')).toHaveCount(4);

    await expect(page.locator('[data-preview-kind="image"]')).toHaveCount(2);
    await expect(page.locator('[data-preview-kind="none"]')).toHaveCount(1);
    await expect(page.locator('[data-preview-kind="short-loop"]')).toHaveCount(1);

    await expect(page.getByAltText('Lord Vishnu devotional portrait')).toBeVisible();
    await expect(page.getByAltText('Goddess Saraswati devotional portrait')).toBeVisible();

    const shortLoop = page.locator('video[data-devotional-discovery-short-loop="true"]');
    await expect(shortLoop).toHaveCount(1);
    const mediaFlags = await shortLoop.evaluate((video) => {
      const element = video as HTMLVideoElement;
      return {
        muted: element.muted,
        autoplay: element.autoplay,
        loop: element.loop,
        playsInline: element.playsInline,
        ariaLabel: element.getAttribute('aria-label'),
      };
    });
    expect(mediaFlags).toEqual({
      muted: true,
      autoplay: true,
      loop: true,
      playsInline: true,
      ariaLabel: 'Lord Ganesha devotional motion',
    });

    await expect(page.getByRole('link', { name: /Lord Vishnu/ })).toHaveAttribute(
      'href',
      '/devotional/vishnu',
    );
    await expect(page.getByRole('link', { name: /Goddess Lakshmi/ })).toHaveAttribute(
      'href',
      '/devotional/lakshmi',
    );
    await expect(page.getByRole('link', { name: /Lord Ganesha/ })).toHaveAttribute(
      'href',
      '/devotional/ganesha',
    );
    await expect(page.getByRole('link', { name: /Goddess Saraswati/ })).toHaveAttribute(
      'href',
      '/devotional/saraswati',
    );

    await expect(page.getByRole('heading', { name: /Popular|Trending|Recommended/i })).toHaveCount(
      0,
    );

    const account = page.getByRole('navigation', { name: 'Account' });
    await expect(account.getByRole('link', { name: 'Create account' })).toBeVisible();
    await expect(account.getByRole('link', { name: 'Sign in' })).toBeVisible();

    const main = page.locator('main[data-uxp07a-landing="true"]');
    await expect(main.getByText(/Admin|Manage landing|Featured Deity/i)).toHaveCount(0);

    await assertNoHorizontalOverflow(page);

    await page.screenshot({
      path: '.playwright/uxp-07b-devotional-1440.png',
      fullPage: true,
    });
  });

  test('proves the 834px tablet composition without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 1112 });
    await mockAnonymousSession(page);
    await mockMedia(page);
    await mockDiscovery(page);

    await page.goto('/devotional');
    await assertNoHorizontalOverflow(page);
    await assertHeadingContained(page);

    const cards = page.locator('[data-deity-slug]');
    await expect(cards).toHaveCount(4);

    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    const third = await cards.nth(2).boundingBox();

    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(third).not.toBeNull();

    expect(Math.abs(first!.y - second!.y)).toBeLessThanOrEqual(2);
    expect(third!.y).toBeGreaterThan(first!.y + first!.height - 2);

    await page.screenshot({
      path: '.playwright/uxp-07b-devotional-834.png',
      fullPage: true,
    });
  });

  test('proves the 390px mobile hierarchy, one-column cards and visible keyboard focus', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await mockAnonymousSession(page);
    await mockMedia(page);
    await mockDiscovery(page);

    await page.goto('/devotional');

    await assertNoHorizontalOverflow(page);
    await assertHeadingContained(page);

    const firstCard = page.getByRole('link', { name: /Lord Vishnu/ });
    const secondCard = page.getByRole('link', { name: /Goddess Lakshmi/ });
    await expect(firstCard).toBeVisible();
    await expect(secondCard).toBeVisible();

    const first = await firstCard.boundingBox();
    const second = await secondCard.boundingBox();
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(second!.y).toBeGreaterThan(first!.y + first!.height - 2);

    await firstCard.focus();
    await expect(firstCard).toBeFocused();

    const focusStyle = await firstCard.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        boxShadow: style.boxShadow,
      };
    });

    expect(
      focusStyle.outlineStyle !== 'none' ||
        focusStyle.outlineWidth !== '0px' ||
        focusStyle.boxShadow !== 'none',
    ).toBe(true);

    await page.screenshot({
      path: '.playwright/uxp-07b-devotional-390.png',
      fullPage: true,
    });
  });

  test('proves the 1440px-at-200%-zoom effective hierarchy at a 720 CSS-pixel viewport', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 720, height: 900 });
    await mockAnonymousSession(page);
    await mockMedia(page);
    await mockDiscovery(page);

    await page.goto('/devotional');

    await assertNoHorizontalOverflow(page);
    await assertHeadingContained(page);
    await expect(page.getByRole('link', { name: 'Explore Deities' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Search Devotional' }).first()).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Recently Updated Deities' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /Lord Vishnu/ })).toBeVisible();

    await page.screenshot({
      path: '.playwright/uxp-07b-devotional-zoom200-effective.png',
      fullPage: true,
    });
  });

  test('keeps a visible loading state until discovery resolves', async ({ page }) => {
    await mockAnonymousSession(page);

    let release: (() => void) | undefined;

    await page.route('**/api/knowledge/discovery?*', async (route) => {
      await assertDevotionalDiscoveryRequest(new URL(route.request().url()));

      await new Promise<void>((resolve) => {
        release = resolve;
      });

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: devotionalItems() }),
      });
    });

    await page.goto('/devotional');

    await expect(
      page.getByRole('status').filter({ hasText: 'Loading recently updated Deities' }),
    ).toBeVisible();

    await expect.poll(() => Boolean(release)).toBe(true);
    release?.();

    await expect(page.getByRole('link', { name: /Lord Vishnu/ })).toBeVisible();
  });

  test('shows unexpected discovery failure and recovers through retry without replacing the page shell', async ({
    page,
  }) => {
    await mockAnonymousSession(page);

    let attempts = 0;
    await page.route('**/api/knowledge/discovery?*', async (route) => {
      await assertDevotionalDiscoveryRequest(new URL(route.request().url()));
      attempts += 1;

      if (attempts === 1) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: {
              code: 'test.unexpected',
              message: 'Unexpected discovery failure',
            },
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: devotionalItems() }),
      });
    });

    await page.goto('/devotional');

    await expect(page.getByRole('heading', { level: 1, name: 'Devotional' })).toBeVisible();
    await expect(
      page.getByRole('alert').filter({ hasText: 'Deity discovery is temporarily unavailable.' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Try again' }).click();

    await expect(page.getByRole('link', { name: /Lord Vishnu/ })).toBeVisible();
    expect(attempts).toBe(2);
  });

  test('shows a truthful empty state with existing Search continuation', async ({ page }) => {
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

  test('keeps a card usable and meaningful when a still-image thumbnail fails to load', async ({
    page,
  }) => {
    await mockAnonymousSession(page);
    await mockMedia(page, { failThumbnailAssetId: VISHNU_IMAGE_ID });
    await mockDiscovery(page);

    await page.goto('/devotional');

    const card = page.getByRole('link', { name: /Lord Vishnu/ });
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('href', '/devotional/vishnu');
    await expect(card.getByRole('heading', { name: 'Lord Vishnu' })).toBeVisible();

    const image = page.getByAltText('Lord Vishnu devotional portrait');
    await expect(image).toHaveAttribute('alt', 'Lord Vishnu devotional portrait');

    await expect(
      card.getByText('Preserver within a reusable Devotional discovery acceptance fixture.'),
    ).toBeVisible();
  });

  test('uses the poster and suppresses ambient short motion when reduced motion is requested', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockAnonymousSession(page);
    await mockMedia(page);
    await mockDiscovery(page);

    await page.goto('/devotional');

    const ganesha = page.locator('[data-deity-slug="ganesha"]');
    await expect(ganesha.locator('[data-preview-kind="video-poster"]')).toBeVisible();
    await expect(ganesha.locator('video[data-devotional-discovery-short-loop="true"]')).toHaveCount(
      0,
    );
  });

  test('keeps canonical and social identity stable across campaign entry and arbitrary discovery ordering', async ({
    page,
  }) => {
    await mockAnonymousSession(page);
    await mockDiscovery(page, devotionalItems());

    await page.goto('/devotional?utm_source=campaign&utm_campaign=uxp07b');

    await expect(page).toHaveTitle('Devotional · AI World');

    const canonical = page.locator('head link[rel="canonical"]');
    const firstCanonical = await canonical.getAttribute('href');
    expect(firstCanonical).toBeTruthy();

    const canonicalUrl = new URL(firstCanonical!);
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

    const firstImage = await page
      .locator('head meta[property="og:image"]')
      .first()
      .getAttribute('content');
    expect(firstImage).toBeTruthy();
    expect(new URL(firstImage!).pathname).toBe('/devotional/opengraph-image');

    await page.unroute('**/api/knowledge/discovery?*');
    await mockDiscovery(page, [...devotionalItems()].reverse());
    await page.reload();

    const secondImage = await page
      .locator('head meta[property="og:image"]')
      .first()
      .getAttribute('content');
    expect(secondImage).toBe(firstImage);
  });

  test('keeps the authenticated shared shell without introducing landing-specific Creator or Admin controls', async ({
    page,
  }) => {
    await mockAuthenticatedSession(page);
    await mockMedia(page);
    await mockDiscovery(page);

    await page.goto('/devotional');

    const account = page.getByRole('navigation', { name: 'Account' });
    await expect(account.getByRole('link', { name: 'Create', exact: true })).toBeVisible();
    await expect(account.getByRole('link', { name: 'Saved' })).toBeVisible();
    await expect(account.getByRole('link', { name: 'Account', exact: true })).toBeVisible();
    await expect(account.getByRole('button', { name: 'Sign out' })).toBeVisible();

    const main = page.locator('main[data-uxp07a-landing="true"]');
    await expect(main.getByText(/Admin|Manage landing|Featured Deity/i)).toHaveCount(0);
  });

  test('keeps canonical Deity, Knowledge and existing Search navigation boundaries explicit', async ({
    page,
  }) => {
    await mockAnonymousSession(page);
    await mockDiscovery(page);

    await page.goto('/devotional');

    await expect(page.getByRole('link', { name: /Lord Vishnu/ })).toHaveAttribute(
      'href',
      '/devotional/vishnu',
    );
    await expect(page.getByRole('link', { name: 'Explore Knowledge' })).toHaveAttribute(
      'href',
      '/knowledge',
    );

    const searchLinks = page.getByRole('link', { name: 'Search Devotional' });
    await expect(searchLinks).toHaveCount(2);
    await expect(searchLinks.first()).toHaveAttribute(
      'href',
      '/search?universeKey=universe.devotional',
    );
    await expect(searchLinks.last()).toHaveAttribute(
      'href',
      '/search?universeKey=universe.devotional',
    );
  });
});
