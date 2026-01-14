import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { EditUserRole } from './EditUserRole';

const meta: Meta<typeof EditUserRole> = {
  title: 'Components/Sheets/EditUserRole',
  component: EditUserRole,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof EditUserRole>;

export const Default: Story = {
  args: {
    groupName: 'developers',
    email: 'user@example.com',
    currentRole: 'DEVELOPER',
    refetch: () => {},
  },
};

export const Maintainer: Story = {
  args: {
    groupName: 'project-my-project',
    email: 'admin@example.com',
    currentRole: 'MAINTAINER',
    refetch: () => {},
  },
};

export const Open: Story = {
  args: {
    groupName: 'developers',
    email: 'user@example.com',
    currentRole: 'DEVELOPER',
    refetch: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
  },
};
