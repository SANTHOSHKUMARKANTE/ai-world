import { ApplicationError } from '@ai-world/foundation-errors';
import { LogoutSession, ValidateSession } from '@ai-world/platform-identity-access';
import { Controller, Delete, Get, Headers, HttpCode, HttpStatus, Res } from '@nestjs/common';

import { SessionCookie } from './session-cookie';

interface CookieResponse {
  setHeader(name: string, value: string | readonly string[]): void;
}

export interface SessionResponse {
  readonly actorId: string;
  readonly expiresAt: string;
}

function requireSessionToken(
  sessionCookie: SessionCookie,
  cookieHeader: string | undefined,
): string {
  const token = sessionCookie.read(cookieHeader);

  if (!token) {
    throw new ApplicationError({
      code: 'identity.session.invalid',
      kind: 'unauthenticated',
      message: 'Session validation failed because no Session cookie was supplied.',
      publicMessage: 'Authentication is required.',
    });
  }

  return token;
}

@Controller('session')
export class SessionController {
  constructor(
    private readonly validateSession: ValidateSession,
    private readonly logoutSession: LogoutSession,
    private readonly sessionCookie: SessionCookie,
  ) {}

  @Get()
  async getSession(@Headers('cookie') cookieHeader: string | undefined): Promise<SessionResponse> {
    const token = requireSessionToken(this.sessionCookie, cookieHeader);

    const session = await this.validateSession.execute({
      token,
    });

    return {
      actorId: session.actorId,
      expiresAt: session.expiresAt.toISOString(),
    };
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSession(
    @Headers('cookie') cookieHeader: string | undefined,
    @Res({ passthrough: true }) response: CookieResponse,
  ): Promise<void> {
    const token = this.sessionCookie.read(cookieHeader);

    if (token) {
      await this.logoutSession.execute({
        token,
      });
    }

    this.sessionCookie.clear(response);
  }
}
