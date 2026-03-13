# Node builder image
FROM uselagoon/node-22-builder:latest AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY . /app/
RUN pnpm run build

# Production image
FROM uselagoon/node-22:latest

WORKDIR /app

# Copy only production node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
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

EXPOSE 3000
CMD ["pnpm", "start"]
