import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

function TestingBaselineHarness() {
  const [status, setStatus] = useState('Idle');

  return (
    <section aria-labelledby="testing-baseline-title">
      <h1 id="testing-baseline-title">AI World</h1>

      <p>{status}</p>

      <button
        type="button"
        onClick={() => {
          setStatus('Ready');
        }}
      >
        Activate baseline
      </button>
    </section>
  );
}

describe('Web testing baseline', () => {
  it('renders React content through the DOM test environment', () => {
    render(<TestingBaselineHarness />);

    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'AI World',
    });

    expect(heading.textContent).toBe('AI World');
  });

  it('supports user-driven React updates', () => {
    render(<TestingBaselineHarness />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Activate baseline',
      }),
    );

    expect(screen.getByText('Ready').textContent).toBe('Ready');
  });
});
