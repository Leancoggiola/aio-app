import { FC, useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Combobox,
  Group,
  Image,
  Modal,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  useCombobox,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';

import { getErrorMessage, notifySuccess } from '@/shared/ui';

import { getTmdbResultKey, getTmdbResultTitle, resolveMediaType } from '../../../_shared/utils/tmdb';
import { useMediaSearch } from '../../../search/hooks/useMediaSearch';
import { INITIAL_ADD_MEDIA_FORM_VALUES } from '../../utils/addMediaForm';
import { TmdbSearchOption } from './TmdbSearchOption';

import type { MediaStatus, MediaType } from '../../../_shared/types';
import type { AddMediaFormValues } from '@omni/shared/media';

import {
  addMediaFormSchema,
  MEDIA_STATUS_LABELS,
  MEDIA_STATUSES,
  MEDIA_TYPE_LABELS,
  TMDB_POSTER_W300,
} from '@omni/shared/media';

interface AddMediaModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (tmdbId: number, mediaType: MediaType, status: MediaStatus) => Promise<void>;
  existingTmdbIds: Set<string>;
}

export const AddMediaModal: FC<AddMediaModalProps> = ({ opened, onClose, onSubmit, existingTmdbIds }) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPosterPath, setSelectedPosterPath] = useState<string | null>(null);

  const form = useForm<AddMediaFormValues>({
    mode: 'controlled',
    initialValues: INITIAL_ADD_MEDIA_FORM_VALUES,
    validate: schemaResolver(addMediaFormSchema, { sync: true }),
  });

  const [debouncedQuery] = useDebouncedValue(form.values.titleQuery, 400);
  const trimmedQuery = debouncedQuery.trim();
  const searchQuery = opened && trimmedQuery.length >= 2 ? debouncedQuery : '';
  const { data: searchData, isLoading: searchLoading } = useMediaSearch(searchQuery, 1, 'multi');

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.selectFirstOption(),
  });

  useEffect(() => {
    if (!opened) {
      form.reset();
      setSubmitError(null);
      setLoading(false);
      setSelectedPosterPath(null);
      combobox.resetSelectedOption();
    }
  }, [opened]);

  const hasSelection = form.values.tmdbId != null;
  const searchResults = searchData?.results ?? [];
  const posterPreviewUrl = selectedPosterPath ? `${TMDB_POSTER_W300}${selectedPosterPath}` : null;

  const applyTmdbSelection = useCallback(
    (tmdbId: number, mediaType: MediaType, title: string, posterPath: string | null) => {
      form.setValues({
        titleQuery: title,
        tmdbId,
        mediaType,
      });
      setSelectedPosterPath(posterPath);
      form.clearFieldError('tmdbId');
    },
    [form]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      form.setValues({
        titleQuery: value,
        tmdbId: null,
        mediaType: INITIAL_ADD_MEDIA_FORM_VALUES.mediaType,
      });
      setSelectedPosterPath(null);
      combobox.openDropdown();
    },
    [form, combobox]
  );

  const handleOptionSubmit = useCallback(
    (value: string) => {
      const item = searchResults.find(result => getTmdbResultKey(result) === value);
      if (!item) return;

      applyTmdbSelection(item.id, resolveMediaType(item), getTmdbResultTitle(item), item.poster_path);
      combobox.closeDropdown();
    },
    [searchResults, applyTmdbSelection, combobox]
  );

  const handleSubmit = async (values: AddMediaFormValues) => {
    if (values.tmdbId == null) return;

    setSubmitError(null);
    setLoading(true);
    try {
      await onSubmit(values.tmdbId, values.mediaType, values.status);
      notifySuccess('Agregado a tu lista');
      onClose();
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'No se pudo guardar'));
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = loading ? () => {} : onClose;

  return (
    <Modal
      opened={opened}
      onClose={handleModalClose}
      title="Agregar película / serie"
      centered
      size="md"
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {submitError && (
            <Alert color="red" variant="light">
              {submitError}
            </Alert>
          )}

          <Combobox store={combobox} onOptionSubmit={handleOptionSubmit}>
            <Combobox.Target>
              <TextInput
                label="Título"
                placeholder="Buscar en TMDB..."
                required
                value={form.values.titleQuery}
                error={form.errors.tmdbId}
                onChange={e => handleSearchChange(e.currentTarget.value)}
                onFocus={() => combobox.openDropdown()}
                rightSection={<Combobox.Chevron />}
              />
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options>
                {trimmedQuery.length < 2 ? (
                  <Combobox.Empty>Escribí al menos 2 caracteres</Combobox.Empty>
                ) : searchResults.length > 0 ? (
                  searchResults.map(item => (
                    <TmdbSearchOption
                      key={getTmdbResultKey(item)}
                      item={item}
                      alreadyAdded={existingTmdbIds.has(getTmdbResultKey(item))}
                    />
                  ))
                ) : searchLoading ? (
                  <Combobox.Empty>Buscando...</Combobox.Empty>
                ) : (
                  <Combobox.Empty>No se encontraron resultados</Combobox.Empty>
                )}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>

          <SimpleGrid cols={2} spacing="md">
            <Select
              label="Tipo"
              data={Object.entries(MEDIA_TYPE_LABELS).map(([value, label]) => ({ value, label }))}
              disabled={hasSelection}
              {...form.getInputProps('mediaType')}
            />
            <Select
              label="Estado"
              data={MEDIA_STATUSES.map(value => ({
                value,
                label: MEDIA_STATUS_LABELS[value],
              }))}
              {...form.getInputProps('status')}
            />
          </SimpleGrid>

          {posterPreviewUrl && (
            <Stack gap="xs">
              <Text size="sm" fw={500}>
                Poster (TMDB)
              </Text>
              <Box maw="7.5rem">
                <Image src={posterPreviewUrl} alt={form.values.titleQuery} radius="md" />
              </Box>
            </Stack>
          )}

          <Group justify="flex-end" gap="sm" mt="sm">
            <Button variant="default" type="button" onClick={handleModalClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Guardar
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
