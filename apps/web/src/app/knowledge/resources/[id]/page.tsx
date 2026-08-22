import Link from 'next/link';

import { ResourceEngagementControls } from '../../../../engagement/resource-engagement-controls';
import { PublicKnowledgeResourceDetail } from '../../../../knowledge/public-knowledge-resource-detail';
import { PageContainer } from '../../../../ui/primitives';

interface Props {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function KnowledgeResourcePage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="aw-public-page">
      <PageContainer className="aw-resource-page">
        <nav aria-label="Knowledge resource" className="aw-context-nav">
          <Link href="/knowledge">← Explore</Link>
          <Link href="/search">Search</Link>
        </nav>

        <PublicKnowledgeResourceDetail resourceId={id} />
        <ResourceEngagementControls resourceId={id} />
      </PageContainer>
    </main>
  );
}
