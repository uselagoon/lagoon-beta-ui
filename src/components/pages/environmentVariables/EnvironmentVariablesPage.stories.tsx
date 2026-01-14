import React from 'react';

import { EnvVariablesData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/environment-variables/page';
import environmentByOpenShiftProjectNameWithEnvVars from '@/lib/query/environmentByOpenShiftProjectNameWithEnvVars';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, waitFor, within } from '@storybook/test';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import { createEnvVariablesMockState } from '../../../../.storybook/mocks/storyHelpers';
import EnvironmentVariablesPage from './EnvironmentVariablesPage';

const initialEnvVariables = [
  { id: 1, name: 'ENV_API_KEY', scope: 'global', value: 'env-secret-api-key-123' },
  { id: 2, name: 'ENV_DATABASE_URL', scope: 'build', value: 'postgres://localhost/envdb' },
  { id: 3, name: 'ENV_CACHE_TTL', scope: 'runtime', value: '3600' },
];

const initialProjectVariables = [
  { id: 101, name: 'PROJECT_API_KEY', scope: 'global', value: 'project-secret-123' },
  { id: 102, name: 'PROJECT_DB_URL', scope: 'build', value: 'postgres://project/db' },
];

const meta: Meta<typeof EnvironmentVariablesPage> = {
  title: 'Pages/Environment/Variables',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: createEnvVariablesMockState('project-main', initialEnvVariables, initialProjectVariables),
  },
  render: () => (
    <MockPreloadQuery<EnvVariablesData, { openshiftProjectName: string; limit: null }>
      query={environmentByOpenShiftProjectNameWithEnvVars}
      variables={{ openshiftProjectName: 'project-main', limit: null }}
    >
      {queryRef => (
        <EnvironmentVariablesPage queryRef={queryRef} projectName="test-project" environmentName="project-main" />
      )}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof EnvironmentVariablesPage>;

export const List: Story = {};

export const AddVariable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const addButton = await canvas.findByRole('button', { name: 'Add new variable' }, { timeout: 10000 });
    await userEvent.click(addButton);

    const nameInput = await screen.findByLabelText(/variable name/i, {}, { timeout: 5000 });
    await userEvent.type(nameInput, 'NEW_ENV_VAR');

    const scopeTrigger = await screen.findByRole('combobox', {}, { timeout: 5000 });
    await userEvent.click(scopeTrigger);

    const globalOption = await screen.findByRole('option', { name: /global/i }, { timeout: 5000 });
    await userEvent.click(globalOption);

    const valueInput = await screen.findByLabelText(/variable value/i, {}, { timeout: 5000 });
    await userEvent.type(valueInput, 'my-env-value');

    const createButton = await screen.findByRole('button', { name: /create/i }, { timeout: 5000 });
    await userEvent.click(createButton);

    await canvas.findByText('NEW_ENV_VAR', {}, { timeout: 5000 });
  },
};

export const EditVariable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const editValuesToggle = await canvas.findByTestId('env-var-visibility-toggle', {}, { timeout: 10000 });
    await userEvent.click(editValuesToggle);

    const firstEditButton = within((await canvas.findAllByRole('button', { name: 'edit-variable' }))?.[0]).findByRole(
      'button'
    );
    if (!firstEditButton) {
      throw new Error('Edit button not found');
    }
    await userEvent.click(await firstEditButton);

    const valueInput = await screen.findByLabelText(/variable value/i, {}, { timeout: 5000 });
    await userEvent.clear(valueInput);
    await userEvent.type(valueInput, 'updated-env-value');

    const updateButton = await screen.findByRole('button', { name: /update/i }, { timeout: 5000 });
    await userEvent.click(updateButton);

    await canvas.findByText('updated-env-value', {}, { timeout: 5000 });
  },
};

export const DeleteVariable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const editValuesToggle = await canvas.findByTestId('env-var-visibility-toggle', {}, { timeout: 10000 });
    await userEvent.click(editValuesToggle);

    const deleteButton = (await canvas.findAllByRole('button', { name: 'delete-variable' }))?.[0];
    if (!deleteButton) {
      throw new Error('Delete button not found');
    }
    await userEvent.click(deleteButton);

    const confirmInput = await screen.findByLabelText(/variable name/i, {}, { timeout: 5000 });
    await userEvent.type(confirmInput, 'ENV_API_KEY');

    const dialog = await screen.findByRole('alertdialog', {}, { timeout: 5000 });
    const deleteConfirmButton = await within(dialog).findByRole('button', { name: /delete/i }, { timeout: 5000 });
    await userEvent.click(deleteConfirmButton);

    await waitFor(
      () => {
        expect(canvas.queryByText('ENV_API_KEY')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const ViewProjectVariableValues: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('PROJECT_API_KEY', {}, { timeout: 10000 });

    const projectValuesToggle = await canvas.findByTestId('project-var-visibility-toggle', {}, { timeout: 10000 });
    await userEvent.click(projectValuesToggle);

    await canvas.findByText('project-secret-123', {}, { timeout: 5000 });
  },
};
