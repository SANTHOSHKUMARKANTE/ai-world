import type { ResourceId } from '@ai-world/kernel-identifiers';

export const KNOWLEDGE_MEDIA_HERO_ROLE = 'HERO' as const;
export const KNOWLEDGE_MEDIA_GALLERY_ROLE = 'GALLERY' as const;
export const KNOWLEDGE_MEDIA_HIGHLIGHT_ROLE = 'HIGHLIGHT' as const;

export const KNOWLEDGE_MEDIA_STILL_PLAYBACK = 'STILL' as const;
export const KNOWLEDGE_MEDIA_SHORT_LOOP_PLAYBACK = 'SHORT_LOOP' as const;

export type KnowledgeResourceMediaRole =
  | typeof KNOWLEDGE_MEDIA_HERO_ROLE
  | typeof KNOWLEDGE_MEDIA_GALLERY_ROLE
  | typeof KNOWLEDGE_MEDIA_HIGHLIGHT_ROLE;

export type KnowledgeResourceMediaPlayback =
  typeof KNOWLEDGE_MEDIA_STILL_PLAYBACK | typeof KNOWLEDGE_MEDIA_SHORT_LOOP_PLAYBACK;

export interface KnowledgeResourceMediaPlacement {
  readonly assetId: ResourceId;
  readonly role: KnowledgeResourceMediaRole;
  readonly playback: KnowledgeResourceMediaPlayback;
  readonly position: number;
  readonly altText: string | null;
  readonly caption: string | null;
  readonly posterAssetId: ResourceId | null;
}

export function isKnowledgeResourceMediaRole(value: string): value is KnowledgeResourceMediaRole {
  return (
    value === KNOWLEDGE_MEDIA_HERO_ROLE ||
    value === KNOWLEDGE_MEDIA_GALLERY_ROLE ||
    value === KNOWLEDGE_MEDIA_HIGHLIGHT_ROLE
  );
}

export function isKnowledgeResourceMediaPlayback(
  value: string,
): value is KnowledgeResourceMediaPlayback {
  return value === KNOWLEDGE_MEDIA_STILL_PLAYBACK || value === KNOWLEDGE_MEDIA_SHORT_LOOP_PLAYBACK;
}
