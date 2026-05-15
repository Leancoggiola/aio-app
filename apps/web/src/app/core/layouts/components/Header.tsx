import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Group,
  Text,
} from "@mantine/core";

import Logo from "../../../../assets/logo.svg?react";

import type { FC } from "react";

interface HeaderProps {
  opened: boolean;
  onToggle: () => void;
}

export const Header: FC<HeaderProps> = ({ opened, onToggle }) => {
  return (
    <AppShell.Header bg="primary.0" hiddenFrom="md" px="md" py="sm">
      <Group align="center" justify="space-between">
        <Burger opened={opened} onClick={onToggle} size="md" />
        <Group gap="xs">
          <Avatar
            size={32}
            variant="filled"
            color="primary.2"
            radius="md"
            style={{ boxShadow: "var(--mantine-shadow-lg)" }}
          >
            <Logo style={{ padding: "0.25rem" }} />
          </Avatar>
          <Text c="primary.7" fw={600}>
            AIO App
          </Text>
        </Group>
        <Group>
          <ActionIcon radius="full" variant="transparent" size="lg">
            <Avatar
              size="md"
              name="JON DOW"
              variant="gradient"
              gradient={{ from: "primary.5", to: "primary.7", deg: 135 }}
            />
          </ActionIcon>
        </Group>
      </Group>
    </AppShell.Header>
  );
};
