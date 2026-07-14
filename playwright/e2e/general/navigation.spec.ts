import { test, expect } from '@playwright/test';
import { env } from '../../support/test-helpers';

test.describe('Top-level sidebar navigation', () => {
  test.use({ storageState: 'playwright/.auth/platformowner.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${env.url}/projects`);
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  });

  test('navigates Projects → Organizations → Settings via sidebar', async ({ page }) => {
    await expect(async () => {
      await page.getByTestId('nav-organizations').click();
      await expect(page).toHaveURL(/\/organizations/);
    }).toPass({ timeout: 30_000 });
    await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

    await expect(async () => {
      await page.getByTestId('nav-settings').click();
      await expect(page).toHaveURL(/\/settings/);
    }).toPass({ timeout: 30_000 });
    await expect(page.getByRole('heading', { name: /SSH Keys|Settings/i })).toBeVisible();

    await expect(async () => {
      await page.getByTestId('nav-projects').first().click();
      await expect(page).toHaveURL(/\/projects/);
    }).toPass({ timeout: 30_000 });
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  });
});
