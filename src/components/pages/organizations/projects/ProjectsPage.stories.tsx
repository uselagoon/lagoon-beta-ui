import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, screen, waitFor } from '@storybook/test';

import { OrganizationProjectsData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/projects/(projects-page)/page';
import organizationByNameProjects from '@/lib/query/organizations/organizationByName.projects';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import { createOrgProjectsMockState, OrgProjectsData, sleep } from '../../../../../.storybook/mocks/storyHelpers';
import OrgProjectsPage from './ProjectsPage';

const initialOrgData: OrgProjectsData = {
  id: 1,
  name: 'test-organization',
  friendlyName: 'Test Organization',
  projects: [
    { id: 1, name: 'project-alpha', groupCount: 3 },
    { id: 2, name: 'project-beta', groupCount: 2 },
    { id: 3, name: 'project-gamma', groupCount: 5 },
    { id: 4, name: 'project-delta', groupCount: 1 },
  ],
  deployTargets: [
    { id: 1, name: 'production', friendlyName: 'Production Cluster', cloudProvider: 'aws', cloudRegion: 'us-east-1' },
    { id: 2, name: 'staging', friendlyName: 'Staging Cluster', cloudProvider: 'aws', cloudRegion: 'us-west-2' },
  ],
};

const meta: Meta<typeof OrgProjectsPage> = {
  title: 'Pages/Organizations/Projects',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: createOrgProjectsMockState('test-organization', initialOrgData),
  },
  render: () => (
    <MockPreloadQuery<OrganizationProjectsData, { name: string }>
      query={organizationByNameProjects}
      variables={{ name: 'test-organization' }}
    >
      {queryRef => <OrgProjectsPage queryRef={queryRef} organizationSlug="test-organization" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof OrgProjectsPage>;

export const List: Story = {};

export const AddProject: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const createButton = await canvas.findByRole('button', { name: /create project/i }, { timeout: 10000 });
    await userEvent.click(createButton);

    const nameInput = await screen.findByLabelText(/project name/i);
    await userEvent.type(nameInput, 'new-project');

    const gitUrlInput = await screen.findByLabelText(/git url/i);
    await userEvent.type(gitUrlInput, 'git@github.com:example/new-project.git');

    const prodEnvInput = await screen.findByLabelText(/production environment/i);
    await userEvent.type(prodEnvInput, 'main');

    const deployTargetSelect = await screen.findByRole('combobox');
    await userEvent.click(deployTargetSelect);

    const targetOption = await screen.findByRole('option', { name: /production/i });
    await userEvent.click(targetOption);

    const submitButton = await screen.findByRole('button', { name: /create$/i });
    await userEvent.click(submitButton);

    await canvas.findByText('new-project', {}, { timeout: 5000 });
  },
};

export const DeleteProject: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('project-alpha', {}, { timeout: 500 });

    await sleep(500);
    
    const deleteButtons = await canvas.findAllByRole('button', { name: /delete/i });
    await userEvent.click(deleteButtons[0]);

    const confirmInput = await screen.findByLabelText(/Variable name/i);
    await userEvent.type(confirmInput, 'project-alpha');

    const confirmButton = await screen.findByRole('button', { name: /delete$/i });
    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(canvas.queryByText('project-alpha')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};
