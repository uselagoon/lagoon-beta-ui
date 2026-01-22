import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, screen, userEvent, waitFor, within } from '@storybook/test';

import { DeploymentsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/deployments/(deployments-page)/page';
import environmentWithDeployments from '@/lib/query/environmentWithDeployments';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import DeploymentsPage from './DeploymentsPage';

const now = Date.now();
const oneHour = 3600000;
const oneDay = 86400000;
const oneMonth = 30 * oneDay;

const initialDeployments = [
  {
    id: 1,
    name: 'build-1',
    status: 'complete',
    created: new Date(now - oneHour).toISOString(),
    buildStep: null,
    started: new Date(now - oneHour + 100000).toISOString(),
    completed: new Date(now - oneHour + 400000).toISOString(),
    bulkId: null,
    priority: 5,
    sourceType: 'WEBHOOK',
  },
  {
    id: 2,
    name: 'build-2',
    status: 'running',
    created: new Date(now - 1800000).toISOString(),
    buildStep: 'Running build',
    started: new Date(now - 1700000).toISOString(),
    completed: null,
    bulkId: null,
    priority: 5,
    sourceType: 'API',
  },
  {
    id: 3,
    name: 'build-3',
    status: 'failed',
    created: new Date(now - 2 * oneDay).toISOString(),
    buildStep: 'Build failed',
    started: new Date(now - 2 * oneDay + 100000).toISOString(),
    completed: new Date(now - 2 * oneDay + 300000).toISOString(),
    bulkId: 'bulk-123',
    priority: 6,
    sourceType: 'WEBHOOK',
  },
  {
    id: 4,
    name: 'build-4',
    status: 'complete',
    created: new Date(now - 5 * oneDay).toISOString(),
    buildStep: null,
    started: new Date(now - 5 * oneDay + 50000).toISOString(),
    completed: new Date(now - 5 * oneDay + 250000).toISOString(),
    bulkId: null,
    priority: 5,
    sourceType: 'WEBHOOK',
  },
  {
    id: 5,
    name: 'build-5',
    status: 'complete',
    created: new Date(now - oneMonth).toISOString(),
    buildStep: null,
    started: new Date(now - oneMonth + 60000).toISOString(),
    completed: new Date(now - oneMonth + 360000).toISOString(),
    bulkId: null,
    priority: 5,
    sourceType: 'API',
  },
  {
    id: 6,
    name: 'build-6',
    status: 'failed',
    created: new Date(now - oneMonth - 3 * oneDay).toISOString(),
    buildStep: 'Dependency installation failed',
    started: new Date(now - oneMonth - 3 * oneDay + 30000).toISOString(),
    completed: new Date(now - oneMonth - 3 * oneDay + 180000).toISOString(),
    bulkId: null,
    priority: 4,
    sourceType: 'WEBHOOK',
  },
  {
    id: 7,
    name: 'build-7',
    status: 'complete',
    created: new Date(now - 2 * oneMonth).toISOString(),
    buildStep: null,
    started: new Date(now - 2 * oneMonth + 45000).toISOString(),
    completed: new Date(now - 2 * oneMonth + 290000).toISOString(),
    bulkId: 'bulk-456',
    priority: 5,
    sourceType: 'WEBHOOK',
  },
  {
    id: 8,
    name: 'build-8',
    status: 'complete',
    created: new Date(now - 2 * oneMonth - 10 * oneDay).toISOString(),
    buildStep: null,
    started: new Date(now - 2 * oneMonth - 10 * oneDay + 55000).toISOString(),
    completed: new Date(now - 2 * oneMonth - 10 * oneDay + 320000).toISOString(),
    bulkId: null,
    priority: 5,
    sourceType: 'API',
  },
  {
    id: 9,
    name: 'build-9',
    status: 'cancelled',
    created: new Date(now - 3 * oneMonth).toISOString(),
    buildStep: 'Cancelled by user',
    started: new Date(now - 3 * oneMonth + 20000).toISOString(),
    completed: new Date(now - 3 * oneMonth + 120000).toISOString(),
    bulkId: null,
    priority: 5,
    sourceType: 'WEBHOOK',
  },
  {
    id: 10,
    name: 'build-10',
    status: 'complete',
    created: new Date(now - 3 * oneMonth - 15 * oneDay).toISOString(),
    buildStep: null,
    started: new Date(now - 3 * oneMonth - 15 * oneDay + 40000).toISOString(),
    completed: new Date(now - 3 * oneMonth - 15 * oneDay + 280000).toISOString(),
    bulkId: null,
    priority: 6,
    sourceType: 'API',
  },
  {
    id: 11,
    name: 'build-11',
    status: 'failed',
    created: new Date(now - 4 * oneMonth).toISOString(),
    buildStep: 'Test suite failed',
    started: new Date(now - 4 * oneMonth + 35000).toISOString(),
    completed: new Date(now - 4 * oneMonth + 420000).toISOString(),
    bulkId: 'bulk-789',
    priority: 5,
    sourceType: 'WEBHOOK',
  },
  {
    id: 12,
    name: 'build-12',
    status: 'complete',
    created: new Date(now - 5 * oneMonth).toISOString(),
    buildStep: null,
    started: new Date(now - 5 * oneMonth + 50000).toISOString(),
    completed: new Date(now - 5 * oneMonth + 310000).toISOString(),
    bulkId: null,
    priority: 5,
    sourceType: 'WEBHOOK',
  },
];

const envMeta = {
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
};

const meta: Meta<typeof DeploymentsPage> = {
  title: 'Pages/Environment/Deployments',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: {
      deployments: {
        'project-main': initialDeployments,
      },
      environmentMeta: {
        'project-main': envMeta,
      },
    },
  },
  render: () => (
    <MockPreloadQuery<DeploymentsData, { openshiftProjectName: string; limit: null }>
      query={environmentWithDeployments}
      variables={{ openshiftProjectName: 'project-main', limit: null }}
    >
      {queryRef => <DeploymentsPage queryRef={queryRef} environmentSlug="project-main" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof DeploymentsPage>;

export const Default: Story = {};

export const TriggerDeploy: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('build-1', {}, { timeout: 10000 });
    expect(canvas.queryByText('Pending')).not.toBeInTheDocument();

    const deployButton = await canvas.findByRole('button', { name: 'Deploy' });
    await userEvent.click(deployButton);

    await waitFor(
      () => {
        expect(canvas.getByText('Pending')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(canvas.getByText('Pending')).toBeInTheDocument();
  },
};

export const CancelDeployment: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const runningStatus = await canvas.findByText('Running', {}, { timeout: 10000 });
    expect(runningStatus).toBeInTheDocument();

    const cancelButton = await canvas.findByRole('button', { name: 'cancel-deployment' });
    fireEvent.click(cancelButton);

    const confirmButton = await screen.findByRole('button', { name: /yes/i });
    fireEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(canvas.getByText('Cancelled')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};
