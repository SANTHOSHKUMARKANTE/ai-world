import { ApplicationError } from '@ai-world/foundation-errors';
import { EvaluatePermission } from '@ai-world/platform-identity-access';

import { KNOWLEDGE_RESOURCE_PUBLISH_PERMISSION_KEY } from './knowledge-authorization-policy';
import type { KnowledgeResource } from './knowledge-resource';
import {
  PublishKnowledgeResource,
  type PublishKnowledgeResourceInput,
} from './publish-knowledge-resource';

export interface PublishKnowledgeResourceAsActorInput extends PublishKnowledgeResourceInput {
  readonly actingActorId: string;
}

export class PublishKnowledgeResourceAsActor {
  constructor(
    private readonly evaluatePermission: EvaluatePermission,
    private readonly publishKnowledgeResource: PublishKnowledgeResource,
  ) {}

  async execute(input: PublishKnowledgeResourceAsActorInput): Promise<KnowledgeResource> {
    const evaluation = await this.evaluatePermission.execute({
      actorId: input.actingActorId,
      permissionKey: KNOWLEDGE_RESOURCE_PUBLISH_PERMISSION_KEY,
    });

    if (!evaluation.allowed) {
      throw new ApplicationError({
        code: 'knowledge.authorization.forbidden',
        kind: 'forbidden',
        message:
          'Knowledge Resource publication was denied because the acting Actor does not have the required Permission.',
        publicMessage: 'You do not have permission to perform this action.',
      });
    }

    return this.publishKnowledgeResource.execute({
      id: input.id,
    });
  }
}
