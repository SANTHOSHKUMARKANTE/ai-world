import { randomUUID } from 'node:crypto';

import { expect, test } from '@playwright/test';

async function registerAndSignIn(page: import('@playwright/test').Page) {
  const email = `wpr-m03.${randomUUID()}@example.com`;
  const password = 'correct horse battery staple';

  await page.goto('/register');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.getByRole('link', { name: 'Sign in to continue' }).click();
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Signed in' })).toBeVisible();
  await page.getByRole('link', { name: 'Continue to AI World' }).click();
  await expect(page.getByText('You are signed in.')).toBeVisible();
}

test.describe('WPR-M03 public Knowledge, Discovery and Engagement', () => {
  test('public Explore, Search, and Saved entry points remain coherent on mobile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const [path, heading] of [
      ['/knowledge', 'Explore published Knowledge'],
      ['/search', 'Search AI World'],
      ['/saved', 'Saved Knowledge'],
    ] as const) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(overflow).toBe(false);
    }

    await expect(
      page.getByRole('heading', { name: 'Sign in to see your saved Knowledge' }),
    ).toBeVisible();
  });

  test('authenticated user saves a published Resource to Favorites and a Collection', async ({
    page,
  }) => {
    const resourceId = randomUUID();
    const collectionName = `WPR M03 ${randomUUID().slice(0, 8)}`;

    await registerAndSignIn(page);

    await page
      .getByRole('navigation', { name: 'Account' })
      .getByRole('link', { name: 'Saved' })
      .click();

    await expect(page.getByRole('heading', { level: 1, name: 'Saved Knowledge' })).toBeVisible();

    const collections = page.getByRole('region', { name: 'Collections' });
    await collections.getByLabel('Collection name').fill(collectionName);
    await collections.getByRole('button', { name: 'Create collection' }).click();
    await expect(page.getByRole('status')).toContainText('created');

    await page.route(`**/api/knowledge/resources/${resourceId}/assets`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ assetIds: [] }),
      });
    });

    await page.route(`**/api/knowledge/entities/by-resource/${resourceId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          resource: {
            id: resourceId,
            universeKey: 'universe.devotional',
            resourceType: 'devotional.temple',
          },
          profile: {
            slug: 'acceptance-temple',
            displayName: 'Acceptance Temple',
            nativeName: null,
            alternateNames: [],
            summary: 'A published devotional place.',
            overview: null,
            facts: [],
          },
          media: [],
          relations: [],
        }),
      });
    });

    await page.route(`**/api/knowledge/resources/${resourceId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: resourceId,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.temple',
          createdAt: '2026-08-22T12:00:00.000Z',
          updatedAt: '2026-08-22T12:01:00.000Z',
        }),
      });
    });

    await page.goto(`/knowledge/resources/${resourceId}`);

    await expect(page.getByRole('heading', { level: 1, name: 'Temple' })).toBeVisible();

    const saveControls = page.getByRole('complementary', {
      name: 'Save this resource',
    });

    await saveControls.getByRole('button', { name: 'Add to Favorites' }).click();
    await expect(saveControls.getByRole('status')).toHaveText('Saved to Favorites.');

    await saveControls.getByLabel('Collection').selectOption({ label: collectionName });
    await saveControls.getByRole('button', { name: 'Add to Collection' }).click();
    await expect(saveControls.getByRole('status')).toHaveText('Added to Collection.');

    await page
      .getByRole('navigation', { name: 'Account' })
      .getByRole('link', { name: 'Saved' })
      .click();

    const favorites = page.getByRole('region', { name: 'Favorites' });
    const savedCollections = page.getByRole('region', { name: 'Collections' });

    await expect(favorites.getByRole('link', { name: 'Acceptance Temple' })).toBeVisible();
    await expect(favorites.getByText('Devotional · Temple')).toBeVisible();

    const collection = savedCollections.getByRole('article').filter({
      has: page.getByRole('heading', { name: collectionName }),
    });
    await expect(collection.getByRole('link', { name: 'Acceptance Temple' })).toBeVisible();

    await collection.getByRole('button', { name: 'Remove from collection' }).click();
    await expect(page.getByRole('status')).toHaveText('Resource removed from Collection.');
    await expect(collection.getByRole('link', { name: 'Acceptance Temple' })).toHaveCount(0);

    await favorites.getByRole('button', { name: 'Remove favorite' }).click();
    await expect(page.getByRole('status')).toHaveText('Favorite removed.');
    await expect(favorites.getByRole('link', { name: 'Acceptance Temple' })).toHaveCount(0);

    page.once('dialog', (dialog) => void dialog.accept());
    await collection.getByRole('button', { name: 'Delete collection' }).click();
    await expect(page.getByRole('status')).toHaveText(`Collection “${collectionName}” deleted.`);
    await expect(collection).toHaveCount(0);
  });
});
