import { apiRequest } from '../api/api-client';

export interface Favorite {
  readonly id: string;
  readonly resourceId: string;
  readonly createdAt: string;
}

export interface Collection {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CollectionResource {
  readonly resourceId: string;
  readonly addedAt: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFavorite(value: unknown): value is Favorite {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.resourceId === 'string' &&
    typeof value.createdAt === 'string'
  );
}

function isCollection(value: unknown): value is Collection {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  );
}

function isCollectionResource(value: unknown): value is CollectionResource {
  return (
    isRecord(value) && typeof value.resourceId === 'string' && typeof value.addedAt === 'string'
  );
}

async function readJson(response: Response): Promise<unknown> {
  return response.json();
}

export async function listFavorites(): Promise<readonly Favorite[]> {
  const payload = await readJson(await apiRequest('/engagement/favorites'));

  if (
    !isRecord(payload) ||
    !Array.isArray(payload.favorites) ||
    !payload.favorites.every(isFavorite)
  ) {
    throw new Error('Favorites response did not match the expected Web contract.');
  }

  return payload.favorites;
}

export async function addFavorite(resourceId: string): Promise<Favorite> {
  const payload = await readJson(
    await apiRequest('/engagement/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId }),
    }),
  );

  if (!isFavorite(payload)) {
    throw new Error('Favorite response did not match the expected Web contract.');
  }

  return payload;
}

export async function removeFavorite(resourceId: string): Promise<void> {
  await apiRequest(`/engagement/favorites/${encodeURIComponent(resourceId)}`, {
    method: 'DELETE',
  });
}

export async function listCollections(): Promise<readonly Collection[]> {
  const payload = await readJson(await apiRequest('/engagement/collections'));

  if (
    !isRecord(payload) ||
    !Array.isArray(payload.collections) ||
    !payload.collections.every(isCollection)
  ) {
    throw new Error('Collections response did not match the expected Web contract.');
  }

  return payload.collections;
}

export async function createCollection(name: string): Promise<Collection> {
  const payload = await readJson(
    await apiRequest('/engagement/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    }),
  );

  if (!isCollection(payload)) {
    throw new Error('Collection response did not match the expected Web contract.');
  }

  return payload;
}

export async function listCollectionResources(
  collectionId: string,
): Promise<readonly CollectionResource[]> {
  const payload = await readJson(
    await apiRequest(`/engagement/collections/${encodeURIComponent(collectionId)}/resources`),
  );

  if (
    !isRecord(payload) ||
    !Array.isArray(payload.resources) ||
    !payload.resources.every(isCollectionResource)
  ) {
    throw new Error('Collection resources response did not match the expected Web contract.');
  }

  return payload.resources;
}

export async function addCollectionResource(
  collectionId: string,
  resourceId: string,
): Promise<CollectionResource> {
  const payload = await readJson(
    await apiRequest(`/engagement/collections/${encodeURIComponent(collectionId)}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId }),
    }),
  );

  if (!isCollectionResource(payload)) {
    throw new Error('Collection resource response did not match the expected Web contract.');
  }

  return payload;
}

export async function removeCollectionResource(
  collectionId: string,
  resourceId: string,
): Promise<void> {
  await apiRequest(
    `/engagement/collections/${encodeURIComponent(collectionId)}/resources/${encodeURIComponent(resourceId)}`,
    { method: 'DELETE' },
  );
}
