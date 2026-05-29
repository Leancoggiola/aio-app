import { FC, useCallback, useMemo, useState } from 'react';
import { Stack } from '@mantine/core';

import { confirm, getErrorMessage, notifyError, notifySuccess } from '@/shared/ui';

import {
  AddMediaModal,
  buildMediaTmdbKey,
  MediaListToolbar,
  MediaPageHeader,
  MyMediaList,
  useMediaMutations,
  useMyMediaList,
} from './modules';

import type { MediaFilters, MediaItem, MediaStatus, MediaType } from './modules';

export const MediaPage: FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<MediaStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all');
  const [addOpened, setAddOpened] = useState(false);

  const filters = useMemo<MediaFilters>(
    () => ({
      ...(statusFilter !== 'all' && { status: statusFilter }),
      ...(typeFilter !== 'all' && { mediaType: typeFilter }),
    }),
    [statusFilter, typeFilter]
  );

  const { data: listData, isLoading: listLoading } = useMyMediaList(filters);
  const { addToList, updateStatus, removeFromList } = useMediaMutations();

  const existingTmdbIds = useMemo(() => {
    const set = new Set<string>();
    listData?.forEach(item => set.add(buildMediaTmdbKey(item.mediaType, item.tmdbId)));
    return set;
  }, [listData]);

  const handleAdd = useCallback(
    async (tmdbId: number, mediaType: MediaType, status: MediaStatus, streamingReleaseDate?: string | null) => {
      await addToList(tmdbId, mediaType, status, streamingReleaseDate);
    },
    [addToList]
  );

  const handleStatusChange = useCallback(
    async (id: string, status: MediaStatus) => {
      try {
        await updateStatus(id, status);
        notifySuccess('Estado actualizado');
      } catch (err) {
        notifyError(getErrorMessage(err, 'No se pudo actualizar el estado'));
      }
    },
    [updateStatus]
  );

  const handleDelete = useCallback(
    async (item: MediaItem) => {
      const confirmed = await confirm({
        title: '¿Eliminar?',
        description: 'Esta acción no se puede deshacer.',
        confirmLabel: 'Eliminar',
      });

      if (!confirmed) return;

      try {
        await removeFromList(item.id);
        notifySuccess('Eliminado de tu lista');
      } catch (err) {
        notifyError(getErrorMessage(err, 'No se pudo eliminar de la lista'));
      }
    },
    [removeFromList]
  );

  return (
    <Stack gap="lg">
      <MediaPageHeader onAdd={() => setAddOpened(true)} />

      <MediaListToolbar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <MyMediaList
        items={listData}
        isLoading={listLoading}
        searchText={searchText}
        onAdd={() => setAddOpened(true)}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />

      <AddMediaModal
        opened={addOpened}
        onClose={() => setAddOpened(false)}
        onSubmit={handleAdd}
        existingTmdbIds={existingTmdbIds}
      />
    </Stack>
  );
};
