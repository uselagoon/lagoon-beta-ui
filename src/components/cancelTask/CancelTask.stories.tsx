import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { CancelTaskButton } from './CancelTask';

const onCancel = action('cancel-task');

const meta: Meta<typeof CancelTaskButton> = {
  title: 'Components/Actions/CancelTask',
  component: CancelTaskButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    loading: { control: 'boolean' },
    success: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CancelTaskButton>;

export const Default: Story = {
  args: {
    action: async () => {
      onCancel();
      return Promise.resolve();
    },
    success: false,
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    action: async () => Promise.resolve(),
    success: false,
    loading: true,
  },
};

export const Success: Story = {
  args: {
    action: async () => Promise.resolve(),
    success: true,
    loading: false,
    afterText: 'Cancelled',
  },
};

export const WithCustomText: Story = {
  args: {
    action: async () => {
      onCancel();
      return Promise.resolve();
    },
    success: false,
    loading: false,
    beforeText: 'Running',
  },
};
