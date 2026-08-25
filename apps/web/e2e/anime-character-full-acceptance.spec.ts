import { expect, test, type Page } from '@playwright/test';

const SPARSE_ID = '92000000-0000-4000-8000-000000000001';
const SUMMARY =
  'A deliberately sparse Character proving that optional identity, facts, Media and relationship sections can be absent.';

function sparseEntity() {
  return {
    resource: {
      id: SPARSE_ID,
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
    },
    profile: {
      slug: 'sparse-character',
      displayName: 'Sparse Character',
      nativeName: null,
      alternateNames: [],
      summary: SUMMARY,
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

test.describe('UXP-02E full Character acceptance gap proof', () => {
  test('shows the public Character loading state until canonical Knowledge resolves', async ({
    page,
  }) => {
    await anonymous(page);

    let releaseResponse: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      releaseResponse = resolve;
    });

    await page.route(
      '**/api/knowledge/entities/universe.anime/loading-character',
      async (route) => {
        await gate;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ...sparseEntity(),
            profile: {
              ...sparseEntity().profile,
              slug: 'loading-character',
              displayName: 'Loading Character',
            },
          }),
        });
      },
    );

    await page.goto('/anime/characters/loading-character');

    const loading = page.getByRole('status').filter({ hasText: 'Opening this world…' });
    await expect(loading).toBeVisible();

    await page.screenshot({
      path: '.playwright/uxp-02e-loading-state.png',
      fullPage: true,
    });

    releaseResponse?.();

    await expect(page.getByRole('heading', { level: 1, name: 'Loading Character' })).toBeVisible();
    await expect(loading).not.toBeVisible();
  });

  test('renders a coherent sparse Character when optional identity, facts, Media and relations are absent', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await anonymous(page);

    await page.route('**/api/knowledge/entities/universe.anime/sparse-character', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sparseEntity()),
      });
    });

    const response = await page.goto('/anime/characters/sparse-character');
    expect(response?.status()).toBe(200);

    await expect(page.locator('.aw-anime-character')).toHaveAttribute(
      'data-character-shell',
      'anime',
    );
    await expect(page.getByRole('heading', { level: 1, name: 'Sparse Character' })).toBeVisible();
    await expect(page.getByText(SUMMARY, { exact: true })).toHaveCount(2);

    await expect(page.getByLabel('Character identity')).toHaveCount(0);
    await expect(page.locator('.aw-entity-facts')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Media Highlights' })).toHaveCount(0);
    await expect(page.locator('.aw-entity-section')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Explore media' })).toHaveCount(0);

    const sectionLinks = await page
      .locator('.aw-entity-section-nav a')
      .evaluateAll((links) => links.map((link) => link.textContent?.trim()));
    expect(sectionLinks).toEqual(['Overview']);

    await expect(page.getByRole('heading', { name: 'About Sparse Character' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy link', exact: true })).toBeVisible();
    await expect(
      page.locator('#entity-engagement').getByRole('link', { name: 'Sign in' }),
    ).toBeVisible();

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);

    await page.screenshot({
      path: '.playwright/uxp-02e-sparse-character.png',
      fullPage: true,
    });
  });
});
