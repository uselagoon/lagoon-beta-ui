import { test, expect } from '@playwright/test';
import { env, loginUser } from '../../support/test-helpers';

test.describe('Org sidebar navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_platformowner);
  });

  test('Traverses sidebar nav from Groups -> Users -> Projects -> Notifications -> Manage', async ({ page }) => {
    await page.goto(`${env.url}/organizations/lagoon-demo-organization`);

    await page.locator('[data-cy="nav-groups"]').click();
    await expect(page).toHaveURL('/organizations/lagoon-demo-organization/groups');

    await page.locator('[data-cy="nav-users"]').click();
    await expect(page).toHaveURL('/organizations/lagoon-demo-organization/users');

    await page.locator('[data-cy="nav-org-projects"]').click();
    await expect(page).toHaveURL('/organizations/lagoon-demo-organization/projects');

    await page.locator('[data-cy="nav-notifications"]').click();
    await expect(page).toHaveURL('/organizations/lagoon-demo-organization/notifications');

    await page.locator('[data-cy="nav-manage"]').click();
    await expect(page).toHaveURL('/organizations/lagoon-demo-organization/manage');

    await page.locator('[data-cy="nav-org-overview"]').click();
    await expect(page).toHaveURL('/organizations/lagoon-demo-organization');
  });
});

