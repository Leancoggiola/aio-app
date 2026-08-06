import { Image } from 'expo-image';
import { Button, Paragraph, XStack, YStack } from 'tamagui';

import { MEDIA_STATUS_LABELS, MEDIA_TYPE_LABELS, TMDB_POSTER_W500 } from '@omni/shared/media';

import type { MediaItem } from '@omni/shared/media';

type MediaCardProps = {
  item: MediaItem;
  onStatusPress: (item: MediaItem) => void;
  onDeletePress: (item: MediaItem) => void;
};

export function MediaCard({ item, onStatusPress, onDeletePress }: MediaCardProps) {
  const posterUri = item.posterPath ? `${TMDB_POSTER_W500}${item.posterPath}` : null;

  return (
    <XStack
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius="$4"
      padding="$2.5"
      gap="$3"
      backgroundColor="$color2"
      alignItems="stretch"
    >
      {posterUri ? (
        <Image
          source={{ uri: posterUri }}
          style={{ width: 72, height: 108, borderRadius: 6 }}
          contentFit="cover"
          accessibilityLabel={`Poster de ${item.title}`}
        />
      ) : (
        <YStack
          width={72}
          height={108}
          borderRadius={6}
          backgroundColor="$color4"
          alignItems="center"
          justifyContent="center"
          padding="$1.5"
        >
          <Paragraph size="$1" theme="alt2" textAlign="center">
            Sin imagen
          </Paragraph>
        </YStack>
      )}

      <YStack flex={1} gap="$2" justifyContent="space-between">
        <YStack gap="$1">
          <Paragraph fontWeight="700" numberOfLines={2}>
            {item.title}
          </Paragraph>
          <Paragraph theme="alt2" size="$2">
            {MEDIA_TYPE_LABELS[item.mediaType]} · {MEDIA_STATUS_LABELS[item.status]}
          </Paragraph>
        </YStack>
        <XStack gap="$2">
          <Button size="$3" flex={1} onPress={() => onStatusPress(item)}>
            Estado
          </Button>
          <Button size="$3" theme="red" flex={1} onPress={() => onDeletePress(item)}>
            Eliminar
          </Button>
        </XStack>
      </YStack>
    </XStack>
  );
}
