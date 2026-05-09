import { Loader } from "@mantine/core";
import { Suspense } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { RootLayout, AuthLayout } from "./core/layouts";
import { ProtectedRoute, GuestRoute } from "./core/guards";
import { protectedRoutes, guestRoutes } from "./routes";

const withSuspense = (routes: RouteObject[]): RouteObject[] =>
  routes.map(
    (route) =>
      ({
        ...route,
        element: route.element ? (
          <Suspense fallback={<Loader />}>{route.element}</Suspense>
        ) : undefined,
        children: route.children ? withSuspense(route.children) : undefined,
      }) as RouteObject,
  );

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RootLayout />,
        children: withSuspense(protectedRoutes),
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: withSuspense(guestRoutes),
      },
    ],
  },
]);
