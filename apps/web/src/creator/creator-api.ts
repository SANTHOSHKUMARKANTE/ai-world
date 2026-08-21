import { apiRequest } from '../api/api-client';

export type CreatorCompositionItemKind = 'BLOCK' | 'KNOWLEDGE_RESOURCE' | 'MEDIA_ASSET';

export interface CreatorKnowledgeResource {
  readonly id: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly lifecycle: string;
}

export interface CreatorMediaAsset {
  readonly id: string;
  readonly assetType: string;
  readonly lifecycle: string;
}

export interface CreatorPage {
  readonly id: string;
  readonly universeKey: string;
  readonly routePath: string;
  readonly title: string;
  readonly lifecycle: string;
}

export interface CreatorTextBlock {
  readonly id: string;
  readonly universeKey: string;
  readonly blockType: string;
  readonly text: string;
}

export interface CreatorCompositionItem {
  readonly position: number;
  readonly kind: CreatorCompositionItemKind;
  readonly id: string;
}

export interface CreatorPageComposition {
  readonly pageId: string;
  readonly items: readonly CreatorCompositionItem[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isCompositionItemKind(value: unknown): value is CreatorCompositionItemKind {
  return value === 'BLOCK' || value === 'KNOWLEDGE_RESOURCE' || value === 'MEDIA_ASSET';
}

function readKnowledgeResource(value: unknown): CreatorKnowledgeResource {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.universeKey) ||
    !isString(value.resourceType) ||
    !isString(value.lifecycle)
  ) {
    throw new Error('Creator Knowledge API response did not match the expected contract.');
  }
  return {
    id: value.id,
    universeKey: value.universeKey,
    resourceType: value.resourceType,
    lifecycle: value.lifecycle,
  };
}

function readMediaAsset(value: unknown): CreatorMediaAsset {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.assetType) ||
    !isString(value.lifecycle)
  ) {
    throw new Error('Creator Media API response did not match the expected contract.');
  }
  return {
    id: value.id,
    assetType: value.assetType,
    lifecycle: value.lifecycle,
  };
}

function readPage(value: unknown): CreatorPage {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.universeKey) ||
    !isString(value.routePath) ||
    !isString(value.title) ||
    !isString(value.lifecycle)
  ) {
    throw new Error('Creator Page API response did not match the expected contract.');
  }
  return {
    id: value.id,
    universeKey: value.universeKey,
    routePath: value.routePath,
    title: value.title,
    lifecycle: value.lifecycle,
  };
}

function readTextBlock(value: unknown): CreatorTextBlock {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.universeKey) ||
    !isString(value.blockType) ||
    !isString(value.text)
  ) {
    throw new Error('Creator Block API response did not match the expected contract.');
  }
  return {
    id: value.id,
    universeKey: value.universeKey,
    blockType: value.blockType,
    text: value.text,
  };
}

function readPageComposition(value: unknown): CreatorPageComposition {
  if (!isRecord(value) || !isString(value.pageId) || !Array.isArray(value.items)) {
    throw new Error('Creator Composition API response did not match the expected contract.');
  }

  const items = value.items.map((item) => {
    if (
      !isRecord(item) ||
      typeof item.position !== 'number' ||
      !isCompositionItemKind(item.kind) ||
      !isString(item.id)
    ) {
      throw new Error('Creator Composition item did not match the expected contract.');
    }
    return {
      position: item.position,
      kind: item.kind,
      id: item.id,
    };
  });

  return { pageId: value.pageId, items };
}

async function readJson(response: Response): Promise<unknown> {
  return response.json() as Promise<unknown>;
}

export async function createCreatorKnowledgeResource(input: {
  readonly universeKey: string;
  readonly resourceType: string;
}): Promise<CreatorKnowledgeResource> {
  const response = await apiRequest('/knowledge/resources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return readKnowledgeResource(await readJson(response));
}

export async function uploadCreatorMediaAsset(file: File): Promise<CreatorMediaAsset> {
  const body = new FormData();
  body.append('file', file);
  const response = await apiRequest('/media/assets', { method: 'POST', body });
  return readMediaAsset(await readJson(response));
}

export async function createCreatorPage(input: {
  readonly universeKey: string;
  readonly routePath: string;
  readonly title: string;
}): Promise<CreatorPage> {
  const response = await apiRequest('/composition/pages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return readPage(await readJson(response));
}

export async function getCreatorPage(id: string): Promise<CreatorPage> {
  const response = await apiRequest(`/composition/pages/${encodeURIComponent(id)}`);
  return readPage(await readJson(response));
}

export async function createCreatorTextBlock(input: {
  readonly universeKey: string;
  readonly text: string;
}): Promise<CreatorTextBlock> {
  const response = await apiRequest('/composition/blocks/text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return readTextBlock(await readJson(response));
}

export async function getCreatorPageComposition(id: string): Promise<CreatorPageComposition> {
  const response = await apiRequest(`/composition/pages/${encodeURIComponent(id)}/composition`);
  return readPageComposition(await readJson(response));
}

export async function replaceCreatorPageComposition(
  id: string,
  items: readonly Pick<CreatorCompositionItem, 'kind' | 'id'>[],
): Promise<CreatorPageComposition> {
  const response = await apiRequest(`/composition/pages/${encodeURIComponent(id)}/composition`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  return readPageComposition(await readJson(response));
}
