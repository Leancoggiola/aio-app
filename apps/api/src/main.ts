import { config } from './config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';

// Register passport strategies (side-effect imports)
import './auth/strategies/local.strategy';
import './auth/strategies/jwt.strategy';
import './auth/strategies/jwt-refresh.strategy';

import router from './router';
import { errorHandler } from './middleware/error-handler';
import { prisma } from './lib/prisma';

async function bootstrap() {
  await prisma.$connect();
  console.log('Connected to PostgreSQL');

  const app = express();

  app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(passport.initialize());

  app.use('/api', router);

  app.use(errorHandler);

  app.listen(config.port, () => {
    console.log(`API running on http://localhost:${config.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
