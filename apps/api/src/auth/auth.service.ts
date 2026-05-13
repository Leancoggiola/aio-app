import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { Response } from "express";

import { config } from "../config";
import * as usersService from "../users/users.service";
import { prisma } from "../common/prisma";
import type { RegisterPayload } from "@aio-app/shared/auth";

const BCRYPT_ROUNDS = 12;

// ─── Register ───────────────────────────────────────────────

export async function register(dto: RegisterPayload, res: Response) {
  const existing = await usersService.findByEmail(dto.email);
  if (existing) {
    throw { status: 409, message: "Email already registered" };
  }

  const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
  const user = await usersService.create({
    ...dto,
    password: hashedPassword,
  });

  await issueTokens({ sub: user.id, email: user.email }, res);

  return { user: sanitizeUser(user) };
}

// ─── Validate (for LocalStrategy) ──────────────────────────

export async function validateUser(email: string, password: string) {
  const user = await usersService.findByEmail(email);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return sanitizeUser(user);
}

// ─── Login ─────────────────────────────────────────────────

export async function login(
  user: { id: string; email: string },
  res: Response,
) {
  await issueTokens({ sub: user.id, email: user.email }, res);
  return { user };
}

// ─── Refresh ───────────────────────────────────────────────

export async function refresh(
  userId: string,
  rawRefreshToken: string,
  res: Response,
) {
  // Clean up expired tokens for this user
  await prisma.refreshToken.deleteMany({
    where: { userId, expiresAt: { lt: new Date() } },
  });

  const storedTokens = await prisma.refreshToken.findMany({
    where: { userId },
  });

  let matchedToken: (typeof storedTokens)[number] | null = null;
  for (const token of storedTokens) {
    const isMatch = await bcrypt.compare(rawRefreshToken, token.tokenHash);
    if (isMatch) {
      matchedToken = token;
      break;
    }
  }

  if (!matchedToken) {
    await prisma.refreshToken.deleteMany({ where: { userId } });
    clearCookies(res);
    throw {
      status: 401,
      message: "Refresh token not recognized. All sessions revoked.",
    };
  }

  await prisma.refreshToken.delete({ where: { id: matchedToken.id } });

  const user = await usersService.findById(userId);
  if (!user) {
    throw { status: 401, message: "User not found" };
  }

  await issueTokens({ sub: userId, email: user.email }, res);

  return { user };
}

// ─── Logout ────────────────────────────────────────────────

export async function logout(
  userId: string,
  rawRefreshToken: string | undefined,
  res: Response,
) {
  if (rawRefreshToken) {
    const storedTokens = await prisma.refreshToken.findMany({
      where: { userId },
    });

    for (const token of storedTokens) {
      const isMatch = await bcrypt.compare(rawRefreshToken, token.tokenHash);
      if (isMatch) {
        await prisma.refreshToken.delete({ where: { id: token.id } });
        break;
      }
    }
  } else {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }

  clearCookies(res);

  return { message: "Logged out successfully" };
}

// ─── Profile ───────────────────────────────────────────────

export async function getProfile(userId: string) {
  const user = await usersService.findById(userId);
  if (!user) {
    throw { status: 401, message: "User not found" };
  }
  return { user };
}

// ─── Private helpers ──────────────────────────────────────

async function issueTokens(
  payload: { sub: string; email: string },
  res: Response,
) {
  const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn as string &
      jwt.SignOptions["expiresIn"],
  });
  const refreshToken = jwt.sign(
    { sub: payload.sub },
    config.jwt.refreshSecret,
    {
      expiresIn: config.jwt.refreshExpiresIn as string &
        jwt.SignOptions["expiresIn"],
    },
  );

  const tokenHash = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);
  const expiresAt = new Date(Date.now() + config.cookie.refreshMaxAge);

  await prisma.refreshToken.create({
    data: { userId: payload.sub, tokenHash, expiresAt },
  });

  setAccessCookie(res, accessToken);
  setRefreshCookie(res, refreshToken);
}

function setAccessCookie(res: Response, token: string) {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "strict",
    path: "/api",
    maxAge: 15 * 60 * 1000,
  });
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie("refresh_token", token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "strict",
    path: "/api/auth/refresh",
    maxAge: config.cookie.refreshMaxAge,
  });
}

function clearCookies(res: Response) {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "strict",
    path: "/api",
  });
  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "strict",
    path: "/api/auth/refresh",
  });
}

function sanitizeUser(user: any) {
  const { password: _password, ...rest } = user;
  return rest;
}
