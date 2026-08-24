import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId } from '@ai-world/kernel-identifiers';

import type { KnowledgeEntityConfiguration } from './knowledge-entity';
import type { KnowledgeEntityConfigurationReader } from './knowledge-entity-configuration-reader';

export interface GetKnowledgeEntityInput {
  readonly id: string;
}

export class GetKnowledgeEntity {
  public constructor(private readonly entities: KnowledgeEntityConfigurationReader) {}

  public async execute(input: GetKnowledgeEntityInput): Promise<KnowledgeEntityConfiguration> {
    let knowledgeResourceId: ReturnType<typeof parseResourceId>;
    try {
      knowledgeResourceId = parseResourceId(input.id);
    } catch {
      throw new ApplicationError({
        code: 'knowledge.entity.invalid_input',
        kind: 'validation',
        message: 'Knowledge Entity read requires a canonical Resource ID.',
        publicMessage: 'The Knowledge Entity input is invalid.',
      });
    }

    const configuration = await this.entities.findConfigurationByResourceId({
      knowledgeResourceId,
    });
    if (!configuration) {
      throw new ApplicationError({
        code: 'knowledge.entity.configuration_not_found',
        kind: 'not_found',
        message: 'Knowledge Entity configuration was not found.',
        publicMessage: 'Knowledge Entity configuration not found.',
      });
    }
    return configuration;
  }
}
