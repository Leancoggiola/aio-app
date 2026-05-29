import { describe, expect, it } from 'vitest';

import { buildQueryString, SWR_KEYS } from '../keys';

describe('SWR_KEYS', () => {
  it('exposes media listItem helper', () => {
    const id = 'abc';
    expect(SWR_KEYS.media.listItem(id)).toBe(`${SWR_KEYS.media.list}/${id}`);
  });
});

describe('buildQueryString', () => {
  it('returns empty string when no params', () => {
    expect(buildQueryString({})).toBe('');
  });

  it('sorts keys alphabetically', () => {
    expect(buildQueryString({ z: '1', a: '2', m: '3' })).toBe('?a=2&m=3&z=1');
  });

  it('skips null, undefined and empty string', () => {
    expect(buildQueryString({ a: null, b: undefined, c: '', d: 'ok' })).toBe('?d=ok');
  });

  it('stringifies numbers', () => {
    expect(buildQueryString({ page: 2 })).toBe('?page=2');
  });
});
