import { FC, useEffect, useState } from 'react';
import { Group, SegmentedControl, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';

import { MEDIA_TYPE_LABELS } from '@aio-app/shared/media';

interface MediaSearchBarProps {
  onSearch: (query: string, type: string) => void;
}

export const MediaSearchBar: FC<MediaSearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('multi');
  const [debouncedQuery] = useDebouncedValue(query, 400);

  useEffect(() => {
    onSearch(debouncedQuery, type);
  }, [debouncedQuery, type, onSearch]);

  return (
    <Group align="flex-end" gap="md">
      <TextInput
        placeholder="Buscar películas o series..."
        value={query}
        onChange={e => setQuery(e.currentTarget.value)}
        style={{ flex: 1 }}
        size="md"
      />
      <SegmentedControl
        value={type}
        onChange={setType}
        data={[
          { label: 'Todos', value: 'multi' },
          ...Object.entries(MEDIA_TYPE_LABELS).map(([value, label]) => ({
            label,
            value,
          })),
        ]}
        size="md"
      />
    </Group>
  );
};
