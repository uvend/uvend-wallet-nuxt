#!/bin/sh
set -e

if [ "${NODE_ENV:-production}" = "development" ]; then
  echo "Starting Nuxt in development mode..."
  exec npm run dev
else
  echo "Starting Nuxt in production mode..."
  exec node .output/server/index.mjs
fi


