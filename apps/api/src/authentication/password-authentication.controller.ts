import { SignInWithPassword } from '@ai-world/platform-identity-access';
import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';

import { SessionCookie } from '../session/session-cookie';
import { parsePasswordAuthenticationRequest } from './password-authentication-request';

interface CookieResponse {
  setHeader(name: string, value: string | readonly string[]): void;
}

export interface PasswordAuthenticationResponse {
  readonly actorId: string;
}

@Controller('authentication')
export class PasswordAuthenticationController {
  constructor(
    private readonly signInWithPassword: SignInWithPassword,
    private readonly sessionCookie: SessionCookie,
  ) {}

  @Post('password')
  @HttpCode(HttpStatus.OK)
  async authenticate(
    @Body() body: unknown,
    @Res({ passthrough: true }) response: CookieResponse,
  ): Promise<PasswordAuthenticationResponse> {
    const request = parsePasswordAuthenticationRequest(body);

    const result = await this.signInWithPassword.execute(request);

    this.sessionCookie.set(response, result.token, result.expiresAt);

    return {
      actorId: result.actorId,
    };
  }
}
