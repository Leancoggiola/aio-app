import { FC, useCallback } from "react";
import { Stack, Title, Loader, Divider } from "@mantine/core";
import { useProfile, usePreferences } from "../hooks";
import { ProfileForm, PasswordForm, PreferencesForm, DeleteAccountButton } from "../components";
import { api } from "../../../../lib/api";
import { useAuth } from "../../../core/auth";

export const ProfilePage: FC = () => {
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const { preferences, isLoading: prefsLoading, updatePreferences } = usePreferences();
  const { logout } = useAuth();

  const handleChangePassword = useCallback(async (newPassword: string) => {
    await api.patch("/api/users/password", { newPassword });
  }, []);

  const handleDeleteAccount = useCallback(async () => {
    await api.delete("/api/users/account");
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
