import { type FC, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppShell,
  Avatar,
  Burger,
  Divider,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";

import Logo from "../../../../assets/logo.svg?react";

import type { User } from "@aio-app/shared/auth";

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onClose: () => void;
  toggle: () => void;
}

const NAV_ITEMS = [
  { label: "Inicio", path: "/" },
  { label: "Media Tracker", path: "/media" },
];

export const Navbar: FC<NavbarProps> = ({
  user,
  onLogout,
  onClose,
  toggle,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const isActive = useCallback(
    (path: string) =>
      path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(path),
    [location.pathname],
  );

  return (
    <AppShell.Navbar px="md" py="xl">
      <AppShell.Section my="sm">
        <Group>
          <Avatar
            size="md"
            variant="filled"
            color="primary.2"
            radius="md"
            style={{ boxShadow: "var(--mantine-shadow-lg)" }}
          >
            <Logo style={{ padding: "0.25rem" }} />
          </Avatar>
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
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              label={item.label}
              active={isActive(item.path)}
              onClick={() => handleNavigate(item.path)}
              bdrs="lg"
            />
          ))}
        </Stack>
      </AppShell.Section>
      <Divider />

      <AppShell.Section>
        <NavLink
          label={`Cerrar sesión${user ? ` (${user.name})` : ""}`}
          onClick={() => onLogout()}
          c="red"
        />
      </AppShell.Section>
    </AppShell.Navbar>
  );
};
