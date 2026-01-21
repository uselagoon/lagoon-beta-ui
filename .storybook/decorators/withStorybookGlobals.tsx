import React, { createContext, useContext } from 'react';

import { Decorator, StoryContext } from '@storybook/react';

import { StoryGlobals } from '../types';

const defaultGlobals: StoryGlobals = {
  theme: 'dark',
};

const StorybookGlobalsContext = createContext<StoryGlobals>(defaultGlobals);

export const useStorybookGlobals = (): StoryGlobals => {
  return useContext(StorybookGlobalsContext);
};

export const withStorybookGlobals: Decorator = (Story, context: StoryContext) => {
  const { globals } = context;

  const storyGlobals: StoryGlobals = {
    theme: globals?.theme || defaultGlobals.theme,
  };

  return (
    <StorybookGlobalsContext.Provider value={storyGlobals}>
      <Story />
    </StorybookGlobalsContext.Provider>
  );
};

export default withStorybookGlobals;

export { StorybookGlobalsContext };
