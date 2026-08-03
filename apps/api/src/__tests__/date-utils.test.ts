import { describe, expect, it } from 'vitest';

import { addOneMonthSameDay, startOfTodayInAppTz } from '@omni/shared/common';

describe('addOneMonthSameDay', () => {
  it('clamps Jan 31 to Feb 28 in non-leap year', () => {
    const result = addOneMonthSameDay(new Date(Date.UTC(2025, 0, 31)));
    expect(result.toISOString().slice(0, 10)).toBe('2025-02-28');
  });

  it('keeps mid-month date', () => {
    const result = addOneMonthSameDay(new Date(Date.UTC(2026, 7, 2)));
    expect(result.toISOString().slice(0, 10)).toBe('2026-09-02');
  });
});

describe('startOfTodayInAppTz', () => {
  it('uses Argentina calendar day before UTC midnight', () => {
    const now = new Date('2026-08-03T02:00:00.000Z');
    const today = startOfTodayInAppTz(now);
    expect(today.toISOString().slice(0, 10)).toBe('2026-08-02');
  });

  it('rolls to next day after midnight in Argentina', () => {
    const now = new Date('2026-08-03T03:00:00.000Z');
    const today = startOfTodayInAppTz(now);
    expect(today.toISOString().slice(0, 10)).toBe('2026-08-03');
  });
});
