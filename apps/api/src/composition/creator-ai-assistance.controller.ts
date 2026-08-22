import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import {
  AiCreatorAssistanceError,
  AiGenerationSafetyError,
  GenerationCanonicalAcceptanceError,
} from '@ai-world/platform-ai-creator';
import {
  AiAssistedKnowledgeComposition,
  AuthorizeCompositionEditing,
} from '@ai-world/platform-composition';
import { ValidateSession } from '@ai-world/platform-identity-access';
import type { KnowledgeResource } from '@ai-world/platform-knowledge';
import { Body, Controller, Headers, Param, Post } from '@nestjs/common';

import { requireSessionToken } from '../session/require-session-token';
import { SessionCookie } from '../session/session-cookie';
import { parseSuggestCreatorKnowledgeCandidateRequest } from './creator-ai-assistance-request';

export interface CreatorAiKnowledgeCandidateResponse {
  readonly generationId: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly canonical: false;
  readonly createdAt: string;
}

export interface AcceptedCreatorAiKnowledgeCandidateResponse {
  readonly generationId: string;
  readonly canonical: true;
  readonly canonicalOwner: 'knowledge';
  readonly resource: {
    readonly id: string;
    readonly universeKey: string;
    readonly resourceType: string;
    readonly lifecycle: KnowledgeResource['lifecycle'];
    readonly createdAt: string;
    readonly updatedAt: string;
  };
}

function canonicalInputError(error: TypeError): ApplicationError {
  return new ApplicationError({
    code: 'composition.ai_assistance.invalid_input',
    kind: 'validation',
    message: `Creator AI-assisted Knowledge input failed canonical validation: ${error.message}`,
    publicMessage: 'The AI-assisted Knowledge input is invalid.',
  });
}

function assistanceError(error: unknown): never {
  if (error instanceof ApplicationError) {
    throw error;
  }

  if (error instanceof TypeError) {
    throw canonicalInputError(error);
  }

  if (error instanceof AiGenerationSafetyError) {
    const forbidden = error.code === 'PERMISSION_DENIED';
    throw new ApplicationError({
      code: forbidden
        ? 'composition.ai_assistance.forbidden'
        : 'composition.ai_assistance.unsafe_request',
      kind: forbidden ? 'forbidden' : 'validation',
      message: `AI / Creator rejected the CMS assistance request: ${error.code}.`,
      publicMessage: forbidden
        ? 'You do not have permission to use AI creator assistance.'
        : 'The AI creator assistance request was rejected.',
      cause: error,
    });
  }

  if (error instanceof AiCreatorAssistanceError) {
    throw new ApplicationError({
      code: 'composition.ai_assistance.invalid_candidate',
      kind: 'validation',
      message: `AI / Creator returned an unusable CMS candidate: ${error.code}.`,
      publicMessage: 'AI creator assistance did not return a valid candidate.',
      cause: error,
    });
  }

  if (error instanceof GenerationCanonicalAcceptanceError) {
    throw new ApplicationError({
      code: 'composition.ai_assistance.acceptance_conflict',
      kind: error.code === 'GENERATION_NOT_FOUND' ? 'not_found' : 'conflict',
      message: `AI / Creator rejected canonical CMS acceptance: ${error.code}.`,
      publicMessage: 'The AI-assisted candidate can no longer be accepted.',
      cause: error,
    });
  }

  throw error;
}

@Controller('composition/ai/knowledge-candidates')
export class CreatorAiAssistanceController {
  constructor(
    private readonly validateSession: ValidateSession,
    private readonly authorizeCompositionEditing: AuthorizeCompositionEditing,
    private readonly aiAssistedKnowledgeComposition: AiAssistedKnowledgeComposition,
    private readonly sessionCookie: SessionCookie,
  ) {}

  private async requireActingActorId(cookieHeader: string | undefined): Promise<string> {
    const token = requireSessionToken(this.sessionCookie, cookieHeader);
    const session = await this.validateSession.execute({ token });
    await this.authorizeCompositionEditing.execute({ actingActorId: session.actorId });
    return session.actorId;
  }

  @Post()
  async suggestKnowledgeCandidate(
    @Headers('cookie') cookieHeader: string | undefined,
    @Body() body: unknown,
  ): Promise<CreatorAiKnowledgeCandidateResponse> {
    const actingActorId = await this.requireActingActorId(cookieHeader);
    const request = parseSuggestCreatorKnowledgeCandidateRequest(body);

    try {
      const candidate = await this.aiAssistedKnowledgeComposition.suggest({
        actingActorId: parseResourceId(actingActorId),
        universeKey: parseNamespacedKey(request.universeKey),
        request: request.request,
        contextQuery: request.contextQuery,
        ...(request.contextResourceTypes === undefined
          ? {}
          : {
              contextResourceTypes: request.contextResourceTypes.map(parseNamespacedKey),
            }),
        ...(request.contextLimit === undefined ? {} : { contextLimit: request.contextLimit }),
      });

      return {
        generationId: candidate.generationId,
        universeKey: candidate.universeKey,
        resourceType: candidate.resourceType,
        canonical: false,
        createdAt: candidate.createdAt.toISOString(),
      };
    } catch (error) {
      return assistanceError(error);
    }
  }

  @Post(':generationId/accept')
  async acceptKnowledgeCandidate(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('generationId') generationId: string,
  ): Promise<AcceptedCreatorAiKnowledgeCandidateResponse> {
    const actingActorId = await this.requireActingActorId(cookieHeader);

    try {
      const accepted = await this.aiAssistedKnowledgeComposition.accept({
        actingActorId: parseResourceId(actingActorId),
        generationId: parseResourceId(generationId),
      });
      const resource = accepted.canonicalResource;

      return {
        generationId: accepted.generationId,
        canonical: true,
        canonicalOwner: 'knowledge',
        resource: {
          id: resource.id,
          universeKey: resource.universeKey,
          resourceType: resource.resourceType,
          lifecycle: resource.lifecycle,
          createdAt: resource.createdAt.toISOString(),
          updatedAt: resource.updatedAt.toISOString(),
        },
      };
    } catch (error) {
      return assistanceError(error);
    }
  }
}
