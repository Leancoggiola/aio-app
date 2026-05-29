import { FC } from 'react';
import { Group, Paper, Select, Stack, Tabs, TextInput } from '@mantine/core';

import type { MediaStatus, MediaType } from '../../../_shared/types';

import { MEDIA_STATUS_LABELS, MEDIA_TYPE_LABELS } from '@aio-app/shared/media';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';

const TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'Todos' },
  ...(Object.entries(MEDIA_TYPE_LABELS) as [MediaType, string][]).map(([value, label]) => ({
    value,
    label,
  })),
];

interface MediaListToolbarProps {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  statusFilter: MediaStatus | 'all';
  onStatusFilterChange: (value: MediaStatus | 'all') => void;
  typeFilter: MediaType | 'all';
  onTypeFilterChange: (value: MediaType | 'all') => void;
}

export const MediaListToolbar: FC<MediaListToolbarProps> = ({
  searchText,
  onSearchTextChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
}) => {
  return (
    <Stack gap="md">
      <Paper p="md" radius="md" shadow="xs" withBorder>
        <Group gap="md" align="flex-end" wrap="wrap">
          <TextInput
            placeholder="Buscar..."
            value={searchText}
            onChange={e => onSearchTextChange(e.currentTarget.value)}
            leftSection={<MagnifyingGlassIcon size="1rem" />}
            style={{ flex: 1, minWidth: '12rem' }}
            size="md"
          />
          <Select
            label="Tipo"
            labelProps={{
              style: { position: 'absolute', width: '0.0625rem', height: '0.0625rem', overflow: 'hidden' },
            }}
            aria-label="Filtrar por tipo"
            data={TYPE_FILTER_OPTIONS}
            value={typeFilter}
            onChange={val => onTypeFilterChange((val as MediaType | 'all') || 'all')}
            w={{ base: '100%', xs: '8.75rem' }}
            size="md"
          />
        </Group>
      </Paper>

      <Tabs value={statusFilter} onChange={val => onStatusFilterChange((val as MediaStatus | 'all') || 'all')}>
        <Tabs.List>
          <Tabs.Tab value="all">Todos</Tabs.Tab>
          {(Object.entries(MEDIA_STATUS_LABELS) as [MediaStatus, string][]).map(([status, label]) => (
            <Tabs.Tab key={status} value={status}>
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </Stack>
  );
};
