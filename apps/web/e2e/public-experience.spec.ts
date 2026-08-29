import { expect, test, type Page } from '@playwright/test';

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

test.describe('UXP-05C published Experience Media', () => {
  test('renders the published seam and keeps campaign entry canonical', async ({
    page,
  }, testInfo) => {
    const pageId = '11111111-1111-4111-8111-111111111111';
    const knowledgeId = '22222222-2222-4222-8222-222222222222';
    const assetId = '33333333-3333-4333-8333-333333333333';

    await page.setViewportSize({ width: 390, height: 844 });
    await mockAnonymousSession(page);

    await page.route(`**/api/composition/public/pages/${pageId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: {
            id: pageId,
            universeKey: 'universe.devotional',
            routePath: '/experience-proof',
            title: 'Published Experience',
            lifecycle: 'PUBLISHED',
          },
          items: [
            {
              position: 0,
              kind: 'BLOCK',
              id: '44444444-4444-4444-8444-444444444444',
              blockType: 'composition.block.text',
              text: 'First published composition item.',
            },
            {
              position: 1,
              kind: 'KNOWLEDGE_RESOURCE',
              id: knowledgeId,
              resourceType: 'devotional.temple',
              lifecycle: 'PUBLISHED',
            },
            {
              position: 2,
              kind: 'MEDIA_ASSET',
              id: assetId,
              assetType: 'IMAGE',
            },
          ],
        }),
      });
    });

    await page.route(`**/api/media/assets/${assetId}/content`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
          'base64',
        ),
      });
    });

    const response = await page.goto(
      `/experiences/${pageId}?utm_source=instagram&utm_medium=social&utm_campaign=uxp05a`,
    );
    expect(response?.status()).toBe(200);

    await expect(
      page.getByRole('heading', { level: 1, name: 'Published Experience' }),
    ).toBeVisible();
    await expect(page.getByText('Devotional · Published Experience')).toBeVisible();

    const items = page
      .getByRole('list', { name: 'Published experience content' })
      .getByRole('listitem');
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toContainText('First published composition item.');
    await expect(items.nth(1).getByRole('heading', { name: 'Temple' })).toBeVisible();
    await expect(
      items.nth(1).getByRole('link', { name: 'Open Knowledge resource' }),
    ).toHaveAttribute('href', `/knowledge/resources/${knowledgeId}`);
    await expect(items.nth(2).getByRole('img')).toBeVisible();

    const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonicalHref).toBeTruthy();

    const canonical = new URL(canonicalHref!, page.url());
    expect(canonical.pathname).toBe(`/experiences/${pageId}`);
    expect(canonical.search).toBe('');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);

    await page.screenshot({
      path: testInfo.outputPath('uxp-05a-public-experience-mobile.png'),
      fullPage: true,
    });
  });

  test('renders user-started VIDEO and AUDIO controls without overflow', async ({ page }) => {
    const pageId = '77777777-7777-4777-8777-777777777777';
    const videoId = '88888888-8888-4888-8888-888888888888';
    await page.setViewportSize({ width: 390, height: 844 });
    await mockAnonymousSession(page);

    await page.route(`**/api/composition/public/pages/${pageId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: {
            id: pageId,
            universeKey: 'universe.anime',
            routePath: '/typed-media-proof',
            title: 'Typed Media proof',
            lifecycle: 'PUBLISHED',
          },
          items: [
            {
              position: 0,
              kind: 'MEDIA_ASSET',
              id: videoId,
              assetType: 'VIDEO',
              durationMs: 5000,
            },
            {
              position: 1,
              kind: 'MEDIA_ASSET',
              id: '99999999-9999-4999-8999-999999999999',
              assetType: 'AUDIO',
              durationMs: 273,
            },
            {
              position: 2,
              kind: 'MEDIA_ASSET',
              id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
              assetType: 'VIDEO',
            },
          ],
        }),
      });
    });

    await page.goto(`/experiences/${pageId}`);

    const video = page.getByLabel('Published media 1 in Typed Media proof');
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute('controls', '');
    await expect(video).toHaveAttribute('preload', 'none');
    expect(await video.getAttribute('autoplay')).toBeNull();
    expect(await video.getAttribute('loop')).toBeNull();
    expect(await video.getAttribute('poster')).toBeNull();
    const audio = page.getByLabel('Published media 2 in Typed Media proof');
    await expect(audio).toBeVisible();
    await expect(audio).toHaveAttribute('controls', '');
    await expect(audio).toHaveAttribute('preload', 'none');
    expect(await audio.getAttribute('autoplay')).toBeNull();
    expect(await audio.getAttribute('loop')).toBeNull();
    await expect(page.getByText('This video is not available for this Experience.')).toBeVisible();

    const mobileOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(mobileOverflow).toBe(false);

    await page.setViewportSize({ width: 1280, height: 900 });
    const desktopOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(desktopOverflow).toBe(false);
  });

  test('renders a clear public not-found state without creator controls', async ({ page }) => {
    const pageId = '55555555-5555-4555-8555-555555555555';
    await mockAnonymousSession(page);

    await page.route(`**/api/composition/public/pages/${pageId}`, async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'composition.public.not_found',
            message: 'The published Experience was not found.',
            status: 404,
          },
        }),
      });
    });

    await page.goto(`/experiences/${pageId}`);

    await expect(
      page.getByRole('heading', { level: 1, name: 'Experience not found' }),
    ).toBeVisible();
    const mainContent = page.locator('#aw-main-content');
    await expect(mainContent.getByRole('alert')).toHaveText(
      'This published Experience was not found.',
    );
    await expect(page.getByRole('button', { name: 'Publish Page' })).toHaveCount(0);
  });

  test('renders an explicit empty published Experience', async ({ page }) => {
    const pageId = '66666666-6666-4666-8666-666666666666';
    await mockAnonymousSession(page);

    await page.route(`**/api/composition/public/pages/${pageId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: {
            id: pageId,
            universeKey: 'universe.anime',
            routePath: '/empty-proof',
            title: 'Empty Experience',
            lifecycle: 'PUBLISHED',
          },
          items: [],
        }),
      });
    });

    await page.goto(`/experiences/${pageId}`);

    await expect(page.getByRole('heading', { level: 1, name: 'Empty Experience' })).toBeVisible();
    await expect(page.getByText('This published Experience has no content yet.')).toBeVisible();
  });
});
