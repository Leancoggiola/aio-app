import { Avatar, Group, Paper, Stack, Text } from '@mantine/core';
import { StarIcon } from '@phosphor-icons/react/dist/ssr';

import type { FC } from 'react';

export const HomePage: FC = () => {
  return (
    <Paper p="2xl">
      <Group wrap="nowrap" justify="space-between" mb="xl">
        <Stack gap="2xs">
          <Text c="primary.5" fz="sm">
            Buenas Tardes
          </Text>
          <Text c="primary.7" fz="1.5rem" fw={600}>
            Nombre
          </Text>
        </Stack>
        <Avatar size="lg">
          <StarIcon />
        </Avatar>
      </Group>
    </Paper>
  );
};
