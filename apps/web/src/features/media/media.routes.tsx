import { RouteObject } from 'react-router-dom';

import { MediaPage } from './media.page';

export const mediaRoute: RouteObject = {
  path: '/media',
  element: <MediaPage />,
};
