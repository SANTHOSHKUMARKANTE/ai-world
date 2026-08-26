import type { Metadata } from 'next';

import { getAnimeSeriesMetadata } from '../../../../anime/anime-series-metadata';
import { EntityExperiencePage } from '../../../../knowledge/entity-experience-page';

interface Props {
  readonly params: Promise<{ readonly slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return getAnimeSeriesMetadata(slug);
}

export default async function AnimeSeriesEntityPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="aw-public-page aw-entity-route aw-anime-series-route">
      <EntityExperiencePage
        universeKey="universe.anime"
        slug={slug}
        expectedResourceType="anime.series"
      />
    </main>
  );
}
