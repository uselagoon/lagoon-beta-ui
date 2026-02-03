import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { EditSshSheet } from './EditSshSheet';

const meta: Meta<typeof EditSshSheet> = {
  title: 'Components/Sheets/EditSshSheet',
  component: EditSshSheet,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof EditSshSheet>;

export const Default: Story = {
  args: {
    name: 'my-laptop-key',
    id: 1,
    keyValue: 'AAAAB3NzaC1yc2EAAAADAQABAAABgQC...',
    keyType: 'ssh-rsa',
  },
};

export const Ed25519Key: Story = {
  args: {
    name: 'deploy-key',
    id: 2,
    keyValue: 'AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVz...',
    keyType: 'ssh-ed25519',
  },
};

export const Open: Story = {
  args: {
    name: 'my-laptop-key',
    id: 1,
    keyValue: 'AAAAB3NzaC1yc2EAAAADAQABAAABgQC...',
    keyType: 'ssh-rsa',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
  },
};
