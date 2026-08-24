import { expect, test, type Page } from '@playwright/test';

const IMAGE_ID = '81000000-0000-4000-8000-000000000001';
const VIDEO_ID = '81000000-0000-4000-8000-000000000002';
const POSTER_ID = '81000000-0000-4000-8000-000000000003';
const UNRELATED_ID = '81000000-0000-4000-8000-000000000099';

function imageMedia() {
  return {
    assetId: IMAGE_ID,
    assetType: 'IMAGE',
    mimeType: 'image/svg+xml',
    role: 'HERO',
    playback: 'STILL',
    position: 0,
    altText: 'Naruto portrait',
    caption: 'A calm portrait before the next mission.',
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
    altText: 'Naruto short motion',
    caption: 'A five second chakra motion study.',
    durationMs: 5000,
    posterAssetId: POSTER_ID,
  };
}

function entityBody(slug: string, mixed: boolean) {
  return {
    resource: {
      id: mixed ? '81111111-1111-4111-8111-111111111111' : '82222222-2222-4222-8222-222222222222',
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
    },
    profile: {
      slug,
      displayName: mixed ? 'Naruto Media Viewer Proof' : 'Naruto Image Viewer Proof',
      nativeName: null,
      alternateNames: [],
      summary: 'A focused Character Media viewer proof.',
      overview: null,
      facts: [{ key: 'anime.series', label: 'Series', value: 'Naruto' }],
    },
    media: mixed ? [imageMedia(), videoMedia()] : [imageMedia()],
    relations: [],
  };
}

function svg(label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#06142f"/>
        <stop offset=".56" stop-color="#2454a3"/>
        <stop offset="1" stop-color="#e77d28"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="900" fill="url(#g)"/>
    <circle cx="780" cy="330" r="220" fill="#f4b14e" opacity=".34"/>
    <text x="60" y="820" fill="#fff" font-size="58" font-family="Arial" font-weight="700">${label}</text>
  </svg>`;
}

async function installSession(page: Page): Promise<void> {
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

async function installCharacter(page: Page, slug: string, mixed: boolean): Promise<void> {
  await installSession(page);

  await page.route(`**/api/knowledge/entities/universe.anime/${slug}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(entityBody(slug, mixed)),
    });
  });

  await page.route('**/api/media/assets/*/thumbnail', async (route) => {
    const url = new URL(route.request().url());
    const assetId = url.pathname.split('/').at(-2) ?? 'media';

    await route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: svg(assetId === POSTER_ID ? 'Short Motion Poster' : 'Naruto Portrait'),
    });
  });

  await page.route('**/api/media/assets/*/content', async (route) => {
    const url = new URL(route.request().url());
    const assetId = url.pathname.split('/').at(-2);

    if (assetId === VIDEO_ID) {
      await route.fulfill({
        status: 200,
        contentType: 'video/mp4',
        body: 'bounded-short-motion-test-body',
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: svg('Full Character Image'),
    });
  });
}

test.describe('UXP-02C Character Media viewer + deep link', () => {
  test('opens an image-only Character from a valid media deep link and preserves campaign context on close', async ({
    page,
  }) => {
    await installCharacter(page, 'image-viewer-proof', false);

    await page.goto(`/anime/characters/image-viewer-proof?utm_source=instagram&media=${IMAGE_ID}`);

    await expect(
      page.getByRole('heading', { level: 1, name: 'Naruto Image Viewer Proof' }),
    ).toBeVisible();

    const dialog = page.getByRole('dialog', { name: 'Naruto Image Viewer Proof media' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByAltText('Naruto portrait')).toBeVisible();
    await expect(dialog.getByText('A calm portrait before the next mission.')).toBeVisible();

    await expect(page.locator('#entity-images a[target="_blank"]')).toHaveCount(0);

    await page.screenshot({
      path: '.playwright/uxp-02c-image-deep-link.png',
      fullPage: true,
    });

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    const url = new URL(page.url());
    expect(url.searchParams.get('media')).toBeNull();
    expect(url.searchParams.get('utm_source')).toBe('instagram');
  });

  test('opens bounded short motion by keyboard, never autoplays the viewer video, and returns focus', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await installCharacter(page, 'mixed-viewer-proof', true);

    await page.goto('/anime/characters/mixed-viewer-proof');

    const ambient = page.locator('video[data-short-loop="true"]');
    await expect(ambient).toHaveCount(1);

    const trigger = page.getByRole('button', {
      name: 'Open Naruto short motion in media viewer',
    });

    await trigger.focus();
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog', { name: 'Naruto Media Viewer Proof media' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Close media viewer' })).toBeFocused();

    const video = dialog.locator('video[data-character-viewer-video="true"]');
    await expect(video).toHaveCount(1);
    await expect(video).toHaveAttribute('controls', '');
    await expect(video).toHaveAttribute('playsinline', '');
    await expect(video).toHaveAttribute('preload', 'metadata');
    await expect(video).toHaveAttribute('poster', `/api/media/assets/${POSTER_ID}/thumbnail`);
    await expect(video).not.toHaveAttribute('autoplay', '');
    await expect(video).not.toHaveAttribute('loop', '');
    expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);

    expect(new URL(page.url()).searchParams.get('media')).toBe(VIDEO_ID);
    await expect(dialog.getByText('A five second chakra motion study.')).toBeVisible();
    await expect(page.locator('#entity-images a[target="_blank"]')).toHaveCount(0);

    await page.screenshot({
      path: '.playwright/uxp-02c-mixed-video-viewer.png',
      fullPage: true,
    });

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    expect(new URL(page.url()).searchParams.get('media')).toBeNull();
  });

  test('ignores an unrelated media id and removes only the invalid media query', async ({
    page,
  }) => {
    await installCharacter(page, 'unrelated-media-proof', true);

    await page.goto(
      `/anime/characters/unrelated-media-proof?utm_campaign=character-launch&media=${UNRELATED_ID}`,
    );

    await expect(
      page.getByRole('heading', { level: 1, name: 'Naruto Media Viewer Proof' }),
    ).toBeVisible();

    await expect.poll(() => new URL(page.url()).searchParams.get('media')).toBeNull();
    expect(new URL(page.url()).searchParams.get('utm_campaign')).toBe('character-launch');
    await expect(
      page.getByRole('dialog', { name: 'Naruto Media Viewer Proof media' }),
    ).not.toBeVisible();
  });

  test('keeps ambient short motion poster-first under reduced motion while a deep-linked viewer video stays user-started', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await installCharacter(page, 'reduced-motion-viewer-proof', true);

    await page.goto(`/anime/characters/reduced-motion-viewer-proof?media=${VIDEO_ID}`);

    await expect(page.locator('video[data-short-loop="true"]')).toHaveCount(0);

    const dialog = page.getByRole('dialog', { name: 'Naruto Media Viewer Proof media' });
    await expect(dialog).toBeVisible();

    const video = dialog.locator('video[data-character-viewer-video="true"]');
    await expect(video).toHaveCount(1);
    await expect(video).not.toHaveAttribute('autoplay', '');
    await expect(video).not.toHaveAttribute('loop', '');
    expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);

    await expect(page.getByAltText('Naruto short motion')).toBeVisible();
  });
});
