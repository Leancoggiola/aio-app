import * as bcrypt from 'bcrypt';
import * as usersService from '../users/users.service';
import type { CreateUserPayload } from '@aio-app/shared/auth';

const BCRYPT_ROUNDS = 12;

export async function createUser(dto: CreateUserPayload) {
  const existing = await usersService.findByUsername(dto.username);
  if (existing) {
    throw { status: 409, message: 'El nombre de usuario ya está en uso' };
  }

  if (dto.email) {
    const byEmail = await usersService.findByEmail(dto.email);
    if (byEmail) {
      throw { status: 409, message: 'El correo electrónico ya está en uso' };
    }
  }

  const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
  const user = await usersService.create({
    ...dto,
    password: hashedPassword,
  });

  const { password: _password, ...sanitized } = user;
  return sanitized;
}

export async function listUsers() {
  const { prisma } = await import('../common/db');
  return prisma.user.findMany({
    omit: { password: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteUser(userId: string, requesterId: string) {
  if (userId === requesterId) {
    throw { status: 400, message: 'No podés eliminar tu propia cuenta' };
  }

  const user = await usersService.findById(userId);
  if (!user) {
    throw { status: 404, message: 'Usuario no encontrado' };
  }

  await usersService.deleteAccount(userId);
  return { message: 'Usuario eliminado exitosamente' };
}
