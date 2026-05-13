export interface UserPreferences {
  id: string;
  userId: string;
  notifications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string | null;
  role: "ADMIN" | "USER";
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences | null;
}

export interface UserStats {
  id: string;
  userId: string;
  totalMovies: number;
  totalTvShows: number;
  totalWatched: number;
  totalWatching: number;
  totalToWatch: number;
  updatedAt: string;
}
