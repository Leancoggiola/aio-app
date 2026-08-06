import { FC } from 'react';
import { Button, Center, Group, SegmentedControl, Stack, Text, Title } from '@mantine/core';

import { GridFourIcon, ListIcon, PlusIcon } from '@phosphor-icons/react';

interface MediaPageHeaderProps {
  onAdd: () => void;
  displayMode: string;
  onDisplayChange: (value: string) => void;
}

export const MediaPageHeader: FC<MediaPageHeaderProps> = ({ onAdd, displayMode, onDisplayChange }) => {
  return (
    <Group justify="space-between" align="center" wrap="wrap" gap="md">
      <Stack gap="3xs">
        <Title order={1}>Películas y Series</Title>
        <Text c="dimmed" size="md">
          Tu lista de seguimiento
        </Text>
      </Stack>
      <Group gap="xs">
        <SegmentedControl
          value={displayMode}
          onChange={onDisplayChange}
          radius="md"
          size="sm"
          color="brand.6"
          bg="white"
          styles={{ label: { padding: '4px' } }}
          data={[
            {
              value: 'grid',
              label: (
                <Center>
                  <GridFourIcon size={20} />
                </Center>
              ),
            },
            {
              value: 'list',
              label: (
                <Center>
                  <ListIcon size={20} />
                </Center>
              ),
            },
          ]}
        />
        <Button variant="gradient" size="sm" leftSection={<PlusIcon size="1rem" weight="bold" />} onClick={onAdd}>
          Agregar
        </Button>
      </Group>
    </Group>
  );
};
