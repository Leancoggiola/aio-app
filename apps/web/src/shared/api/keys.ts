export const SWR_KEYS = {
  auth: {
    profile: '/api/auth/profile',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
  },
  users: {
    profile: '/api/users/profile',
    preferences: '/api/users/preferences',
    password: '/api/users/password',
    account: '/api/users/account',
  },
  media: {
    list: '/api/media/list',
    search: '/api/media/search',
    listItem: (id: string) => `/api/media/list/${id}`,
  },
} as const;

export function buildQueryString(params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams();
  for (const key of Object.keys(params).sort()) {
    const value = params[key];
    if (value != null && value !== '') {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}
