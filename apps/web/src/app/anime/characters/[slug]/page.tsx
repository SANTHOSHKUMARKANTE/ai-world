import type { Metadata } from 'next';

import { getAnimeCharacterMetadata } from '../../../../anime/anime-character-metadata';
import { EntityExperiencePage } from '../../../../knowledge/entity-experience-page';

interface Props {
  readonly params: Promise<{ readonly slug: string }>;
  readonly searchParams: Promise<{
    readonly media?: string | readonly string[];
  }>;
}

function firstQueryValue(value: string | readonly string[] | undefined): string | null {
  if (typeof value === 'string') {
    return value;
  }

  return value?.[0] ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return getAnimeCharacterMetadata(slug);
}

export default async function AnimeCharacterEntityPage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);

  return (
    <main className="aw-public-page aw-entity-route aw-anime-character-route">
      <EntityExperiencePage
        universeKey="universe.anime"
        slug={slug}
        initialMediaId={firstQueryValue(query.media)}
        expectedResourceType="anime.character"
      />
    </main>
  );
}
