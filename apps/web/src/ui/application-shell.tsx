import Link from 'next/link';
import type { ReactNode } from 'react';

import { AccountNavigation } from '../app/account-navigation';
import { PageContainer } from './primitives';

export function ApplicationShell({ children }: { readonly children: ReactNode }) {
  return (
    <div className="aw-app-shell">
      <header className="aw-site-header">
        <PageContainer className="aw-header-inner">
          <Link className="aw-brand" href="/" aria-label="AI World home">
            <span className="aw-brand-mark" aria-hidden="true">
              AI
            </span>
            <span className="aw-brand-copy">
              <span className="aw-brand-name">AI World</span>
              <span className="aw-brand-tagline">One world. Many universes.</span>
            </span>
          </Link>

          <nav className="aw-primary-nav" aria-label="Primary">
            <Link className="aw-nav-link" href="/knowledge">
              Explore
            </Link>
            <Link className="aw-nav-link" href="/search">
              Search
            </Link>
            <Link className="aw-nav-link" href="/creator">
              Create
            </Link>
          </nav>

          <AccountNavigation />
        </PageContainer>
      </header>

      <div className="aw-app-content">{children}</div>

      <footer className="aw-site-footer">
        <PageContainer className="aw-footer-inner">
          <p className="aw-footer-copy">
            AI World keeps Knowledge, creation, discovery, and AI assistance in one shared platform.
          </p>
          <nav className="aw-footer-nav" aria-label="Footer">
            <Link href="/knowledge">Knowledge</Link>
            <Link href="/search">Search</Link>
          </nav>
        </PageContainer>
      </footer>
    </div>
  );
}
