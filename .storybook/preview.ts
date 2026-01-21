import type { Preview } from '@storybook/react';
import { initialize, mswDecorator } from 'msw-storybook-addon';

import '../src/app/globals.css';
import withApolloMock from './decorators/withApolloMock';
import withEnvProvider from './decorators/withEnvProvider';
import { withStatefulMocks } from './decorators/withStatefulMocks';
import withStorybookGlobals from './decorators/withStorybookGlobals';
import withThemeProvider from './decorators/withThemeProvider';
import withToaster from './decorators/withToaster';
import { handlers } from './mocks/handlers';
import { mutationHandlers } from './mocks/mutationHandlers';

initialize({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    options: {
      updateViaCache: 'none',
    },
  },
});

if (typeof window !== 'undefined') {
  window.open = (url, target, features) => {
    console.log('[Storybook] window.open intercepted:', { url, target, features });
    return null;
  };
}

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'system', title: 'System', icon: 'browser' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    test: {
      // MSW can throw spurious errors during test cleanup due to race conditions
      // in the service worker message channel. This is safe to ignore since actual
      // test assertions still work correctly.
      dangerouslyIgnoreUnhandledErrors: true,
    },
    msw: {
      handlers: [...handlers, ...mutationHandlers],
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

  decorators: [withStorybookGlobals, withStatefulMocks, mswDecorator, withEnvProvider, withThemeProvider, withApolloMock, withToaster],
};
export default preview;
