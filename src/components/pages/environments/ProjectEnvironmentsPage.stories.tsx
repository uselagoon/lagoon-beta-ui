import React from 'react';

import { ProjectData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/(project-overview)/page';
import projectEnvironmentsQuery from '@/lib/query/projectEnvironmentsQuery';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, waitFor, within } from '@storybook/test';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import { sleep } from '../../../../.storybook/mocks/storyHelpers';

type ProjectEnvironment = ProjectData['project']['environments'][0];

const now = Date.now();
const oneHour = 3600000;
const oneDay = 86400000;

const createProjectEnvironmentsMockState = (projectName: string, project: ProjectData['project']) => ({
  projectEnvironments: {
    [projectName]: project,
  },
});

const initialProject: ProjectData['project'] = {
  id: 1,
  name: 'test-project',
  productionEnvironment: 'main',
  standbyProductionEnvironment: 'standby',
  productionRoutes: 'https://example.com',
  standbyRoutes: 'https://standby.example.com',
  environments: [
    {
      id: 1,
      name: 'main',
      deployType: 'branch',
      environmentType: 'production',
      deployBaseRef: 'main',
      deployHeadRef: 'main',
      deployTitle: 'main',
      updated: new Date(now - oneDay).toISOString(),
      routes: 'https://example.com',
      openshiftProjectName: 'test-project-main',
      kubernetesNamespaceName: 'test-project-main',
      openshift: { friendlyName: 'Production', cloudRegion: 'US-EAST' },
      project: { name: 'test-project', problemsUi: 0, factsUi: 5 },
      problems: [],
      deployments: [],
      pendingChanges: [],
    },
    {
      id: 2,
      name: 'standby',
      deployType: 'branch',
      environmentType: 'production',
      deployBaseRef: 'standby',
      deployHeadRef: 'standby',
      deployTitle: 'standby',
      updated: new Date(now - 2 * oneHour).toISOString(),
      routes: 'https://standby.example.com',
      openshiftProjectName: 'test-project-standby',
      kubernetesNamespaceName: 'test-project-standby',
      openshift: { friendlyName: 'Production', cloudRegion: 'US-EAST' },
      project: { name: 'test-project', problemsUi: 0, factsUi: 5 },
      problems: [],
      deployments: [],
      pendingChanges: [],
    },
    {
      id: 3,
      name: 'develop',
      deployType: 'branch',
      environmentType: 'development',
      deployBaseRef: 'develop',
      deployHeadRef: 'develop',
      deployTitle: 'develop',
      updated: new Date(now - oneHour).toISOString(),
      routes: 'https://dev.example.com',
      openshiftProjectName: 'test-project-develop',
      kubernetesNamespaceName: 'test-project-develop',
      openshift: { friendlyName: 'Development', cloudRegion: 'US-WEST' },
      project: { name: 'test-project', problemsUi: 2, factsUi: 3 },
      problems: [],
      deployments: [],
      pendingChanges: [],
    },
    {
      id: 4,
      name: 'feature-branch',
      deployType: 'branch',
      environmentType: 'development',
      deployBaseRef: 'feature-branch',
      deployHeadRef: 'feature-branch',
      deployTitle: 'feature-branch',
      updated: new Date(now - 3 * oneHour).toISOString(),
      routes: 'https://feature.example.com',
      openshiftProjectName: 'test-project-feature-branch',
      kubernetesNamespaceName: 'test-project-feature-branch',
      openshift: { friendlyName: 'Development', cloudRegion: 'US-WEST' },
      project: { name: 'test-project', problemsUi: 0, factsUi: 1 },
      problems: [],
      deployments: [],
      pendingChanges: [],
    },
  ],
};

const meta: Meta<typeof import('./ProjectEnvironmentsPage').default> = {
  title: 'Pages/Project/Environments',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: createProjectEnvironmentsMockState('test-project', initialProject),
  },
  render: () => (
    <MockPreloadQuery<ProjectData, { name: string }>
      query={projectEnvironmentsQuery}
      variables={{ name: 'test-project' }}
    >
      {queryRef => {
        const ProjectEnvironmentsPage = require('./ProjectEnvironmentsPage').default;
        return <ProjectEnvironmentsPage queryRef={queryRef} projectName="test-project" />;
      }}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof import('./ProjectEnvironmentsPage').default>;

export const Default: Story = {};

export const CreateNewEnvironment: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('main', {}, { timeout: 10000 });
    const initialEnvCount = canvas.getAllByRole('row').length;

    const newEnvButton = await canvas.findByRole('button', { name: /new environment/i });
    await userEvent.click(newEnvButton);

    const branchInput = await screen.findByPlaceholderText(/enter a branch name/i);
    await userEvent.type(branchInput, 'staging');

    const createButton = await screen.findByRole('button', { name: /create$/i });
    await userEvent.click(createButton);

    await waitFor(
      () => {
        expect(canvas.getByText('staging')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const DeleteEnvironment: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('develop', {}, { timeout: 10000 });

    await sleep(500);

    const deleteButton = (await canvas.findAllByRole('button', { name: /delete/i }))?.[0];

    await userEvent.click(deleteButton);

    const confirmInput = await screen.findByRole('textbox');
    await userEvent.type(confirmInput, 'main');

    const confirmButton = await screen.findByRole('button', { name: /delete$/i });
    expect(confirmButton).not.toBeDisabled();
    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(canvas.queryByText('main')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(canvas.getByText('develop')).toBeInTheDocument();
    expect(canvas.getByText('feature-branch')).toBeInTheDocument();
  },
};
