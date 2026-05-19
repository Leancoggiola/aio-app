import { Avatar } from '@mantine/core';

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
    gradient={{ from: 'primary.5', to: 'primary.7', deg: 135 }}
  />
);
