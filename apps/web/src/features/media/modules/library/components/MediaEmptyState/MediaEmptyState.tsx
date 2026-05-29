import { FC } from 'react';
import { Button, Center, Paper, Stack, Text } from '@mantine/core';

import { FilmSlateIcon, PlusIcon } from '@phosphor-icons/react';

interface MediaEmptyStateProps {
  message?: string;
  onAdd?: () => void;
}

export const MediaEmptyState: FC<MediaEmptyStateProps> = ({ message = 'No hay resultados', onAdd }) => {
  return (
    <Paper p="xl" radius="md" withBorder>
      <Center>
        <Stack align="center" gap="md">
          <FilmSlateIcon size="3rem" color="var(--mantine-color-dimmed)" />
          <Text c="dimmed" size="sm">
            {message}
          </Text>
          {onAdd && (
            <Button variant="light" leftSection={<PlusIcon size="1rem" />} onClick={onAdd}>
              Agregar
            </Button>
          )}
        </Stack>
      </Center>
    </Paper>
  );
};
