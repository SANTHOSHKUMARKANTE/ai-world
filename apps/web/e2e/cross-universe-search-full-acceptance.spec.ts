import { expect, test, type Page, type Route } from '@playwright/test';

const CHARACTER_ID = '11111111-1111-4111-8111-111111111111';
const TEMPLE_ID = '22222222-2222-4222-8222-222222222222';

const richResults = [
  {
    resourceId: CHARACTER_ID,
    resourceType: 'anime.character',
    universeKey: 'universe.anime',
    slug: 'naruto-uzumaki',
    displayName: 'Naruto Uzumaki',
    summary: 'A shinobi determined to become Hokage.',
  },
  {
    resourceId: TEMPLE_ID,
    resourceType: 'devotional.temple',
    universeKey: 'universe.devotional',
  },
] as const;

async function mockSession(page: Page): Promise<void> {
  await page.route('**/api/session', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        error: {
          code: 'identity.session.unauthorized',
          message: 'Authentication is required.',
          status: 401,
        },
      }),
    });
  });
}

async function fulfillSearch(route: Route, items: readonly unknown[], offset = 0): Promise<void> {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ items, pagination: { offset, limit: 20 } }),
  });
}

test.describe('UXP-08C finished Cross-Universe Search', () => {
  test('renders real identity, friendly types and canonical typed plus generic destinations', async ({
    page,
  }) => {
    await mockSession(page);
    await page.route('**/api/discovery/search?*', (route) => fulfillSearch(route, richResults));

    await page.goto('/search');
    await page.getByLabel('Search query').fill('a');
    await page.getByRole('button', { name: 'Search' }).click();

    const results = page.getByRole('list', { name: 'Search results' });
    await expect(results.getByRole('heading', { name: 'Naruto Uzumaki' })).toBeVisible();
    await expect(results.getByText('Anime · Character')).toBeVisible();
    await expect(results.getByText('A shinobi determined to become Hokage.')).toBeVisible();
    await expect(results.getByRole('heading', { name: 'Temple' })).toBeVisible();
    await expect(results.getByText('Published Temple in Devotional.')).toBeVisible();
    await expect(results.getByText(CHARACTER_ID, { exact: true })).toHaveCount(0);
    await expect(results.getByText('anime.character', { exact: true })).toHaveCount(0);
    await expect(results.getByRole('link', { name: 'Explore Naruto Uzumaki' })).toHaveAttribute(
      'href',
      '/anime/characters/naruto-uzumaki',
    );
    await expect(results.getByRole('link', { name: 'Explore Temple' })).toHaveAttribute(
      'href',
      `/knowledge/resources/${TEMPLE_ID}`,
    );
  });

  test('restores URL-addressed filters and keeps canonical identity campaign-free', async ({
    page,
  }) => {
    await mockSession(page);
    const requests: URL[] = [];
    await page.route('**/api/discovery/search?*', async (route) => {
      const url = new URL(route.request().url());
      requests.push(url);
      await fulfillSearch(route, [richResults[0]], Number(url.searchParams.get('offset')));
    });

    await page.goto(
      '/search?query=character&universeKey=universe.anime&resourceType=anime.character&utm_source=acceptance',
    );

    await expect(page.getByRole('heading', { name: 'Naruto Uzumaki' })).toBeVisible();
    await expect(page.getByLabel('Search query')).toHaveValue('character');
    await expect(page.getByLabel('Search scope')).toHaveValue('universe.anime');
    await expect(page.getByLabel('Anime character')).toBeChecked();
    expect(requests).toHaveLength(1);
    expect(requests[0]?.searchParams.get('query')).toBe('character');
    expect(requests[0]?.searchParams.get('universeKey')).toBe('universe.anime');

    const canonicalHref = await page.locator('head link[rel="canonical"]').getAttribute('href');
    expect(canonicalHref).toBeTruthy();
    const canonical = new URL(canonicalHref!);
    expect(canonical.pathname).toBe('/search');
    expect(canonical.search).toBe('');
    await expect(page.locator('head meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Search · AI World',
    );
  });

  test('shows bounded loading, unexpected-error, retry and empty states', async ({ page }) => {
    await mockSession(page);
    let releaseFirst: (() => void) | undefined;
    let attempts = 0;
    await page.route('**/api/discovery/search?*', async (route) => {
      attempts += 1;
      if (attempts === 1) {
        await new Promise<void>((resolve) => {
          releaseFirst = resolve;
        });
        await route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
        return;
      }
      await fulfillSearch(route, []);
    });

    await page.goto('/search');
    await page.getByLabel('Search query').fill('temple');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByRole('status')).toHaveText('Searching published Knowledge…');
    releaseFirst?.();

    const alert = page.locator('.aw-search-results .aw-inline-alert');
    await expect(alert).toContainText('Search is temporarily unavailable.');
    await alert.getByRole('button', { name: 'Try again' }).click();
    await expect(page.getByText('No published results found')).toBeVisible();
    await expect(page.getByText(/Try a broader query/)).toBeVisible();
  });

  test('paginates over the existing offset/limit contract and records page state in the URL', async ({
    page,
  }) => {
    await mockSession(page);
    const firstPage = Array.from({ length: 20 }, (_, index) => ({
      ...richResults[0],
      resourceId: `11111111-1111-4111-8111-${String(index).padStart(12, '0')}`,
      slug: `character-${index}`,
      displayName: `Character ${index}`,
    }));
    await page.route('**/api/discovery/search?*', async (route) => {
      const offset = Number(new URL(route.request().url()).searchParams.get('offset'));
      await fulfillSearch(route, offset === 0 ? firstPage : [richResults[1]], offset);
    });

    await page.goto('/search');
    await page.getByLabel('Search query').fill('character');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText('Showing 1–20')).toBeVisible();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByText('Showing 21–21')).toBeVisible();
    await expect(page).toHaveURL(/offset=20/);
    await expect(page.getByRole('button', { name: 'Previous' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled();
  });

  test('keeps Previous available when a speculative next page is empty', async ({ page }) => {
    await mockSession(page);
    const firstPage = Array.from({ length: 20 }, (_, index) => ({
      ...richResults[0],
      resourceId: `11111111-1111-4111-8111-${String(index).padStart(12, '0')}`,
      slug: `character-${index}`,
      displayName: `Character ${index}`,
    }));

    await page.route('**/api/discovery/search?*', async (route) => {
      const offset = Number(new URL(route.request().url()).searchParams.get('offset'));
      await fulfillSearch(route, offset === 0 ? firstPage : [], offset);
    });

    await page.goto('/search?query=character');
    await expect(page.getByText('Showing 1–20')).toBeVisible();

    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByText('No published results found')).toBeVisible();
    await expect(page).toHaveURL(/offset=20/);
    await expect(page.getByRole('button', { name: 'Previous' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled();

    await page.getByRole('button', { name: 'Previous' }).click();
    await expect(page.getByText('Showing 1–20')).toBeVisible();
    expect(new URL(page.url()).searchParams.get('offset')).toBeNull();
  });

  test('keeps the result hierarchy usable at mobile width with visible keyboard focus', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await mockSession(page);
    await page.route('**/api/discovery/search?*', (route) => fulfillSearch(route, richResults));

    await page.goto('/search?query=a');
    const resultLink = page.getByRole('link', { name: 'Explore Naruto Uzumaki' });
    await expect(resultLink).toBeVisible();
    await resultLink.focus();
    await expect(resultLink).toBeFocused();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
    const focus = await resultLink.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return style.outlineStyle !== 'none' || style.boxShadow !== 'none';
    });
    expect(focus).toBe(true);
  });
});
