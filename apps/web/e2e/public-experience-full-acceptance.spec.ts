import { expect, test, type Page } from '@playwright/test';

const RICH_ID = '95100000-0000-4000-8000-000000000001';
const MOTION_ID = '95100000-0000-4000-8000-000000000002';
const MOBILE_ID = '95100000-0000-4000-8000-000000000003';
const LOADING_ID = '95100000-0000-4000-8000-000000000004';
const ERROR_ID = '95100000-0000-4000-8000-000000000005';
const DRAFT_ID = '95100000-0000-4000-8000-000000000006';
const ARCHIVED_ID = '95100000-0000-4000-8000-000000000007';
const PARITY_ID = '95100000-0000-4000-8000-000000000008';

const IMAGE_ID = '95200000-0000-4000-8000-000000000001';
const MOBILE_IMAGE_ID = '95200000-0000-4000-8000-000000000002';
const VIDEO_ID = '95200000-0000-4000-8000-000000000003';
const AUDIO_ID = '95200000-0000-4000-8000-000000000004';
const PARITY_AUDIO_ID = '95200000-0000-4000-8000-000000000005';
const KNOWLEDGE_ID = '95300000-0000-4000-8000-000000000001';

interface ExperienceItem {
  readonly position: number;
  readonly kind: 'BLOCK' | 'KNOWLEDGE_RESOURCE' | 'MEDIA_ASSET';
  readonly id: string;
  readonly blockType?: string;
  readonly text?: string;
  readonly resourceType?: string;
  readonly lifecycle?: string;
  readonly assetType?: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  readonly durationMs?: number;
}

interface ExperienceFixture {
  readonly id: string;
  readonly universeKey: 'universe.devotional' | 'universe.anime';
  readonly title: string;
  readonly items: readonly ExperienceItem[];
}

const richExperience: ExperienceFixture = {
  id: RICH_ID,
  universeKey: 'universe.devotional',
  title: 'Sacred River Experience',
  items: [
    {
      position: 0,
      kind: 'BLOCK',
      id: '95400000-0000-4000-8000-000000000001',
      blockType: 'composition.block.text',
      text: 'A calm published story combining Knowledge and owned Media.',
    },
    {
      position: 1,
      kind: 'KNOWLEDGE_RESOURCE',
      id: KNOWLEDGE_ID,
      resourceType: 'devotional.temple',
      lifecycle: 'PUBLISHED',
    },
    { position: 2, kind: 'MEDIA_ASSET', id: IMAGE_ID, assetType: 'IMAGE' },
    {
      position: 3,
      kind: 'MEDIA_ASSET',
      id: AUDIO_ID,
      assetType: 'AUDIO',
      durationMs: 273,
    },
  ],
};

const motionExperience: ExperienceFixture = {
  id: MOTION_ID,
  universeKey: 'universe.anime',
  title: 'Motion Story Experience',
  items: [
    {
      position: 0,
      kind: 'BLOCK',
      id: '95400000-0000-4000-8000-000000000002',
      blockType: 'composition.block.text',
      text: 'First motion-story Block.',
    },
    {
      position: 1,
      kind: 'MEDIA_ASSET',
      id: VIDEO_ID,
      assetType: 'VIDEO',
      durationMs: 5000,
    },
    {
      position: 2,
      kind: 'BLOCK',
      id: '95400000-0000-4000-8000-000000000003',
      blockType: 'composition.block.text',
      text: 'Second motion-story Block.',
    },
    {
      position: 3,
      kind: 'MEDIA_ASSET',
      id: '95200000-0000-4000-8000-000000000006',
      assetType: 'DOCUMENT',
    },
  ],
};

const mobileExperience: ExperienceFixture = {
  id: MOBILE_ID,
  universeKey: 'universe.devotional',
  title: 'Single Image Experience',
  items: [{ position: 0, kind: 'MEDIA_ASSET', id: MOBILE_IMAGE_ID, assetType: 'IMAGE' }],
};

function body(fixture: ExperienceFixture, lifecycle = 'PUBLISHED') {
  return {
    page: {
      id: fixture.id,
      universeKey: fixture.universeKey,
      routePath: `/acceptance-${fixture.id}`,
      title: fixture.title,
      lifecycle,
    },
    items: fixture.items,
  };
}

async function mockSession(page: Page, authenticated = false): Promise<void> {
  await page.route('**/api/session', async (route) => {
    if (authenticated) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          actorId: 'uxp-05d-acceptance-actor',
          expiresAt: '2026-08-30T12:00:00.000Z',
        }),
      });
      return;
    }

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

async function mockPublishedExperience(page: Page, fixture: ExperienceFixture): Promise<void> {
  await page.route(`**/api/composition/public/pages/${fixture.id}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body(fixture)),
    });
  });
}

async function mockMedia(page: Page): Promise<void> {
  await page.route('**/api/media/assets/*/content', async (route) => {
    const assetId = new URL(route.request().url()).pathname.split('/').at(-2);

    if (assetId === IMAGE_ID || assetId === MOBILE_IMAGE_ID) {
      await route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
          'base64',
        ),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: assetId === VIDEO_ID ? 'video/mp4' : 'audio/mp4',
      body: Buffer.from('uxp-05d-user-started-media-proof'),
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

async function expectCanonical(page: Page, expectedPath: string): Promise<void> {
  const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonicalHref).toBeTruthy();
  const canonical = new URL(canonicalHref!, page.url());
  expect(canonical.pathname).toBe(expectedPath);
  expect(canonical.search).toBe('');
}

test.describe('UXP-05D full Experience reuse + acceptance', () => {
  test('proves a rich anonymous Devotional Experience on desktop with Knowledge, IMAGE and user-started AUDIO', async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await mockSession(page);
    await mockPublishedExperience(page, richExperience);
    await mockMedia(page);

    const response = await page.goto(
      `/experiences/${RICH_ID}?utm_source=instagram&utm_medium=social&utm_campaign=uxp05d-rich`,
    );
    expect(response?.status()).toBe(200);

    await expect(page.getByRole('heading', { level: 1, name: richExperience.title })).toBeVisible();
    await expect(page.getByText('Devotional · Published Experience')).toBeVisible();

    const items = page
      .getByRole('list', { name: 'Published experience content' })
      .getByRole('listitem');
    await expect(items).toHaveCount(4);
    await expect(items.nth(0)).toContainText('A calm published story');
    await expect(items.nth(1).getByRole('heading', { name: 'Temple' })).toBeVisible();
    await expect(
      items.nth(1).getByRole('link', { name: 'Open Knowledge resource' }),
    ).toHaveAttribute('href', `/knowledge/resources/${KNOWLEDGE_ID}`);
    await expect(items.nth(2).getByRole('img')).toBeVisible();

    const audio = page.getByLabel(`Published media 4 in ${richExperience.title}`);
    await expect(audio).toBeVisible();
    await expect(audio).toHaveAttribute('controls', '');
    await expect(audio).toHaveAttribute('preload', 'none');
    expect(await audio.getAttribute('autoplay')).toBeNull();
    expect(await audio.getAttribute('loop')).toBeNull();

    await expectCanonical(page, `/experiences/${RICH_ID}`);
    await expectNoHorizontalOverflow(page);

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();

    await page.screenshot({
      path: testInfo.outputPath('uxp-05d-rich-desktop.png'),
      fullPage: true,
    });
  });

  test('reuses the same Experience consumer at tablet for bounded VIDEO, multiple Blocks and degraded unsupported Media', async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 834, height: 1112 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockSession(page);
    await mockPublishedExperience(page, motionExperience);
    await mockMedia(page);

    await page.goto(`/experiences/${MOTION_ID}?utm_source=youtube&utm_campaign=uxp05d-motion`);

    await expect(
      page.getByRole('heading', { level: 1, name: motionExperience.title }),
    ).toBeVisible();
    await expect(page.getByText('Anime · Published Experience')).toBeVisible();
    await expect(page.getByText('First motion-story Block.')).toBeVisible();
    await expect(page.getByText('Second motion-story Block.')).toBeVisible();

    const video = page.getByLabel(`Published media 2 in ${motionExperience.title}`);
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute('controls', '');
    await expect(video).toHaveAttribute('preload', 'none');
    expect(await video.getAttribute('autoplay')).toBeNull();
    expect(await video.getAttribute('loop')).toBeNull();
    expect(await video.getAttribute('poster')).toBeNull();
    await expect(
      page.getByText('This media type is not available for this Experience.'),
    ).toBeVisible();

    await expectCanonical(page, `/experiences/${MOTION_ID}`);
    await expectNoHorizontalOverflow(page);

    await page.screenshot({
      path: testInfo.outputPath('uxp-05d-motion-tablet.png'),
      fullPage: true,
    });
  });

  test('reuses the same consumer at 390px for a single IMAGE while preserving the authenticated shared shell', async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await mockSession(page, true);
    await mockPublishedExperience(page, mobileExperience);
    await mockMedia(page);

    await page.goto(`/experiences/${MOBILE_ID}`);

    await expect(
      page.getByRole('heading', { level: 1, name: mobileExperience.title }),
    ).toBeVisible();
    await expect(
      page.getByRole('img', { name: `Published media 1 in ${mobileExperience.title}` }),
    ).toBeVisible();
    await expect(
      page.getByRole('list', { name: 'Published experience content' }).getByRole('listitem'),
    ).toHaveCount(1);
    await expectNoHorizontalOverflow(page);

    await page.screenshot({
      path: testInfo.outputPath('uxp-05d-single-image-mobile.png'),
      fullPage: true,
    });
  });

  test('keeps loading and unexpected-error states explicit without exposing Creator actions', async ({
    page,
  }) => {
    await mockSession(page);

    let release: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });

    await page.route(`**/api/composition/public/pages/${LOADING_ID}`, async (route) => {
      await gate;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: {
            id: LOADING_ID,
            universeKey: 'universe.devotional',
            routePath: '/acceptance-loading',
            title: 'Loading resolved Experience',
            lifecycle: 'PUBLISHED',
          },
          items: [],
        }),
      });
    });

    await page.goto(`/experiences/${LOADING_ID}`);
    await expect(page.locator('#aw-main-content').getByRole('status')).toHaveText(
      'Loading published Experience…',
    );
    release?.();
    await expect(
      page.getByRole('heading', { level: 1, name: 'Loading resolved Experience' }),
    ).toBeVisible();

    await page.route(`**/api/composition/public/pages/${ERROR_ID}`, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'web.api.unexpected_error',
            message: 'The request could not be completed.',
            status: 500,
          },
        }),
      });
    });

    await page.goto(`/experiences/${ERROR_ID}`);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Experience unavailable' }),
    ).toBeVisible();
    await expect(page.locator('#aw-main-content').getByRole('alert')).toHaveText(
      'This published Experience is unavailable right now.',
    );
    await expect(page.getByRole('button', { name: 'Publish Page' })).toHaveCount(0);
  });

  test('keeps DRAFT and ARCHIVED Pages non-public at the public Experience boundary', async ({
    page,
  }) => {
    await mockSession(page);

    for (const id of [DRAFT_ID, ARCHIVED_ID]) {
      await page.route(`**/api/composition/public/pages/${id}`, async (route) => {
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

      await page.goto(`/experiences/${id}`);
      await expect(
        page.getByRole('heading', { level: 1, name: 'Experience not found' }),
      ).toBeVisible();
      await expect(page.locator('#aw-main-content').getByRole('alert')).toHaveText(
        'This published Experience was not found.',
      );
    }
  });

  test('proves authorized Creator preview/public composition parity and rejects anonymous Creator preview', async ({
    browser,
    page,
  }) => {
    const parityItems: readonly ExperienceItem[] = [
      {
        position: 0,
        kind: 'BLOCK',
        id: '95400000-0000-4000-8000-000000000010',
        blockType: 'composition.block.text',
        text: 'Parity Block.',
      },
      {
        position: 1,
        kind: 'KNOWLEDGE_RESOURCE',
        id: KNOWLEDGE_ID,
        resourceType: 'devotional.deity',
        lifecycle: 'PUBLISHED',
      },
      {
        position: 2,
        kind: 'MEDIA_ASSET',
        id: PARITY_AUDIO_ID,
        assetType: 'AUDIO',
        durationMs: 273,
      },
    ];

    await mockSession(page, true);
    await mockMedia(page);
    await page.route(`**/api/composition/public/pages/${PARITY_ID}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: {
            id: PARITY_ID,
            universeKey: 'universe.devotional',
            routePath: '/acceptance-parity',
            title: 'Acceptance parity',
            lifecycle: 'PUBLISHED',
          },
          items: parityItems,
        }),
      });
    });
    await page.route(`**/api/composition/pages/${PARITY_ID}/preview`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: {
            id: PARITY_ID,
            universeKey: 'universe.devotional',
            routePath: '/acceptance-parity',
            title: 'Acceptance parity',
            lifecycle: 'DRAFT',
          },
          items: parityItems,
        }),
      });
    });

    await page.goto(`/experiences/${PARITY_ID}`);
    await expect(page.getByText('Parity Block.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Deity' })).toBeVisible();
    await expect(page.getByLabel('Published media 3 in Acceptance parity')).toBeVisible();

    await page.goto(`/creator/preview/${PARITY_ID}`);
    await expect(page.getByRole('heading', { name: 'Acceptance parity' })).toBeVisible();
    const previewItems = page
      .getByRole('list', { name: 'Saved draft preview' })
      .getByRole('listitem');
    await expect(previewItems).toHaveCount(3);
    await expect(previewItems.nth(0)).toContainText('Parity Block.');
    await expect(previewItems.nth(1)).toContainText('devotional.deity');
    await expect(page.getByLabel('Draft media 3 in Acceptance parity')).toBeVisible();

    const anonymousContext = await browser.newContext();
    try {
      const anonymousPage = await anonymousContext.newPage();
      await mockSession(anonymousPage);
      await anonymousPage.goto(`/creator/preview/${PARITY_ID}`);
      await expect(
        anonymousPage.getByRole('heading', { name: 'Sign in to preview this draft' }),
      ).toBeVisible();
    } finally {
      await anonymousContext.close();
    }
  });
});
