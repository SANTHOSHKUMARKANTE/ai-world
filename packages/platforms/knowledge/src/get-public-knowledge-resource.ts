import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId } from '@ai-world/kernel-identifiers';

import {
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
  type KnowledgeResource,
} from './knowledge-resource';
import type { PublicKnowledgeResourceReader } from './public-knowledge-resource-reader';

export interface GetPublicKnowledgeResourceInput {
  readonly id: string;
}

function invalidResourceId(): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.public.invalid_resource_id',
    kind: 'validation',
    message: 'Public Knowledge read received a non-canonical Resource ID.',
    publicMessage: 'The Knowledge Resource identifier is invalid.',
  });
}

function publicResourceNotFound(): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.public.resource_not_found',
    kind: 'not_found',
    message: 'No published Knowledge Resource exists for the supplied public Resource ID.',
    publicMessage: 'Knowledge Resource not found.',
  });
}

export class GetPublicKnowledgeResource {
  constructor(private readonly reader: PublicKnowledgeResourceReader) {}

  async execute(input: GetPublicKnowledgeResourceInput): Promise<KnowledgeResource> {
    let id: ReturnType<typeof parseResourceId>;

    try {
      id = parseResourceId(input.id);
    } catch {
      throw invalidResourceId();
    }

    const resource = await this.reader.findPublishedById({ id });

    if (!resource || resource.lifecycle !== KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE) {
      throw publicResourceNotFound();
    }

    return resource;
  }
}
