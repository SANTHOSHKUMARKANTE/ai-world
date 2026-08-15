import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey, type NamespacedKey } from '@ai-world/kernel-namespace';

import { KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE, type KnowledgeResource } from './knowledge-resource';
import type { KnowledgeResourceWriter } from './knowledge-resource-writer';

export interface CreateKnowledgeResourceInput {
  readonly universeKey: NamespacedKey;
  readonly resourceType: NamespacedKey;
}

export class CreateKnowledgeResource {
  constructor(private readonly writer: KnowledgeResourceWriter) {}

  async execute(input: CreateKnowledgeResourceInput): Promise<KnowledgeResource> {
    const universeKey = parseNamespacedKey(input.universeKey);
    const resourceType = parseNamespacedKey(input.resourceType);

    return this.writer.create({
      id: generateResourceId(),
      universeKey,
      resourceType,
      lifecycle: KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
    });
  }
}
