import { Loader } from "@mantine/core";
import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./Layouts";
import { routes } from "./routes";

const withSuspense = (routes: any[]): any[] =>
  routes.map((route) => ({
    ...route,
    element: route.element ? (
      <Suspense fallback={<Loader />}>{route.element}</Suspense>
    ) : undefined,
    children: route.children ? withSuspense(route.children) : undefined,
  }));

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: withSuspense(routes),
  },
]);
