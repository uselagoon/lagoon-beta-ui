import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { AddGroupToProject } from './AddGroupToProject';

const meta: Meta<typeof AddGroupToProject> = {
  title: 'Components/Sheets/AddGroupToProject',
  component: AddGroupToProject,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AddGroupToProject>;

export const Default: Story = {
  args: {
    projectName: 'my-project',
    groups: [
      { id: '1', name: 'developers' },
      { id: '2', name: 'qa-team' },
      { id: '3', name: 'devops' },
    ],
    refetch: () => {},
  },
};

export const SingleGroup: Story = {
  args: {
    projectName: 'my-project',
    groups: [{ id: '1', name: 'project-my-project' }],
    refetch: () => {},
  },
};

export const ManyGroups: Story = {
  args: {
    projectName: 'enterprise-app',
    groups: [
      { id: '1', name: 'frontend-team' },
      { id: '2', name: 'backend-team' },
      { id: '3', name: 'qa-team' },
      { id: '4', name: 'devops' },
      { id: '5', name: 'security' },
      { id: '6', name: 'release-managers' },
    ],
    refetch: () => {},
  },
};

export const Open: Story = {
  args: {
    projectName: 'my-project',
    groups: [
      { id: '1', name: 'developers' },
      { id: '2', name: 'qa-team' },
      { id: '3', name: 'devops' },
    ],
    refetch: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
  },
};
