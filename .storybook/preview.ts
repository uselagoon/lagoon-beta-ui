import type { Preview } from '@storybook/react';
import { initialize, mswDecorator } from 'msw-storybook-addon';

import '../src/app/globals.css';
import withApolloMock from './decorators/withApolloMock';
import withStorybookGlobals from './decorators/withStorybookGlobals';
import { handlers } from './mocks/handlers';

initialize({
  onUnhandledRequest: 'bypass',
});

const preview: Preview = {
  globalTypes: {
    userRole: {
      name: 'User Role',
      description: 'Simulated user role for permission testing',
      defaultValue: 'owner',
      toolbar: {
        icon: 'user',
        items: [
          { value: 'owner', title: 'Owner', icon: 'starhollow' },
          { value: 'admin', title: 'Admin', icon: 'admin' },
          { value: 'viewer', title: 'Viewer', icon: 'eye' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    msw: {
      handlers,
    },
    options: {
      storySort: {
        method: 'configure',
        includeNames: true,
        order: ['Pages', '*'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  tags: ['!autodocs'],

  decorators: [withStorybookGlobals, withApolloMock, mswDecorator],
};
export default preview;
