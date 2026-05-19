import 'dotenv/config';

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

let _config: ReturnType<typeof buildConfig> | null = null;

/**
 * Build config from environment variables.
 * Separated from export to enable lazy-loading in tests.
 */
function buildConfig() {
  return {
    port: parseInt(process.env.PORT ?? '3000', 10),
    databaseUrl: required('DATABASE_URL'),
    corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173'],
    nodeEnv: process.env.NODE_ENV ?? 'development',
    isProduction: process.env.NODE_ENV === 'production',

    jwt: {
      accessSecret: required('JWT_ACCESS_SECRET'),
      refreshSecret: required('JWT_REFRESH_SECRET'),
      accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    },

    cookie: {
      refreshMaxAge: parseInt(process.env.COOKIE_REFRESH_MAX_AGE ?? '604800', 10) * 1000,
    },

    tmdb: {
      apiKey: required('TMDB_API_KEY'),
      baseUrl: process.env.TMDB_BASE_URL ?? 'https://api.themoviedb.org/3',
    },
  } as const;
}

/**
 * Get configuration with lazy initialization.
 * Allows tests to run without all env vars being set.
 */
export function getConfig() {
  if (!_config) {
    _config = buildConfig();
  }
  return _config;
}

/**
 * Alias for backward compatibility.
 * Avoid using in production code; prefer getConfig() to make lazy-loading clear.
 */
export const config = new Proxy({} as ReturnType<typeof buildConfig>, {
  get(_target, prop) {
    return getConfig()[prop as keyof ReturnType<typeof buildConfig>];
  },
});
