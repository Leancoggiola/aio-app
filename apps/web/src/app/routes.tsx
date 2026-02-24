import { homeRoute } from "./Home";
import { loginRoute } from "./Login";
import { mediaTrackerRoute } from "./MediaTracker";
import { registerRoute } from "./Register";

export const protectedRoutes = [homeRoute, mediaTrackerRoute];
export const guestRoutes = [loginRoute, registerRoute];
