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
    alt="Omni"
    size={size}
    variant="filled"
    color="brand.2"
    radius="md"
    imageProps={{ style: { objectFit: 'contain', padding: '15%' } }}
    style={{ boxShadow: 'var(--mantine-shadow-brand)' }}
  />
);
