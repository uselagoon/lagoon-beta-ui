import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { EditVariable } from './EditVariable';

const meta: Meta<typeof EditVariable> = {
  title: 'Components/Sheets/EditVariable',
  component: EditVariable,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof EditVariable>;

export const ProjectVariable: Story = {
  args: {
    currentEnv: {
      id: 1,
      name: 'API_KEY',
      value: 'secret-value-123',
      scope: 'build',
    },
    refetch: () => {},
    type: 'project',
    projectName: 'my-project',
  } as any,
};

export const EnvironmentVariable: Story = {
  args: {
    currentEnv: {
      id: 2,
      name: 'DATABASE_URL',
      value: 'postgres://localhost:5432/db',
      scope: 'runtime',
    },
    refetch: () => {},
    type: 'environment',
    projectName: 'my-project',
    environmentName: 'main',
  } as any,
};

export const OrganizationVariable: Story = {
  args: {
    currentEnv: {
      id: 3,
      name: 'ORG_SECRET',
      value: 'org-secret-value',
      scope: 'global',
    },
    refetch: () => {},
    type: 'organization',
    orgName: 'my-organization',
  } as any,
};

export const LongValue: Story = {
  args: {
    currentEnv: {
      id: 4,
      name: 'MULTI_LINE_VALUE',
      value: `line 1
line 2
line 3
line 4`,
      scope: 'runtime',
    },
    refetch: () => {},
    type: 'project',
    projectName: 'my-project',
  } as any,
};

export const Open: Story = {
  args: {
    currentEnv: {
      id: 1,
      name: 'API_KEY',
      value: 'secret-value-123',
      scope: 'build',
    },
    refetch: () => {},
    type: 'project',
    projectName: 'my-project',
  } as any,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
  },
};
