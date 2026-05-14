import { config } from "./config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import passport from "passport";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";

// Register passport strategies (side-effect imports)
import "./auth/strategies/local.strategy";
import "./auth/strategies/jwt.strategy";
import "./auth/strategies/jwt-refresh.strategy";

import router from "./router";
import { errorHandler } from "./common/error-handler";
import { logger } from "./common/logger";
import { prisma } from "./common/prisma";

async function bootstrap() {
  await prisma.$connect();
  logger.info("Connected to PostgreSQL");

  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    }),
  );

  // Global rate limiter: 100 requests per 15 minutes per IP
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        statusCode: 429,
        message: "Demasiadas solicitudes, intenta de nuevo más tarde",
      },
    }),
  );

  app.use(express.json());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(pinoHttp({ logger }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", router);

  app.use(errorHandler);

  app.listen(config.port, "0.0.0.0", () => {
    logger.info(`API running on http://0.0.0.0:${config.port}`);
  });
}

bootstrap().catch((err) => {
  logger.fatal(err, "Failed to start");
  process.exit(1);
});
