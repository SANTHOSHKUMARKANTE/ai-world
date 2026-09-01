import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId } from '@ai-world/kernel-identifiers';

import type { PublicKnowledgeEntity } from './knowledge-entity';
import type { PublicKnowledgeEntityByResourceIdReader } from './public-knowledge-entity-by-resource-id-reader';

export interface GetPublicKnowledgeEntityByResourceIdInput {
  readonly resourceId: string;
}

function notFound(): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.entity.public_not_found',
    kind: 'not_found',
    message: 'No published Knowledge Entity exists for the supplied Resource ID.',
    publicMessage: 'Knowledge Entity not found.',
  });
}

export class GetPublicKnowledgeEntityByResourceId {
  public constructor(private readonly entities: PublicKnowledgeEntityByResourceIdReader) {}

  public async execute(
    input: GetPublicKnowledgeEntityByResourceIdInput,
  ): Promise<PublicKnowledgeEntity> {
    let resourceId: ReturnType<typeof parseResourceId>;

    try {
      resourceId = parseResourceId(input.resourceId);
    } catch {
      throw notFound();
    }

    const entity = await this.entities.findPublishedByResourceId({
      knowledgeResourceId: resourceId,
    });

    if (!entity || entity.resource.id !== resourceId) {
      throw notFound();
    }

    return entity;
  }
}
