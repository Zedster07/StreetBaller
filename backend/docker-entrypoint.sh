#!/bin/sh

# Exit on error
set -e

echo "Waiting for PostgreSQL..."
# Wait for PostgreSQL to be ready
until psql -h postgres -U streetballer -d streetballer -c "SELECT 1" > /dev/null 2>&1; do
  sleep 1
done

echo "PostgreSQL is ready!"

# Run Prisma migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Run Prisma seed if exists
if [ -f prisma/seed.ts ]; then
  echo "Seeding database..."
  npx ts-node prisma/seed.ts || true
fi

echo "Starting StreetBaller API..."
exec "$@"
