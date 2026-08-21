import type { ResourceId } from '@ai-world/kernel-identifiers';

export const PAGE_COMPOSITION_BLOCK_ITEM_KIND = 'BLOCK' as const;
export const PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND = 'KNOWLEDGE_RESOURCE' as const;
export const PAGE_COMPOSITION_MEDIA_ITEM_KIND = 'MEDIA_ASSET' as const;

export type PageCompositionItemKind =
  | typeof PAGE_COMPOSITION_BLOCK_ITEM_KIND
  | typeof PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND
  | typeof PAGE_COMPOSITION_MEDIA_ITEM_KIND;

export interface PageCompositionBlockReference {
  readonly kind: typeof PAGE_COMPOSITION_BLOCK_ITEM_KIND;
  readonly id: ResourceId;
}

export interface PageCompositionKnowledgeReference {
  readonly kind: typeof PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND;
  readonly id: ResourceId;
}

export interface PageCompositionMediaReference {
  readonly kind: typeof PAGE_COMPOSITION_MEDIA_ITEM_KIND;
  readonly id: ResourceId;
}

export type PageCompositionReference =
  PageCompositionBlockReference | PageCompositionKnowledgeReference | PageCompositionMediaReference;

export interface PageCompositionItem {
  readonly position: number;
  readonly reference: PageCompositionReference;
}

export interface PageComposition {
  readonly pageId: ResourceId;
  readonly items: readonly PageCompositionItem[];
}

export function isPageCompositionItemKind(value: unknown): value is PageCompositionItemKind {
  return (
    value === PAGE_COMPOSITION_BLOCK_ITEM_KIND ||
    value === PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND ||
    value === PAGE_COMPOSITION_MEDIA_ITEM_KIND
  );
}

export function isPageCompositionPosition(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}
