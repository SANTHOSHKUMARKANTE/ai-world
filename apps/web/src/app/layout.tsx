import type { Metadata } from 'next';

import { SessionProvider } from '../session/session-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI World',
  description: 'Explore and create across AI World.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
