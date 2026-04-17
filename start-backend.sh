#!/bin/bash

echo "Starting AJKMart Backend API Server..."

# Read .env and export all variables
export $(cat /workspaces/today/.env | grep -v '^#' | grep -v '^$' | cut -d= -f1)

echo "DATABASE_URL: ${DATABASE_URL:0:50}..."
echo "PORT: ${PORT}"
echo "JWT_SECRET: ${JWT_SECRET:0:20}..."

# Use env to explicitly pass variables
cd /workspaces/today && env DATABASE_URL="$DATABASE_URL" PORT="$PORT" JWT_SECRET="$JWT_SECRET" ADMIN_JWT_SECRET="$ADMIN_JWT_SECRET" ADMIN_SECRET="$ADMIN_SECRET" CSRF_SECRET="$CSRF_SECRET" NODE_ENV="$NODE_ENV" pnpm --filter @workspace/api-server run dev
