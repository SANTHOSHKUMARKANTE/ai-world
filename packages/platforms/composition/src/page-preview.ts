import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';
import type { KnowledgeResourceLifecycle, KnowledgeResource } from '@ai-world/platform-knowledge';
import type { MediaAssetReference } from '@ai-world/platform-media';

import type { BlockType } from './block';
import type { Page, PageLifecycle, PagePresentationMetadata, PageRouteMetadata } from './page';
import {
  PAGE_COMPOSITION_BLOCK_ITEM_KIND,
  PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND,
  PAGE_COMPOSITION_MEDIA_ITEM_KIND,
} from './page-composition';

export interface PagePreviewPage {
  readonly id: ResourceId;
  readonly universeKey: NamespacedKey;
  readonly route: PageRouteMetadata;
  readonly presentation: PagePresentationMetadata;
  readonly lifecycle: PageLifecycle;
}

export interface PagePreviewBlockItem {
  readonly position: number;
  readonly kind: typeof PAGE_COMPOSITION_BLOCK_ITEM_KIND;
  readonly id: ResourceId;
  readonly blockType: BlockType;
  readonly text: string;
}

export interface PagePreviewKnowledgeItem {
  readonly position: number;
  readonly kind: typeof PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND;
  readonly id: ResourceId;
  readonly resourceType: KnowledgeResource['resourceType'];
  readonly lifecycle: KnowledgeResourceLifecycle;
}

export interface PagePreviewMediaItem {
  readonly position: number;
  readonly kind: typeof PAGE_COMPOSITION_MEDIA_ITEM_KIND;
  readonly id: ResourceId;
  readonly assetType: MediaAssetReference['assetType'];
  readonly durationMs?: number;
}

export type PagePreviewItem =
  PagePreviewBlockItem | PagePreviewKnowledgeItem | PagePreviewMediaItem;

export interface PagePreview {
  readonly page: PagePreviewPage;
  readonly items: readonly PagePreviewItem[];
}

export function toPagePreviewPage(page: Page): PagePreviewPage {
  return {
    id: page.id,
    universeKey: page.universeKey,
    route: page.route,
    presentation: page.presentation,
    lifecycle: page.lifecycle,
  };
}
