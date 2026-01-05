import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { ProjectData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/(project-overview)/page';
import projectEnvironmentsQuery from '@/lib/query/projectEnvironmentsQuery';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import ProjectEnvironmentsPage from './ProjectEnvironmentsPage';

const mockData: ProjectData = {
  project: {
    id: 1,
    name: 'test-project',
    productionEnvironment: 'main',
    standbyProductionEnvironment: null,
    productionRoutes: 'https://example.com',
    standbyRoutes: null,
    environments: [
      {
        id: 1,
        name: 'main',
        deployType: 'branch',
        environmentType: 'production',
        deployBaseRef: 'main',
        deployHeadRef: 'main',
        deployTitle: 'main',
        updated: new Date(Date.now() - 86400000).toISOString(),
        routes: 'https://example.com',
        openshiftProjectName: 'project-main',
        kubernetesNamespaceName: 'project-main',
        openshift: { friendlyName: 'Production', cloudRegion: 'US-EAST' },
        project: { name: 'test-project', problemsUi: 0, factsUi: 5 },
        problems: [],
        deployments: [],
        pendingChanges: [],
      },
      {
        id: 2,
        name: 'develop',
        deployType: 'branch',
        environmentType: 'development',
        deployBaseRef: 'develop',
        deployHeadRef: 'develop',
        deployTitle: 'develop',
        updated: new Date(Date.now() - 3600000).toISOString(),
        routes: 'https://dev.example.com',
        openshiftProjectName: 'project-develop',
        kubernetesNamespaceName: 'project-develop',
        openshift: { friendlyName: 'Development', cloudRegion: 'US-WEST' },
        project: { name: 'test-project', problemsUi: 2, factsUi: 3 },
        problems: [],
        deployments: [],
        pendingChanges: [],
      },
    ],
  },
};

const meta: Meta<typeof ProjectEnvironmentsPage> = {
  title: 'Pages/Project/Environments',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={projectEnvironmentsQuery}
      variables={{ name: 'test-project' }}
      mockData={mockData}
    >
      {queryRef => <ProjectEnvironmentsPage queryRef={queryRef} projectName="test-project" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof ProjectEnvironmentsPage>;

export const Default: Story = {};
