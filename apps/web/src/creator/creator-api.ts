import { apiRequest } from '../api/api-client';

export type CreatorCompositionItemKind = 'BLOCK' | 'KNOWLEDGE_RESOURCE' | 'MEDIA_ASSET';
export type CreatorPagePreviewMediaAssetType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';

export interface CreatorKnowledgeResource {
  readonly id: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly lifecycle: string;
}

export interface CreatorKnowledgeEntityFact {
  readonly key: string;
  readonly label: string;
  readonly value: string;
}

export interface CreatorKnowledgeEntityRelation {
  readonly targetResourceId: string;
  readonly sectionKey: string;
  readonly relationshipType: string;
  readonly position: number;
}

export interface CreatorKnowledgeEntityConfiguration {
  readonly resource: CreatorKnowledgeResource;
  readonly resourceId: string;
  readonly slug: string;
  readonly displayName: string;
  readonly nativeName: string | null;
  readonly alternateNames: readonly string[];
  readonly summary: string;
  readonly overview: string | null;
  readonly facts: readonly CreatorKnowledgeEntityFact[];
  readonly relations: readonly CreatorKnowledgeEntityRelation[];
  readonly updatedAt: string;
}

export interface CreatorKnowledgeEntityConfigurationInput {
  readonly profile: {
    readonly slug: string;
    readonly displayName: string;
    readonly nativeName: string | null;
    readonly alternateNames: readonly string[];
    readonly summary: string;
    readonly overview: string | null;
    readonly facts: readonly CreatorKnowledgeEntityFact[];
  };
  readonly relations: readonly CreatorKnowledgeEntityRelation[];
}

export interface CreatorMediaAsset {
  readonly id: string;
  readonly assetType: string;
  readonly lifecycle: string;
}

export type CreatorKnowledgeMediaRole = 'HERO' | 'GALLERY' | 'HIGHLIGHT';
export type CreatorKnowledgeMediaPlayback = 'STILL' | 'SHORT_LOOP';

export interface CreatorKnowledgeMediaPlacement {
  readonly assetId: string;
  readonly role: CreatorKnowledgeMediaRole;
  readonly playback: CreatorKnowledgeMediaPlayback;
  readonly position: number;
  readonly altText: string | null;
  readonly caption: string | null;
  readonly posterAssetId: string | null;
}

export interface CreatorKnowledgeMediaPlacementInput {
  readonly assetId: string;
  readonly role: CreatorKnowledgeMediaRole;
  readonly playback: CreatorKnowledgeMediaPlayback;
  readonly altText: string;
  readonly caption: string | null;
  readonly posterAssetId: string | null;
}

export interface CreatorKnowledgeMediaResponse {
  readonly placements: readonly CreatorKnowledgeMediaPlacement[];
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

export interface CreatorAiKnowledgeCandidate {
  readonly generationId: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly canonical: false;
  readonly createdAt: string;
}

export interface AcceptedCreatorAiKnowledgeCandidate {
  readonly generationId: string;
  readonly canonical: true;
  readonly canonicalOwner: 'knowledge';
  readonly resource: CreatorKnowledgeResource;
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

export interface CreatorPagePreview {
  readonly page: CreatorPage;
  readonly items: readonly CreatorPagePreviewItem[];
}

export type CreatorPagePreviewItem =
  | {
      readonly position: number;
      readonly kind: 'BLOCK';
      readonly id: string;
      readonly blockType: string;
      readonly text: string;
    }
  | {
      readonly position: number;
      readonly kind: 'KNOWLEDGE_RESOURCE';
      readonly id: string;
      readonly resourceType: string;
      readonly lifecycle: string;
    }
  | {
      readonly position: number;
      readonly kind: 'MEDIA_ASSET';
      readonly id: string;
      readonly assetType: CreatorPagePreviewMediaAssetType;
      readonly durationMs?: number;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isCompositionItemKind(value: unknown): value is CreatorCompositionItemKind {
  return value === 'BLOCK' || value === 'KNOWLEDGE_RESOURCE' || value === 'MEDIA_ASSET';
}

function isCreatorPagePreviewMediaAssetType(
  value: unknown,
): value is CreatorPagePreviewMediaAssetType {
  return value === 'IMAGE' || value === 'VIDEO' || value === 'AUDIO' || value === 'DOCUMENT';
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

function readKnowledgeResourceList(value: unknown): readonly CreatorKnowledgeResource[] {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    throw new Error('Creator Knowledge list API response did not match the expected contract.');
  }

  return value.items.map(readKnowledgeResource);
}

function readKnowledgeEntityConfiguration(value: unknown): CreatorKnowledgeEntityConfiguration {
  if (
    !isRecord(value) ||
    !isRecord(value.resource) ||
    !isString(value.resourceId) ||
    !isString(value.slug) ||
    !isString(value.displayName) ||
    !(isString(value.nativeName) || value.nativeName === null) ||
    !Array.isArray(value.alternateNames) ||
    !value.alternateNames.every(isString) ||
    !isString(value.summary) ||
    !(isString(value.overview) || value.overview === null) ||
    !Array.isArray(value.facts) ||
    !Array.isArray(value.relations) ||
    !isString(value.updatedAt)
  ) {
    throw new Error('Creator Knowledge Entity API response did not match the expected contract.');
  }

  const facts = value.facts.map((fact): CreatorKnowledgeEntityFact => {
    if (!isRecord(fact) || !isString(fact.key) || !isString(fact.label) || !isString(fact.value)) {
      throw new Error('Creator Knowledge Entity fact did not match the expected contract.');
    }
    return { key: fact.key, label: fact.label, value: fact.value };
  });

  const relations = value.relations.map((relation): CreatorKnowledgeEntityRelation => {
    if (
      !isRecord(relation) ||
      !isString(relation.targetResourceId) ||
      !isString(relation.sectionKey) ||
      !isString(relation.relationshipType) ||
      typeof relation.position !== 'number' ||
      !Number.isInteger(relation.position) ||
      relation.position < 0
    ) {
      throw new Error('Creator Knowledge Entity relation did not match the expected contract.');
    }

    return {
      targetResourceId: relation.targetResourceId,
      sectionKey: relation.sectionKey,
      relationshipType: relation.relationshipType,
      position: relation.position,
    };
  });

  return {
    resource: readKnowledgeResource(value.resource),
    resourceId: value.resourceId,
    slug: value.slug,
    displayName: value.displayName,
    nativeName: value.nativeName,
    alternateNames: value.alternateNames,
    summary: value.summary,
    overview: value.overview,
    facts,
    relations,
    updatedAt: value.updatedAt,
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

function isCreatorKnowledgeMediaRole(value: unknown): value is CreatorKnowledgeMediaRole {
  return value === 'HERO' || value === 'GALLERY' || value === 'HIGHLIGHT';
}

function isCreatorKnowledgeMediaPlayback(value: unknown): value is CreatorKnowledgeMediaPlayback {
  return value === 'STILL' || value === 'SHORT_LOOP';
}

function readKnowledgeMediaResponse(value: unknown): CreatorKnowledgeMediaResponse {
  if (!isRecord(value) || !Array.isArray(value.placements)) {
    throw new Error('Creator Knowledge Media API response did not match the expected contract.');
  }

  const placements = value.placements.map((placement): CreatorKnowledgeMediaPlacement => {
    if (
      !isRecord(placement) ||
      !isString(placement.assetId) ||
      !isCreatorKnowledgeMediaRole(placement.role) ||
      !isCreatorKnowledgeMediaPlayback(placement.playback) ||
      typeof placement.position !== 'number' ||
      !Number.isInteger(placement.position) ||
      placement.position < 0 ||
      !(isString(placement.altText) || placement.altText === null) ||
      !(isString(placement.caption) || placement.caption === null) ||
      !(isString(placement.posterAssetId) || placement.posterAssetId === null)
    ) {
      throw new Error('Creator Knowledge Media placement did not match the expected contract.');
    }

    return {
      assetId: placement.assetId,
      role: placement.role,
      playback: placement.playback,
      position: placement.position,
      altText: placement.altText,
      caption: placement.caption,
      posterAssetId: placement.posterAssetId,
    };
  });

  return { placements };
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

function readAiKnowledgeCandidate(value: unknown): CreatorAiKnowledgeCandidate {
  if (
    !isRecord(value) ||
    !isString(value.generationId) ||
    !isString(value.universeKey) ||
    !isString(value.resourceType) ||
    value.canonical !== false ||
    !isString(value.createdAt)
  ) {
    throw new Error('Creator AI assistance response did not match the expected contract.');
  }

  return {
    generationId: value.generationId,
    universeKey: value.universeKey,
    resourceType: value.resourceType,
    canonical: false,
    createdAt: value.createdAt,
  };
}

function readAcceptedAiKnowledgeCandidate(value: unknown): AcceptedCreatorAiKnowledgeCandidate {
  if (
    !isRecord(value) ||
    !isString(value.generationId) ||
    value.canonical !== true ||
    value.canonicalOwner !== 'knowledge'
  ) {
    throw new Error('Creator AI acceptance response did not match the expected contract.');
  }

  return {
    generationId: value.generationId,
    canonical: true,
    canonicalOwner: 'knowledge',
    resource: readKnowledgeResource(value.resource),
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

function readPagePreview(value: unknown): CreatorPagePreview {
  if (!isRecord(value) || !isRecord(value.page) || !Array.isArray(value.items)) {
    throw new Error('Creator Preview API response did not match the expected contract.');
  }

  const page = readPage(value.page);
  const items = value.items.map((item): CreatorPagePreviewItem => {
    if (
      !isRecord(item) ||
      typeof item.position !== 'number' ||
      !isCompositionItemKind(item.kind) ||
      !isString(item.id)
    ) {
      throw new Error('Creator Preview item did not match the expected contract.');
    }

    switch (item.kind) {
      case 'BLOCK':
        if (!isString(item.blockType) || !isString(item.text)) {
          throw new Error('Creator Preview Block did not match the expected contract.');
        }
        return {
          position: item.position,
          kind: item.kind,
          id: item.id,
          blockType: item.blockType,
          text: item.text,
        };
      case 'KNOWLEDGE_RESOURCE':
        if (!isString(item.resourceType) || !isString(item.lifecycle)) {
          throw new Error('Creator Preview Knowledge item did not match the expected contract.');
        }
        return {
          position: item.position,
          kind: item.kind,
          id: item.id,
          resourceType: item.resourceType,
          lifecycle: item.lifecycle,
        };
      case 'MEDIA_ASSET':
        if (
          !isCreatorPagePreviewMediaAssetType(item.assetType) ||
          !(
            item.durationMs === undefined ||
            (typeof item.durationMs === 'number' &&
              Number.isInteger(item.durationMs) &&
              item.durationMs > 0)
          )
        ) {
          throw new Error('Creator Preview Media item did not match the expected contract.');
        }
        return {
          position: item.position,
          kind: item.kind,
          id: item.id,
          assetType: item.assetType,
          ...(item.durationMs === undefined ? {} : { durationMs: item.durationMs }),
        };
    }
  });

  return { page, items };
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

export async function listCreatorKnowledgeResources(
  universeKey: string,
): Promise<readonly CreatorKnowledgeResource[]> {
  const query = new URLSearchParams({ universeKey });
  const response = await apiRequest(`/knowledge/creator/resources?${query.toString()}`);
  return readKnowledgeResourceList(await readJson(response));
}

export async function suggestCreatorKnowledgeCandidate(input: {
  readonly universeKey: string;
  readonly request: string;
  readonly contextQuery: string;
}): Promise<CreatorAiKnowledgeCandidate> {
  const response = await apiRequest('/composition/ai/knowledge-candidates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return readAiKnowledgeCandidate(await readJson(response));
}

export async function acceptCreatorKnowledgeCandidate(
  generationId: string,
): Promise<AcceptedCreatorAiKnowledgeCandidate> {
  const response = await apiRequest(
    `/composition/ai/knowledge-candidates/${encodeURIComponent(generationId)}/accept`,
    { method: 'POST' },
  );
  return readAcceptedAiKnowledgeCandidate(await readJson(response));
}

export async function uploadCreatorMediaAsset(file: File): Promise<CreatorMediaAsset> {
  const body = new FormData();
  body.append('file', file);
  const response = await apiRequest('/media/assets', { method: 'POST', body });
  return readMediaAsset(await readJson(response));
}

export async function getCreatorKnowledgeEntity(
  id: string,
): Promise<CreatorKnowledgeEntityConfiguration> {
  const response = await apiRequest(`/knowledge/resources/${encodeURIComponent(id)}/entity`);
  return readKnowledgeEntityConfiguration(await readJson(response));
}

export async function replaceCreatorKnowledgeEntity(
  id: string,
  input: CreatorKnowledgeEntityConfigurationInput,
): Promise<CreatorKnowledgeEntityConfiguration> {
  await apiRequest(`/knowledge/resources/${encodeURIComponent(id)}/entity`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return getCreatorKnowledgeEntity(id);
}

export async function publishCreatorKnowledgeResource(
  id: string,
): Promise<CreatorKnowledgeResource> {
  const response = await apiRequest(`/knowledge/resources/${encodeURIComponent(id)}/publish`, {
    method: 'POST',
  });
  return readKnowledgeResource(await readJson(response));
}

export async function archiveCreatorKnowledgeResource(
  id: string,
): Promise<CreatorKnowledgeResource> {
  const response = await apiRequest(`/knowledge/resources/${encodeURIComponent(id)}/archive`, {
    method: 'POST',
  });
  return readKnowledgeResource(await readJson(response));
}

export async function getCreatorKnowledgeMedia(id: string): Promise<CreatorKnowledgeMediaResponse> {
  const response = await apiRequest(`/knowledge/resources/${encodeURIComponent(id)}/media`);
  return readKnowledgeMediaResponse(await readJson(response));
}

export async function replaceCreatorKnowledgeMedia(
  id: string,
  placements: readonly CreatorKnowledgeMediaPlacementInput[],
): Promise<CreatorKnowledgeMediaResponse> {
  const response = await apiRequest(`/knowledge/resources/${encodeURIComponent(id)}/media`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ placements }),
  });
  return readKnowledgeMediaResponse(await readJson(response));
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

export async function publishCreatorPage(id: string): Promise<CreatorPage> {
  const response = await apiRequest(`/composition/pages/${encodeURIComponent(id)}/publish`, {
    method: 'POST',
  });
  return readPage(await readJson(response));
}

export async function archiveCreatorPage(id: string): Promise<CreatorPage> {
  const response = await apiRequest(`/composition/pages/${encodeURIComponent(id)}/archive`, {
    method: 'POST',
  });
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

export async function getCreatorPagePreview(id: string): Promise<CreatorPagePreview> {
  const response = await apiRequest(`/composition/pages/${encodeURIComponent(id)}/preview`);
  return readPagePreview(await readJson(response));
}

export async function getPublicExperience(id: string): Promise<CreatorPagePreview> {
  const response = await apiRequest(`/composition/public/pages/${encodeURIComponent(id)}`);
  return readPagePreview(await readJson(response));
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
