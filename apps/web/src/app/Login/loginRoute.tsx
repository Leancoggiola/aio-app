import { RouteObject } from "react-router-dom";
import { LoginPage } from "./Login";

export const loginRoute: RouteObject = {
  path: "login",
  element: <LoginPage />,
};
