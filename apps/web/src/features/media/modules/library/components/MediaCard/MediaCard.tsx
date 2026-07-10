import { memo } from 'react';
import { ActionIcon, Badge, Box, Card, Image, Select, Stack, Text } from '@mantine/core';

import type { MediaItem, MediaStatus } from '../../../_shared/types';

import { MEDIA_STATUS_LABELS, MEDIA_STATUSES, MEDIA_TYPE_LABELS, TMDB_POSTER_W300 } from '@omni/shared/media';
import { TrashIcon } from '@phosphor-icons/react';

const STATUS_SELECT_DATA = MEDIA_STATUSES.map(value => ({
  value,
  label: MEDIA_STATUS_LABELS[value],
}));

interface MediaCardProps {
  item: MediaItem;
  onStatusChange: (id: string, status: MediaStatus) => void;
  onDelete: (item: MediaItem) => void | Promise<void>;
}

export const MediaCard = memo(function MediaCard({ item, onStatusChange, onDelete }: MediaCardProps) {
  return (
    <Card shadow="sm" p="none" radius="md" withBorder h="100%" style={{ overflow: 'hidden' }}>
      <Card.Section pos="relative">
        <Image
          src={item.posterPath ? `${TMDB_POSTER_W300}${item.posterPath}` : undefined}
          h="17.5rem"
          alt={item.title}
          fallbackSrc="https://placehold.co/300x450?text=Sin+imagen"
        />
        <Badge
          pos="absolute"
          top="0.5rem"
          left="0.5rem"
          size="sm"
          variant="filled"
          color="dark"
          style={{ backgroundColor: 'rgb(0 0 0 / 0.65)' }}
        >
          {MEDIA_TYPE_LABELS[item.mediaType]}
        </Badge>
        <ActionIcon
          pos="absolute"
          top="0.5rem"
          right="0.5rem"
          variant="filled"
          color="dark"
          aria-label="Eliminar"
          onClick={() => void onDelete(item)}
          style={{ backgroundColor: 'rgb(0 0 0 / 0.65)' }}
        >
          <TrashIcon size="1rem" />
        </ActionIcon>
      </Card.Section>

      <Stack gap="xs" p="sm" style={{ flex: 1 }}>
        <Text fw={600} size="sm" lineClamp={2}>
          {item.title}
        </Text>

        <Box mt="auto">
          <Select
            data={STATUS_SELECT_DATA}
            value={item.status}
            onChange={val => val && onStatusChange(item.id, val as MediaStatus)}
            size="sm"
          />
        </Box>
      </Stack>
    </Card>
  );
});
