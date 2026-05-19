import pino from 'pino';
import { getConfig } from '../../config';

const config = getConfig();

export const logger = pino({
  level: config.isProduction ? 'info' : 'debug',
  ...(config.isProduction ? {} : { transport: { target: 'pino-pretty', options: { colorize: true } } }),
});
