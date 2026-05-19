import type { Role, SessionUser } from './types';

type SessionUserSource = {
  username: string;
  name: string;
  email: string | null;
  role: Role;
  avatarUrl: string | null;
};

/** Mapea un usuario de BD o perfil a la forma expuesta en endpoints de auth. */
export function toSessionUser(user: SessionUserSource): SessionUser {
  return {
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
  };
}
