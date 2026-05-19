import { Avatar } from '@mantine/core';

import { GRADIENTS } from '@/theme/gradients';

import type { MantineSize } from '@mantine/core';
import type { FC } from 'react';

interface UserAvatarProps {
  name: string;
  src?: string | null;
  size?: MantineSize | number;
}

export const UserAvatar: FC<UserAvatarProps> = ({ name, src, size = 'md' }) => (
  <Avatar
    src={src ?? undefined}
    size={size}
    name={name}
    variant="gradient"
    gradient={GRADIENTS.brand}
    style={{ boxShadow: 'var(--mantine-shadow-brand)' }}
  />
);
