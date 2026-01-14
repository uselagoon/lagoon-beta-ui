import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { AddNewVariable } from './AddNewVariable';

const meta: Meta<typeof AddNewVariable> = {
  title: 'Components/Sheets/AddNewVariable',
  component: AddNewVariable,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AddNewVariable>;

export const ProjectVariable: Story = {
  args: {
    type: 'project',
    projectName: 'my-project',
    refetch: () => {},
  },
};

export const EnvironmentVariable: Story = {
  args: {
    type: 'environment',
    projectName: 'my-project',
    environmentName: 'main',
    refetch: () => {},
  },
};

export const OrganizationVariable: Story = {
  args: {
    type: 'organization',
    orgName: 'my-organization',
    refetch: () => {},
  },
};

export const Open: Story = {
  args: {
    type: 'project',
    projectName: 'my-project',
    refetch: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
  },
};
