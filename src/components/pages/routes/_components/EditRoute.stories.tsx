import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { EditRoute } from './EditRoute';

const meta: Meta<typeof EditRoute> = {
  title: 'Components/Sheets/EditRouteProject',
  component: EditRoute,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof EditRoute>;

export const Default: Story = {
  args: {
    projectName: 'my-project',
    environmentName: 'main',
    domainName: 'app.example.com',
    service: 'nginx',
    iconOnly: true,
  },
};

export const WithButton: Story = {
  args: {
    projectName: 'my-project',
    environmentName: 'main',
    domainName: 'app.example.com',
    service: 'nginx',
    iconOnly: false,
  },
};

export const PrimaryRoute: Story = {
  args: {
    projectName: 'my-project',
    environmentName: 'main',
    domainName: 'app.example.com',
    service: 'nginx',
    primary: true,
    iconOnly: true,
  },
};

export const WithStandby: Story = {
  args: {
    projectName: 'my-project',
    environmentName: 'main',
    domainName: 'app.example.com',
    service: 'nginx',
    standbyEnvironment: 'staging',
    routeType: 'STANDARD',
    iconOnly: true,
  },
};

export const Open: Story = {
  args: {
    projectName: 'my-project',
    environmentName: 'main',
    domainName: 'app.example.com',
    service: 'nginx',
    iconOnly: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
  },
};
