import { EntityExperiencePage } from '../../../../knowledge/entity-experience-page';

interface Props {
  readonly params: Promise<{ readonly slug: string }>;
}

export default async function AnimeCharacterEntityPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="aw-public-page aw-entity-route">
      <EntityExperiencePage universeKey="universe.anime" slug={slug} />
    </main>
  );
}
