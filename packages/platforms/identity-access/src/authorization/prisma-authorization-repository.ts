import type { DatabaseClient } from '@ai-world/foundation-database';

import type {
  PermissionEvaluationReader,
  EvaluateActorPermissionInput,
} from './permission-evaluation-reader';
import type {
  AssignActorRoleInput,
  AssignActorRoleResult,
  RoleAssignmentWriter,
} from './role-assignment-writer';

function hasDatabaseErrorCode(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { readonly code?: unknown }).code === code
  );
}

export class PrismaAuthorizationRepository
  implements RoleAssignmentWriter, PermissionEvaluationReader
{
  constructor(private readonly database: DatabaseClient) {}

  async assign(input: AssignActorRoleInput): Promise<AssignActorRoleResult> {
    const actor = await this.database.actor.findUnique({
      where: {
        id: input.actorId,
      },
      select: {
        id: true,
      },
    });

    if (!actor) {
      return 'actor_not_found';
    }

    const role = await this.database.role.findUnique({
      where: {
        key: input.roleKey,
      },
      select: {
        id: true,
      },
    });

    if (!role) {
      return 'role_not_found';
    }

    try {
      await this.database.actorRole.create({
        data: {
          actorId: actor.id,
          roleId: role.id,
        },
      });

      return 'assigned';
    } catch (error) {
      if (hasDatabaseErrorCode(error, 'P2002')) {
        return 'already_assigned';
      }

      if (hasDatabaseErrorCode(error, 'P2003')) {
        const currentActor = await this.database.actor.findUnique({
          where: {
            id: input.actorId,
          },
          select: {
            id: true,
          },
        });

        if (!currentActor) {
          return 'actor_not_found';
        }

        const currentRole = await this.database.role.findUnique({
          where: {
            key: input.roleKey,
          },
          select: {
            id: true,
          },
        });

        if (!currentRole) {
          return 'role_not_found';
        }
      }

      throw error;
    }
  }

  async hasPermission(input: EvaluateActorPermissionInput): Promise<boolean> {
    const grant = await this.database.rolePermission.findFirst({
      where: {
        permission: {
          key: input.permissionKey,
        },
        role: {
          actorAssignments: {
            some: {
              actorId: input.actorId,
            },
          },
        },
      },
      select: {
        roleId: true,
      },
    });

    return grant !== null;
  }
}
