import {
  SimpleGrid,
  Select,
  Group,
  Text,
  Loader,
  Center,
  Tabs,
  Stack,
} from "@mantine/core";
import { FC } from "react";
import { MediaCard } from "./MediaCard";
import type { MediaItem, MediaFilters, MediaStatus, MediaType } from "../types";
import {
  MEDIA_STATUS_LABELS,
  MEDIA_TYPE_LABELS,
} from "@aio-app/shared/constants/media";

interface MyMediaListProps {
  items: MediaItem[] | undefined;
  isLoading: boolean;
  filters: MediaFilters;
  onFiltersChange: (filters: MediaFilters) => void;
  onStatusChange: (id: string, status: MediaStatus) => void;
  onRemove: (id: string) => void;
}

export const MyMediaList: FC<MyMediaListProps> = ({
  items,
  isLoading,
  filters,
  onFiltersChange,
  onStatusChange,
  onRemove,
}) => {
  const tabValue = filters.status || "all";

  return (
    <Stack gap="md">
      <Tabs
        value={tabValue}
        onChange={(val) =>
          onFiltersChange({
            ...filters,
            status: val === "all" ? undefined : (val as MediaStatus),
          })
        }
      >
        <Tabs.List>
          <Tabs.Tab value="all">Todos</Tabs.Tab>
          {(
            Object.entries(MEDIA_STATUS_LABELS) as [MediaStatus, string][]
          ).map(([status, label]) => (
            <Tabs.Tab key={status} value={status}>
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      <Group gap="md">
        <Select
          placeholder="Tipo"
          clearable
          value={filters.mediaType || null}
          onChange={(val) =>
            onFiltersChange({
              ...filters,
              mediaType: (val as MediaType) || undefined,
            })
          }
          data={Object.entries(MEDIA_TYPE_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
          size="sm"
          w={150}
        />
      </Group>

      {isLoading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : !items || items.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          No tenés elementos en esta lista todavía.
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md">
          {items.map((item) => (
            <MediaCard
              key={item._id}
              item={item}
              onStatusChange={onStatusChange}
              onRemove={onRemove}
            />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
};
