import { ApplicationError } from '@ai-world/foundation-errors';
import { EvaluatePermission } from '@ai-world/platform-identity-access';

import { COMPOSITION_ARCHIVE_PERMISSION_KEY } from './composition-authorization-policy';

export interface AuthorizeCompositionArchivalInput {
  readonly actingActorId: string;
}

export class AuthorizeCompositionArchival {
  constructor(private readonly evaluatePermission: EvaluatePermission) {}

  async execute(input: AuthorizeCompositionArchivalInput): Promise<void> {
    const evaluation = await this.evaluatePermission.execute({
      actorId: input.actingActorId,
      permissionKey: COMPOSITION_ARCHIVE_PERMISSION_KEY,
    });

    if (!evaluation.allowed) {
      throw new ApplicationError({
        code: 'composition.publication.authorization.forbidden',
        kind: 'forbidden',
        message:
          'Composition archival was denied because the acting Actor does not have the required Permission.',
        publicMessage: 'You do not have permission to archive this Page.',
      });
    }
  }
}
