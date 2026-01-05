import React, { createContext, useContext, useEffect } from 'react';

import { Decorator, StoryContext } from '@storybook/react';

import { setCurrentRole } from '../mocks/roleStore';
import { StoryGlobals, UserRole } from '../types';

const defaultGlobals: StoryGlobals = {
  userRole: 'owner',
  theme: 'dark',
};

const StorybookGlobalsContext = createContext<StoryGlobals>(defaultGlobals);

export const useStorybookGlobals = (): StoryGlobals => {
  return useContext(StorybookGlobalsContext);
};

export const useStorybookUserRole = (): UserRole => {
  const { userRole } = useStorybookGlobals();
  return userRole;
};

export const withStorybookGlobals: Decorator = (Story, context: StoryContext) => {
  const { globals } = context;

  const userRole = globals?.userRole || defaultGlobals.userRole;

  useEffect(() => {
    setCurrentRole(userRole);
  }, [userRole]);

  const storyGlobals: StoryGlobals = {
    userRole,
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
