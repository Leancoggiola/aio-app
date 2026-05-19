import { Avatar } from '@mantine/core';

import Logo from '@/assets/logo.svg?react';

import type { MantineSize } from '@mantine/core';
import type { FC } from 'react';

interface LogoAvatarProps {
  size?: MantineSize | number;
}

export const LogoAvatar: FC<LogoAvatarProps> = ({ size = 'md' }) => (
  <Avatar size={size} variant="filled" color="primary.2" radius="md" style={{ boxShadow: 'var(--mantine-shadow-lg)' }}>
    <Logo style={{ padding: '0.25rem' }} />
  </Avatar>
);
