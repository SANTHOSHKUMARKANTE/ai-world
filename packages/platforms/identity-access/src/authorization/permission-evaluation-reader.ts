export interface EvaluateActorPermissionInput {
  readonly actorId: string;
  readonly permissionKey: string;
}

export interface PermissionEvaluationReader {
  hasPermission(input: EvaluateActorPermissionInput): Promise<boolean>;
}
