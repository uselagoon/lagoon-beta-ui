import React from 'react';

import { Decorator, StoryContext } from '@storybook/react';
import { Toaster } from '@uselagoon/ui-library';

export const withToaster: Decorator = (Story, context: StoryContext) => {
  const theme = context.globals?.theme || 'dark';
  const resolvedTheme = theme === 'system' ? 'dark' : theme;

  return (
    <>
      <Story />
      <Toaster theme={resolvedTheme as 'light' | 'dark'} />
    </>
  );
};

export default withToaster;
