import { ApplicationError } from '@ai-world/foundation-errors';
import { EvaluatePermission } from '@ai-world/platform-identity-access';

import { KNOWLEDGE_RESOURCE_ARCHIVE_PERMISSION_KEY } from './knowledge-authorization-policy';
import type { KnowledgeResource } from './knowledge-resource';
import {
  ArchiveKnowledgeResource,
  type ArchiveKnowledgeResourceInput,
} from './archive-knowledge-resource';

export interface ArchiveKnowledgeResourceAsActorInput extends ArchiveKnowledgeResourceInput {
  readonly actingActorId: string;
}

export class ArchiveKnowledgeResourceAsActor {
  constructor(
    private readonly evaluatePermission: EvaluatePermission,
    private readonly archiveKnowledgeResource: ArchiveKnowledgeResource,
  ) {}

  async execute(input: ArchiveKnowledgeResourceAsActorInput): Promise<KnowledgeResource> {
    const evaluation = await this.evaluatePermission.execute({
      actorId: input.actingActorId,
      permissionKey: KNOWLEDGE_RESOURCE_ARCHIVE_PERMISSION_KEY,
    });

    if (!evaluation.allowed) {
      throw new ApplicationError({
        code: 'knowledge.authorization.forbidden',
        kind: 'forbidden',
        message:
          'Knowledge Resource archival was denied because the acting Actor does not have the required Permission.',
        publicMessage: 'You do not have permission to perform this action.',
      });
    }

    return this.archiveKnowledgeResource.execute({
      id: input.id,
    });
  }
}
