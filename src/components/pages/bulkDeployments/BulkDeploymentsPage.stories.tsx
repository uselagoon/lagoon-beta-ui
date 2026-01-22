import React from 'react';

import { BulkDeployment } from '@/app/(routegroups)/bulkdeployment/[bulkId]/page';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, waitFor, within } from '@storybook/test';

import BulkDeploymentsPage from './BulkDeploymentsPage';

const generateMockBulkDeployments = (count: number = 10): BulkDeployment[] => {
  const statuses = ['complete', 'running', 'failed', 'pending'];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `build-${index + 1}`,
    bulkId: 'bulk-deploy-12345',
    bulkName: 'release-v2.0.0',
    priority: 5,
    buildStep: null,
    status: statuses[index % statuses.length],
    created: new Date(Date.now() - index * 60000).toISOString(),
    started: new Date(Date.now() - index * 60000 + 30000).toISOString(),
    completed:
      statuses[index % statuses.length] === 'complete'
        ? new Date(Date.now() - index * 60000 + 120000).toISOString()
        : null,
    environment: {
      name: `environment-${index + 1}`,
      openshiftProjectName: `project-${index + 1}-env-${index + 1}`,
      project: {
        name: `project-${['alpha', 'beta', 'gamma', 'delta'][index % 4]}`,
      },
    },
  }));
};

const mockData: BulkDeployment[] = generateMockBulkDeployments(12);

const meta: Meta<typeof BulkDeploymentsPage> = {
  title: 'Pages/BulkDeployments',
  component: BulkDeploymentsPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof BulkDeploymentsPage>;

export const Default: Story = {
  args: {
    bulkDeployments: mockData,
  },
};

export const CancelDeployment: Story = {
  args: {
    bulkDeployments: mockData,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const runningBadges = await canvas.findAllByText('Running', {}, { timeout: 10000 });
    expect(runningBadges.length).toBeGreaterThan(0);

    const cancelButtons = await canvas.findAllByRole('button', { name: /cancel-deployment/i });
    await userEvent.click(cancelButtons[0]);

    const confirmButton = await screen.findByRole('button', { name: /yes/i });
    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(canvas.getByText('Cancelled')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};
