import { test, expect } from '@playwright/test';
import { env } from '../../support/test-helpers';

test.describe('Backups list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${env.url}/projects/${env.project}/${env.env_production}/backups`);
    await expect(page.getByTestId('table-row').first()).toBeVisible();
  });

  test('list renders; source, ID, date columns populated', async ({ page }) => {
    const rows = page.getByTestId('table-row');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(0);

    await expect(page.getByTestId('table-header-status')).toBeVisible();
    await expect(page.getByTestId('table-header-source')).toBeVisible();
    await expect(page.getByTestId('table-header-backupId')).toBeVisible();
    await expect(page.getByTestId('table-header-created')).toBeVisible();

    const firstRow = rows.first();
    const cells = firstRow.getByRole('cell');
    expect(await cells.count()).toBeGreaterThanOrEqual(4);

    const sourceCell = cells.nth(1);
    await expect(sourceCell).not.toBeEmpty();

    const backupIdCell = cells.nth(2);
    await expect(backupIdCell).not.toBeEmpty();

    const timestampCell = cells.nth(3);
    await expect(timestampCell).not.toBeEmpty();
  });
});

test.describe.serial('Retrieve backup', () => {
  test.use({ storageState: 'playwright/.auth/owner.json' });

  test('retrieve backup triggers restore; status updates', async ({ page }) => {
    await page.goto(`${env.url}/projects/${env.project}/${env.env_production}/backups`);
    await expect(page.getByTestId('table-row').first()).toBeVisible();

    const retrievableRow = page.getByTestId('table-row').filter({ hasText: /retrievable/i }).first();

    const hasRetrievable = await retrievableRow.isVisible().catch(() => false);

    if (!hasRetrievable) {
      test.skip(true, 'No retrievable backups available to test');
      return;
    }

    await expect(retrievableRow.getByTestId('retrieve')).toBeVisible();
    await retrievableRow.getByTestId('retrieve').click();

    await expect(async () => {
      const hasPendingOrSuccess = await retrievableRow.locator('text=/pending|successful/i').isVisible();
      const hasLoader = await retrievableRow.locator('.animate-spin').isVisible();
      expect(hasPendingOrSuccess || hasLoader).toBe(true);
    }).toPass({ timeout: 30000 });
  });
});
