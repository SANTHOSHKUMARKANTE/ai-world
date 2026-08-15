import { ApplicationError } from '@ai-world/foundation-errors';
import { EvaluatePermission } from '@ai-world/platform-identity-access';

import {
  CreateKnowledgeResource,
  type CreateKnowledgeResourceInput,
} from './create-knowledge-resource';
import { KNOWLEDGE_RESOURCE_CREATE_PERMISSION_KEY } from './knowledge-authorization-policy';
import type { KnowledgeResource } from './knowledge-resource';

export interface CreateKnowledgeResourceAsActorInput extends CreateKnowledgeResourceInput {
  readonly actingActorId: string;
}

export class CreateKnowledgeResourceAsActor {
  constructor(
    private readonly evaluatePermission: EvaluatePermission,
    private readonly createKnowledgeResource: CreateKnowledgeResource,
  ) {}

  async execute(input: CreateKnowledgeResourceAsActorInput): Promise<KnowledgeResource> {
    const evaluation = await this.evaluatePermission.execute({
      actorId: input.actingActorId,
      permissionKey: KNOWLEDGE_RESOURCE_CREATE_PERMISSION_KEY,
    });

    if (!evaluation.allowed) {
      throw new ApplicationError({
        code: 'knowledge.authorization.forbidden',
        kind: 'forbidden',
        message:
          'Knowledge Resource creation was denied because the acting Actor does not have the required Permission.',
        publicMessage: 'You do not have permission to perform this action.',
      });
    }

    return this.createKnowledgeResource.execute({
      universeKey: input.universeKey,
      resourceType: input.resourceType,
    });
  }
}
