FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies (includes dev deps by default)
COPY package*.json ./
RUN npm install --no-audit --no-fund

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
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]