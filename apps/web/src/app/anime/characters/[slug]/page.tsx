import type { Metadata } from 'next';

import { getAnimeCharacterMetadata } from '../../../../anime/anime-character-metadata';
import { EntityExperiencePage } from '../../../../knowledge/entity-experience-page';

interface Props {
  readonly params: Promise<{ readonly slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return getAnimeCharacterMetadata(slug);
}

export default async function AnimeCharacterEntityPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="aw-public-page aw-entity-route aw-anime-character-route">
      <EntityExperiencePage universeKey="universe.anime" slug={slug} />
    </main>
  );
}
