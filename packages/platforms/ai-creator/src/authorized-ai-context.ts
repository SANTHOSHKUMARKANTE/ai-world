import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';

export const AUTHORIZED_AI_CONTEXT_DEFAULT_LIMIT = 5;
export const AUTHORIZED_AI_CONTEXT_MAX_LIMIT = 10;

export interface AuthorizedAiKnowledgeResourceContext {
  readonly id: ResourceId;
  readonly resourceType: NamespacedKey;
  readonly universeKey: NamespacedKey;
}

export interface AuthorizedAiContext {
  readonly actorId: ResourceId;
  readonly userDisplayName: string | null;
  readonly universeKey: NamespacedKey;
  readonly knowledgeResources: readonly AuthorizedAiKnowledgeResourceContext[];
}

export interface ResolveAuthorizedAiContextInput {
  readonly actorId: ResourceId;
  readonly universeKey: NamespacedKey;
  readonly query: string;
  readonly resourceTypes?: readonly NamespacedKey[];
  readonly limit?: number;
}

export interface AuthorizedAiContextPort {
  resolve(input: ResolveAuthorizedAiContextInput): Promise<AuthorizedAiContext>;
}
