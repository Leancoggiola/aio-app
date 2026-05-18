import { ActionIcon, AppShell, Burger, Divider, Group, NavLink, Paper, ScrollArea, Stack, Text } from '@mantine/core';
import { FilmSlateIcon, HouseIcon, SignOutIcon } from '@phosphor-icons/react';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/core/auth';
import { useProfile } from '@/app/features/users/hooks/useProfile';

import { ColorSchemeToggle } from '../ColorSchemeToggle';
import { LogoAvatar } from '../LogoAvatar';
import { UserAvatar } from '../UserAvatar';

import type { FC } from 'react';

interface NavbarProps {
  onClose: () => void;
  toggle: () => void;
}

const NAV_ITEMS = [
  { label: 'Inicio', path: '/', icon: <HouseIcon size="1.25rem" /> },
  { label: 'Películas', path: '/media', icon: <FilmSlateIcon size="1.25rem" /> },
];

export const Navbar: FC<NavbarProps> = ({ onClose, toggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile } = useProfile();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/login');
  }, [logout, navigate]);

  const isActive = useCallback(
    (path: string) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)),
    [location.pathname]
  );

  return (
    <AppShell.Navbar px="md" py="xl">
      <AppShell.Section my="sm">
        <Group>
          <LogoAvatar />
          <Stack gap="none">
            <Text c="primary.7" size="lg">
              AIO App
            </Text>
            <Text c="primary.5" size="xs">
              All-in-One
            </Text>
          </Stack>
          <Burger opened onClick={toggle} hiddenFrom="md" size="sm" ml="auto" />
        </Group>
      </AppShell.Section>
      <Divider />
      <AppShell.Section grow my="md" component={ScrollArea}>
        <Stack gap="2xs">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              label={item.label}
              active={isActive(item.path)}
              onClick={() => handleNavigate(item.path)}
              leftSection={item.icon}
            />
          ))}
        </Stack>
      </AppShell.Section>
      <Divider />

      <AppShell.Section mt="md">
        <Paper p="sm" bg="primary.0" withBorder={false}>
          <Group gap="sm" wrap="nowrap">
            <UserAvatar name={user?.name ?? ''} src={profile?.avatarUrl} />
            <Stack gap="none">
              <Text size="sm" fw={600} c="primary.7">
                {user?.name ?? '—'}
              </Text>
              <Text size="xs" c="primary.5">
                {user?.email ?? '—'}
              </Text>
            </Stack>
            <Group ml="auto" gap="2xs">
              <ColorSchemeToggle />
              <ActionIcon variant="subtle" size="lg" onClick={handleLogout}>
                <SignOutIcon size="1rem" />
              </ActionIcon>
            </Group>
          </Group>
        </Paper>
      </AppShell.Section>
    </AppShell.Navbar>
  );
};
