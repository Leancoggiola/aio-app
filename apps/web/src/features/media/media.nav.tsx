import type { NavItemConfig } from '@/layouts/navConfig';

import { FilmSlateIcon } from '@phosphor-icons/react';

const iconSize = '1.25rem';

export const mediaNavItem: NavItemConfig = {
  label: 'Películas',
  path: '/media',
  icon: <FilmSlateIcon size={iconSize} />,
};
