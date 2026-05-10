import type { User } from '@prisma/client';
import type { RegisterPayload } from '@aio-app/shared/auth';
import type { UpdateProfilePayload, UpdatePreferencesPayload } from '@aio-app/shared/users';
import * as bcrypt from 'bcrypt';
import { prisma } from '../common/prisma';

const BCRYPT_ROUNDS = 12;

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

// ─── Profile ───────────────────────────────────────────────

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
    include: { preferences: true },
  });

  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  return user;
}

export async function updateProfile(userId: string, dto: UpdateProfilePayload) {
  if (dto.email) {
    const existing = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existing && existing.id !== userId) {
      throw { status: 409, message: 'Email already in use' };
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data: dto,
    omit: { password: true },
  });
}

// ─── Password ──────────────────────────────────────────────

export async function changePassword(userId: string, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

// ─── Delete Account ────────────────────────────────────────

export async function deleteAccount(userId: string) {
  await prisma.user.delete({ where: { id: userId } });
}

// ─── Preferences ───────────────────────────────────────────

export async function getPreferences(userId: string) {
  let preferences = await prisma.userPreferences.findUnique({
    where: { userId },
  });

  if (!preferences) {
    preferences = await prisma.userPreferences.create({
      data: { userId },
    });
  }

  return preferences;
}

export async function updatePreferences(userId: string, dto: UpdatePreferencesPayload) {
  return prisma.userPreferences.upsert({
    where: { userId },
    create: { userId, ...dto },
    update: dto,
  });
}
