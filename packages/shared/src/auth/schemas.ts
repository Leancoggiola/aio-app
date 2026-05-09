import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginPayload = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});
export type RegisterPayload = z.infer<typeof registerSchema>;
