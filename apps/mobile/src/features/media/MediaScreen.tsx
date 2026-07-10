import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable } from 'react-native';
import { Button, Input, Paragraph, Spinner, XStack, YStack } from 'tamagui';
import { mutate as globalMutate } from 'swr';

import { API_KEYS } from '@/shared/api';
import { MEDIA_STATUS_LABELS, MEDIA_STATUSES, MEDIA_TYPE_LABELS } from '@omni/shared/media';

import { useMediaMutations, useMediaSearch, useMyMediaList } from './hooks';

import type { MediaItem, MediaStatus, MediaType } from '@omni/shared/media';

export function MediaScreen() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<MediaStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all');
  const [addQuery, setAddQuery] = useState('');
  const [adding, setAdding] = useState(false);

  const filters = useMemo(
    () => ({
      ...(statusFilter !== 'all' && { status: statusFilter }),
      ...(typeFilter !== 'all' && { mediaType: typeFilter }),
    }),
    [statusFilter, typeFilter]
  );

  const { data, isLoading, mutate } = useMyMediaList(filters);
  const { addToList, updateStatus, removeFromList } = useMediaMutations();
  const { results, isLoading: searching } = useMediaSearch(addQuery);

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return data ?? [];
    return (data ?? []).filter(item => item.title.toLowerCase().includes(q));
  }, [data, searchText]);

  const refreshList = useCallback(async () => {
    await mutate();
    await globalMutate(key => typeof key === 'string' && key.startsWith(API_KEYS.media.list));
  }, [mutate]);

  const handleAdd = useCallback(
    async (tmdbId: number, mediaType: MediaType) => {
      setAdding(true);
      try {
        await addToList(tmdbId, mediaType, 'to_watch');
        setAddQuery('');
        await refreshList();
        Alert.alert('Listo', 'Agregado a tu lista');
      } catch (err) {
        Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo agregar');
      } finally {
        setAdding(false);
      }
    },
    [addToList, refreshList]
  );

  const handleStatus = useCallback(
    (item: MediaItem) => {
      const buttons: { text: string; style?: 'cancel' | 'destructive' | 'default'; onPress?: () => void }[] =
        MEDIA_STATUSES.map(status => ({
          text: MEDIA_STATUS_LABELS[status],
          onPress: () => {
            void (async () => {
              try {
                await updateStatus(item.id, status);
                await refreshList();
              } catch (err) {
                Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo actualizar');
              }
            })();
          },
        }));
      buttons.push({ text: 'Cancelar', style: 'cancel' });
      Alert.alert('Cambiar estado', item.title, buttons);
    },
    [refreshList, updateStatus]
  );

  const handleDelete = useCallback(
    (item: MediaItem) => {
      Alert.alert('¿Eliminar?', item.title, [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              try {
                await removeFromList(item.id);
                await refreshList();
              } catch (err) {
                Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo eliminar');
              }
            })();
          },
        },
      ]);
    },
    [refreshList, removeFromList]
  );

  return (
    <YStack flex={1} backgroundColor="$background" padding="$3" gap="$3">
      <Paragraph size="$7" fontWeight="700">
        Media
      </Paragraph>

      <Input placeholder="Buscar en tu lista" value={searchText} onChangeText={setSearchText} />

      <XStack gap="$2" flexWrap="wrap">
        <Button size="$2" chromeless={statusFilter !== 'all'} onPress={() => setStatusFilter('all')}>
          Todos
        </Button>
        {MEDIA_STATUSES.map(status => (
          <Button key={status} size="$2" chromeless={statusFilter !== status} onPress={() => setStatusFilter(status)}>
            {MEDIA_STATUS_LABELS[status]}
          </Button>
        ))}
      </XStack>

      <XStack gap="$2">
        <Button size="$2" chromeless={typeFilter !== 'all'} onPress={() => setTypeFilter('all')}>
          Todos
        </Button>
        <Button size="$2" chromeless={typeFilter !== 'movie'} onPress={() => setTypeFilter('movie')}>
          Películas
        </Button>
        <Button size="$2" chromeless={typeFilter !== 'tv'} onPress={() => setTypeFilter('tv')}>
          Series
        </Button>
      </XStack>

      <YStack gap="$2">
        <Paragraph fontWeight="600">Agregar desde TMDB</Paragraph>
        <Input placeholder="Buscar película o serie…" value={addQuery} onChangeText={setAddQuery} />
        {searching ? <Spinner /> : null}
        {results.slice(0, 5).map(result => (
          <Pressable
            key={`${result.media_type}-${result.id}`}
            disabled={adding}
            onPress={() => void handleAdd(result.id, result.media_type as MediaType)}
          >
            <XStack gap="$2" paddingVertical="$2" alignItems="center">
              <Paragraph flex={1}>
                {result.title ?? result.name} ({MEDIA_TYPE_LABELS[result.media_type as MediaType] ?? result.media_type})
              </Paragraph>
              <Button size="$2" disabled={adding}>
                +
              </Button>
            </XStack>
          </Pressable>
        ))}
      </YStack>

      {isLoading ? (
        <Spinner />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={{ gap: 12, paddingBottom: 40 }}
          ListEmptyComponent={<Paragraph theme="alt2">No hay items en tu lista</Paragraph>}
          renderItem={({ item }) => (
            <YStack
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$4"
              padding="$3"
              gap="$2"
              backgroundColor="$color2"
            >
              <Paragraph fontWeight="700">{item.title}</Paragraph>
              <Paragraph theme="alt2" size="$2">
                {MEDIA_TYPE_LABELS[item.mediaType]} · {MEDIA_STATUS_LABELS[item.status]}
              </Paragraph>
              <XStack gap="$2">
                <Button size="$3" flex={1} onPress={() => handleStatus(item)}>
                  Estado
                </Button>
                <Button size="$3" theme="red" flex={1} onPress={() => handleDelete(item)}>
                  Eliminar
                </Button>
              </XStack>
            </YStack>
          )}
        />
      )}
    </YStack>
  );
}
