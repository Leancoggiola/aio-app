import { useState } from 'react';
import {
  Button,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  useMantineColorScheme,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';

import {
  buildPreferencesUpdates,
  buildProfileUpdates,
  type ProfileFormValues,
  toProfileFormValues,
} from '../utils/profileForm';
import { ProfileSectionCard } from './ProfileSectionCard';

import type { ProfileTheme, UpdatePreferencesPayload, UpdateProfilePayload, UserProfile } from '@aio-app/shared/users';
import type { FC } from 'react';

import { CalendarBlankIcon, EnvelopeSimpleIcon, FloppyDiskIcon, PhoneIcon, UserIcon } from '@phosphor-icons/react';

const THEME_OPTIONS = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'auto', label: 'Sistema' },
] satisfies { value: ProfileTheme; label: string }[];

const READ_ONLY_DESCRIPTION = 'No se puede editar';

const inputIconProps = { size: '1rem' as const, 'aria-hidden': true as const };

interface ProfileSettingsFormProps {
  profile: UserProfile;
  isSaving: boolean;
  onSave: (payload: {
    profile: UpdateProfilePayload;
    preferences: UpdatePreferencesPayload;
    theme: ProfileTheme;
  }) => Promise<void>;
}

export const ProfileSettingsForm: FC<ProfileSettingsFormProps> = ({ profile, isSaving, onSave }) => {
  const { setColorScheme } = useMantineColorScheme();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    mode: 'controlled',
    initialValues: toProfileFormValues(profile),
  });

  const handleSubmit = form.onSubmit(async values => {
    setError(null);
    const profileUpdates = buildProfileUpdates(profile, values);
    const preferencesUpdates = buildPreferencesUpdates(profile, values);

    if (Object.keys(profileUpdates).length === 0 && Object.keys(preferencesUpdates).length === 0) {
      return;
    }

    try {
      await onSave({ profile: profileUpdates, preferences: preferencesUpdates, theme: values.theme });
      setColorScheme(values.theme);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron guardar los cambios');
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="xl">
        <ProfileSectionCard title="Información Personal" subtitle="Actualiza tus datos personales">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput
              label="Nombre Completo"
              name="profile-name"
              value={profile.name}
              disabled
              description={READ_ONLY_DESCRIPTION}
              leftSection={<UserIcon {...inputIconProps} />}
            />
            <TextInput
              label="Email"
              name="profile-email"
              value={profile.email ?? ''}
              disabled
              description={READ_ONLY_DESCRIPTION}
              leftSection={<EnvelopeSimpleIcon {...inputIconProps} />}
            />
            <TextInput
              label="Teléfono"
              placeholder="+34 123 456 789"
              leftSection={<PhoneIcon {...inputIconProps} />}
              {...form.getInputProps('phone')}
            />
            <DatePickerInput
              label="Fecha de Nacimiento"
              placeholder="dd/mm/aaaa"
              valueFormat="DD/MM/YYYY"
              leftSection={<CalendarBlankIcon {...inputIconProps} />}
              {...form.getInputProps('birthDate')}
            />
          </SimpleGrid>
        </ProfileSectionCard>

        <ProfileSectionCard title="Preferencias" subtitle="Personaliza tu experiencia">
          <Stack gap="md">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Stack gap={2}>
                <Text fw={500} size="sm">
                  Notificaciones
                </Text>
                <Text c="dimmed" size="sm">
                  Recibir notificaciones de la app
                </Text>
              </Stack>
              <Switch
                checked={form.values.notifications}
                onChange={event => form.setFieldValue('notifications', event.currentTarget.checked)}
                aria-label="Notificaciones"
              />
            </Group>
            <Select label="Tema" data={THEME_OPTIONS} allowDeselect={false} {...form.getInputProps('theme')} />
          </Stack>
        </ProfileSectionCard>

        {error && (
          <Text c="red" size="sm">
            {error}
          </Text>
        )}

        <Group justify="flex-end">
          <Button type="submit" loading={isSaving} leftSection={<FloppyDiskIcon size="1rem" aria-hidden />}>
            Guardar Cambios
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
