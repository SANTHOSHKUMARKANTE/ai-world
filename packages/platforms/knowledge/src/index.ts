export {
  CreateKnowledgeResource,
  type CreateKnowledgeResourceInput,
} from './create-knowledge-resource';

export { GetKnowledgeResource, type GetKnowledgeResourceInput } from './get-knowledge-resource';

export {
  GetPublicKnowledgeResource,
  type GetPublicKnowledgeResourceInput,
} from './get-public-knowledge-resource';

export {
  KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE,
  KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
  isKnowledgeResourceLifecycle,
  type KnowledgeResource,
  type KnowledgeResourceLifecycle,
} from './knowledge-resource';

export type {
  FindKnowledgeResourceByIdInput,
  KnowledgeResourceReader,
} from './knowledge-resource-reader';

export type {
  KnowledgeResourceLifecycleWriter,
  TransitionKnowledgeResourceLifecycleRecordInput,
} from './knowledge-resource-lifecycle-writer';

export {
  ListPublicKnowledgeResources,
  PUBLIC_KNOWLEDGE_RESOURCE_DEFAULT_LIMIT,
  PUBLIC_KNOWLEDGE_RESOURCE_MAX_LIMIT,
  type ListPublicKnowledgeResourcesInput,
} from './list-public-knowledge-resources';

export type {
  FindPublishedKnowledgeResourceByIdInput,
  ListPublishedKnowledgeResourcesInput,
  PublicKnowledgeResourceReader,
} from './public-knowledge-resource-reader';

export type {
  CreateKnowledgeResourceRecordInput,
  KnowledgeResourceWriter,
  UpdateKnowledgeResourceTypeRecordInput,
} from './knowledge-resource-writer';

export {
  UpdateKnowledgeResource,
  type UpdateKnowledgeResourceInput,
} from './update-knowledge-resource';

export {
  CreateKnowledgeResourceAsActor,
  type CreateKnowledgeResourceAsActorInput,
} from './create-knowledge-resource-as-actor';

export {
  KNOWLEDGE_RESOURCE_ARCHIVE_PERMISSION_KEY,
  KNOWLEDGE_RESOURCE_CREATE_PERMISSION_KEY,
  KNOWLEDGE_RESOURCE_PUBLISH_PERMISSION_KEY,
  KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY,
} from './knowledge-authorization-policy';

export {
  UpdateKnowledgeResourceAsActor,
  type UpdateKnowledgeResourceAsActorInput,
} from './update-knowledge-resource-as-actor';

export {
  ArchiveKnowledgeResource,
  type ArchiveKnowledgeResourceInput,
} from './archive-knowledge-resource';

export {
  ArchiveKnowledgeResourceAsActor,
  type ArchiveKnowledgeResourceAsActorInput,
} from './archive-knowledge-resource-as-actor';

export {
  PublishKnowledgeResource,
  type PublishKnowledgeResourceInput,
} from './publish-knowledge-resource';

export {
  PublishKnowledgeResourceAsActor,
  type PublishKnowledgeResourceAsActorInput,
} from './publish-knowledge-resource-as-actor';

export type {
  KnowledgeResourceAssetReferenceStore,
  ListKnowledgeResourceAssetIdsInput,
  ReplaceKnowledgeResourceAssetIdsInput,
} from './knowledge-resource-asset-reference-store';

export {
  ListPublicKnowledgeResourceAssets,
  type ListPublicKnowledgeResourceAssetsInput,
} from './list-public-knowledge-resource-assets';

export {
  SetKnowledgeResourceAssets,
  type SetKnowledgeResourceAssetsInput,
} from './set-knowledge-resource-assets';

export {
  SetKnowledgeResourceAssetsAsActor,
  type SetKnowledgeResourceAssetsAsActorInput,
} from './set-knowledge-resource-assets-as-actor';

export {
  ConfigureKnowledgeEntity,
  type ConfigureKnowledgeEntityFactInput,
  type ConfigureKnowledgeEntityInput,
  type ConfigureKnowledgeEntityRelationInput,
} from './configure-knowledge-entity';

export {
  ConfigureKnowledgeEntityAsActor,
  type ConfigureKnowledgeEntityAsActorInput,
} from './configure-knowledge-entity-as-actor';

export {
  GetPublicKnowledgeEntity,
  type GetPublicKnowledgeEntityInput,
} from './get-public-knowledge-entity';

export type {
  KnowledgeEntityFact,
  KnowledgeEntityProfile,
  KnowledgeEntityRelation,
  KnowledgeEntityRelationTarget,
  PublicKnowledgeEntity,
} from './knowledge-entity';

export type {
  FindKnowledgeEntityRouteOwnerInput,
  FindPublishedKnowledgeEntityByRouteKeyInput,
  KnowledgeEntityRelationRecordInput,
  KnowledgeEntityStore,
  ReplaceKnowledgeEntityConfigurationInput,
} from './knowledge-entity-store';
