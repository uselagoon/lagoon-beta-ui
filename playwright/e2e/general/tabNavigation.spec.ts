import { test, expect } from '@playwright/test';
import { env } from '../../support/test-helpers';

test.describe('Environment sub-tab navigation', () => {
  const proj = env.project;
  const envName = env.env_production;
  const base = `/projects/${proj}/${envName}`;

  test.beforeEach(async ({ page }) => {
    await page.goto(`${env.url}${base}`);
    await expect(page.getByTestId('route-link').first()).toBeVisible();
  });

  test('each environment tab navigates to the correct URL and renders content', async ({ page }) => {
    await expect(async () => {
      await page.getByTestId('nav-deployments').click();
      await expect(page).toHaveURL(`${env.url}${base}/deployments`);
    }).toPass({ timeout: 30_000 });
    await expect(page.getByTestId('deploy-button')).toBeVisible();

    await expect(async () => {
      await page.getByTestId('nav-backups').click();
      await expect(page).toHaveURL(`${env.url}${base}/backups`);
    }).toPass({ timeout: 30_000 });
    await expect(page.getByTestId('table-row').first()).toBeVisible();

    await expect(async () => {
      await page.getByTestId('nav-tasks').click();
      await expect(page).toHaveURL(`${env.url}${base}/tasks`);
    }).toPass({ timeout: 30_000 });
    await expect(page.getByTestId('task-select')).toBeVisible();

    await expect(async () => {
      await page.getByTestId('nav-variables').and(page.locator('[href*="environment-variables"]')).click();
      await expect(page).toHaveURL(`${env.url}${base}/environment-variables`);
    }).toPass({ timeout: 30_000 });
    await expect(page.getByRole('heading', { name: 'Environment variables' })).toBeVisible();

    await expect(async () => {
      await page.getByTestId('nav-overview').click();
      await expect(page).toHaveURL(`${env.url}${base}`);
    }).toPass({ timeout: 30_000 });
    await expect(page.getByTestId('route-link').first()).toBeVisible();
  });
});
