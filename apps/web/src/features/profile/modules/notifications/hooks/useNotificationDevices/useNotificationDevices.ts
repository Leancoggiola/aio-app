import useSWR from 'swr';

import { SWR_KEYS } from '@/shared/api';

import type { NotificationDevice, NotificationDigest } from '@omni/shared/notifications';

export function useNotificationDevices() {
  const { data, error, isLoading } = useSWR<NotificationDevice[]>(SWR_KEYS.notifications.devices);
  return { items: data ?? [], isLoading, error };
}

export function useNotificationDigest() {
  const { data, error, isLoading } = useSWR<NotificationDigest>(SWR_KEYS.notifications.digest);
  return { digest: data ?? null, isLoading, error };
}
