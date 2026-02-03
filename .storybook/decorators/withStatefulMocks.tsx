import React from 'react';

import { Decorator } from '@storybook/react';

import { stateStore } from '../mocks/statefulStore';
import { InitialMockState } from '../mocks/storyHelpers';

declare global {
  var __STORYBOOK_STATEFUL_MOCKS_LAST_ID__: string | null;
}

globalThis.__STORYBOOK_STATEFUL_MOCKS_LAST_ID__ ??= null;

export const withStatefulMocks: Decorator = (Story, context) => {
  const initialState = context.parameters?.initialMockState as InitialMockState | undefined;
  const storyId = context.id;

  if (globalThis.__STORYBOOK_STATEFUL_MOCKS_LAST_ID__ !== storyId) {
    stateStore.reset();
    console.log('[withStatefulMocks] Resetting state for story:', storyId);

    if (initialState) {
      console.log('[withStatefulMocks] Initializing state:', initialState);
      Object.entries(initialState).forEach(([entityType, entities]) => {
        Object.entries(entities).forEach(([keyName, data]) => {
          console.log('[withStatefulMocks] setState:', entityType, keyName, data);
          stateStore.setState(entityType, keyName, data as unknown[]);
        });
      });
    }

    globalThis.__STORYBOOK_STATEFUL_MOCKS_LAST_ID__ = storyId;
  }

  return <Story />;
};

export default withStatefulMocks;
