import type { KnowledgeResource } from '@ai-world/platform-knowledge';
import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  DEVOTIONAL_DEITY_RESOURCE_TYPE,
  DEVOTIONAL_UNIVERSE_KEY,
  type DeityResource,
} from '../src';

describe('Devotional Deity resource type', () => {
  it('uses the canonical Devotional Universe key', () => {
    expect(DEVOTIONAL_UNIVERSE_KEY).toBe('universe.devotional');
  });

  it('uses the canonical Deity Resource Type key', () => {
    expect(DEVOTIONAL_DEITY_RESOURCE_TYPE).toBe('devotional.deity');
  });

  it('specializes the shared Knowledge Resource contract', () => {
    expectTypeOf<DeityResource>().toMatchTypeOf<KnowledgeResource>();
    expectTypeOf<DeityResource['universeKey']>().toEqualTypeOf<typeof DEVOTIONAL_UNIVERSE_KEY>();
    expectTypeOf<DeityResource['resourceType']>().toEqualTypeOf<
      typeof DEVOTIONAL_DEITY_RESOURCE_TYPE
    >();
    expectTypeOf<DeityResource['name']>().toEqualTypeOf<string>();
  });
});
