import type { User } from '@prisma/client';
import type { RegisterPayload } from '@aio-app/shared/auth';
import { prisma } from '../lib/prisma';

export async function create(dto: RegisterPayload): Promise<User> {
  return prisma.user.create({ data: dto });
}

/** Returns user WITH password (for auth validation). */
export async function findByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function findById(id: string): Promise<Omit<User, 'password'> | null> {
  return prisma.user.findUnique({
    where: { id },
    omit: { password: true },
  });
}
