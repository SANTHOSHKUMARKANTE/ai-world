import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseResourceId } from '@ai-world/kernel-identifiers';

import {
  GENERATION_FAILED_STATUS,
  GENERATION_INITIAL_STATUS,
  GENERATION_SUCCEEDED_STATUS,
  isGenerationStatus,
  type Generation,
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

interface PersistedGeneration {
  readonly id: string;
  readonly actorId: string;
  readonly status: string;
  readonly provider: string;
  readonly model: string | null;
  readonly request: PersistedGenerationRequest | null;
  readonly result: PersistedGenerationResult | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
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
    createdAt: generation.createdAt,
    updatedAt: generation.updatedAt,
  };
}

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
      },
      include: {
        request: true,
        result: true,
      },
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
        include: {
          request: true,
          result: true,
        },
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
        include: {
          request: true,
          result: true,
        },
      });
    });

    return generation ? mapPersistedGeneration(generation) : null;
  }
}
