import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, screen, waitFor } from '@storybook/test';

import { EnvironmentData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/(environment-overview)/page';
import environmentByOpenShiftProjectName from '@/lib/query/environmentByOpenShiftProjectName';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import { createEnvironmentOverviewMockState, EnvironmentOverview } from '../../../../.storybook/mocks/storyHelpers';
import EnvironmentPage from './EnvironmentPage';

const initialEnvironment: EnvironmentOverview = {
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
};

const standbyEnvironment: EnvironmentOverview = {
  id: 2,
  name: 'standby',
  created: '2024-01-15T10:30:00Z',
  updated: '2024-06-15T14:20:00Z',
  deployType: 'branch',
  environmentType: 'production',
  routes: 'https://standby.example.com',
  openshiftProjectName: 'project-standby',
  project: {
    name: 'test-project',
    gitUrl: 'git@github.com:example/test-project.git',
    productionRoutes: 'https://example.com',
    standbyRoutes: 'https://standby.example.com',
    productionEnvironment: 'main',
    standbyProductionEnvironment: 'standby',
    problemsUi: 2,
    factsUi: 5,
  },
  title: 'standby',
  facts: [],
  pendingChanges: [],
};

const meta: Meta<typeof EnvironmentPage> = {
  title: 'Pages/Environment/Overview',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: createEnvironmentOverviewMockState('project-main', initialEnvironment),
  },
  render: () => (
    <MockPreloadQuery<EnvironmentData, { openshiftProjectName: string }>
      query={environmentByOpenShiftProjectName}
      variables={{ openshiftProjectName: 'project-main' }}
    >
      {queryRef => <EnvironmentPage queryRef={queryRef} environmentSlug="project-main" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof EnvironmentPage>;

export const Default: Story = {};

export const WithStandbyEnvironment: Story = {
  parameters: {
    initialMockState: createEnvironmentOverviewMockState('project-standby', standbyEnvironment),
  },
  render: () => (
    <MockPreloadQuery<EnvironmentData, { openshiftProjectName: string }>
      query={environmentByOpenShiftProjectName}
      variables={{ openshiftProjectName: 'project-standby' }}
    >
      {queryRef => <EnvironmentPage queryRef={queryRef} environmentSlug="project-standby" />}
    </MockPreloadQuery>
  ),
};

export const SwitchActiveStandby: Story = {
  parameters: {
    initialMockState: createEnvironmentOverviewMockState('project-standby', standbyEnvironment),
  },
  render: () => (
    <MockPreloadQuery<EnvironmentData, { openshiftProjectName: string }>
      query={environmentByOpenShiftProjectName}
      variables={{ openshiftProjectName: 'project-standby' }}
    >
      {queryRef => <EnvironmentPage queryRef={queryRef} environmentSlug="project-standby" />}
    </MockPreloadQuery>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Overview', {}, { timeout: 10000 });

    expect(canvas.getByText('Standby')).toBeInTheDocument();

    const switchButton = await canvas.findByRole('button', { name: /switch.*standby/i });
    await userEvent.click(switchButton);

    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    await waitFor(
      () => {
        expect(canvas.getByText('Active')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};
