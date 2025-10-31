#!/bin/sh
set -e

if [ "${APP_DEBUG:-false}" = "true" ]; then
  echo "Starting Nuxt in development mode..."
  exec npm run dev
else
  echo "Starting Nuxt in production mode..."  
  exec node .output/server/index.mjs
fi