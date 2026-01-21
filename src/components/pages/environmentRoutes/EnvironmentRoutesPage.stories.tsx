import React from 'react';

import { EnvironmentRoutesData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/routes/page';
import environmentWithRoutes from '@/lib/query/environmentWithRoutes';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, screen, userEvent, waitFor, within } from '@storybook/test';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import { sleep } from '../../../../.storybook/mocks/storyHelpers';
import EnvironmentRoutesPage from './EnvironmentRoutesPage';

const initialRoutes = [
  {
    id: 1,
    domain: 'example.com',
    type: 'route',
    primary: true,
    service: 'nginx',
    created: '2024-01-15T10:30:00Z',
    updated: '2024-06-15T14:20:00Z',
    source: 'API',
    environment: {
      id: 1,
      name: 'main',
      kubernetesNamespaceName: 'project-main',
      environmentType: 'production',
    },
  },
  {
    id: 2,
    domain: 'api.example.com',
    type: 'route',
    primary: false,
    service: 'api',
    created: '2024-02-20T08:00:00Z',
    updated: '2024-06-10T12:00:00Z',
    source: 'API',
    environment: {
      id: 1,
      name: 'main',
      kubernetesNamespaceName: 'project-main',
      environmentType: 'production',
    },
  },
];

const routeEnvMeta = {
  id: 1,
  name: 'main',
  kubernetesNamespaceName: 'project-main',
  environmentType: 'production',
  project: {
    id: 1,
    name: 'test-project',
    environments: [
      { id: 1, name: 'main' },
      { id: 2, name: 'develop' },
    ],
    productionEnvironment: 'main',
    standbyProductionEnvironment: undefined,
  },
};

const meta: Meta<typeof EnvironmentRoutesPage> = {
  title: 'Pages/Environment/Routes',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: {
      routes: {
        'project-main': initialRoutes,
      },
      routeEnvironmentMeta: {
        'project-main': routeEnvMeta,
      },
    },
  },
  render: () => (
    <MockPreloadQuery<EnvironmentRoutesData, { openshiftProjectName: string }>
      query={environmentWithRoutes}
      variables={{ openshiftProjectName: 'project-main' }}
    >
      {queryRef => <EnvironmentRoutesPage queryRef={queryRef} projectName="test-project" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof EnvironmentRoutesPage>;

export const Default: Story = {};

export const CreateRoute: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('example.com', {}, { timeout: 10000 });

    const createButton = await canvas.findByRole('button', { name: /create route/i });
    fireEvent.click(createButton);

    const domainInput = await screen.findByLabelText(/custom domain/i);
    await userEvent.type(domainInput, 'newroute.example.com');

    const serviceInput = await screen.findByLabelText(/name of the service/i);
    await userEvent.type(serviceInput, 'nginx');

    const submitButton = await screen.findByRole('button', { name: /create$/i });
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(canvas.getByText('newroute.example.com')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const EditRoute: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('example.com', {}, { timeout: 10000 });
    await sleep(500);

    const editButton = within(
      (await canvas.findAllByRole('button', { name: 'edit-route' }))?.[0]
    ).findByRole('button');
    await userEvent.click(await editButton);

    const serviceInput = await screen.findByLabelText(/name of the service/i);
    await userEvent.clear(serviceInput);
    await userEvent.type(serviceInput, 'updated-nginx');

    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(canvas.getByText('updated-nginx')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const RemoveRoute: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('example.com', {}, { timeout: 10000 });
    await sleep(500);

    const removeButton = within(
      (await canvas.findAllByRole('button', { name: 'remove-route' }))?.[0]
    ).findByRole('button');
    await userEvent.click(await removeButton);

    const domainInput = await screen.findByLabelText(/domain name/i);
    await userEvent.type(domainInput, 'example.com');

    const detachButton = await screen.findByRole('button', { name: /detach/i });
    await userEvent.click(detachButton);

    await waitFor(
      () => {
        expect(canvas.queryByText('example.com')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const DeleteRoute: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('example.com', {}, { timeout: 10000 });
    await sleep(500);

    const deleteButton = 
      (await canvas.findAllByRole('button', { name: 'delete-route' }))?.[0]
    
    await userEvent.click(deleteButton);

    const domainInput = await screen.findByLabelText(/domain name/i);
    await userEvent.type(domainInput, 'example.com');

    const confirmDeleteButton = await screen.findByRole('button', { name: /delete/i });
    await userEvent.click(confirmDeleteButton);

    await waitFor(
      () => {
        expect(canvas.queryByText('example.com')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};
