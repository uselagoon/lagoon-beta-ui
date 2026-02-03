import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        docs: false,
      },
    },
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  staticDirs: ['../public'],

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  refs: {
    'ui-library': {
      title: 'ui-library',
      url: 'https://main--69698d15d02f1ad6e82d516e.chromatic.com',
      expanded: false,
    },
  },

};
export default config;
