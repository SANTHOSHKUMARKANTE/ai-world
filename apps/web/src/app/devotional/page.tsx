import type { Metadata } from 'next';

import { DevotionalUniverseDiscoveryFoundation } from '../../devotional/devotional-universe-discovery-foundation';
import { buildDevotionalUniverseMetadata } from '../../devotional/devotional-universe-metadata';
import { LinkButton, PageContainer } from '../../ui/primitives';
import { resolveWebUniversePresentation } from '../../universes/presentation';

export const metadata: Metadata = buildDevotionalUniverseMetadata();

export default function DevotionalPage() {
  const devotional = resolveWebUniversePresentation('universe.devotional');

  if (!devotional) {
    throw new Error('Missing Devotional Universe presentation.');
  }

  return (
    <main
      className="aw-public-page aw-devotional-universe-route"
      data-uxp07a-landing="true"
      data-universe={devotional.universeKey}
      data-universe-tone={devotional.tone}
      data-universe-motion={devotional.motion}
    >
      <PageContainer className="aw-devotional-universe">
        <header
          className="aw-devotional-universe-hero"
          aria-labelledby="devotional-universe-heading"
        >
          <div className="aw-devotional-universe-hero__copy">
            <p className="aw-eyebrow">AI World Universe</p>
            <p className="aw-devotional-universe-hero__promise">
              A calm place to discover published devotional Knowledge.
            </p>
            <h1 id="devotional-universe-heading">{devotional.label}</h1>
            <p className="aw-devotional-universe-hero__description">{devotional.description}</p>

            <div className="aw-devotional-universe-hero__actions">
              <LinkButton href="#recently-updated-deities">Explore Deities</LinkButton>
              <LinkButton href="/search?universeKey=universe.devotional" variant="secondary">
                Search Devotional
              </LinkButton>
            </div>
          </div>

          <div className="aw-devotional-universe-hero__visual" aria-hidden="true">
            <span className="aw-devotional-universe-hero__halo aw-devotional-universe-hero__halo--outer" />
            <span className="aw-devotional-universe-hero__halo aw-devotional-universe-hero__halo--inner" />
            <span className="aw-devotional-universe-hero__light" />
          </div>
        </header>

        <DevotionalUniverseDiscoveryFoundation />
      </PageContainer>
    </main>
  );
}
