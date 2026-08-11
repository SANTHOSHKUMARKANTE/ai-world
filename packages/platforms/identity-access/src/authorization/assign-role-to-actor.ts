import { ApplicationError } from '@ai-world/foundation-errors';

import type { RoleAssignmentWriter } from './role-assignment-writer';

export interface AssignRoleToActorInput {
  readonly actorId: string;
  readonly roleKey: string;
}

export class AssignRoleToActor {
  constructor(private readonly writer: RoleAssignmentWriter) {}

  async execute(input: AssignRoleToActorInput): Promise<void> {
    const result = await this.writer.assign({
      actorId: input.actorId,
      roleKey: input.roleKey,
    });

    switch (result) {
      case 'assigned':
      case 'already_assigned':
        return;

      case 'actor_not_found':
        throw new ApplicationError({
          code: 'identity.authorization.actor_not_found',
          kind: 'not_found',
          message: 'Role assignment failed because the Actor does not exist.',
          publicMessage: 'Actor not found.',
        });

      case 'role_not_found':
        throw new ApplicationError({
          code: 'identity.authorization.role_not_found',
          kind: 'not_found',
          message: 'Role assignment failed because the Role does not exist.',
          publicMessage: 'Role not found.',
        });
    }
  }
}
