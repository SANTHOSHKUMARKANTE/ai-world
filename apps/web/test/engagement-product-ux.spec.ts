import { afterEach, describe, expect, it, vi } from 'vitest';

import { metadata as savedMetadata } from '../src/app/saved/page';
import {
  addCollectionResource,
  addFavorite,
  createCollection,
  deleteCollection,
  listCollectionResources,
  listCollections,
  listFavorites,
  removeCollectionResource,
  removeFavorite,
} from '../src/engagement/engagement-api';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('WPR-M03 Engagement Web API', () => {
  it('keeps the authenticated Saved library private and canonical', () => {
    expect(savedMetadata.alternates).toEqual({ canonical: '/saved' });
    expect(savedMetadata.robots).toEqual({ index: false, follow: false });
  });

  it('uses the authenticated same-origin Favorites contract for add/list/remove', async () => {
    const resourceId = '11111111-1111-4111-8111-111111111111';
    const favorite = {
      id: '22222222-2222-4222-8222-222222222222',
      resourceId,
      createdAt: '2026-08-22T12:00:00.000Z',
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(json(favorite))
      .mockResolvedValueOnce(json({ favorites: [favorite] }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));

    vi.stubGlobal('fetch', fetchMock);

    expect(await addFavorite(resourceId)).toEqual(favorite);
    expect(await listFavorites()).toEqual([favorite]);
    await removeFavorite(resourceId);

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/engagement/favorites',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({ resourceId }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      `/api/engagement/favorites/${resourceId}`,
      expect.objectContaining({
        method: 'DELETE',
        credentials: 'same-origin',
      }),
    );
  });

  it('uses the existing Collections contract for creation and membership lifecycle', async () => {
    const collectionId = '33333333-3333-4333-8333-333333333333';
    const resourceId = '44444444-4444-4444-8444-444444444444';
    const collection = {
      id: collectionId,
      name: 'Reading list',
      createdAt: '2026-08-22T12:00:00.000Z',
      updatedAt: '2026-08-22T12:00:00.000Z',
    };
    const membership = {
      resourceId,
      addedAt: '2026-08-22T12:01:00.000Z',
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(json(collection, 201))
      .mockResolvedValueOnce(json({ collections: [collection] }))
      .mockResolvedValueOnce(json(membership))
      .mockResolvedValueOnce(json({ resources: [membership] }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));

    vi.stubGlobal('fetch', fetchMock);

    expect(await createCollection('Reading list')).toEqual(collection);
    expect(await listCollections()).toEqual([collection]);
    expect(await addCollectionResource(collectionId, resourceId)).toEqual(membership);
    expect(await listCollectionResources(collectionId)).toEqual([membership]);
    await removeCollectionResource(collectionId, resourceId);
    await deleteCollection(collectionId);

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/engagement/collections',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({ name: 'Reading list' }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      6,
      `/api/engagement/collections/${collectionId}`,
      expect.objectContaining({
        method: 'DELETE',
        credentials: 'same-origin',
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      5,
      `/api/engagement/collections/${collectionId}/resources/${resourceId}`,
      expect.objectContaining({
        method: 'DELETE',
        credentials: 'same-origin',
      }),
    );
  });
});
