import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { userEvent, within } from '@storybook/test';

import DeleteNoConfirm from './DeleteNoConfirm';

const onDelete = action('delete');

const meta: Meta<typeof DeleteNoConfirm> = {
  title: 'Components/Dialogs/DeleteNoConfirm',
  component: DeleteNoConfirm,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DeleteNoConfirm>;

export const Delete: Story = {
  args: {
    deleteType: 'delete',
    deleteItemType: 'user',
    title: 'Remove user',
    deleteMessage: 'Are you sure you want to remove this user from the group?',
    action: async () => {
      onDelete();
      return Promise.resolve();
    },
    loading: false,
  },
};

export const Unlink: Story = {
  args: {
    deleteType: 'unlink',
    deleteItemType: 'project',
    title: 'Unlink project',
    deleteMessage: 'Are you sure you want to unlink this project from the group?',
    action: async () => {
      onDelete();
      return Promise.resolve();
    },
    loading: false,
  },
};

export const Remove: Story = {
  args: {
    deleteType: 'remove',
    deleteItemType: 'notification',
    title: 'Remove notification',
    deleteMessage: 'Are you sure you want to remove this notification?',
    action: async () => {
      onDelete();
      return Promise.resolve();
    },
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    deleteType: 'delete',
    deleteItemType: 'item',
    title: 'Delete item',
    deleteMessage: 'Deleting...',
    action: async () => Promise.resolve(),
    loading: true,
  },
};

export const CustomConfirmText: Story = {
  args: {
    deleteType: 'remove',
    deleteItemType: 'member',
    deleteConfirmText: 'Yes, remove',
    title: 'Remove member',
    deleteMessage: 'This will remove the member from the team.',
    action: async () => {
      onDelete();
      return Promise.resolve();
    },
    loading: false,
  },
};

export const Open: Story = {
  args: {
    deleteType: 'delete',
    deleteItemType: 'user',
    title: 'Remove user',
    deleteMessage: 'Are you sure you want to remove this user from the group?',
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
