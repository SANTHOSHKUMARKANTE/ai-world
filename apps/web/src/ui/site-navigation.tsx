'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SITE_DESTINATIONS = [
  { href: '/devotional', label: 'Devotional' },
  { href: '/anime', label: 'Anime' },
  { href: '/knowledge', label: 'Knowledge' },
  { href: '/search', label: 'Search' },
  { href: '/creator', label: 'Create' },
] as const;

function isCurrentDestination(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavigationLinks({ className }: { readonly className: string }) {
  const pathname = usePathname();

  return SITE_DESTINATIONS.map((destination) => (
    <Link
      className={className}
      href={destination.href}
      aria-current={isCurrentDestination(pathname, destination.href) ? 'page' : undefined}
      key={destination.href}
    >
      {destination.label}
    </Link>
  ));
}

export function PrimaryNavigation() {
  return (
    <nav className="aw-primary-nav" aria-label="Primary">
      <NavigationLinks className="aw-nav-link" />
    </nav>
  );
}

export function FooterNavigation() {
  return (
    <nav className="aw-footer-nav" aria-label="Footer">
      <NavigationLinks className="aw-footer-link" />
    </nav>
  );
}
