import { Avatar, Center, Paper, Stack, Title } from '@mantine/core';

import Logo from '@/assets/logo.svg?react';

import type { FC, ReactNode } from 'react';

interface AuthCardProps {
  title: ReactNode;
  children: ReactNode;
}

export const AuthCard: FC<AuthCardProps> = ({ title, children }) => {
  return (
    <Paper miw="25rem" p="lg">
      <Stack gap="xl" justify="center">
        <Center>
          <Avatar
            size="xl"
            variant="filled"
            color="brand.2"
            radius="md"
            style={{ boxShadow: 'var(--mantine-shadow-md)' }}
          >
            <Logo style={{ padding: '0.5rem' }} />
          </Avatar>
        </Center>
        <Title order={2} fw={700} ta="center">
          {title}
        </Title>
        {children}
      </Stack>
    </Paper>
  );
};
