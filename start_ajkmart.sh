#!/bin/bash

# --- DYNAMIC URL DETECTION ---
if [ -n "$CODESPACE_NAME" ]; then
    export DYNAMIC_URL="https://${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
else
    export DYNAMIC_URL="http://$(curl -s ifconfig.me || echo 'localhost'):3000"
fi

export VITE_API_URL="$DYNAMIC_URL"
export NEXT_PUBLIC_API_URL="$DYNAMIC_URL"

case $1 in
  api)
    echo "📡 Starting API Server..."
    cd artifacts/api-server && npx dotenv -e ../../.env -- pnpm run dev
    ;;
  admin)
    echo "💻 Starting Admin Panel..."
    cd artifacts/admin && npx dotenv -e ../../.env -- pnpm run dev
    ;;
  rider)
    echo "🏍️ Starting Rider App..."
    cd artifacts/rider-app && npx dotenv -e ../../.env -- pnpm run dev
    ;;
  vendor)
    echo "🏪 Starting Vendor App..."
    cd artifacts/vendor-app && npx dotenv -e ../../.env -- pnpm run dev
    ;;
  ajkmart)
    echo "🛒 Starting Customer App..."
    cd artifacts/ajkmart && PORT=3003 npx dotenv -e ../../.env -- pnpm exec expo start --web
    ;;
  test|live)
    echo "✅ Mode set to $1. Now run your app (e.g., api, ajkmart, admin)"
    ;;
  *)
    echo "Usage: api | admin | rider | vendor | ajkmart"
    ;;
esac
