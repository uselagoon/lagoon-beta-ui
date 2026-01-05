import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { ProjectEnvironmentsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/project-variables/page';
import projectVariablesQuery from '@/lib/query/projectVariablesQuery';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import ProjectVariablesPage from './ProjectVariablesPage';

const mockData: ProjectEnvironmentsData = {
  project: {
    id: 1,
    name: 'test-project',
    productionEnvironment: 'main',
    standbyProductionEnvironment: null,
    productionRoutes: 'https://example.com',
    standbyRoutes: null,
    envVariables: [
      { id: 1, name: 'API_KEY', scope: 'GLOBAL' },
      { id: 2, name: 'DATABASE_URL', scope: 'BUILD' },
      { id: 3, name: 'CACHE_TTL', scope: 'RUNTIME' },
      { id: 4, name: 'SECRET_TOKEN', scope: 'GLOBAL' },
      { id: 5, name: 'DEBUG_MODE', scope: 'BUILD' },
    ],
  },
};

const meta: Meta<typeof ProjectVariablesPage> = {
  title: 'Pages/Project/Variables',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={projectVariablesQuery}
      variables={{ name: 'test-project' }}
      mockData={mockData}
    >
      {queryRef => <ProjectVariablesPage queryRef={queryRef} projectName="test-project" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof ProjectVariablesPage>;

export const Default: Story = {};
