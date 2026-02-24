import { RouteObject } from "react-router-dom";
import { RegisterPage } from "./Register";

export const registerRoute: RouteObject = {
  path: "register",
  element: <RegisterPage />,
};
