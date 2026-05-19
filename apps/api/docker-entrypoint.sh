#!/bin/sh
set -e

if [ -z "$DIRECT_URL" ]; then
  echo "ERROR: DIRECT_URL is required for prisma migrate deploy."
  echo "Use the Supabase Direct connection (port 5432). DATABASE_URL with the transaction pooler cannot run migrations."
  exit 1
fi

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting API server on port ${PORT:-3000}..."
exec node dist/main.js
