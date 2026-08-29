import type { PublicKnowledgeEntity } from '../knowledge/public-knowledge-entity-api';
import { entitySocialAssetId, entitySocialImageUrl } from '../knowledge/entity-social-media';

export function animeEntitySocialAssetId(entity: PublicKnowledgeEntity): string | null {
  return entitySocialAssetId(entity);
}

export function animeEntitySocialImageUrl(
  entity: PublicKnowledgeEntity,
  apiOrigin: string,
): string | null {
  return entitySocialImageUrl(entity, apiOrigin);
}
