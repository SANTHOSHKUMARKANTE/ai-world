import type { KnowledgeResource } from '@ai-world/platform-knowledge';
import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  DEVOTIONAL_DEITY_RESOURCE_TYPE,
  DEVOTIONAL_RESOURCE_TYPES,
  DEVOTIONAL_SCRIPTURE_RESOURCE_TYPE,
  DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
  DEVOTIONAL_UNIVERSE_DEFINITION,
  DEVOTIONAL_UNIVERSE_KEY,
  type DeityResource,
  type DevotionalResourceType,
  type ScriptureResource,
  type TempleResource,
} from '../src';

describe('Devotional Universe v1 definition', () => {
  it('declares the canonical Universe identity and minimal Resource Type set', () => {
    expect(DEVOTIONAL_UNIVERSE_DEFINITION).toEqual({
      key: 'universe.devotional',
      resourceTypes: ['devotional.deity', 'devotional.scripture', 'devotional.temple'],
    });

    expect(DEVOTIONAL_RESOURCE_TYPES).toEqual([
      DEVOTIONAL_DEITY_RESOURCE_TYPE,
      DEVOTIONAL_SCRIPTURE_RESOURCE_TYPE,
      DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
    ]);

    expect(new Set(DEVOTIONAL_RESOURCE_TYPES).size).toBe(DEVOTIONAL_RESOURCE_TYPES.length);
  });

  it('keeps every v1 Resource specialized from shared Knowledge', () => {
    expectTypeOf<DeityResource>().toMatchTypeOf<KnowledgeResource>();
    expectTypeOf<ScriptureResource>().toMatchTypeOf<KnowledgeResource>();
    expectTypeOf<TempleResource>().toMatchTypeOf<KnowledgeResource>();

    expectTypeOf<DeityResource['universeKey']>().toEqualTypeOf<typeof DEVOTIONAL_UNIVERSE_KEY>();
    expectTypeOf<ScriptureResource['universeKey']>().toEqualTypeOf<
      typeof DEVOTIONAL_UNIVERSE_KEY
    >();
    expectTypeOf<TempleResource['universeKey']>().toEqualTypeOf<typeof DEVOTIONAL_UNIVERSE_KEY>();

    expectTypeOf<DeityResource['resourceType']>().toEqualTypeOf<
      typeof DEVOTIONAL_DEITY_RESOURCE_TYPE
    >();
    expectTypeOf<ScriptureResource['resourceType']>().toEqualTypeOf<
      typeof DEVOTIONAL_SCRIPTURE_RESOURCE_TYPE
    >();
    expectTypeOf<TempleResource['resourceType']>().toEqualTypeOf<
      typeof DEVOTIONAL_TEMPLE_RESOURCE_TYPE
    >();
  });

  it('keeps the first domain fields deliberately narrow', () => {
    expectTypeOf<DeityResource['name']>().toEqualTypeOf<string>();
    expectTypeOf<ScriptureResource['title']>().toEqualTypeOf<string>();
    expectTypeOf<TempleResource['name']>().toEqualTypeOf<string>();
  });

  it('exposes a closed Resource Type union from the concrete definition', () => {
    expectTypeOf<DevotionalResourceType>().toEqualTypeOf<
      | typeof DEVOTIONAL_DEITY_RESOURCE_TYPE
      | typeof DEVOTIONAL_SCRIPTURE_RESOURCE_TYPE
      | typeof DEVOTIONAL_TEMPLE_RESOURCE_TYPE
    >();
  });
});
