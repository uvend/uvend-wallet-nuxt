FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies (includes dev deps by default)
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Available during `nuxt build` (SPA bakes public runtime config)
ARG NUXT_PUBLIC_USE_APP_LOGO=false
ENV NUXT_PUBLIC_USE_APP_LOGO=$NUXT_PUBLIC_USE_APP_LOGO

# Copy source and build production output
COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

# Copy runtime needs for both modes
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package*.json /app/
COPY . .
COPY --from=build /app/.output /app/.output


ARG PORT=${PORT:-3000}
ARG HOST=${HOST:-0.0.0.0}
ARG WALLET_API_URL=${WALLET_API_URL:-}
ARG NUXT_PUBLIC_USE_APP_LOGO=${NUXT_PUBLIC_USE_APP_LOGO:-false}

ENV PORT=${PORT:-3000}
ENV HOST=${HOST:-0.0.0.0}
ENV WALLET_API_URL=${WALLET_API_URL:-}
ENV NUXT_PUBLIC_USE_APP_LOGO=${NUXT_PUBLIC_USE_APP_LOGO:-false}

EXPOSE ${PORT}

CMD ["node", ".output/server/index.mjs"]
