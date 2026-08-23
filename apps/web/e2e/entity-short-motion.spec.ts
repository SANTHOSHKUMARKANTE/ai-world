import { expect, test, type Page } from '@playwright/test';

const VIDEO_ID = '70000000-0000-4000-8000-000000000001';
const POSTER_ID = '70000000-0000-4000-8000-000000000002';

function posterSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
    <rect width="1200" height="800" fill="#101b39"/>
    <circle cx="760" cy="320" r="230" fill="#91a7ff" opacity=".38"/>
    <text x="70" y="700" fill="#ffffff" font-size="58" font-family="Arial">Short Motion Poster</text>
  </svg>`;
}

async function installShortMotionFixture(page: Page, durationMs = 5000): Promise<void> {
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

  await page.route(
    '**/api/knowledge/entities/universe.anime/naruto-motion-proof',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          resource: {
            id: '71111111-1111-4111-8111-111111111111',
            universeKey: 'universe.anime',
            resourceType: 'anime.character',
          },
          profile: {
            slug: 'naruto-motion-proof',
            displayName: 'Naruto Motion Proof',
            summary: 'A bounded short-motion rendering proof.',
            facts: [],
          },
          media: [
            {
              assetId: VIDEO_ID,
              assetType: 'VIDEO',
              mimeType: 'video/mp4',
              role: 'HERO',
              playback: 'SHORT_LOOP',
              position: 0,
              altText: 'Naruto short motion',
              caption: 'Five second motion proof',
              durationMs,
              posterAssetId: POSTER_ID,
            },
          ],
          relations: [],
        }),
      });
    },
  );

  await page.route(`**/api/media/assets/${POSTER_ID}/thumbnail`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: posterSvg(),
    });
  });

  await page.route(`**/api/media/assets/${VIDEO_ID}/content`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'video/mp4',
      body: 'bounded-short-motion-test-body',
    });
  });
}

test.describe('UXP-01D bounded Entity short motion', () => {
  test('renders a muted poster-backed looping VIDEO only when motion is allowed', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await installShortMotionFixture(page);

    await page.goto('/anime/characters/naruto-motion-proof');

    const video = page.locator('video[data-short-loop="true"]').first();
    await expect(video).toHaveCount(1);
    await expect(video).toHaveAttribute('autoplay', '');
    await expect(video).toHaveAttribute('loop', '');
    await expect(video).toHaveAttribute('playsinline', '');
    await expect(video).toHaveAttribute('preload', 'metadata');
    await expect(video).toHaveAttribute('poster', `/api/media/assets/${POSTER_ID}/thumbnail`);
    expect(await video.evaluate((element: HTMLVideoElement) => element.muted)).toBe(true);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Naruto Motion Proof' }),
    ).toBeVisible();

    await page.screenshot({
      path: 'test-results/uxp-01d-short-motion-normal.png',
      fullPage: true,
    });
  });

  test('does not render an autoplay VIDEO when reduced motion is requested', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await installShortMotionFixture(page);

    await page.goto('/anime/characters/naruto-motion-proof');

    await expect(page.locator('video[data-short-loop="true"]')).toHaveCount(0);
    await expect(page.getByAltText('Naruto short motion').first()).toBeVisible();

    await page.screenshot({
      path: 'test-results/uxp-01d-short-motion-reduced.png',
      fullPage: true,
    });
  });

  test('falls back to the poster when an overlong VIDEO descriptor reaches the Web client', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await installShortMotionFixture(page, 8001);

    await page.goto('/anime/characters/naruto-motion-proof');

    await expect(page.locator('video[data-short-loop="true"]')).toHaveCount(0);
    await expect(page.getByAltText('Naruto short motion').first()).toBeVisible();
  });
});
