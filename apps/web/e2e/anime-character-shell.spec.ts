import { expect, test, type Page } from '@playwright/test';

const NARUTO_ID = '99999999-9999-4999-8999-999999999999';
const SASUKE_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const HERO_ID = '60000000-0000-4000-8000-000000000001';
const COLLECTION_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

interface CharacterFixture {
  readonly id: string;
  readonly slug: string;
  readonly displayName: string;
  readonly nativeName: string | null;
  readonly alternateNames: readonly string[];
  readonly summary: string;
  readonly overview: string | null;
  readonly hero: boolean;
}

const naruto: CharacterFixture = {
  id: NARUTO_ID,
  slug: 'naruto-uzumaki',
  displayName: 'Naruto Uzumaki',
  nativeName: 'うずまきナルト',
  alternateNames: ['Naruto', 'Uzumaki Naruto'],
  summary: 'A determined shinobi whose journey is shaped by courage, bonds and perseverance.',
  overview:
    'Naruto grows from an isolated child into a leader through persistence, bonds and responsibility.',
  hero: true,
};

const sasuke: CharacterFixture = {
  id: SASUKE_ID,
  slug: 'sasuke-uchiha',
  displayName: 'Sasuke Uchiha',
  nativeName: 'うちはサスケ',
  alternateNames: ['Sasuke'],
  summary: 'A gifted shinobi of the Uchiha clan navigating rivalry, loss and responsibility.',
  overview: 'Sasuke follows his own difficult path while remaining tied to Team 7.',
  hero: false,
};

function entityBody(character: CharacterFixture) {
  return {
    resource: {
      id: character.id,
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
    },
    profile: {
      slug: character.slug,
      displayName: character.displayName,
      nativeName: character.nativeName,
      alternateNames: character.alternateNames,
      summary: character.summary,
      overview: character.overview,
      facts: [
        { key: 'anime.series', label: 'Series', value: 'Naruto' },
        { key: 'anime.village', label: 'Village', value: 'Hidden Leaf' },
        { key: 'anime.team', label: 'Team', value: 'Team 7' },
        {
          key: 'anime.role',
          label: 'Role',
          value: character.slug.startsWith('naruto') ? 'Hokage' : 'Shinobi',
        },
      ],
    },
    media: character.hero
      ? [
          {
            assetId: HERO_ID,
            assetType: 'IMAGE',
            mimeType: 'image/svg+xml',
            role: 'HERO',
            playback: 'STILL',
            position: 0,
            altText: `${character.displayName} portrait`,
            caption: null,
            posterAssetId: null,
          },
        ]
      : [],
    relations: [],
  };
}

function svgPortrait(label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#06142f"/>
        <stop offset=".52" stop-color="#2454a3"/>
        <stop offset="1" stop-color="#e77d28"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="1500" fill="url(#g)"/>
    <circle cx="760" cy="450" r="260" fill="#f4b14e" opacity=".34"/>
    <path d="M560 1240 Q760 770 980 1240" fill="none" stroke="#fff" stroke-width="48" opacity=".35"/>
    <text x="70" y="1380" fill="#fff" font-size="72" font-family="Arial, sans-serif" font-weight="700">${label}</text>
  </svg>`;
}

async function routeCharacter(page: Page, character: CharacterFixture) {
  await page.route(`**/api/knowledge/entities/universe.anime/${character.slug}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(entityBody(character)),
    });
  });

  await page.route('**/api/media/assets/*/thumbnail', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: svgPortrait(character.displayName),
    });
  });
}

async function anonymous(page: Page) {
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

async function authenticated(page: Page) {
  await page.route('**/api/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        actorId: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
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
        id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
        resourceId: NARUTO_ID,
        createdAt: '2026-08-24T16:30:00.000Z',
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
            name: 'Anime favorites',
            createdAt: '2026-08-24T16:20:00.000Z',
            updatedAt: '2026-08-24T16:20:00.000Z',
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
        resourceId: NARUTO_ID,
        addedAt: '2026-08-24T16:31:00.000Z',
      }),
    });
  });
}

test.describe('UXP-02B finished Anime Character shell + social identity', () => {
  test('renders Naruto desktop identity, story, anonymous engagement and campaign-safe canonical link', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await anonymous(page);
    await routeCharacter(page, naruto);

    const response = await page.goto(
      '/anime/characters/naruto-uzumaki?utm_source=instagram&utm_medium=social&utm_campaign=character-launch',
    );
    expect(response?.status()).toBe(200);

    await expect(page.locator('.aw-anime-character')).toHaveAttribute(
      'data-character-shell',
      'anime',
    );
    await expect(page.getByRole('heading', { level: 1, name: 'Naruto Uzumaki' })).toBeVisible();
    await expect(page.getByText('うずまきナルト')).toBeVisible();
    await expect(page.getByText('Also known as Naruto · Uzumaki Naruto')).toBeVisible();
    await expect(page.getByText('From Naruto')).toBeVisible();
    await expect(page.getByText('Hidden Leaf', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'About Naruto Uzumaki' })).toBeVisible();
    await expect(page.getByText(naruto.overview!)).toBeVisible();

    await expect(page.getByRole('button', { name: 'Share', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy link', exact: true })).toBeVisible();

    const engagement = page.locator('#entity-engagement');
    await expect(engagement.getByRole('link', { name: 'Sign in' })).toBeVisible();

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).not.toBeNull();
    const canonicalUrl = new URL(canonical!, page.url());
    expect(canonicalUrl.pathname).toBe('/anime/characters/naruto-uzumaki');
    expect(canonicalUrl.search).toBe('');

    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (value: string) => {
            (window as Window & { __uxp02bCopied?: string }).__uxp02bCopied = value;
          },
        },
      });
    });

    await page.getByRole('button', { name: 'Copy link', exact: true }).click();
    await expect(
      page.getByRole('status').filter({ hasText: 'Canonical link copied.' }),
    ).toBeVisible();

    const copied = await page.evaluate(
      () => (window as Window & { __uxp02bCopied?: string }).__uxp02bCopied,
    );
    expect(copied).toBeTruthy();
    const copiedUrl = new URL(copied!);
    expect(copiedUrl.pathname).toBe('/anime/characters/naruto-uzumaki');
    expect(copiedUrl.search).toBe('');

    await page.screenshot({
      path: '.playwright/uxp-02b-naruto-desktop.png',
      fullPage: true,
    });
  });

  test('keeps the Character shell readable at 390px without horizontal overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await anonymous(page);
    await routeCharacter(page, naruto);

    await page.goto('/anime/characters/naruto-uzumaki');

    await expect(page.getByRole('heading', { level: 1, name: 'Naruto Uzumaki' })).toBeVisible();
    await expect(page.getByText('うずまきナルト')).toBeVisible();

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);

    await page.screenshot({
      path: '.playwright/uxp-02b-naruto-mobile.png',
      fullPage: true,
    });
  });

  test('reuses the same Anime Character shell for Sasuke without named-character branches', async ({
    page,
  }) => {
    await anonymous(page);
    await routeCharacter(page, sasuke);

    await page.goto('/anime/characters/sasuke-uchiha');

    await expect(page.locator('.aw-anime-character')).toHaveAttribute(
      'data-character-shell',
      'anime',
    );
    await expect(page.getByRole('heading', { level: 1, name: 'Sasuke Uchiha' })).toBeVisible();
    await expect(page.getByText('うちはサスケ')).toBeVisible();
    await expect(page.getByText('Also known as Sasuke')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'About Sasuke Uchiha' })).toBeVisible();
    await expect(page.getByText(sasuke.overview!)).toBeVisible();
  });

  test('reuses the existing Favorite and Collection behavior for an authenticated Character', async ({
    page,
  }) => {
    await authenticated(page);
    await routeCharacter(page, naruto);

    await page.goto('/anime/characters/naruto-uzumaki');

    const engagement = page.getByRole('complementary', { name: 'Save this resource' });
    await engagement.getByRole('button', { name: 'Add to Favorites' }).click();
    await expect(engagement.getByRole('status')).toHaveText('Saved to Favorites.');

    await engagement.getByLabel('Collection').selectOption(COLLECTION_ID);
    await engagement.getByRole('button', { name: 'Add to Collection' }).click();
    await expect(engagement.getByRole('status')).toHaveText('Added to Collection.');
  });

  test('distinguishes unpublished/not-found from unexpected public Character errors', async ({
    page,
  }) => {
    await anonymous(page);

    await page.route(
      '**/api/knowledge/entities/universe.anime/missing-character',
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

    await page.goto('/anime/characters/missing-character');
    await expect(page.getByText('Character not found')).toBeVisible();
    await expect(page.getByText('This published page is not available.')).toBeVisible();

    await page.unroute('**/api/knowledge/entities/universe.anime/missing-character');
    await page.route('**/api/knowledge/entities/universe.anime/broken-character', async (route) => {
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

    await page.goto('/anime/characters/broken-character');
    await expect(page.locator('.aw-entity-status[role="alert"]')).toHaveText(
      'This page is not available yet.',
    );
  });
});
