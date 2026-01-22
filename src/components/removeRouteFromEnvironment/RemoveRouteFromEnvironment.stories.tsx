import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { RemoveRouteFromEnvDialog } from './RemoveRouteFromEnvironment';

const meta: Meta<typeof RemoveRouteFromEnvDialog> = {
  title: 'Components/Dialogs/RemoveRouteFromEnvironment',
  component: RemoveRouteFromEnvDialog,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof RemoveRouteFromEnvDialog>;

export const Default: Story = {
  args: {
    domainName: 'app.example.com',
    environmentName: 'main',
    projectName: 'my-project',
    refetch: () => {},
  },
};

export const LongDomain: Story = {
  args: {
    domainName: 'staging.my-application.example.com',
    environmentName: 'staging',
    projectName: 'my-project',
    refetch: () => {},
  },
};

export const Open: Story = {
  args: {
    domainName: 'app.example.com',
    environmentName: 'main',
    projectName: 'my-project',
    refetch: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = (await canvas.findAllByRole('button'))[0];
    await userEvent.click(trigger);
  },
};
