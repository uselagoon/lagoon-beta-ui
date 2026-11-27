# Node builder image
FROM uselagoon/node-22-builder:latest AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 300000

COPY . /app/
# Run next build directly to skip the uilib:update upgrade step (yarn build)
# which makes an extra network call and bypasses the frozen lockfile
RUN yarn next build

# Production image
FROM uselagoon/node-22:latest

WORKDIR /app

# Standalone output bundles only the necessary server-side dependencies,
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/overrides.json ./overrides.json

# Required for extensions
COPY --from=builder /app/extensions.json ./extensions.json
COPY --from=builder /app/src ./src
COPY --from=builder /app/utils ./utils
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs

COPY auth-entrypoint.sh /lagoon/entrypoints/99-auth-entrypoint.sh

LABEL org.opencontainers.image.title="lagoon-beta-ui" \
      org.opencontainers.image.description="The Lagoon UI - a Next.js interface for managing Lagoon projects and environments" \
      org.opencontainers.image.source="https://github.com/uselagoon/lagoon-beta-ui" \
      org.opencontainers.image.url="https://github.com/uselagoon/lagoon-beta-ui" \
      org.opencontainers.image.licenses="MIT" \
      repository="https://github.com/uselagoon/lagoon-beta-ui"

ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
