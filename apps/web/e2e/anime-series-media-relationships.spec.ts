import { expect, test, type Page } from '@playwright/test';

const SERIES_ID = '98800000-0000-4000-8000-000000000001';
const IMAGE_ID = '98810000-0000-4000-8000-000000000001';
const VIDEO_ID = '98810000-0000-4000-8000-000000000002';
const POSTER_ID = '98810000-0000-4000-8000-000000000003';
const CHARACTER_ID = '98820000-0000-4000-8000-000000000001';
const RELATED_SERIES_ID = '98830000-0000-4000-8000-000000000001';
const INVALID_MEDIA_ID = '98890000-0000-4000-8000-000000000001';

function imageMedia() {
  return {
    assetId: IMAGE_ID,
    assetType: 'IMAGE',
    mimeType: 'image/svg+xml',
    role: 'HERO',
    playback: 'STILL',
    position: 0,
    altText: 'Series hero artwork',
    caption: 'The image-only Series hero proof.',
    posterAssetId: null,
  };
}

function videoMedia() {
  return {
    assetId: VIDEO_ID,
    assetType: 'VIDEO',
    mimeType: 'video/mp4',
    role: 'GALLERY',
    playback: 'SHORT_LOOP',
    position: 1,
    altText: 'Series short motion',
    caption: 'A bounded five second Series motion proof.',
    durationMs: 5000,
    posterAssetId: POSTER_ID,
  };
}

function relations() {
  return [
    {
      sectionKey: 'entity.characters',
      relationshipType: 'anime.character',
      position: 0,
      target: {
        id: CHARACTER_ID,
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        slug: 'hero-character',
        displayName: 'Hero Character',
        summary: 'A canonical Character related to this Series.',
        previewAssetId: null,
      },
    },
    {
      sectionKey: 'entity.series',
      relationshipType: 'anime.related-series',
      position: 0,
      target: {
        id: RELATED_SERIES_ID,
        universeKey: 'universe.anime',
        resourceType: 'anime.series',
        slug: 'related-series',
        displayName: 'Related Series',
        summary: 'A canonical related Anime Series.',
        previewAssetId: null,
      },
    },
    {
      sectionKey: 'entity.characters',
      relationshipType: 'anime.related-series',
      position: 1,
      target: {
        id: '98820000-0000-4000-8000-000000000099',
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        slug: 'wrong-character-relation',
        displayName: 'Wrong Character Relation',
        summary: 'This mismatched relationship type must stay hidden.',
        previewAssetId: null,
      },
    },
    {
      sectionKey: 'entity.series',
      relationshipType: 'anime.related-series',
      position: 1,
      target: {
        id: '98830000-0000-4000-8000-000000000099',
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        slug: 'wrong-series-target',
        displayName: 'Wrong Series Target',
        summary: 'This mismatched target Resource Type must stay hidden.',
        previewAssetId: null,
      },
    },
  ];
}

function entityBody(
  slug: string,
  mediaMode: 'image' | 'mixed' | 'none',
  includeRelations: boolean,
) {
  return {
    resource: {
      id: SERIES_ID,
      universeKey: 'universe.anime',
      resourceType: 'anime.series',
    },
    profile: {
      slug,
      displayName: 'Media Relations Series',
      nativeName: null,
      alternateNames: [],
      summary: 'A Series proving UXP-04B Media, relationships and canonical navigation.',
      overview: 'This proof remains on the existing public Knowledge Entity contract.',
      facts: [{ key: 'anime.format', label: 'Format', value: 'TV' }],
    },
    media:
      mediaMode === 'none'
        ? []
        : mediaMode === 'image'
          ? [imageMedia()]
          : [imageMedia(), videoMedia()],
    relations: includeRelations ? relations() : [],
  };
}

function svg(label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
    <rect width="1200" height="900" fill="#11183b"/>
    <circle cx="790" cy="330" r="220" fill="#70d7e7" opacity=".25"/>
    <text x="60" y="820" fill="#fff" font-size="58" font-family="Arial" font-weight="700">${label}</text>
  </svg>`;
}

async function installSeries(
  page: Page,
  slug: string,
  mediaMode: 'image' | 'mixed' | 'none',
  includeRelations: boolean,
): Promise<void> {
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

  await page.route(`**/api/knowledge/entities/universe.anime/${slug}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(entityBody(slug, mediaMode, includeRelations)),
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
        body: 'bounded-series-short-motion-test-body',
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: svg('Full Series Image'),
    });
  });
}

test.describe('UXP-04B Anime Series Media + relationships + canonical navigation', () => {
  test('renders image Media and only the frozen Series relationship groups with canonical targets', async ({
    page,
  }) => {
    await installSeries(page, 'media-relations-proof', 'image', true);
    await page.goto('/anime/series/media-relations-proof');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Media Relations Series' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explore media' })).toHaveAttribute(
      'href',
      '#entity-images',
    );
    await expect(page.getByRole('heading', { level: 2, name: 'Media Highlights' })).toBeVisible();

    const imageTrigger = page.getByRole('button', {
      name: 'Open Series hero artwork in media viewer',
    });
    await imageTrigger.focus();
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog', { name: 'Media Relations Series media' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByAltText('Series hero artwork')).toBeVisible();
    await expect(dialog.getByText('The image-only Series hero proof.')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(imageTrigger).toBeFocused();

    const characters = page.locator('#entity-entity-characters');
    const relatedSeries = page.locator('#entity-entity-series');
    await expect(characters.getByRole('heading', { name: 'Characters' })).toBeVisible();
    await expect(
      relatedSeries.getByRole('heading', { name: 'Related Series & Movies' }),
    ).toBeVisible();
    await expect(characters.getByRole('link', { name: 'Hero Character' })).toHaveAttribute(
      'href',
      '/anime/characters/hero-character',
    );
    await expect(relatedSeries.getByRole('link', { name: 'Related Series' })).toHaveAttribute(
      'href',
      '/anime/series/related-series',
    );
    await expect(page.getByText('Wrong Character Relation', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Wrong Series Target', { exact: true })).toHaveCount(0);

    await page.screenshot({
      path: '.playwright/uxp-04b-series-media-relations.png',
      fullPage: true,
    });
  });

  test('opens a valid Series short-loop deep link without replacing campaign context', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await installSeries(page, 'series-short-loop-proof', 'mixed', false);

    await page.goto(
      `/anime/series/series-short-loop-proof?utm_source=instagram&utm_campaign=series-motion&media=${VIDEO_ID}`,
    );

    await expect(page.locator('video[data-short-loop="true"]')).toHaveCount(1);

    const dialog = page.getByRole('dialog', { name: 'Media Relations Series media' });
    await expect(dialog).toBeVisible();
    const video = dialog.locator('video[data-anime-viewer-video="true"]');
    await expect(video).toHaveCount(1);
    await expect(video).toHaveAttribute('controls', '');
    await expect(video).toHaveAttribute('playsinline', '');
    await expect(video).toHaveAttribute('preload', 'metadata');
    await expect(video).toHaveAttribute('poster', `/api/media/assets/${POSTER_ID}/thumbnail`);
    await expect(video).not.toHaveAttribute('autoplay', '');
    await expect(video).not.toHaveAttribute('loop', '');
    expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    const url = new URL(page.url());
    expect(url.searchParams.get('media')).toBeNull();
    expect(url.searchParams.get('utm_source')).toBe('instagram');
    expect(url.searchParams.get('utm_campaign')).toBe('series-motion');
  });

  test('uses the poster under reduced motion while the viewer remains user-started', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await installSeries(page, 'series-reduced-motion-proof', 'mixed', false);
    await page.goto('/anime/series/series-reduced-motion-proof');

    await expect(page.locator('video[data-short-loop="true"]')).toHaveCount(0);
    await expect(page.getByAltText('Series short motion')).toBeVisible();

    const trigger = page.getByRole('button', {
      name: 'Open Series short motion in media viewer',
    });
    await trigger.click();

    const dialog = page.getByRole('dialog', { name: 'Media Relations Series media' });
    const video = dialog.locator('video[data-anime-viewer-video="true"]');
    await expect(video).toHaveCount(1);
    await expect(video).not.toHaveAttribute('autoplay', '');
    await expect(video).not.toHaveAttribute('loop', '');
    expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  });

  test('removes only an invalid Series media query and preserves campaign parameters', async ({
    page,
  }) => {
    await installSeries(page, 'invalid-series-media-proof', 'mixed', false);
    await page.goto(
      `/anime/series/invalid-series-media-proof?utm_campaign=series-launch&media=${INVALID_MEDIA_ID}`,
    );

    await expect(
      page.getByRole('heading', { level: 1, name: 'Media Relations Series' }),
    ).toBeVisible();
    await expect.poll(() => new URL(page.url()).searchParams.get('media')).toBeNull();
    expect(new URL(page.url()).searchParams.get('utm_campaign')).toBe('series-launch');
    await expect(
      page.getByRole('dialog', { name: 'Media Relations Series media' }),
    ).not.toBeVisible();
  });

  test('omits Media and both optional Series relationship groups when canonical data is absent', async ({
    page,
  }) => {
    await installSeries(page, 'empty-series-media-relations-proof', 'none', false);
    await page.goto('/anime/series/empty-series-media-relations-proof');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Media Relations Series' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explore media' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Media Highlights' })).toHaveCount(0);
    await expect(page.locator('#entity-entity-characters')).toHaveCount(0);
    await expect(page.locator('#entity-entity-series')).toHaveCount(0);
  });
});
