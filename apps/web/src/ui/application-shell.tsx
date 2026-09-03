import Link from 'next/link';
import type { ReactNode } from 'react';

import { AccountNavigation } from '../app/account-navigation';
import { PageContainer } from './primitives';
import { FooterNavigation, PrimaryNavigation } from './site-navigation';

export function ApplicationShell({ children }: { readonly children: ReactNode }) {
  return (
    <div className="aw-app-shell">
      <a className="aw-skip-link" href="#aw-main-content">
        Skip to main content
      </a>

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

          <PrimaryNavigation />

          <AccountNavigation />
        </PageContainer>
      </header>

      <div id="aw-main-content" className="aw-app-content" tabIndex={-1}>
        {children}
      </div>

      <footer className="aw-site-footer">
        <PageContainer className="aw-footer-inner">
          <div className="aw-footer-identity">
            <Link className="aw-footer-brand" href="/">
              AI World
            </Link>
            <p className="aw-footer-copy">
              Knowledge, discovery, creation, and responsible AI assistance across distinct
              Universes.
            </p>
          </div>
          <FooterNavigation />
        </PageContainer>
      </footer>
    </div>
  );
}
