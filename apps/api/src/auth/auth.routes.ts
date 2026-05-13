import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import * as authService from "./auth.service";
import { registerSchema } from "@aio-app/shared/auth";
import { validate } from "../common/validate";
import {
  authenticateLocal,
  authenticateJwt,
  authenticateJwtRefresh,
} from "./middleware/auth.middleware";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { statusCode: 429, message: "Too many attempts, try again later" },
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { statusCode: 429, message: "Too many attempts, try again later" },
});

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body, res);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/login",
  authLimiter,
  authenticateLocal,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.user as any, res);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/refresh",
  refreshLimiter,
  authenticateJwtRefresh,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, refreshToken } = req.user as any;
      const result = await authService.refresh(userId, refreshToken, res);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/logout",
  authenticateJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user as any;
      const refreshToken = req.cookies?.refresh_token;
      const result = await authService.logout(userId, refreshToken, res);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  "/profile",
  authenticateJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user as any;
      const result = await authService.getProfile(userId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
