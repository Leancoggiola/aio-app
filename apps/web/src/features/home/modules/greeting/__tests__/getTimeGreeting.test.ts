import { describe, expect, it } from 'vitest';

import { getTimeGreeting } from '../utils/getTimeGreeting';

describe('getTimeGreeting', () => {
  it('returns Buenos días in the morning', () => {
    expect(getTimeGreeting(new Date('2024-01-01T08:00:00'))).toBe('Buenos días');
  });

  it('returns Buenas tardes in the afternoon', () => {
    expect(getTimeGreeting(new Date('2024-01-01T14:00:00'))).toBe('Buenas tardes');
  });

  it('returns Buenas noches at night', () => {
    expect(getTimeGreeting(new Date('2024-01-01T22:00:00'))).toBe('Buenas noches');
  });
});
