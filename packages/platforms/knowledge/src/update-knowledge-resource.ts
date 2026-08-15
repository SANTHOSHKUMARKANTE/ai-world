import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey, type NamespacedKey } from '@ai-world/kernel-namespace';

import type { KnowledgeResource } from './knowledge-resource';
import type { KnowledgeResourceWriter } from './knowledge-resource-writer';

export interface UpdateKnowledgeResourceInput {
  readonly id: ResourceId;

  /**
   * P4-M03 deliberately limits the mutable canonical Resource header to
   * resourceType. Universe association, lifecycle, identity, and timestamps
   * remain outside this update operation.
   */
  readonly resourceType: NamespacedKey;
}

export class UpdateKnowledgeResource {
  constructor(private readonly writer: KnowledgeResourceWriter) {}

  async execute(input: UpdateKnowledgeResourceInput): Promise<KnowledgeResource> {
    const id = parseResourceId(input.id);
    const resourceType = parseNamespacedKey(input.resourceType);

    const resource = await this.writer.updateResourceType({
      id,
      resourceType,
    });

    if (!resource) {
      throw new ApplicationError({
        code: 'knowledge.resource.not_found',
        kind: 'not_found',
        message: 'No Knowledge Resource exists for the supplied Resource ID.',
        publicMessage: 'Knowledge Resource not found.',
      });
    }

    return resource;
  }
}
