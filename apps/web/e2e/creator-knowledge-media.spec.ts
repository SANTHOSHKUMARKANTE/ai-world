import { expect, test, type Route } from '@playwright/test';

test.describe('UXP-01E Creator Knowledge media management', () => {
  test('uploads, orders, authors and reloads IMAGE plus bounded VIDEO placements', async ({
    page,
  }) => {
    const resourceId = '81111111-1111-4111-8111-111111111111';
    const imageId = '82222222-2222-4222-8222-222222222222';
    const videoId = '83333333-3333-4333-8333-333333333333';
    const posterId = '84444444-4444-4444-8444-444444444444';

    let persistedPlacements: readonly Record<string, unknown>[] = [];
    let mediaUploadIndex = 0;

    await page.route('**/api/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          actorId: 'uxp-01e-creator',
          expiresAt: '2026-08-24T12:00:00.000Z',
        }),
      });
    });

    await page.route('**/api/knowledge/resources', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }

      expect(route.request().postDataJSON()).toEqual({
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
      });

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: resourceId,
          universeKey: 'universe.anime',
          resourceType: 'anime.character',
          lifecycle: 'DRAFT',
          createdAt: '2026-08-23T17:00:00.000Z',
          updatedAt: '2026-08-23T17:00:00.000Z',
        }),
      });
    });

    async function mediaResponse(route: Route, id: string, assetType: 'IMAGE' | 'VIDEO') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id,
          assetType,
          lifecycle: 'ACTIVE',
        }),
      });
    }

    await page.route('**/api/media/assets', async (route) => {
      const fixtures = [
        { id: imageId, assetType: 'IMAGE' as const },
        { id: videoId, assetType: 'VIDEO' as const },
        { id: posterId, assetType: 'IMAGE' as const },
      ];
      const fixture = fixtures[mediaUploadIndex];
      mediaUploadIndex += 1;

      if (!fixture) {
        throw new Error('Unexpected extra Media upload in UXP-01E browser proof.');
      }

      await mediaResponse(route, fixture.id, fixture.assetType);
    });

    await page.route(`**/api/knowledge/resources/${resourceId}/media`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ placements: persistedPlacements }),
        });
        return;
      }

      if (route.request().method() === 'PUT') {
        const request = route.request().postDataJSON() as {
          placements: readonly Record<string, unknown>[];
        };
        persistedPlacements = request.placements.map((placement, position) => ({
          ...placement,
          position,
        }));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ placements: persistedPlacements }),
        });
        return;
      }

      await route.fulfill({ status: 405 });
    });

    await page.goto('/creator');

    await page.getByLabel('Active Universe').fill('universe.anime');
    await page.getByRole('textbox', { name: 'Resource type', exact: true }).fill('anime.character');
    await page.getByRole('button', { name: 'Create Knowledge draft' }).click();

    const manager = page.getByRole('region', { name: 'Knowledge media placements' });
    await expect(manager.getByLabel('Active Knowledge Resource ID')).toHaveValue(resourceId);

    await manager.getByRole('button', { name: 'Load media placements' }).click();
    await expect(manager.getByRole('status')).toHaveText('Loaded 0 Knowledge media placements.');

    await manager.getByLabel('Primary Media file').setInputFiles({
      name: 'naruto-hero.png',
      mimeType: 'image/png',
      buffer: Buffer.from('image-proof'),
    });
    await manager.getByRole('button', { name: 'Add uploaded media' }).click();
    await manager.getByLabel('Alt text for media 1').fill('Naruto hero portrait');

    await manager.getByLabel('Primary Media file').setInputFiles({
      name: 'naruto-motion.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('video-proof'),
    });
    await manager.getByLabel('VIDEO poster image').setInputFiles({
      name: 'naruto-motion-poster.png',
      mimeType: 'image/png',
      buffer: Buffer.from('poster-proof'),
    });
    await manager.getByRole('button', { name: 'Add uploaded media' }).click();

    await manager.getByLabel('Role for media 2').selectOption('HIGHLIGHT');
    await manager.getByLabel('Alt text for media 2').fill('Naruto bounded short motion');
    await manager.getByLabel('Caption for media 2').fill('Five second motion highlight');

    await manager.getByRole('button', { name: 'Move media 2 up' }).click();
    await manager.getByRole('button', { name: 'Save media placements' }).click();

    expect(persistedPlacements).toEqual([
      {
        assetId: videoId,
        role: 'HIGHLIGHT',
        playback: 'SHORT_LOOP',
        altText: 'Naruto bounded short motion',
        caption: 'Five second motion highlight',
        posterAssetId: posterId,
        position: 0,
      },
      {
        assetId: imageId,
        role: 'HERO',
        playback: 'STILL',
        altText: 'Naruto hero portrait',
        caption: null,
        posterAssetId: null,
        position: 1,
      },
    ]);

    await expect(manager.getByRole('status')).toHaveText('Saved 2 Knowledge media placements.');

    await manager.getByRole('button', { name: 'Load media placements' }).click();
    const placementOrder = manager.getByRole('list', {
      name: 'Knowledge media placement order',
    });
    await expect(placementOrder.getByRole('listitem')).toHaveCount(2);
    await expect(placementOrder.getByText('VIDEO · SHORT_LOOP', { exact: true })).toBeVisible();
    await expect(placementOrder.getByText('IMAGE · STILL', { exact: true })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);

    await page.screenshot({
      path: 'test-results/uxp-01e-creator-media-manager.png',
      fullPage: true,
    });
  });
});
