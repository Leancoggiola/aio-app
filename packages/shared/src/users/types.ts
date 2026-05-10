export interface UserPreferences {
  id: string;
  userId: string;
  notifications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
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
