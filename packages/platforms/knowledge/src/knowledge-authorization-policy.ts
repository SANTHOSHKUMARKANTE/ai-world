import { parseNamespacedKey } from '@ai-world/kernel-namespace';

export const KNOWLEDGE_RESOURCE_CREATE_PERMISSION_KEY = parseNamespacedKey(
  'knowledge.resource.create',
);

export const KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY = parseNamespacedKey(
  'knowledge.resource.update',
);

export const KNOWLEDGE_RESOURCE_PUBLISH_PERMISSION_KEY = parseNamespacedKey(
  'knowledge.resource.publish',
);

export const KNOWLEDGE_RESOURCE_ARCHIVE_PERMISSION_KEY = parseNamespacedKey(
  'knowledge.resource.archive',
);
