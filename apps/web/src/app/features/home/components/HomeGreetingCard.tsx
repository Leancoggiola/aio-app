import { ActionIcon, Group, Paper, Skeleton, Stack, Text } from '@mantine/core';

import { useAuth } from '@/app/core/auth';

import { getTimeGreeting } from '../utils/getTimeGreeting';

import type { FC } from 'react';

import { SparkleIcon } from '@phosphor-icons/react';

export const HomeGreetingCard: FC = () => {
  const { user, isLoading } = useAuth();
  const greeting = getTimeGreeting();

  return (
    <Paper>
      <Group wrap="nowrap" justify="space-between" align="center">
        <Stack gap="2xs">
          <Text c="primary.5" fz="sm">
            {greeting}
          </Text>
          {isLoading ? (
            <Skeleton height={28} width={160} />
          ) : (
            <Text c="primary.7" fz="1.5rem" fw={600}>
              {user?.name}
            </Text>
          )}
        </Stack>
        <ActionIcon
          size="3rem"
          radius="xl"
          color="primary"
          variant="gradient"
          gradient={{ from: 'primary.5', to: 'primary.7', deg: 135 }}
          tabIndex={-1}
          style={{ pointerEvents: 'none' }}
        >
          <SparkleIcon size="2rem" weight="fill" aria-hidden />
        </ActionIcon>
      </Group>
    </Paper>
  );
};
