import { useAuth } from '@/app/core/auth';
import { AppShell, Burger, Group, Text } from '@mantine/core';

import { ColorSchemeToggle } from '../ColorSchemeToggle';
import { LogoAvatar } from '../LogoAvatar';
import { UserAvatar } from '../UserAvatar';

import type { FC } from 'react';

interface HeaderProps {
  opened: boolean;
  onToggle: () => void;
}

export const Header: FC<HeaderProps> = ({ opened, onToggle }) => {
  const { user } = useAuth();

  return (
    <AppShell.Header bg="primary.0" hiddenFrom="md" px="md" py="sm">
      <Group align="center" justify="space-between">
        <Burger opened={opened} onClick={onToggle} size="md" />
        <Group gap="xs">
          <LogoAvatar size={32} />
          <Text c="primary.7" fw={600}>
            AIO App
          </Text>
        </Group>
        <Group>
          <ColorSchemeToggle />
          <UserAvatar name={user?.name ?? ''} src={user?.avatarUrl} />
        </Group>
      </Group>
    </AppShell.Header>
  );
};
