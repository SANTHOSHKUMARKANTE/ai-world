import Link from 'next/link';

import { DraftPreview } from '../../../../creator/draft-preview';
import { PageContainer } from '../../../../ui/primitives';

interface CreatorDraftPreviewPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function CreatorDraftPreviewPage({ params }: CreatorDraftPreviewPageProps) {
  const { id } = await params;

  return (
    <main className="aw-public-page">
      <PageContainer>
        <nav aria-label="Preview breadcrumb" className="aw-context-nav">
          <Link href="/creator">Creator workspace</Link>
          <span aria-hidden="true">/</span>
          <span>Saved draft preview</span>
        </nav>

        <DraftPreview pageId={id} />
      </PageContainer>
    </main>
  );
}
