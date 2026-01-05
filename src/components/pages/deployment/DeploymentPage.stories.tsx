import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { DeploymentData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/deployments/[deploymentSlug]/page';
import environmentWithDeployment from '@/lib/query/environmentWithDeployment';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import DeploymentPage from './DeploymentPage';

const mockData: DeploymentData = {
  environment: {
    openshiftProjectName: 'project-main',
    project: {
      name: 'test-project',
      problemsUi: true,
      factsUi: true,
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
        buildLog: `========================================
[2024-01-01 10:00:00] Starting build
========================================
Step 1/10: Preparing environment
Step 2/10: Installing dependencies
Step 3/10: Building application
Step 4/10: Running tests
Step 5/10: Creating container image
========================================
[2024-01-01 10:05:00] Build complete
========================================`,
      },
    ],
  },
};

const meta: Meta<typeof DeploymentPage> = {
  title: 'Pages/Environment/Deployment',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={environmentWithDeployment}
      variables={{ openshiftProjectName: 'project-main', deploymentName: 'build-1' }}
      mockData={mockData}
    >
      {queryRef => <DeploymentPage queryRef={queryRef} deploymentName="build-1" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof DeploymentPage>;

export const Default: Story = {};
