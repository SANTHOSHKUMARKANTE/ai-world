import { RegisterUser, type RegisterUserResult } from '@ai-world/platform-identity-access';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { parseRegistrationRequest } from './registration-request';

@Controller('registration')
export class RegistrationController {
  constructor(private readonly registerUser: RegisterUser) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: unknown): Promise<RegisterUserResult> {
    const request = parseRegistrationRequest(body);

    return this.registerUser.execute(request);
  }
}
