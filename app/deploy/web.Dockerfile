# Multi-stage: pnpm build of web/ -> dist/ into a pinned Caddy image.
# Build context is app/ (docker build -f deploy/web.Dockerfile .)
FROM node:24-slim AS build
RUN corepack enable
WORKDIR /app
COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY web/package.json web/
RUN pnpm install --filter web --frozen-lockfile
COPY web/ web/
RUN pnpm --filter web build

FROM caddy:2.11.4
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/web/dist /srv
