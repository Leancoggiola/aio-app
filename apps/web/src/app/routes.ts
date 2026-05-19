import { loginRoute } from '@/features/auth';
import { homeRoute } from '@/features/home';
import { mediaRoute } from '@/features/media';
import { profileRoute } from '@/features/profile';

export const protectedRoutes = [homeRoute, mediaRoute, profileRoute];
export const guestRoutes = [loginRoute];
