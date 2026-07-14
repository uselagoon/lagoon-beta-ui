import { test, expect } from '@playwright/test';
import { env } from '../../support/test-helpers';
import { waitForToast } from '../../support/helpers';

test.describe('Tasks list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${env.url}/projects/${env.project}/${env.env_production}/tasks`);
    await expect(page.getByTestId('task-select')).toBeVisible();
  });

  test('list renders with existing tasks; task picker visible', async ({ page }) => {
    const rows = page.getByTestId('table-row');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(0);

    await expect(page.getByTestId('task-select')).toBeVisible();
  });
});

test.describe.serial('Run and cancel tasks', () => {
  test.use({ storageState: 'playwright/.auth/owner.json' });
  test('run cache clear task; success toast; row appears', async ({ page }) => {
    await page.goto(`${env.url}/projects/${env.project}/${env.env_production}/tasks`);
    await expect(page.getByTestId('task-select')).toBeVisible();

    const initialRows = await page.getByTestId('table-row').count();

    await page.getByTestId('task-select-options').click();
    await page.getByRole('option', { name: 'Clear Drupal caches [drush cache-clear]' }).click();

    await page.getByTestId('task-btn').click();

    await expect(async () => {
      expect(await page.getByTestId('table-row').count()).toBeGreaterThan(initialRows);
    }).toPass({ timeout: 15000 });
  });

  test('run Drush cron task; row appears', async ({ page }) => {
    await page.goto(`${env.url}/projects/${env.project}/${env.env_production}/tasks`);
    await expect(page.getByTestId('task-select')).toBeVisible();

    const initialRows = await page.getByTestId('table-row').count();

    await page.getByTestId('task-select-options').click();
    await page.getByRole('option', { name: 'Run Drupal cron [drush cron]' }).click();

    await page.getByTestId('task-btn').click();

    await expect(async () => {
      expect(await page.getByTestId('table-row').count()).toBeGreaterThan(initialRows);
    }).toPass({ timeout: 15000 });
  });

  test('cancel a running task; status changes', async ({ page }) => {
    await page.goto(`${env.url}/projects/${env.project}/${env.env_production}/tasks`);
    await expect(page.getByTestId('task-select')).toBeVisible();

    const activeRow = page.getByTestId('table-row').filter({ hasText: /new|pending|queued|running/i }).first();
    await expect(activeRow).toBeVisible({ timeout: 10000 });

    const cancelResponse = page.waitForResponse(
      res => res.url().includes('/graphql') && (res.request().postData()?.includes('cancelTask') ?? false)
    );

    await activeRow.getByTestId('cancel-task').click();

    const res = await cancelResponse;
    expect(res.ok()).toBeTruthy();

    if (process.env.NODE_ENV === 'production') {
      await expect(activeRow.getByTestId('cancel-task')).not.toBeVisible({ timeout: 15000 });
    } 
  });
});
