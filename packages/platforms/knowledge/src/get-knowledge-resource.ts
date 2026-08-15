import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';

import type { KnowledgeResource } from './knowledge-resource';
import type { KnowledgeResourceReader } from './knowledge-resource-reader';

export interface GetKnowledgeResourceInput {
  readonly id: ResourceId;
}

export class GetKnowledgeResource {
  constructor(private readonly reader: KnowledgeResourceReader) {}

  async execute(input: GetKnowledgeResourceInput): Promise<KnowledgeResource> {
    const id = parseResourceId(input.id);
    const resource = await this.reader.findById({ id });

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
