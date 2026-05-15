import { z } from 'zod';

export const usernameSchema = z
  .string()
  .min(6, { error: 'Debe tener al menos 6 caracteres' })
  .max(20, { error: 'No puede tener más de 20 caracteres' })
  .regex(/^[a-zA-Z0-9]+$/, {
    error: 'Solo se permiten letras y números',
  })
  .transform(val => val.toLowerCase());

export const loginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1, { error: 'La contraseña es requerida' }),
});
export type LoginPayload = z.infer<typeof loginSchema>;

export const createUserSchema = z.object({
  username: usernameSchema,
  name: z.string().min(2, { error: 'Debe tener al menos 2 caracteres' }),
  password: z.string().min(8, { error: 'La contraseña debe tener al menos 8 caracteres' }),
  email: z.email({ error: 'Email inválido' }).optional(),
  role: z.enum(['ADMIN', 'USER']).default('USER').optional(),
});
export type CreateUserPayload = z.infer<typeof createUserSchema>;
