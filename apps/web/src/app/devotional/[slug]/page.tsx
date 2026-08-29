import type { Metadata } from 'next';

import { getDevotionalDeityMetadata } from '../../../devotional/devotional-deity-metadata';
import { EntityExperiencePage } from '../../../knowledge/entity-experience-page';

interface Props {
  readonly params: Promise<{ readonly slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return getDevotionalDeityMetadata(slug);
}

export default async function DevotionalEntityPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="aw-public-page aw-entity-route aw-devotional-deity-route">
      <EntityExperiencePage
        universeKey="universe.devotional"
        slug={slug}
        expectedResourceType="devotional.deity"
      />
    </main>
  );
}
