import { RouteObject } from "react-router-dom";
import { MediaTrackerPage } from "./MediaTracker";

export const mediaTrackerRoute: RouteObject = {
  path: "media",
  element: <MediaTrackerPage />,
};
