import { ApplicationError } from '@ai-world/foundation-errors';
import { EvaluatePermission } from '@ai-world/platform-identity-access';

import { COMPOSITION_PUBLISH_PERMISSION_KEY } from './composition-authorization-policy';

export interface AuthorizeCompositionPublishingInput {
  readonly actingActorId: string;
}

export class AuthorizeCompositionPublishing {
  constructor(private readonly evaluatePermission: EvaluatePermission) {}

  async execute(input: AuthorizeCompositionPublishingInput): Promise<void> {
    const evaluation = await this.evaluatePermission.execute({
      actorId: input.actingActorId,
      permissionKey: COMPOSITION_PUBLISH_PERMISSION_KEY,
    });

    if (!evaluation.allowed) {
      throw new ApplicationError({
        code: 'composition.publication.authorization.forbidden',
        kind: 'forbidden',
        message:
          'Composition publishing was denied because the acting Actor does not have the required Permission.',
        publicMessage: 'You do not have permission to publish this Page.',
      });
    }
  }
}
