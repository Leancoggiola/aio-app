import { Avatar, Center, Paper, Stack, Title } from '@mantine/core';

import logoUrl from '@/assets/logo.png';

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
            src={logoUrl}
            alt="Omni"
            size="xl"
            variant="filled"
            color="brand.2"
            radius="md"
            imageProps={{ style: { objectFit: 'contain', padding: '15%' } }}
            style={{ boxShadow: 'var(--mantine-shadow-md)' }}
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
