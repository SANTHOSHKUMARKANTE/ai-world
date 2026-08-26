import type {
  PublicKnowledgeEntity,
  PublicKnowledgeEntityMedia,
} from '../knowledge/public-knowledge-entity-api';

function isEligibleAnimeSocialMedia(media: PublicKnowledgeEntityMedia): boolean {
  return (
    (media.assetType === 'IMAGE' && media.playback === 'STILL') ||
    (media.assetType === 'VIDEO' && media.playback === 'SHORT_LOOP' && media.posterAssetId !== null)
  );
}

export function animeEntitySocialAssetId(entity: PublicKnowledgeEntity): string | null {
  const eligible = entity.media.filter(isEligibleAnimeSocialMedia);
  const media = eligible.find((item) => item.role === 'HERO') ?? eligible[0];

  if (!media) {
    return null;
  }

  return media.assetType === 'VIDEO' ? media.posterAssetId : media.assetId;
}

export function animeEntitySocialImageUrl(
  entity: PublicKnowledgeEntity,
  apiOrigin: string,
): string | null {
  const assetId = animeEntitySocialAssetId(entity);
  return assetId
    ? new URL(`/media/assets/${encodeURIComponent(assetId)}/thumbnail`, apiOrigin).toString()
    : null;
}
