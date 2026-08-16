import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
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

function invalidKnowledgeResourceInput(error: TypeError): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.resource.invalid_input',
    kind: 'validation',
    message: `Knowledge Resource update input failed canonical validation: ${error.message}`,
    publicMessage: 'The Knowledge Resource input is invalid.',
  });
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

    let id: ReturnType<typeof parseResourceId>;
    let resourceType: ReturnType<typeof parseNamespacedKey>;

    try {
      id = parseResourceId(input.id);
      resourceType = parseNamespacedKey(input.resourceType);
    } catch (error) {
      if (error instanceof TypeError) {
        throw invalidKnowledgeResourceInput(error);
      }

      throw error;
    }

    return this.updateKnowledgeResource.execute({
      id,
      resourceType,
    });
  }
}
