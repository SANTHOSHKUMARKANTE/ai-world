import { ApplicationError } from '@ai-world/foundation-errors';
import {
  EvaluatePermission,
  type EvaluateActorPermissionInput,
  type PermissionEvaluationReader,
} from '@ai-world/platform-identity-access';
import { describe, expect, it } from 'vitest';

import {
  AuthorizeCompositionArchival,
  AuthorizeCompositionEditing,
  AuthorizeCompositionPreview,
  AuthorizeCompositionPublishing,
  COMPOSITION_ARCHIVE_PERMISSION_KEY,
  COMPOSITION_EDIT_PERMISSION_KEY,
  COMPOSITION_PREVIEW_PERMISSION_KEY,
  COMPOSITION_PUBLISH_PERMISSION_KEY,
} from '../src';

class RecordingPermissionReader implements PermissionEvaluationReader {
  readonly inputs: EvaluateActorPermissionInput[] = [];

  constructor(private readonly allowed: boolean) {}

  async hasPermission(input: EvaluateActorPermissionInput): Promise<boolean> {
    this.inputs.push(input);
    return this.allowed;
  }
}

describe('Composition editing authorization', () => {
  it('allows an Actor with the canonical Composition editing Permission', async () => {
    const permissions = new RecordingPermissionReader(true);
    const authorize = new AuthorizeCompositionEditing(new EvaluatePermission(permissions));

    await expect(authorize.execute({ actingActorId: 'actor-editor' })).resolves.toBeUndefined();
    expect(permissions.inputs).toEqual([
      {
        actorId: 'actor-editor',
        permissionKey: COMPOSITION_EDIT_PERMISSION_KEY,
      },
    ]);
  });

  it('denies before any Composition operation when the Permission is absent', async () => {
    const permissions = new RecordingPermissionReader(false);
    const authorize = new AuthorizeCompositionEditing(new EvaluatePermission(permissions));

    const result = authorize.execute({ actingActorId: 'actor-ordinary' });

    await expect(result).rejects.toBeInstanceOf(ApplicationError);
    await expect(result).rejects.toMatchObject({
      code: 'composition.authorization.forbidden',
      kind: 'forbidden',
      publicMessage: 'You do not have permission to perform this action.',
    });
  });
});

describe('Composition publication authorization', () => {
  it('uses distinct publish and archive Permissions', async () => {
    const publishPermissions = new RecordingPermissionReader(true);
    const archivePermissions = new RecordingPermissionReader(true);

    await new AuthorizeCompositionPublishing(new EvaluatePermission(publishPermissions)).execute({
      actingActorId: 'actor-publisher',
    });
    await new AuthorizeCompositionArchival(new EvaluatePermission(archivePermissions)).execute({
      actingActorId: 'actor-archiver',
    });

    expect(publishPermissions.inputs).toEqual([
      { actorId: 'actor-publisher', permissionKey: COMPOSITION_PUBLISH_PERMISSION_KEY },
    ]);
    expect(archivePermissions.inputs).toEqual([
      { actorId: 'actor-archiver', permissionKey: COMPOSITION_ARCHIVE_PERMISSION_KEY },
    ]);
  });

  it('denies publication when the corresponding Permission is absent', async () => {
    const authorize = new AuthorizeCompositionPublishing(
      new EvaluatePermission(new RecordingPermissionReader(false)),
    );

    await expect(authorize.execute({ actingActorId: 'actor-ordinary' })).rejects.toMatchObject({
      code: 'composition.publication.authorization.forbidden',
      kind: 'forbidden',
      publicMessage: 'You do not have permission to publish this Page.',
    });
  });
});

describe('Composition preview authorization', () => {
  it('allows an Actor with the canonical Composition preview Permission', async () => {
    const permissions = new RecordingPermissionReader(true);
    const authorize = new AuthorizeCompositionPreview(new EvaluatePermission(permissions));

    await expect(authorize.execute({ actingActorId: 'actor-preview' })).resolves.toBeUndefined();
    expect(permissions.inputs).toEqual([
      {
        actorId: 'actor-preview',
        permissionKey: COMPOSITION_PREVIEW_PERMISSION_KEY,
      },
    ]);
  });

  it('denies draft preview when the Permission is absent', async () => {
    const permissions = new RecordingPermissionReader(false);
    const authorize = new AuthorizeCompositionPreview(new EvaluatePermission(permissions));

    await expect(authorize.execute({ actingActorId: 'actor-ordinary' })).rejects.toMatchObject({
      code: 'composition.preview.authorization.forbidden',
      kind: 'forbidden',
      publicMessage: 'You do not have permission to preview draft composition.',
    });
  });
});
