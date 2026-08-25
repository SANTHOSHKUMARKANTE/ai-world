import { AnimeUniverseDiscoveryFoundation } from '../../anime/anime-universe-discovery-foundation';
import { PageContainer } from '../../ui/primitives';
import { resolveWebUniversePresentation } from '../../universes/presentation';

export default function AnimePage() {
  const anime = resolveWebUniversePresentation('universe.anime');

  if (!anime) {
    throw new Error('Missing Anime Universe presentation.');
  }

  return (
    <main
      className="aw-public-page"
      data-uxp03a-route-foundation="true"
      data-universe={anime.universeKey}
      data-universe-tone={anime.tone}
      data-universe-motion={anime.motion}
    >
      <PageContainer>
        <header aria-labelledby="anime-universe-heading">
          <p className="aw-eyebrow">AI World Universe</p>
          <h1 id="anime-universe-heading">{anime.label}</h1>
        </header>

        <AnimeUniverseDiscoveryFoundation />
      </PageContainer>
    </main>
  );
}
