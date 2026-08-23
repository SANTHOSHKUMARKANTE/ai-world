import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';

import { ASSET_INITIAL_LIFECYCLE, type AssetType } from './asset';
import type { AssetReader } from './asset-reader';

export interface ResolveMediaAssetReferenceInput {
  readonly id: string;
}

export interface MediaAssetReference {
  readonly id: ResourceId;
  readonly assetType: AssetType;
}

export interface MediaAssetReferenceResolver {
  resolve(input: ResolveMediaAssetReferenceInput): Promise<MediaAssetReference>;
}

function invalidAssetReferenceId(cause: unknown): ApplicationError {
  return new ApplicationError({
    code: 'media.asset.reference.invalid_asset_id',
    kind: 'validation',
    message: 'Media Asset reference resolution requires a valid Resource ID.',
    publicMessage: 'The Media Asset identifier is invalid.',
    cause,
  });
}

function assetReferenceNotFound(): ApplicationError {
  return new ApplicationError({
    code: 'media.asset.reference.not_found',
    kind: 'not_found',
    message: 'No ACTIVE Media Asset exists for the supplied reference ID.',
    publicMessage: 'Media Asset not found.',
  });
}

export class ResolveAssetReference implements MediaAssetReferenceResolver {
  public constructor(private readonly reader: AssetReader) {}

  public async resolve(input: ResolveMediaAssetReferenceInput): Promise<MediaAssetReference> {
    let id: ResourceId;

    try {
      id = parseResourceId(input.id);
    } catch (cause) {
      throw invalidAssetReferenceId(cause);
    }

    const asset = await this.reader.findById({ id });

    if (!asset || asset.lifecycle !== ASSET_INITIAL_LIFECYCLE) {
      throw assetReferenceNotFound();
    }

    return { id: asset.id, assetType: asset.assetType };
  }
}
