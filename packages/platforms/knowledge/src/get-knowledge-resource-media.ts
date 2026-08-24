import { ApplicationError } from '@ai-world/foundation-errors';
import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { KnowledgeResourceMediaPlacement } from './knowledge-resource-media-placement';
import type { KnowledgeResourceMediaPlacementReader } from './knowledge-resource-media-placement-reader';
import type { KnowledgeResourceReader } from './knowledge-resource-reader';

export interface GetKnowledgeResourceMediaInput {
  readonly id: ResourceId;
}

export class GetKnowledgeResourceMedia {
  public constructor(
    private readonly resources: KnowledgeResourceReader,
    private readonly placements: KnowledgeResourceMediaPlacementReader,
  ) {}

  public async execute(
    input: GetKnowledgeResourceMediaInput,
  ): Promise<readonly KnowledgeResourceMediaPlacement[]> {
    const resource = await this.resources.findById({ id: input.id });

    if (!resource) {
      throw new ApplicationError({
        code: 'knowledge.resource.not_found',
        kind: 'not_found',
        message: 'No Knowledge Resource exists for the supplied Resource ID.',
        publicMessage: 'Knowledge Resource not found.',
      });
    }

    return this.placements.listMediaPlacements({
      knowledgeResourceId: resource.id,
    });
  }
}
