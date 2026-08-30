export const DEVOTIONAL_DEITY_FACT_TEMPLATES = [
  { key: 'devotional.tradition', label: 'Tradition', value: '' },
  { key: 'devotional.aspect', label: 'Role / aspect', value: '' },
  { key: 'devotional.symbol', label: 'Symbol', value: '' },
  { key: 'devotional.mantra', label: 'Mantra', value: '' },
  { key: 'devotional.consort', label: 'Consort', value: '' },
  { key: 'devotional.vehicle', label: 'Vehicle', value: '' },
  { key: 'devotional.festival', label: 'Festival', value: '' },
  { key: 'devotional.sacred-text', label: 'Sacred text', value: '' },
  { key: 'devotional.associated-place', label: 'Associated place', value: '' },
] as const;

export const DEVOTIONAL_DEITY_SECTION_DEFINITIONS = [
  {
    sectionKey: 'entity.forms',
    title: 'Forms',
    relationshipType: 'devotional.form',
    relationshipTypes: ['devotional.form'],
  },
  {
    sectionKey: 'entity.meditation',
    title: 'Meditation',
    relationshipType: 'devotional.theme',
    relationshipTypes: ['devotional.theme', 'devotional.devotion'],
  },
  {
    sectionKey: 'entity.stories',
    title: 'Stories & Knowledge',
    relationshipType: 'devotional.story',
    relationshipTypes: ['devotional.story'],
  },
  {
    sectionKey: 'entity.family',
    title: 'Family & Relationships',
    relationshipType: 'devotional.consort',
    relationshipTypes: [
      'devotional.consort',
      'devotional.child',
      'devotional.parent',
      'devotional.companion',
    ],
  },
  {
    sectionKey: 'entity.temples',
    title: 'Temples & Sacred Places',
    relationshipType: 'devotional.sacred-place',
    relationshipTypes: ['devotional.sacred-place'],
  },
  {
    sectionKey: 'entity.quotes',
    title: 'Sacred Quotes',
    relationshipType: 'devotional.quote',
    relationshipTypes: ['devotional.quote'],
  },
  {
    sectionKey: 'entity.experiences',
    title: 'Experiences',
    relationshipType: 'devotional.experience',
    relationshipTypes: ['devotional.experience'],
  },
] as const;

export type DevotionalDeitySectionKey =
  (typeof DEVOTIONAL_DEITY_SECTION_DEFINITIONS)[number]['sectionKey'];

export const DEVOTIONAL_DEITY_SECTION_KEYS = DEVOTIONAL_DEITY_SECTION_DEFINITIONS.map(
  (section) => section.sectionKey,
) as readonly DevotionalDeitySectionKey[];

export function findDevotionalDeitySection(sectionKey: string) {
  return DEVOTIONAL_DEITY_SECTION_DEFINITIONS.find((section) => section.sectionKey === sectionKey);
}

export function devotionalDeitySectionOrder(sectionKey: string): number {
  const index = DEVOTIONAL_DEITY_SECTION_KEYS.indexOf(sectionKey as DevotionalDeitySectionKey);
  return index >= 0 ? index : DEVOTIONAL_DEITY_SECTION_KEYS.length;
}
