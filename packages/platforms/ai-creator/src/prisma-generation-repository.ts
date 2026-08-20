import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';

import {
  GENERATION_FAILED_STATUS,
  GENERATION_INITIAL_STATUS,
  GENERATION_SUCCEEDED_STATUS,
  isGenerationStatus,
  type Generation,
  type GenerationSourceContext,
} from './generation';
import type {
  CreateRequestedGenerationInput,
  GenerationWriter,
  MarkGenerationFailedInput,
  MarkGenerationSucceededInput,
} from './generation-writer';

interface PersistedGenerationRequest {
  readonly input: string;
  readonly instructions: string | null;
  readonly createdAt: Date;
}

interface PersistedGenerationResult {
  readonly text: string;
  readonly createdAt: Date;
}

interface PersistedGenerationProvenance {
  readonly task: string;
  readonly sourceContext: unknown;
  readonly createdAt: Date;
}

interface PersistedGeneration {
  readonly id: string;
  readonly actorId: string;
  readonly status: string;
  readonly provider: string;
  readonly model: string | null;
  readonly request: PersistedGenerationRequest | null;
  readonly result: PersistedGenerationResult | null;
  readonly provenance: PersistedGenerationProvenance | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mapSourceContext(value: unknown): GenerationSourceContext | null {
  if (value === null) {
    return null;
  }

  if (!isRecord(value) || typeof value.universeKey !== 'string') {
    throw new TypeError('Persisted Generation provenance has invalid source context.');
  }

  if (!Array.isArray(value.knowledgeResources)) {
    throw new TypeError('Persisted Generation provenance has invalid Knowledge sources.');
  }

  return {
    universeKey: parseNamespacedKey(value.universeKey),
    knowledgeResources: value.knowledgeResources.map((resource) => {
      if (
        !isRecord(resource) ||
        typeof resource.id !== 'string' ||
        typeof resource.resourceType !== 'string' ||
        typeof resource.universeKey !== 'string'
      ) {
        throw new TypeError('Persisted Generation provenance has an invalid Knowledge source.');
      }

      return {
        id: parseResourceId(resource.id),
        resourceType: parseNamespacedKey(resource.resourceType),
        universeKey: parseNamespacedKey(resource.universeKey),
      };
    }),
  };
}

function serializeSourceContext(context: GenerationSourceContext) {
  return {
    universeKey: context.universeKey,
    knowledgeResources: context.knowledgeResources.map((resource) => ({
      id: resource.id,
      resourceType: resource.resourceType,
      universeKey: resource.universeKey,
    })),
  };
}

function mapPersistedGeneration(generation: PersistedGeneration): Generation {
  if (!isGenerationStatus(generation.status)) {
    throw new TypeError(`Persisted Generation has unsupported status: ${generation.status}`);
  }

  if (!generation.request) {
    throw new TypeError(`Persisted Generation is missing its request: ${generation.id}`);
  }

  return {
    id: parseResourceId(generation.id),
    actorId: parseResourceId(generation.actorId),
    status: generation.status,
    provider: generation.provider,
    model: generation.model,
    request: {
      input: generation.request.input,
      ...(generation.request.instructions === null
        ? {}
        : { instructions: generation.request.instructions }),
      createdAt: generation.request.createdAt,
    },
    result: generation.result
      ? {
          text: generation.result.text,
          createdAt: generation.result.createdAt,
        }
      : null,
    provenance: generation.provenance
      ? {
          task: generation.provenance.task,
          sourceContext: mapSourceContext(generation.provenance.sourceContext),
          createdAt: generation.provenance.createdAt,
        }
      : null,
    createdAt: generation.createdAt,
    updatedAt: generation.updatedAt,
  };
}

const generationInclude = {
  request: true,
  result: true,
  provenance: true,
} as const;

export class PrismaGenerationRepository implements GenerationWriter {
  constructor(private readonly database: DatabaseClient) {}

  async createRequested(input: CreateRequestedGenerationInput): Promise<Generation> {
    const generation = await this.database.generation.create({
      data: {
        id: input.id,
        actorId: input.actorId,
        status: GENERATION_INITIAL_STATUS,
        provider: input.provider,
        request: {
          create: {
            input: input.input,
            ...(input.instructions === undefined ? {} : { instructions: input.instructions }),
          },
        },
        provenance: {
          create: {
            task: input.task,
            ...(input.sourceContext === undefined
              ? {}
              : { sourceContext: serializeSourceContext(input.sourceContext) }),
          },
        },
      },
      include: generationInclude,
    });

    return mapPersistedGeneration(generation);
  }

  async markSucceeded(input: MarkGenerationSucceededInput): Promise<Generation | null> {
    const generation = await this.database.$transaction(async (transaction) => {
      const transition = await transaction.generation.updateMany({
        where: {
          id: input.id,
          status: GENERATION_INITIAL_STATUS,
        },
        data: {
          status: GENERATION_SUCCEEDED_STATUS,
          model: input.model,
        },
      });

      if (transition.count !== 1) {
        return null;
      }

      await transaction.generationResult.create({
        data: {
          generationId: input.id,
          text: input.text,
        },
      });

      return transaction.generation.findUnique({
        where: {
          id: input.id,
        },
        include: generationInclude,
      });
    });

    return generation ? mapPersistedGeneration(generation) : null;
  }

  async markFailed(input: MarkGenerationFailedInput): Promise<Generation | null> {
    const generation = await this.database.$transaction(async (transaction) => {
      const transition = await transaction.generation.updateMany({
        where: {
          id: input.id,
          status: GENERATION_INITIAL_STATUS,
        },
        data: {
          status: GENERATION_FAILED_STATUS,
        },
      });

      if (transition.count !== 1) {
        return null;
      }

      return transaction.generation.findUnique({
        where: {
          id: input.id,
        },
        include: generationInclude,
      });
    });

    return generation ? mapPersistedGeneration(generation) : null;
  }
}
