import Link from 'next/link';

import { AnimeSeriesPreview } from '../../../../../creator/anime-series-preview';
import { PageContainer } from '../../../../../ui/primitives';

interface Props {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function CreatorAnimeSeriesPreviewPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="aw-public-page">
      <PageContainer>
        <nav aria-label="Creator Series preview breadcrumb" className="aw-context-nav">
          <Link href="/">AI World</Link>
          <span aria-hidden="true">/</span>
          <Link href="/creator">Creator</Link>
          <span aria-hidden="true">/</span>
          <span>Series preview</span>
        </nav>

        <AnimeSeriesPreview resourceId={id} />
      </PageContainer>
    </main>
  );
}
