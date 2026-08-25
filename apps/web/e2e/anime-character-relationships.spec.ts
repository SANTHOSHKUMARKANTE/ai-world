import { expect, test, type Page } from '@playwright/test';

const sectionProofs = [
  ['entity.forms', 'Forms & Transformations'],
  ['entity.techniques', 'Techniques & Abilities'],
  ['entity.arcs', 'Story Arcs & Key Moments'],
  ['entity.allies', 'Allies'],
  ['entity.rivals', 'Rivals'],
  ['entity.family', 'Family & Relationships'],
  ['entity.affiliations', 'Affiliations'],
  ['entity.places', 'Places'],
  ['entity.quotes', 'Quotes'],
  ['entity.experiences', 'Related Experiences'],
  ['entity.characters', 'Related Characters'],
  ['entity.series', 'Series & Appearances'],
] as const;

function relation(sectionKey: string, relationshipType: string, position: number, index: number) {
  return {
    sectionKey,
    relationshipType,
    position,
    target: {
      id: `${String(index + 1).padStart(8, '0')}-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
      universeKey: 'universe.anime',
      resourceType: sectionKey === 'entity.series' ? 'anime.series' : 'anime.character',
      slug: `uxp-02d-target-${index}`,
      displayName:
        sectionKey === 'entity.rivals' && position === 0
          ? 'First Rival'
          : sectionKey === 'entity.rivals'
            ? 'Second Rival'
            : `Target ${index}`,
      summary: `Relationship proof ${index}.`,
      previewAssetId: null,
    },
  };
}

async function installFixture(page: Page): Promise<void> {
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

  const relations = sectionProofs.map(([sectionKey], index) =>
    relation(sectionKey, `anime.relationship-${index}`, 0, index),
  );

  relations.push(relation('entity.rivals', 'anime.teammate', 1, 20));

  await page.route(
    '**/api/knowledge/entities/universe.anime/uxp-02d-relationships',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          resource: {
            id: '90000000-0000-4000-8000-000000000001',
            universeKey: 'universe.anime',
            resourceType: 'anime.character',
          },
          profile: {
            slug: 'uxp-02d-relationships',
            displayName: 'Relationship Vocabulary Proof',
            nativeName: null,
            alternateNames: [],
            summary: 'A Character proving the finished Anime relationship vocabulary.',
            overview: null,
            facts: [],
          },
          media: [],
          relations,
        }),
      });
    },
  );
}

test.describe('UXP-02D finished Anime relationship vocabulary', () => {
  test('renders canonical Anime sections in product order and preserves relation order within a section', async ({
    page,
  }) => {
    await installFixture(page);

    await page.goto('/anime/characters/uxp-02d-relationships');

    const sectionHeadings = page.locator('.aw-entity-section > .aw-entity-section__heading h2');

    await expect(sectionHeadings).toHaveText(sectionProofs.map(([, title]) => title));

    const rivals = page.locator('#entity-entity-rivals .aw-entity-rail > li');
    await expect(rivals).toHaveCount(2);
    await expect(rivals.nth(0)).toContainText('First Rival');
    await expect(rivals.nth(1)).toContainText('Second Rival');

    await page.screenshot({
      path: '.playwright/uxp-02d-relationship-vocabulary.png',
      fullPage: true,
    });
  });
});
