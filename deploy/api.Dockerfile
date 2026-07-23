# Multi-stage: deps -> build (tsc) -> runtime on node:24-slim, non-root.
# Build context is the repo root (docker build -f deploy/api.Dockerfile .)
FROM node:24-slim AS deps
RUN corepack enable
WORKDIR /app
COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY api/package.json api/
RUN pnpm install --filter api --frozen-lockfile

FROM deps AS build
COPY api/ api/
# prisma.config.ts resolves DATABASE_URL even for generate; placeholder only,
# never a real connection (the client connects at runtime via the real env).
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
RUN pnpm --filter api exec prisma generate && pnpm --filter api build

FROM node:24-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
# pnpm workspace node_modules are symlinks into the root store — copy both
# trees in the same relative layout so the links resolve (this also keeps the
# generated Prisma client). TODO: slim with `pnpm deploy` once the Prisma
# generator output moves into src/.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/api ./api
WORKDIR /app/api
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/healthz').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "dist/server.js"]
