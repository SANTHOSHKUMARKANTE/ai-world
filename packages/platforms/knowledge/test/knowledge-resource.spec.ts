import { describe, expect, it } from 'vitest';

import { KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE, isKnowledgeResourceLifecycle } from '../src';

describe('Knowledge Resource lifecycle baseline', () => {
  it('defines DRAFT as the initial Knowledge Resource lifecycle', () => {
    expect(KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE).toBe('DRAFT');
  });

  it('accepts the canonical initial lifecycle', () => {
    expect(isKnowledgeResourceLifecycle('DRAFT')).toBe(true);
  });

  it('rejects lifecycle states not introduced by P4-M01', () => {
    expect(isKnowledgeResourceLifecycle('PUBLISHED')).toBe(false);
    expect(isKnowledgeResourceLifecycle('ARCHIVED')).toBe(false);
  });

  it('rejects arbitrary lifecycle values', () => {
    expect(isKnowledgeResourceLifecycle('draft')).toBe(false);
    expect(isKnowledgeResourceLifecycle('UNKNOWN')).toBe(false);
    expect(isKnowledgeResourceLifecycle(null)).toBe(false);
  });
});
