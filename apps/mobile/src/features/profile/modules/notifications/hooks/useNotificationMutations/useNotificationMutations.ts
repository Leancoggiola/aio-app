import { useCallback } from 'react';
import { useSWRConfig } from 'swr';

import { api, API_KEYS } from '@/shared/api';

import type { NotificationDeviceSummary, RegisterNotificationDevicePayload } from '@omni/shared/notifications';

export function useNotificationMutations() {
  const { mutate } = useSWRConfig();

  const invalidateDevices = useCallback(async () => {
    await mutate(API_KEYS.notifications.devices, undefined, { revalidate: true });
  }, [mutate]);

  const registerDevice = useCallback(
    async (payload: RegisterNotificationDevicePayload) => {
      const device = await api.post<NotificationDeviceSummary>(API_KEYS.notifications.devices, payload);
      await invalidateDevices();
      return device;
    },
    [invalidateDevices]
  );

  const deleteDevice = useCallback(
    async (deviceId: string) => {
      await api.delete(API_KEYS.notifications.device(deviceId));
      await invalidateDevices();
    },
    [invalidateDevices]
  );

  return { registerDevice, deleteDevice };
}
