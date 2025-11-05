import { test } from '@playwright/test';

import { testData } from '../../fixtures/variables';
import ManageAction from '../../support/actions/organizations/ManageAction';
import { env, loginUser, setupGraphQLInterception } from '../../support/test-helpers';

test.describe('Org Manage page', () => {
  test.beforeEach(async ({ page }) => {
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
    await loginUser(page, env.user_platformowner);
    await page.goto(`${env.url}/organizations/lagoon-demo-organization/manage`);
  });

  test('Adds an org viewer', async ({ page }) => {
    const manage = new ManageAction(page);
    await manage.doAddOrgViewer(testData.organizations.manage.user, page);
  });

  test('Upgrade org viewer to admin', async ({ page }) => {
    const manage = new ManageAction(page);
    await manage.doEditOrgViewerToAdmin(testData.organizations.manage.user, page);
  });

  test('Upgrade org admin to owner', async ({ page }) => {
    const manage = new ManageAction(page);
    await manage.doEditOrgViewerToOwner(testData.organizations.manage.user, page);
  });

  test('Deletes user', async ({ page }) => {
    const manage = new ManageAction(page);
    await manage.doDeleteUser(testData.organizations.manage.user);
  });
});
