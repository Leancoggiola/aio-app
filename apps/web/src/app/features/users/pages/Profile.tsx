import { FC, useCallback } from 'react';
import { Divider, Loader, Stack, Title } from '@mantine/core';

import { api } from '@/common/api';

import { useAuth } from '../../../core/auth';
import { DeleteAccountButton, PasswordForm, PreferencesForm, ProfileForm } from '../components';
import { useProfile } from '../hooks';

export const ProfilePage: FC = () => {
  const { profile, isLoading, updateProfile, updatePreferences } = useProfile();
  const { logout } = useAuth();

  const handleChangePassword = useCallback(async (newPassword: string) => {
    await api.patch('/api/users/password', { newPassword });
  }, []);

  const handleDeleteAccount = useCallback(async () => {
    await api.delete('/api/users/account');
    await logout();
  }, [logout]);

  if (isLoading) {
    return <Loader />;
  }

  if (!profile) {
    return null;
  }

  const preferences = profile.preferences;

  return (
    <Stack gap="xl">
      <Title order={2}>Perfil</Title>

      <Stack gap="lg">
        <Title order={4}>Información personal</Title>
        <ProfileForm profile={profile} onSubmit={updateProfile} />
      </Stack>

      <Divider />

      {preferences && (
        <>
          <Stack gap="lg">
            <Title order={4}>Preferencias</Title>
            <PreferencesForm preferences={preferences} onUpdate={updatePreferences} />
          </Stack>

          <Divider />
        </>
      )}

      <Stack gap="lg">
        <Title order={4}>Cambiar contraseña</Title>
        <PasswordForm onSubmit={handleChangePassword} />
      </Stack>

      <Divider />

      <Stack gap="lg">
        <Title order={4}>Zona de peligro</Title>
        <DeleteAccountButton onDelete={handleDeleteAccount} />
      </Stack>
    </Stack>
  );
};
