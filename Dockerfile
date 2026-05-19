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
# replacing a full node_modules copy with a much smaller footprint
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/overrides.json ./overrides.json

COPY auth-entrypoint.sh /lagoon/entrypoints/99-auth-entrypoint.sh

ARG LAGOON_VERSION
ENV LAGOON_VERSION=$LAGOON_VERSION

ARG GRAPHQL_API
ENV GRAPHQL_API=$GRAPHQL_API

ARG AUTH_KEYCLOAK_ID
ENV AUTH_KEYCLOAK_ID=$AUTH_KEYCLOAK_ID

ARG AUTH_KEYCLOAK_SECRET
ENV AUTH_KEYCLOAK_SECRET=$AUTH_KEYCLOAK_SECRET

ARG AUTH_SECRET
ENV AUTH_SECRET=$AUTH_SECRET

ARG AUTH_KEYCLOAK_ISSUER
ENV AUTH_KEYCLOAK_ISSUER=$AUTH_KEYCLOAK_ISSUER

LABEL org.opencontainers.image.title="lagoon-beta-ui" \
      org.opencontainers.image.description="The Lagoon UI - a Next.js interface for managing Lagoon projects and environments" \
      org.opencontainers.image.source="https://github.com/uselagoon/lagoon-beta-ui" \
      org.opencontainers.image.url="https://github.com/uselagoon/lagoon-beta-ui" \
      org.opencontainers.image.licenses="MIT" \
      repository="https://github.com/uselagoon/lagoon-beta-ui"

ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
