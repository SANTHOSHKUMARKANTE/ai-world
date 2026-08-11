import {
  ConfirmEmailVerification,
  IssueEmailVerification,
  ValidateSession,
} from '@ai-world/platform-identity-access';
import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { requireSessionToken } from '../session/require-session-token';
import { SessionCookie } from '../session/session-cookie';
import {
  parseEmailVerificationConfirmationRequest,
  parseEmailVerificationIssueRequest,
} from './email-verification-request';

@Controller('email-verification')
export class EmailVerificationController {
  public constructor(
    private readonly validateSession: ValidateSession,
    private readonly issueEmailVerification: IssueEmailVerification,
    private readonly confirmEmailVerification: ConfirmEmailVerification,
    private readonly sessionCookie: SessionCookie,
  ) {}

  @Post('request')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async requestVerification(
    @Headers('cookie') cookieHeader: string | undefined,
    @Body() body: unknown,
  ): Promise<void> {
    const sessionToken = requireSessionToken(this.sessionCookie, cookieHeader);

    const session = await this.validateSession.execute({
      token: sessionToken,
    });

    parseEmailVerificationIssueRequest(body);

    await this.issueEmailVerification.execute({
      actorId: session.actorId,
    });
  }

  @Post('confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async confirmVerification(@Body() body: unknown): Promise<void> {
    const request = parseEmailVerificationConfirmationRequest(body);

    await this.confirmEmailVerification.execute({
      token: request.token,
    });
  }
}
