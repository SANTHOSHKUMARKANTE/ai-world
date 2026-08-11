import { AssignRoleToActorAsActor, ValidateSession } from '@ai-world/platform-identity-access';
import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { requireSessionToken } from '../session/require-session-token';
import { SessionCookie } from '../session/session-cookie';
import { parseAuthorizationRoleAssignmentRequest } from './authorization-request';

@Controller('authorization')
export class AuthorizationController {
  public constructor(
    private readonly validateSession: ValidateSession,
    private readonly assignRoleToActorAsActor: AssignRoleToActorAsActor,
    private readonly sessionCookie: SessionCookie,
  ) {}

  @Post('role-assignments')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async assignRole(
    @Headers('cookie') cookieHeader: string | undefined,
    @Body() body: unknown,
  ): Promise<void> {
    const sessionToken = requireSessionToken(this.sessionCookie, cookieHeader);

    const session = await this.validateSession.execute({
      token: sessionToken,
    });

    const request = parseAuthorizationRoleAssignmentRequest(body);

    await this.assignRoleToActorAsActor.execute({
      actingActorId: session.actorId,
      targetActorId: request.targetActorId,
      roleKey: request.roleKey,
    });
  }
}
