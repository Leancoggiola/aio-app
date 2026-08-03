import { useCallback } from 'react';
import { useSWRConfig } from 'swr';

import { api, SWR_KEYS } from '@/shared/api';

import type { NotificationDeviceSummary, RegisterNotificationDevicePayload } from '@omni/shared/notifications';

export function useNotificationMutations() {
  const { mutate } = useSWRConfig();

  const invalidateDevices = useCallback(async () => {
    await mutate(SWR_KEYS.notifications.devices, undefined, { revalidate: true });
  }, [mutate]);

  const registerDevice = useCallback(
    async (payload: RegisterNotificationDevicePayload) => {
      const device = await api.post<NotificationDeviceSummary>(SWR_KEYS.notifications.devices, payload);
      await invalidateDevices();
      return device;
    },
    [invalidateDevices]
  );

  const deleteDevice = useCallback(
    async (deviceId: string) => {
      await api.delete(SWR_KEYS.notifications.device(deviceId));
      await invalidateDevices();
    },
    [invalidateDevices]
  );

  return { registerDevice, deleteDevice };
}
