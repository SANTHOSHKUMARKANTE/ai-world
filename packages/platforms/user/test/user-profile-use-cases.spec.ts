import { ApplicationError } from '@ai-world/foundation-errors';
import { describe, expect, it } from 'vitest';

import {
  GetUserProfile,
  type GetUserProfileByActorIdInput,
  type UpdateUserProfileByActorIdInput,
  UpdateUserProfile,
  type User,
  type UserProfileReader,
  type UserProfileWriter,
} from '../src';

const existingUser: User = {
  id: '11111111-1111-4111-8111-111111111111',
  actorId: '22222222-2222-4222-8222-222222222222',
  displayName: 'Ada Lovelace',
  createdAt: new Date('2026-08-11T00:00:00.000Z'),
  updatedAt: new Date('2026-08-11T00:00:00.000Z'),
};

class StubUserProfileReader implements UserProfileReader {
  readonly calls: GetUserProfileByActorIdInput[] = [];

  constructor(private readonly result: User | null) {}

  async findByActorId(input: GetUserProfileByActorIdInput): Promise<User | null> {
    this.calls.push(input);

    return this.result;
  }
}

class StubUserProfileWriter implements UserProfileWriter {
  readonly calls: UpdateUserProfileByActorIdInput[] = [];

  constructor(private readonly result: User | null) {}

  async updateByActorId(input: UpdateUserProfileByActorIdInput): Promise<User | null> {
    this.calls.push(input);

    return this.result;
  }
}

describe('GetUserProfile', () => {
  it('returns the User profile belonging to the supplied Actor', async () => {
    const reader = new StubUserProfileReader(existingUser);

    const getUserProfile = new GetUserProfile(reader);

    await expect(
      getUserProfile.execute({
        actorId: existingUser.actorId,
      }),
    ).resolves.toEqual(existingUser);

    expect(reader.calls).toEqual([
      {
        actorId: existingUser.actorId,
      },
    ]);
  });

  it('throws the canonical not-found error when the Actor has no User profile', async () => {
    const reader = new StubUserProfileReader(null);

    const getUserProfile = new GetUserProfile(reader);

    await expect(
      getUserProfile.execute({
        actorId: existingUser.actorId,
      }),
    ).rejects.toMatchObject({
      code: 'user.profile.not_found',
      kind: 'not_found',
      publicMessage: 'User profile not found.',
    });
  });
});

describe('UpdateUserProfile', () => {
  it('normalizes the display name before writing the User profile', async () => {
    const updatedUser: User = {
      ...existingUser,
      displayName: 'José   Lovelace',
      updatedAt: new Date('2026-08-11T01:00:00.000Z'),
    };

    const writer = new StubUserProfileWriter(updatedUser);

    const updateUserProfile = new UpdateUserProfile(writer);

    const decomposedDisplayName = '  Jose\u0301   Lovelace  ';

    await expect(
      updateUserProfile.execute({
        actorId: existingUser.actorId,
        displayName: decomposedDisplayName,
      }),
    ).resolves.toEqual(updatedUser);

    expect(writer.calls).toEqual([
      {
        actorId: existingUser.actorId,
        displayName: 'José   Lovelace',
      },
    ]);
  });

  it('allows the display name to be cleared explicitly', async () => {
    const updatedUser: User = {
      ...existingUser,
      displayName: null,
      updatedAt: new Date('2026-08-11T01:00:00.000Z'),
    };

    const writer = new StubUserProfileWriter(updatedUser);

    const updateUserProfile = new UpdateUserProfile(writer);

    await expect(
      updateUserProfile.execute({
        actorId: existingUser.actorId,
        displayName: null,
      }),
    ).resolves.toEqual(updatedUser);

    expect(writer.calls).toEqual([
      {
        actorId: existingUser.actorId,
        displayName: null,
      },
    ]);
  });

  it('rejects an invalid display name before calling the writer', async () => {
    const writer = new StubUserProfileWriter(existingUser);

    const updateUserProfile = new UpdateUserProfile(writer);

    await expect(
      updateUserProfile.execute({
        actorId: existingUser.actorId,
        displayName: '   ',
      }),
    ).rejects.toMatchObject({
      code: 'user.profile.invalid_display_name',
      kind: 'validation',
    });

    expect(writer.calls).toHaveLength(0);
  });

  it('throws the canonical not-found error when the Actor has no User profile', async () => {
    const writer = new StubUserProfileWriter(null);

    const updateUserProfile = new UpdateUserProfile(writer);

    await expect(
      updateUserProfile.execute({
        actorId: existingUser.actorId,
        displayName: 'Grace Hopper',
      }),
    ).rejects.toMatchObject({
      code: 'user.profile.not_found',
      kind: 'not_found',
      publicMessage: 'User profile not found.',
    });

    expect(writer.calls).toEqual([
      {
        actorId: existingUser.actorId,
        displayName: 'Grace Hopper',
      },
    ]);
  });

  it('exposes profile-not-found as an ApplicationError', async () => {
    const writer = new StubUserProfileWriter(null);

    const updateUserProfile = new UpdateUserProfile(writer);

    try {
      await updateUserProfile.execute({
        actorId: existingUser.actorId,
        displayName: 'Ada',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ApplicationError);

      expect(error).toMatchObject({
        code: 'user.profile.not_found',
        kind: 'not_found',
      });

      return;
    }

    throw new Error('Expected User profile update to fail.');
  });
});
