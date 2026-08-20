import { describe, it, expect } from 'vitest';
import { formatDateRange } from './dateFormatters.ts';

describe('formatDateRange', () => {
  it('returns "Add dates" when both dates are null', () => {
    expect(formatDateRange(null, null)).toBe('Add dates');
  });

  it('formats single check-in date cleanly', () => {
    expect(formatDateRange('2026-06-09', null)).toBe('Jun 9');
  });

  it('formats same-month date range cleanly (e.g. Jun 9 – 13)', () => {
    expect(formatDateRange('2026-06-09', '2026-06-13')).toBe('Jun 9 – 13');
  });

  it('formats cross-month date range cleanly (e.g. Jun 28 – Jul 4)', () => {
    expect(formatDateRange('2026-06-28', '2026-07-04')).toBe('Jun 28 – Jul 4');
  });
});
