import { FC, useCallback } from 'react';
import { Loader, Stack, Text, Title } from '@mantine/core';

import { api } from '@/common/api';

import { useAuth } from '../../../core/auth';
import {
  DeleteAccountButton,
  PasswordForm,
  ProfilePhotoSection,
  ProfileSectionCard,
  ProfileSettingsForm,
} from '../components';
import { useProfile } from '../hooks';

export const ProfilePage: FC = () => {
  const { profile, isLoading, isMutating, updateProfile, updatePreferences } = useProfile();
  const { logout } = useAuth();

  const handleChangePassword = useCallback(async (newPassword: string) => {
    await api.patch('/api/users/password', { newPassword });
  }, []);

  const handleDeleteAccount = useCallback(async () => {
    await api.delete('/api/users/account');
    await logout();
  }, [logout]);

  const handleSave = useCallback(
    async ({
      profile: profileUpdates,
      preferences: preferencesUpdates,
    }: {
      profile: Parameters<typeof updateProfile>[0];
      preferences: Parameters<typeof updatePreferences>[0];
      theme: 'light' | 'dark' | 'auto';
    }) => {
      const tasks: Promise<unknown>[] = [];

      if (Object.keys(profileUpdates).length > 0) {
        tasks.push(updateProfile(profileUpdates));
      }
      if (Object.keys(preferencesUpdates).length > 0) {
        tasks.push(updatePreferences(preferencesUpdates));
      }

      await Promise.all(tasks);
    },
    [updateProfile, updatePreferences]
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!profile) {
    return null;
  }

  return (
    <Stack gap="xl">
      <Stack gap="2xs">
        <Title order={2}>Mi Perfil</Title>
        <Text c="dimmed">Gestiona tu información personal y preferencias</Text>
      </Stack>

      <ProfilePhotoSection name={profile.name} avatarUrl={profile.avatarUrl} />

      <ProfileSettingsForm key={profile.updatedAt} profile={profile} isSaving={isMutating} onSave={handleSave} />

      <ProfileSectionCard title="Cambiar contraseña" subtitle="Actualiza la contraseña de tu cuenta">
        <PasswordForm onSubmit={handleChangePassword} />
      </ProfileSectionCard>

      <ProfileSectionCard title="Zona de peligro" subtitle="Acciones irreversibles sobre tu cuenta">
        <DeleteAccountButton onDelete={handleDeleteAccount} />
      </ProfileSectionCard>
    </Stack>
  );
};
