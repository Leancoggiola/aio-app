import type { RouteObject } from "react-router-dom";
import { Register } from "../pages/Register";

export const registerRoute: RouteObject = {
  path: "register",
  element: <Register />,
};
