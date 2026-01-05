import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { EnvironmentRoutesData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/routes/page';
import environmentWithRoutes from '@/lib/query/environmentWithRoutes';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import EnvironmentRoutesPage from './EnvironmentRoutesPage';

const mockData: EnvironmentRoutesData = {
  environmentRoutes: {
    id: 1,
    name: 'main',
    kubernetesNamespaceName: 'project-main',
    environmentType: 'production',
    apiRoutes: [
      {
        id: 1,
        domain: 'https://example.com',
        type: 'route',
        primary: true,
        service: 'nginx',
        created: '2024-01-15T10:30:00Z',
        updated: '2024-06-15T14:20:00Z',
        source: 'lagoon',
        environment: {
          id: 1,
          name: 'main',
          kubernetesNamespaceName: 'project-main',
          environmentType: 'production',
        } as any,
      },
      {
        id: 2,
        domain: 'https://api.example.com',
        type: 'route',
        primary: false,
        service: 'api',
        created: '2024-02-20T08:00:00Z',
        updated: '2024-06-10T12:00:00Z',
        source: 'lagoon',
        environment: {
          id: 1,
          name: 'main',
          kubernetesNamespaceName: 'project-main',
          environmentType: 'production',
        } as any,
      },
    ],
    project: {
      id: 1,
      name: 'test-project',
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
      productionEnvironment: 'main',
      standbyProductionEnvironment: undefined,
    },
  },
};

const meta: Meta<typeof EnvironmentRoutesPage> = {
  title: 'Pages/Environment/Routes',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={environmentWithRoutes}
      variables={{ openshiftProjectName: 'project-main' }}
      mockData={mockData}
    >
      {queryRef => <EnvironmentRoutesPage queryRef={queryRef} projectName="test-project" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof EnvironmentRoutesPage>;

export const Default: Story = {};
