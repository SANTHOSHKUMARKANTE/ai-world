import { ApplicationError } from '@ai-world/foundation-errors';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
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

function invalidKnowledgeResourceInput(error: TypeError): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.resource.invalid_input',
    kind: 'validation',
    message: `Knowledge Resource creation input failed canonical validation: ${error.message}`,
    publicMessage: 'The Knowledge Resource input is invalid.',
  });
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

    let universeKey: ReturnType<typeof parseNamespacedKey>;
    let resourceType: ReturnType<typeof parseNamespacedKey>;

    try {
      universeKey = parseNamespacedKey(input.universeKey);
      resourceType = parseNamespacedKey(input.resourceType);
    } catch (error) {
      if (error instanceof TypeError) {
        throw invalidKnowledgeResourceInput(error);
      }

      throw error;
    }

    return this.createKnowledgeResource.execute({
      universeKey,
      resourceType,
    });
  }
}
