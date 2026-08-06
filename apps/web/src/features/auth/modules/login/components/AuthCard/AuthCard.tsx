import { Avatar, Center, Paper, Stack, Title } from '@mantine/core';

import logoUrl from '@/assets/logo.png';

import type { FC, ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export const AuthCard: FC<AuthCardProps> = ({ title, children }) => {
  return (
    <Paper miw="25rem" p="lg">
      <Stack gap="xl" justify="center">
        <Center>
          <Avatar
            src={logoUrl}
            alt="Omni-logo"
            size="xl"
            radius="md"
            styles={{ image: { objectFit: 'contain', padding: '5%' }, root: { boxShadow: 'var(--mantine-shadow-md)' } }}
          />
        </Center>
        <Title order={2} fw={700} ta="center">
          {title}
        </Title>
        {children}
      </Stack>
    </Paper>
  );
};
