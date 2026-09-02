import { ApplicationError } from '@ai-world/foundation-errors';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { EvaluatePermission } from '@ai-world/platform-identity-access';

import type { CreatorKnowledgeResourceReader } from './creator-knowledge-resource-reader';
import { KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY } from './knowledge-authorization-policy';
import type { KnowledgeResource } from './knowledge-resource';

export const CREATOR_KNOWLEDGE_RESOURCE_DEFAULT_LIMIT = 50;
export const CREATOR_KNOWLEDGE_RESOURCE_MAX_LIMIT = 100;

export interface ListKnowledgeResourcesAsActorInput {
  readonly actingActorId: string;
  readonly universeKey: string;
  readonly limit?: number;
}

export class ListKnowledgeResourcesAsActor {
  public constructor(
    private readonly evaluatePermission: EvaluatePermission,
    private readonly reader: CreatorKnowledgeResourceReader,
  ) {}

  public async execute(
    input: ListKnowledgeResourcesAsActorInput,
  ): Promise<readonly KnowledgeResource[]> {
    const evaluation = await this.evaluatePermission.execute({
      actorId: input.actingActorId,
      permissionKey: KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY,
    });

    if (!evaluation.allowed) {
      throw new ApplicationError({
        code: 'knowledge.authorization.forbidden',
        kind: 'forbidden',
        message:
          'Creator Knowledge listing was denied because the acting Actor does not have the required Permission.',
        publicMessage: 'You do not have permission to perform this action.',
      });
    }

    let universeKey;
    try {
      universeKey = parseNamespacedKey(input.universeKey);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new ApplicationError({
          code: 'knowledge.resource.invalid_input',
          kind: 'validation',
          message: `Creator Knowledge listing input failed canonical validation: ${error.message}`,
          publicMessage: 'The Knowledge Resource input is invalid.',
        });
      }
      throw error;
    }

    const limit = input.limit ?? CREATOR_KNOWLEDGE_RESOURCE_DEFAULT_LIMIT;
    if (!Number.isInteger(limit) || limit < 1 || limit > CREATOR_KNOWLEDGE_RESOURCE_MAX_LIMIT) {
      throw new ApplicationError({
        code: 'knowledge.resource.invalid_input',
        kind: 'validation',
        message: `Creator Knowledge listing limit must be between 1 and ${CREATOR_KNOWLEDGE_RESOURCE_MAX_LIMIT}.`,
        publicMessage: 'The Knowledge Resource input is invalid.',
      });
    }

    return this.reader.listForCreator({ universeKey, limit });
  }
}
