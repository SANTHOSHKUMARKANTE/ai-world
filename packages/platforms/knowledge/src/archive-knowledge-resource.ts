import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';

import {
  KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE,
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
  type KnowledgeResource,
} from './knowledge-resource';
import type { KnowledgeResourceLifecycleWriter } from './knowledge-resource-lifecycle-writer';
import type { KnowledgeResourceReader } from './knowledge-resource-reader';

export interface ArchiveKnowledgeResourceInput {
  readonly id: ResourceId;
}

export class ArchiveKnowledgeResource {
  constructor(
    private readonly reader: KnowledgeResourceReader,
    private readonly lifecycleWriter: KnowledgeResourceLifecycleWriter,
  ) {}

  async execute(input: ArchiveKnowledgeResourceInput): Promise<KnowledgeResource> {
    const id = parseResourceId(input.id);

    const archived = await this.lifecycleWriter.transitionLifecycle({
      id,
      fromLifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
      toLifecycle: KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE,
    });

    if (archived) {
      return archived;
    }

    const existing = await this.reader.findById({ id });

    if (!existing) {
      throw new ApplicationError({
        code: 'knowledge.resource.not_found',
        kind: 'not_found',
        message: 'No Knowledge Resource exists for the supplied Resource ID.',
        publicMessage: 'Knowledge Resource not found.',
      });
    }

    throw new ApplicationError({
      code: 'knowledge.resource.lifecycle_conflict',
      kind: 'conflict',
      message: `Knowledge Resource cannot be archived from lifecycle ${existing.lifecycle}.`,
      publicMessage: 'Knowledge Resource lifecycle transition is not allowed.',
    });
  }
}
