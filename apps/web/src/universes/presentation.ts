export type WebUniverseKey = 'universe.devotional' | 'universe.anime';
export type WebUniverseTone = 'devotional' | 'anime';
export type WebUniverseMotion = 'calm' | 'energetic';

const ENTITY_SECTION_KEYS = [
  'entity.forms',
  'entity.meditation',
  'entity.stories',
  'entity.family',
  'entity.temples',
  'entity.quotes',
  'entity.experiences',
] as const;

export type WebEntitySectionKey = (typeof ENTITY_SECTION_KEYS)[number];

export type WebUniversePresentation = {
  readonly universeKey: WebUniverseKey;
  readonly label: string;
  readonly tone: WebUniverseTone;
  readonly motion: WebUniverseMotion;
  readonly description: string;
  readonly entitySectionTitles: Readonly<Record<WebEntitySectionKey, string>>;
};

export const WEB_UNIVERSE_PRESENTATIONS: readonly WebUniversePresentation[] = [
  {
    universeKey: 'universe.devotional',
    label: 'Devotional',
    tone: 'devotional',
    motion: 'calm',
    description:
      'Explore published devotional Knowledge through the same shared AI World experience.',
    entitySectionTitles: {
      'entity.forms': 'Forms of {entity}',
      'entity.meditation': 'Meditation',
      'entity.stories': 'Stories & Knowledge',
      'entity.family': 'Family & Relationships',
      'entity.temples': 'Temples & Sacred Places',
      'entity.quotes': 'Sacred Quotes',
      'entity.experiences': 'Experiences',
    },
  },
  {
    universeKey: 'universe.anime',
    label: 'Anime',
    tone: 'anime',
    motion: 'energetic',
    description:
      'Explore published Anime Knowledge without leaving the shared platform or learning a new product.',
    entitySectionTitles: {
      'entity.forms': 'Forms & Transformations',
      'entity.meditation': 'Training & Techniques',
      'entity.stories': 'Story Arcs & Knowledge',
      'entity.family': 'Allies & Relationships',
      'entity.temples': 'Places & Landmarks',
      'entity.quotes': 'Quotes',
      'entity.experiences': 'Experiences',
    },
  },
];

function isEntitySectionKey(sectionKey: string): sectionKey is WebEntitySectionKey {
  return (ENTITY_SECTION_KEYS as readonly string[]).includes(sectionKey);
}

function fallbackSectionTitle(sectionKey: string): string {
  const segment = sectionKey.split('.').at(-1) ?? sectionKey;
  return segment.charAt(0).toUpperCase() + segment.slice(1).replaceAll('-', ' ');
}

export function resolveWebUniversePresentation(
  universeKey: string,
): WebUniversePresentation | undefined {
  return WEB_UNIVERSE_PRESENTATIONS.find((item) => item.universeKey === universeKey);
}

export function resolveEntitySectionTitle(
  presentation: WebUniversePresentation | undefined,
  sectionKey: string,
  displayName: string,
): string {
  if (!presentation || !isEntitySectionKey(sectionKey)) {
    return fallbackSectionTitle(sectionKey);
  }

  const entityName = displayName.replace(/^Lord\s+/u, '');
  return presentation.entitySectionTitles[sectionKey].replace('{entity}', entityName);
}
