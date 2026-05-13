import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional().nullable(),
});
export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  newPassword: z.string().min(8),
});
export type ChangePasswordPayload = z.infer<typeof changePasswordSchema>;

export const updatePreferencesSchema = z.object({
  notifications: z.boolean().optional(),
});
export type UpdatePreferencesPayload = z.infer<typeof updatePreferencesSchema>;
