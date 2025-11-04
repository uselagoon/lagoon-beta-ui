## Lagoon UI

The main user interface and dashboard for [Lagoon](https://github.com/uselagoon/lagoon).

## Build

To build and test changes locally the Lagoon UI can be built via Yarn or Docker.

Testing locally, the UI can be connected to production or development Lagoon instances.

There are a few differnt ways to run the UI locally for development. Those methods are described below. In the examples, references to the API and Keycloak are set up using `localhost`, but you can replace this with values for your own Lagoon instance as required.

This project is tested with BrowserStack.

### Yarn

Note: Within `docker-compose.yml` `GRAPHQL_API` & `KEYCLOAK_API` are set to localhost by default.

```sh
yarn install
yarn build && GRAPHQL_API=http://localhost:3000/graphql AUTH_SECRET=<AUTH_SECRET> AUTH_KEYCLOAK_ID=lagoon-ui-oidc AUTH_KEYCLOAK_SECRET=<SECRET_HERE> AUTH_KEYCLOAK_ISSUER=http://localhost:8088/auth/realms/lagoon yarn dev
```

These values can also be updated in `docker-compose.yml`.

### Docker compose - simple

With this option, the UI source code is mounted into the running container. This allows for changes to the UI to be updated immediately, rather than having to rebuild.

Note: Within `docker-compose.yml` `GRAPHQL_API`, `AUTH_SECRET`, `AUTH_KEYCLOAK_ID`, `AUTH_KEYCLOAK_SECRET` & `AUTH_KEYCLOAK_ISSUER` will need to be set to

```
  GRAPHQL_API: "${GRAPHQL_API:-http://localhost:3000/graphql}"
  AUTH_SECRET: "${AUTH_SECRET:-SECRET}"
  AUTH_KEYCLOAK_ID: "${AUTH_KEYCLOAK_ID:-lagoon-ui-oidc}"
  AUTH_KEYCLOAK_SECRET: "${AUTH_KEYCLOAK_SECRET:-SECRET}"
  AUTH_KEYCLOAK_ISSUER: "${AUTH_KEYCLOAK_ISSUER:-http://localhost:8088/auth/realms/lagoon}"
```

```
docker-compose build
docker-compose up -d
```

### Docker compose - advanced

Using one of the following options will let you develop locally against a locally running API.

#### Stable API

This will start a local API from the latest stable Lagoon core release.

```
make start-ui-stable-api
```

#### Development API

This will start a local API by default with the latest code that is in the `main` branch in `uselagoon/lagoon`. This branch can be changed by setting `CORE_TREEISH` to a different working branch for developing new features in the API.

```
make start-ui-dev-api
# or
make start-ui-dev-api CORE_TREEISH=api-feature-branch
```

There are some other options that can be adjusted too, see the `Makefile`.

#### Stopping the environment

Once you're finished, you can stop the local API and UI by running the following. This will shut down the API and the UI and clean up anything that is no longer required.

```
make clean
```

## Linting

The linter is configured for both JS and TypeScript files, with the latter being much stricter.
It runs during the build step but can also be ran during development by `yarn lint`

Linter and TS configs are both located in the root of the project as `.eslintrc.cjs` and `tsconfig.json`

## Testing

Lagoon UI uses cypress for e2e tests.

A couple of environment variables are required:

- email - keycloak user
- password - keycloak password
- keycloak - Keycloak url (used for cypress sessions)
- api - GraphQL api endpoint
- url - running UI instance url
- user_guest - user with guest role
- user_reporter - user with reporter role
- user_developer - user with developer role
- user_maintainer - user with maintainer role
- user_owner - user with owner role
- user_orguser - Organization user
- user_orgviewer - Organization viewer
- user_orgadmin - Organization admin
- user_orgowner - Organization owner
- user_platformowner - Platform owner

These environment variables can either be inlined or saved in `Cypress.config.ts` file:

```ts
import { defineConfig } from 'cypress'

export default defineConfig({
  env: {
    foo: 'bar',
    CYPRESS_CY_EMAIL: ...
    ...
  },
})
```

To open cypress in a browser:

```sh
npx cypress open
```

To run cypress tests in headless mode:

```sh
npx cypress run
```

## Styling

Lagoon-UI uses [Lagoon ui-library](https://github.com/uselagoon/ui-library) (based on Shadcn) and tailwind.
It is also possible to natively use css and css modules.

## Plugin system

The Lagoon UI supports basic plugins via a plugin registry.
The file, in the root, "plugins.json" allows you to hook into the server side rendering to add additional CSS and Javascript files. These are simply added as "script" and "link" elements to the resulting HTML.
We currently support adding elements to the `head` at at the end of the `body` as demonstrated below.

In this example, we load two elements, a JS script and a css file into the `head`, and then we add an external library at the bottom of the `body`.

```
{
    "head": [
        {"type": "script", "location":"/static/custom.js"},
        {"type": "link",   "href":"/static/plugins/custom.css"}

    ],
    "body": [
        {"type": "script", "location":"https://www.cornify.com/js/cornify.js"}
    ]
}
```

## Project structure

Lagoon UI is built on Next.js app router, leveraging React Server Components, TypeScript and optimized GraphQL data fetching for seamless interactivity.

Lagoon UI also uses NextAuth (now [Auth.js](https://authjs.dev/)) and Keycloak for authentication.

As mentioned, the UI uses its own [UI library](https://github.com/uselagoon/ui-library) with ready to use Shadcn components.

Ever since Next.js deprecated `publicRuntimeConfig`, the UI use [next-runtime-env](https://www.npmjs.com/package/next-runtime-env) to replicate the same behavior for the app router.

The app router structure is as follows:

```
├── src
│   ├── app                                  # Next.js App Router pages and routes
│   │   ├── (routegroups)                    # Top level route group
│   │   │   └── (orgroutes)                  # Route group for organizations
│   │   │       └── organizations
│   │   │           ├── [organizationSlug]
│   │   │           │   ├── (organization-overview)
│   │   │           │   ├── groups
│   │   │           │   ├── manage
│   │   │           │   ├── notifications
│   │   │           │   ├── projects
│   │   │           │   ├── users
│   │   │           │   └── variables
│   │   │           └── layout.tsx          # Org level layout
│   │   ├── (projectroutes)                 # Route group for projects
│   │   │   └── projects
│   │   │       ├── (projects-page)
│   │   │       └── [projectSlug]
│   │   │           ├── (project-overview)
│   │   │           ├── deploy-targets
│   │   │           ├── project-details
│   │   │           └── project-variables
│   │   ├── api                 # API routes
│   │   │   ├── auth
│   │   │   ├── login
│   │   │   └── logout
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components              # Reusable React components
│   ├── contexts                # React context providers (mostly used in the root layout)
│   ├── hooks                   # Custom React hooks
│   ├── lib                     # Utility functions and libraries
│   ├── styles                  # Additional stylesheets
│   ├── auth.ts                 # Authentication logic
│   └── middleware.ts           # Next.js middleware
├── .env.local                  # Local environment variables
├── .eslintrc.cjs              # ESLint configuration
└── package.json               # Dependencies and scripts
```

Each route has a `page.tsx` (a server component) and a `loading.tsx` (a client-component) file.

Most of the time, these Server component pages act as query preloaders (on the server), then the data gets streamed into a client component

Example:

```tsx
// server component
export default async function Groups(props: { params: Promise<{ organizationSlug: string }> }) {
  const params = await props.params;

  const { organizationSlug } = params;

  return (
    <PreloadQuery
      query={organizationByNameGroups}
      variables={{
        displayName: 'Organization',
        name: organizationSlug,
        limit: null,
      }}
    >
      {queryRef => (
        // client component
        <GroupsPage organizationSlug={organizationSlug} queryRef={queryRef as QueryRef<OrganizationGroupsData>} />
      )}
    </PreloadQuery>
  );
}
```

The RootLayout is where all your providers (internal or external) get wrapped together, so the whole app shares context and setup in one place
