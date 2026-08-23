import Link from 'next/link';

import { CreatorWorkspace } from '../../creator/creator-workspace';
import { PageContainer } from '../../ui/primitives';

export default function CreatorPage() {
  return (
    <main className="aw-public-page">
      <PageContainer>
        <nav aria-label="Creator breadcrumb" className="aw-context-nav">
          <Link href="/">AI World</Link>
          <span aria-hidden="true">/</span>
          <span>Creator</span>
        </nav>

        <header className="aw-public-hero aw-creator-hero">
          <p className="aw-eyebrow">Creator studio</p>
          <h1>Creator workspace</h1>
          <p>
            Create Knowledge, Media, Pages, and reusable Blocks; arrange them into a saved
            composition; review AI assistance; preview; and publish when the Experience is ready.
          </p>
        </header>

        <CreatorWorkspace />
      </PageContainer>
    </main>
  );
}
