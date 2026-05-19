import { describe, expect, it } from 'vitest';

import { buildPreferencesUpdates, buildProfileUpdates, toProfileFormValues } from '../utils/profileForm';

import type { UserProfile } from '@aio-app/shared/users';

const baseProfile: UserProfile = {
  id: '1',
  username: 'lean',
  name: 'Lean Jose',
  email: 'hallowed013@gmail.com',
  role: 'USER',
  avatarUrl: null,
  phone: null,
  birthDate: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  preferences: {
    id: 'p1',
    userId: '1',
    notifications: false,
    theme: 'light',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
};

describe('profileForm utils', () => {
  it('maps profile to form values', () => {
    const values = toProfileFormValues(baseProfile);
    expect(values.phone).toBe('');
    expect(values.theme).toBe('light');
  });

  it('builds profile updates only for changed fields', () => {
    const values = toProfileFormValues(baseProfile);
    values.phone = '+34 600 000 000';

    expect(buildProfileUpdates(baseProfile, values)).toEqual({
      phone: '+34 600 000 000',
    });
  });

  it('builds preferences updates only for changed fields', () => {
    const values = toProfileFormValues(baseProfile);
    values.notifications = true;
    values.theme = 'dark';

    expect(buildPreferencesUpdates(baseProfile, values)).toEqual({
      notifications: true,
      theme: 'dark',
    });
  });
});
