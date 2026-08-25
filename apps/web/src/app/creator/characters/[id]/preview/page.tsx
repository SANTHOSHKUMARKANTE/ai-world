import Link from 'next/link';

import { AnimeCharacterPreview } from '../../../../../creator/anime-character-preview';
import { PageContainer } from '../../../../../ui/primitives';

interface Props {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function CreatorAnimeCharacterPreviewPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="aw-public-page">
      <PageContainer>
        <nav aria-label="Creator Character preview breadcrumb" className="aw-context-nav">
          <Link href="/">AI World</Link>
          <span aria-hidden="true">/</span>
          <Link href="/creator">Creator</Link>
          <span aria-hidden="true">/</span>
          <span>Character preview</span>
        </nav>

        <AnimeCharacterPreview resourceId={id} />
      </PageContainer>
    </main>
  );
}
