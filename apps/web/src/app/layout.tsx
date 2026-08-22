import type { Metadata } from 'next';

import { SessionProvider } from '../session/session-provider';
import { ApplicationShell } from '../ui/application-shell';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AI World',
    template: '%s · AI World',
  },
  description:
    'Explore structured Knowledge across Universes, discover connections, and create with responsible AI assistance.',
  applicationName: 'AI World',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ApplicationShell>{children}</ApplicationShell>
        </SessionProvider>
      </body>
    </html>
  );
}
