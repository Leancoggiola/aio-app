import { RouteObject } from 'react-router-dom';

import { ProfilePage } from './profile.page';

export const profileRoute: RouteObject = {
  path: '/profile',
  element: <ProfilePage />,
};
