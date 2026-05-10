import { RouteObject } from "react-router-dom";
import { ProfilePage } from "../pages/Profile";

export const profileRoute: RouteObject = {
  path: "profile",
  element: <ProfilePage />,
};
