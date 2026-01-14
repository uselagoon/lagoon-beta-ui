import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { ProjectDeployTargetsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/deploy-targets/page';

import ProjectDeployTargetsPage from './projectDeployTargetsPage';

const mockProject: ProjectDeployTargetsData['project'] = {
  id: 1,
  name: 'test-project',
  branches: 'main,develop',
  pullrequests: true,
  created: '2024-01-15T10:30:00Z',
  gitUrl: 'git@github.com:example/test-project.git',
  productionEnvironment: 'main',
  standbyProductionEnvironment: null,
  productionRoutes: 'https://example.com',
  standbyRoutes: null,
  developmentEnvironmentsLimit: 5,
  featureApiRoutes: true,
  deployTargetConfigs: [
    {
      id: 1,
      branches: 'main,develop',
      pullrequests: 'true',
      deployTarget: {
        id: 1,
        name: 'production-cluster',
        friendlyName: 'Production Cluster',
      },
    },
    {
      id: 2,
      branches: 'feature/*',
      pullrequests: 'true',
      deployTarget: {
        id: 2,
        name: 'staging-cluster',
        friendlyName: 'Staging Cluster',
      },
    },
    {
      id: 3,
      branches: 'develop',
      pullrequests: 'false',
      deployTarget: {
        id: 3,
        name: 'dev-cluster',
        friendlyName: 'Development Cluster',
      },
    },
  ],
  environments: [
    { environmentType: 'production' },
    { environmentType: 'development' },
  ],
};

const meta: Meta<typeof ProjectDeployTargetsPage> = {
  title: 'Pages/Project/DeployTargets',
  component: ProjectDeployTargetsPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProjectDeployTargetsPage>;

export const Default: Story = {
  args: {
    project: mockProject,
  },
};

export const Empty: Story = {
  args: {
    project: {
      ...mockProject,
      deployTargetConfigs: [],
    },
  },
};
