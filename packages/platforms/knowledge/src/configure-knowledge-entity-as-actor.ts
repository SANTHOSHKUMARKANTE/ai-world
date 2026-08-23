import { ApplicationError } from '@ai-world/foundation-errors';
import { EvaluatePermission } from '@ai-world/platform-identity-access';

import {
  ConfigureKnowledgeEntity,
  type ConfigureKnowledgeEntityInput,
} from './configure-knowledge-entity';
import { KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY } from './knowledge-authorization-policy';
import type { KnowledgeEntityProfile } from './knowledge-entity';

export interface ConfigureKnowledgeEntityAsActorInput extends ConfigureKnowledgeEntityInput {
  readonly actingActorId: string;
}

export class ConfigureKnowledgeEntityAsActor {
  public constructor(
    private readonly evaluatePermission: EvaluatePermission,
    private readonly configureKnowledgeEntity: ConfigureKnowledgeEntity,
  ) {}

  public async execute(
    input: ConfigureKnowledgeEntityAsActorInput,
  ): Promise<KnowledgeEntityProfile> {
    const evaluation = await this.evaluatePermission.execute({
      actorId: input.actingActorId,
      permissionKey: KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY,
    });

    if (!evaluation.allowed) {
      throw new ApplicationError({
        code: 'knowledge.authorization.forbidden',
        kind: 'forbidden',
        message:
          'Knowledge Entity configuration was denied because the acting Actor lacks the Knowledge update Permission.',
        publicMessage: 'You do not have permission to perform this action.',
      });
    }

    return this.configureKnowledgeEntity.execute(input);
  }
}
