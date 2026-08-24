import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';
import { EvaluatePermission } from '@ai-world/platform-identity-access';

import { GetKnowledgeResourceMedia } from './get-knowledge-resource-media';
import { KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY } from './knowledge-authorization-policy';
import type { KnowledgeResourceMediaPlacement } from './knowledge-resource-media-placement';

export interface GetKnowledgeResourceMediaAsActorInput {
  readonly actingActorId: string;
  readonly id: string;
}

function invalidKnowledgeResourceId(error: TypeError): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.resource.invalid_input',
    kind: 'validation',
    message: `Knowledge Resource media management input failed canonical validation: ${error.message}`,
    publicMessage: 'The Knowledge Resource input is invalid.',
  });
}

export class GetKnowledgeResourceMediaAsActor {
  public constructor(
    private readonly evaluatePermission: EvaluatePermission,
    private readonly getKnowledgeResourceMedia: GetKnowledgeResourceMedia,
  ) {}

  public async execute(
    input: GetKnowledgeResourceMediaAsActorInput,
  ): Promise<readonly KnowledgeResourceMediaPlacement[]> {
    const evaluation = await this.evaluatePermission.execute({
      actorId: input.actingActorId,
      permissionKey: KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY,
    });

    if (!evaluation.allowed) {
      throw new ApplicationError({
        code: 'knowledge.authorization.forbidden',
        kind: 'forbidden',
        message:
          'Knowledge Resource media management was denied because the acting Actor does not have the required Permission.',
        publicMessage: 'You do not have permission to perform this action.',
      });
    }

    let id: ResourceId;
    try {
      id = parseResourceId(input.id);
    } catch (error) {
      if (error instanceof TypeError) {
        throw invalidKnowledgeResourceId(error);
      }
      throw error;
    }

    return this.getKnowledgeResourceMedia.execute({ id });
  }
}
