import { UploadAssetAsActor } from '@ai-world/platform-media';
import { ValidateSession } from '@ai-world/platform-identity-access';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { requireSessionToken } from '../session/require-session-token';
import { SessionCookie } from '../session/session-cookie';

interface RequestWithCookieHeader {
  readonly headers: {
    readonly cookie?: string;
  };
}

@Injectable()
export class MediaUploadPreauthorizationGuard implements CanActivate {
  public constructor(
    private readonly validateSession: ValidateSession,
    private readonly uploadAssetAsActor: UploadAssetAsActor,
    private readonly sessionCookie: SessionCookie,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithCookieHeader>();
    const sessionToken = requireSessionToken(this.sessionCookie, request.headers.cookie);
    const session = await this.validateSession.execute({
      token: sessionToken,
    });

    await this.uploadAssetAsActor.authorize(session.actorId);

    return true;
  }
}
