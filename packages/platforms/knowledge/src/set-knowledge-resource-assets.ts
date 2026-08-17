import { ApplicationError } from '@ai-world/foundation-errors';
import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { MediaAssetReferenceResolver } from '@ai-world/platform-media';

import type { KnowledgeResourceAssetReferenceStore } from './knowledge-resource-asset-reference-store';
import type { KnowledgeResourceReader } from './knowledge-resource-reader';

export interface SetKnowledgeResourceAssetsInput {
  readonly id: ResourceId;
  readonly assetIds: readonly string[];
}

function knowledgeResourceNotFound(): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.resource.not_found',
    kind: 'not_found',
    message: 'No Knowledge Resource exists for the supplied Resource ID.',
    publicMessage: 'Knowledge Resource not found.',
  });
}

function duplicateAssetReference(): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.resource.assets.duplicate_asset',
    kind: 'validation',
    message: 'Knowledge Resource Asset references must not contain duplicate Asset IDs.',
    publicMessage: 'Each Media Asset may be referenced at most once.',
  });
}

export class SetKnowledgeResourceAssets {
  public constructor(
    private readonly resources: KnowledgeResourceReader,
    private readonly references: KnowledgeResourceAssetReferenceStore,
    private readonly mediaAssetReferences: MediaAssetReferenceResolver,
  ) {}

  public async execute(input: SetKnowledgeResourceAssetsInput): Promise<readonly ResourceId[]> {
    const resource = await this.resources.findById({ id: input.id });
    if (!resource) {
      throw knowledgeResourceNotFound();
    }
    if (new Set(input.assetIds).size !== input.assetIds.length) {
      throw duplicateAssetReference();
    }
    const resolvedAssetIds: ResourceId[] = [];
    for (const assetId of input.assetIds) {
      const reference = await this.mediaAssetReferences.resolve({ id: assetId });
      resolvedAssetIds.push(reference.id);
    }
    return this.references.replaceAssetIds({
      knowledgeResourceId: resource.id,
      assetIds: resolvedAssetIds,
    });
  }
}
