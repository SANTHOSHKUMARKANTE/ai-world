export interface PublicKnowledgeDestinationInput {
  readonly resourceId: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly slug: string;
}

export function formatPublicKnowledgeResourceType(resourceType: string): string {
  const finalSegment = resourceType.split('.').at(-1) ?? resourceType;

  return finalSegment
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export function resolvePublicKnowledgeDestination(
  resource: PublicKnowledgeDestinationInput,
): string {
  if (resource.universeKey === 'universe.anime' && resource.resourceType === 'anime.character') {
    return `/anime/characters/${encodeURIComponent(resource.slug)}`;
  }

  if (resource.universeKey === 'universe.anime' && resource.resourceType === 'anime.series') {
    return `/anime/series/${encodeURIComponent(resource.slug)}`;
  }

  if (
    resource.universeKey === 'universe.devotional' &&
    resource.resourceType === 'devotional.deity'
  ) {
    return `/devotional/${encodeURIComponent(resource.slug)}`;
  }

  return `/knowledge/resources/${encodeURIComponent(resource.resourceId)}`;
}
