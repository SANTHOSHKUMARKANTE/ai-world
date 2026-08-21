import { ApplicationError } from '@ai-world/foundation-errors';
import { EvaluatePermission } from '@ai-world/platform-identity-access';

import { COMPOSITION_PREVIEW_PERMISSION_KEY } from './composition-authorization-policy';

export interface AuthorizeCompositionPreviewInput {
  readonly actingActorId: string;
}

export class AuthorizeCompositionPreview {
  constructor(private readonly evaluatePermission: EvaluatePermission) {}

  async execute(input: AuthorizeCompositionPreviewInput): Promise<void> {
    const evaluation = await this.evaluatePermission.execute({
      actorId: input.actingActorId,
      permissionKey: COMPOSITION_PREVIEW_PERMISSION_KEY,
    });

    if (!evaluation.allowed) {
      throw new ApplicationError({
        code: 'composition.preview.authorization.forbidden',
        kind: 'forbidden',
        message:
          'Composition preview was denied because the acting Actor does not have the required Permission.',
        publicMessage: 'You do not have permission to preview draft composition.',
      });
    }
  }
}
