import { test, expect } from '@playwright/test';
import { env, loginUser } from '../../support/test-helpers';

test.describe('Environment navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_owner);
  });

  test('Overview/Deployments/Backups/Tasks/Vars/Problems/Facts/Insights', async ({ page }) => {
    const suffix = '/projects/lagoon-demo/lagoon-demo-main';
    await page.goto(`${env.url}${suffix}`);

    await page.locator('[data-cy="nav-env-deployments"]').click();
    await expect(page).toHaveURL(new RegExp(`${suffix}/deployments`));

    await page.locator('[data-cy="nav-backups"]').click();
    await expect(page).toHaveURL(new RegExp(`${suffix}/backups`));

    await page.locator('[data-cy="nav-tasks"]').click();
    await expect(page).toHaveURL(new RegExp(`${suffix}/tasks`));

    await page.locator('[data-cy="nav-problems"]').click();
    await expect(page).toHaveURL(new RegExp(`${suffix}/problems`));

    await page.locator('[data-cy="nav-insights"]').click();
    await expect(page).toHaveURL(new RegExp(`${suffix}/insights`));

    await page.locator('[data-cy="nav-env-variables"]').click();
    await expect(page).toHaveURL(new RegExp(`${suffix}/environment-variables`));

    await page.locator('[data-cy="nav-env-overview"]').click();
    await expect(page).toHaveURL(new RegExp(`${suffix}$`));
  });
});

