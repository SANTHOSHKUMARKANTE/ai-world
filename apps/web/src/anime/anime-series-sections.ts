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

export type AnimeSeriesSectionKey = (typeof ANIME_SERIES_SECTION_DEFINITIONS)[number]['sectionKey'];

export const ANIME_SERIES_SECTION_KEYS = ANIME_SERIES_SECTION_DEFINITIONS.map(
  (section) => section.sectionKey,
) as readonly AnimeSeriesSectionKey[];

export function findAnimeSeriesSection(sectionKey: string) {
  return ANIME_SERIES_SECTION_DEFINITIONS.find((section) => section.sectionKey === sectionKey);
}

export function animeSeriesSectionOrder(sectionKey: string): number {
  const index = ANIME_SERIES_SECTION_KEYS.indexOf(sectionKey as AnimeSeriesSectionKey);
  return index >= 0 ? index : ANIME_SERIES_SECTION_KEYS.length;
}
