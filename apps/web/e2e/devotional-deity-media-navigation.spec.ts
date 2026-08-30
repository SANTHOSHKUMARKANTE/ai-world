import { expect, test, type Page } from '@playwright/test';

const SHIVA_ID = '96600000-0000-4000-8000-000000000001';
const HANUMAN_ID = '96600000-0000-4000-8000-000000000002';
const IMAGE_ID = '96610000-0000-4000-8000-000000000001';
const VIDEO_ID = '96610000-0000-4000-8000-000000000002';
const POSTER_ID = '96610000-0000-4000-8000-000000000003';

function relation({
  id,
  sectionKey,
  relationshipType,
  position,
  universeKey,
  resourceType,
  slug,
  displayName,
}: {
  readonly id: string;
  readonly sectionKey: string;
  readonly relationshipType: string;
  readonly position: number;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly slug: string;
  readonly displayName: string;
}) {
  return {
    sectionKey,
    relationshipType,
    position,
    target: {
      id,
      universeKey,
      resourceType,
      slug,
      displayName,
      summary: `${displayName} relationship summary.`,
      previewAssetId: null,
    },
  };
}

function shivaFixture() {
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
      summary:
        'A Devotional Deity used to prove shared Media and canonical relationship navigation.',
      overview: 'A bounded UXP-06B public Deity proof.',
      facts: [],
    },
    media: [
      {
        assetId: IMAGE_ID,
        assetType: 'IMAGE',
        mimeType: 'image/png',
        role: 'HERO',
        playback: 'STILL',
        position: 0,
        altText: 'Shiva still image',
        caption: 'A still devotional image.',
        posterAssetId: null,
      },
      {
        assetId: VIDEO_ID,
        assetType: 'VIDEO',
        mimeType: 'video/mp4',
        role: 'GALLERY',
        playback: 'SHORT_LOOP',
        position: 1,
        altText: 'Shiva short motion',
        caption: 'A bounded devotional short-motion clip.',
        durationMs: 5000,
        posterAssetId: POSTER_ID,
      },
    ],
    relations: [
      relation({
        id: '96620000-0000-4000-8000-000000000002',
        sectionKey: 'entity.forms',
        relationshipType: 'devotional.form',
        position: 20,
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        slug: 'nataraja',
        displayName: 'Nataraja',
      }),
      relation({
        id: '96620000-0000-4000-8000-000000000001',
        sectionKey: 'entity.forms',
        relationshipType: 'devotional.form',
        position: 10,
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        slug: 'ardhanarishvara',
        displayName: 'Ardhanarishvara',
      }),
      relation({
        id: '96620000-0000-4000-8000-000000000003',
        sectionKey: 'entity.family',
        relationshipType: 'devotional.consort',
        position: 0,
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        slug: 'parvati',
        displayName: 'Parvati',
      }),
      relation({
        id: '96620000-0000-4000-8000-000000000004',
        sectionKey: 'entity.family',
        relationshipType: 'devotional.cross-universe-proof',
        position: 1,
        universeKey: 'universe.anime',
        resourceType: 'devotional.deity',
        slug: 'wrong-universe-deity',
        displayName: 'Wrong Universe Deity',
      }),
      relation({
        id: '96620000-0000-4000-8000-000000000005',
        sectionKey: 'entity.stories',
        relationshipType: 'devotional.story',
        position: 0,
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        slug: 'naruto-uzumaki',
        displayName: 'Naruto Uzumaki',
      }),
      relation({
        id: '96620000-0000-4000-8000-000000000006',
        sectionKey: 'entity.stories',
        relationshipType: 'devotional.story',
        position: 1,
        universeKey: 'universe.anime',
        resourceType: 'anime.series',
        slug: 'naruto',
        displayName: 'Naruto Series',
      }),
      relation({
        id: '96620000-0000-4000-8000-000000000007',
        sectionKey: 'entity.temples',
        relationshipType: 'devotional.sacred-place',
        position: 0,
        universeKey: 'universe.devotional',
        resourceType: 'devotional.temple',
        slug: 'kashi-vishwanath',
        displayName: 'Kashi Vishwanath',
      }),
    ],
  };
}

function hanumanFixture() {
  return {
    resource: {
      id: HANUMAN_ID,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
    },
    profile: {
      slug: 'hanuman',
      displayName: 'Lord Hanuman',
      nativeName: null,
      alternateNames: ['Anjaneya'],
      summary: 'A sparse Deity proving no-Media UXP-06B reuse.',
      overview: null,
      facts: [],
    },
    media: [],
    relations: [],
  };
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

async function installMediaDelivery(page: Page): Promise<void> {
  await page.route('**/api/media/assets/*/thumbnail', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
        <rect width="1200" height="800" fill="#0c0b10"/>
        <circle cx="760" cy="320" r="230" fill="#d8ae6a" opacity=".35"/>
        <text x="70" y="700" fill="#fff9ee" font-size="58" font-family="Arial">Devotional Media</text>
      </svg>`,
    });
  });

  await page.route('**/api/media/assets/*/content', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.includes(IMAGE_ID)) {
      await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
          <rect width="1200" height="800" fill="#151018"/>
          <text x="70" y="700" fill="#fff9ee" font-size="58" font-family="Arial">Shiva Still</text>
        </svg>`,
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'video/mp4',
      body: '',
    });
  });
}

async function installShiva(page: Page): Promise<void> {
  await anonymous(page);
  await installMediaDelivery(page);
  await page.route('**/api/knowledge/entities/universe.devotional/shiva', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(shivaFixture()),
    });
  });
}

test.describe('UXP-06B Devotional Deity Media viewer and canonical relationship navigation', () => {
  test('opens IMAGE in the shared viewer, preserves campaign state and restores trigger focus', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await installShiva(page);

    await page.goto('/devotional/shiva?utm_source=instagram&utm_campaign=uxp06b-media');

    const trigger = page.getByRole('button', {
      name: 'Open Shiva still image in media viewer',
    });
    await expect(trigger).toBeVisible();
    await trigger.click();

    const dialog = page.getByRole('dialog', { name: 'Lord Shiva media' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('data-viewer-kind', 'devotional');
    await expect(dialog.getByRole('img', { name: 'Shiva still image' })).toBeVisible();
    await expect(dialog.getByText('A still devotional image.')).toBeVisible();

    let current = new URL(page.url());
    expect(current.searchParams.get('media')).toBe(IMAGE_ID);
    expect(current.searchParams.get('utm_source')).toBe('instagram');
    expect(current.searchParams.get('utm_campaign')).toBe('uxp06b-media');

    await dialog.getByRole('button', { name: 'Close media viewer' }).click();
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();

    current = new URL(page.url());
    expect(current.searchParams.has('media')).toBe(false);
    expect(current.searchParams.get('utm_source')).toBe('instagram');
    expect(current.searchParams.get('utm_campaign')).toBe('uxp06b-media');

    await page.screenshot({
      path: 'test-results/uxp-06b-devotional-image-viewer.png',
      fullPage: true,
    });
  });

  test('keeps ambient SHORT_LOOP still under reduced motion while viewer VIDEO remains user-started', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 834, height: 1112 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await installShiva(page);

    await page.goto('/devotional/shiva?utm_medium=social');

    const videoTrigger = page.getByRole('button', {
      name: 'Open Shiva short motion in media viewer',
    });
    await expect(videoTrigger).toBeVisible();

    await expect(videoTrigger.locator('video[data-short-loop="true"]')).toHaveCount(0);
    await expect(videoTrigger.getByRole('img', { name: 'Shiva short motion' })).toBeVisible();

    await videoTrigger.click();

    const dialog = page.getByRole('dialog', { name: 'Lord Shiva media' });
    const viewerVideo = dialog.locator('video[data-devotional-viewer-video="true"]');

    await expect(dialog).toBeVisible();
    await expect(viewerVideo).toHaveAttribute('controls', '');
    await expect(viewerVideo).not.toHaveAttribute('autoplay', '');
    await expect(viewerVideo).toHaveAttribute('poster', `/api/media/assets/${POSTER_ID}/thumbnail`);
    await expect(dialog.getByText('A bounded devotional short-motion clip.')).toBeVisible();

    expect(new URL(page.url()).searchParams.get('media')).toBe(VIDEO_ID);

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(videoTrigger).toBeFocused();
  });

  test('supports valid media deep links and clears invalid media without losing campaign parameters', async ({
    page,
  }) => {
    await installShiva(page);

    await page.goto(`/devotional/shiva?utm_source=threads&media=${IMAGE_ID}`);

    const dialog = page.getByRole('dialog', { name: 'Lord Shiva media' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Close media viewer' })).toBeFocused();

    await dialog.getByRole('button', { name: 'Close media viewer' }).click();

    let current = new URL(page.url());
    expect(current.searchParams.has('media')).toBe(false);
    expect(current.searchParams.get('utm_source')).toBe('threads');

    await page.goto('/devotional/shiva?utm_source=threads&media=not-eligible');

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect.poll(() => new URL(page.url()).searchParams.has('media')).toBe(false);
    current = new URL(page.url());
    expect(current.searchParams.get('utm_source')).toBe('threads');
  });

  test('orders Devotional sections deterministically and uses only valid typed canonical routes', async ({
    page,
  }) => {
    await installShiva(page);

    await page.goto('/devotional/shiva');

    const forms = page.locator('#entity-entity-forms .aw-entity-card');
    await expect(forms).toHaveCount(2);
    expect(
      await forms.evaluateAll((items) => items.map((item) => item.getAttribute('aria-label'))),
    ).toEqual(['Ardhanarishvara', 'Nataraja']);

    await expect(page.getByRole('link', { name: 'Parvati' })).toHaveAttribute(
      'href',
      '/devotional/parvati',
    );
    await expect(page.getByRole('link', { name: 'Wrong Universe Deity' })).toHaveAttribute(
      'href',
      '/knowledge/resources/96620000-0000-4000-8000-000000000004',
    );
    await expect(page.getByRole('link', { name: 'Naruto Uzumaki' })).toHaveAttribute(
      'href',
      '/anime/characters/naruto-uzumaki',
    );
    await expect(page.getByRole('link', { name: 'Naruto Series' })).toHaveAttribute(
      'href',
      '/anime/series/naruto',
    );
    await expect(page.getByRole('link', { name: 'Kashi Vishwanath' })).toHaveAttribute(
      'href',
      '/knowledge/resources/96620000-0000-4000-8000-000000000007',
    );

    const sectionLabels = await page
      .locator('.aw-entity-section-nav a')
      .evaluateAll((links) => links.map((link) => link.textContent?.trim()));

    expect(sectionLabels).toEqual([
      'Overview',
      'Media',
      'Forms of Shiva',
      'Stories & Knowledge',
      'Family & Relationships',
      'Temples & Sacred Places',
    ]);
  });

  test('keeps a sparse no-Media Hanuman coherent on 390px without viewer controls or overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await anonymous(page);

    await page.route('**/api/knowledge/entities/universe.devotional/hanuman', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(hanumanFixture()),
      });
    });

    await page.goto('/devotional/hanuman?utm_source=instagram');

    await expect(page.getByRole('heading', { level: 1, name: 'Lord Hanuman' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Media Highlights' })).toHaveCount(0);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Explore media' })).toHaveCount(0);

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);
  });
});
