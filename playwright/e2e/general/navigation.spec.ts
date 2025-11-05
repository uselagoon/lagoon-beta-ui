import { test, expect } from '@playwright/test';
import { env, loginUser } from '../../support/test-helpers';

test.describe('Navigation tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_owner);
    await page.goto(env.url);
  });

  test('Checks navigation to settings, organizations and projects pages', async ({ page }) => {
    await page.locator('[data-cy="user-name"]').hover();
    await page.locator('[data-cy="nav-settings"]').click();
    await expect(page).toHaveURL(/.*\/settings/);

    await page.locator('[data-cy="nav-organizations"]').click();
    await expect(page).toHaveURL(/.*\/organizations/);

    await page.locator('[data-cy="nav-projects"]').first().click();
    await expect(page).toHaveURL(/.*\/projects/);

    await page.waitForLoadState('networkidle');
    await page.locator('[data-cy="user-name"]').hover();
    const navAccount = page.locator('[data-cy="nav-account"]');
    await navAccount.evaluate((el: HTMLAnchorElement) => {
      el.removeAttribute('target');
    });
    await navAccount.click();

    const redirect = `${env.keycloak}/auth/realms/lagoon/account`;
    await expect(page).toHaveURL(redirect);
  });
});

