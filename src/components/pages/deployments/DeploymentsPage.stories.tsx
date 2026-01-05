import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { DeploymentsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/deployments/(deployments-page)/page';
import environmentWithDeployments from '@/lib/query/environmentWithDeployments';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import DeploymentsPage from './DeploymentsPage';

const mockData: DeploymentsData = {
  environment: {
    id: 1,
    name: 'main',
    openshiftProjectName: 'project-main',
    deployType: 'branch',
    deployBaseRef: 'main',
    deployHeadRef: 'main',
    deployTitle: 'main',
    project: {
      name: 'test-project',
      problemsUi: 0,
      factsUi: 5,
    },
    deployments: [
      {
        id: 1,
        name: 'build-1',
        status: 'complete',
        created: new Date(Date.now() - 3600000).toISOString(),
        buildStep: null,
        started: new Date(Date.now() - 3500000).toISOString(),
        completed: new Date(Date.now() - 3200000).toISOString(),
        bulkId: null,
        priority: 5,
        sourceType: 'WEBHOOK',
      },
      {
        id: 2,
        name: 'build-2',
        status: 'running',
        created: new Date(Date.now() - 1800000).toISOString(),
        buildStep: 'Running build',
        started: new Date(Date.now() - 1700000).toISOString(),
        completed: null,
        bulkId: null,
        priority: 5,
        sourceType: 'API',
      },
      {
        id: 3,
        name: 'build-3',
        status: 'failed',
        created: new Date(Date.now() - 7200000).toISOString(),
        buildStep: 'Build failed',
        started: new Date(Date.now() - 7100000).toISOString(),
        completed: new Date(Date.now() - 6800000).toISOString(),
        bulkId: 'bulk-123',
        priority: 6,
        sourceType: 'WEBHOOK',
      },
    ],
  },
};

const meta: Meta<typeof DeploymentsPage> = {
  title: 'Pages/Environment/Deployments',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={environmentWithDeployments}
      variables={{ openshiftProjectName: 'project-main', limit: null }}
      mockData={mockData}
    >
      {queryRef => <DeploymentsPage queryRef={queryRef} environmentSlug="project-main" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof DeploymentsPage>;

export const Default: Story = {};
