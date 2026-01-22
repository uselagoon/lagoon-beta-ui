import type { Meta, StoryObj } from '@storybook/react';

import ErrorPage from './_ErrorPage';
import QueryError from './QueryError';
import ProjectNotFound from './ProjectNotFound';
import EnvironmentNotFound from './EnvironmentNotFound';
import DeploymentNotFound from './DeploymentNotFound';
import TaskNotFound from './TaskNotFound';
import OrganizationNotFound from './OrganizationNotFound';
import OrgProjectNotFound from './OrgProjectNotFound';

const meta: Meta<typeof ErrorPage> = {
  title: 'Components/Display/ErrorPage',
  component: ErrorPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ErrorPage>;

export const NotFound404: Story = {
  args: {
    statusCode: 404,
    errorMessage: 'The resource you are looking for does not exist.',
  },
};

export const ServerError500: Story = {
  args: {
    statusCode: 500,
    errorMessage: 'An unexpected error occurred on the server.',
  },
};

export const BadRequest400: Story = {
  args: {
    statusCode: 400,
    errorMessage: 'The request was malformed.',
  },
};

export const Unauthorized401: Story = {
  args: {
    statusCode: 401,
    errorMessage: 'You need to be logged in to view this resource.',
  },
};

export const CustomTitle: Story = {
  args: {
    statusCode: 404,
    errorMessage: 'This item has been deleted.',
    title: 'Resource Deleted',
  },
};

export const QueryErrorExample: Story = {
  render: () => <QueryError error="GraphQL error: Failed to fetch data from the API" />,
};

export const ProjectNotFoundExample: Story = {
  render: () => <ProjectNotFound projectName="my-missing-project" />,
};

export const EnvironmentNotFoundExample: Story = {
  render: () => <EnvironmentNotFound openshiftProjectName="my-project-staging" />,
};

export const DeploymentNotFoundExample: Story = {
  render: () => <DeploymentNotFound deploymentName="build-12345" />,
};

export const TaskNotFoundExample: Story = {
  render: () => <TaskNotFound taskName="task-67890" />,
};

export const OrganizationNotFoundExample: Story = {
  render: () => <OrganizationNotFound orgName="my-missing-org" />,
};

export const OrgProjectNotFoundExample: Story = {
  render: () => <OrgProjectNotFound projectName="missing-project" />,
};
