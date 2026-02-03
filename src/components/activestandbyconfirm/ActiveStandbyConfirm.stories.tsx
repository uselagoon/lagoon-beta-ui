import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { userEvent, within } from '@storybook/test';

import { ActiveStandbyConfirm } from './ActiveStandbyConfirm';

const onSwitch = action('switch-active-standby');

const meta: Meta<typeof ActiveStandbyConfirm> = {
  title: 'Components/Dialogs/ActiveStandbyConfirm',
  component: ActiveStandbyConfirm,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ActiveStandbyConfirm>;

export const Default: Story = {
  args: {
    activeEnvironment: 'production',
    standbyEnvironment: 'staging',
    action: async () => {
      onSwitch();
      return Promise.resolve();
    },
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    activeEnvironment: 'production',
    standbyEnvironment: 'staging',
    action: async () => Promise.resolve(),
    loading: true,
  },
};

export const NoStandby: Story = {
  args: {
    activeEnvironment: 'production',
    standbyEnvironment: null,
    action: async () => {
      onSwitch();
      return Promise.resolve();
    },
    loading: false,
  },
};

export const Open: Story = {
  args: {
    activeEnvironment: 'production',
    standbyEnvironment: 'staging',
    action: async () => {
      onSwitch();
      return Promise.resolve();
    },
    loading: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
  },
};
