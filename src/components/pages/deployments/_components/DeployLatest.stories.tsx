import type { Meta, StoryObj } from '@storybook/react';

import DeployLatest from './DeployLatest';

const meta: Meta<typeof DeployLatest> = {
  title: 'Components/Actions/DeployLatest',
  component: DeployLatest,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof DeployLatest>;

export const Skeleton: Story = {
  args: {
    skeleton: true,
  },
};

export const BranchDeploy: Story = {
  args: {
    skeleton: false,
    environment: {
      id: 1,
      deployType: 'branch',
      deployBaseRef: 'main',
      deployHeadRef: null,
      deployTitle: null,
      project: {
        name: 'my-project',
      },
    },
  } as any,
};

export const PullRequestDeploy: Story = {
  args: {
    skeleton: false,
    environment: {
      id: 2,
      deployType: 'pullrequest',
      deployBaseRef: 'main',
      deployHeadRef: 'feature-branch',
      deployTitle: 'Add new feature #42',
      project: {
        name: 'my-project',
      },
    },
  } as any,
};

export const PromoteDeploy: Story = {
  args: {
    skeleton: false,
    environment: {
      id: 3,
      deployType: 'promote',
      deployBaseRef: 'staging',
      deployHeadRef: null,
      deployTitle: null,
      project: {
        name: 'my-project',
      },
    },
  } as any,
};

export const DeployDisabled: Story = {
  args: {
    skeleton: false,
    environment: {
      id: 4,
      deployType: 'branch',
      deployBaseRef: null,
      deployHeadRef: null,
      deployTitle: null,
      project: {
        name: 'my-project',
      },
    },
  } as any,
};
