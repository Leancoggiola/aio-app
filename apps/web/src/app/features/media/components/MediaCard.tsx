import { FC } from 'react';
import { ActionIcon, Badge, Card, Group, Image, Menu, Stack, Text } from '@mantine/core';

import type { MediaItem, MediaStatus } from '../types';

import { MEDIA_STATUS_LABELS, MEDIA_TYPE_LABELS, TMDB_POSTER_W300 } from '@aio-app/shared/media';

interface MediaCardProps {
  item: MediaItem;
  onStatusChange: (id: string, status: MediaStatus) => void;
  onRemove: (id: string) => void;
}

export const MediaCard: FC<MediaCardProps> = ({ item, onStatusChange, onRemove }) => {
  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder h="100%">
      <Card.Section>
        <Image
          src={item.posterPath ? `${TMDB_POSTER_W300}${item.posterPath}` : undefined}
          h={'19rem'}
          alt={item.title}
          fallbackSrc="https://placehold.co/300x450?text=Sin+imagen"
        />
      </Card.Section>

      <Stack gap="xs" mt="sm" style={{ flex: 1 }}>
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Text fw={600} size="sm" lineClamp={2} style={{ flex: 1 }}>
            {item.title}
          </Text>
          <Badge
            size="xs"
            variant="light"
            color={item.mediaType === 'movie' ? 'blue' : 'violet'}
            style={{ flexShrink: 0 }}
          >
            {MEDIA_TYPE_LABELS[item.mediaType]}
          </Badge>
        </Group>

        {item.streamingReleaseDate && (
          <Text size="xs" c="dimmed">
            En streaming: {new Date(item.streamingReleaseDate).toLocaleDateString('es')}
          </Text>
        )}
      </Stack>

      <Group justify="space-between" mt="sm">
        <Badge
          size="sm"
          variant="light"
          color={item.status === 'watched' ? 'teal' : item.status === 'watching' ? 'orange' : 'yellow'}
        >
          {MEDIA_STATUS_LABELS[item.status]}
        </Badge>

        <Menu shadow="md" width={160}>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              ⋯
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => onStatusChange(item.id, 'to_watch')}>{MEDIA_STATUS_LABELS.to_watch}</Menu.Item>
            <Menu.Item onClick={() => onStatusChange(item.id, 'watching')}>{MEDIA_STATUS_LABELS.watching}</Menu.Item>
            <Menu.Item onClick={() => onStatusChange(item.id, 'watched')}>{MEDIA_STATUS_LABELS.watched}</Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" onClick={() => onRemove(item.id)}>
              Eliminar de la lista
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Card>
  );
};
