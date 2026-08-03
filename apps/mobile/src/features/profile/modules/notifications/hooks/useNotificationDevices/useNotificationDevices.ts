import useSWR from 'swr';

import { API_KEYS } from '@/shared/api';

import type { NotificationDevice, NotificationDigest } from '@omni/shared/notifications';

export function useNotificationDevices() {
  const { data, error, isLoading } = useSWR<NotificationDevice[]>(API_KEYS.notifications.devices);
  return { items: data ?? [], isLoading, error };
}

export function useNotificationDigest() {
  const { data, error, isLoading } = useSWR<NotificationDigest>(API_KEYS.notifications.digest);
  return { digest: data ?? null, isLoading, error };
}
