import { FC, useMemo } from 'react';
import { Center, Loader, SimpleGrid, Stack } from '@mantine/core';

import { MediaCard } from '../MediaCard';
import { MediaEmptyState } from '../MediaEmptyState';

import type { MediaItem, MediaStatus } from '../../../_shared/types';

interface MyMediaListProps {
  items: MediaItem[] | undefined;
  isLoading: boolean;
  searchText: string;
  onAdd: () => void;
  onStatusChange: (id: string, status: MediaStatus) => void;
  onDelete: (item: MediaItem) => void | Promise<void>;
}

export const MyMediaList: FC<MyMediaListProps> = ({
  items,
  isLoading,
  searchText,
  onAdd,
  onStatusChange,
  onDelete,
}) => {
  const filteredItems = useMemo(() => {
    if (!items) return [];
    const q = searchText.trim().toLowerCase();
    if (!q) return items;
    return items.filter(item => item.title.toLowerCase().includes(q));
  }, [items, searchText]);

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (!items || items.length === 0) {
    return <MediaEmptyState message="Tu lista está vacía" onAdd={onAdd} />;
  }

  if (filteredItems.length === 0) {
    return <MediaEmptyState message="No hay resultados" />;
  }

  return (
    <Stack gap="md">
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="md">
        {filteredItems.map(item => (
          <MediaCard key={item.id} item={item} onStatusChange={onStatusChange} onDelete={onDelete} />
        ))}
      </SimpleGrid>
    </Stack>
  );
};
