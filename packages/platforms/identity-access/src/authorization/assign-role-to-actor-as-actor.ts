import { ApplicationError } from '@ai-world/foundation-errors';
import type { AuditRecorder } from '@ai-world/kernel-audit';

import {
  IDENTITY_ACTOR_AUDIT_RESOURCE_TYPE,
  IDENTITY_AUTHORIZATION_ALLOWED_AUDIT_RESULT,
  IDENTITY_AUTHORIZATION_DENIED_AUDIT_RESULT,
  IDENTITY_AUTHORIZATION_ROLE_ASSIGNMENT_DECISION_AUDIT_ACTION,
} from './authorization-audit-policy';
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
    private readonly auditRecorder: AuditRecorder,
  ) {}

  async execute(input: AssignRoleToActorAsActorInput): Promise<void> {
    const evaluation = await this.evaluatePermission.execute({
      actorId: input.actingActorId,
      permissionKey: IDENTITY_AUTHORIZATION_MANAGE_PERMISSION_KEY,
    });

    if (!evaluation.allowed) {
      await this.auditRecorder.record({
        actorId: input.actingActorId,
        action: IDENTITY_AUTHORIZATION_ROLE_ASSIGNMENT_DECISION_AUDIT_ACTION,
        resource: {
          type: IDENTITY_ACTOR_AUDIT_RESOURCE_TYPE,
          id: input.targetActorId,
        },
        result: IDENTITY_AUTHORIZATION_DENIED_AUDIT_RESULT,
        context: {
          roleKey: input.roleKey,
        },
      });

      throw new ApplicationError({
        code: 'identity.authorization.forbidden',
        kind: 'forbidden',
        message:
          'Role assignment was denied because the acting Actor does not have the required Permission.',
        publicMessage: 'You do not have permission to perform this action.',
      });
    }

    await this.auditRecorder.record({
      actorId: input.actingActorId,
      action: IDENTITY_AUTHORIZATION_ROLE_ASSIGNMENT_DECISION_AUDIT_ACTION,
      resource: {
        type: IDENTITY_ACTOR_AUDIT_RESOURCE_TYPE,
        id: input.targetActorId,
      },
      result: IDENTITY_AUTHORIZATION_ALLOWED_AUDIT_RESULT,
      context: {
        roleKey: input.roleKey,
      },
    });

    await this.assignRoleToActor.execute({
      actorId: input.targetActorId,
      roleKey: input.roleKey,
    });
  }
}
