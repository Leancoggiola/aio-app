import { Suspense } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { Loader } from '@mantine/core';

import { GuestRoute, ProtectedRoute } from './core/guards';
import { AuthLayout, RootLayout } from './core/layouts';
import { guestRoutes, protectedRoutes } from './routes';

const withSuspense = (routes: RouteObject[]): RouteObject[] =>
  routes.map(
    route =>
      ({
        ...route,
        element: route.element ? <Suspense fallback={<Loader />}>{route.element}</Suspense> : undefined,
        children: route.children ? withSuspense(route.children) : undefined,
      }) as RouteObject
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
