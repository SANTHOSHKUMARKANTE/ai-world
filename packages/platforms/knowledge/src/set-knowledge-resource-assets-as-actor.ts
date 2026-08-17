import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';
import { EvaluatePermission } from '@ai-world/platform-identity-access';

import { KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY } from './knowledge-authorization-policy';
import { SetKnowledgeResourceAssets } from './set-knowledge-resource-assets';

export interface SetKnowledgeResourceAssetsAsActorInput {
  readonly actingActorId: string;
  readonly id: string;
  readonly assetIds: readonly string[];
}

function invalidKnowledgeResourceId(error: TypeError): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.resource.invalid_input',
    kind: 'validation',
    message: `Knowledge Resource Asset reference input failed canonical validation: ${error.message}`,
    publicMessage: 'The Knowledge Resource input is invalid.',
  });
}

export class SetKnowledgeResourceAssetsAsActor {
  public constructor(
    private readonly evaluatePermission: EvaluatePermission,
    private readonly setKnowledgeResourceAssets: SetKnowledgeResourceAssets,
  ) {}

  public async execute(
    input: SetKnowledgeResourceAssetsAsActorInput,
  ): Promise<readonly ResourceId[]> {
    const evaluation = await this.evaluatePermission.execute({
      actorId: input.actingActorId,
      permissionKey: KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY,
    });
    if (!evaluation.allowed) {
      throw new ApplicationError({
        code: 'knowledge.authorization.forbidden',
        kind: 'forbidden',
        message:
          'Knowledge Resource Asset reference update was denied because the acting Actor does not have the required Permission.',
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
    return this.setKnowledgeResourceAssets.execute({ id, assetIds: input.assetIds });
  }
}
