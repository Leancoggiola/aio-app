export type Role = "ADMIN" | "USER";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  user: User;
}
