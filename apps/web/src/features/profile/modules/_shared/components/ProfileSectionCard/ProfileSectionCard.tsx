import { Paper, Stack, Text, Title } from '@mantine/core';

import type { FC, ReactNode } from 'react';

interface ProfileSectionCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const ProfileSectionCard: FC<ProfileSectionCardProps> = ({ title, subtitle, children }) => (
  <Paper shadow="sm">
    <Stack gap="lg">
      <Stack gap="2xs">
        <Title order={4} fw={600}>
          {title}
        </Title>
        <Text c="dimmed" size="sm">
          {subtitle}
        </Text>
      </Stack>
      {children}
    </Stack>
  </Paper>
);
