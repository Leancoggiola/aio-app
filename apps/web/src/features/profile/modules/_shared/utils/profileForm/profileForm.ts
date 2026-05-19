import type { ProfileTheme, UpdatePreferencesPayload, UpdateProfilePayload, UserProfile } from '@aio-app/shared/users';

export interface ProfileFormValues {
  phone: string;
  birthDate: Date | null;
  notifications: boolean;
  theme: ProfileTheme;
}

const toDateKey = (value: string | Date | null): string | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
};

const normalizeOptional = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
};

export const toProfileFormValues = (profile: UserProfile): ProfileFormValues => ({
  phone: profile.phone ?? '',
  birthDate: profile.birthDate ? new Date(profile.birthDate) : null,
  notifications: profile.preferences?.notifications ?? false,
  theme: profile.preferences?.theme ?? 'light',
});

export const buildProfileUpdates = (profile: UserProfile, values: ProfileFormValues): UpdateProfilePayload => {
  const updates: UpdateProfilePayload = {};
  const phone = normalizeOptional(values.phone);
  const birthDate = values.birthDate ? values.birthDate.toISOString() : null;

  if (phone !== profile.phone) updates.phone = phone;

  if (toDateKey(birthDate) !== toDateKey(profile.birthDate)) {
    updates.birthDate = birthDate;
  }

  return updates;
};

export const buildPreferencesUpdates = (profile: UserProfile, values: ProfileFormValues): UpdatePreferencesPayload => {
  const prefs = profile.preferences;
  const updates: UpdatePreferencesPayload = {};
  const currentTheme = prefs?.theme ?? 'light';

  if (values.notifications !== (prefs?.notifications ?? false)) {
    updates.notifications = values.notifications;
  }
  if (values.theme !== currentTheme) {
    updates.theme = values.theme;
  }

  return updates;
};
