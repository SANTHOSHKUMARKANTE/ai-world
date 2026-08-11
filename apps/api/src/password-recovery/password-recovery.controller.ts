import {
  IssuePasswordRecovery,
  ResetPasswordWithRecovery,
} from '@ai-world/platform-identity-access';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import {
  parsePasswordRecoveryIssueRequest,
  parsePasswordRecoveryResetRequest,
} from './password-recovery-request';

@Controller('password-recovery')
export class PasswordRecoveryController {
  public constructor(
    private readonly issuePasswordRecovery: IssuePasswordRecovery,
    private readonly resetPasswordWithRecovery: ResetPasswordWithRecovery,
  ) {}

  @Post('request')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async requestRecovery(@Body() body: unknown): Promise<void> {
    const request = parsePasswordRecoveryIssueRequest(body);

    await this.issuePasswordRecovery.execute({
      email: request.email,
    });
  }

  @Post('reset')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async resetPassword(@Body() body: unknown): Promise<void> {
    const request = parsePasswordRecoveryResetRequest(body);

    await this.resetPasswordWithRecovery.execute({
      token: request.token,
      password: request.password,
    });
  }
}
