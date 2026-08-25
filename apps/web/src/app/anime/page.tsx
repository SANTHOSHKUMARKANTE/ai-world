import { AnimeUniverseDiscoveryFoundation } from '../../anime/anime-universe-discovery-foundation';
import { LinkButton, PageContainer } from '../../ui/primitives';
import { resolveWebUniversePresentation } from '../../universes/presentation';

export default function AnimePage() {
  const anime = resolveWebUniversePresentation('universe.anime');

  if (!anime) {
    throw new Error('Missing Anime Universe presentation.');
  }

  return (
    <main
      className="aw-public-page aw-anime-universe-route"
      data-uxp03b-landing="true"
      data-universe={anime.universeKey}
      data-universe-tone={anime.tone}
      data-universe-motion={anime.motion}
    >
      <PageContainer className="aw-anime-universe">
        <header className="aw-anime-universe-hero" aria-labelledby="anime-universe-heading">
          <div className="aw-anime-universe-hero__copy">
            <p className="aw-eyebrow">AI World Universe</p>
            <p className="aw-anime-universe-hero__promise">
              Characters, stories, and worlds in motion.
            </p>
            <h1 id="anime-universe-heading">{anime.label}</h1>
            <p className="aw-anime-universe-hero__description">{anime.description}</p>

            <div className="aw-anime-universe-hero__actions">
              <LinkButton href="#recently-updated-characters">Explore Characters</LinkButton>
              <LinkButton href="/search" variant="secondary">
                Search Anime
              </LinkButton>
            </div>
          </div>

          <div className="aw-anime-universe-hero__visual" aria-hidden="true">
            <span className="aw-anime-universe-hero__orb aw-anime-universe-hero__orb--one" />
            <span className="aw-anime-universe-hero__orb aw-anime-universe-hero__orb--two" />
            <span className="aw-anime-universe-hero__slash aw-anime-universe-hero__slash--one" />
            <span className="aw-anime-universe-hero__slash aw-anime-universe-hero__slash--two" />
          </div>
        </header>

        <AnimeUniverseDiscoveryFoundation />
      </PageContainer>
    </main>
  );
}
