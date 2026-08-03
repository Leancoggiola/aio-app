import express from 'express';

import router from '../router';
import { errorHandler } from '../common/utils';

export function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', router);
  app.use(errorHandler);
  return app;
}
