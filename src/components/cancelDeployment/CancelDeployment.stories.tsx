import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { CancelDeploymentButton } from './CancelDeployment';

const onCancel = action('cancel-deployment');

const meta: Meta<typeof CancelDeploymentButton> = {
  title: 'Components/Actions/CancelDeployment',
  component: CancelDeploymentButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    loading: { control: 'boolean' },
    success: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CancelDeploymentButton>;

export const Default: Story = {
  args: {
    action: async () => {
      onCancel();
      return Promise.resolve();
    },
    success: false,
    loading: false,
    deployName: 'build-123',
  },
};

export const Loading: Story = {
  args: {
    action: async () => Promise.resolve(),
    success: false,
    loading: true,
    deployName: 'build-123',
  },
};

export const Success: Story = {
  args: {
    action: async () => Promise.resolve(),
    success: true,
    loading: false,
    deployName: 'build-123',
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
    deployName: 'build-456',
    beforeText: 'Running',
  },
};
