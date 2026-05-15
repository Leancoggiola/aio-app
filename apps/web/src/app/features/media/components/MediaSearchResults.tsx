import { FC } from 'react';
import { Badge, Button, Card, Center, Group, Image, Loader, Menu, SimpleGrid, Stack, Text } from '@mantine/core';

import type { MediaStatus, MediaType, TmdbMediaResult } from '../types';

import { MEDIA_STATUS_LABELS, MEDIA_TYPE_LABELS, TMDB_POSTER_W300 } from '@aio-app/shared/media';

interface MediaSearchResultsProps {
  results: TmdbMediaResult[];
  isLoading: boolean;
  existingTmdbIds: Set<string>;
  onAdd: (tmdbId: number, mediaType: MediaType, status: MediaStatus) => void;
}

export const MediaSearchResults: FC<MediaSearchResultsProps> = ({ results, isLoading, existingTmdbIds, onAdd }) => {
  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (results.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No se encontraron resultados
      </Text>
    );
  }

  return (
    <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md">
      {results.map(item => {
        const mediaType =
          item.media_type === 'tv' ? 'tv' : item.media_type === 'movie' ? 'movie' : item.title ? 'movie' : 'tv';
        const title = item.title || item.name || 'Sin título';
        const key = `${mediaType}-${item.id}`;
        const alreadyAdded = existingTmdbIds.has(key);

        return (
          <Card key={`${item.id}-${mediaType}`} shadow="sm" padding="sm" radius="md" withBorder>
            <Card.Section>
              <Image
                src={item.poster_path ? `${TMDB_POSTER_W300}${item.poster_path}` : undefined}
                h={220}
                alt={title}
                fallbackSrc="https://placehold.co/300x450?text=No+Image"
              />
            </Card.Section>

            <Stack gap={4} mt="xs">
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Text fw={600} size="sm" lineClamp={2} style={{ flex: 1 }}>
                  {title}
                </Text>
                <Badge
                  size="xs"
                  variant="light"
                  color={mediaType === 'movie' ? 'blue' : 'violet'}
                  style={{ flexShrink: 0 }}
                >
                  {MEDIA_TYPE_LABELS[mediaType]}
                </Badge>
              </Group>
            </Stack>

            {alreadyAdded ? (
              <Button fullWidth mt="sm" size="xs" variant="light" color="teal" disabled>
                Ya en tu lista
              </Button>
            ) : (
              <Menu shadow="md" width={180}>
                <Menu.Target>
                  <Button fullWidth mt="sm" size="xs" variant="light">
                    Agregar a mi lista
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {(Object.entries(MEDIA_STATUS_LABELS) as [MediaStatus, string][]).map(([status, label]) => (
                    <Menu.Item key={status} onClick={() => onAdd(item.id, mediaType, status)}>
                      {label}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            )}
          </Card>
        );
      })}
    </SimpleGrid>
  );
};
