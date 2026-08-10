import {
  AuthenticatePassword,
  type AuthenticatePasswordResult,
} from '@ai-world/platform-identity-access';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { parsePasswordAuthenticationRequest } from './password-authentication-request';

@Controller('authentication')
export class PasswordAuthenticationController {
  constructor(private readonly authenticatePassword: AuthenticatePassword) {}

  @Post('password')
  @HttpCode(HttpStatus.OK)
  async authenticate(@Body() body: unknown): Promise<AuthenticatePasswordResult> {
    const request = parsePasswordAuthenticationRequest(body);

    return this.authenticatePassword.execute(request);
  }
}
