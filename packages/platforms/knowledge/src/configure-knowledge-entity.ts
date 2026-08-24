import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';

import type { KnowledgeEntityFact, KnowledgeEntityProfile } from './knowledge-entity';
import type {
  KnowledgeEntityRelationRecordInput,
  KnowledgeEntityStore,
} from './knowledge-entity-store';
import type { KnowledgeResourceReader } from './knowledge-resource-reader';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

export interface ConfigureKnowledgeEntityFactInput {
  readonly key: string;
  readonly label: string;
  readonly value: string;
}

export interface ConfigureKnowledgeEntityRelationInput {
  readonly targetResourceId: string;
  readonly sectionKey: string;
  readonly relationshipType: string;
  readonly position: number;
}

export interface ConfigureKnowledgeEntityInput {
  readonly id: string;
  readonly profile: {
    readonly slug: string;
    readonly displayName: string;
    readonly nativeName?: string | null;
    readonly alternateNames?: readonly string[];
    readonly summary: string;
    readonly overview?: string | null;
    readonly facts: readonly ConfigureKnowledgeEntityFactInput[];
  };
  readonly relations: readonly ConfigureKnowledgeEntityRelationInput[];
}

function invalidInput(message: string): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.entity.invalid_input',
    kind: 'validation',
    message: `Knowledge Entity configuration is invalid: ${message}`,
    publicMessage: 'The Knowledge Entity input is invalid.',
  });
}

function notFound(): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.entity.resource_not_found',
    kind: 'not_found',
    message: 'Knowledge Entity configuration requires an existing Knowledge Resource.',
    publicMessage: 'Knowledge Resource not found.',
  });
}

function relationTargetNotFound(targetResourceId: string): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.entity.relation_target_not_found',
    kind: 'validation',
    message: `Knowledge Entity relation target does not exist: ${targetResourceId}`,
    publicMessage: 'A related Knowledge Resource does not exist.',
  });
}

function routeConflict(routeKey: string): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.entity.route_conflict',
    kind: 'conflict',
    message: `Knowledge Entity route is already owned by another Resource: ${routeKey}`,
    publicMessage: 'That Knowledge Entity route is already in use.',
  });
}

function canonicalText(value: string, label: string, maxLength: number): string {
  const normalized = value.trim();

  if (!normalized || normalized.length > maxLength) {
    throw invalidInput(`${label} must contain 1-${maxLength} characters.`);
  }

  return normalized;
}

function canonicalOptionalText(
  value: string | null | undefined,
  label: string,
  maxLength: number,
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  return canonicalText(value, label, maxLength);
}

function canonicalAlternateNames(input: readonly string[] | undefined): readonly string[] {
  const values = input ?? [];

  if (values.length > 12) {
    throw invalidInput('no more than 12 alternate names are allowed.');
  }

  const seen = new Set<string>();
  return values.map((value) => {
    const normalized = canonicalText(value, 'alternate name', 160);
    const identity = normalized.normalize('NFKC').toLocaleLowerCase('en-US');
    if (seen.has(identity)) {
      throw invalidInput(`alternate name is duplicated: ${normalized}`);
    }
    seen.add(identity);
    return normalized;
  });
}

function canonicalSlug(value: string): string {
  const slug = value.trim();

  if (slug.length > 96 || !SLUG_PATTERN.test(slug)) {
    throw invalidInput(
      'slug must be a lower-case, hyphen-separated route segment no longer than 96 characters.',
    );
  }

  return slug;
}

function canonicalFacts(
  input: readonly ConfigureKnowledgeEntityFactInput[],
): readonly KnowledgeEntityFact[] {
  if (input.length > 12) {
    throw invalidInput('no more than 12 quick facts are allowed.');
  }

  const seen = new Set<string>();

  return input.map((fact) => {
    let key: ReturnType<typeof parseNamespacedKey>;

    try {
      key = parseNamespacedKey(fact.key);
    } catch {
      throw invalidInput('quick-fact keys must be canonical namespaced keys.');
    }

    if (seen.has(key)) {
      throw invalidInput(`quick-fact key is duplicated: ${key}`);
    }
    seen.add(key);

    return {
      key,
      label: canonicalText(fact.label, 'quick-fact label', 40),
      value: canonicalText(fact.value, 'quick-fact value', 120),
    };
  });
}

function canonicalRelations(
  input: readonly ConfigureKnowledgeEntityRelationInput[],
): readonly KnowledgeEntityRelationRecordInput[] {
  if (input.length > 120) {
    throw invalidInput('no more than 120 related Resources are allowed.');
  }

  const positions = new Set<string>();
  const identities = new Set<string>();

  return input.map((relation) => {
    let targetResourceId: ResourceId;
    let sectionKey: ReturnType<typeof parseNamespacedKey>;
    let relationshipType: ReturnType<typeof parseNamespacedKey>;

    try {
      targetResourceId = parseResourceId(relation.targetResourceId);
      sectionKey = parseNamespacedKey(relation.sectionKey);
      relationshipType = parseNamespacedKey(relation.relationshipType);
    } catch {
      throw invalidInput('relation IDs and keys must be canonical.');
    }

    if (!Number.isInteger(relation.position) || relation.position < 0) {
      throw invalidInput('relation position must be a non-negative integer.');
    }

    const positionIdentity = `${sectionKey}:${relation.position}`;
    if (positions.has(positionIdentity)) {
      throw invalidInput(`section position is duplicated: ${positionIdentity}`);
    }
    positions.add(positionIdentity);

    const relationIdentity = `${relationshipType}:${targetResourceId}`;
    if (identities.has(relationIdentity)) {
      throw invalidInput(`relationship is duplicated: ${relationIdentity}`);
    }
    identities.add(relationIdentity);

    return {
      targetResourceId,
      sectionKey,
      relationshipType,
      position: relation.position,
    };
  });
}

export class ConfigureKnowledgeEntity {
  public constructor(
    private readonly resources: KnowledgeResourceReader,
    private readonly entities: KnowledgeEntityStore,
  ) {}

  public async execute(input: ConfigureKnowledgeEntityInput): Promise<KnowledgeEntityProfile> {
    let id: ResourceId;

    try {
      id = parseResourceId(input.id);
    } catch {
      throw invalidInput('Resource ID must be canonical.');
    }

    const resource = await this.resources.findById({ id });
    if (!resource) {
      throw notFound();
    }

    const slug = canonicalSlug(input.profile.slug);
    const displayName = canonicalText(input.profile.displayName, 'display name', 160);
    const nativeName = canonicalOptionalText(input.profile.nativeName, 'native name', 160);
    const alternateNames = canonicalAlternateNames(input.profile.alternateNames);
    const summary = canonicalText(input.profile.summary, 'summary', 600);
    const overview = canonicalOptionalText(input.profile.overview, 'overview', 6000);
    const facts = canonicalFacts(input.profile.facts);
    const relations = canonicalRelations(input.relations);
    const routeKey = `${resource.universeKey}/${slug}`;

    const routeOwner = await this.entities.findRouteOwner({ routeKey });
    if (routeOwner && routeOwner !== resource.id) {
      throw routeConflict(routeKey);
    }

    for (const relation of relations) {
      if (relation.targetResourceId === resource.id) {
        throw invalidInput('an Entity cannot relate to itself.');
      }

      const target = await this.resources.findById({ id: relation.targetResourceId });
      if (!target) {
        throw relationTargetNotFound(relation.targetResourceId);
      }
    }

    return this.entities.replaceConfiguration({
      knowledgeResourceId: resource.id,
      routeKey,
      slug,
      displayName,
      nativeName,
      alternateNames,
      summary,
      overview,
      facts,
      relations,
    });
  }
}
