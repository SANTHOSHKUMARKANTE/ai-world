export const ANIME_CHARACTER_SECTION_DEFINITIONS = [
  {
    sectionKey: 'entity.forms',
    title: 'Forms & Transformations',
    relationshipType: 'anime.form',
  },
  {
    sectionKey: 'entity.techniques',
    title: 'Techniques & Abilities',
    relationshipType: 'anime.technique',
  },
  {
    sectionKey: 'entity.arcs',
    title: 'Story Arcs & Key Moments',
    relationshipType: 'anime.arc',
  },
  {
    sectionKey: 'entity.allies',
    title: 'Allies',
    relationshipType: 'anime.ally',
  },
  {
    sectionKey: 'entity.rivals',
    title: 'Rivals',
    relationshipType: 'anime.rival',
  },
  {
    sectionKey: 'entity.family',
    title: 'Family & Relationships',
    relationshipType: 'anime.family',
  },
  {
    sectionKey: 'entity.affiliations',
    title: 'Affiliations',
    relationshipType: 'anime.affiliation',
  },
  {
    sectionKey: 'entity.places',
    title: 'Places',
    relationshipType: 'anime.place',
  },
  {
    sectionKey: 'entity.quotes',
    title: 'Quotes',
    relationshipType: 'anime.quote',
  },
  {
    sectionKey: 'entity.experiences',
    title: 'Related Experiences',
    relationshipType: 'anime.experience',
  },
  {
    sectionKey: 'entity.characters',
    title: 'Related Characters',
    relationshipType: 'anime.character',
  },
  {
    sectionKey: 'entity.series',
    title: 'Series & Appearances',
    relationshipType: 'anime.appearance',
  },
] as const;

export type AnimeCharacterSectionKey =
  (typeof ANIME_CHARACTER_SECTION_DEFINITIONS)[number]['sectionKey'];

export const ANIME_CHARACTER_SECTION_KEYS = ANIME_CHARACTER_SECTION_DEFINITIONS.map(
  (section) => section.sectionKey,
) as readonly AnimeCharacterSectionKey[];

export function findAnimeCharacterSection(sectionKey: string) {
  return ANIME_CHARACTER_SECTION_DEFINITIONS.find((section) => section.sectionKey === sectionKey);
}

export function animeCharacterSectionOrder(sectionKey: string): number {
  const index = ANIME_CHARACTER_SECTION_KEYS.indexOf(sectionKey as AnimeCharacterSectionKey);
  return index >= 0 ? index : ANIME_CHARACTER_SECTION_KEYS.length;
}
