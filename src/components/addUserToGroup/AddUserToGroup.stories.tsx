import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { AddUserToGroup } from './AddUserToGroup';

const meta: Meta<typeof AddUserToGroup> = {
  title: 'Components/Sheets/AddUserToGroup',
  component: AddUserToGroup,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AddUserToGroup>;

export const Default: Story = {
  args: {
    groupName: 'developers',
    refetch: () => {},
  },
};

export const ProjectGroup: Story = {
  args: {
    groupName: 'project-my-project',
    refetch: () => {},
  },
};

export const Open: Story = {
  args: {
    groupName: 'developers',
    refetch: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
  },
};
