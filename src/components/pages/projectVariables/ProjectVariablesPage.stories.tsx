import React from 'react';

import { ProjectEnvironmentsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/project-variables/page';
import projectVariablesQuery from '@/lib/query/projectVariablesQuery';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, waitFor, within } from '@storybook/test';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import ProjectVariablesPage from './ProjectVariablesPage';

const initialVariables = [
  { id: 1, name: 'API_KEY', scope: 'global', value: 'secret-api-key-123' },
  { id: 2, name: 'DATABASE_URL', scope: 'build', value: 'postgres://localhost/db' },
  { id: 3, name: 'CACHE_TTL', scope: 'runtime', value: '3600' },
];

const meta: Meta<typeof ProjectVariablesPage> = {
  title: 'Pages/Project/Variables',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: {
      projectEnvVariables: {
        'test-project': initialVariables.map(v => ({ id: v.id, name: v.name, scope: v.scope })),
      },
      projectEnvVariablesWithValues: {
        'test-project': initialVariables,
      },
    },
  },
  render: () => (
    <MockPreloadQuery<ProjectEnvironmentsData, { name: string }>
      query={projectVariablesQuery}
      variables={{ name: 'test-project' }}
    >
      {queryRef => <ProjectVariablesPage queryRef={queryRef} projectName="test-project" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof ProjectVariablesPage>;

export const List: Story = {};

export const AddVariable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const addButton = await canvas.findByRole('button', { name: 'Add new variable' }, { timeout: 10000 });
    await userEvent.click(addButton);

    const nameInput = await screen.findByLabelText(/variable name/i);
    await userEvent.type(nameInput, 'NEW_PROJECT_VAR');

    const scopeTrigger = await screen.findByRole('combobox');
    await userEvent.click(scopeTrigger);

    const globalOption = await screen.findByRole('option', { name: /global/i });
    await userEvent.click(globalOption);

    const valueInput = await screen.findByLabelText(/variable value/i);
    await userEvent.type(valueInput, 'my-new-value');

    const createButton = await screen.findByRole('button', { name: /create/i });
    await userEvent.click(createButton);

    await canvas.findByText('NEW_PROJECT_VAR', {}, { timeout: 5000 });
  },
};

export const EditVariable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const editValuesToggle = await canvas.findByTestId('var-visibility-toggle', {}, { timeout: 10000 });
    await userEvent.click(editValuesToggle);

    const firstEditButton = within((await canvas.findAllByRole('button', { name: 'edit-variable' }))?.[0]).findByRole('button');  
    if (!firstEditButton) {
      throw new Error('Edit button not found');
    }
    await userEvent.click(await firstEditButton);

    const valueInput = await screen.findByLabelText(/variable value/i);
    await userEvent.clear(valueInput);
    await userEvent.type(valueInput, 'updated-project-value');

    const updateButton = await screen.findByRole('button', { name: /update/i });
    await userEvent.click(updateButton);

    await canvas.findByText('updated-project-value', {}, { timeout: 5000 });
  },
};

export const DeleteVariable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const editValuesToggle = await canvas.findByTestId('var-visibility-toggle', {}, { timeout: 10000 });
    await userEvent.click(editValuesToggle);

    const deleteButton = (await canvas.findAllByRole('button', { name: 'delete-variable' }))?.[0];

    await userEvent.click(deleteButton);

    const confirmInput = await screen.findByLabelText(/variable name/i);
    await userEvent.type(confirmInput, 'API_KEY');

    const deleteConfirmButton = await screen.findByRole('button', { name: /delete/i });
    await userEvent.click(deleteConfirmButton);

    await waitFor(
      () => {
        expect(canvas.queryByText('API_KEY')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const UnauthorizedViewValues: Story = {
  parameters: {
    initialMockState: {
      unauthorizedViewValues: {
        'test-project': true,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('API_KEY', {}, { timeout: 10000 });

    const editValuesToggle = await canvas.findByTestId('var-visibility-toggle', {}, { timeout: 10000 });
    await userEvent.click(editValuesToggle);

    await waitFor(
      () => {
        expect(screen.getByText(/unauthorized/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};
