import { ApplicationError } from '@ai-world/foundation-errors';
import { EvaluatePermission } from '@ai-world/platform-identity-access';

import { KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY } from './knowledge-authorization-policy';
import type { KnowledgeResource } from './knowledge-resource';
import {
  UpdateKnowledgeResource,
  type UpdateKnowledgeResourceInput,
} from './update-knowledge-resource';

export interface UpdateKnowledgeResourceAsActorInput extends UpdateKnowledgeResourceInput {
  readonly actingActorId: string;
}

export class UpdateKnowledgeResourceAsActor {
  constructor(
    private readonly evaluatePermission: EvaluatePermission,
    private readonly updateKnowledgeResource: UpdateKnowledgeResource,
  ) {}

  async execute(input: UpdateKnowledgeResourceAsActorInput): Promise<KnowledgeResource> {
    const evaluation = await this.evaluatePermission.execute({
      actorId: input.actingActorId,
      permissionKey: KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY,
    });

    if (!evaluation.allowed) {
      throw new ApplicationError({
        code: 'knowledge.authorization.forbidden',
        kind: 'forbidden',
        message:
          'Knowledge Resource update was denied because the acting Actor does not have the required Permission.',
        publicMessage: 'You do not have permission to perform this action.',
      });
    }

    return this.updateKnowledgeResource.execute({
      id: input.id,
      resourceType: input.resourceType,
    });
  }
}
