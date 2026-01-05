import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { EnvVariablesData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/environment-variables/page';
import environmentByOpenShiftProjectNameWithEnvVars from '@/lib/query/environmentByOpenShiftProjectNameWithEnvVars';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import EnvironmentVariablesPage from './EnvironmentVariablesPage';

const mockData: EnvVariablesData = {
  environmentVars: {
    id: 1,
    name: 'main',
    openshiftProjectName: 'project-main',
    project: {
      name: 'test-project',
      problemsUi: true,
      factsUi: true,
      envVariables: [
        { id: 101, name: 'PROJECT_API_KEY', scope: 'GLOBAL' },
        { id: 102, name: 'PROJECT_DB_URL', scope: 'BUILD' },
      ],
    },
    envVariables: [
      { id: 1, name: 'API_KEY', scope: 'GLOBAL' },
      { id: 2, name: 'DATABASE_URL', scope: 'BUILD' },
      { id: 3, name: 'CACHE_TTL', scope: 'RUNTIME' },
      { id: 4, name: 'SECRET_TOKEN', scope: 'GLOBAL' },
    ],
  },
};

const meta: Meta<typeof EnvironmentVariablesPage> = {
  title: 'Pages/Environment/Variables',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={environmentByOpenShiftProjectNameWithEnvVars}
      variables={{ openshiftProjectName: 'project-main', limit: null }}
      mockData={mockData}
    >
      {queryRef => (
        <EnvironmentVariablesPage
          queryRef={queryRef}
          projectName="test-project"
          environmentName="project-main"
        />
      )}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof EnvironmentVariablesPage>;

export const Default: Story = {};
