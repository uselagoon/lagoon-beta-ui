import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { EditUser } from './EditUser';

const meta: Meta<typeof EditUser> = {
  title: 'Components/Sheets/EditUser',
  component: EditUser,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof EditUser>;

export const Owner: Story = {
  args: {
    orgId: 1,
    user: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      owner: true,
      admin: null,
      groupRoles: [],
    },
    refetch: () => {},
  },
};

export const Admin: Story = {
  args: {
    orgId: 1,
    user: {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      owner: null,
      admin: true,
      groupRoles: [],
    },
    refetch: () => {},
  },
};

export const Viewer: Story = {
  args: {
    orgId: 1,
    user: {
      id: '3',
      firstName: 'Bob',
      lastName: 'Wilson',
      email: 'bob.wilson@example.com',
      owner: null,
      admin: null,
      groupRoles: [],
    },
    refetch: () => {},
  },
};

export const NoName: Story = {
  args: {
    orgId: 1,
    user: {
      id: '4',
      firstName: null,
      lastName: null,
      email: 'anonymous@example.com',
      owner: null,
      admin: null,
      groupRoles: [],
    },
    refetch: () => {},
  },
};

export const Open: Story = {
  args: {
    orgId: 1,
    user: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      owner: true,
      admin: null,
      groupRoles: [],
    },
    refetch: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
  },
};
