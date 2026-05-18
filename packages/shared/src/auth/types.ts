export type Role = 'ADMIN' | 'USER';

/** Usuario expuesto en login, refresh y GET /api/auth/profile (sin id). */
export interface SessionUser {
  username: string;
  name: string;
  email: string | null;
  role: Role;
  avatarUrl: string | null;
}

export interface ProfileResponse {
  user: SessionUser;
}
