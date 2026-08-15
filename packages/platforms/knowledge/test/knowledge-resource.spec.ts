import { describe, expect, it } from 'vitest';

import {
  KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE,
  KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
  isKnowledgeResourceLifecycle,
} from '../src';

describe('Knowledge Resource lifecycle baseline', () => {
  it('defines DRAFT as the initial Knowledge Resource lifecycle', () => {
    expect(KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE).toBe('DRAFT');
  });

  it('accepts the canonical P4-M07 lifecycle vocabulary', () => {
    expect(KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE).toBe('PUBLISHED');
    expect(KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE).toBe('ARCHIVED');

    expect(isKnowledgeResourceLifecycle('DRAFT')).toBe(true);
    expect(isKnowledgeResourceLifecycle('PUBLISHED')).toBe(true);
    expect(isKnowledgeResourceLifecycle('ARCHIVED')).toBe(true);
  });

  it('keeps DRAFT as the only initial lifecycle state', () => {
    expect(KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE).toBe('DRAFT');
  });

  it('rejects arbitrary lifecycle values', () => {
    expect(isKnowledgeResourceLifecycle('draft')).toBe(false);
    expect(isKnowledgeResourceLifecycle('UNKNOWN')).toBe(false);
    expect(isKnowledgeResourceLifecycle(null)).toBe(false);
  });
});
