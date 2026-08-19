import { describe, expect, it } from 'vitest';

import {
  GENERATION_FAILED_STATUS,
  GENERATION_INITIAL_STATUS,
  GENERATION_SUCCEEDED_STATUS,
  isGenerationStatus,
} from '../src';

describe('Generation status baseline', () => {
  it('defines REQUESTED as the initial Generation status', () => {
    expect(GENERATION_INITIAL_STATUS).toBe('REQUESTED');
  });

  it('accepts the three P7-M03 Generation statuses', () => {
    expect(isGenerationStatus(GENERATION_INITIAL_STATUS)).toBe(true);
    expect(isGenerationStatus(GENERATION_SUCCEEDED_STATUS)).toBe(true);
    expect(isGenerationStatus(GENERATION_FAILED_STATUS)).toBe(true);
  });

  it('does not invent queue or cancellation statuses', () => {
    expect(isGenerationStatus('RUNNING')).toBe(false);
    expect(isGenerationStatus('QUEUED')).toBe(false);
    expect(isGenerationStatus('CANCELLED')).toBe(false);
  });

  it('rejects arbitrary and case-variant status values', () => {
    expect(isGenerationStatus('requested')).toBe(false);
    expect(isGenerationStatus('UNKNOWN')).toBe(false);
    expect(isGenerationStatus(null)).toBe(false);
  });
});
