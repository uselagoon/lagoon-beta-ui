import { test, expect } from '@playwright/test';
import { env } from '../../support/test-helpers';

test.describe('Environment overview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${env.url}/projects/${env.project}/${env.env_production}`);
  });

  test('type, deploy type, routes, source link visible', async ({ page }) => {
    await expect(page.getByTestId('environment-type')).toBeVisible();
    await expect(page.getByTestId('environment-type')).not.toHaveText('');
    await expect(page.getByTestId('deployment-type')).toBeVisible();
    await expect(page.getByTestId('deployment-type')).not.toHaveText('');
    await expect(page.getByTestId('source')).toBeVisible();
  });

  test('route URLs rendered as clickable links', async ({ page }) => {
    const firstRoute = page.getByTestId('route-link').first();
    await expect(firstRoute).toBeVisible();
    await expect(firstRoute).toHaveAttribute('href', /^http/);
  });

  test('delete environment shows confirmation dialog (do NOT confirm)', async ({ page }) => {
    await page.getByTestId('delete-trigger').click();
    await expect(page.getByRole('alertdialog')).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
