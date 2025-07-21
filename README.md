## Lagoon UI v3

Under development - development guide todo.

To run locally with test6:

```sh
yarn && GRAPHQL_API=https://api.main.lagoon-core.test6.amazee.io/graphql AUTH_SECRET=test AUTH_KEYCLOAK_ID=lagoon-ui-oidc AUTH_KEYCLOAK_SECRET=40086d1c-5acc-4c9c-a1c1-fbdde5947a44 AUTH_KEYCLOAK_ISSUER=https://keycloak.main.lagoon-core.test6.amazee.io/auth/realms/lagoon yarn build && GRAPHQL_API=https://api.main.lagoon-core.test6.amazee.io/graphql AUTH_SECRET=test AUTH_KEYCLOAK_ID=lagoon-ui-oidc AUTH_KEYCLOAK_SECRET=40086d1c-5acc-4c9c-a1c1-fbdde5947a44 AUTH_KEYCLOAK_ISSUER=https://keycloak.main.lagoon-core.test6.amazee.io/auth/realms/lagoon yarn dev
```

to run locally with https://github.com/uselagoon/lagoon/tree/ui-oidc-client branch:

```sh
 yarn && GRAPHQL_API=http://0.0.0.0:33000/graphql AUTH_SECRET=test AUTH_KEYCLOAK_ID=lagoon-ui-oidc AUTH_KEYCLOAK_SECRET=20580a56-6fbc-11ef-9a5b-3b4da292aa54 AUTH_KEYCLOAK_ISSUER=http://0.0.0.0:38088/auth/realms/lagoon yarn build && GRAPHQL_API=http://0.0.0.0:33000/graphql AUTH_SECRET=test AUTH_KEYCLOAK_ID=lagoon-ui-oidc AUTH_KEYCLOAK_SECRET=20580a56-6fbc-11ef-9a5b-3b4da292aa54 AUTH_KEYCLOAK_ISSUER=http://0.0.0.0:38088/auth/realms/lagoon yarn dev

```
