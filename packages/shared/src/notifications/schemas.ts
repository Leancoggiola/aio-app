import { z } from 'zod';

export const NOTIFICATION_PLATFORMS = ['WEB', 'MOBILE', 'RASPBERRY_PI'] as const;

export const registerNotificationDeviceSchema = z.object({
  platform: z.enum(NOTIFICATION_PLATFORMS),
  token: z.string().min(1).optional(),
  label: z.string().trim().max(80).optional(),
});

export type RegisterNotificationDevicePayload = z.infer<typeof registerNotificationDeviceSchema>;
