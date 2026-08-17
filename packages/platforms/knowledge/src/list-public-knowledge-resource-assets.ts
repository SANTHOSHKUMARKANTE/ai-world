import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';

import type { KnowledgeResourceAssetReferenceStore } from './knowledge-resource-asset-reference-store';
import type { PublicKnowledgeResourceReader } from './public-knowledge-resource-reader';

export interface ListPublicKnowledgeResourceAssetsInput {
  readonly id: string;
}

function invalidResourceId(): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.public.invalid_resource_id',
    kind: 'validation',
    message: 'Public Knowledge Asset-reference read received a non-canonical Resource ID.',
    publicMessage: 'The Knowledge Resource identifier is invalid.',
  });
}

function publicResourceNotFound(): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.public.resource_not_found',
    kind: 'not_found',
    message:
      'No published Knowledge Resource exists for the supplied public Asset-reference Resource ID.',
    publicMessage: 'Knowledge Resource not found.',
  });
}

export class ListPublicKnowledgeResourceAssets {
  public constructor(
    private readonly resources: PublicKnowledgeResourceReader,
    private readonly references: KnowledgeResourceAssetReferenceStore,
  ) {}

  public async execute(
    input: ListPublicKnowledgeResourceAssetsInput,
  ): Promise<readonly ResourceId[]> {
    let id: ResourceId;
    try {
      id = parseResourceId(input.id);
    } catch {
      throw invalidResourceId();
    }
    const resource = await this.resources.findPublishedById({ id });
    if (!resource) {
      throw publicResourceNotFound();
    }
    return this.references.listAssetIds({ knowledgeResourceId: resource.id });
  }
}
