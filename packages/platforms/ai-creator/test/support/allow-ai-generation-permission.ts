import type { PermissionEvaluationReader } from '@ai-world/platform-identity-access';

export const allowAiGenerationPermission: PermissionEvaluationReader = {
  async hasPermission() {
    return true;
  },
};
