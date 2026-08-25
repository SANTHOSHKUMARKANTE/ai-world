import { expect, test, type Page } from '@playwright/test';

const SHIVA_ID = '11111111-1111-4111-8111-111111111111';

const assetIds = [
  '10000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003',
  '10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005',
];

function imageMedia(ids: readonly string[], displayName: string) {
  return ids.map((assetId, position) => ({
    assetId,
    assetType: 'IMAGE',
    mimeType: 'image/png',
    role: position === 0 ? 'HERO' : 'GALLERY',
    playback: 'STILL',
    position,
    altText: `${displayName} artwork ${position + 1}`,
    caption: null,
    posterAssetId: null,
  }));
}

function relation(
  index: number,
  sectionKey: string,
  displayName: string,
  summary: string,
  relationshipType: string,
) {
  const id = `20000000-0000-4000-8000-${String(index).padStart(12, '0')}`;
  const previewAssetId = `30000000-0000-4000-8000-${String(index).padStart(12, '0')}`;
  const slug = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '');

  return {
    sectionKey,
    relationshipType,
    position: index,
    target: {
      id,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      slug,
      displayName,
      summary,
      previewAssetId,
    },
  };
}

function svgCard(label: string): string {
  const safe = label.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#071126"/>
        <stop offset="0.56" stop-color="#243d77"/>
        <stop offset="1" stop-color="#b47b32"/>
      </linearGradient>
      <radialGradient id="r">
        <stop offset="0" stop-color="#cad6ff" stop-opacity=".72"/>
        <stop offset="1" stop-color="#202b5e" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#g)"/>
    <circle cx="760" cy="300" r="310" fill="url(#r)"/>
    <path d="M760 110 L830 520 L690 520 Z" fill="#d9e3ff" opacity=".22"/>
    <circle cx="760" cy="270" r="110" fill="#071125" opacity=".68"/>
    <path d="M640 610 Q760 430 880 610" fill="none" stroke="#d9e3ff" stroke-width="28" opacity=".42"/>
    <text x="70" y="700" fill="#ffffff" font-size="58" font-family="Arial, sans-serif" font-weight="700">${safe}</text>
  </svg>`;
}

async function installEntityFixture(page: Page) {
  const relations = [
    relation(1, 'entity.forms', 'Meditating Shiva', 'The Eternal Yogi', 'devotional.form'),
    relation(2, 'entity.forms', 'Nataraja', 'Lord of Dance', 'devotional.form'),
    relation(3, 'entity.forms', 'Ardhanarishvara', 'The Divine Unity', 'devotional.form'),
    relation(4, 'entity.forms', 'Rudra', 'The Fierce Form', 'devotional.form'),
    relation(
      5,
      'entity.stories',
      'The Story of Neelkanth',
      'A story of protection and sacrifice',
      'devotional.story',
    ),
    relation(
      6,
      'entity.stories',
      'Ganga’s Descent',
      'The sacred river and Shiva',
      'devotional.story',
    ),
    relation(7, 'entity.family', 'Parvati', 'Consort', 'devotional.consort'),
    relation(8, 'entity.family', 'Ganesha', 'Son', 'devotional.child'),
    relation(9, 'entity.family', 'Kartikeya', 'Son', 'devotional.child'),
    relation(10, 'entity.family', 'Nandi', 'Companion', 'devotional.companion'),
    relation(
      11,
      'entity.meditation',
      'Himalayan Meditation',
      'Stillness in the mountains',
      'devotional.theme',
    ),
    relation(12, 'entity.temples', 'Kailash', 'Sacred mountain', 'devotional.sacred-place'),
    relation(
      13,
      'entity.quotes',
      'The quieter you become, the more you can hear.',
      'Shiva reflection',
      'devotional.quote',
    ),
    relation(
      14,
      'entity.quotes',
      'When ego dissolves, truth becomes visible.',
      'Shiva reflection',
      'devotional.quote',
    ),
    relation(
      15,
      'entity.experiences',
      'Journey to Kailash',
      'An image-led sacred experience',
      'devotional.experience',
    ),
  ];

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

  await page.route('**/api/knowledge/entities/universe.devotional/shiva', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        resource: {
          id: SHIVA_ID,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.deity',
        },
        profile: {
          slug: 'shiva',
          displayName: 'Lord Shiva',
          summary:
            'The Supreme Yogi, a timeless symbol of transformation, stillness and cosmic balance.',
          facts: [
            { key: 'devotional.identity', label: 'Deity', value: 'Adi Deva' },
            { key: 'devotional.mantra', label: 'Mantra', value: 'Om Namah Shivaya' },
            { key: 'devotional.mount', label: 'Mount', value: 'Kailash' },
            { key: 'devotional.consort', label: 'Consort', value: 'Parvati' },
            { key: 'devotional.vehicle', label: 'Companion', value: 'Nandi' },
            { key: 'devotional.symbol', label: 'Symbol', value: 'Trishul' },
          ],
        },
        media: imageMedia(assetIds, 'Lord Shiva'),
        relations,
      }),
    });
  });

  await page.route('**/api/media/assets/*/thumbnail', async (route) => {
    const url = new URL(route.request().url());
    const parts = url.pathname.split('/');
    const assetId = parts.at(-2) ?? 'image';
    await route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: svgCard(assetId.startsWith('100') ? 'Lord Shiva' : 'Devotional'),
    });
  });
}

test.describe('WPR-M05 reusable Entity Experience', () => {
  test('renders the approved Shiva-first deity page architecture', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await installEntityFixture(page);

    const response = await page.goto('/devotional/shiva');
    expect(response?.status()).toBe(200);

    await expect(page.getByRole('heading', { level: 1, name: 'Lord Shiva' })).toBeVisible();
    await expect(page.locator('.aw-entity-hero__visual img')).toHaveAttribute(
      'alt',
      'Lord Shiva artwork 1',
    );
    await expect(page.getByText('Om Namah Shivaya')).toBeVisible();
    await expect(page.getByText('Deity · Devotional')).toBeVisible();

    const devotionalExperience = page.locator('.aw-entity-experience');
    await expect(devotionalExperience).toHaveAttribute('data-universe-tone', 'devotional');
    await expect(devotionalExperience).toHaveAttribute('data-universe-motion', 'calm');
    expect(
      await devotionalExperience.evaluate((element) =>
        getComputedStyle(element).getPropertyValue('--aw-universe-accent').trim(),
      ),
    ).toBe('#d8ae6a');

    await expect(page.getByRole('link', { name: 'Save', exact: true })).toHaveAttribute(
      'href',
      '#entity-engagement',
    );
    await expect(page.getByRole('link', { name: 'Open saved' })).toHaveCount(0);
    await expect(page.getByText('Explore →')).toHaveCount(0);
    await expect(page.getByText('View all →')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Forms of Shiva' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Stories & Knowledge' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Family & Relationships' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Media Highlights' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sacred Quotes' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Experiences' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Parvati' })).toHaveAttribute(
      'href',
      '/devotional/parvati',
    );

    const imageHeading = page.getByRole('heading', { name: 'Media Highlights' });
    expect(
      await imageHeading.evaluate((element) =>
        Boolean(
          element.compareDocumentPosition(document.querySelector('#entity-entity-forms-title')!) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      ),
    ).toBe(true);

    await imageHeading.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const images = [...document.querySelectorAll<HTMLImageElement>('.aw-entity-image-card img')];
      return (
        images.length === 5 && images.every((image) => image.complete && image.naturalWidth > 0)
      );
    });

    await page.screenshot({
      path: 'test-results/wpr-m05-shiva-entity-page.png',
      fullPage: true,
    });
  });

  test('remains usable without horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await installEntityFixture(page);

    await page.goto('/devotional/shiva');

    await expect(page.getByRole('heading', { level: 1, name: 'Lord Shiva' })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  });
  test('reuses the same Entity Experience for Lord Hanuman without production changes', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });

    const hanumanId = '44444444-4444-4444-8444-444444444444';
    const hanumanAssetIds = [
      '50000000-0000-4000-8000-000000000001',
      '50000000-0000-4000-8000-000000000002',
      '50000000-0000-4000-8000-000000000003',
      '50000000-0000-4000-8000-000000000004',
      '50000000-0000-4000-8000-000000000005',
    ];
    const hanumanRelations = [
      relation(21, 'entity.forms', 'Panchamukhi Hanuman', 'The five-faced form', 'devotional.form'),
      relation(22, 'entity.forms', 'Veera Hanuman', 'The courageous protector', 'devotional.form'),
      relation(
        23,
        'entity.stories',
        'Leap Across the Ocean',
        'Hanuman’s journey toward Lanka',
        'devotional.story',
      ),
      relation(
        24,
        'entity.stories',
        'Sanjeevani Journey',
        'The journey to bring the life-restoring herb',
        'devotional.story',
      ),
      relation(25, 'entity.family', 'Anjana', 'Mother', 'devotional.parent'),
      relation(26, 'entity.family', 'Kesari', 'Father', 'devotional.parent'),
      relation(27, 'entity.family', 'Rama', 'Beloved Lord', 'devotional.devotion'),
      relation(28, 'entity.family', 'Sita', 'Divine relationship', 'devotional.devotion'),
      relation(
        29,
        'entity.meditation',
        'Rama Nama Meditation',
        'Devotion through remembrance of Rama',
        'devotional.theme',
      ),
      relation(
        30,
        'entity.temples',
        'Hanuman Garhi',
        'A sacred Hanuman pilgrimage place',
        'devotional.sacred-place',
      ),
      relation(
        31,
        'entity.quotes',
        'Strength grows through devotion and service.',
        'Hanuman reflection',
        'devotional.quote',
      ),
      relation(
        32,
        'entity.experiences',
        'Journey with Hanuman',
        'An image-led devotional experience',
        'devotional.experience',
      ),
    ];

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

    await page.route('**/api/knowledge/entities/universe.devotional/hanuman', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          resource: {
            id: hanumanId,
            universeKey: 'universe.devotional',
            resourceType: 'devotional.deity',
          },
          profile: {
            slug: 'hanuman',
            displayName: 'Lord Hanuman',
            summary:
              'A timeless symbol of devotion, courage, strength, humility and selfless service.',
            facts: [
              { key: 'devotional.identity', label: 'Deity', value: 'Hanuman' },
              { key: 'devotional.mantra', label: 'Mantra', value: 'Om Hanumate Namah' },
              { key: 'devotional.mother', label: 'Mother', value: 'Anjana' },
              { key: 'devotional.father', label: 'Father', value: 'Kesari' },
              { key: 'devotional.devotion', label: 'Devotion', value: 'Lord Rama' },
              { key: 'devotional.symbol', label: 'Symbol', value: 'Gada' },
            ],
          },
          media: imageMedia(hanumanAssetIds, 'Lord Hanuman'),
          relations: hanumanRelations,
        }),
      });
    });

    await page.route('**/api/media/assets/*/thumbnail', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: svgCard('Lord Hanuman'),
      });
    });

    const response = await page.goto('/devotional/hanuman');
    expect(response?.status()).toBe(200);

    await expect(page.getByRole('heading', { level: 1, name: 'Lord Hanuman' })).toBeVisible();
    await expect(page.getByText('Deity · Devotional')).toBeVisible();
    await expect(page.locator('.aw-entity-experience')).toHaveAttribute(
      'data-universe-motion',
      'calm',
    );
    await expect(page.getByText('Om Hanumate Namah')).toBeVisible();
    await expect(page.getByText('Lord Rama')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Forms of Hanuman' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Media Highlights' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Stories & Knowledge' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Family & Relationships' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Anjana' })).toHaveAttribute(
      'href',
      '/devotional/anjana',
    );
    await expect(page.getByRole('link', { name: 'Rama', exact: true })).toHaveAttribute(
      'href',
      '/devotional/rama',
    );

    const galleryImages = page.locator('.aw-entity-image-card img');
    await expect(galleryImages).toHaveCount(5);
    await page.waitForFunction(() => {
      const images = [...document.querySelectorAll<HTMLImageElement>('.aw-entity-image-card img')];
      return (
        images.length === 5 && images.every((image) => image.complete && image.naturalWidth > 0)
      );
    });

    await page.screenshot({
      path: 'test-results/wpr-m05-hanuman-entity-page.png',
      fullPage: true,
    });
  });
  test('reuses the Entity Experience across universes for Naruto', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });

    const narutoAssetIds = [
      '60000000-0000-4000-8000-000000000001',
      '60000000-0000-4000-8000-000000000002',
      '60000000-0000-4000-8000-000000000003',
      '60000000-0000-4000-8000-000000000004',
      '60000000-0000-4000-8000-000000000005',
    ];

    function animeRelation(
      index: number,
      sectionKey: string,
      displayName: string,
      summary: string,
      relationshipType: string,
      resourceType: string,
    ) {
      const id = `70000000-0000-4000-8000-${String(index).padStart(12, '0')}`;
      const previewAssetId = `80000000-0000-4000-8000-${String(index).padStart(12, '0')}`;
      const slug = displayName
        .toLowerCase()
        .replace(/[^a-z0-9]+/gu, '-')
        .replace(/^-|-$/gu, '');

      return {
        sectionKey,
        relationshipType,
        position: index,
        target: {
          id,
          universeKey: 'universe.anime',
          resourceType,
          slug,
          displayName,
          summary,
          previewAssetId,
        },
      };
    }

    const narutoRelations = [
      animeRelation(
        1,
        'entity.forms',
        'Sage Mode',
        'A heightened state using natural energy',
        'anime.form',
        'anime.form',
      ),
      animeRelation(
        2,
        'entity.forms',
        'Nine-Tails Chakra Mode',
        'A powerful chakra transformation',
        'anime.form',
        'anime.form',
      ),
      animeRelation(
        3,
        'entity.meditation',
        'Rasengan Training',
        'Training behind Naruto’s signature technique',
        'anime.technique',
        'anime.technique',
      ),
      animeRelation(
        4,
        'entity.stories',
        'Pain Assault Arc',
        'A defining story arc for Naruto and the Hidden Leaf',
        'anime.arc',
        'anime.arc',
      ),
      animeRelation(
        5,
        'entity.family',
        'Sasuke Uchiha',
        'Rival, teammate and lifelong bond',
        'anime.relationship',
        'anime.character',
      ),
      animeRelation(
        6,
        'entity.family',
        'Sakura Haruno',
        'Team 7 ally and close friend',
        'anime.relationship',
        'anime.character',
      ),
      animeRelation(
        7,
        'entity.temples',
        'Hidden Leaf Village',
        'Naruto’s home and the center of his journey',
        'anime.location',
        'anime.location',
      ),
      animeRelation(
        8,
        'entity.quotes',
        'I never go back on my word.',
        'Naruto Uzumaki',
        'anime.quote',
        'anime.quote',
      ),
      animeRelation(
        9,
        'entity.experiences',
        'Road to Hokage',
        'An image-led journey through Naruto’s growth',
        'anime.experience',
        'anime.experience',
      ),
    ];

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

    await page.route('**/api/knowledge/entities/universe.anime/naruto-uzumaki', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          resource: {
            id: '99999999-9999-4999-8999-999999999999',
            universeKey: 'universe.anime',
            resourceType: 'anime.character',
          },
          profile: {
            slug: 'naruto-uzumaki',
            displayName: 'Naruto Uzumaki',
            summary:
              'A determined shinobi whose journey from outsider to Hokage is shaped by courage, bonds and perseverance.',
            facts: [
              { key: 'anime.series', label: 'Series', value: 'Naruto' },
              { key: 'anime.village', label: 'Village', value: 'Hidden Leaf' },
              { key: 'anime.rank', label: 'Role', value: 'Hokage' },
              { key: 'anime.team', label: 'Team', value: 'Team 7' },
              { key: 'anime.mentor', label: 'Mentor', value: 'Kakashi Hatake' },
              { key: 'anime.signature', label: 'Signature', value: 'Rasengan' },
            ],
          },
          media: imageMedia(narutoAssetIds, 'Naruto Uzumaki'),
          relations: narutoRelations,
        }),
      });
    });

    await page.route('**/api/media/assets/*/thumbnail', async (route) => {
      const body = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
        <defs>
          <linearGradient id="anime" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#07152f"/>
            <stop offset="0.52" stop-color="#234e9b"/>
            <stop offset="1" stop-color="#e87824"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="800" fill="url(#anime)"/>
        <circle cx="790" cy="290" r="205" fill="#f6b14a" opacity=".34"/>
        <path d="M690 610 Q790 410 910 610" fill="none" stroke="#ffffff" stroke-width="30" opacity=".38"/>
        <text x="70" y="700" fill="#ffffff" font-size="58" font-family="Arial, sans-serif" font-weight="700">Naruto Uzumaki</text>
      </svg>`;

      await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body,
      });
    });

    const response = await page.goto('/anime/characters/naruto-uzumaki');
    expect(response?.status()).toBe(200);

    await expect(page.getByRole('heading', { level: 1, name: 'Naruto Uzumaki' })).toBeVisible();
    await expect(page.getByText('Character · Anime')).toBeVisible();

    const animeExperience = page.locator('.aw-entity-experience');
    await expect(animeExperience).toHaveAttribute('data-universe-tone', 'anime');
    await expect(animeExperience).toHaveAttribute('data-universe-motion', 'energetic');
    expect(
      await animeExperience.evaluate((element) =>
        getComputedStyle(element).getPropertyValue('--aw-universe-accent').trim(),
      ),
    ).toBe('#91a7ff');

    await expect(page.getByText('Hidden Leaf', { exact: true })).toBeVisible();
    await expect(page.getByText('Rasengan', { exact: true })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Forms & Transformations' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Training & Techniques' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Story Arcs & Knowledge' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Family & Relationships' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Places & Landmarks' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Quotes' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Related Experiences' })).toBeVisible();

    await expect(page.getByRole('link', { name: 'Sasuke Uchiha' })).toHaveAttribute(
      'href',
      '/anime/characters/sasuke-uchiha',
    );

    const galleryImages = page.locator('.aw-entity-image-card img');
    await expect(galleryImages).toHaveCount(5);
    await page.waitForFunction(() => {
      const images = [...document.querySelectorAll<HTMLImageElement>('.aw-entity-image-card img')];
      return (
        images.length === 5 && images.every((image) => image.complete && image.naturalWidth > 0)
      );
    });

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);

    await page.screenshot({
      path: 'test-results/wpr-m05-naruto-entity-page.png',
      fullPage: true,
    });
  });
});
