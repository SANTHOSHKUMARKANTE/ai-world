import { AccountNavigation } from './account-navigation';
import { SessionSummary } from './session-summary';

export default function Home() {
  return (
    <main>
      <h1>AI World</h1>

      <p>One shared world for knowledge, creation, and exploration.</p>

      <SessionSummary />

      <AccountNavigation />
    </main>
  );
}
