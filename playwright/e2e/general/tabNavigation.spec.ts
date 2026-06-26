import { test, expect } from '@playwright/test';
import { env } from '../../support/test-helpers';

test.describe('Environment sub-tab navigation', () => {
  const proj = env.project;
  const envName = env.env_production;
  const base = `/projects/${proj}/${envName}`;

  test.beforeEach(async ({ page }) => {
    await page.goto(`${env.url}${base}`);
    await page.waitForURL(new RegExp(base), { waitUntil: 'load' });
  });

  test('each environment tab navigates to the correct URL and renders content', async ({ page }) => {
    await page.getByTestId('nav-deployments').click();
    await page.waitForURL(new RegExp(`${base}/deployments`), { waitUntil: 'load' });
    await expect(page).toHaveURL(new RegExp(`${base}/deployments`));

    await page.getByTestId('nav-backups').click();
    await page.waitForURL(new RegExp(`${base}/backups`), { waitUntil: 'load' });
    await expect(page).toHaveURL(new RegExp(`${base}/backups`));

    await page.getByTestId('nav-tasks').click();
    await page.waitForURL(new RegExp(`${base}/tasks`), { waitUntil: 'load' });
    await expect(page).toHaveURL(new RegExp(`${base}/tasks`));

    await page.getByTestId('nav-variables').and(page.locator('[href*="environment-variables"]')).click();
    await page.waitForURL(new RegExp(`${base}/environment-variables`), { waitUntil: 'load' });
    await expect(page).toHaveURL(new RegExp(`${base}/environment-variables`));

    await page.getByTestId('nav-overview').click();
    await page.waitForURL(new RegExp(`${base}$`), { waitUntil: 'load' });
    await expect(page).toHaveURL(new RegExp(`${base}$`));
  });
});
