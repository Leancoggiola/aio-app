import { loginRoute, registerRoute } from "./features/auth";
import { homeRoute } from "./features/home";
import { mediaTrackerRoute } from "./features/mediaTracker";

export const protectedRoutes = [homeRoute, mediaTrackerRoute];
export const guestRoutes = [loginRoute, registerRoute];
