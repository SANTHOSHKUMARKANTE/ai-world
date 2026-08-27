import { expect, test, type Page } from '@playwright/test';

const RICH_SERIES_ID = '99100000-0000-4000-8000-000000000001';
const TABLET_SERIES_ID = '99100000-0000-4000-8000-000000000002';
const MOBILE_SERIES_ID = '99100000-0000-4000-8000-000000000003';

const IMAGE_ID = '99110000-0000-4000-8000-000000000001';
const VIDEO_ID = '99110000-0000-4000-8000-000000000002';
const POSTER_ID = '99110000-0000-4000-8000-000000000003';

const CHARACTER_ID = '99120000-0000-4000-8000-000000000001';
const RELATED_SERIES_ID = '99130000-0000-4000-8000-000000000001';

interface Fact {
  readonly key: string;
  readonly label: string;
  readonly value: string;
}

interface Relation {
  readonly sectionKey: string;
  readonly relationshipType: string;
  readonly position: number;
  readonly target: {
    readonly id: string;
    readonly universeKey: string;
    readonly resourceType: string;
    readonly slug: string;
    readonly displayName: string;
    readonly summary: string;
    readonly previewAssetId: string | null;
  };
}

interface SeriesFixture {
  readonly id: string;
  readonly slug: string;
  readonly displayName: string;
  readonly nativeName: string | null;
  readonly alternateNames: readonly string[];
  readonly summary: string;
  readonly overview: string | null;
  readonly facts: readonly Fact[];
  readonly media: readonly Record<string, unknown>[];
  readonly relations: readonly Relation[];
}

function characterRelation(position = 0): Relation {
  return {
    sectionKey: 'entity.characters',
    relationshipType: 'anime.character',
    position,
    target: {
      id: CHARACTER_ID,
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
      slug: 'acceptance-character',
      displayName: 'Acceptance Character',
      summary: 'A canonical Character used by the final Series acceptance matrix.',
      previewAssetId: null,
    },
  };
}

function relatedSeriesRelation(position = 0): Relation {
  return {
    sectionKey: 'entity.series',
    relationshipType: 'anime.related-series',
    position,
    target: {
      id: RELATED_SERIES_ID,
      universeKey: 'universe.anime',
      resourceType: 'anime.series',
      slug: 'acceptance-related-series',
      displayName: 'Acceptance Related Series',
      summary: 'A canonical related Series used by the final acceptance matrix.',
      previewAssetId: null,
    },
  };
}

const richSeries: SeriesFixture = {
  id: RICH_SERIES_ID,
  slug: 'acceptance-rich-series',
  displayName: 'Acceptance Rich Series',
  nativeName: '最終受け入れシリーズ',
  alternateNames: ['Final Series Proof', 'Rich Series'],
  summary: 'A rich Series proving the finished desktop composition.',
  overview:
    'The final desktop fixture combines truthful identity, quick facts, IMAGE Media and both canonical Anime relationship groups.',
  facts: [
    { key: 'anime.format', label: 'Format', value: 'TV' },
    { key: 'anime.status', label: 'Status', value: 'FINISHED' },
    { key: 'anime.episodes', label: 'Episodes', value: '24' },
  ],
  media: [
    {
      assetId: IMAGE_ID,
      assetType: 'IMAGE',
      mimeType: 'image/svg+xml',
      role: 'HERO',
      playback: 'STILL',
      position: 0,
      altText: 'Acceptance rich Series artwork',
      caption: 'Final desktop IMAGE proof.',
      posterAssetId: null,
    },
  ],
  relations: [characterRelation(), relatedSeriesRelation()],
};

const tabletSeries: SeriesFixture = {
  id: TABLET_SERIES_ID,
  slug: 'acceptance-tablet-series',
  displayName: 'Acceptance Motion Series',
  nativeName: null,
  alternateNames: ['Motion Series'],
  summary: 'A second Series proving tablet reuse with bounded short motion.',
  overview: null,
  facts: [{ key: 'anime.format', label: 'Format', value: 'MOVIE' }],
  media: [
    {
      assetId: VIDEO_ID,
      assetType: 'VIDEO',
      mimeType: 'video/mp4',
      role: 'HERO',
      playback: 'SHORT_LOOP',
      position: 0,
      altText: 'Acceptance Series short motion',
      caption: 'Final tablet SHORT_LOOP proof.',
      durationMs: 5000,
      posterAssetId: POSTER_ID,
    },
  ],
  relations: [relatedSeriesRelation()],
};

const mobileSeries: SeriesFixture = {
  id: MOBILE_SERIES_ID,
  slug: 'acceptance-mobile-series',
  displayName: 'Acceptance Sparse Series',
  nativeName: null,
  alternateNames: [],
  summary: 'A third Series proving the finished 390px sparse composition.',
  overview: null,
  facts: [],
  media: [],
  relations: [characterRelation()],
};

function body(series: SeriesFixture) {
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
    media: series.media,
    relations: series.relations,
  };
}

function svg(label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
    <defs>
      <linearGradient id="g" x1="0" x2="1">
        <stop offset="0" stop-color="#111827"/>
        <stop offset="1" stop-color="#312e81"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="900" fill="url(#g)"/>
    <circle cx="870" cy="310" r="230" fill="#f97316" opacity=".24"/>
    <text x="64" y="810" fill="#fff" font-size="58" font-family="Arial" font-weight="700">${label}</text>
  </svg>`;
}

async function installFixture(page: Page, series: SeriesFixture): Promise<void> {
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

  await page.route(`**/api/knowledge/entities/universe.anime/${series.slug}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body(series)),
    });
  });

  await page.route('**/api/media/assets/*/thumbnail', async (route) => {
    const url = new URL(route.request().url());
    const assetId = url.pathname.split('/').at(-2);
    await route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: svg(assetId === POSTER_ID ? 'Series Motion Poster' : 'Series Artwork'),
    });
  });

  await page.route('**/api/media/assets/*/content', async (route) => {
    const url = new URL(route.request().url());
    const assetId = url.pathname.split('/').at(-2);

    if (assetId === VIDEO_ID) {
      await route.fulfill({
        status: 200,
        contentType: 'video/mp4',
        body: 'uxp-04d-bounded-series-motion',
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: svg(assetId === POSTER_ID ? 'Series Motion Poster' : 'Series Artwork'),
    });
  });
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);
}

async function expectCanonical(page: Page, path: string): Promise<void> {
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical).not.toBeNull();
  const url = new URL(canonical!, page.url());
  expect(url.pathname).toBe(path);
  expect(url.search).toBe('');
}

test.describe('UXP-04D full Anime Series reuse + responsive acceptance', () => {
  test('finishes the rich IMAGE Series composition at desktop with both canonical relationship groups', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await installFixture(page, richSeries);

    const response = await page.goto(
      '/anime/series/acceptance-rich-series?utm_source=instagram&utm_campaign=uxp04d-rich',
    );
    expect(response?.status()).toBe(200);

    await expect(page.locator('.aw-anime-series')).toHaveAttribute('data-series-shell', 'anime');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Acceptance Rich Series' }),
    ).toBeVisible();
    await expect(page.getByText('最終受け入れシリーズ')).toBeVisible();
    await expect(page.getByText('TV', { exact: true })).toBeVisible();
    await expect(page.getByText('FINISHED', { exact: true })).toBeVisible();
    await expect(page.getByText('24', { exact: true })).toBeVisible();

    await expect(page.getByRole('heading', { level: 2, name: 'Media Highlights' })).toBeVisible();
    await expect(
      page.getByRole('button', {
        name: 'Open Acceptance rich Series artwork in media viewer',
      }),
    ).toBeVisible();

    await expect(page.getByRole('heading', { level: 2, name: 'Characters' })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Related Series & Movies' }),
    ).toBeVisible();

    await expect(page.getByRole('link', { name: 'Acceptance Character' })).toHaveAttribute(
      'href',
      '/anime/characters/acceptance-character',
    );
    await expect(page.getByRole('link', { name: 'Acceptance Related Series' })).toHaveAttribute(
      'href',
      '/anime/series/acceptance-related-series',
    );

    await expectCanonical(page, '/anime/series/acceptance-rich-series');
    await expectNoHorizontalOverflow(page);

    await page.screenshot({
      path: '.playwright/uxp-04d-series-desktop-rich.png',
      fullPage: true,
    });
  });

  test('reuses the finished Series at tablet with SHORT_LOOP, sparse facts, no Characters and a related Series', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 834, height: 1112 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await installFixture(page, tabletSeries);

    await page.goto(
      '/anime/series/acceptance-tablet-series?utm_medium=social&utm_campaign=uxp04d-tablet',
    );

    await expect(
      page.getByRole('heading', { level: 1, name: 'Acceptance Motion Series' }),
    ).toBeVisible();
    await expect(page.getByText('MOVIE', { exact: true })).toBeVisible();
    await expect(page.getByText('Status', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Episodes', { exact: true })).toHaveCount(0);

    await expect(page.locator('video[data-short-loop="true"]').first()).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Characters' })).toHaveCount(0);
    await expect(
      page.getByRole('heading', { level: 2, name: 'Related Series & Movies' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Acceptance Related Series' })).toHaveAttribute(
      'href',
      '/anime/series/acceptance-related-series',
    );

    await expectCanonical(page, '/anime/series/acceptance-tablet-series');
    await expectNoHorizontalOverflow(page);

    await page.screenshot({
      path: '.playwright/uxp-04d-series-tablet-motion.png',
      fullPage: true,
    });
  });

  test('reuses the finished Series at 390px with no Media, no facts and no related-Series group', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await installFixture(page, mobileSeries);

    await page.goto('/anime/series/acceptance-mobile-series');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Acceptance Sparse Series' }),
    ).toBeVisible();
    await expect(page.locator('.aw-entity-facts')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 2, name: 'Media Highlights' })).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 2, name: 'Characters' })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Related Series & Movies' }),
    ).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Acceptance Character' })).toHaveAttribute(
      'href',
      '/anime/characters/acceptance-character',
    );

    await expectCanonical(page, '/anime/series/acceptance-mobile-series');
    await expectNoHorizontalOverflow(page);

    await page.screenshot({
      path: '.playwright/uxp-04d-series-mobile-sparse.png',
      fullPage: true,
    });
  });
});
