import type { RouteObject } from "react-router-dom";
import { Login } from "../pages/Login";

export const loginRoute: RouteObject = {
  path: "login",
  element: <Login />,
};
