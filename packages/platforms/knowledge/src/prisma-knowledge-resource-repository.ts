import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';

import { isKnowledgeResourceLifecycle, type KnowledgeResource } from './knowledge-resource';
import type {
  KnowledgeResourceLifecycleWriter,
  TransitionKnowledgeResourceLifecycleRecordInput,
} from './knowledge-resource-lifecycle-writer';
import type {
  FindKnowledgeResourceByIdInput,
  KnowledgeResourceReader,
} from './knowledge-resource-reader';
import type {
  CreateKnowledgeResourceRecordInput,
  KnowledgeResourceWriter,
  UpdateKnowledgeResourceTypeRecordInput,
} from './knowledge-resource-writer';

interface PersistedKnowledgeResource {
  readonly id: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly lifecycle: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

function mapPersistedKnowledgeResource(resource: PersistedKnowledgeResource): KnowledgeResource {
  if (!isKnowledgeResourceLifecycle(resource.lifecycle)) {
    throw new TypeError(
      `Persisted Knowledge Resource has unsupported lifecycle: ${resource.lifecycle}`,
    );
  }

  return {
    id: parseResourceId(resource.id),
    universeKey: parseNamespacedKey(resource.universeKey),
    resourceType: parseNamespacedKey(resource.resourceType),
    lifecycle: resource.lifecycle,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
  };
}

export class PrismaKnowledgeResourceRepository
  implements KnowledgeResourceReader, KnowledgeResourceWriter, KnowledgeResourceLifecycleWriter
{
  constructor(private readonly database: DatabaseClient) {}

  async findById(input: FindKnowledgeResourceByIdInput): Promise<KnowledgeResource | null> {
    const resource = await this.database.knowledgeResource.findUnique({
      where: {
        id: input.id,
      },
    });

    return resource ? mapPersistedKnowledgeResource(resource) : null;
  }

  async create(input: CreateKnowledgeResourceRecordInput): Promise<KnowledgeResource> {
    const resource = await this.database.knowledgeResource.create({
      data: {
        id: input.id,
        universeKey: input.universeKey,
        resourceType: input.resourceType,
        lifecycle: input.lifecycle,
      },
    });

    return mapPersistedKnowledgeResource(resource);
  }

  async updateResourceType(
    input: UpdateKnowledgeResourceTypeRecordInput,
  ): Promise<KnowledgeResource | null> {
    const result = await this.database.knowledgeResource.updateMany({
      where: {
        id: input.id,
      },
      data: {
        resourceType: input.resourceType,
      },
    });

    if (result.count !== 1) {
      return null;
    }

    return this.findById({ id: input.id });
  }

  async transitionLifecycle(
    input: TransitionKnowledgeResourceLifecycleRecordInput,
  ): Promise<KnowledgeResource | null> {
    const result = await this.database.knowledgeResource.updateMany({
      where: {
        id: input.id,
        lifecycle: input.fromLifecycle,
      },
      data: {
        lifecycle: input.toLifecycle,
      },
    });

    if (result.count !== 1) {
      return null;
    }

    return this.findById({ id: input.id });
  }
}
