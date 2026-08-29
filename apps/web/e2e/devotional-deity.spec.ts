import { expect, test, type Page } from '@playwright/test';

const SHIVA_ID = '96200000-0000-4000-8000-000000000001';
const HANUMAN_ID = '96200000-0000-4000-8000-000000000002';
const HERO_ID = '96300000-0000-4000-8000-000000000001';

const SHIVA_SUMMARY =
  'The Supreme Yogi, a timeless symbol of transformation, stillness and cosmic balance.';
const SHIVA_OVERVIEW =
  'Shiva is represented through many forms and stories while remaining associated with stillness, transformation and cosmic balance.';

function deityFixture({
  id,
  slug,
  displayName,
  nativeName,
  alternateNames,
  overview,
  media = [],
}: {
  readonly id: string;
  readonly slug: string;
  readonly displayName: string;
  readonly nativeName: string | null;
  readonly alternateNames: readonly string[];
  readonly overview: string | null;
  readonly media?: readonly object[];
}) {
  const summary = slug === 'shiva' ? SHIVA_SUMMARY : 'A timeless symbol of devotion and service.';

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
      summary,
      overview,
      facts: [
        {
          key: 'devotional.mantra',
          label: 'Mantra',
          value: slug === 'shiva' ? 'Om Namah Shivaya' : 'Om Hanumate Namah',
        },
      ],
    },
    media,
    relations: [],
  };
}

function shivaFixture() {
  return deityFixture({
    id: SHIVA_ID,
    slug: 'shiva',
    displayName: 'Lord Shiva',
    nativeName: 'शिव',
    alternateNames: ['Mahadeva', 'Shankara'],
    overview: SHIVA_OVERVIEW,
    media: [
      {
        assetId: HERO_ID,
        assetType: 'IMAGE',
        mimeType: 'image/png',
        role: 'HERO',
        playback: 'STILL',
        position: 0,
        altText: 'Lord Shiva portrait',
        caption: null,
        posterAssetId: null,
      },
    ],
  });
}

function hanumanFixture() {
  return deityFixture({
    id: HANUMAN_ID,
    slug: 'hanuman',
    displayName: 'Lord Hanuman',
    nativeName: null,
    alternateNames: ['Anjaneya'],
    overview: null,
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
        actorId: '96400000-0000-4000-8000-000000000001',
        expiresAt: '2030-01-01T00:00:00.000Z',
      }),
    });
  });

  await page.route('**/api/engagement/favorites', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.fallback();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ favorites: [] }),
    });
  });

  await page.route('**/api/engagement/collections', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.fallback();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ collections: [] }),
    });
  });
}

async function installThumbnail(page: Page): Promise<void> {
  await page.route('**/api/media/assets/*/thumbnail', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
        <rect width="1200" height="800" fill="#151018"/>
        <circle cx="760" cy="320" r="230" fill="#d8ae6a" opacity=".32"/>
        <text x="70" y="700" fill="#fff9ee" font-size="58" font-family="Arial">Lord Shiva</text>
      </svg>`,
    });
  });
}

test.describe('UXP-06A Devotional Deity identity and social shell', () => {
  test('finishes Shiva identity, overview and canonical Copy link without campaign leakage', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await anonymous(page);
    await installThumbnail(page);

    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (value: string) => {
            window.sessionStorage.setItem('uxp06a-copied-link', value);
          },
        },
      });
    });

    await page.route('**/api/knowledge/entities/universe.devotional/shiva', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(shivaFixture()),
      });
    });

    const response = await page.goto(
      '/devotional/shiva?utm_source=instagram&utm_campaign=uxp06a-identity',
    );
    expect(response?.status()).toBe(200);

    const shell = page.locator('.aw-devotional-deity');
    await expect(shell).toHaveAttribute('data-deity-shell', 'devotional');
    await expect(shell).toHaveAttribute('data-universe-tone', 'devotional');
    await expect(shell).toHaveAttribute('data-universe-motion', 'calm');

    await expect(page.getByRole('heading', { level: 1, name: 'Lord Shiva' })).toBeVisible();
    await expect(page.getByText('Deity · Devotional')).toBeVisible();

    const identity = page.getByLabel('Deity identity');
    await expect(identity.getByText('शिव', { exact: true })).toBeVisible();
    await expect(
      identity.getByText('Also known as Mahadeva · Shankara', { exact: true }),
    ).toBeVisible();

    await expect(page.getByText(SHIVA_SUMMARY, { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'About Lord Shiva' })).toBeVisible();
    await expect(page.getByText(SHIVA_OVERVIEW, { exact: true })).toBeVisible();
    await expect(page.getByText('Om Namah Shivaya', { exact: true })).toBeVisible();

    await expect(
      page.locator('#entity-engagement').getByRole('link', { name: 'Sign in' }),
    ).toBeVisible();

    await expect(page.getByRole('button', { name: 'Share', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Copy link', exact: true }).click();
    await expect(
      page.getByRole('status').filter({ hasText: 'Canonical link copied.' }),
    ).toBeVisible();

    const copied = await page.evaluate(() => sessionStorage.getItem('uxp06a-copied-link'));
    expect(copied).not.toBeNull();
    const copiedUrl = new URL(copied!);
    expect(copiedUrl.pathname).toBe('/devotional/shiva');
    expect(copiedUrl.search).toBe('');

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);

    await page.screenshot({
      path: '.playwright/uxp-06a-shiva-identity-social.png',
      fullPage: true,
    });
  });

  test('rejects a published non-Deity Resource at the devotional Deity route', async ({ page }) => {
    await anonymous(page);

    const wrongType = {
      ...shivaFixture(),
      resource: {
        ...shivaFixture().resource,
        resourceType: 'devotional.scripture',
      },
    };

    await page.route('**/api/knowledge/entities/universe.devotional/shiva', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(wrongType),
      });
    });

    await page.goto('/devotional/shiva');

    const state = page.getByRole('status').filter({ hasText: 'Deity not found' });
    await expect(state).toBeVisible();
    await expect(state.getByText('This published page is not available.')).toBeVisible();
    await expect(state.getByRole('link', { name: 'Explore published Knowledge' })).toHaveAttribute(
      'href',
      '/knowledge',
    );
    await expect(page.getByRole('heading', { level: 1, name: 'Lord Shiva' })).toHaveCount(0);
  });

  test('reuses the finished Deity identity on authenticated 390px Hanuman with sparse optional depth', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await authenticated(page);

    await page.route('**/api/knowledge/entities/universe.devotional/hanuman', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(hanumanFixture()),
      });
    });

    const response = await page.goto('/devotional/hanuman?utm_medium=social');
    expect(response?.status()).toBe(200);

    await expect(page.getByRole('heading', { level: 1, name: 'Lord Hanuman' })).toBeVisible();
    await expect(page.getByText('Deity · Devotional')).toBeVisible();

    const identity = page.getByLabel('Deity identity');
    await expect(identity.getByText('Also known as Anjaneya', { exact: true })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'About Lord Hanuman' })).toBeVisible();
    await expect(
      page.getByText('A timeless symbol of devotion and service.', { exact: true }),
    ).toHaveCount(2);
    await expect(page.getByText('Om Hanumate Namah', { exact: true })).toBeVisible();

    await expect(
      page.locator('#entity-engagement').getByRole('button', { name: 'Add to Favorites' }),
    ).toBeVisible();
    await expect(
      page.locator('#entity-engagement').getByRole('link', { name: 'Create a Collection' }),
    ).toBeVisible();
    await expect(
      page.locator('#entity-engagement').getByRole('link', { name: 'Sign in' }),
    ).toHaveCount(0);

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();

    await page.screenshot({
      path: '.playwright/uxp-06a-hanuman-mobile-authenticated.png',
      fullPage: true,
    });
  });
});
