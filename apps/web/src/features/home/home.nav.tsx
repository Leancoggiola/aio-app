import type { NavItemConfig } from '@/layouts/navConfig';

import { HouseIcon } from '@phosphor-icons/react';

const iconSize = '1.25rem';

export const homeNavItem: NavItemConfig = {
  label: 'Inicio',
  path: '/',
  icon: <HouseIcon size={iconSize} />,
};
