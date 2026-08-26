export const ANIME_SERIES_SECTION_DEFINITIONS = [
  {
    sectionKey: 'entity.characters',
    relationshipType: 'anime.character',
    targetResourceType: 'anime.character',
    title: 'Characters',
  },
  {
    sectionKey: 'entity.series',
    relationshipType: 'anime.related-series',
    targetResourceType: 'anime.series',
    title: 'Related Series & Movies',
  },
] as const;
