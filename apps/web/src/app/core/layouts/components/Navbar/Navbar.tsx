import { ActionIcon, AppShell, Burger, Divider, Group, NavLink, Paper, ScrollArea, Stack, Text } from '@mantine/core';
import { SignOutIcon } from '@phosphor-icons/react';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/core/auth';
import { ADMIN_NAV_ITEMS, MAIN_NAV_ITEMS } from '@/app/core/layouts/navConfig';

import { ColorSchemeToggle } from '../ColorSchemeToggle';
import { LogoAvatar } from '../LogoAvatar';
import { UserAvatar } from '../UserAvatar';

import type { FC } from 'react';
import type { NavItemConfig } from '@/app/core/layouts/navConfig';

interface NavbarProps {
  onClose: () => void;
  toggle: () => void;
}

export const Navbar: FC<NavbarProps> = ({ onClose, toggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path);
      onClose();
    },
    [navigate, onClose]
  );

  const isActive = useCallback(
    (path: string) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)),
    [location.pathname]
  );

  const renderNavItem = (item: NavItemConfig) => {
    const isDisabled = item.disabled || !item.path;

    return (
      <NavLink
        key={item.label}
        label={item.label}
        leftSection={item.icon}
        active={!isDisabled && item.path ? isActive(item.path) : false}
        disabled={isDisabled}
        onClick={isDisabled || !item.path ? undefined : () => handleNavigate(item.path!)}
      />
    );
  };

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
          {MAIN_NAV_ITEMS.map(renderNavItem)}
          {user?.role === 'ADMIN' && (
            <>
              <Text size="xs" tt="uppercase" c="primary.5" fw={600} mt="sm" mb="2xs" px="sm">
                Admin
              </Text>
              {ADMIN_NAV_ITEMS.map(renderNavItem)}
            </>
          )}
        </Stack>
      </AppShell.Section>
      <Divider />

      <AppShell.Section mt="md">
        <Paper p="sm" bg="primary.0" withBorder={false}>
          <Group gap="sm" wrap="nowrap">
            <UserAvatar name={user?.name ?? ''} src={user?.avatarUrl} />
            <Stack gap="none">
              <Text size="sm" fw={600} c="primary.7">
                {user?.name ?? '—'}
              </Text>
              <Text size="xs" c="primary.5">
                {user?.email ?? '—'}
              </Text>
            </Stack>
            <Group ml="auto" gap="2xs" wrap="nowrap">
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
