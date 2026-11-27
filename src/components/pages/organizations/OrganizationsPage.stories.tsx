import React from 'react';

import { OrgType } from '@/app/(routegroups)/(orgroutes)/organizations/(organizations-page)/page';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';

import OrganizationsPage from './OrganizationsPage';

const generateMockOrganizations = (count: number = 10): OrgType[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `organization-${['alpha', 'beta', 'gamma', 'delta', 'epsilon'][index % 5]}-${index + 1}`,
    friendlyName: `Organization ${index + 1}`,
    description: `Description for organization ${index + 1}`,
    quotaProject: 10,
    quotaGroup: 5,
    groups: null,
    projects: null,
    deployTargets: [{ id: 1, name: 'production' }],
  }));
};

const mockData: OrgType[] = generateMockOrganizations(15);

const meta: Meta<typeof OrganizationsPage> = {
  title: 'Pages/Organizations',
  component: OrganizationsPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof OrganizationsPage>;

export const Default: Story = {
  args: {
    organizations: mockData,
  },
};

export const Empty: Story = {
  args: {
    organizations: [],
  },
};

export const SearchesFriendlyNameAndSlug: Story = {
  tags: ['org-search'],
  args: {
    organizations: [
      {
        id: 1,
        name: 'amazeelabs',
        friendlyName: 'amazee.io Solutions',
        description: 'Renamed organization',
        quotaProject: 10,
        quotaGroup: 5,
        groups: null,
        projects: null,
        deployTargets: [{ id: 1, name: 'production' }],
      },
      {
        id: 2,
        name: 'other-organization',
        friendlyName: 'Other Organization',
        description: 'Another organization',
        quotaProject: 10,
        quotaGroup: 5,
        groups: null,
        projects: null,
        deployTargets: [{ id: 2, name: 'staging' }],
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText('Start typing to search');

    await userEvent.type(searchInput, 'solutions');

    await waitFor(() => {
      expect(canvas.getByText('amazee.io Solutions')).toBeInTheDocument();
      expect(canvas.queryByText('Other Organization')).not.toBeInTheDocument();
    });

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'amazeelabs');

    await waitFor(() => {
      expect(canvas.getByText('amazee.io Solutions')).toBeInTheDocument();
      expect(canvas.queryByText('Other Organization')).not.toBeInTheDocument();
    });
  },
};
