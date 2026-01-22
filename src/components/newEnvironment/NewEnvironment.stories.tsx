import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { NewEnvironment } from './NewEnvironment';

const meta: Meta<typeof NewEnvironment> = {
  title: 'Components/Sheets/NewEnvironment',
  component: NewEnvironment,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof NewEnvironment>;

export const Default: Story = {
  args: {
    projectName: 'my-project',
    refetch: () => {},
  },
};

export const Open: Story = {
  args: {
    projectName: 'my-project',
    refetch: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
  },
};
