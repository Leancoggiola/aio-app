import { Login } from '../pages/Login';

import type { RouteObject } from 'react-router-dom';

export const loginRoute: RouteObject = {
  path: 'login',
  element: <Login />,
};
