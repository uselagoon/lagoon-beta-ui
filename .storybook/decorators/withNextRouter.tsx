import React from 'react';

import { Decorator } from '@storybook/react';

const RouterContext = React.createContext({
  pathname: '/',
  searchParams: new URLSearchParams(),
  push: () => {},
  replace: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
  prefetch: () => Promise.resolve(),
});

export const useStorybookRouter = () => React.useContext(RouterContext);

export const withNextRouter: Decorator = (Story, context) => {
  const pathname = context.parameters?.nextjs?.pathname || '/';
  const searchParams = new URLSearchParams(context.parameters?.nextjs?.searchParams || '');

  const mockRouter = {
    pathname,
    searchParams,
    push: () => {},
    replace: () => {},
    back: () => {},
    forward: () => {},
    refresh: () => {},
    prefetch: () => Promise.resolve(),
  };

  return (
    <RouterContext.Provider value={mockRouter}>
      <Story />
    </RouterContext.Provider>
  );
};

export default withNextRouter;
