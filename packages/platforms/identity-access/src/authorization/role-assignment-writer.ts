export interface AssignActorRoleInput {
  readonly actorId: string;
  readonly roleKey: string;
}

export type AssignActorRoleResult =
  'assigned' | 'already_assigned' | 'actor_not_found' | 'role_not_found';

export interface RoleAssignmentWriter {
  assign(input: AssignActorRoleInput): Promise<AssignActorRoleResult>;
}
