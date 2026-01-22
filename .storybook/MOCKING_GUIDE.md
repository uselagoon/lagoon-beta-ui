# Storybook Mocking Guide

This guide explains how to create stories with mocked GraphQL data that updates when mutations are triggered.

## Overview

The mocking system uses:
- **MSW (Mock Service Worker)** to intercept GraphQL requests
- **StatefulMockStore** to maintain state across queries and mutations
- **initialMockState** parameter to set up initial data per story

## How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Story File     │────▶│  stateStore     │◀────│  MSW Handlers   │
│  (initial data) │     │  (central state)│     │  (intercept GQL)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌─────────────────┐
                        │  Component gets │
                        │  mocked data    │
                        └─────────────────┘
```

1. Story defines `initialMockState` with mock data
2. `withStatefulMocks` decorator loads this into `stateStore`
3. MSW handlers intercept GraphQL queries and return data from `stateStore`
4. When mutations happen, handlers update `stateStore`
5. Subsequent queries return the updated data

## Creating a New Story

### Step 1: Define Your Mock Data

In your story file, define the initial data your component needs:

```tsx
// MyPage.stories.tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import myQuery from '@/lib/query/myQuery';
import MyPage from './MyPage';

// Define your mock data
const initialItems = [
  { id: 1, name: 'Item One', status: 'active' },
  { id: 2, name: 'Item Two', status: 'pending' },
];

const meta: Meta<typeof MyPage> = {
  title: 'Pages/MyPage',
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
    // Set up the initial mock state
    initialMockState: {
      // 'items' is the store key that handlers.ts will look for
      items: {
        // 'my-project' matches the query variable
        'my-project': initialItems,
      },
    },
  },
  render: () => (
    <MockPreloadQuery query={myQuery} variables={{ projectName: 'my-project' }}>
      {queryRef => <MyPage queryRef={queryRef} />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof MyPage>;

export const Default: Story = {};
```

### Step 2: Ensure Handler Exists

Check that `handlers.ts` has a handler for your query. If not, add one:

```tsx
// .storybook/mocks/handlers.ts

lagoonGraphQL.query('myQueryName', ({ variables }) => {
  const projectName = variables.projectName as string;
  
  // Get data from store, or use default if not set
  const items = getStateArray('items', projectName, defaultItems);
  
  return HttpResponse.json({
    data: { project: { items } },
  });
}),
```

### Step 3: Add Mutation Handler (if needed)

If your component has mutations, add handlers in `mutationHandlers.ts`:

```tsx
// .storybook/mocks/mutationHandlers.ts

lagoonGraphQL.mutation('addItem', ({ variables }) => {
  const { projectName, name } = variables as { projectName: string; name: string };
  
  const newItem = {
    id: stateStore.generateId(),
    name,
    status: 'active',
  };
  
  // Update the store - this makes the data available on next query
  stateStore.upsert('items', projectName, newItem);
  
  return HttpResponse.json({
    data: { addItem: newItem },
  });
}),

lagoonGraphQL.mutation('deleteItem', ({ variables }) => {
  const { projectName, id } = variables as { projectName: string; id: number };
  
  // Remove from store
  stateStore.remove('items', projectName, (item: { id: number }) => item.id === id);
  
  return HttpResponse.json({
    data: { deleteItem: 'success' },
  });
}),
```


## Debugging Tips

1. **Data not showing?** Check that your store key matches what the handler expects
2. **Mutation not updating?** Verify the mutation handler updates the same store key the query reads from
3. **Wrong data?** Check the query variable value matches your initialMockState key

## Files Reference

| File | Purpose |
|------|---------|
| `.storybook/mocks/handlers.ts` | Query handlers - return data from stateStore |
| `.storybook/mocks/mutationHandlers.ts` | Mutation handlers - update stateStore |
| `.storybook/mocks/statefulStore.ts` | Central state management |
| `.storybook/mocks/storyHelpers.ts` | Type definitions and utilities |
| `.storybook/mocks/defaultMockData.ts` | Default data when store is empty |
| `.storybook/decorators/withStatefulMocks.tsx` | Initializes store from initialMockState |
| `.storybook/decorators/MockPreloadQuery.tsx` | Provides query ref to components |
