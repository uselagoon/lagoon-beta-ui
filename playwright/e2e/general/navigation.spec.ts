import { test, expect } from '@playwright/test';
import { env } from '../../support/test-helpers';

test.describe('Top-level sidebar navigation', () => {
  test.use({ storageState: 'playwright/.auth/platformowner.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${env.url}/projects`);
  });

  test('navigates Projects → Organizations → Settings via sidebar', async ({ page }) => {
    await page.getByTestId('nav-organizations').click();
    await page.waitForURL(/\/organizations/, { waitUntil: 'load' });
    await expect(page).toHaveURL(/\/organizations/);

    await page.getByTestId('nav-settings').click();
    await page.waitForURL(/\/settings/, { waitUntil: 'load' });
    await expect(page).toHaveURL(/\/settings/);

    await page.getByTestId('nav-projects').first().click();
    await page.waitForURL(/\/projects/, { waitUntil: 'load' });
    await expect(page).toHaveURL(/\/projects/);
  });
});
