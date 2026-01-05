import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { EnvironmentData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/(environment-overview)/page';
import environmentByOpenShiftProjectName from '@/lib/query/environmentByOpenShiftProjectName';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import EnvironmentPage from './EnvironmentPage';

const mockData: EnvironmentData = {
  environment: {
    id: 1,
    name: 'main',
    created: '2024-01-15T10:30:00Z',
    updated: '2024-06-15T14:20:00Z',
    deployType: 'branch',
    environmentType: 'production',
    routes: 'https://example.com,https://www.example.com',
    openshiftProjectName: 'project-main',
    project: {
      name: 'test-project',
      gitUrl: 'git@github.com:example/test-project.git',
      productionRoutes: 'https://example.com',
      standbyRoutes: null,
      productionEnvironment: 'main',
      standbyProductionEnvironment: null,
      problemsUi: 2,
      factsUi: 5,
    },
    title: 'main',
    facts: [],
    pendingChanges: [],
  },
};

const meta: Meta<typeof EnvironmentPage> = {
  title: 'Pages/Environment/Overview',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={environmentByOpenShiftProjectName}
      variables={{ openshiftProjectName: 'project-main' }}
      mockData={mockData}
    >
      {queryRef => <EnvironmentPage queryRef={queryRef} environmentSlug="project-main" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof EnvironmentPage>;

export const Default: Story = {};
