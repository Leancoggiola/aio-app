import { RouteObject } from "react-router-dom";
import { MediaPage } from "./Media";

export const mediaRoute: RouteObject = {
  path: "media",
  element: <MediaPage />,
};
