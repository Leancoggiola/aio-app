import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError, fetcher } from '../fetcher';

describe('ApiError', () => {
  it('stores status and info', () => {
    const err = new ApiError('Not found', 404, { code: 'X' });
    expect(err.name).toBe('ApiError');
    expect(err.message).toBe('Not found');
    expect(err.status).toBe(404);
    expect(err.info).toEqual({ code: 'X' });
  });
});

describe('fetcher', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns parsed json on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ok: true }),
      })
    );

    await expect(fetcher('https://example.test/resource')).resolves.toEqual({ ok: true });
  });

  it('throws ApiError on failure with message from body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ message: 'Invalid' }),
      })
    );

    await expect(fetcher('https://example.test/resource')).rejects.toMatchObject({
      name: 'ApiError',
      message: 'Invalid',
      status: 400,
    });
  });

  it('falls back to statusText when body is not json', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json: () => Promise.reject(new Error('no json')),
      })
    );

    await expect(fetcher('https://example.test/resource')).rejects.toMatchObject({
      message: 'Server Error',
      status: 500,
    });
  });
});
