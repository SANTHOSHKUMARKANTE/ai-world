import type { ReactNode } from 'react';

import { PageContainer, Surface } from '../ui/primitives';

interface IdentityPageProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
}

export function IdentityPage({ eyebrow, title, description, children }: IdentityPageProps) {
  return (
    <main className="aw-identity-page">
      <PageContainer>
        <div className="aw-identity-layout">
          <header className="aw-identity-intro">
            <p className="aw-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>

          <Surface className="aw-identity-card">{children}</Surface>
        </div>
      </PageContainer>
    </main>
  );
}
