import { ValidateSession } from '@ai-world/platform-identity-access';
import { GetUserProfile, type User, UpdateUserProfile } from '@ai-world/platform-user';
import { Body, Controller, Get, Headers, Patch } from '@nestjs/common';

import { requireSessionToken } from '../session/require-session-token';
import { SessionCookie } from '../session/session-cookie';
import { parseUserProfileUpdateRequest } from './user-profile-request';

export interface UserProfileResponse {
  readonly userId: string;
  readonly displayName: string | null;
}

function toUserProfileResponse(user: User): UserProfileResponse {
  return {
    userId: user.id,
    displayName: user.displayName,
  };
}

@Controller('user-profile')
export class UserProfileController {
  public constructor(
    private readonly validateSession: ValidateSession,
    private readonly getUserProfile: GetUserProfile,
    private readonly updateUserProfile: UpdateUserProfile,
    private readonly sessionCookie: SessionCookie,
  ) {}

  @Get()
  public async getProfile(
    @Headers('cookie') cookieHeader: string | undefined,
  ): Promise<UserProfileResponse> {
    const sessionToken = requireSessionToken(this.sessionCookie, cookieHeader);

    const session = await this.validateSession.execute({
      token: sessionToken,
    });

    const user = await this.getUserProfile.execute({
      actorId: session.actorId,
    });

    return toUserProfileResponse(user);
  }

  @Patch()
  public async updateProfile(
    @Headers('cookie') cookieHeader: string | undefined,
    @Body() body: unknown,
  ): Promise<UserProfileResponse> {
    const sessionToken = requireSessionToken(this.sessionCookie, cookieHeader);

    const session = await this.validateSession.execute({
      token: sessionToken,
    });

    const request = parseUserProfileUpdateRequest(body);

    const user = await this.updateUserProfile.execute({
      actorId: session.actorId,
      displayName: request.displayName,
    });

    return toUserProfileResponse(user);
  }
}
