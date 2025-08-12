# Node builder image
FROM uselagoon/node-22-builder:latest AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 300000

COPY . /app/
RUN yarn run build

# Production image
FROM uselagoon/node-22:latest

WORKDIR /app

# Copy only production node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

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
CMD ["yarn", "start"]
