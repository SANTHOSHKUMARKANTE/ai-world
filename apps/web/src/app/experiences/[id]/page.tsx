import type { Metadata } from 'next';
import Link from 'next/link';

import { PublicExperience } from '../../../creator/public-experience';
import { getPublicExperienceMetadata } from '../../../metadata/public-experience-metadata';
import { PageContainer } from '../../../ui/primitives';

interface Props {
  readonly params: Promise<{ readonly id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return getPublicExperienceMetadata(id);
}

export default async function PublishedExperiencePage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="aw-public-page">
      <PageContainer>
        <nav aria-label="Published Experience" className="aw-context-nav">
          <Link href="/knowledge">Explore Knowledge</Link>
          <Link href="/search">Search</Link>
        </nav>

        <PublicExperience pageId={id} />
      </PageContainer>
    </main>
  );
}
