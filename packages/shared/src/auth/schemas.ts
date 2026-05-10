import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ error: "Email inválido" }),
  password: z.string().min(1, { error: "La contraseña es requerida" }),
});
export type LoginPayload = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, { error: "Debe tener al menos 2 caracteres" }),
  email: z.string().email({ error: "Email inválido" }),
  password: z.string().min(8, { error: "La contraseña debe tener al menos 8 caracteres" }),
});
export type RegisterPayload = z.infer<typeof registerSchema>;
