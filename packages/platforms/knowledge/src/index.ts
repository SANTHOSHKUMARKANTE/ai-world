export {
  CreateKnowledgeResource,
  type CreateKnowledgeResourceInput,
} from './create-knowledge-resource';

export { GetKnowledgeResource, type GetKnowledgeResourceInput } from './get-knowledge-resource';

export {
  KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
  isKnowledgeResourceLifecycle,
  type KnowledgeResource,
  type KnowledgeResourceLifecycle,
} from './knowledge-resource';

export type {
  FindKnowledgeResourceByIdInput,
  KnowledgeResourceReader,
} from './knowledge-resource-reader';

export type {
  CreateKnowledgeResourceRecordInput,
  KnowledgeResourceWriter,
  UpdateKnowledgeResourceTypeRecordInput,
} from './knowledge-resource-writer';

export {
  UpdateKnowledgeResource,
  type UpdateKnowledgeResourceInput,
} from './update-knowledge-resource';
