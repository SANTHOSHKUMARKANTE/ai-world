import { parseNamespacedKey } from '@ai-world/kernel-namespace';

export const IDENTITY_AUTHORIZATION_ROLE_ASSIGNMENT_DECISION_AUDIT_ACTION = parseNamespacedKey(
  'identity.authorization.role-assignment.decision',
);

export const IDENTITY_ACTOR_AUDIT_RESOURCE_TYPE = parseNamespacedKey('identity.actor');

export const IDENTITY_AUTHORIZATION_ALLOWED_AUDIT_RESULT = parseNamespacedKey(
  'identity.authorization.allowed',
);

export const IDENTITY_AUTHORIZATION_DENIED_AUDIT_RESULT = parseNamespacedKey(
  'identity.authorization.denied',
);
