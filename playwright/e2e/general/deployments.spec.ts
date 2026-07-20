import { test, expect } from '@playwright/test';
import { env } from '../../support/test-helpers';
import { waitForToast } from '../../support/helpers';

test.describe('Deployments list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${env.url}/projects/${env.project}/${env.env_production}/deployments`);
    await expect(page.getByTestId('deploy-button')).toBeVisible();
  });

  test('list renders; columns show status and timestamps', async ({ page }) => {
    const rows = page.getByTestId('table-row');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(0);

    await expect(page.getByTestId('table-header-status')).toBeVisible();
    await expect(page.getByTestId('table-header-name')).toBeVisible();
  });

  test('pagination updates URL params', async ({ page }) => {
    await page.getByTestId('results-per-page').click();
    await page.getByRole('option', { name: '20 results per page' }).click();
    await page.waitForURL(/results=20/);
    expect(page.url()).toContain('results=20');
  });
});

test.describe.serial('Deploy and cancel', () => {
  test.use({ storageState: 'playwright/.auth/owner.json' });
  let deployedRowName: string | null = null;

  test('trigger a new deployment; success toast; row appears', async ({ page }) => {
    await page.goto(`${env.url}/projects/${env.project}/${env.env_production}/deployments`);
    await expect(page.getByTestId('deploy-button')).toBeVisible();

    const initialRows = await page.getByTestId('table-row').count();

    await page.getByTestId('deploy-button').click();
    await waitForToast(page, /deployment triggered/i);

    await expect(async () => {
      expect(await page.getByTestId('table-row').count()).toBeGreaterThan(initialRows);
    }).toPass({ timeout: 15000 });

    const firstRow = page.getByTestId('table-row').first();
    deployedRowName = await firstRow.getByRole('cell').nth(1).textContent();
  });

  test('cancel a queued/running deployment; confirm dialog; status changes', async ({ page }) => {
    await page.goto(`${env.url}/projects/${env.project}/${env.env_production}/deployments`);
    await expect(page.getByTestId('deploy-button')).toBeVisible();

    const activeRow = page.getByTestId('table-row').filter({ hasText: /new|pending|queued|running/i }).first();
    await expect(activeRow).toBeVisible({ timeout: 10000 });

    await activeRow.getByTestId('cancel-deployment').click();

    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Yes' }).click();

    await expect(activeRow.getByTestId('cancel-deployment')).not.toBeVisible({ timeout: 15000 });
  });
});
