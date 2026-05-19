import { describe, expect, it } from 'vitest';

import { getTimeGreeting } from '../utils/getTimeGreeting';

describe('getTimeGreeting', () => {
  it('devuelve Buenos días por la mañana', () => {
    expect(getTimeGreeting(new Date(2026, 0, 1, 8, 0))).toBe('Buenos días');
  });

  it('devuelve Buenas tardes al mediodía', () => {
    expect(getTimeGreeting(new Date(2026, 0, 1, 15, 0))).toBe('Buenas tardes');
  });

  it('devuelve Buenas noches de noche', () => {
    expect(getTimeGreeting(new Date(2026, 0, 1, 22, 0))).toBe('Buenas noches');
  });
});
