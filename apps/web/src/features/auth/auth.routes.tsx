import { RouteObject } from 'react-router-dom';

import { LoginPage } from './modules/login';

export const loginRoute: RouteObject = {
  path: '/login',
  element: <LoginPage />,
};
