import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({ pathname: '/anime/characters/naruto-uzumaki' }));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

import { FooterNavigation, PrimaryNavigation } from '../src/ui/site-navigation';

const EXPECTED_DESTINATIONS = [
  ['Devotional', '/devotional'],
  ['Anime', '/anime'],
  ['Knowledge', '/knowledge'],
  ['Search', '/search'],
  ['Create', '/creator'],
] as const;

beforeEach(() => {
  navigationState.pathname = '/anime/characters/naruto-uzumaki';
});

describe('UXP-11B site navigation', () => {
  it('publishes the bounded global destinations in the primary navigation', () => {
    render(<PrimaryNavigation />);

    const navigation = screen.getByRole('navigation', { name: 'Primary' });
    for (const [label, href] of EXPECTED_DESTINATIONS) {
      expect(within(navigation).getByRole('link', { name: label }).getAttribute('href')).toBe(href);
    }

    expect(
      within(navigation).getByRole('link', { name: 'Anime' }).getAttribute('aria-current'),
    ).toBe('page');
    expect(
      within(navigation).getByRole('link', { name: 'Devotional' }).getAttribute('aria-current'),
    ).toBeNull();
  });

  it('reuses the same real destinations and current-route clarity in the footer', () => {
    navigationState.pathname = '/knowledge/resources/resource-1';
    render(<FooterNavigation />);

    const navigation = screen.getByRole('navigation', { name: 'Footer' });
    expect(within(navigation).getAllByRole('link')).toHaveLength(EXPECTED_DESTINATIONS.length);
    expect(
      within(navigation).getByRole('link', { name: 'Knowledge' }).getAttribute('aria-current'),
    ).toBe('page');
  });
});
