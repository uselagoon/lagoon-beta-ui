import React from 'react';

import { OrganizationVariablesData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/variables/page';
import organizationByNameWithEnvVars from '@/lib/query/organizations/organizationByNameWithEnvVars';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, waitFor, within } from '@storybook/test';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import OrgVariablesPage from './VariablesPage';
import { sleep } from '../../../../../.storybook/mocks/storyHelpers';

const initialVariables = [
  { id: 1, name: 'API_KEY', scope: 'global', value: 'secret-api-key-123' },
  { id: 2, name: 'DATABASE_URL', scope: 'build', value: 'postgres://localhost/db' },
  { id: 3, name: 'CACHE_TTL', scope: 'runtime', value: '3600' },
];

const meta: Meta<typeof OrgVariablesPage> = {
  title: 'Pages/Organizations/Variables',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: {
      orgEnvVariables: {
        'test-organization': initialVariables.map(v => ({ id: v.id, name: v.name, scope: v.scope })),
      },
      orgEnvVariablesWithValues: {
        'test-organization': initialVariables,
      },
    },
  },
  render: () => (
    <MockPreloadQuery<OrganizationVariablesData, { name: string }>
      query={organizationByNameWithEnvVars}
      variables={{ name: 'test-organization' }}
    >
      {queryRef => <OrgVariablesPage queryRef={queryRef} organizationSlug="test-organization" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof OrgVariablesPage>;

export const List: Story = {};

export const AddVariable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const addButton = await canvas.findByRole('button', { name: 'Add new variable' }, { timeout: 10000 });
    await userEvent.click(addButton);

    const nameInput = await screen.findByLabelText(/variable name/i);
    await userEvent.type(nameInput, 'NEW_VARIABLE');

    const scopeTrigger = await screen.findByRole('combobox');
    await userEvent.click(scopeTrigger);

    const globalOption = await screen.findByRole('option', { name: /global/i });
    await userEvent.click(globalOption);

    const valueInput = await screen.findByLabelText(/variable value/i);
    await userEvent.type(valueInput, 'my-new-value');

    const createButton = await screen.findByRole('button', { name: /create/i });
    await userEvent.click(createButton);

    await canvas.findByText('NEW_VARIABLE', {}, { timeout: 5000 });
  },
};

export const EditVariable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const editValuesToggle = await canvas.findByTestId('var-visibility-toggle', {}, { timeout: 10000 });
    await userEvent.click(editValuesToggle);

    const firstEditButton = within((await canvas.findAllByRole('button', { name: 'edit-variable' }))?.[0]).findByRole(
      'button'
    );
    if (!firstEditButton) {
      throw new Error('Edit button not found');
    }
    await userEvent.click(await firstEditButton);

    const valueInput = await screen.findByLabelText(/variable value/i);
    await userEvent.clear(valueInput);
    await userEvent.type(valueInput, 'updated-value-123');

    const updateButton = await screen.findByRole('button', { name: /update/i });
    await userEvent.click(updateButton);

    await canvas.findByText('updated-value-123', {}, { timeout: 5000 });
  },
};

export const DeleteVariable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const editValuesToggle = await canvas.findByTestId('var-visibility-toggle', {}, { timeout: 10000 });
    await userEvent.click(editValuesToggle);

    await sleep(500);
    const deleteButton = within((await canvas.findAllByRole('button', { name: 'delete-variable' }))?.[0]).findByRole('button');
    if (!deleteButton) {
      throw new Error('Delete button not found');
    }
    await userEvent.click(await deleteButton);

    const confirmInput = await screen.findByLabelText(/variable name/i, {}, { timeout: 5000 });
    await userEvent.type(confirmInput, 'API_KEY');

    const dialog = await screen.findByRole('alertdialog', {}, { timeout: 5000 });
    const deleteConfirmButton = await within(dialog).findByRole('button', { name: /delete/i }, { timeout: 5000 });
    await userEvent.click(deleteConfirmButton);

    await waitFor(
      () => {
        expect(canvas.queryByText('API_KEY')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};
