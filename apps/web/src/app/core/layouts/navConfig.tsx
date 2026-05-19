import {
  BarbellIcon,
  DesktopIcon,
  FilmSlateIcon,
  GearIcon,
  HouseIcon,
  PackageIcon,
  UserIcon,
  UsersThreeIcon,
  WalletIcon,
} from '@phosphor-icons/react';

import type { ReactNode } from 'react';

const iconSize = '1.25rem';

export interface NavItemConfig {
  label: string;
  path?: string;
  disabled?: boolean;
  icon: ReactNode;
}

export const MAIN_NAV_ITEMS: NavItemConfig[] = [
  { label: 'Inicio', path: '/', icon: <HouseIcon size={iconSize} /> },
  { label: 'Películas', path: '/media', icon: <FilmSlateIcon size={iconSize} /> },
  { label: 'Gimnasio', disabled: true, icon: <BarbellIcon size={iconSize} /> },
  { label: 'Gastos', disabled: true, icon: <WalletIcon size={iconSize} /> },
  { label: 'PC Control', disabled: true, icon: <DesktopIcon size={iconSize} /> },
  { label: 'Alacena', disabled: true, icon: <PackageIcon size={iconSize} /> },
  { label: 'Dividir gastos', disabled: true, icon: <UsersThreeIcon size={iconSize} /> },
  { label: 'Perfil', path: '/profile', icon: <UserIcon size={iconSize} /> },
];

export const ADMIN_NAV_ITEMS: NavItemConfig[] = [
  { label: 'Administración', disabled: true, icon: <GearIcon size={iconSize} /> },
];
