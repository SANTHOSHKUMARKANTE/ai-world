import { ApplicationError } from '@ai-world/foundation-errors';
import { EvaluatePermission } from '@ai-world/platform-identity-access';

import { GetKnowledgeEntity, type GetKnowledgeEntityInput } from './get-knowledge-entity';
import { KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY } from './knowledge-authorization-policy';
import type { KnowledgeEntityConfiguration } from './knowledge-entity';

export interface GetKnowledgeEntityAsActorInput extends GetKnowledgeEntityInput {
  readonly actingActorId: string;
}

export class GetKnowledgeEntityAsActor {
  public constructor(
    private readonly evaluatePermission: EvaluatePermission,
    private readonly getKnowledgeEntity: GetKnowledgeEntity,
  ) {}

  public async execute(
    input: GetKnowledgeEntityAsActorInput,
  ): Promise<KnowledgeEntityConfiguration> {
    const evaluation = await this.evaluatePermission.execute({
      actorId: input.actingActorId,
      permissionKey: KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY,
    });
    if (!evaluation.allowed) {
      throw new ApplicationError({
        code: 'knowledge.authorization.forbidden',
        kind: 'forbidden',
        message:
          'Knowledge Entity read was denied because the acting Actor lacks the Knowledge update Permission.',
        publicMessage: 'You do not have permission to perform this action.',
      });
    }
    return this.getKnowledgeEntity.execute(input);
  }
}
