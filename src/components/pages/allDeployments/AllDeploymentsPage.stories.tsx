import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Deployment } from '@/app/(routegroups)/alldeployments/page';

import AllDeploymentsPage from './AllDeploymentsPage';

const statuses: Deployment['status'][] = ['complete', 'running', 'failed', 'queued', 'new'];

const generateMockDeployments = (count: number = 20): Deployment[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `build-${index + 1}`,
    status: statuses[index % statuses.length],
    priority: index % 3 === 0 ? null : 5 + (index % 3),
    created: new Date(Date.now() - index * 3600000).toISOString(),
    started: new Date(Date.now() - index * 3600000 + 60000).toISOString(),
    completed: statuses[index % statuses.length] === 'complete'
      ? new Date(Date.now() - index * 3600000 + 300000).toISOString()
      : null,
    environment: {
      name: `env-${index + 1}`,
      openshiftProjectName: `project-${index + 1}-env-${index + 1}`,
      openshift: {
        id: 1,
        name: 'cluster-1',
      },
      project: {
        id: index + 1,
        name: `project-${index + 1}`,
      },
    },
  }));
};

const mockData = generateMockDeployments(25);

const meta: Meta<typeof AllDeploymentsPage> = {
  title: 'Pages/AllDeployments',
  component: AllDeploymentsPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof AllDeploymentsPage>;

export const Default: Story = {
  args: {
    deployments: mockData,
  },
};

export const Empty: Story = {
  args: {
    deployments: [],
  },
};

export const FewDeployments: Story = {
  args: {
    deployments: generateMockDeployments(5),
  },
};
