import { FC, useCallback } from 'react';
import { Divider, Loader, Stack, Title } from '@mantine/core';

import { api } from '@/common/api';

import { useAuth } from '../../../core/auth';
import { DeleteAccountButton, PasswordForm, PreferencesForm, ProfileForm } from '../components';
import { usePreferences, useProfile } from '../hooks';

export const ProfilePage: FC = () => {
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const { preferences, isLoading: prefsLoading, updatePreferences } = usePreferences();
  const { logout } = useAuth();

  const handleChangePassword = useCallback(async (newPassword: string) => {
    await api.patch('/api/users/password', { newPassword });
  }, []);

  const handleDeleteAccount = useCallback(async () => {
    await api.delete('/api/users/account');
    await logout();
  }, [logout]);

  if (profileLoading || prefsLoading) {
    return <Loader />;
  }

  if (!profile) {
    return null;
  }

  return (
    <Stack gap="xl">
      <Title order={2}>Profile</Title>

      <Stack gap="lg">
        <Title order={4}>Personal Information</Title>
        <ProfileForm profile={profile} onSubmit={updateProfile} />
      </Stack>

      <Divider />

      {preferences && (
        <>
          <Stack gap="lg">
            <Title order={4}>Preferences</Title>
            <PreferencesForm preferences={preferences} onUpdate={updatePreferences} />
          </Stack>

          <Divider />
        </>
      )}

      <Stack gap="lg">
        <Title order={4}>Change Password</Title>
        <PasswordForm onSubmit={handleChangePassword} />
      </Stack>

      <Divider />

      <Stack gap="lg">
        <Title order={4}>Danger Zone</Title>
        <DeleteAccountButton onDelete={handleDeleteAccount} />
      </Stack>
    </Stack>
  );
};
