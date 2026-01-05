import { addons } from '@storybook/manager-api';

import LagoonTheme from './lagoonTheme';

addons.setConfig({
  theme: LagoonTheme,
  sidebar: {
    showRoots: false,
  },
});
