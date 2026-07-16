import { test, expect } from '@playwright/test';
import { env } from '../../support/test-helpers';
import { SEED } from '../../fixtures/testData';

test.describe('Single deployment page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      `${env.url}/projects/${env.project}/${env.env_production}/deployments/${SEED.deploymentSlug}`
    );
  });

  test('log viewer visible; metadata displayed', async ({ page }) => {
    await expect(page.getByTestId('deployment-data')).toBeVisible();

    const logSection = page.locator('section.logs');
    await expect(logSection).toBeVisible();
  });

  test('log viewer toggle is present and clickable', async ({ page }) => {
    const toggle = page.getByTestId('logviewer-toggle');
    await expect(page.getByTestId('logviewer-toggle')).toBeVisible();

    await toggle.click();

    await expect(toggle).toBeVisible();
  });
});
