import { test, expect } from '@playwright/test';
import { env } from '../../support/test-helpers';
import { ssh } from '../../fixtures/testData';

test.describe('SSH keys page', () => {
  test('SSH keys page renders', async ({ page }) => {
    await page.goto(`${env.url}/settings`);
    await expect(page.getByRole('heading', { name: 'SSH Keys' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add New Key' })).toBeVisible();
  });
});

test.describe.serial('Add and delete SSH key', () => {
  test.use({ storageState: 'playwright/.auth/owner.json' });

  test('add an SSH key; appears with name, type, fingerprint', async ({ page }) => {
    await page.goto(`${env.url}/settings`);
    await expect(page.getByRole('button', { name: 'Add New Key' })).toBeVisible();

    await page.getByRole('button', { name: 'Add New Key' }).click();

    const sheet = page.getByRole('dialog');
    await expect(sheet).toBeVisible();

    await sheet.getByLabel('Key Name').fill(ssh.name);
    await sheet.getByLabel('Key Value').fill(ssh.value);

    await sheet.getByRole('button', { name: 'Save' }).click();

    const newRow = page.getByTestId('table-row').filter({ hasText: ssh.name });
    await expect(newRow).toBeVisible({ timeout: 15000 });

    await expect(newRow.getByRole('cell').nth(1)).not.toBeEmpty();
    await expect(newRow.getByRole('cell').nth(2)).not.toBeEmpty();
  });

  test('delete an SSH key; removed from list', async ({ page }) => {
    await page.goto(`${env.url}/settings`);

    const targetRow = page.getByTestId('table-row').filter({ hasText: ssh.name });
    await expect(targetRow).toBeVisible();

    await targetRow.getByTestId('delete-key').click();

    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Confirm' }).click();

    await expect(targetRow).not.toBeVisible({ timeout: 15000 });
  });
});
