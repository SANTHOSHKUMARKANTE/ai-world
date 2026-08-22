import { SavedExperience } from '../../engagement/saved-experience';
import { PageContainer } from '../../ui/primitives';

export default function SavedPage() {
  return (
    <main className="aw-public-page">
      <PageContainer>
        <header className="aw-public-hero">
          <p className="aw-eyebrow">Your library</p>
          <h1>Saved Knowledge</h1>
          <p>
            Keep published Resources close with Favorites, then organize them into Collections that
            stay with your account.
          </p>
        </header>

        <SavedExperience />
      </PageContainer>
    </main>
  );
}
