import { ApplicationError } from '@ai-world/foundation-errors';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';

import type { PublicKnowledgeEntity } from './knowledge-entity';
import type { KnowledgeEntityStore } from './knowledge-entity-store';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

export interface GetPublicKnowledgeEntityInput {
  readonly universeKey: string;
  readonly slug: string;
}

function notFound(): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.entity.public_not_found',
    kind: 'not_found',
    message: 'No published Knowledge Entity exists for the supplied route.',
    publicMessage: 'Knowledge Entity not found.',
  });
}

export class GetPublicKnowledgeEntity {
  public constructor(private readonly entities: KnowledgeEntityStore) {}

  public async execute(input: GetPublicKnowledgeEntityInput): Promise<PublicKnowledgeEntity> {
    let universeKey: ReturnType<typeof parseNamespacedKey>;

    try {
      universeKey = parseNamespacedKey(input.universeKey);
    } catch {
      throw notFound();
    }

    const slug = input.slug.trim();
    if (slug.length > 96 || !SLUG_PATTERN.test(slug)) {
      throw notFound();
    }

    const entity = await this.entities.findPublishedByRouteKey({
      routeKey: `${universeKey}/${slug}`,
    });

    if (!entity || entity.resource.universeKey !== universeKey) {
      throw notFound();
    }

    return entity;
  }
}
