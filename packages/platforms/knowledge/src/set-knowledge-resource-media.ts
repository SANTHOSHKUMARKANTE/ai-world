import { ApplicationError } from '@ai-world/foundation-errors';
import type { ResourceId } from '@ai-world/kernel-identifiers';
import {
  ASSET_IMAGE_TYPE,
  ASSET_VIDEO_TYPE,
  MEDIA_SHORT_VIDEO_MAX_DURATION_MS,
  type MediaAssetReferenceResolver,
} from '@ai-world/platform-media';

import type { KnowledgeResourceAssetReferenceStore } from './knowledge-resource-asset-reference-store';
import {
  isKnowledgeResourceMediaPlayback,
  isKnowledgeResourceMediaRole,
  KNOWLEDGE_MEDIA_HERO_ROLE,
  KNOWLEDGE_MEDIA_SHORT_LOOP_PLAYBACK,
  KNOWLEDGE_MEDIA_STILL_PLAYBACK,
  type KnowledgeResourceMediaPlacement,
} from './knowledge-resource-media-placement';
import type { KnowledgeResourceReader } from './knowledge-resource-reader';

export interface SetKnowledgeResourceMediaPlacementInput {
  readonly assetId: string;
  readonly role: string;
  readonly playback: string;
  readonly altText: string;
  readonly caption?: string | null;
  readonly posterAssetId?: string | null;
}

export interface SetKnowledgeResourceMediaInput {
  readonly id: ResourceId;
  readonly placements: readonly SetKnowledgeResourceMediaPlacementInput[];
}

const ALT_TEXT_MAX_LENGTH = 300;
const CAPTION_MAX_LENGTH = 600;

function knowledgeResourceNotFound(): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.resource.not_found',
    kind: 'not_found',
    message: 'No Knowledge Resource exists for the supplied Resource ID.',
    publicMessage: 'Knowledge Resource not found.',
  });
}

function invalidPlacement(message: string): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.resource.media.invalid_placement',
    kind: 'validation',
    message,
    publicMessage: 'The Knowledge Resource media placement is invalid.',
  });
}

function duplicateAssetReference(): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.resource.media.duplicate_asset',
    kind: 'validation',
    message: 'A Knowledge Resource media placement set contains a duplicate primary Asset.',
    publicMessage: 'Each Media Asset may be placed at most once.',
  });
}

function multipleHeroes(): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.resource.media.multiple_hero',
    kind: 'validation',
    message: 'A Knowledge Resource may have at most one HERO media placement.',
    publicMessage: 'Only one Media Asset may be the hero.',
  });
}

function normalizeAltText(value: string): string {
  const normalized = value.trim();
  if (normalized.length === 0 || normalized.length > ALT_TEXT_MAX_LENGTH) {
    throw invalidPlacement(
      `New Knowledge media placements require alt text between 1 and ${ALT_TEXT_MAX_LENGTH} characters.`,
    );
  }
  return normalized;
}

function normalizeCaption(value: string | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = value.trim();
  if (normalized.length === 0) {
    return null;
  }
  if (normalized.length > CAPTION_MAX_LENGTH) {
    throw invalidPlacement(
      `Knowledge media placement captions must not exceed ${CAPTION_MAX_LENGTH} characters.`,
    );
  }
  return normalized;
}

export class SetKnowledgeResourceMedia {
  public constructor(
    private readonly resources: KnowledgeResourceReader,
    private readonly references: KnowledgeResourceAssetReferenceStore,
    private readonly mediaAssetReferences: MediaAssetReferenceResolver,
  ) {}

  public async execute(
    input: SetKnowledgeResourceMediaInput,
  ): Promise<readonly KnowledgeResourceMediaPlacement[]> {
    const resource = await this.resources.findById({ id: input.id });
    if (!resource) {
      throw knowledgeResourceNotFound();
    }

    const validatedPlacements = input.placements.map((placement) => {
      if (!isKnowledgeResourceMediaRole(placement.role)) {
        throw invalidPlacement(`Unsupported Knowledge media role: ${placement.role}`);
      }
      if (!isKnowledgeResourceMediaPlayback(placement.playback)) {
        throw invalidPlacement(`Unsupported Knowledge media playback: ${placement.playback}`);
      }

      return {
        ...placement,
        role: placement.role,
        playback: placement.playback,
        altText: normalizeAltText(placement.altText),
        caption: normalizeCaption(placement.caption),
      };
    });

    if (
      validatedPlacements.filter((placement) => placement.role === KNOWLEDGE_MEDIA_HERO_ROLE)
        .length > 1
    ) {
      throw multipleHeroes();
    }

    const resolvedPrimaryAssetIds = new Set<ResourceId>();
    const placements: KnowledgeResourceMediaPlacement[] = [];

    for (const [position, inputPlacement] of validatedPlacements.entries()) {
      const reference = await this.mediaAssetReferences.resolve({ id: inputPlacement.assetId });

      if (resolvedPrimaryAssetIds.has(reference.id)) {
        throw duplicateAssetReference();
      }
      resolvedPrimaryAssetIds.add(reference.id);

      const posterInput =
        inputPlacement.posterAssetId === undefined || inputPlacement.posterAssetId === null
          ? null
          : inputPlacement.posterAssetId;

      let posterAssetId: ResourceId | null = null;

      if (reference.assetType === ASSET_IMAGE_TYPE) {
        if (inputPlacement.playback !== KNOWLEDGE_MEDIA_STILL_PLAYBACK) {
          throw invalidPlacement('IMAGE media placements require STILL playback.');
        }
        if (posterInput !== null) {
          throw invalidPlacement('STILL media placements must not define a poster Asset.');
        }
      } else if (reference.assetType === ASSET_VIDEO_TYPE) {
        if (inputPlacement.playback !== KNOWLEDGE_MEDIA_SHORT_LOOP_PLAYBACK) {
          throw invalidPlacement('VIDEO media placements require SHORT_LOOP playback.');
        }
        if (
          reference.durationMs === undefined ||
          !Number.isInteger(reference.durationMs) ||
          reference.durationMs <= 0 ||
          reference.durationMs > MEDIA_SHORT_VIDEO_MAX_DURATION_MS
        ) {
          throw invalidPlacement(
            `VIDEO SHORT_LOOP placements require duration metadata between 1 and ${MEDIA_SHORT_VIDEO_MAX_DURATION_MS} milliseconds.`,
          );
        }
        if (posterInput === null) {
          throw invalidPlacement('SHORT_LOOP media placements require an IMAGE poster Asset.');
        }

        const poster = await this.mediaAssetReferences.resolve({ id: posterInput });
        if (poster.assetType !== ASSET_IMAGE_TYPE) {
          throw invalidPlacement('SHORT_LOOP poster Assets must be IMAGE Assets.');
        }
        posterAssetId = poster.id;
      } else {
        throw invalidPlacement(
          `Asset Type ${reference.assetType} is not eligible for an Entity media placement in UXP-01B.`,
        );
      }

      placements.push({
        assetId: reference.id,
        role: inputPlacement.role,
        playback: inputPlacement.playback,
        position,
        altText: inputPlacement.altText,
        caption: inputPlacement.caption,
        posterAssetId,
      });
    }

    return this.references.replaceMediaPlacements({
      knowledgeResourceId: resource.id,
      placements,
    });
  }
}
