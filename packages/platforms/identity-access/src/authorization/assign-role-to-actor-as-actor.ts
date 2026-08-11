import { ApplicationError } from '@ai-world/foundation-errors';

import { IDENTITY_AUTHORIZATION_MANAGE_PERMISSION_KEY } from './authorization-policy';
import type { AssignRoleToActor } from './assign-role-to-actor';
import type { EvaluatePermission } from './evaluate-permission';

export interface AssignRoleToActorAsActorInput {
  readonly actingActorId: string;
  readonly targetActorId: string;
  readonly roleKey: string;
}

export class AssignRoleToActorAsActor {
  constructor(
    private readonly evaluatePermission: EvaluatePermission,
    private readonly assignRoleToActor: AssignRoleToActor,
  ) {}

  async execute(input: AssignRoleToActorAsActorInput): Promise<void> {
    const evaluation = await this.evaluatePermission.execute({
      actorId: input.actingActorId,
      permissionKey: IDENTITY_AUTHORIZATION_MANAGE_PERMISSION_KEY,
    });

    if (!evaluation.allowed) {
      throw new ApplicationError({
        code: 'identity.authorization.forbidden',
        kind: 'forbidden',
        message:
          'Role assignment was denied because the acting Actor does not have the required Permission.',
        publicMessage: 'You do not have permission to perform this action.',
      });
    }

    await this.assignRoleToActor.execute({
      actorId: input.targetActorId,
      roleKey: input.roleKey,
    });
  }
}
