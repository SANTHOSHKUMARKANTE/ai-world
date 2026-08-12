import type { NamespacedKey } from '@ai-world/kernel-namespace';

export interface EvaluateActorPermissionInput {
  readonly actorId: string;
  readonly permissionKey: NamespacedKey;
}

export interface PermissionEvaluationReader {
  hasPermission(input: EvaluateActorPermissionInput): Promise<boolean>;
}
