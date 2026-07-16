import { test, expect } from '@playwright/test';
import { env } from '../../support/test-helpers';

test.describe('Single task page', () => {
  test('status, service, log viewer visible', async ({ page }) => {
    await page.goto(`${env.url}/projects/${env.project}/${env.env_production}/tasks`);
    await expect(page.getByTestId('task-select')).toBeVisible();

    const completeTask = page.getByTestId('table-row').filter({ has: page.getByText('Complete', { exact: true }) }).first();
    await expect(completeTask).toBeVisible();

    await completeTask.getByTestId('task-link').click();
    await expect(page).toHaveURL(/\/tasks\/[^/]+$/);

    await expect(page.getByTestId('table-header-status')).toBeVisible();
    await expect(page.getByTestId('table-header-service')).toBeVisible();

    await expect(page.getByTestId('logviewer-toggle')).toBeVisible();
    await expect(page.getByTestId('processed-logs')).toBeVisible();
  });
});
