import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { userEvent, within } from '@storybook/test';

import { DeleteConfirm } from './DeleteConfirm';

const onDelete = action('delete');

const meta: Meta<typeof DeleteConfirm> = {
  title: 'Components/Dialogs/DeleteConfirm',
  component: DeleteConfirm,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DeleteConfirm>;

export const Default: Story = {
  args: {
    deleteType: 'environment',
    deleteName: 'production',
    action: async () => {
      onDelete();
      return Promise.resolve();
    },
    loading: false,
  },
};

export const CustomMessage: Story = {
  args: {
    deleteType: 'project',
    deleteName: 'my-project',
    deleteMessage: 'This is a custom warning message. Be careful!',
    action: async () => {
      onDelete();
      return Promise.resolve();
    },
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    deleteType: 'environment',
    deleteName: 'staging',
    action: async () => Promise.resolve(),
    loading: true,
  },
};

export const WithButtonText: Story = {
  args: {
    deleteType: 'variable',
    deleteName: 'API_KEY',
    action: async () => {
      onDelete();
      return Promise.resolve();
    },
    loading: false,
    buttonText: 'Remove',
  },
};

export const Open: Story = {
  args: {
    deleteType: 'environment',
    deleteName: 'production',
    action: async () => {
      onDelete();
      return Promise.resolve();
    },
    loading: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = (await canvas.findAllByRole('button'))[0];
    await userEvent.click(trigger);
  },
};
