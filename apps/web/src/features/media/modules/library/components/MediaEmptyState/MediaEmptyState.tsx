import { FC } from 'react';
import { Button, EmptyState, Paper } from '@mantine/core';

import { FilmSlateIcon, PlusIcon } from '@phosphor-icons/react';

interface MediaEmptyStateProps {
  message?: string;
  onAdd?: () => void;
}

export const MediaEmptyState: FC<MediaEmptyStateProps> = ({ message = 'No hay resultados', onAdd }) => {
  return (
    <Paper p="xl" radius="md" withBorder>
      <EmptyState icon={<FilmSlateIcon />} title={message} withIndicatorBackground size="md" align="center">
        {onAdd && (
          <EmptyState.Actions>
            <Button variant="light" leftSection={<PlusIcon size="1rem" />} onClick={onAdd}>
              Agregar
            </Button>
          </EmptyState.Actions>
        )}
      </EmptyState>
    </Paper>
  );
};
