## Lagoon UI

[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/11887/badge)](https://www.bestpractices.dev/projects/11887)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/uselagoon/lagoon-beta-ui/badge)](https://securityscorecards.dev/viewer/?uri=github.com/uselagoon/lagoon-beta-ui)

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

### Theme

Styles can be customized by adding a `theme` key to `overrides.json` in root. You can add values for `light`/`dark`/`both`. Any styling not defined falls back to the default.

```json
"theme": {
  "light": {
    "primary": "#3a8cff",
    "primary-foreground": "#ffffff"
  },
  "dark": {
    "primary": "#5ba3ff",
    "primary-foreground": "#0c0c0c"
  }
}
```

#### Available styling tokens

| Token | Affects |
|---|---|
| `background` | Page background |
| `foreground` | Default text colour |
| `card` | Card / stat box / alert background |
| `card-foreground` | Card text colour |
| `primary` | Primary buttons, active nav items, links |
| `primary-foreground` | Text on primary-coloured surfaces |
| `secondary` | Secondary buttons and badges |
| `secondary-foreground` | Text on secondary surfaces |
| `muted` | Subtle backgrounds (table rows, hover states) |
| `muted-foreground` | Subdued text (descriptions, placeholders) |
| `accent` | Hover highlight backgrounds |
| `accent-foreground` | Text on accent backgrounds |
| `destructive` | Destructive buttons, error alerts, danger badges |
| `border` | Borders on cards, inputs, table rows |
| `input` | Input field border / background |
| `ring` | Focus ring colour |
| `sidebar` | Sidebar background |

Any valid CSS value is accepted (`#hex`, `rgb()`, `oklch()`, named colours, etc).

#### Previewing themes in Storybook

Styling can be previewed live using Storybook:

```sh
yarn storybook
```

**Theming → Theme Preview** in the sidebar. Use the **Controls** panel at the bottom to adjust styling and see the live changes across a few demo components.

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

## Extension system

Extensions allow for build-time injection of custom components into the sidebar navigation, existing components or new pages enirely with no source code changes.

### Directory structure

Create a directory under `extensions/<your-extension-name>/` with the following layout:

```
extensions/
└── my-extension/
    ├── extension.json        # Manifest — required
    ├── pages/                # Next.js page files — copied into the app router
    └── components/           # React components rendered in targets/zones
```

Run `yarn build:extensions` (or `yarn build`) after adding or changing an extension. This copies pages and components into the app and generates the component registry.

### extension.json

```json
{
  "meta": {
    "name": "my-extension",
    "version": "1.0.0",
    "description": "Optional description"
  },
  "navigation": {
    "items": [
      {
        "id": "my-nav-item",
        "label": "My Page",
        "href": "/projects/[projectSlug]/my-page",
        "icon": "Star",
        "target": "sidebar-projects",
        "position": "end"
      }
    ],
    "sections": [
      {
        "section": "My Section",
        "position": "end",
        "items": [
          {
            "id": "my-section-item",
            "label": "Dashboard",
            "href": "/my-page",
            "icon": "LayoutDashboard"
          }
        ]
      }
    ]
  },
  "pages": [
    { "route": "my-page" },
    { "route": "projects/[projectSlug]/my-page" }
  ],
  "zones": [
    {
      "id": "my-zone-component",
      "component": "MyComponent",
      "zone": "environment-footer"
    }
  ]
}
```

#### Navigation targets

Nav items can be injected into any sidebar section via `target`:

| Value | Section |
|---|---|
| `sidebar-projects` | Projects section (supports `[projectSlug]` token in `href`) |
| `sidebar-environments` | Environments (nested under projects, supports `[projectSlug]` and `[environmentSlug]`) |
| `sidebar-deployments` | Deployments section |
| `sidebar-organizations` | Organizations section |
| `sidebar-settings` | Settings section |

URL vars `[projectSlug]` and `[environmentSlug]` are resolved automatically at runtime. Nav items with unresolved vars (e.g. no active project) are hidden until the context is available.

`position` can be `"start"`, `"end"`, or a numbered index. Sidebar sections also accept `position`.

#### Zone locations/components

Zone components are rendered at fixed injection points in existing pages:

| Value | Where it renders | `data` props available |
|---|---|---|
| `environment-header` | Top of the environment overview page | `environmentName`, `environmentType`, `deployType`, `created`, `updated` |
| `environment-footer` | Bottom of the environment overview page | `environmentName`, `environmentType`, `deployType`, `created`, `updated` |
| `project-header` | Top of the project details page | `projectName`, `gitUrl`, `created` |
| `project-footer` | Bottom of the project details page | `projectName`, `gitUrl`, `created` |
| `organization-header` | Top of the organization overview page | `organizationId`, `organizationName`, `friendlyName` |
| `organization-footer` | Bottom of the organization overview page | `organizationId`, `organizationName`, `friendlyName` |
| `global-header` | Above all page content (every page) | none |
| `global-footer` | Below all page content (every page) | none |

Zone components receive a typed `data` prop containing context from the host page. Each zone location has a corresponding exported Type.

| Zone | Type |
|---|---|
| `environment-header`, `environment-footer` | `EnvironmentZoneData` |
| `project-header`, `project-footer` | `ProjectZoneData` |
| `organization-header`, `organization-footer` | `OrganizationZoneData` |
| `global-header`, `global-footer` | `GlobalZoneData` (no data) |

Zone components must be exported as **named exports** from their file and placed under `extensions/<name>/components/`. The filename (without extension) is what you reference in `extension.json` as `component`.

```tsx
// extensions/my-extension/components/ExampleComponent.tsx
'use client';

import type { EnvironmentZoneData } from '@lagoon/ui/extensions';

export function ExampleComponent({ data }: { data: EnvironmentZoneData }) {
  return <div>Environment: {data.environmentName}</div>;
}
```

#### Icons

The `icon` field accepts any [Lucide](https://lucide.dev/icons/) icon name as a string (e.g. `"Star"`, `"BarChart3"`, `"LayoutDashboard"`).

#### Role-based access

Access to Nav items, sidebar sections, pages, zones etc can be controlled by the Platform level Keycloak roles using `requiredRoles` and `excludeRoles`.

| Field | Description |
|---|---|
| `requiredRoles` | User must have **at least one** of the listed roles to access this item |
| `excludeRoles` | User must have **none** of the listed roles — takes precedence over `requiredRoles` |

If neither are set the extension is accessible to all authenticated users.

Pages support `accessDeniedRedirect` to control the redirecxt location if access is denied (defaults to `/projects`).

```json
{
  "navigation": {
    "items": [
      {
        "id": "my-nav-item",
        "label": "Example",
        "href": "/organizations/[organizationSlug]/example",
        "icon": "Star",
        "target": "sidebar-organizations",
        "requiredRoles": ["platform-owner"],
        "excludeRoles": ["platform-viewer"]
      }
    ],
    "sections": [
      {
        "section": "Example",
        "requiredRoles": ["platform-owner"],
        "items": [
          {
            "id": "example-item",
            "label": "Example Dashboard",
            "href": "/example",
            "requiredRoles": ["platform-owner"],
            "excludeRoles": ["platform-viewer"]
          }
        ]
      }
    ]
  },
  "pages": [
    {
      "route": "organizations/[organizationSlug]/example",
      "requiredRoles": ["platform-organization-owner"],
      "excludeRoles": ["platform-viewer"],
      "accessDeniedRedirect": "/projects"
    }
  ],
  "zones": [
    {
      "id": "example-zone",
      "component": "ExampleZoneComponent",
      "zone": "organization-footer",
      "requiredRoles": ["platform-owner"]
    }
  ]
}
```

> **Note:** `requiredRoles` on a page controls the nav link visibility and triggers a redirect if the user navigates directly to the URL. To enforce access on the page itself, wrap the page content in `ExtensionRouteGuard`:
>
> ```tsx
> import { ExtensionRouteGuard } from '@/components/extensions/ExtensionRouteGuard';
>
> export default function MyPage() {
>   return (
>     <ExtensionRouteGuard route="organizations/[organizationSlug]/my-page">
>       {/* page content */}
>     </ExtensionRouteGuard>
>   );
> }
> ```

#### Pages

Page files follow the [Next.js App Router](https://nextjs.org/docs/app) convention and are placed under `pages/` using the same folder structure as the app router. For example, `pages/analytics/page.tsx` maps to `/analytics` | `/pages/(projectroutes)/projects/[projectSlug]/analytics/page.tsx` maps to `/projects/example-project/analytics`

Route group directories (e.g. `(projectroutes)`) are supported. Use the same route group names as the core app.

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
