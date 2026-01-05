import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { RoutesData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/routes/page';
import projectWithRoutes from '@/lib/query/projectWithRoutes';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import RoutesPage from './RoutesPage';

const mockData: RoutesData = {
  projectRoutes: {
    id: 1,
    name: 'test-project',
    productionEnvironment: 'main',
    standbyProductionEnvironment: undefined,
    environments: [
      {
        id: 1,
        name: 'main',
        deployType: 'branch',
        environmentType: 'production',
        deployBaseRef: 'main',
        deployHeadRef: 'main',
        deployTitle: 'main',
        updated: new Date().toISOString(),
        routes: 'https://example.com',
        openshiftProjectName: 'project-main',
        kubernetesNamespaceName: 'project-main',
        openshift: { friendlyName: 'Production', cloudRegion: 'US-EAST' },
        project: { name: 'test-project', problemsUi: 0, factsUi: 0 },
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
        updated: new Date().toISOString(),
        routes: 'https://dev.example.com',
        openshiftProjectName: 'project-develop',
        kubernetesNamespaceName: 'project-develop',
        openshift: { friendlyName: 'Development', cloudRegion: 'US-WEST' },
        project: { name: 'test-project', problemsUi: 0, factsUi: 0 },
        problems: [],
        deployments: [],
        pendingChanges: [],
      },
    ],
    apiRoutes: [
      {
        id: 1,
        domain: 'https://example.com',
        type: 'route',
        primary: true,
        environment: { id: 1, name: 'main', kubernetesNamespaceName: 'project-main', environmentType: 'production' },
        service: 'nginx',
        created: '2024-01-15T10:30:00Z',
        updated: '2024-06-15T14:20:00Z',
        source: 'lagoon',
      },
      {
        id: 2,
        domain: 'https://api.example.com',
        type: 'route',
        primary: false,
        environment: { id: 1, name: 'main', kubernetesNamespaceName: 'project-main', environmentType: 'production' },
        service: 'api',
        created: '2024-02-20T08:00:00Z',
        updated: '2024-06-10T12:00:00Z',
        source: 'lagoon',
      },
      {
        id: 3,
        domain: 'https://dev.example.com',
        type: 'route',
        primary: true,
        environment: { id: 2, name: 'develop', kubernetesNamespaceName: 'project-develop', environmentType: 'development' },
        service: 'nginx',
        created: '2024-03-01T10:00:00Z',
        updated: '2024-06-01T10:00:00Z',
        source: 'lagoon',
      },
    ],
  },
};

const meta: Meta<typeof RoutesPage> = {
  title: 'Pages/Project/Routes',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={projectWithRoutes}
      variables={{ name: 'test-project' }}
      mockData={mockData}
    >
      {queryRef => <RoutesPage queryRef={queryRef} projectName="test-project" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof RoutesPage>;

export const Default: Story = {};
