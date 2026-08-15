import { parseNamespacedKey } from '@ai-world/kernel-namespace';

export const ADMINISTRATOR_ROLE_KEY = 'administrator';
export const KNOWLEDGE_EDITOR_ROLE_KEY = 'knowledge-editor';

export const IDENTITY_AUTHORIZATION_MANAGE_PERMISSION_KEY = parseNamespacedKey(
  'identity.authorization.manage',
);
