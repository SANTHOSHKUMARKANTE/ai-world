import Link from 'next/link';

import { DevotionalDeityPreview } from '../../../../../creator/devotional-deity-preview';
import { PageContainer } from '../../../../../ui/primitives';

interface Props {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function CreatorDevotionalDeityPreviewPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="aw-public-page">
      <PageContainer>
        <nav aria-label="Creator Deity preview breadcrumb" className="aw-context-nav">
          <Link href="/">AI World</Link>
          <span aria-hidden="true">/</span>
          <Link href="/creator">Creator</Link>
          <span aria-hidden="true">/</span>
          <span>Deity preview</span>
        </nav>

        <DevotionalDeityPreview resourceId={id} />
      </PageContainer>
    </main>
  );
}
