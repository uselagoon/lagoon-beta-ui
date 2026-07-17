import { test, expect } from '@playwright/test';
import { env } from '../../support/test-helpers';
import { variables } from '../../fixtures/testData';

const url = `${env.url}/projects/${env.project}/${env.env_production}/environment-variables`;

test.describe('Environment variables list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    await expect(page.getByTestId('env-var-visibility-toggle')).toBeVisible();
  });

  test('empty state shown when no variables exist', async ({ page }) => {
    const rows = page.getByTestId('table-row');
    const emptyState = page.getByTestId('empty-state').first();

    const hasRows = await rows.first().isVisible().catch(() => false);
    if (!hasRows) {
      await expect(emptyState).toBeVisible();
    }
  });
});

test.describe.serial('Add and delete environment variable', () => {
  test.use({ storageState: 'playwright/.auth/owner.json' });

  test('add a new environment variable; appears in list', async ({ page }) => {
    await page.goto(url);
    await expect(page.getByTestId('env-var-visibility-toggle')).toBeVisible();

    const initialCount = await page.getByTestId('table-row').count();

    await page.getByRole('button', { name: 'Add environment variable' }).click();

    const sheet = page.getByRole('dialog');
    await expect(sheet).toBeVisible();

    await sheet.getByLabel('Variable name').fill(variables.name);
    await sheet.getByTestId('variable_scope').click();
    await page.getByRole('option', { name: 'Runtime' }).click();
    await sheet.getByLabel('Variable value').fill(variables.value);

    await sheet.getByRole('button', { name: 'Create' }).click();

    await expect(async () => {
      expect(await page.getByTestId('table-row').count()).toBeGreaterThan(initialCount);
    }).toPass({ timeout: 15000 });

    await expect(page.getByTestId('table-row').filter({ hasText: variables.name })).toBeVisible();
  });

  test('delete a variable; removed from list', async ({ page }) => {
    await page.goto(url);
    await expect(page.getByTestId('env-var-visibility-toggle')).toBeVisible();

    await page.getByTestId('env-var-visibility-toggle').click();
    await expect(page.getByTestId('table-header-value')).toBeVisible({ timeout: 10000 });

    const targetRow = page.getByTestId('table-row').filter({ hasText: variables.name });
    await expect(targetRow).toBeVisible();

    await targetRow.getByTestId('delete-variable').click();

    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Variable name').fill(variables.name);
    await dialog.getByRole('button', { name: 'Delete' }).click();

    await expect(targetRow).not.toBeVisible({ timeout: 15000 });
  });
});
