import type { NamespacedKey } from '@ai-world/kernel-namespace';

import type { PermissionEvaluationReader } from './permission-evaluation-reader';

export interface EvaluatePermissionInput {
  readonly actorId: string;
  readonly permissionKey: NamespacedKey;
}

export interface EvaluatePermissionResult {
  readonly allowed: boolean;
}

export class EvaluatePermission {
  constructor(private readonly reader: PermissionEvaluationReader) {}

  async execute(input: EvaluatePermissionInput): Promise<EvaluatePermissionResult> {
    const allowed = await this.reader.hasPermission({
      actorId: input.actorId,
      permissionKey: input.permissionKey,
    });

    return {
      allowed,
    };
  }
}
