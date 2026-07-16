import React from 'react';

import { EnvProvider } from 'next-runtime-env';

import type { Decorator } from '@storybook/react';

const withEnvProvider: Decorator = Story => (
  <EnvProvider
    env={{
      GRAPHQL_API_TOKEN: '',
      GRAPHQL_API: 'http://localhost:3000/graphql',
      LAGOON_UI_ICON: '',
      LAGOON_UI_TASK_BLOCKLIST: '[]',
      LAGOON_VERSION: '2.0.0',
      LAGOON_UI_DEPLOYMENTS_LIMIT: '',
      LAGOON_UI_DEPLOYMENTS_LIMIT_MESSAGE: '',
      LAGOON_UI_TASKS_LIMIT: '',
      LAGOON_UI_TASKS_LIMIT_MESSAGE: '',
      LAGOON_UI_BACKUPS_LIMIT: '',
      LAGOON_UI_BACKUPS_LIMIT_MESSAGE: '',
      LAGOON_UI_YOUR_ACCOUNT_DISABLED: '',
      LAGOON_UI_VIEW_ENV_VARIABLES: 'true',
      LAGOON_UI_TOURS_ENABLED: '',
      LAGOON_UI_STATUS_TIMEOUT: '',
      PLUGIN_SCRIPTS: '{}',
      WEBHOOK_URL: '',
      DISABLE_SUBSCRIPTIONS: 'true',
    }}
  >
    <Story />
  </EnvProvider>
);

export default withEnvProvider;
