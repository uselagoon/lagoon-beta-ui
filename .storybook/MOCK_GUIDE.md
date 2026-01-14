# Storybook Mock System Guide

This guide explains how to add new mocks for GraphQL queries and mutations in Storybook.

## Architecture Overview

```
┌─────────────────┐    setState     ┌─────────────────┐    getState     ┌─────────────────┐
│    Mutation     │ ─────────────▶ │   stateStore    │ ◀───────────── │     Query       │
│    Handler      │                 │ (statefulStore) │                 │    Handler      │
└─────────────────┘                 └─────────────────┘                 └─────────────────┘
                                           │
                                           │ initialMockState (from story parameters)
                                           ▼
                                    ┌─────────────────┐
                                    │     Story       │
                                    │   parameters    │
                                    └─────────────────┘
```

**Key Files:**

| File | Purpose |
|------|---------|
| `handlers.ts` | Query handlers - respond to GraphQL queries |
| `mutationHandlers.ts` | Mutation handlers - modify state and respond |
| `statefulStore.ts` | In-memory state that persists during story |
| `storyHelpers.ts` | Helper functions to create initial mock state |
| `defaultMockData.ts` | Default data returned when no state is set |
| `handlerUtils.ts` | Shared utilities for handlers |

## Adding a New Query

### Step 1: Add Default Data

Add default mock data to `defaultMockData.ts`:

```typescript
export const defaultWidgets = [
  { id: 1, name: 'Widget A', status: 'active' },
  { id: 2, name: 'Widget B', status: 'inactive' },
];
```

### Step 2: Add Query Handler

Add handler to `handlers.ts`:

```typescript
import { defaultWidgets } from './defaultMockData';
import { getStateArrayOrDefault } from './handlerUtils';

// In the handlers array:
lagoonGraphQL.query('getWidgets', ({ variables }) => {
  const projectId = variables.projectId as string;

  // Try to get from state, fall back to default
  const widgets = getStateArrayOrDefault('widgets', projectId, defaultWidgets);

  return HttpResponse.json({
    data: { widgets },
  });
}),
```

### Step 3: Add Story Helper (Optional but Recommended)

Add helper to `storyHelpers.ts`:

```typescript
export type Widget = {
  id: number;
  name: string;
  status: string;
};

export function createWidgetsMockState(projectId: string, widgets: Widget[]): InitialMockState {
  return {
    widgets: {
      [projectId]: widgets,
    },
  };
}
```

### Step 4: Use in Story

```typescript
import { createWidgetsMockState } from '../../../../.storybook/mocks/storyHelpers';

const meta: Meta<typeof WidgetsPage> = {
  title: 'Pages/Widgets',
  parameters: {
    initialMockState: createWidgetsMockState('project-1', [
      { id: 1, name: 'Custom Widget', status: 'active' },
    ]),
  },
  // ...
};
```

## Adding a New Mutation

### Step 1: Add Mutation Handler

Add handler to `mutationHandlers.ts`:

```typescript
lagoonGraphQL.mutation('createWidget', ({ variables }) => {
  const { input } = variables as { input: { name: string; projectId: string } };

  // Create new item
  const newWidget = {
    id: stateStore.generateId(),
    name: input.name,
    status: 'active',
  };

  // Add to state (so query refetch sees it)
  stateStore.upsert('widgets', input.projectId, newWidget, (e, n) => e.id === n.id);

  return HttpResponse.json({
    data: { createWidget: newWidget },
  });
}),
```

### Step 2: Ensure Query Uses Same State Key

The query handler must read from the same state key (`'widgets'`) for refetch to work:

```typescript
// In handlers.ts - query reads from 'widgets'
const widgets = getStateArrayOrDefault('widgets', projectId, defaultWidgets);
```

## State Flow for Refetch

For mutations to affect subsequent query refetches:

1. **Mutation** calls `stateStore.upsert()` or `stateStore.setState()` with entity type and key
2. **Query** calls `stateStore.getState()` with the **same** entity type and key
3. When Apollo refetches, the query handler returns the updated state

**Example:**

```typescript
// Mutation stores to 'widgets' + 'project-1'
stateStore.upsert('widgets', 'project-1', newWidget);

// Query reads from 'widgets' + 'project-1'
const widgets = stateStore.getState('widgets', 'project-1');
```

## Utility Functions

### `getStateArrayOrDefault<T>(entityType, key, defaultValue)`
Returns state array or default if not found.

### `getStateOrDefault<T>(entityType, key, defaultValue)`
Returns single state value (unwraps array) or default.

### `findAndUpdateInKeys<T>(entityType, keys, predicate, updater)`
Finds and updates items across multiple keys.

### `removeFromKeys<T>(entityType, keys, predicate)`
Removes items matching predicate from multiple keys.

### `queryIncludesAll(query, fields)`
Checks if query string contains all specified fields.

### `queryIncludesNone(query, fields)`
Checks if query string contains none of the specified fields.

## Common Patterns

### Multi-Key State Updates

Some mutations need to update state across multiple keys:

```typescript
import { ORG_KEYS, ENV_KEYS } from './handlerUtils';

// Update deployments across all environment keys
for (const key of ENV_KEYS) {
  const deployments = stateStore.getState('deployments', key);
  if (deployments) {
    stateStore.setState('deployments', key, [...deployments, newDeployment]);
    break; // Only add to first found
  }
}
```

### Conditional Query Handling

Handle different query shapes in the same handler:

```typescript
lagoonGraphQL.query('getProject', ({ variables, query }) => {
  const projectName = variables.name as string;

  // Different response based on what fields are requested
  if (query.includes('apiRoutes')) {
    return HttpResponse.json({ data: { projectRoutes: { ... } } });
  }

  if (query.includes('environments')) {
    return HttpResponse.json({ data: { project: { environments: [...] } } });
  }

  // Default response
  return HttpResponse.json({ data: { project: { ... } } });
});
```

### Factory Functions for Similar Handlers

For repetitive handlers (like notifications), use factories:

```typescript
import { createAddNotificationHandler, notificationFieldExtractors } from './handlerUtils';

// Instead of 5 separate handlers:
const addSlackHandler = createAddNotificationHandler('Slack', notificationFieldExtractors.Slack);
const addEmailHandler = createAddNotificationHandler('Email', notificationFieldExtractors.Email);
// etc.
```

## Testing Interactive Flows

Stories can test full CRUD flows:

```typescript
export const CreateAndDelete: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Create
    await userEvent.click(await canvas.findByRole('button', { name: 'Add' }));
    await userEvent.type(await screen.findByLabelText('Name'), 'New Item');
    await userEvent.click(await screen.findByRole('button', { name: 'Create' }));

    // Verify it appears (query refetched with new state)
    await canvas.findByText('New Item');

    // Delete
    await userEvent.click(await canvas.findByRole('button', { name: 'Delete' }));
    await waitFor(() => {
      expect(canvas.queryByText('New Item')).not.toBeInTheDocument();
    });
  },
};
```
