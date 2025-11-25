import { test } from '@playwright/test';
import { testData } from '../../fixtures/variables';
import OverviewAction from '../../support/actions/organizations/OverviewAction';
import { env, loginUser, setupGraphQLInterception } from '../../support/test-helpers';

test.describe('Organization overview page', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_platformowner);
    await page.goto(`${env.url}/organizations/lagoon-demo-organization`);
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
  });

  test('Checks navigation links', async ({ page }) => {
    const overview = new OverviewAction(page);
    await overview.doNavLinkCheck();
  });

  test('Checks quota fields', async ({ page }) => {
    const overview = new OverviewAction(page);
    await overview.doQuotaFieldCheck();
  });

  test('Changes org friendly name/description', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const overview = new OverviewAction(page);
    await overview.changeOrgFriendlyname(testData.organizations.overview.friendlyName, page);
    await page.waitForLoadState('networkidle');
    await overview.changeOrgDescription(testData.organizations.overview.description, page);
  });
});

