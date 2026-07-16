# Lagoon UI Library

A component library based on [Shadcn](https://ui.shadcn.com/) and [Tailwind](https://tailwindcss.com/) for all things Lagoon related.

This library is located at `src/ui-library/` within the lagoon-beta-ui monorepo.

## Usage 🔨

Components are imported using the `@/ui-library` path alias:

```tsx
import { Button, Switch } from '@/ui-library';

export default () => (
  <>
    <Button variant="ghost" disabled>A spooky disabled button</Button>
    <Switch id="first" />
  </>
);
```

## Storybook 🎨

Run Storybook locally from the project root:

```bash
yarn storybook
```

Open your browser and visit [http://localhost:6006](http://localhost:6006).

## Development guide 🏗️

The UI library is located at `src/ui-library/` in the lagoon-beta-ui monorepo.

```bash
cd lagoon-beta-ui
yarn install
yarn storybook
```

It is recommended to build components in isolation with the help of Storybook.

The library structure is as follows:

```
src/ui-library/
├── components/       # React components
│   ├── ui/          # Shadcn base components
│   └── ...          # Custom components
├── hooks/           # Custom hooks
├── providers/       # Custom theme and NextLink providers
├── stories/         # Storybook stories
├── schemas/         # Zod validation schemas
├── lib/             # Utilities (e.g., cn helper)
├── _util/           # Internal utilities
└── index.ts         # Main export file
```

Navigate to `src/ui-library/` and modify/create new components with their respective `stories.tsx` files.

Modify and customize anything with Tailwind and/or custom CSS files if needed.

Then run the lint and format scripts:

```bash
yarn typecheck    # TypeScript check
yarn lint         # ESLint
yarn format       # Prettier formatting
```

### Adding Shadcn Components

To add a new component from Shadcn, refer to the [Shadcn CLI guide](https://ui.shadcn.com/docs/cli).

## Path Aliases

The UI library uses the following path aliases:

- `@/ui-library` - Import components from main app code
- `@ui-lib/*` - Internal imports within the ui-library itself

Example internal import (within ui-library):
```tsx
import { cn } from '@ui-lib/lib/utils';
```

Example external import (from main app):
```tsx
import { Button } from '@/ui-library';
```

## Contributing 🤝

PRs and issues are welcome, we invite contributions from everyone.

This guide could come in handy: [GitHub contribution guide](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)
