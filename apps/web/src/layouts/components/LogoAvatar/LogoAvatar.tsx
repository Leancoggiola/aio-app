import { Avatar } from '@mantine/core';

import logoUrl from '@/assets/logo.png';

import type { MantineSize } from '@mantine/core';
import type { FC } from 'react';

interface LogoAvatarProps {
  size?: MantineSize | number;
}

export const LogoAvatar: FC<LogoAvatarProps> = ({ size = 'md' }) => (
  <Avatar
    src={logoUrl}
    alt="Omni-logo"
    size={size}
    radius="md"
    bg="brand.2"
    styles={{ image: { objectFit: 'contain', padding: '10%' }, root: { boxShadow: 'var(--mantine-shadow-md)' } }}
  />
);
