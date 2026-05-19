import type { NavItemConfig } from '@/layouts/navConfig';

import { UserIcon } from '@phosphor-icons/react';

const iconSize = '1.25rem';

export const profileNavItem: NavItemConfig = {
  label: 'Perfil',
  path: '/profile',
  icon: <UserIcon size={iconSize} />,
};
