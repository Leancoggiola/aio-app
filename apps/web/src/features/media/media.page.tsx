import { FC, useCallback, useState } from 'react';
import { Stack, Tabs, Title } from '@mantine/core';

import {
  MediaSearchBar,
  MediaSearchResults,
  MyMediaList,
  useMediaMutations,
  useMediaSearch,
  useMyMediaList,
} from './modules';

import type { MediaFilters, MediaStatus, MediaType } from './modules';

export const MediaPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('multi');
  const { data: searchData, isLoading: searchLoading } = useMediaSearch(searchQuery, 1, searchType);

  const [filters, setFilters] = useState<MediaFilters>({});
  const { data: listData, isLoading: listLoading } = useMyMediaList(filters);

  const { addToList, updateStatus, removeFromList } = useMediaMutations();

  const [activeTab, setActiveTab] = useState<string | null>('list');

  const existingTmdbIds = new Set<string>();
  if (listData) {
    listData.forEach(item => existingTmdbIds.add(`${item.mediaType}-${item.tmdbId}`));
  }

  const handleSearch = useCallback((query: string, type: string) => {
    setSearchQuery(query);
    setSearchType(type);
  }, []);

  const handleAdd = useCallback(
    async (tmdbId: number, mediaType: MediaType, status: MediaStatus) => {
      try {
        await addToList(tmdbId, mediaType, status);
      } catch {
        // Error handled by ApiError
      }
    },
    [addToList]
  );

  const handleStatusChange = useCallback(
    async (id: string, status: MediaStatus) => {
      try {
        await updateStatus(id, status);
      } catch {
        // Error handled by ApiError
      }
    },
    [updateStatus]
  );

  const handleRemove = useCallback(
    async (id: string) => {
      try {
        await removeFromList(id);
      } catch {
        // Error handled by ApiError
      }
    },
    [removeFromList]
  );

  return (
    <Stack gap="lg">
      <Title order={2}>Películas y series</Title>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="list">Mi Lista</Tabs.Tab>
          <Tabs.Tab value="search">Buscar</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="search" pt="md">
          <Stack gap="md">
            <MediaSearchBar onSearch={handleSearch} />
            {searchQuery.trim() && (
              <MediaSearchResults
                results={searchData?.results ?? []}
                isLoading={searchLoading}
                existingTmdbIds={existingTmdbIds}
                onAdd={handleAdd}
              />
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="list" pt="md">
          <MyMediaList
            items={listData}
            isLoading={listLoading}
            filters={filters}
            onFiltersChange={setFilters}
            onStatusChange={handleStatusChange}
            onRemove={handleRemove}
          />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
