export type WebUniversePresentation = {
  readonly universeKey: 'universe.devotional' | 'universe.anime';
  readonly label: string;
  readonly tone: 'devotional' | 'anime';
  readonly description: string;
};

export const WEB_UNIVERSE_PRESENTATIONS: readonly WebUniversePresentation[] = [
  {
    universeKey: 'universe.devotional',
    label: 'Devotional',
    tone: 'devotional',
    description:
      'Explore published devotional Knowledge through the same shared AI World experience.',
  },
  {
    universeKey: 'universe.anime',
    label: 'Anime',
    tone: 'anime',
    description:
      'Explore published Anime Knowledge without leaving the shared platform or learning a new product.',
  },
];
