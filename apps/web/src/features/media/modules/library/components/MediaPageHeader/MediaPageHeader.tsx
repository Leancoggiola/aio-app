import { FC } from 'react';
import { Button, Group, Stack, Text, Title } from '@mantine/core';

import { PlusIcon } from '@phosphor-icons/react';

interface MediaPageHeaderProps {
  onAdd: () => void;
}

export const MediaPageHeader: FC<MediaPageHeaderProps> = ({ onAdd }) => {
  return (
    <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
      <Stack gap="0.25rem">
        <Title order={2}>Películas y Series</Title>
        <Text c="dimmed" size="sm">
          Tu lista de seguimiento
        </Text>
      </Stack>
      <Button leftSection={<PlusIcon size="1rem" weight="bold" />} onClick={onAdd}>
        Agregar
      </Button>
    </Group>
  );
};
